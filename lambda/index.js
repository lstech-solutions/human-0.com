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

const filterHeaders = (headers) => {
  const out = {};
  headers.forEach((value, key) => {
    const lower = key.toLowerCase();
    if (lower === 'content-encoding' || lower === 'transfer-encoding') return;
    out[key] = value;
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

    return await proxyToUpstream(event);
  } catch (err) {
    console.error('Lambda proxy error', err);
    return jsonResponse(event, 502, { error: 'Bad gateway' });
  }
};
