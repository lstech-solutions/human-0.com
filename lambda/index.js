'use strict';

// Proxy all API requests to the upstream Expo/Next server, with local fallbacks.
// Defaults to https://human-0.com unless UPSTREAM_BASE is set.

const UPSTREAM_BASE = process.env.UPSTREAM_BASE || 'https://human-0.com';
const DEFAULT_ORIGINS = ['*'];

const getAllowedOrigins = () => {
  const raw = process.env.CORS_ORIGINS;
  if (!raw) return DEFAULT_ORIGINS;
  return raw
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean);
};

const allowOriginHeader = (event, origins) => {
  const requestOrigin =
    event?.headers?.origin ||
    event?.headers?.Origin ||
    event?.headers?.ORIGIN ||
    '';
  if (!requestOrigin) return origins.includes('*') ? '*' : origins[0] || '*';
  return origins.includes('*') || origins.includes(requestOrigin)
    ? requestOrigin
    : origins[0] || '*';
};

const baseHeaders = (event, contentType, cacheControl = 'no-store') => {
  const origins = getAllowedOrigins();
  const originHeader = allowOriginHeader(event, origins);
  return {
    'content-type': contentType,
    'cache-control': cacheControl,
    'access-control-allow-origin': originHeader,
    'access-control-allow-methods': 'GET,HEAD,POST,PUT,PATCH,DELETE,OPTIONS',
    'access-control-allow-headers': 'Content-Type,Authorization',
  };
};

const jsonResponse = (event, statusCode, body) => ({
  statusCode,
  headers: baseHeaders(event, 'application/json; charset=utf-8'),
  body: JSON.stringify(body),
});

const headify = (method, res) => (method === 'HEAD' ? { ...res, body: '' } : res);

const health = (event) =>
  jsonResponse(event, 200, {
    status: 'ok',
    timestamp: new Date().toISOString(),
  });

const fetchHumanStats = async () => {
  const verifiedHumans = 1234;

  let totalHumans = 8_260_837_082;
  let netChangePerSecond = 2.5;
  let baselineYear = null;

  try {
    const worldBankBaseUrl = 'https://api.worldbank.org/v2/country/WLD/indicator';

    const [popRes, birthRes, deathRes] = await Promise.all([
      fetch(`${worldBankBaseUrl}/SP.POP.TOTL?format=json&per_page=1`),
      fetch(`${worldBankBaseUrl}/SP.DYN.CBRT.IN?format=json&per_page=1`),
      fetch(`${worldBankBaseUrl}/SP.DYN.CDRT.IN?format=json&per_page=1`),
    ]);

    const parseLatest = async (res) => {
      if (!res.ok) return null;
      const json = await res.json();
      const latest = Array.isArray(json) && Array.isArray(json[1]) ? json[1][0] : null;
      return latest;
    };

    const [popLatest, birthLatest, deathLatest] = await Promise.all([
      parseLatest(popRes),
      parseLatest(birthRes),
      parseLatest(deathRes),
    ]);

    if (popLatest && typeof popLatest.value === 'number') {
      totalHumans = popLatest.value;
      if (typeof popLatest.date === 'string') {
        const year = Number(popLatest.date);
        if (Number.isFinite(year)) baselineYear = year;
      }
    }

    const birthRatePerThousand =
      birthLatest && typeof birthLatest.value === 'number' ? birthLatest.value : null;
    const deathRatePerThousand =
      deathLatest && typeof deathLatest.value === 'number' ? deathLatest.value : null;

    if (birthRatePerThousand !== null && deathRatePerThousand !== null) {
      const secondsPerYear = 365.25 * 24 * 60 * 60;
      const birthsPerYear = (birthRatePerThousand / 1000) * totalHumans;
      const deathsPerYear = (deathRatePerThousand / 1000) * totalHumans;
      const netPerYear = birthsPerYear - deathsPerYear;
      netChangePerSecond = netPerYear / secondsPerYear;
    }
  } catch {
    // keep fallbacks
  }

  const baselineTimestamp = new Date().toISOString();

  const sources = [
    {
      name: 'World Bank - World Development Indicators',
      url: 'https://data.worldbank.org/indicator/SP.POP.TOTL?locations=1W',
      indicator: 'SP.POP.TOTL',
    },
    {
      name: 'World Bank - Crude birth rate (per 1,000 people)',
      url: 'https://data.worldbank.org/indicator/SP.DYN.CBRT.IN?locations=1W',
      indicator: 'SP.DYN.CBRT.IN',
    },
    {
      name: 'World Bank - Crude death rate (per 1,000 people)',
      url: 'https://data.worldbank.org/indicator/SP.DYN.CDRT.IN?locations=1W',
      indicator: 'SP.DYN.CDRT.IN',
    },
  ];

  return {
    verifiedHumans,
    totalHumans,
    baselinePopulation: totalHumans,
    baselineTimestamp,
    netChangePerSecond,
    baselineYear,
    sources,
  };
};

const filterHeaders = (headers) => {
  const out = {};
  headers.forEach((value, key) => {
    const lower = key.toLowerCase();
    if (lower === 'content-encoding' || lower === 'transfer-encoding') return;
    out[lower] = value;
  });
  return out;
};

const proxyToUpstream = async (event) => {
  const method = (event?.requestContext?.http?.method || event?.httpMethod || 'GET').toUpperCase();
  const rawPath = event?.rawPath || event?.path || '/';
  const queryString = event?.rawQueryString ? `?${event.rawQueryString}` : '';
  const url = `${UPSTREAM_BASE}${rawPath}${queryString}`;

  const headers = new Headers(event?.headers || {});
  headers.set('host', new URL(UPSTREAM_BASE).host);

  const init = {
    method,
    headers,
  };

  if (method !== 'GET' && method !== 'HEAD') {
    // API Gateway may encode body; handle both plain string and base64
    if (event.isBase64Encoded) {
      init.body = Buffer.from(event.body || '', 'base64');
    } else {
      init.body = typeof event.body === 'string' ? event.body : JSON.stringify(event.body || {});
    }
  }

  const response = await fetch(url, init);
  const body = method === 'HEAD' ? '' : await response.text();
  const upstreamHeaders = filterHeaders(response.headers);

  // Ensure CORS headers override upstream if missing
  const cors = baseHeaders(event, upstreamHeaders['content-type'] || 'application/json; charset=utf-8', upstreamHeaders['cache-control'] || 'no-store');

  return {
    statusCode: response.status,
    headers: { ...upstreamHeaders, ...cors },
    body,
    isBase64Encoded: false,
  };
};

const getLegalContent = async (type, locale = 'en') => {
  // Normalize locale (handle variants like es-CO, es-ES, etc.)
  const normalizedLocale = locale.split('-')[0]; // Get base locale (es from es-CO)
  
  try {
    // Try to fetch from the deployed site first
    let url;
    if (normalizedLocale === 'en') {
      // English - use root markdown files
      url = `${UPSTREAM_BASE}/docs/${type}.md`;
    } else {
      // Other languages - use proper Docusaurus i18n structure
      url = `${UPSTREAM_BASE}/docs/i18n/${normalizedLocale}/docusaurus-plugin-content-docs/current/${type}.md`;
    }
    
    const response = await fetch(url);
    if (response.ok) {
      return await response.text();
    }
  } catch (err) {
    console.log(`Failed to fetch ${type} for locale ${locale}, trying fallback`);
  }
  
  // Fallback to English
  try {
    const fallbackUrl = `${UPSTREAM_BASE}/docs/${type}.md`;
    const response = await fetch(fallbackUrl);
    if (response.ok) {
      return await response.text();
    }
  } catch (err) {
    console.log(`Failed to fetch English fallback for ${type}`);
  }
  
  // Final hardcoded fallback
  if (type === 'privacy') {
    return `# Privacy Policy

Last updated: November 28, 2025

## Introduction

HUMΛN-Ø ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and protect your information when you use our Web3 impact tracking platform.

## Information We Collect

### Personal Information
- Wallet addresses (public blockchain identifiers)
- Impact tracking data (anonymized where possible)
- User preferences and settings

### Automatically Collected Information
- Usage patterns and analytics
- Device information
- IP addresses (anonymized)

## How We Use Your Information

- To provide and maintain our impact tracking services
- To improve user experience and platform functionality
- To ensure security and prevent fraudulent activities
- To comply with legal obligations

## Data Protection

- All blockchain transactions are publicly verifiable
- Personal data is encrypted and stored securely
- We implement industry-standard security measures
- Regular security audits and updates

## Your Rights

- Access to your personal data
- Correction of inaccurate information
- Data deletion where legally required
- Opt-out of non-essential data collection

## International Data Transfers

As a decentralized platform, data may be processed across multiple jurisdictions. We ensure appropriate safeguards are in place for international data transfers.

## Children's Privacy

Our services are not intended for children under 13. We do not knowingly collect personal information from children.

## Changes to This Policy

We may update this Privacy Policy periodically. Changes will be posted on this page with a revised date.

## Contact Us

For privacy-related inquiries, please contact us through our official channels or via our decentralized governance mechanisms.

---

This Privacy Policy is governed by the laws of the jurisdiction where our services are accessed, without regard to conflict of law principles.`;
  } else {
    return `# Terms of Service

Last updated: November 28, 2025

## Agreement

By accessing and using HUMΛN-Ø ("the Service"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, please do not use our Service.

## Description of Service

HUMΛN-Ø is a Web3 platform that enables:
- Impact tracking and verification
- Blockchain-based proof generation
- Sustainable development monitoring
- Decentralized data management

## User Responsibilities

### Account Security
- Secure your wallet and private keys
- Report suspicious activities immediately
- Maintain accurate information

### Acceptable Use
- Use the Service for legitimate impact tracking
- Do not attempt to manipulate or falsify data
- Respect other users and the platform's integrity

### Prohibited Activities
- Fraudulent impact claims
- Spam or malicious activities
- Violation of applicable laws
- Interference with platform functionality

## Intellectual Property

### Our Rights
- Platform code and design are our intellectual property
- We license certain components under open source agreements
- Trademarks and branding remain our property

### User Content
- You retain rights to your impact data
- You grant us license to operate and improve the Service
- Blockchain transactions are publicly visible

## Privacy and Data

Your privacy is important to us. Please review our Privacy Policy, which is incorporated into these Terms by reference.

## Service Availability

### No Warranty
- The Service is provided "as is"
- We do not guarantee uninterrupted availability
- Blockchain networks may experience delays or congestion

### Limitation of Liability
- Our liability is limited to the maximum extent permitted by law
- We are not responsible for third-party blockchain behavior
- User assumes risks associated with Web3 technologies

## Dispute Resolution

### Governing Law
These Terms are governed by the laws of the jurisdiction where the Service is accessed.

### Dispute Resolution Process
1. Contact our support team
2. Attempt informal resolution
3. Consider arbitration or alternative dispute resolution
4. Legal action as last resort

## Smart Contract Interactions

### Code is Law
- Smart contract terms are automatically enforced
- Blockchain transactions are irreversible
- Users are responsible for understanding contract terms

### Risk Acknowledgment
- Smart contracts may have vulnerabilities
- Test transactions before mainnet usage
- Understand gas fees and network costs

## Modifications to Terms

We may modify these Terms periodically. Changes will be posted on this page with a revised date. Continued use of the Service constitutes acceptance of modified Terms.

## Termination

We may terminate access to the Service for:
- Violation of these Terms
- Suspicious or fraudulent activities
- Extended periods of inactivity
- Legal or regulatory requirements

## Severability

If any provision of these Terms is found to be unenforceable, the remaining provisions will continue in full force and effect.

## Contact Information

For questions about these Terms, please contact us through our official channels.

---

**Important Notice:** Cryptocurrency and blockchain technologies involve significant risks. Please ensure you understand these risks before using our Service.`;
  }
};

exports.handler = async (event) => {
  const method = (event?.requestContext?.http?.method || event?.httpMethod || 'GET').toUpperCase();
  const rawPath = event?.rawPath || event?.path || '/';
  const path = rawPath.toLowerCase();

  if (method === 'OPTIONS') {
    return jsonResponse(event, 200, { ok: true });
  }

  try {
    if ((method === 'GET' || method === 'HEAD') && (path === '/health' || path === '/')) {
      return headify(method, health(event));
    }

    if (
      (method === 'GET' || method === 'HEAD') &&
      (path === '/human-stats' || path === '/api/human-stats')
    ) {
      const payload = await fetchHumanStats();
      return headify(method, jsonResponse(event, 200, payload));
    }

    // Privacy and Terms API endpoints
    if ((method === 'GET' || method === 'HEAD') && (path === '/api/privacy' || path === '/privacy')) {
      const locale = event?.queryStringParameters?.locale || 'en';
      const content = await getLegalContent('privacy', locale);
      return headify(method, {
        statusCode: 200,
        headers: baseHeaders(event, 'text/plain; charset=utf-8', 'public, max-age=3600'),
        body: content,
      });
    }

    if ((method === 'GET' || method === 'HEAD') && (path === '/api/terms' || path === '/terms')) {
      const locale = event?.queryStringParameters?.locale || 'en';
      const content = await getLegalContent('terms', locale);
      return headify(method, {
        statusCode: 200,
        headers: baseHeaders(event, 'text/plain; charset=utf-8', 'public, max-age=3600'),
        body: content,
      });
    }

    return await proxyToUpstream(event);
  } catch (err) {
    console.error('Lambda proxy error', err);
    return jsonResponse(event, 502, { error: 'Bad gateway' });
  }
};
