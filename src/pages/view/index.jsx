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

  const getCacheKey = (projectSlug) => `vr-project:${projectSlug}`;

  const getCachedProjectData = (projectSlug) => {
    try {
      const cachedData = localStorage.getItem(getCacheKey(projectSlug));
      return cachedData ? JSON.parse(cachedData) : null;
    } catch (error) {
      console.warn('Không thể đọc dữ liệu VR từ localStorage:', error);
      return null;
    }
  };

  const cacheProjectData = (projectSlug, data) => {
    try {
      localStorage.setItem(getCacheKey(projectSlug), JSON.stringify(data));
    } catch (error) {
      console.warn('Không thể lưu dữ liệu VR vào localStorage:', error);
    }
  };

  useEffect(() => {
    if (activeSlug) {
      loadProjectData(activeSlug, false);
    } else {
      setErrorMsg('Không tìm thấy mã slug hoặc ID dự án trong đường dẫn URL!');
      setLoading(false);
    }
  }, [activeSlug]);

  const loadProjectData = async (projectSlug, forceRefresh = false) => {
    setLoading(true);
    setErrorMsg('');

    try {
      let projData;
      let sceneList;
      const cachedData = !forceRefresh ? getCachedProjectData(projectSlug) : null;

      if (cachedData?.project && Array.isArray(cachedData.scenes)) {
        projData = cachedData.project;
        sceneList = cachedData.scenes;
      } else {
        // Call GET /projects/slug/{slug} (with fallback GET /projects/id/{slug})
        const projRes = await getProjectBySlug(projectSlug);
        projData = projRes?.result || projRes;

        if (!projData || (!projData.id && !projData.slug && !projData.projectId)) {
          throw new Error('Dữ liệu dự án không tồn tại hoặc đã bị xóa');
        }

        // Use scenes from the project response when available, otherwise fetch them separately.
        sceneList = [];
        if (Array.isArray(projData.scenes) && projData.scenes.length > 0) {
          sceneList = projData.scenes;
        } else {
          const projectId = projData.projectId || projData.id;
          if (projectId) {
            const scenesRes = await getVRScenesByProjectId(projectId);
            sceneList = Array.isArray(scenesRes?.result) ? scenesRes.result : [];
          }
        }

        cacheProjectData(projectSlug, { project: projData, scenes: sceneList });
      }

      setProject(projData);
      setScenes(sceneList);

      // 3. Set default active scene (using initialScene, or matching project.idVRScene, or first available scene)
      let defaultScene = null;
      if (projData.initialScene) {
        const foundInList = sceneList.find((s) => s.id === projData.initialScene.id);
        defaultScene = foundInList || projData.initialScene;
      } else if (sceneList.length > 0) {
        defaultScene =
          sceneList.find((s) => s.id === projData.idVRScene) || sceneList[0];
      }

      setActiveScene(defaultScene);
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
      projectName={project?.nameProject || project?.name || 'Dự án VR 360°'}
      onSelectScene={(scene) => setActiveScene(scene)}
      onRefresh={() => loadProjectData(activeSlug, true)}
    />
  );
}
