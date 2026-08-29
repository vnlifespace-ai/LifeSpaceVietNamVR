import React, { Suspense, useState, useRef, useEffect } from 'react';
import { Canvas, useLoader, useThree, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import styles from './VR360ViewerModal.module.scss';

// 360 Panorama Sphere Mesh (optimized with texture filtering and 48x32 geometry)
function PanoramaMesh({ imageUrl }) {
  const texture = useLoader(THREE.TextureLoader, imageUrl);

  useEffect(() => {
    if (texture) {
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.generateMipmaps = false;
      texture.minFilter = THREE.LinearFilter;
    }
  }, [texture]);

  return (
    <mesh scale={[-1, 1, 1]}>
      <sphereGeometry args={[500, 48, 32]} />
      <meshBasicMaterial map={texture} side={THREE.BackSide} />
    </mesh>
  );
}

// Camera FOV controller for Zoom in / Zoom out
function FovController({ fov }) {
  const { camera } = useThree();
  useEffect(() => {
    if (camera) {
      camera.fov = fov;
      camera.updateProjectionMatrix();
    }
  }, [fov, camera]);
  return null;
}

// Camera Position & Direction Controller based on positionX, positionY, positionZ
function CameraController({ positionX, positionY, positionZ, controlsRef }) {
  const { camera } = useThree();

  useEffect(() => {
    const posX = Number(positionX) ?? 0.1;
    const posY = Number(positionY) ?? 0.1;
    const posZ = Number(positionZ) ?? 0.1;

    if (controlsRef?.current) {
      controlsRef.current.target.set(posX, posY, posZ);
      controlsRef.current.update();
    } else if (camera) {
      camera.lookAt(posX, posY, posZ);
    }
  }, [positionX, positionY, positionZ, camera, controlsRef]);

  return null;
}

// Live Camera Direction Vector Tracker (updates DOM directly for 60fps+ GPU butter-smooth performance without React re-renders)
function CameraTracker({ coordsSpanRef, currentCoordsRef }) {
  const { camera } = useThree();
  const dirVec = useRef(new THREE.Vector3());

  useFrame(() => {
    if (camera) {
      camera.getWorldDirection(dirVec.current);
      const x = parseFloat(Number(dirVec.current.x).toFixed(2)) || 0.1;
      const y = parseFloat(Number(dirVec.current.y).toFixed(2)) || 0.1;
      const z = parseFloat(Number(dirVec.current.z).toFixed(2)) || 0.1;

      if (
        currentCoordsRef.current.x !== x ||
        currentCoordsRef.current.y !== y ||
        currentCoordsRef.current.z !== z
      ) {
        currentCoordsRef.current = { x, y, z };
        if (coordsSpanRef.current) {
          coordsSpanRef.current.innerText = `Tọa độ hiện tại: X: ${x}, Y: ${y}, Z: ${z}`;
        }
      }
    }
  });

  return null;
}

export default function VR360ViewerModal({
  scenes = [],
  activeScene = null,
  loadingScenes = false,
  idProject,
  projectName = 'Dự án VR',
  onSelectScene,
  onUploadScene,
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
    x: parseFloat(Number(activeScene?.positionX ?? 0.1).toFixed(2)),
    y: parseFloat(Number(activeScene?.positionY ?? 0.1).toFixed(2)),
    z: parseFloat(Number(activeScene?.positionZ ?? 0.1).toFixed(2)),
  });

  useEffect(() => {
    if (activeScene) {
      const initCoords = {
        x: parseFloat(Number(activeScene.positionX ?? 0.1).toFixed(2)),
        y: parseFloat(Number(activeScene.positionY ?? 0.1).toFixed(2)),
        z: parseFloat(Number(activeScene.positionZ ?? 0.1).toFixed(2)),
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

  // Upload new scene modal states
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [newSceneName, setNewSceneName] = useState('');
  const [newSceneFile, setNewSceneFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState('');

  const handleZoomIn = () => setFov((prev) => Math.max(35, prev - 8));
  const handleZoomOut = () => setFov((prev) => Math.min(85, prev + 8));

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().catch((err) => console.log(err));
    } else {
      document.exitFullscreen().catch((err) => console.log(err));
    }
  };

  // Save camera target coordinates (positionX, positionY, positionZ)
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
    setToastMsg({ type: 'info', text: 'Đang lưu tọa độ mới...' });

    try {
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

      setToastMsg({
        type: 'success',
        text: `Đã lưu tọa độ góc nhìn thành công! (X: ${posX}, Y: ${posY}, Z: ${posZ})`,
      });
      setTimeout(() => setToastMsg({ type: '', text: '' }), 3500);
    } catch (err) {
      console.error('Save camera coords error:', err);
      setToastMsg({
        type: 'error',
        text: err.message || 'Không thể lưu tọa độ. Vui lòng thử lại!',
      });
      setTimeout(() => setToastMsg({ type: '', text: '' }), 4000);
    } finally {
      setSavingCoords(false);
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
  }, [activeScene, idProject]);

  // Direct VR Scene Upload Handler delegating to external handler
  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!newSceneName.trim()) {
      setUploadError('Vui lòng nhập tên VR Scene!');
      return;
    }
    if (!newSceneFile) {
      setUploadError('Vui lòng chọn tệp hình ảnh 360°!');
      return;
    }

    setUploading(true);
    setUploadError('');
    setUploadSuccess('');

    try {
      if (onUploadScene) {
        await onUploadScene({
          name: newSceneName.trim(),
          file: newSceneFile,
        });
      }

      setUploadSuccess('Tải lên hình ảnh VR Scene 360° thành công!');
      setNewSceneName('');
      setNewSceneFile(null);

      setTimeout(() => {
        setShowUploadModal(false);
        setUploadSuccess('');
      }, 800);
    } catch (err) {
      console.error('Upload Scene error:', err);
      setUploadError(err.message || 'Không thể tải lên ảnh 360°. Vui lòng thử lại!');
    } finally {
      setUploading(false);
    }
  };

  const currentImageUrl = activeScene?.path || '';

  return (
    <div ref={containerRef} className={styles.viewerContainer}>
      {/* Top Header Controls */}
      <div className={styles.headerControls}>
        {/* Title Badge */}
        <div className={styles.titleBadge}>
          <span className={styles.projectLabel}>{projectName}</span>
          <span className={styles.sceneName}>{activeScene?.name || 'Trải Nghiệm VR 360°'}</span>
          {activeScene && (
            <span ref={coordsSpanRef} className={styles.coordsInfo}>
              Tọa độ hiện tại: X: {currentCoordsRef.current.x}, Y: {currentCoordsRef.current.y}, Z:{' '}
              {currentCoordsRef.current.z}
            </span>
          )}
        </div>

        {/* Action Controls */}
        <div className={styles.actionControls}>
          {/* Save Camera View Angle Coordinates Button (Ctrl + S) */}
          <button
            onClick={handleSaveCameraCoordinates}
            disabled={savingCoords || !activeScene}
            title="Lưu tọa độ góc nhìn khung hình hiện tại (Phím tắt: Ctrl + S)"
            className={styles.saveBtn}
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
              <polyline points="17 21 17 13 7 13 7 21" />
              <polyline points="7 3 7 8 15 8" />
            </svg>
            <span>{savingCoords ? 'Đang lưu...' : 'Lưu góc nhìn (Ctrl+S)'}</span>
          </button>

          {/* Add 360 Image Direct Button */}
          <button
            onClick={() => {
              setUploadError('');
              setUploadSuccess('');
              setShowUploadModal(true);
            }}
            title="Thêm ảnh VR 360° trực tiếp"
            className={styles.uploadBtn}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            <span>Thêm Ảnh VR 360°</span>
          </button>

          {/* Auto Rotate Button */}
          <button
            onClick={() => setAutoRotate(!autoRotate)}
            title="Tự động xoay 360"
            className={`${styles.autoRotateBtn} ${autoRotate ? styles.active : ''}`}
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
            </svg>
            <span>{autoRotate ? 'Dừng xoay' : 'Tự xoay'}</span>
          </button>

          {/* Fullscreen Button */}
          <button
            onClick={toggleFullscreen}
            title="Toàn màn hình"
            className={styles.iconBtn}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
            </svg>
          </button>

          {/* Zoom Buttons */}
          <div className={styles.zoomGroup}>
            <button onClick={handleZoomIn} title="Phóng to (+)" className={styles.zoomBtn}>
              +
            </button>
            <button onClick={handleZoomOut} title="Thu nhỏ (-)" className={styles.zoomBtn}>
              -
            </button>
          </div>

          {/* Close Modal Button */}
          {onClose && (
            <button onClick={onClose} title="Đóng 3D Viewer" className={styles.closeBtn}>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
              <span>Đóng</span>
            </button>
          )}
        </div>
      </div>

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
            Dự án này chưa có tệp ảnh panorama 360° nào. Vui lòng tải lên ảnh 360° mới để bắt đầu trải nghiệm!
          </p>

          <button
            onClick={() => {
              setUploadError('');
              setUploadSuccess('');
              setShowUploadModal(true);
            }}
            className={styles.uploadBtn}
            style={{ marginTop: '0.5rem', padding: '0.75rem 1.5rem' }}
          >
            + Tải Lên Ảnh 360° Đầu Tiên
          </button>
        </div>
      )}

      {/* 3D Canvas Scene */}
      <Canvas
        camera={{ position: [0, 0, 0.1], fov }}
        gl={{ powerPreference: 'high-performance', antialias: true }}
        dpr={[1, 2]}
        style={{ width: '100%', height: '100%' }}
      >
        <FovController fov={fov} />
        <CameraController
          positionX={activeScene?.positionX}
          positionY={activeScene?.positionY}
          positionZ={activeScene?.positionZ}
          controlsRef={controlsRef}
        />
        <CameraTracker coordsSpanRef={coordsSpanRef} currentCoordsRef={currentCoordsRef} />
        {currentImageUrl ? (
          <Suspense
            fallback={
              <mesh>
                <sphereGeometry args={[500, 32, 16]} />
                <meshBasicMaterial color="#0f172a" side={THREE.BackSide} />
              </mesh>
            }
          >
            <PanoramaMesh key={currentImageUrl} imageUrl={currentImageUrl} />
          </Suspense>
        ) : (
          <mesh>
            <sphereGeometry args={[500, 32, 16]} />
            <meshBasicMaterial color="#0a0c10" side={THREE.BackSide} />
          </mesh>
        )}
        <OrbitControls
          ref={controlsRef}
          enableZoom={false}
          enablePan={false}
          rotateSpeed={-0.5}
          autoRotate={autoRotate}
          autoRotateSpeed={0.8}
        />
      </Canvas>

      {/* Bottom VR Scenes Selector Toolbar */}
      {scenes.length > 0 && (
        <div className={styles.bottomToolbar}>
          <span className={styles.toolbarLabel}>Danh Sách Scene ({scenes.length}):</span>

          {scenes.map((s, idx) => {
            const isSelected = activeScene?.id === s.id;
            const imgUrl = s.path || '';

            return (
              <button
                key={s.id || idx}
                onClick={() => {
                  if (onSelectScene) onSelectScene(s);
                }}
                className={`${styles.sceneChip} ${isSelected ? styles.active : ''}`}
              >
                {imgUrl ? (
                  <img
                    src={imgUrl}
                    alt={s.name}
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '6px',
                      objectFit: 'cover',
                    }}
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '6px',
                      background: 'rgba(255, 255, 255, 0.2)',
                    }}
                  />
                )}
                <span>{s.name || `Scene ${idx + 1}`}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* DIRECT 360 IMAGE UPLOAD POPUP MODAL */}
      {showUploadModal && (
        <div className={styles.uploadModalOverlay} onClick={() => setShowUploadModal(false)}>
          <div className={styles.uploadModalBox} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>
                <span style={{ color: '#de913f' }}>+</span> Thêm Ảnh VR Scene 360°
              </h3>
              <button className={styles.modalCloseBtn} onClick={() => setShowUploadModal(false)}>
                ✕
              </button>
            </div>

            {uploadError && <div className={styles.alertError}>{uploadError}</div>}
            {uploadSuccess && <div className={styles.alertSuccess}>{uploadSuccess}</div>}

            <form onSubmit={handleUploadSubmit} className={styles.uploadForm}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Tên VR Scene *</label>
                <input
                  type="text"
                  placeholder="vd: Phòng Khách Panorama"
                  value={newSceneName}
                  onChange={(e) => setNewSceneName(e.target.value)}
                  required
                  className={styles.formInput}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Tệp hình ảnh 360° (file) *</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setNewSceneFile(e.target.files[0]);
                    }
                  }}
                  required
                  className={styles.formInput}
                  style={{ background: '#f8fafc', padding: '0.6rem' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  style={{
                    padding: '0.65rem 1.25rem',
                    background: '#f1f5f9',
                    border: '1px solid #cbd5e1',
                    borderRadius: '10px',
                    color: '#475569',
                    fontWeight: '600',
                    fontSize: '0.875rem',
                    cursor: 'pointer',
                  }}
                >
                  Hủy
                </button>

                <button type="submit" disabled={uploading} className={styles.submitBtn}>
                  {uploading ? 'Đang tải lên...' : 'Tải Lên 360°'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
