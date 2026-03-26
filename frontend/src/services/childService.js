import { getToken } from './authService';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * Creates a child profile from the validated intake form data.
 * The payload matches the Zod schema output exactly — no reshaping needed.
 *
 * @param {object} intakeData - validated output from intakeSchema
 * @returns {Promise<{ child: object }>}
 */
export async function createChild(intakeData) {
  const response = await fetch(`${BASE_URL}/swimly-api/children`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization:  `Bearer ${getToken()}`,
    },
    body: JSON.stringify({
      childName:       intakeData.childName,
      dateOfBirth:     intakeData.dateOfBirth,
      experienceLevel: intakeData.experienceLevel,
      medicalFlags:    intakeData.medicalFlags,
      additionalNotes: intakeData.additionalNotes ?? null,
      napTimes:        intakeData.napTimes,
    }),
  });

  const json = await response.json();

  if (!response.ok) {
    throw new Error(json.message ?? 'Failed to create child profile');
  }

  return json;
}

/**
 * Returns all child profiles for the authenticated user.
 * Used to populate the child selector on the booking page.
 *
 * @returns {Promise<{ children: object[] }>}
 */
export async function getChildren() {
  const response = await fetch(`${BASE_URL}/swimly-api/children`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });

  const json = await response.json();

  if (!response.ok) {
    throw new Error(json.message ?? 'Failed to fetch children');
  }

  return json;
}

/**
 * Returns a single child profile by ID.
 *
 * @param {string} childId
 * @returns {Promise<{ child: object }>}
 */
export async function getChild(childId) {
  const response = await fetch(`${BASE_URL}/swimly-api/children/${childId}`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });

  const json = await response.json();

  if (!response.ok) {
    throw new Error(json.message ?? 'Failed to fetch child');
  }

  return json;
}