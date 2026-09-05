import React from 'react';
import styles from './HeaderControls.module.scss';
import logoImg from '../../assets/image.png';

export default function HeaderControls({
  projectName = 'Dự án VR',
  activeScene = null,
  coordsSpanRef,
  currentCoordsRef,
  savingCoords = false,
  autoRotate = false,
  isPlacingAction = false,
  isReadOnly = false,
  onOpenActionModal,
  onSaveCoords,
  onToggleAutoRotate,
  onToggleFullscreen,
  onZoomIn,
  onZoomOut,
  onRefresh,
  onClose,
}) {
  return (
    <div className={styles.headerControls}>
      {/* Title Badge with Brand Logo */}
      <div className={styles.titleBadge}>
        <div className={styles.brandRow}>
          <img src={logoImg} alt="LifeSpace Logo" className={styles.brandLogo} />
          <div className={styles.titleTextGroup}>
            <span className={styles.projectLabel}>{projectName}</span>
            <span className={styles.sceneName}>{activeScene?.name || 'Trải Nghiệm VR 360°'}</span>
          </div>
        </div>
        {activeScene && !isReadOnly && (
          <span ref={coordsSpanRef} className={styles.coordsInfo}>
            Tọa độ hiện tại: X: {currentCoordsRef?.current?.x ?? 0.1}, Y:{' '}
            {currentCoordsRef?.current?.y ?? 0.1}, Z: {currentCoordsRef?.current?.z ?? 0.1}
          </span>
        )}
      </div>

      {/* Action Controls Toolbar */}
      <div className={styles.actionControls}>
        {/* Create Action Hotspot Button (Hidden in read-only mode) */}
        {!isReadOnly && (
          <button
            onClick={onOpenActionModal}
            disabled={!activeScene}
            title="Tạo Action Navigation chuyển scene"
            className={`${styles.actionBtn} ${isPlacingAction ? styles.activeActionBtn : ''}`}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="16" />
              <line x1="8" y1="12" x2="16" y2="12" />
            </svg>
            <span>{isPlacingAction ? 'Đang chấm điểm 360°' : 'Tạo Action'}</span>
          </button>
        )}

        {/* Save Camera View Angle Coordinates (Ctrl + S) (Hidden in read-only mode) */}
        {!isReadOnly && (
          <button
            onClick={onSaveCoords}
            disabled={savingCoords || !activeScene}
            title="Lưu tọa độ góc nhìn & các Action Navigation (Ctrl + S)"
            className={styles.saveBtn}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
              <polyline points="17 21 17 13 7 13 7 21" />
              <polyline points="7 3 7 8 15 8" />
            </svg>
            <span>{savingCoords ? 'Đang lưu...' : 'Lưu góc nhìn'}</span>
            <kbd className={styles.kbdBadge}>Ctrl+S</kbd>
          </button>
        )}

        {/* Auto Rotate Button */}
        <button
          onClick={onToggleAutoRotate}
          title="Tự động xoay 360"
          className={`${styles.autoRotateBtn} ${autoRotate ? styles.active : ''}`}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
          </svg>
          <span>{autoRotate ? 'Dừng xoay' : 'Tự xoay'}</span>
        </button>

        {isReadOnly && onRefresh && (
          <button
            onClick={onRefresh}
            title="Làm mới dữ liệu VR"
            aria-label="Làm mới dữ liệu VR"
            className={styles.refreshBtn}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 12a9 9 0 0 0-15.3-6.4L3 8" />
              <path d="M3 3v5h5" />
              <path d="M3 12a9 9 0 0 0 15.3 6.4L21 16" />
              <path d="M21 21v-5h-5" />
            </svg>
            <span>Làm mới</span>
          </button>
        )}

        {/* Control Tools Group (Fullscreen + Zoom In/Out) */}
        <div className={styles.toolsGroup}>
          <button onClick={onToggleFullscreen} title="Toàn màn hình" className={styles.toolBtn}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
            </svg>
          </button>
          <div className={styles.divider} />
          <button onClick={onZoomIn} title="Phóng to (+)" className={styles.toolBtn}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </button>
          <button onClick={onZoomOut} title="Thu nhỏ (-)" className={styles.toolBtn}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </button>
        </div>

        {/* Close Button (Hidden in read-only public view mode) */}
        {onClose && !isReadOnly && (
          <button onClick={onClose} title="Đóng 3D Viewer" className={styles.closeBtn}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
            <span>Đóng</span>
          </button>
        )}
      </div>
    </div>
  );
}
