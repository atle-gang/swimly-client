import { getToken } from './authService';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * Fetches available lesson slots, optionally filtered by date and age group.
 * The response shape matches the MOCK_SLOTS structure in bookingData.js
 * so the booking page components need no changes when switching from mock to real data.
 *
 * @param {{ date?: string, ageGroup?: string }} filters
 * @returns {Promise<{ slots: object[] }>}
 */
export async function getLessons({ date, ageGroup } = {}) {
  const params = new URLSearchParams();
  if (date)     params.append('date',      date);
  if (ageGroup) params.append('age_group', ageGroup);

  const response = await fetch(
    `${BASE_URL}/swimly-api/lessons?${params}`,
    {
      headers: { Authorization: `Bearer ${getToken()}` },
    }
  );

  const json = await response.json();

  if (!response.ok) {
    throw new Error(json.message ?? 'Failed to fetch lessons');
  }

  return json;
}