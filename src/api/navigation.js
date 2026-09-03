import { getAuthToken } from './auth';

const API_BASE_URL = (import.meta.env.VITE_API_URL).replace(/\/+$/, '');

/**
 * Get auth headers for API requests
 */
function getAuthHeaders() {
  const token = getAuthToken();
  const headers = {
    'ngrok-skip-browser-warning': 'true',
  };
  if (token && token !== 'true' && token !== 'authenticated') {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

/**
 * Fetch all navigation action hotspots for a specific VR Scene (GET /navigation/{idSourceVRScene})
 * @param {string} idSourceVRScene 
 */
export async function getNavigationsBySourceScene(idSourceVRScene) {
  try {
    if (!idSourceVRScene) return { result: [] };

    const response = await fetch(`${API_BASE_URL}/navigation/${encodeURIComponent(idSourceVRScene)}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    const resData = await response.json().catch(() => null);

    if (!response.ok) {
      throw new Error(
        resData?.message || `Không thể tải danh sách Navigation Actions (${response.status})`
      );
    }

    if (resData && resData.code !== undefined && resData.code >= 400) {
      throw new Error(resData.message || 'Tải Navigation Actions thất bại');
    }

    return resData;
  } catch (error) {
    console.error('getNavigationsBySourceScene API Error:', error);
    throw error;
  }
}

/**
 * Create or save navigation action hotspots (POST /navigation)
 * Accepts an array of navigation objects: [{ name, icon, positionX, positionY, positionZ, idSourceScene, idTargetScene }]
 * @param {Array<Object>} navigationsArray 
 */
export async function createNavigations(navigationsArray) {
  try {
    if (!Array.isArray(navigationsArray) || navigationsArray.length === 0) {
      return { result: [] };
    }

    const payload = navigationsArray.map((nav) => ({
      name: nav.name || 'Action',
      icon: nav.icon || 'arrow',
      positionX: parseFloat(nav.positionX) || 0.1,
      positionY: parseFloat(nav.positionY) || 0.1,
      positionZ: parseFloat(nav.positionZ) || 0.1,
      idSourceScene: nav.idSourceScene,
      idTargetScene: nav.idTargetScene,
    }));

    const response = await fetch(`${API_BASE_URL}/navigation`, {
      method: 'POST',
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const resData = await response.json().catch(() => null);

    if (!response.ok) {
      throw new Error(
        resData?.message || `Không thể lưu Navigation Actions (${response.status})`
      );
    }

    if (resData && resData.code !== undefined && resData.code >= 400) {
      throw new Error(resData.message || 'Lưu Navigation Actions thất bại');
    }

    return resData;
  } catch (error) {
    console.error('createNavigations API Error:', error);
    throw error;
  }
}

/**
 * Delete a navigation action hotspot by ID (DELETE /navigation/{id})
 * @param {string} id 
 */
export async function deleteNavigation(id) {
  try {
    if (!id) {
      throw new Error('ID navigation không hợp lệ');
    }

    const response = await fetch(`${API_BASE_URL}/navigation/${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    const resData = await response.json().catch(() => null);

    if (!response.ok) {
      throw new Error(
        resData?.message || `Không thể xóa Navigation Action (${response.status})`
      );
    }

    if (resData && resData.code !== undefined && resData.code >= 400) {
      throw new Error(resData.message || 'Xóa Navigation Action thất bại');
    }

    return resData;
  } catch (error) {
    console.error('deleteNavigation API Error:', error);
    throw error;
  }
}
