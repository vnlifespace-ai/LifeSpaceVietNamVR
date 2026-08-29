import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router';
import VR360ViewerReadOnly from '../../components/vr360/VR360ViewerReadOnly';
import { getProjectBySlug, getVRScenesByProjectId } from '../../api/project';

export default function ViewVRScenePage() {
  const { slug } = useParams();
  const [searchParams] = useSearchParams();

  // Support either /view/:slug OR /view?slug=...
  const activeSlug = slug || searchParams.get('slug') || searchParams.get('id');

  const [project, setProject] = useState(null);
  const [scenes, setScenes] = useState([]);
  const [activeScene, setActiveScene] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (activeSlug) {
      loadProjectData(activeSlug);
    } else {
      setErrorMsg('Không tìm thấy mã slug hoặc ID dự án trong đường dẫn URL!');
      setLoading(false);
    }
  }, [activeSlug]);

  const loadProjectData = async (projectSlug) => {
    setLoading(true);
    setErrorMsg('');

    try {
      // 1. Call GET /projects/slug/{slug} (with fallback GET /projects/id/{slug})
      const projRes = await getProjectBySlug(projectSlug);
      const projData = projRes?.result || projRes;

      if (!projData || (!projData.id && !projData.slug)) {
        throw new Error('Dữ liệu dự án không tồn tại hoặc đã bị xóa');
      }

      setProject(projData);
      const projectId = projData.id;

      // 2. Fetch VR Scenes for this project via GET /projects/id/{idProject}/vrscene
      const scenesRes = await getVRScenesByProjectId(projectId);
      const sceneList = Array.isArray(scenesRes?.result) ? scenesRes.result : [];
      setScenes(sceneList);

      // 3. Set default active scene (matching project.idVRScene or first available scene)
      if (sceneList.length > 0) {
        const defaultScene =
          sceneList.find((s) => s.id === projData.idVRScene) || sceneList[0];
        setActiveScene(defaultScene);
      }
    } catch (err) {
      console.error('Error loading public VR scene:', err);
      setErrorMsg(err.message || 'Không thể tải dữ liệu VR 360°. Vui lòng kiểm tra lại đường dẫn!');
    } finally {
      setLoading(false);
    }
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
          Đang tải dữ liệu trải nghiệm VR 360°...
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
          <h3 style={{ color: '#ef4444', margin: '0 0 0.5rem 0' }}>Lỗi Tải VR Scene</h3>
          <p style={{ color: '#cbd5e1', fontSize: '0.9rem', margin: 0 }}>{errorMsg}</p>
        </div>
      </div>
    );
  }

  return (
    <VR360ViewerReadOnly
      scenes={scenes}
      activeScene={activeScene}
      loadingScenes={false}
      projectName={project?.nameProject || 'Dự án VR 360°'}
      onSelectScene={(scene) => setActiveScene(scene)}
    />
  );
}
