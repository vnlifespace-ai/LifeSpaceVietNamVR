const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8080/api').replace(/\/+$/, '');

/**
 * Decode JWT token payload
 * @param {string} token
 */
export function parseJwt(token) {
  if (!token || typeof token !== 'string') return null;
  try {
    const parts = token.split('.');
    if (parts.length < 2) return null;
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

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
 * Check if current user has owner role (ower = true)
 * Checks: user object, stored auth_user, and JWT payload claims
 */
export function isUserOwner(user) {
  const token = getAuthToken();
  const decoded = parseJwt(token) || {};

  let storedUser = null;
  try {
    const stored = localStorage.getItem('auth_user');
    if (stored) storedUser = JSON.parse(stored);
  } catch {}

  const currentUser = { ...storedUser, ...user };

  // Check both owner (correct spelling) and ower in user object or decoded JWT token
  if (currentUser?.owner === true) return true;
  if (decoded?.owner === true) return true;

  const scopeStr = String(decoded?.scope || decoded?.role || decoded?.roles || decoded?.authorities || decoded?.auth || '').toUpperCase();
  if (scopeStr.includes('OWNER') || scopeStr.includes('ADMIN')) return true;

  return false;
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
    const decoded = parseJwt(token) || {};

    if (isAuthenticatedUser) {
      localStorage.setItem('authenticated', 'true');
      if (token) {
        localStorage.setItem('auth_token', token);
        localStorage.setItem('access_token', token);
      } else {
        localStorage.setItem('auth_token', 'authenticated');
        localStorage.setItem('access_token', 'authenticated');
      }

      const userObj = result.user
        ? { ...decoded, ...result.user }
        : { email, ...result, ...decoded };

      localStorage.setItem('auth_user', JSON.stringify(userObj));
    } else {
      throw new Error(resData?.message || 'Xác thực không thành công!');
    }

    return resData;
  } catch (error) {
    console.error('Login API Error:', error);
    throw error;
  }
}
