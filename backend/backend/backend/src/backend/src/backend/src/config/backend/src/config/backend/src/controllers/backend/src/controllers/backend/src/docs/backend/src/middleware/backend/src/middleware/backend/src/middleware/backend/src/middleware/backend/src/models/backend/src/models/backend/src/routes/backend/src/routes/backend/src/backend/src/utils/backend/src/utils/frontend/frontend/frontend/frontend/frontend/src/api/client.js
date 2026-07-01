const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

export async function api(path, { token, method = 'GET', body } = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (response.status === 204) return null;
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Request failed');
  return data;
}
