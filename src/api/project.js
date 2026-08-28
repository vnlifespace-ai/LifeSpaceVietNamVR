import { getAuthToken } from './auth';

const API_BASE_URL = (import.meta.env.VITE_API_URL || 'https://lifespacevrbackend-production.up.railway.app/api/').replace(/\/+$/, '');

/**
 * Get headers with optional authorization token
 */
function getHeaders() {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
  };
  if (token && token !== 'true' && token !== 'authenticated') {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

/**
 * Fetch list of projects (GET /projects)
 */
export async function getProjects() {
  try {
    const response = await fetch(`${API_BASE_URL}/projects`, {
      method: 'GET',
      headers: getHeaders(),
    });

    const resData = await response.json().catch(() => null);

    if (!response.ok) {
      throw new Error(
        resData?.message || `Không thể lấy danh sách dự án (${response.status})`
      );
    }

    if (resData && resData.code !== undefined && resData.code >= 400) {
      throw new Error(resData.message || 'Lấy danh sách dự án thất bại');
    }

    return resData;
  } catch (error) {
    console.error('getProjects API Error:', error);
    throw error;
  }
}

/**
 * Create a new project (POST /projects)
 * @param {Object} data - { nameProject }
 */
export async function createProject({ nameProject }) {
  try {
    const response = await fetch(`${API_BASE_URL}/projects`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ nameProject }),
    });

    const resData = await response.json().catch(() => null);

    if (!response.ok) {
      throw new Error(
        resData?.message || `Không thể tạo dự án (${response.status})`
      );
    }

    if (resData && resData.code !== undefined && resData.code >= 400) {
      throw new Error(resData.message || 'Tạo dự án thất bại');
    }

    return resData;
  } catch (error) {
    console.error('createProject API Error:', error);
    throw error;
  }
}

/**
 * Get project details by ID (GET /projects/id/{idProject})
 * @param {string} idProject 
 */
export async function getProjectById(idProject) {
  try {
    const response = await fetch(`${API_BASE_URL}/projects/id/${encodeURIComponent(idProject)}`, {
      method: 'GET',
      headers: getHeaders(),
    });

    const resData = await response.json().catch(() => null);

    if (!response.ok) {
      throw new Error(
        resData?.message || `Không thể lấy chi tiết dự án (${response.status})`
      );
    }

    if (resData && resData.code !== undefined && resData.code >= 400) {
      throw new Error(resData.message || 'Lấy chi tiết dự án thất bại');
    }

    return resData;
  } catch (error) {
    console.error('getProjectById API Error:', error);
    throw error;
  }
}
