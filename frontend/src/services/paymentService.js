import { getToken } from './authService';
import { CREDIT_PACKS, SINGLE_LESSON } from '../pages/Pricing/pricingData';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * Records a single lesson payment and adds 1 credit to the user's balance.
 *
 * @returns {Promise<{ payment: object, credits_added: number }>}
 */
export async function purchaseSingleLesson() {
  return _createPayment({
    payment_type:  'SINGLE_LESSON',
    amount_rands:  SINGLE_LESSON.priceRands,
    credits_added: 1,
    description:   '30-min lesson — single booking',
  });
}

/**
 * Records a credit pack purchase and adds the pack's credits to the balance.
 *
 * @param {string} packId - id from CREDIT_PACKS e.g. "popular"
 * @returns {Promise<{ payment: object, credits_added: number }>}
 */
export async function purchaseCreditPack(packId) {
  const pack = CREDIT_PACKS.find((p) => p.id === packId);

  if (!pack) {
    throw new Error(`Unknown pack id: ${packId}`);
  }

  return _createPayment({
    payment_type:  'CREDIT_PACK',
    amount_rands:  pack.priceRands,
    credits_added: pack.lessonCount,
    description:   `${pack.name} — ${pack.lessonCount} lessons`,
  });
}

/**
 * Returns the authenticated user's payment history.
 *
 * @returns {Promise<{ payments: object[] }>}
 */
export async function getPayments() {
  const response = await fetch(`${BASE_URL}/swimly-api/payments`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });

  const json = await response.json();

  if (!response.ok) {
    throw new Error(json.message ?? 'Failed to fetch payments');
  }

  return json;
}

// ── Private ───────────────────────────────────────────────────────────────

async function _createPayment(payload) {
  const response = await fetch(`${BASE_URL}/swimly-api/payments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization:  `Bearer ${getToken()}`,
    },
    body: JSON.stringify(payload),
  });

  const json = await response.json();

  if (!response.ok) {
    throw new Error(json.message ?? 'Payment failed');
  }

  return json;
}