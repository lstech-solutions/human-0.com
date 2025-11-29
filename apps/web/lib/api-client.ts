const absoluteUrlPattern = /^https?:\/\//i;

const defaultBase =
  process.env.EXPO_PUBLIC_API_BASE_URL ||
  (process.env.NODE_ENV === 'production' ? 'https://api.human0.me' : 'http://localhost:8081');

const buildUrl = (path: string) => {
  if (absoluteUrlPattern.test(path)) return path;
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${defaultBase}${normalizedPath}`;
};

async function request(
  path: string,
  init?: RequestInit & { parseJson?: boolean }
) {
  const { parseJson = false, ...rest } = init || {};
  const url = buildUrl(path);
  const response = await fetch(url, {
    ...rest,
    headers: {
      ...(rest.headers || {}),
    },
  });

  if (!response.ok) {
    const body = await response.text();
    const error = new Error(
      `Request failed ${response.status} ${response.statusText}: ${body}`
    );
    // @ts-expect-error attach diagnostics
    error.status = response.status;
    // @ts-expect-error attach diagnostics
    error.body = body;
    throw error;
  }

  if (parseJson) {
    return response.json();
  }

  return response;
}

export const apiClient = {
  request,
  getJson<T>(path: string, init?: RequestInit) {
    return request(path, { ...init, method: 'GET', parseJson: true }) as Promise<T>;
  },
  head(path: string, init?: RequestInit) {
    return request(path, { ...init, method: 'HEAD' });
  },
};
