import React from 'react';
import { useNavigate } from 'react-router';
import { logoutUser } from '../../api/auth';
import styles from './Navbar.module.scss';

export default function Navbar({ onToggleSidebar, sidebarCollapsed, user }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  return (
    <header className={styles.navbar}>
      <div className={styles.navLeft}>
        <button
          className={styles.toggleSidebarBtn}
          onClick={onToggleSidebar}
          title={sidebarCollapsed ? 'Mở rộng Sidebar' : 'Thu gọn Sidebar'}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>

        <div className={styles.brand}>
          <div className={styles.brandIcon}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M2 12h20" />
              <path d="M20 12v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8" />
              <path d="m4 8 16-4" />
              <circle cx="12" cy="14" r="3" />
            </svg>
          </div>
          <span>LifeSpace VR</span>
        </div>
      </div>

      <div className={styles.navRight}>
        <div className={styles.userInfo}>
          <div className={styles.avatar}>
            {(user?.name || user?.email || 'U').charAt(0).toUpperCase()}
          </div>
          <div className={styles.userDetails}>
            <span className={styles.userName}>{user?.name || 'Người dùng'}</span>
            <span className={styles.userEmail}>{user?.email}</span>
          </div>
        </div>

        <button className={styles.logoutBtn} onClick={handleLogout}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          <span>Đăng xuất</span>
        </button>
      </div>
    </header>
  );
}
