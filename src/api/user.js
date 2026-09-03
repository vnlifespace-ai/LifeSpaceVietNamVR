import { getAuthToken } from './auth';

const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8080/api').replace(/\/+$/, '');

/**
 * Fetch list of all users (Requires owner/admin token)
 * GET /users
 */
export async function getUsers() {
  try {
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'ngrok-skip-browser-warning': 'true',
      },
    });

    const resData = await response.json().catch(() => null);

    if (!response.ok) {
      throw new Error(
        resData?.message || `Không thể lấy danh sách người dùng (${response.status})`
      );
    }

    if (resData && resData.code !== undefined && resData.code >= 400) {
      throw new Error(resData.message || 'Lấy danh sách người dùng thất bại!');
    }

    return resData;
  } catch (error) {
    console.error('getUsers API Error:', error);
    throw error;
  }
}

/**
 * Create a new user (Requires owner/admin token)
 * POST /users
 * @param {Object} data - { name, email, password }
 */
export async function createUser({ name, email, password }) {
  try {
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'ngrok-skip-browser-warning': 'true',
      },
      body: JSON.stringify({ name, email, password }),
    });

    const resData = await response.json().catch(() => null);

    if (!response.ok) {
      throw new Error(
        resData?.message || `Tạo người dùng thất bại (${response.status})`
      );
    }

    if (resData && resData.code !== undefined && resData.code >= 400) {
      throw new Error(resData.message || 'Tạo người dùng thất bại!');
    }

    return resData;
  } catch (error) {
    console.error('createUser API Error:', error);
    throw error;
  }
}
