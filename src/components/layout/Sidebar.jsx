import React from 'react';
import { useNavigate, useLocation } from 'react-router';
import styles from './Sidebar.module.scss';

export default function Sidebar({ collapsed, activeMenu }) {
  const navigate = useNavigate();
  const location = useLocation();

  const currentPath = location.pathname;
  const isDashboardActive = activeMenu === 'dashboard' || currentPath === '/dashboard';
  const isProjectsActive = activeMenu === 'projects' || currentPath === '/projects';

  return (
    <aside className={`${styles.sidebar} ${collapsed ? styles.collapsed : ''}`}>
      <div className={styles.sidebarContent}>
        <div className={styles.sectionTitle}>Menu Chính</div>

        <ul className={styles.menuList}>
          {/* Menu Item: Trang Chủ */}
          <li
            className={`${styles.menuItem} ${isDashboardActive ? styles.active : ''}`}
            onClick={() => navigate('/dashboard')}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            <span className={styles.menuLabel}>Trang chủ</span>
          </li>

          {/* Menu Item: Quản lý Dự án */}
          <li
            className={`${styles.menuItem} ${isProjectsActive ? styles.active : ''}`}
            onClick={() => navigate('/projects')}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <line x1="3" y1="9" x2="21" y2="9" />
              <line x1="9" y1="21" x2="9" y2="9" />
            </svg>
            <span className={styles.menuLabel}>Quản lý Dự án</span>
          </li>
        </ul>
      </div>
    </aside>
  );
}
