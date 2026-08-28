import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import ProjectTable from '../../components/Project/ProjectTable';
import CreateProjectModal from '../../components/Project/CreateProjectModal';
import AlertBox from '../../components/common/AlertBox';
import { getProjects, createProject } from '../../api/project';
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
      const res = await getProjects();
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
  }, []);

  // Handle Project Creation
  const handleCreateProject = async ({ nameProject }) => {
    setCreating(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = await createProject({ nameProject: nameProject.trim() });
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
          Quản Lý Dự Án
        </h1>
        <p className={styles.pageSubtitle}>
          Xem danh sách, quản lý và xem chi tiết thông tin các dự án thực tế ảo.
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
      />

      {/* Create Project Modal */}
      <CreateProjectModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateProject}
        creating={creating}
      />
    </DashboardLayout>
  );
}
