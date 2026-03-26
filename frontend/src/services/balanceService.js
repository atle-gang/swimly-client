import { getToken } from './authService';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * Fetches the authenticated user's current credit balance.
 * @returns {Promise<number>}
 */
export async function getBalance() {
  const response = await fetch(`${BASE_URL}/swimly-api/user/balance/data`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });

  const json = await response.json();

  if (!response.ok) {
    throw new Error(json.message ?? 'Failed to fetch balance');
  }

  return json.balance;
}

/**
 * Updates the authenticated user's balance by a delta amount.
 * Positive delta adds credits, negative delta deducts credits.
 * @param {number} delta
 * @returns {Promise<number>} updated balance
 */
export async function updateBalance(delta) {
  const response = await fetch(`${BASE_URL}/swimly-api/user/balance/update`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify({ delta }),
  });

  const json = await response.json();

  if (!response.ok) {
    throw new Error(json.message ?? 'Failed to update balance');
  }

  return json.balance;
}