import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import ProjectTable from '../../components/Project/ProjectTable';
import CreateProjectModal from '../../components/Project/CreateProjectModal';
import AlertBox from '../../components/common/AlertBox';
import { createProject, deleteProject, getProjects } from '../../api/project';
import { getSelectedOrganization, getOrganizationProjects } from '../../api/organization';
import styles from '../dashboard/Dashboard.module.scss';

export default function ProjectsPage() {
  // Read stored user info
  const storedUserRaw = localStorage.getItem('auth_user');
  let user = { name: 'Người dùng VR', email: 'user@lifespace.vr' };
  if (storedUserRaw) {
    try {
      user = { ...user, ...JSON.parse(storedUserRaw) };
    } catch {
      // Fallback
    }
  }

  // Read selected organization from localStorage
  const selectedOrg = getSelectedOrganization();
  const organizationId = selectedOrg?.id || null;

  // --- STATE MANAGEMENT ---
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Alert feedback messages
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // --- API HANDLERS ---
  const fetchProjects = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      // Lấy danh sách dự án trực tiếp từ endpoint tổ chức trong organization.js
      const res = organizationId
        ? await getOrganizationProjects(organizationId)
        : await getProjects();
      let list = [];
      if (Array.isArray(res?.result)) {
        list = res.result;
      } else if (res?.result && typeof res.result === 'object') {
        list = [res.result];
      }
      setProjects(list);
    } catch (err) {
      console.warn('API getProjects Error:', err);
      setErrorMsg(err.message || 'Không thể lấy danh sách dự án');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
    // Re-fetch when org changes (though org is read once at mount here)
  }, [organizationId]);

  // Handle Project Creation
  const handleCreateProject = async ({ nameProject }) => {
    setCreating(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      // Pass organizationId in the request body
      const res = await createProject({
        nameProject: nameProject.trim(),
        organizationId,
      });
      const newProj = res?.result;

      if (newProj) {
        setProjects((prev) => [newProj, ...prev]);
        setSuccessMsg(`Đã tạo dự án "${newProj.nameProject || nameProject.trim()}" thành công!`);
      } else {
        setSuccessMsg(`Tạo dự án "${nameProject.trim()}" thành công!`);
        await fetchProjects();
      }

      setShowCreateModal(false);
    } catch (err) {
      console.error('API createProject error:', err);
      setErrorMsg(err.message || 'Không thể tạo dự án. Vui lòng thử lại!');
      throw err;
    } finally {
      setCreating(false);
    }
  };

  // Handle Project Deletion
  const handleDeleteProject = async (project) => {
    if (!project?.id) return;
    const confirmDelete = window.confirm(`Bạn có chắc chắn muốn xóa dự án "${project.nameProject || project.id}"?`);
    if (!confirmDelete) return;

    setErrorMsg('');
    setSuccessMsg('');
    try {
      await deleteProject(project.id);
      setProjects((prev) => prev.filter((p) => p.id !== project.id));
      setSuccessMsg(`Đã xóa dự án "${project.nameProject || project.id}" thành công!`);
    } catch (err) {
      console.error('API deleteProject error:', err);
      setErrorMsg(err.message || 'Không thể xóa dự án. Vui lòng thử lại!');
    }
  };

  // Page title shows org name for context
  const orgName = selectedOrg?.name ? ` — ${selectedOrg.name}` : '';

  return (
    <DashboardLayout user={user} activeMenu="projects">
      {/* Page Header */}
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <line x1="3" y1="9" x2="21" y2="9" />
            <line x1="9" y1="21" x2="9" y2="9" />
          </svg>
          Quản Lý Dự Án{orgName}
        </h1>
        <p className={styles.pageSubtitle}>
          {selectedOrg
            ? `Danh sách dự án của tổ chức "${selectedOrg.name}".`
            : 'Xem danh sách, quản lý và xem chi tiết thông tin các dự án thực tế ảo.'}
        </p>
      </div>

      {/* Global Alert Messages */}
      <AlertBox type="error" message={errorMsg} />
      <AlertBox type="success" message={successMsg} />

      {/* Project Table Component */}
      <ProjectTable
        projects={projects}
        loading={loading}
        onRefresh={fetchProjects}
        onOpenCreateModal={() => {
          setErrorMsg('');
          setSuccessMsg('');
          setShowCreateModal(true);
        }}
        onDeleteProject={handleDeleteProject}
      />

      {/* Create Project Modal */}
      <CreateProjectModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateProject}
        creating={creating}
        organizationName={selectedOrg?.name}
      />
    </DashboardLayout>
  );
}
