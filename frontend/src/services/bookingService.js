import { getToken } from './authService';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * Books a lesson for a child.
 * The backend enforces the Rule of 4 — returns 409 if the lesson is full.
 *
 * @param {{ childId: string, lessonId: string }} params
 * @returns {Promise<{ booking: object }>}
 */
export async function createBooking({ childId, lessonId }) {
  const response = await fetch(`${BASE_URL}/swimly-api/bookings`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization:  `Bearer ${getToken()}`,
    },
    body: JSON.stringify({
      child_id:  childId,
      lesson_id: lessonId,
    }),
  });

  const json = await response.json();

  if (response.status === 409) {
    throw new Error('This lesson is fully booked');
  }

  if (!response.ok) {
    throw new Error(json.message ?? 'Failed to create booking');
  }

  return json;
}

/**
 * Returns all bookings for the authenticated user.
 *
 * @returns {Promise<{ bookings: object[] }>}
 */
export async function getBookings() {
  const response = await fetch(`${BASE_URL}/swimly-api/bookings`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });

  const json = await response.json();

  if (!response.ok) {
    throw new Error(json.message ?? 'Failed to fetch bookings');
  }

  return json;
}

/**
 * Cancels a booking and refunds 1 credit to the user's balance.
 *
 * @param {string} bookingId
 * @returns {Promise<{ message: string }>}
 */
export async function cancelBooking(bookingId) {
  const response = await fetch(`${BASE_URL}/swimly-api/bookings/${bookingId}`, {
    method:  'DELETE',
    headers: { Authorization: `Bearer ${getToken()}` },
  });

  const json = await response.json();

  if (!response.ok) {
    throw new Error(json.message ?? 'Failed to cancel booking');
  }

  return json;
}