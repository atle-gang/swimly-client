import { getToken } from './authService';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * Builds and submits a transaction from intake form data + booking selection.
 *
 * The backend stores everything in one Transaction record — children names,
 * health concerns, nap times, payment type, lesson date and time.
 *
 * @param {object} intakeData   - validated data from IntakeFormPage
 * @param {object} bookingData  - selected slot from BookingPage
 * @param {object} paymentData  - payment type and amount details
 * @returns {Promise<{ message: string }>}
 */
export async function createTransaction(intakeData, bookingData, paymentData) {
  // Shape the children_names array the backend expects
  const children_names = [
    {
      name: intakeData.childName,
      // Convert DOB to age in months for the backend
      age: intakeData.ageMonths,
    },
  ];

  // Shape health concerns — null if no flags were selected
  const health_concerns =
    intakeData.medicalFlags.length > 0
      ? intakeData.medicalFlags.map((flag) => ({
          name: intakeData.childName,
          concern: flag,
        }))
      : null;

  const payload = {
    children_names,
    health_concerns,
    payment_type:  paymentData.type,           // e.g. "single" | "pack"
    lesson_date:   bookingData.date,            // ISO date string
    lesson_time:   bookingData.time,            // e.g. "11:00"
    nap_times:     intakeData.napTimes.map(     // ["09:00-10:30", "13:00-15:00"]
      (n) => `${n.start}-${n.end}`
    ),
    point_amount:  paymentData.pointAmount  ?? null,
    money_amount:  paymentData.moneyAmount  ?? null,
  };

  const response = await fetch(`${BASE_URL}/swimly-api/user/transactions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(payload),
  });

  const json = await response.json();

  if (!response.ok) {
    throw new Error(json.message ?? 'Failed to create transaction');
  }

  return json;
}

/**
 * Fetches the authenticated user's transaction history with pagination.
 * @param {{ page?: number, limit?: number }} options
 * @returns {Promise<object[]>}
 */
export async function getTransactions({ page = 1, limit = 10 } = {}) {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  const response = await fetch(
    `${BASE_URL}/swimly-api/user/transactions/data?${params}`,
    {
      headers: { Authorization: `Bearer ${getToken()}` },
    }
  );

  const json = await response.json();

  if (!response.ok) {
    throw new Error(json.message ?? 'Failed to fetch transactions');
  }

  return json;
}