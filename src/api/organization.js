import { getAuthToken } from './auth';

const API_BASE_URL = (import.meta.env.VITE_API_URL).replace(/\/+$/, '');

/**
 * Get headers with Bearer token
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

// ─── ORGANIZATION APIs ────────────────────────────────────────────────────────

/**
 * Lấy danh sách tổ chức mà user là Owner hoặc Member
 * GET /api/organizations/my
 */
export async function getMyOrganizations() {
  try {
    const response = await fetch(`${API_BASE_URL}/organizations/my`, {
      method: 'GET',
      headers: getHeaders(),
    });
    const resData = await response.json().catch(() => null);
    if (!response.ok) {
      throw new Error(resData?.message || `Không thể lấy danh sách tổ chức (${response.status})`);
    }
    if (resData && resData.code !== undefined && resData.code >= 400) {
      throw new Error(resData.message || 'Lấy danh sách tổ chức thất bại');
    }
    return resData;
  } catch (error) {
    console.error('getMyOrganizations API Error:', error);
    throw error;
  }
}

/**
 * Lấy tất cả tổ chức (hỗ trợ ?my=true)
 * GET /api/organizations  hoặc GET /api/organizations?my=true
 */
export async function getOrganizations({ my = false } = {}) {
  try {
    const url = my
      ? `${API_BASE_URL}/organizations?my=true`
      : `${API_BASE_URL}/organizations`;
    const response = await fetch(url, {
      method: 'GET',
      headers: getHeaders(),
    });
    const resData = await response.json().catch(() => null);
    if (!response.ok) {
      throw new Error(resData?.message || `Không thể lấy danh sách tổ chức (${response.status})`);
    }
    if (resData && resData.code !== undefined && resData.code >= 400) {
      throw new Error(resData.message || 'Lấy danh sách tổ chức thất bại');
    }
    return resData;
  } catch (error) {
    console.error('getOrganizations API Error:', error);
    throw error;
  }
}

/**
 * Xem chi tiết 1 tổ chức theo ID
 * GET /api/organizations/{id}
 */
export async function getOrganizationById(id) {
  try {
    if (!id) throw new Error('ID tổ chức không hợp lệ');
    const response = await fetch(`${API_BASE_URL}/organizations/${encodeURIComponent(id)}`, {
      method: 'GET',
      headers: getHeaders(),
    });
    const resData = await response.json().catch(() => null);
    if (!response.ok) {
      throw new Error(resData?.message || `Không thể lấy chi tiết tổ chức (${response.status})`);
    }
    if (resData && resData.code !== undefined && resData.code >= 400) {
      throw new Error(resData.message || 'Lấy chi tiết tổ chức thất bại');
    }
    return resData;
  } catch (error) {
    console.error('getOrganizationById API Error:', error);
    throw error;
  }
}

/**
 * Tạo tổ chức mới
 * POST /api/organizations
 * Body: { name, description }
 */
export async function createOrganization({ name, description = '' }) {
  try {
    const response = await fetch(`${API_BASE_URL}/organizations`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ name, description }),
    });
    const resData = await response.json().catch(() => null);
    if (!response.ok) {
      throw new Error(resData?.message || `Không thể tạo tổ chức (${response.status})`);
    }
    if (resData && resData.code !== undefined && resData.code >= 400) {
      throw new Error(resData.message || 'Tạo tổ chức thất bại');
    }
    return resData;
  } catch (error) {
    console.error('createOrganization API Error:', error);
    throw error;
  }
}

/**
 * Cập nhật tổ chức (PUT)
 * PUT /api/organizations/{id}
 * Body: { name, description }
 */
export async function updateOrganization(id, { name, description }) {
  try {
    if (!id) throw new Error('ID tổ chức không hợp lệ');
    const response = await fetch(`${API_BASE_URL}/organizations/${encodeURIComponent(id)}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ name, description }),
    });
    const resData = await response.json().catch(() => null);
    if (!response.ok) {
      throw new Error(resData?.message || `Không thể cập nhật tổ chức (${response.status})`);
    }
    if (resData && resData.code !== undefined && resData.code >= 400) {
      throw new Error(resData.message || 'Cập nhật tổ chức thất bại');
    }
    return resData;
  } catch (error) {
    console.error('updateOrganization API Error:', error);
    throw error;
  }
}

/**
 * Cập nhật một phần tổ chức (PATCH)
 * PATCH /api/organizations/{id}
 * Body: { name?, description? }
 */
export async function patchOrganization(id, fields) {
  try {
    if (!id) throw new Error('ID tổ chức không hợp lệ');
    const response = await fetch(`${API_BASE_URL}/organizations/${encodeURIComponent(id)}`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify(fields),
    });
    const resData = await response.json().catch(() => null);
    if (!response.ok) {
      throw new Error(resData?.message || `Không thể cập nhật tổ chức (${response.status})`);
    }
    if (resData && resData.code !== undefined && resData.code >= 400) {
      throw new Error(resData.message || 'Cập nhật tổ chức thất bại');
    }
    return resData;
  } catch (error) {
    console.error('patchOrganization API Error:', error);
    throw error;
  }
}

/**
 * Xóa tổ chức (chỉ Owner)
 * DELETE /api/organizations/{id}
 */
export async function deleteOrganization(id) {
  try {
    if (!id) throw new Error('ID tổ chức không hợp lệ');
    const response = await fetch(`${API_BASE_URL}/organizations/${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    const resData = await response.json().catch(() => null);
    if (!response.ok) {
      throw new Error(resData?.message || `Không thể xóa tổ chức (${response.status})`);
    }
    if (resData && resData.code !== undefined && resData.code >= 400) {
      throw new Error(resData.message || 'Xóa tổ chức thất bại');
    }
    return resData;
  } catch (error) {
    console.error('deleteOrganization API Error:', error);
    throw error;
  }
}

// ─── ORGANIZATION MEMBER APIs ─────────────────────────────────────────────────

/**
 * Lấy danh sách thành viên của tổ chức
 * GET /api/organization-members/{organizationId}
 */
export async function getOrganizationMembers(organizationId) {
  try {
    if (!organizationId) throw new Error('ID tổ chức không hợp lệ');
    const response = await fetch(
      `${API_BASE_URL}/organization-members/${encodeURIComponent(organizationId)}`,
      { method: 'GET', headers: getHeaders() }
    );
    const resData = await response.json().catch(() => null);
    if (!response.ok) {
      throw new Error(resData?.message || `Không thể lấy danh sách thành viên (${response.status})`);
    }
    if (resData && resData.code !== undefined && resData.code >= 400) {
      throw new Error(resData.message || 'Lấy danh sách thành viên thất bại');
    }
    return resData;
  } catch (error) {
    console.error('getOrganizationMembers API Error:', error);
    throw error;
  }
}

/**
 * Thêm thành viên vào tổ chức
 * POST /api/organization-members
 * Body: { organizationId, email?, userId?, roleName?, roleId? }
 */
export async function addOrganizationMember(arg1, arg2 = {}) {
  try {
    // Support both addOrganizationMember(organizationId, { email, ... }) and addOrganizationMember({ organizationId, email, ... })
    let organizationId;
    let payload = {};
    if (typeof arg1 === 'object' && arg1 !== null) {
      organizationId = arg1.organizationId;
      payload = arg1;
    } else {
      organizationId = arg1;
      payload = arg2 || {};
    }

    if (!organizationId) throw new Error('ID tổ chức không hợp lệ');

    const body = {
      organizationId,
      roleName: payload.roleName || 'USER',
    };
    if (payload.email) body.email = payload.email.trim();
    if (payload.userId) body.userId = payload.userId.trim();
    if (payload.roleId) body.roleId = payload.roleId;

    const response = await fetch(`${API_BASE_URL}/organization-members`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(body),
    });
    const resData = await response.json().catch(() => null);
    if (!response.ok) {
      throw new Error(resData?.message || `Không thể thêm thành viên (${response.status})`);
    }
    if (resData && resData.code !== undefined && resData.code >= 400) {
      throw new Error(resData.message || 'Thêm thành viên thất bại');
    }
    return resData;
  } catch (error) {
    console.error('addOrganizationMember API Error:', error);
    throw error;
  }
}

/**
 * Xóa thành viên khỏi tổ chức hoặc tự rời tổ chức
 * DELETE /api/organization-members/{memberId}
 */
export async function removeOrganizationMember(memberId) {
  try {
    if (!memberId) throw new Error('ID thành viên không hợp lệ');
    const response = await fetch(
      `${API_BASE_URL}/organization-members/${encodeURIComponent(memberId)}`,
      { method: 'DELETE', headers: getHeaders() }
    );
    const resData = await response.json().catch(() => null);
    if (!response.ok) {
      throw new Error(resData?.message || `Không thể xóa thành viên (${response.status})`);
    }
    if (resData && resData.code !== undefined && resData.code >= 400) {
      throw new Error(resData.message || 'Xóa thành viên thất bại');
    }
    return resData;
  } catch (error) {
    console.error('removeOrganizationMember API Error:', error);
    throw error;
  }
}

/**
 * Thay đổi Role của thành viên (chỉ Owner)
 * PUT /api/organization-members/{memberId}/role?roleName=...
 *   hoặc ?roleId=...
 */
export async function updateMemberRole(memberId, { roleName, roleId } = {}) {
  try {
    if (!memberId) throw new Error('ID thành viên không hợp lệ');
    const params = new URLSearchParams();
    if (roleName) params.set('roleName', roleName);
    if (roleId) params.set('roleId', roleId);
    const response = await fetch(
      `${API_BASE_URL}/organization-members/${encodeURIComponent(memberId)}/role?${params.toString()}`,
      { method: 'PUT', headers: getHeaders() }
    );
    const resData = await response.json().catch(() => null);
    if (!response.ok) {
      throw new Error(resData?.message || `Không thể cập nhật quyền thành viên (${response.status})`);
    }
    if (resData && resData.code !== undefined && resData.code >= 400) {
      throw new Error(resData.message || 'Cập nhật quyền thành viên thất bại');
    }
    return resData;
  } catch (error) {
    console.error('updateMemberRole API Error:', error);
    throw error;
  }
}

// ─── ORGANIZATION PROJECT APIs ────────────────────────────────────────────────

/**
 * Lấy danh sách dự án thuộc tổ chức
 * GET /api/organizations/{organizationId}/projects
 */
export async function getOrganizationProjects(organizationId) {
  try {
    if (!organizationId) throw new Error('ID tổ chức không hợp lệ');
    const response = await fetch(
      `${API_BASE_URL}/organizations/${encodeURIComponent(organizationId)}/projects`,
      { method: 'GET', headers: getHeaders() }
    );
    const resData = await response.json().catch(() => null);
    if (!response.ok) {
      throw new Error(resData?.message || `Không thể lấy danh sách dự án (${response.status})`);
    }
    if (resData && resData.code !== undefined && resData.code >= 400) {
      throw new Error(resData.message || 'Lấy danh sách dự án thất bại');
    }
    return resData;
  } catch (error) {
    console.error('getOrganizationProjects API Error:', error);
    throw error;
  }
}

// ─── LOCAL STORAGE HELPERS ────────────────────────────────────────────────────

export function saveSelectedOrganization(org) {
  if (org) {
    localStorage.setItem('selected_organization', JSON.stringify(org));
  } else {
    localStorage.removeItem('selected_organization');
  }
}

export function getSelectedOrganization() {
  try {
    const raw = localStorage.getItem('selected_organization');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}
