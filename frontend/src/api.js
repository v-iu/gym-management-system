const API_BASE = '/api';

async function request(endpoint, options = {}) {
  const url = `${API_BASE}/${endpoint}`;

  const response = await fetch(url, options);
  const data = await response.json();

  if (!response.ok) {
    const error = new Error(data.error || 'Request failed');
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

// Convert an object to URLSearchParams (form-encoded)
function toFormData(obj) {
  const params = new URLSearchParams();
  if (!obj) return params;
  for (const [key, value] of Object.entries(obj)) {
    params.append(key, value);
  }
  return params;
}

export const api = {
  get: (endpoint) => request(endpoint, { method: 'GET' }),

  post: (endpoint, body) =>
    request(endpoint, {
      method: 'POST',

      // === CHANGE HERE ===
      // We need to send JSON for the backend store() method to read the data
      // Previously it was: body: toFormData(body), which sends form-encoded data
      headers: { 'Content-Type': 'application/json' }, 
      body: JSON.stringify(body),
    }),

  put: (endpoint, body) =>
    request(endpoint, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }),

  delete: (endpoint) => request(endpoint, { method: 'DELETE' }),
};

/*
Explanation of change:
- Your backend's getRequestBody() expects JSON, not form-encoded data.
- Without setting Content-Type to 'application/json' and stringifying the body,
  $data in PHP will be empty, causing validation to fail.
- This change ensures all POST/PUT requests send proper JSON payloads.
*/
