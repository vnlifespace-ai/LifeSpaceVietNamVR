import { getAuthToken } from './auth';

const API_BASE_URL = (import.meta.env.VITE_API_URL || 'https://lifespacevr-backend.onrender.com/api').replace(/\/+$/, '');

/**
 * Get headers with authorization token (without Content-Type for FormData)
 */
function getAuthHeaders() {
  const token = getAuthToken();
  const headers = {};
  if (token && token !== 'true' && token !== 'authenticated') {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}


/**
 * Create a new VR Scene (POST /vrscene/)
 * Accepts multipart form-data: 'data' (JSON blob or string) + 'file' (Panorama file)
 * @param {Object} payload - { name, positionX, positionY, positionZ, idProject, file }
 */
export async function createVrScene({ name, positionX = 0.1, positionY = 0.1, positionZ = 0.1, idProject, file }) {
  try {
    if (!file) {
      throw new Error('Vui lòng chọn hình ảnh Panorama 360° (tệp file là bắt buộc)');
    }

    const formData = new FormData();

    const dataObj = {
      name,
      positionX: parseFloat(positionX) || 0.1,
      positionY: parseFloat(positionY) || 0.1,
      positionZ: parseFloat(positionZ) || 0.1,
      idProject,
    };

    // Append JSON string for 'data' parameter (Spring Boot expects String)
    formData.append('data', JSON.stringify(dataObj));

    // Append binary file
    formData.append('file', file);

    const response = await fetch(`${API_BASE_URL}/vrscene/`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: formData,
    });

    const resData = await response.json().catch(() => null);

    if (!response.ok) {
      throw new Error(
        resData?.message || `Không thể tạo VR Scene (${response.status}). Vui lòng kiểm tra dữ liệu đầu vào!`
      );
    }

    if (resData && resData.code !== undefined && resData.code >= 400) {
      throw new Error(resData.message || 'Tạo VR Scene thất bại');
    }

    return resData;
  } catch (error) {
    console.error('createVrScene API Error:', error);
    throw error;
  }
}