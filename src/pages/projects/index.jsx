import React from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import ProjectTable from '../../components/Project';
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

      {/* Project Table Component */}
      <ProjectTable />
    </DashboardLayout>
  );
}
