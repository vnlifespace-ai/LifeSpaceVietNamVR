const API_BASE_URL = (import.meta.env.VITE_API_URL).replace(/\/+$/, '');

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
 * Check if current user has owner role (owner = true)
 */
export function isUserOwner(user) {
  let storedUser = null;
  try {
    const stored = localStorage.getItem('auth_user');
    if (stored) storedUser = JSON.parse(stored);
  } catch { }

  const token = getAuthToken();
  const decoded = parseJwt(token) || {};

  const currentUser = { ...storedUser, ...user };

  return Boolean(
    currentUser?.owner === true ||
    currentUser?.ower === true ||
    decoded?.owner === true ||
    decoded?.ower === true
  );
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
        'ngrok-skip-browser-warning': 'true',
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
        'ngrok-skip-browser-warning': 'true',
      },
      body: JSON.stringify({ email, password }),
    });

    const resData = await response.json().catch(() => null);

    if (!response.ok) {
      throw new Error(
        resData?.message || `Đăng nhập thất bại với mã lỗi (${response.status})`
      );
    }

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

      let userObj = result.user
        ? { ...decoded, ...result.user }
        : { email, ...result, ...decoded };

      // Lấy danh sách users ngay khi đăng nhập để lưu trường owner & thông tin profile vào auth_user
      try {
        const usersResponse = await fetch(`${API_BASE_URL}/users`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
        const usersData = await usersResponse.json().catch(() => null);
        if (usersData && usersData.result) {
          const list = Array.isArray(usersData.result) ? usersData.result : [usersData.result];
          const matched = list.find(
            (u) => u.email && email && u.email.toLowerCase() === email.toLowerCase()
          );
          if (matched) {
            const isOwnerVal = Boolean(matched.owner !== undefined ? matched.owner : matched.ower);
            userObj = {
              ...userObj,
              ...matched,
              owner: isOwnerVal,
            };
          }
        }
      } catch (err) {
        console.warn('Error fetching user profile during login:', err);
      }

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
