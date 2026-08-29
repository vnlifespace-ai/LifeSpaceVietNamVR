import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router';
import VR360ViewerModal from '../../../components/vr360/VR360ViewerModal';
import { getProjectById, getVRScenesByProjectId } from '../../../api/project';
import { updateVrScene } from '../../../api/vrscene';

export default function VrSceneEditPage() {
  const { idProject } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const initialSceneId = searchParams.get('sceneId');

  const [project, setProject] = useState(null);
  const [scenes, setScenes] = useState([]);
  const [activeScene, setActiveScene] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (idProject) {
      loadData();
    } else {
      setErrorMsg('Mã dự án (idProject) không hợp lệ!');
      setLoading(false);
    }
  }, [idProject]);

  const loadData = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      // 1. Fetch Project Details
      const projRes = await getProjectById(idProject);
      const projData = projRes?.result || projRes;
      setProject(projData);

      // 2. Fetch VR Scenes for this project
      const scenesRes = await getVRScenesByProjectId(idProject);
      const sceneList = Array.isArray(scenesRes?.result) ? scenesRes.result : [];
      setScenes(sceneList);

      // 3. Set Active Scene
      if (sceneList.length > 0) {
        const targetScene =
          sceneList.find((s) => s.id === initialSceneId) ||
          sceneList.find((s) => s.id === projData?.idVRScene) ||
          sceneList[0];
        setActiveScene(targetScene);
      }
    } catch (err) {
      console.error('Error loading VR edit page:', err);
      setErrorMsg(err.message || 'Không thể tải dữ liệu VR Scene.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateScene = async (payload) => {
    if (!payload?.id) return;
    const res = await updateVrScene(payload.id, payload);
    const updated = res?.result || {};
    setScenes((prev) =>
      prev.map((s) => (s.id === payload.id ? { ...s, ...updated } : s))
    );
    return updated;
  };

  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          background: '#0a0c10',
          color: '#ffffff',
          fontFamily: 'system-ui, sans-serif',
          gap: '1rem',
        }}
      >
        <div
          style={{
            width: '40px',
            height: '40px',
            border: '3px solid rgba(222, 145, 63, 0.3)',
            borderTopColor: '#de913f',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
          }}
        />
        <span style={{ fontSize: '0.95rem', fontWeight: '600', color: '#94a3b8' }}>
          Đang tải trình chỉnh sửa VR 360°...
        </span>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (errorMsg) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          background: '#0a0c10',
          color: '#ffffff',
          fontFamily: 'system-ui, sans-serif',
          gap: '1rem',
          padding: '2rem',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid #ef4444',
            borderRadius: '16px',
            padding: '2rem',
            maxWidth: '420px',
          }}
        >
          <h3 style={{ color: '#ef4444', margin: '0 0 0.5rem 0' }}>Lỗi Tải VR Editor</h3>
          <p style={{ color: '#cbd5e1', fontSize: '0.9rem', margin: '0 0 1rem 0' }}>{errorMsg}</p>
          <button
            onClick={() => navigate(`/vrscene/${idProject}`)}
            style={{
              padding: '0.5.rem 1rem',
              background: '#de913f',
              border: 'none',
              borderRadius: '8px',
              color: '#fff',
              fontWeight: 'bold',
              cursor: 'pointer',
            }}
          >
            Quay lại Danh Sách VR Scene
          </button>
        </div>
      </div>
    );
  }

  return (
    <VR360ViewerModal
      scenes={scenes}
      activeScene={activeScene}
      loadingScenes={false}
      idProject={idProject}
      projectName={project?.nameProject || 'Dự án VR'}
      onSelectScene={(scene) => setActiveScene(scene)}
      onUpdateScene={handleUpdateScene}
      onClose={() => navigate(`/vrscene/${idProject}`)}
    />
  );
}
