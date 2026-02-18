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
      body: toFormData(body),
      // Content-Type is auto-set to application/x-www-form-urlencoded
    }),

  put: (endpoint, body) =>
    request(endpoint, {
      method: 'PUT',
      body: toFormData(body),
    }),

  delete: (endpoint) => request(endpoint, { method: 'DELETE' }),
};

// Usage examples:
// import { api } from './api';
//
// Register a member:
//   api.post('members/register', { first_name: 'John', last_name: 'Doe', ... })
//
// Register a guest:
//   api.post('guests/register', { first_name: 'Jane', last_name: 'Doe', ... })
//
// Check in:
//   api.post('attendances/checkInOut', { email: 'john@example.com', action: 'checkin' })

