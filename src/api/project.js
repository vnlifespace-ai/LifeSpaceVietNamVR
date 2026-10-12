import { getAuthToken } from './auth';
import { getOrganizationProjects } from './organization';

const API_BASE_URL = (import.meta.env.VITE_API_URL).replace(/\/+$/, '');

/**
 * Get headers with optional authorization token
 */
function getHeaders() {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true',
  };
  if (token && token !== 'true' && token !== 'authenticated') {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

/**
 * Fetch list of projects scoped to an organization (via organization.js / OrganizationController),
 * or all accessible projects for current user (GET /projects via ProjectController).
 *
 * @param {string|null} organizationId
 */
export async function getProjects(organizationId = null) {
  try {
    if (organizationId) {
      // Delegate directly to organization.js endpoint (GET /organizations/{id}/projects)
      return await getOrganizationProjects(organizationId);
    }

    // When no organizationId is passed, fetch all accessible projects for current user (GET /projects)
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
 * Fetch projects by organization ID (via organization.js)
 * GET /api/organizations/{organizationId}/projects
 * @param {string} organizationId
 */
export async function getProjectsByOrganization(organizationId) {
  return getOrganizationProjects(organizationId);
}

/**
 * Create a new project (POST /projects)
 * @param {Object} data - { nameProject, organizationId? }
 */
export async function createProject({ nameProject, organizationId }) {
  try {
    const body = { nameProject };
    if (organizationId) body.organizationId = organizationId;

    const response = await fetch(`${API_BASE_URL}/projects`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(body),
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
    if (!idProject) {
      throw new Error('Mã dự án (idProject) không hợp lệ');
    }
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

/**
 * Delete a project by ID (DELETE /projects/id/{idProject})
 * @param {string} idProject 
 */
export async function deleteProject(idProject) {
  try {
    if (!idProject) {
      throw new Error('Mã dự án (idProject) không hợp lệ');
    }
    const response = await fetch(`${API_BASE_URL}/projects/id/${encodeURIComponent(idProject)}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });

    const resData = await response.json().catch(() => null);

    if (!response.ok) {
      throw new Error(
        resData?.message || `Không thể xóa dự án (${response.status})`
      );
    }

    if (resData && resData.code !== undefined && resData.code >= 400) {
      throw new Error(resData.message || 'Xóa dự án thất bại');
    }

    return resData;
  } catch (error) {
    console.error('deleteProject API Error:', error);
    throw error;
  }
}

/**
 * Update project's initial default VR Scene (PATCH /projects/id/{idProject})
 * @param {string} idProject 
 * @param {string} idVRScene 
 */
export async function setDefaultVrScene(idProject, idVRScene) {
  try {
    if (!idProject) {
      throw new Error('Mã dự án (idProject) không hợp lệ');
    }
    const response = await fetch(`${API_BASE_URL}/projects/id/${encodeURIComponent(idProject)}`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify({ idVRScene }),
    });

    const resData = await response.json().catch(() => null);

    if (!response.ok) {
      throw new Error(
        resData?.message || `Không thể cập nhật VR Scene mặc định (${response.status})`
      );
    }

    if (resData && resData.code !== undefined && resData.code >= 400) {
      throw new Error(resData.message || 'Cập nhật VR Scene mặc định thất bại');
    }

    return resData;
  } catch (error) {
    console.error('setDefaultVrScene API Error:', error);
    throw error;
  }
}

/**
 * Fetch list of scenes by project ID (GET /projects/id/{idProject}/vrscene)
 * @param {string} idProject 
 */
export async function getVRScenesByProjectId(idProject) {
  try {
    if (!idProject) {
      throw new Error('Mã dự án (idProject) không hợp lệ');
    }
    const response = await fetch(`${API_BASE_URL}/projects/id/${encodeURIComponent(idProject)}/vrscene`, {
      method: 'GET',
      headers: getHeaders(),
    });

    const resData = await response.json().catch(() => null);

    if (!response.ok) {
      throw new Error(
        resData?.message || `Không thể lấy danh sách VR Scene (${response.status})`
      );
    }

    if (resData && resData.code !== undefined && resData.code >= 400) {
      throw new Error(resData.message || 'Lấy danh sách VR Scene thất bại');
    }

    return resData;
  } catch (error) {
    console.error('getScenesByProjectId API Error:', error);
    throw error;
  }
}

/**
 * Fetch project details by slug (GET /projects/slug/{slug} with fallback GET /projects/id/{slug})
 * @param {string} slug 
 */
export async function getProjectBySlug(slug) {
  try {
    if (!slug) {
      throw new Error('Slug hoặc ID dự án không hợp lệ');
    }

    let response = await fetch(`${API_BASE_URL}/projects/slug/${encodeURIComponent(slug)}`, {
      method: 'GET',
      headers: getHeaders(),
    });

    let resData = await response.json().catch(() => null);

    if (!response.ok || (resData && resData.code >= 400)) {
      // Fallback: try GET /projects/id/{slug}
      const fallbackResponse = await fetch(`${API_BASE_URL}/projects/id/${encodeURIComponent(slug)}`, {
        method: 'GET',
        headers: getHeaders(),
      });
      const fallbackData = await fallbackResponse.json().catch(() => null);
      if (fallbackResponse.ok && fallbackData && (fallbackData.result || fallbackData.code === 200 || !fallbackData.code)) {
        return fallbackData;
      }
    }

    if (!response.ok) {
      throw new Error(
        resData?.message || `Không thể lấy thông tin dự án qua slug (${response.status})`
      );
    }

    return resData;
  } catch (error) {
    console.error('getProjectBySlug API Error:', error);
    throw error;
  }
}