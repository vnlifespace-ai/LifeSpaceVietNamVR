import React, { useState, useRef, useEffect } from 'react';
import styles from './VR360ViewerModal.module.scss';


// Sub-components
import HeaderControls from './HeaderControls';
import BottomSceneSelector from './BottomSceneSelector';
import ThreeCanvasScene from './ThreeCanvasScene';

// API
import { getNavigationsBySourceScene } from '../../api/navigation';

export default function VR360ViewerReadOnly({
  scenes = [],
  activeScene = null,
  loadingScenes = false,
  projectName = 'Dự án VR 360°',
  onSelectScene,
  onRefresh,
}) {
  const [autoRotate, setAutoRotate] = useState(false);
  const [fov, setFov] = useState(62);
  const containerRef = useRef(null);
  const controlsRef = useRef(null);
  const coordsSpanRef = useRef(null);
  const currentCoordsRef = useRef({ x: 0.1, y: 0.1, z: 0.1 });

  const [navigations, setNavigations] = useState([]);
  const [loadingNavigations, setLoadingNavigations] = useState(false);

  // Preload all VR 360 images in background so room switching is instant
  useEffect(() => {
    if (scenes && scenes.length > 0) {
      scenes.forEach((sc) => {
        if (sc.path && sc.id !== activeScene?.id) {
          const img = new Image();
          img.src = sc.path;
        }
      });
    }
  }, [scenes, activeScene?.id]);

  // Fetch Navigation Actions for activeScene
  useEffect(() => {
    if (activeScene?.id) {
      if (Array.isArray(activeScene.navigations)) {
        setNavigations(activeScene.navigations);
        setLoadingNavigations(false);
      } else {
        fetchNavigations(activeScene.id);
      }
    } else {
      setNavigations([]);
      setLoadingNavigations(false);
    }
  }, [activeScene]);

  const fetchNavigations = async (sourceSceneId) => {
    setLoadingNavigations(true);
    try {
      const res = await getNavigationsBySourceScene(sourceSceneId);
      let list = [];
      if (Array.isArray(res?.result)) {
        list = res.result;
      } else if (res?.result && typeof res.result === 'object') {
        list = [res.result];
      }
      setNavigations(list);
    } catch (err) {
      console.warn('Fetch navigations error:', err);
    } finally {
      setLoadingNavigations(false);
    }
  };

  const handleZoomIn = () => setFov((prev) => Math.max(35, prev - 8));
  const handleZoomOut = () => setFov((prev) => Math.min(85, prev + 8));

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().catch((err) => console.log(err));
    } else {
      document.exitFullscreen().catch((err) => console.log(err));
    }
  };

  const currentImageUrl = activeScene?.path || '';

  return (
    <div ref={containerRef} className={styles.viewerContainer}>
      {/* Top Header Controls (Read-Only: No edit buttons, no close button, no coords) */}
      <HeaderControls
        projectName={projectName}
        activeScene={activeScene}
        coordsSpanRef={coordsSpanRef}
        currentCoordsRef={currentCoordsRef}
        autoRotate={autoRotate}
        isReadOnly={true}
        onToggleAutoRotate={() => setAutoRotate(!autoRotate)}
        onToggleFullscreen={toggleFullscreen}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onRefresh={onRefresh}
      />

      {/* Hotspot Loading Indicator Overlay */}
      {loadingNavigations && (
        <div style={{
          position: 'absolute',
          top: '76px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 45,
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          backgroundColor: 'rgba(15, 23, 42, 0.9)',
          backdropFilter: 'blur(12px)',
          color: '#ffffff',
          padding: '8px 18px',
          borderRadius: '30px',
          border: '1px solid rgba(222, 145, 63, 0.4)',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.5)',
          fontSize: '13px',
          fontWeight: '600',
          pointerEvents: 'none'
        }}>
          <div style={{
            width: '16px',
            height: '16px',
            border: '2px solid rgba(222, 145, 63, 0.3)',
            borderTopColor: '#de913f',
            borderRadius: '50%',
            animation: 'spin 0.7s linear infinite'
          }} />
          <span>Đang tải các điểm Hotspot VR 360°...</span>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      )}

      {/* Empty State Warning if no images exist */}
      {!loadingScenes && !currentImageUrl && (
        <div className={styles.emptyState}>
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#de913f"
            strokeWidth="1.8"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </svg>
          <h3>Chưa Có Hình Ảnh VR 360°</h3>
          <p>Dự án này chưa có tệp ảnh panorama 360° nào.</p>
        </div>
      )}

      {/* Read-Only 3D Canvas Scene */}
      <ThreeCanvasScene
        currentImageUrl={currentImageUrl}
        fov={fov}
        activeScene={activeScene}
        controlsRef={controlsRef}
        coordsSpanRef={coordsSpanRef}
        currentCoordsRef={currentCoordsRef}
        autoRotate={autoRotate}
        navigations={navigations}
        scenes={scenes}
        onSelectScene={onSelectScene}
        isReadOnly={true}
      />

      {/* Bottom Left Copyright Watermark Badge */}
      <div className={styles.copyrightBadge}>
        <span>Bản quyền phần mềm thuộc LifeSpace Việt Nam</span>
      </div>

      {/* Bottom VR Scenes Selector Toolbar */}
      <BottomSceneSelector
        scenes={scenes}
        activeScene={activeScene}
        onSelectScene={onSelectScene}
      />
    </div>
  );
}
