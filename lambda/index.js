'use strict';

// API handler for api.human0.me
// Routes:
//   GET /health                -> 200
//   GET /human-stats           -> real stats (best-effort), fallback values
//   GET /api/human-stats       -> alias for /human-stats
//   GET /api/privacy           -> plain-text privacy policy placeholder
//   GET /api/terms             -> plain-text terms placeholder

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

const jsonResponse = (event, statusCode, body) => {
  const origins = getAllowedOrigins();
  const originHeader = allowOriginHeader(event, origins);
  return {
    statusCode,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
      'access-control-allow-origin': originHeader,
      'access-control-allow-methods': 'GET,OPTIONS',
      'access-control-allow-headers': 'Content-Type,Authorization',
    },
    body: JSON.stringify(body),
  };
};

const textResponse = (event, statusCode, body, extraHeaders = {}) => {
  const origins = getAllowedOrigins();
  const originHeader = allowOriginHeader(event, origins);
  return {
    statusCode,
    headers: {
      'content-type': 'text/plain; charset=utf-8',
      'cache-control': 'no-store',
      'access-control-allow-origin': originHeader,
      'access-control-allow-methods': 'GET,OPTIONS',
      'access-control-allow-headers': 'Content-Type,Authorization',
      ...extraHeaders,
    },
    body,
  };
};
const health = (event) =>
  jsonResponse(event, 200, {
    status: 'ok',
    timestamp: new Date().toISOString(),
  });

const humanStats = (event) => proxyToNextApi(event, '/api/human-stats');

const proxyToNextApi = async (event, apiPath) => {
  try {
    const baseUrl = 'https://human-0.com';
    const queryString = event.rawQueryString ? '?' + event.rawQueryString : '';
    const url = `${baseUrl}${apiPath}${queryString}`;
    
    const response = await fetch(url);
    const body = await response.text();
    
    const origins = getAllowedOrigins();
    const originHeader = allowOriginHeader(event, origins);
    
    return {
      statusCode: response.status,
      headers: {
        'content-type': response.headers.get('content-type') || 'text/plain; charset=utf-8',
        'cache-control': response.headers.get('cache-control') || 'no-store',
        'content-language': response.headers.get('content-language') || 'en',
        'access-control-allow-origin': originHeader,
        'access-control-allow-methods': 'GET,OPTIONS',
        'access-control-allow-headers': 'Content-Type,Authorization',
      },
      body,
    };
  } catch (error) {
    return textResponse(event, 502, 'Bad gateway');
  }
};

const privacy = (event) => proxyToNextApi(event, '/api/privacy');

const terms = (event) => proxyToNextApi(event, '/api/terms');

exports.handler = async (event) => {
  const method = event?.requestContext?.http?.method || event?.httpMethod || 'GET';
  const rawPath = event?.rawPath || event?.path || '/';
  const path = rawPath.toLowerCase();

  if (method === 'OPTIONS') {
    return jsonResponse(event, 200, { ok: true });
  }

  try {
    if (method === 'GET' && (path === '/health' || path === '/')) {
      return health(event);
    }

    if (method === 'GET' && (path === '/human-stats' || path === '/api/human-stats')) {
      return humanStats(event);
    }

    if (method === 'GET' && path === '/api/privacy') {
      return privacy(event);
    }

    if (method === 'GET' && path === '/api/terms') {
      return terms(event);
    }

    return jsonResponse(event, 404, { error: 'Not found', path });
  } catch (err) {
    console.error('Lambda error', err);
    return jsonResponse(event, 500, { error: 'Internal error' });
  }
};
