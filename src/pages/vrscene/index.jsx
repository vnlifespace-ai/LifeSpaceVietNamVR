import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router';
import DashboardLayout from '../../components/layout/DashboardLayout';
import VrSceneTable from '../../components/vrscene/VrSceneTable';
import CreateVrSceneModal from '../../components/vrscene/CreateVrSceneModal';
import VR360ViewerModal from '../../components/vr360';
import AlertBox from '../../components/common/AlertBox';
import { createVrScene } from '../../api/vrscene';
import { getVRScenesByProjectId } from '../../api/project';
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

  // --- STATE MANAGEMENT ---
  const [scenes, setScenes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [selectedSceneId, setSelectedSceneId] = useState(null);

  // Dialog / Modal Visibility States
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [show3DModal, setShow3DModal] = useState(false);

  // Alert Feedback Messages
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // --- API HANDLERS ---
  const fetchScenes = async () => {
    if (!idProject) return;
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await getVRScenesByProjectId(idProject);
      let list = [];
      if (Array.isArray(res?.result)) {
        list = res.result;
      } else if (res?.result && typeof res.result === 'object') {
        list = [res.result];
      }
      setScenes(list);
    } catch (err) {
      console.warn('API getVRScenesByProjectId Error:', err);
      setErrorMsg(err.message || 'Không thể lấy danh sách VR Scene');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScenes();
  }, [idProject]);

  // Handle VR Scene Creation
  const handleCreateScene = async ({ name, positionX, positionY, positionZ, file }) => {
    setCreating(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = await createVrScene({
        name,
        positionX,
        positionY,
        positionZ,
        idProject,
        file,
      });

      const newScene = res?.result;
      if (newScene) {
        setScenes((prev) => [newScene, ...prev]);
        setSuccessMsg(`Đã tạo VR Scene "${newScene.name || name}" thành công!`);
        setSelectedSceneId(newScene.id);
      } else {
        setSuccessMsg(`Tạo VR Scene "${name}" thành công!`);
        await fetchScenes();
      }

      setShowCreateModal(false);
    } catch (err) {
      console.error('API createVrScene Error:', err);
      setErrorMsg(err.message || 'Không thể tạo VR Scene. Vui lòng thử lại!');
      throw err;
    } finally {
      setCreating(false);
    }
  };

  // Open 3D Viewer for a specific scene
  const handleOpen3D = (sceneId) => {
    setSelectedSceneId(sceneId || (scenes.length > 0 ? scenes[0].id : null));
    setShow3DModal(true);
  };

  const handleClose3D = () => {
    setShow3DModal(false);
  };

  const activeScene = scenes.find((s) => s.id === selectedSceneId) || scenes[0] || null;

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
          Quản Lý & Chỉnh Sửa VR Scene (Dự án: {projectName})
        </h1>
        <p className={dashboardStyles.pageSubtitle}>
          Mã Dự Án (idProject): <span style={{ color: '#de913f', fontWeight: '600' }}>{idProject}</span>
        </p>
      </div>

      {/* Global Alert Messages */}
      <AlertBox type="error" message={errorMsg} />
      <AlertBox type="success" message={successMsg} />

      {/* VR SCENE TABLE PRESENTATIONAL COMPONENT */}
      <VrSceneTable
        scenes={scenes}
        loading={loading}
        onRefresh={fetchScenes}
        onOpenCreateModal={() => {
          setErrorMsg('');
          setSuccessMsg('');
          setShowCreateModal(true);
        }}
        onOpen3D={handleOpen3D}
      />

      {/* CREATE VR SCENE MODAL COMPONENT */}
      <CreateVrSceneModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateScene}
        creating={creating}
      />

      {/* 3D VR VIEWER MODAL PRESENTATIONAL COMPONENT */}
      {show3DModal && (
        <VR360ViewerModal
          scenes={scenes}
          activeScene={activeScene}
          loadingScenes={loading}
          idProject={idProject}
          projectName={projectName}
          onSelectScene={(scene) => setSelectedSceneId(scene?.id)}
          onUploadScene={async ({ name, file }) => {
            await handleCreateScene({
              name,
              file,
              positionX: 0.1,
              positionY: 0.1,
              positionZ: 0.1,
            });
          }}
          onClose={handleClose3D}
        />
      )}
    </DashboardLayout>
  );
}
