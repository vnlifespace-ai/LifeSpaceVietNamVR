import React from 'react';
import { useNavigate, useLocation } from 'react-router';
import { isUserOwner } from '../../api/auth';
import styles from './Sidebar.module.scss';

export default function Sidebar({ collapsed, activeMenu, user }) {
  const navigate = useNavigate();
  const location = useLocation();

  const isOwner = isUserOwner(user);

  const currentPath = location.pathname;
  const isDashboardActive = activeMenu === 'dashboard' || currentPath === '/dashboard';
  const isProjectsActive = activeMenu === 'projects' || currentPath === '/projects';
  const isUsersActive = activeMenu === 'users' || currentPath === '/users';

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

          {/* Menu Item: Quản lý Người dùng (Chỉ hiển thị khi owner = true) */}
          {isOwner && (
            <li
              className={`${styles.menuItem} ${isUsersActive ? styles.active : ''}`}
              onClick={() => navigate('/users')}
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
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              <span className={styles.menuLabel}>Quản lý người dùng</span>
            </li>
          )}
        </ul>
      </div>
    </aside>
  );
}
