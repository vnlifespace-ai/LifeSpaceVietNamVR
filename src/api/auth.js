const API_BASE_URL = (import.meta.env.VITE_API_URL || 'https://lifespacevrbackend-production.up.railway.app/api/').replace(/\/+$/, '');

/**
 * Get current auth token from localStorage
 */
export function getAuthToken() {
  return localStorage.getItem('access_token') || localStorage.getItem('auth_token') || '';
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated() {
  return localStorage.getItem('authenticated') === 'true' || !!getAuthToken();
}

/**
 * Logout user by clearing local storage tokens
 */
export function logoutUser() {
  localStorage.removeItem('access_token');
  localStorage.removeItem('auth_token');
  localStorage.removeItem('auth_user');
  localStorage.removeItem('authenticated');
}

/**
 * Register a new user
 * @param {Object} data - { name, email, password }
 */
export async function registerUser({ name, email, password }) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password }),
    });

    const resData = await response.json().catch(() => null);

    if (!response.ok) {
      throw new Error(
        resData?.message || `Đăng ký thất bại với mã lỗi (${response.status})`
      );
    }

    if (resData && resData.code !== undefined && resData.code >= 400) {
      throw new Error(resData.message || 'Đăng ký thất bại!');
    }

    return resData;
  } catch (error) {
    console.error('Register API Error:', error);
    throw error;
  }
}

/**
 * Login user
 * @param {Object} credentials - { email, password }
 */
export async function loginUser({ email, password }) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const resData = await response.json().catch(() => null);

    if (!response.ok) {
      throw new Error(
        resData?.message || `Đăng nhập thất bại với mã lỗi (${response.status})`
      );
    }

    // Handles response structure: { code: 200, result: { token: "", authenticated: true } }
    if (resData && resData.code !== undefined && resData.code >= 400) {
      throw new Error(resData.message || 'Đăng nhập thất bại!');
    }

    const result = resData?.result || {};
    const isAuthenticatedUser = result.authenticated !== undefined ? result.authenticated : true;
    const token = result.token || result.access_token || '';

    if (isAuthenticatedUser) {
      localStorage.setItem('authenticated', 'true');
      if (token) {
        localStorage.setItem('auth_token', token);
        localStorage.setItem('access_token', token);
      } else {
        localStorage.setItem('auth_token', 'authenticated');
        localStorage.setItem('access_token', 'authenticated');
      }

      if (result.user) {
        localStorage.setItem('auth_user', JSON.stringify(result.user));
      } else {
        localStorage.setItem('auth_user', JSON.stringify({ email }));
      }
    } else {
      throw new Error(resData?.message || 'Xác thực không thành công!');
    }

    return resData;
  } catch (error) {
    console.error('Login API Error:', error);
    throw error;
  }
}

