const BASE_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * Registers a new user.
 * @param {{ name: string, surname: string, username: string, email: string, password: string }} data
 * @returns {Promise<{ authToken: string, userId: string, name: string, email: string }>}
 */
export async function register(data) {
  const response = await fetch(`${BASE_URL}/swimly-api/user/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  const json = await response.json();

  if (!response.ok) {
    throw new Error(json.message ?? 'Registration failed');
  }

  // Persist token immediately after registration
  saveToken(json.authToken);
  return json;
}

/**
 * Logs in an existing user.
 * @param {{ email: string, password: string }} data
 * @returns {Promise<{ authToken: string, userId: string, name: string, email: string }>}
 */
export async function login(data) {
  const response = await fetch(`${BASE_URL}/swimly-api/user/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  const json = await response.json();

  if (!response.ok) {
    throw new Error(json.message ?? 'Login failed');
  }

  saveToken(json.authToken);
  return json;
}

/**
 * Changes the authenticated user's password.
 * @param {{ currentPassword: string, newPassword: string }} data
 */
export async function changePassword(data) {
  const response = await fetch(`${BASE_URL}/swimly-api/user/change-password`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(data),
  });

  const json = await response.json();

  if (!response.ok) {
    throw new Error(json.message ?? 'Password change failed');
  }

  // Backend issues a new token after password change
  saveToken(json.authToken);
  return json;
}

/**
 * Deletes the authenticated user's account.
 */
export async function deleteAccount() {
  const response = await fetch(`${BASE_URL}/swimly-api/user/delete`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${getToken()}` },
  });

  if (!response.ok) {
    const json = await response.json();
    throw new Error(json.message ?? 'Account deletion failed');
  }

  clearToken();
}


const TOKEN_KEY = 'swimly_token';

export function saveToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export function isAuthenticated() {
  return !!getToken();
}