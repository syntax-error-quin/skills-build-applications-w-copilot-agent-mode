const getCodespaceName = () => import.meta.env.VITE_CODESPACE_NAME?.trim();

export const buildApiUrl = (resource) => {
  const codespaceName = getCodespaceName();
  if (codespaceName) {
    return `https://${codespaceName}-8000.app.github.dev/api/${resource}/`;
  }

  return `/api/${resource}/`;
};

export const fetchJson = async (url) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }
  return response.json();
};

export const normalizeCollection = (payload) => {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (payload && typeof payload === 'object') {
    if (Array.isArray(payload.results)) {
      return payload.results;
    }
    if (Array.isArray(payload.items)) {
      return payload.items;
    }
    if (payload.data && Array.isArray(payload.data)) {
      return payload.data;
    }
  }

  return [];
};
