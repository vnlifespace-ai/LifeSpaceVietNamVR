import React, { useMemo } from 'react';
import { Html } from '@react-three/drei';
import styles from './HotspotMarker.module.scss';

function getCoord(flatVal, objVal, fallback = 0.1) {
  if (flatVal !== undefined && flatVal !== null && flatVal !== '') {
    const num = Number(flatVal);
    if (!isNaN(num)) return num;
  }
  if (objVal !== undefined && objVal !== null && objVal !== '') {
    const num = Number(objVal);
    if (!isNaN(num)) return num;
  }
  return fallback;
}

function HotspotMarker({
  nav,
  scenes = [],
  isSelected = false,
  isReadOnly = false,
  onSelectScene,
  onDeleteNavigation,
  onSelectNavToAdjust,
}) {
  const targetSceneId = nav.targetSceneId || nav.idTargetScene;
  const targetScene = scenes.find((s) => s.id === targetSceneId);
  const targetName = targetScene ? targetScene.name : nav.name || 'Target Scene';

  const rawX = getCoord(nav.positionX, nav.position?.x, 0.1);
  const rawY = getCoord(nav.positionY, nav.position?.y, 0.1);
  const rawZ = getCoord(nav.positionZ, nav.position?.z, 0.1);

  // Calculate 3D sphere normalized position (scaled to 420 units) efficiently without GC overhead
  const [posX, posY, posZ] = useMemo(() => {
    const len = Math.hypot(rawX, rawY, rawZ) || 1;
    const radius = 420;
    return [(rawX / len) * radius, (rawY / len) * radius, (rawZ / len) * radius];
  }, [rawX, rawY, rawZ]);

  // Handle Right-Click on Hotspot Marker: Instantly switch to target VR Scene!
  const handleRightClickNavigate = (e) => {
    e.stopPropagation();
    if (e.nativeEvent) {
      e.nativeEvent.preventDefault();
    }
    if (targetScene && onSelectScene) {
      onSelectScene(targetScene);
    }
  };

  // Handle Left-Click on Hotspot Marker: Switch to target VR Scene & open fine-tune toolbar
  const handleLeftClickNavigate = (e) => {
    e.stopPropagation();
    if (targetScene && onSelectScene) {
      onSelectScene(targetScene);
    }
    if (onSelectNavToAdjust) {
      onSelectNavToAdjust(nav);
    }
  };

  return (
    <group position={[posX, posY, posZ]}>
      <Html center zIndexRange={[100, 0]}>
        <div
          className={`${styles.hotspotContainer} ${isSelected ? styles.selectedHotspot : ''}`}
          onClick={handleLeftClickNavigate}
          onContextMenu={handleRightClickNavigate}
          title={`Nhấp chuột hoặc nhấp chuột phải để chuyển sang VR Scene: ${targetName}`}
        >
          <div className={styles.iconWrapper}>
            <div className={styles.hotspotPulse} />
            <div className={styles.hotspotIcon}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="12" y1="19" x2="12" y2="5" />
                <polyline points="5 12 12 5 19 12" />
              </svg>
            </div>
            {!isReadOnly && (
              <button
                className={styles.hotspotDeleteBtn}
                onClick={(e) => {
                  e.stopPropagation();
                  if (onDeleteNavigation) {
                    onDeleteNavigation(nav);
                  }
                }}
                title="Xóa Action Navigation"
              >
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            )}
          </div>

          <div className={styles.hotspotTooltip}>
            <span>{nav.name || targetName}</span>
            <span className={styles.targetBadge}>{targetName}</span>
          </div>
        </div>
      </Html>
    </group>
  );
}

export default React.memo(HotspotMarker);
