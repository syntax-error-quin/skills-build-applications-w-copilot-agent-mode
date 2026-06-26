const getCodespaceName = () => import.meta.env.VITE_CODESPACE_NAME?.trim();

const toResourcePath = (resource) => String(resource || '').trim().replace(/^\/+|\/+$/g, '');

export const buildApiUrl = (resource) => {
  const codespaceName = getCodespaceName();
  const normalizedResource = toResourcePath(resource);

  if (codespaceName) {
    return `https://${codespaceName}-8000.app.github.dev/api/${normalizedResource}/`;
  }

  return `/api/${normalizedResource}/`;
};

export const fetchJson = async (url) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }
  return response.json();
};

const extractArray = (value) => {
  if (Array.isArray(value)) {
    return value;
  }

  if (value && typeof value === 'object') {
    if (Array.isArray(value.results)) {
      return value.results;
    }
    if (Array.isArray(value.items)) {
      return value.items;
    }
    if (Array.isArray(value.data)) {
      return value.data;
    }
    if (value.data && typeof value.data === 'object') {
      return extractArray(value.data);
    }
  }

  return null;
};

export const normalizeCollection = (payload) => {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (payload && typeof payload === 'object') {
    return extractArray(payload) || [];
  }

  return [];
};
