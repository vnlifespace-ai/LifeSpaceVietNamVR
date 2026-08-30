import React, { useState, useRef, useEffect } from 'react';
import styles from './VR360ViewerModal.module.scss';

// Sub-components
import HeaderControls from './HeaderControls';
import BottomSceneSelector from './BottomSceneSelector';
import ThreeCanvasScene from './ThreeCanvasScene';
import ActionAdjusterToolbar from './ActionAdjusterToolbar';

// API
import {
  getNavigationsBySourceScene,
  createNavigations,
  deleteNavigation,
} from '../../api/navigation';

export default function VR360ViewerModal({
  scenes = [],
  activeScene = null,
  loadingScenes = false,
  idProject,
  projectName = 'Dự án VR',
  isReadOnly = false,
  onSelectScene,
  onUpdateScene,
  onClose,
}) {
  const [autoRotate, setAutoRotate] = useState(false);
  const [fov, setFov] = useState(62);
  const containerRef = useRef(null);
  const controlsRef = useRef(null);
  const coordsSpanRef = useRef(null);

  // Live coordinates ref (avoids React state re-render loop on every mouse move frame)
  const currentCoordsRef = useRef({
    x: parseFloat(Number(activeScene?.positionX ?? 0.1).toFixed(4)),
    y: parseFloat(Number(activeScene?.positionY ?? 0.1).toFixed(4)),
    z: parseFloat(Number(activeScene?.positionZ ?? 0.1).toFixed(4)),
  });

  useEffect(() => {
    if (activeScene) {
      const initCoords = {
        x: parseFloat(Number(activeScene.positionX ?? 0.1).toFixed(4)),
        y: parseFloat(Number(activeScene.positionY ?? 0.1).toFixed(4)),
        z: parseFloat(Number(activeScene.positionZ ?? 0.1).toFixed(4)),
      };
      currentCoordsRef.current = initCoords;
      if (coordsSpanRef.current) {
        coordsSpanRef.current.innerText = `Tọa độ hiện tại: X: ${initCoords.x}, Y: ${initCoords.y}, Z: ${initCoords.z}`;
      }
    }
  }, [activeScene]);

  // Coordinates save state & notification toast
  const [savingCoords, setSavingCoords] = useState(false);
  const [toastMsg, setToastMsg] = useState({ type: '', text: '' });

  // Navigation Actions Hotspots States
  const [navigations, setNavigations] = useState([]);
  const [loadingNavigations, setLoadingNavigations] = useState(false);
  const [pendingNavigations, setPendingNavigations] = useState([]);
  const [isPlacingAction, setIsPlacingAction] = useState(false);

  // Active Hotspot Fine-Tune Selection State
  const [selectedNavToAdjust, setSelectedNavToAdjust] = useState(null);

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

  // Fetch Navigation Actions whenever activeScene changes
  useEffect(() => {
    if (activeScene?.id) {
      fetchNavigations(activeScene.id);
    } else {
      setNavigations([]);
      setPendingNavigations([]);
      setLoadingNavigations(false);
    }
    setIsPlacingAction(false);
    setSelectedNavToAdjust(null);
  }, [activeScene?.id]);

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
      setPendingNavigations([]);
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

  // Save camera target coordinates & pending navigation action hotspots (Ctrl + S)
  const handleSaveCameraCoordinates = async () => {
    if (!activeScene?.id) {
      setToastMsg({ type: 'error', text: 'Chưa chọn VR Scene để lưu tọa độ!' });
      setTimeout(() => setToastMsg({ type: '', text: '' }), 3000);
      return;
    }

    const posX = currentCoordsRef.current.x;
    const posY = currentCoordsRef.current.y;
    const posZ = currentCoordsRef.current.z;

    setSavingCoords(true);
    setToastMsg({ type: 'info', text: 'Đang lưu tọa độ & các điểm Action Navigation...' });

    try {
      // 1. Save Scene Camera Position
      const payload = {
        id: activeScene.id,
        name: activeScene.name || 'VR Scene',
        positionX: posX,
        positionY: posY,
        positionZ: posZ,
        idProject: idProject || activeScene.idProject,
      };

      if (onUpdateScene) {
        await onUpdateScene(payload);
      }

      // Update in memory
      activeScene.positionX = posX;
      activeScene.positionY = posY;
      activeScene.positionZ = posZ;

      // 2. Save pending Navigation Action Hotspots via POST /navigation
      if (pendingNavigations.length > 0) {
        const cleanPayload = pendingNavigations.map((nav) => ({
          name: nav.name,
          icon: nav.icon || 'arrow',
          positionX: Number(nav.positionX),
          positionY: Number(nav.positionY),
          positionZ: Number(nav.positionZ),
          idSourceScene: nav.idSourceScene || activeScene.id,
          idTargetScene: nav.idTargetScene,
        }));

        const resNav = await createNavigations(cleanPayload);
        const savedNavs = Array.isArray(resNav?.result) ? resNav.result : [];

        setNavigations((prev) => [
          ...prev.filter((n) => !n.isPending),
          ...(savedNavs.length > 0
            ? savedNavs
            : pendingNavigations.map((n) => ({ ...n, isPending: false }))),
        ]);
        setPendingNavigations([]);
      }

      setToastMsg({
        type: 'success',
        text: `Đã lưu thành công góc nhìn & các Action Navigation! (Ctrl+S)`,
      });
      setTimeout(() => setToastMsg({ type: '', text: '' }), 3500);
    } catch (err) {
      console.error('Save camera coords & navigations error:', err);
      setToastMsg({
        type: 'error',
        text: err.message || 'Không thể lưu dữ liệu. Vui lòng thử lại!',
      });
      setTimeout(() => setToastMsg({ type: '', text: '' }), 4000);
    } finally {
      setSavingCoords(false);
    }
  };

  // Toggle "+ Tạo Action" Placement Mode Handler
  const handleTogglePlacingAction = () => {
    if (!activeScene?.id) {
      setToastMsg({ type: 'error', text: 'Vui lòng chọn VR Scene để tạo Action!' });
      setTimeout(() => setToastMsg({ type: '', text: '' }), 3000);
      return;
    }

    const nextState = !isPlacingAction;
    setIsPlacingAction(nextState);

    if (nextState) {
      setSelectedNavToAdjust(null);
    }
  };

  // Click / Right-Click Handler on 360 Panorama Sphere:
  // Creates the Action Hotspot immediately with a unique _tempId and opens ActionAdjusterToolbar!
  const handleSphereClick = ({ x, y, z }) => {
    if (!activeScene?.id) return;

    const otherScenes = scenes.filter((s) => s.id !== activeScene.id);
    const defaultTarget = otherScenes.length > 0 ? otherScenes[0] : scenes[0];
    const defaultTargetId = defaultTarget?.id || '';
    const defaultTargetName = defaultTarget ? `Chuyển đến ${defaultTarget.name}` : 'Action Navigation';

    const tempId = `temp-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

    const newNav = {
      _tempId: tempId,
      name: defaultTargetName,
      icon: 'arrow',
      positionX: x,
      positionY: y,
      positionZ: z,
      idSourceScene: activeScene.id,
      idTargetScene: defaultTargetId,
      isPending: true,
    };

    setNavigations((prev) => [...prev, newNav]);
    setPendingNavigations((prev) => [...prev, newNav]);
    setSelectedNavToAdjust(newNav);
    setIsPlacingAction(false);

    setToastMsg({
      type: 'success',
      text: 'Đã tạo điểm Action! Kéo các thanh X, Y, Z ở bảng góc dưới để chỉnh vị trí, sau đó nhấn Ctrl + S để lưu.',
    });
    setTimeout(() => setToastMsg({ type: '', text: '' }), 4000);
  };

  // Live update handler for selected Action Hotspot (matches by _tempId or id)
  const handleUpdateNav = (updatedNav) => {
    const isSameNav = (n) => {
      if (updatedNav._tempId && n._tempId) return n._tempId === updatedNav._tempId;
      if (updatedNav.id && n.id) return n.id === updatedNav.id;
      return n === updatedNav;
    };

    setNavigations((prev) => prev.map((n) => (isSameNav(n) ? updatedNav : n)));

    setPendingNavigations((prev) => {
      const exists = prev.some(isSameNav);
      if (exists) {
        return prev.map((n) => (isSameNav(n) ? updatedNav : n));
      }
      return [...prev, updatedNav];
    });

    setSelectedNavToAdjust(updatedNav);
  };

  // Delete a Navigation Action Hotspot
  const handleDeleteNavigation = async (nav) => {
    if (!nav) return;
    const confirmDelete = window.confirm(`Bạn có chắc chắn muốn xóa điểm Action "${nav.name}"?`);
    if (!confirmDelete) return;

    const isSameNav = (n) => {
      if (nav._tempId && n._tempId) return n._tempId === nav._tempId;
      if (nav.id && n.id) return n.id === nav.id;
      return n === nav;
    };

    try {
      if (nav.id && !nav.isPending) {
        await deleteNavigation(nav.id);
      }
      setNavigations((prev) => prev.filter((n) => !isSameNav(n)));
      setPendingNavigations((prev) => prev.filter((n) => !isSameNav(n)));
      if (selectedNavToAdjust && isSameNav(selectedNavToAdjust)) {
        setSelectedNavToAdjust(null);
      }
      setToastMsg({ type: 'success', text: `Đã xóa Action Navigation "${nav.name}"!` });
      setTimeout(() => setToastMsg({ type: '', text: '' }), 3000);
    } catch (err) {
      console.error('Delete navigation error:', err);
      setToastMsg({ type: 'error', text: err.message || 'Không thể xóa Navigation Action' });
      setTimeout(() => setToastMsg({ type: '', text: '' }), 3500);
    }
  };

  // Listen for Ctrl + S / Cmd + S keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        handleSaveCameraCoordinates();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeScene, idProject, pendingNavigations]);

  const currentImageUrl = activeScene?.path || '';

  return (
    <div ref={containerRef} className={styles.viewerContainer}>
      {/* Top Header Controls Toolbar */}
      <HeaderControls
        projectName={projectName}
        activeScene={activeScene}
        coordsSpanRef={coordsSpanRef}
        currentCoordsRef={currentCoordsRef}
        savingCoords={savingCoords}
        autoRotate={autoRotate}
        isPlacingAction={isPlacingAction}
        isReadOnly={isReadOnly}
        onOpenActionModal={handleTogglePlacingAction}
        onSaveCoords={handleSaveCameraCoordinates}
        onToggleAutoRotate={() => setAutoRotate(!autoRotate)}
        onToggleFullscreen={toggleFullscreen}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onClose={onClose}
      />

      {/* Placement Mode Active Top Hint Banner */}
      {isPlacingAction && !isReadOnly && (
        <div className={styles.placementHintBanner}>
          <span>Nhấp chuột phải (hoặc nhấp chuột trái) vào vị trí bất kỳ trên ảnh VR 360° để đặt điểm Action Navigation</span>
          <button
            onClick={() => setIsPlacingAction(false)}
            title="Thoát chế độ chấm điểm"
            style={{
              background: 'rgba(255,255,255,0.25)',
              border: 'none',
              color: '#ffffff',
              borderRadius: '50%',
              width: '22px',
              height: '22px',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      )}

      {/* Toast Floating Alert Message */}
      {toastMsg.text && (
        <div
          className={`${styles.toastAlert} ${
            toastMsg.type === 'error'
              ? styles.toastError
              : toastMsg.type === 'success'
              ? styles.toastSuccess
              : styles.toastInfo
          }`}
        >
          {toastMsg.type === 'success' && (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          )}
          <span>{toastMsg.text}</span>
        </div>
      )}

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
          <p>
            Dự án này chưa có tệp ảnh panorama 360° nào. Vui lòng kiểm tra dữ liệu VR Scene!
          </p>
        </div>
      )}

      {/* 3D Canvas Scene */}
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
        selectedNavId={selectedNavToAdjust?._tempId || selectedNavToAdjust?.id || selectedNavToAdjust}
        onSelectScene={onSelectScene}
        onDeleteNavigation={isReadOnly ? null : handleDeleteNavigation}
        onSelectNavToAdjust={isReadOnly ? null : (nav) => setSelectedNavToAdjust(nav)}
        isPlacingAction={isPlacingAction}
        isReadOnly={isReadOnly}
        onSphereClick={handleSphereClick}
      />

      {/* Direct Fine-Tune Action Position & Scene Adjustment Toolbar */}
      {selectedNavToAdjust && !isReadOnly && (
        <ActionAdjusterToolbar
          nav={selectedNavToAdjust}
          scenes={scenes}
          activeScene={activeScene}
          onUpdateNav={handleUpdateNav}
          onClose={() => setSelectedNavToAdjust(null)}
          onDeleteNav={handleDeleteNavigation}
        />
      )}

      {/* Bottom VR Scenes Selector Toolbar */}
      <BottomSceneSelector
        scenes={scenes}
        activeScene={activeScene}
        onSelectScene={onSelectScene}
      />
    </div>
  );
}
