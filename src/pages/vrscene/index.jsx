import React from 'react';
import { useParams, useNavigate, useLocation } from 'react-router';
import DashboardLayout from '../../components/layout/DashboardLayout';
import VrSceneTable from '../../components/vrscene';
import dashboardStyles from '../dashboard/Dashboard.module.scss';

export default function VrScenePage() {
  const { idProject } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const projectFromState = location.state?.project;
  const projectName = projectFromState?.nameProject || idProject;

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
      {/* Back Button & Header */}
      <div className={dashboardStyles.pageHeader}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
          <button
            onClick={() => navigate('/projects')}
            style={{
              padding: '0.45rem 0.9rem',
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              color: '#64748b',
              fontSize: '0.85rem',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              transition: 'all 0.2s ease',
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            <span>Quay lại Dự án</span>
          </button>
        </div>

        <h1 className={dashboardStyles.pageTitle}>
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
          Quản Lý VR Scene (Dự án: {projectName})
        </h1>
        <p className={dashboardStyles.pageSubtitle}>
          Mã Dự Án (idProject): <span style={{ color: '#de913f', fontWeight: '600' }}>{idProject}</span>
        </p>
      </div>

      {/* Component VR Scene Table */}
      <VrSceneTable idProject={idProject} projectName={projectName} />
    </DashboardLayout>
  );
}
