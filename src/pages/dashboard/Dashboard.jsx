import React from 'react';
import { useNavigate } from 'react-router';
import DashboardLayout from '../../components/layout/DashboardLayout';
import styles from './Dashboard.module.scss';

export default function Dashboard() {
  const navigate = useNavigate();

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
    <DashboardLayout user={user} activeMenu="dashboard">
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
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
          Trang Chủ Dashboard
        </h1>
        <p className={styles.pageSubtitle}>
          Hệ thống quản lý không gian thực tế ảo 360° LifeSpace VR.
        </p>
      </div>

      {/* Trang chủ trống - Clean Empty Welcome State */}
      <div
        style={{
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '16px',
          padding: '4rem 2rem',
          textAlign: 'center',
          marginTop: '1rem',
        }}
      >
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'rgba(222, 145, 63, 0.1)',
            color: '#de913f',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.25rem',
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <line x1="3" y1="9" x2="21" y2="9" />
            <line x1="9" y1="21" x2="9" y2="9" />
          </svg>
        </div>

        <h3
          style={{
            fontSize: '1.25rem',
            fontWeight: '700',
            color: '#0f172a',
            margin: '0 0 0.5rem 0',
          }}
        >
          Chào mừng đến với LifeSpace VR
        </h3>
        <p
          style={{
            color: '#64748b',
            fontSize: '0.925rem',
            maxWidth: '480px',
            margin: '0 auto 1.5rem',
            lineHeight: '1.5',
          }}
        >
          Trang chủ của bạn đang trống. Nhấp vào <strong>Quản lý Dự án</strong> trên danh mục bên trái để xem và làm việc với các dự án thực tế ảo.
        </p>

        <button
          onClick={() => navigate('/projects')}
          style={{
            padding: '0.7rem 1.5rem',
            background: '#de913f',
            color: '#ffffff',
            border: 'none',
            borderRadius: '10px',
            fontSize: '0.9rem',
            fontWeight: '600',
            cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(222, 145, 63, 0.35)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            transition: 'all 0.2s ease',
          }}
        >
          <span>Đi đến Quản lý Dự án</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </button>
      </div>
    </DashboardLayout>
  );
}
