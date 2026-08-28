import React, { Suspense, useState, useRef, useEffect } from 'react';
import { Canvas, useLoader, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

// 360 Panorama Sphere Mesh
function PanoramaMesh({ imageUrl }) {
  const texture = useLoader(THREE.TextureLoader, imageUrl);

  return (
    <mesh scale={[-1, 1, 1]}>
      <sphereGeometry args={[500, 60, 40]} />
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

export default function VR360ViewerModal({
  scenes = [],
  activeScene = null,
  loadingScenes = false,
  idProject,
  projectName = 'Dự án VR',
  onSelectScene,
  onUploadScene,
  onClose,
}) {
  const [autoRotate, setAutoRotate] = useState(false);
  const [fov, setFov] = useState(62);
  const containerRef = useRef(null);
  const controlsRef = useRef(null);

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
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 9999,
        backgroundColor: '#0a0c10',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      {/* Top Header Controls */}
      <div
        style={{
          position: 'absolute',
          top: '16px',
          left: '16px',
          right: '16px',
          zIndex: 20,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          pointerEvents: 'none',
        }}
      >
        {/* Title Badge */}
        <div
          style={{
            color: '#fff',
            backgroundColor: 'rgba(15, 23, 42, 0.85)',
            padding: '10px 20px',
            borderRadius: '14px',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
            pointerEvents: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '2px',
          }}
        >
          <span
            style={{
              fontSize: '11px',
              color: '#de913f',
              fontWeight: '700',
              letterSpacing: '0.8px',
              textTransform: 'uppercase',
            }}
          >
            {projectName} (ID: {idProject})
          </span>
          <span style={{ fontSize: '16px', fontWeight: '700', color: '#f8fafc' }}>
            {activeScene?.name || 'Trải Nghiệm VR 360°'}
          </span>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', gap: '10px', pointerEvents: 'auto' }}>
          {/* Add 360 Image Direct Button */}
          <button
            onClick={() => {
              setUploadError('');
              setUploadSuccess('');
              setShowUploadModal(true);
            }}
            title="Thêm ảnh VR 360° trực tiếp"
            style={{
              background: 'linear-gradient(135deg, #de913f, #c47926)',
              border: 'none',
              color: '#ffffff',
              padding: '8px 14px',
              borderRadius: '10px',
              fontSize: '13px',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 4px 14px rgba(222, 145, 63, 0.4)',
            }}
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
            style={{
              background: autoRotate
                ? 'linear-gradient(135deg, #de913f, #c47926)'
                : 'rgba(15, 23, 42, 0.85)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: '#fff',
              padding: '8px 14px',
              borderRadius: '10px',
              fontSize: '13px',
              fontWeight: '600',
              cursor: 'pointer',
              backdropFilter: 'blur(10px)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
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
            style={{
              background: 'rgba(15, 23, 42, 0.85)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: '#fff',
              padding: '8px 12px',
              borderRadius: '10px',
              cursor: 'pointer',
              backdropFilter: 'blur(10px)',
            }}
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
          <div
            style={{
              display: 'flex',
              backgroundColor: 'rgba(15, 23, 42, 0.85)',
              borderRadius: '10px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              overflow: 'hidden',
            }}
          >
            <button
              onClick={handleZoomIn}
              title="Phóng to (+)"
              style={{
                background: 'none',
                border: 'none',
                borderRight: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#fff',
                padding: '6px 12px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer',
              }}
            >
              +
            </button>
            <button
              onClick={handleZoomOut}
              title="Thu nhỏ (-)"
              style={{
                background: 'none',
                border: 'none',
                color: '#fff',
                padding: '6px 12px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer',
              }}
            >
              -
            </button>
          </div>

          {/* Close Modal Button */}
          {onClose && (
            <button
              onClick={onClose}
              title="Đóng 3D Viewer"
              style={{
                background: '#ef4444',
                border: 'none',
                color: '#ffffff',
                padding: '8px 14px',
                borderRadius: '10px',
                fontSize: '13px',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 4px 14px rgba(239, 68, 68, 0.4)',
              }}
            >
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

      {/* Empty State Warning if no images exist */}
      {!loadingScenes && !currentImageUrl && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 15,
            color: '#ffffff',
            textAlign: 'center',
            background: 'rgba(15, 23, 42, 0.92)',
            padding: '2rem 2.5rem',
            borderRadius: '20px',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            boxShadow: '0 12px 40px rgba(0, 0, 0, 0.6)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1rem',
            maxWidth: '420px',
          }}
        >
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
          <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#f8fafc' }}>Chưa Có Hình Ảnh VR 360°</h3>
          <p style={{ margin: 0, fontSize: '0.875rem', color: '#94a3b8', lineHeight: 1.5 }}>
            Dự án này chưa có tệp ảnh panorama 360° nào. Vui lòng tải lên ảnh 360° mới để bắt đầu trải nghiệm!
          </p>

          <button
            onClick={() => {
              setUploadError('');
              setUploadSuccess('');
              setShowUploadModal(true);
            }}
            style={{
              marginTop: '0.5rem',
              padding: '0.75rem 1.5rem',
              background: 'linear-gradient(135deg, #de913f, #c47926)',
              border: 'none',
              borderRadius: '10px',
              color: '#ffffff',
              fontWeight: '700',
              fontSize: '0.9rem',
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(222, 145, 63, 0.4)',
            }}
          >
            + Tải Lên Ảnh 360° Đầu Tiên
          </button>
        </div>
      )}

      {/* 3D Canvas Scene */}
      <Canvas
        camera={{ position: [0, 0, 0.1], fov }}
        style={{ width: '100%', height: '100%' }}
      >
        <FovController fov={fov} />
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
        <div
          style={{
            position: 'absolute',
            bottom: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 20,
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            backgroundColor: 'rgba(15, 23, 42, 0.88)',
            padding: '10px 16px',
            borderRadius: '16px',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
            maxWidth: '90vw',
            overflowX: 'auto',
          }}
        >
          <span style={{ fontSize: '12px', color: '#de913f', fontWeight: '700', whiteSpace: 'nowrap' }}>
            Danh Sách Scene ({scenes.length}):
          </span>

          {scenes.map((s, idx) => {
            const isSelected = activeScene?.id === s.id;
            const imgUrl = s.path || '';

            return (
              <button
                key={s.id || idx}
                onClick={() => {
                  if (onSelectScene) onSelectScene(s);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '6px 12px',
                  borderRadius: '10px',
                  background: isSelected
                    ? 'linear-gradient(135deg, #de913f, #c47926)'
                    : 'rgba(255, 255, 255, 0.08)',
                  border: isSelected
                    ? '1px solid #de913f'
                    : '1px solid rgba(255, 255, 255, 0.1)',
                  color: '#ffffff',
                  fontSize: '12px',
                  fontWeight: isSelected ? '700' : '500',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s ease',
                }}
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
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            zIndex: 10000,
            backgroundColor: 'rgba(15, 23, 42, 0.75)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
          }}
          onClick={() => setShowUploadModal(false)}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '20px',
              padding: '2rem',
              width: '100%',
              maxWidth: '460px',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5)',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.25rem',
              color: '#0f172a',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: '700', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ color: '#de913f' }}>+</span> Thêm Ảnh VR Scene 360°
              </h3>
              <button
                onClick={() => setShowUploadModal(false)}
                style={{ background: 'none', border: 'none', fontSize: '1.25rem', color: '#64748b', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            {uploadError && (
              <div style={{ padding: '0.75rem 1rem', borderRadius: '10px', background: '#fef2f2', color: '#dc2626', fontSize: '0.85rem', fontWeight: '500', border: '1px solid #fecaca' }}>
                {uploadError}
              </div>
            )}

            {uploadSuccess && (
              <div style={{ padding: '0.75rem 1rem', borderRadius: '10px', background: '#f0fdf4', color: '#16a34a', fontSize: '0.85rem', fontWeight: '500', border: '1px solid #bbf7d0' }}>
                {uploadSuccess}
              </div>
            )}

            <form onSubmit={handleUploadSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: '600', color: '#334155' }}>
                  Tên VR Scene *
                </label>
                <input
                  type="text"
                  placeholder="vd: Phòng Khách Panorama"
                  value={newSceneName}
                  onChange={(e) => setNewSceneName(e.target.value)}
                  required
                  style={{
                    padding: '0.75rem 1rem',
                    border: '1px solid #cbd5e1',
                    borderRadius: '10px',
                    fontSize: '0.9rem',
                    outline: 'none',
                  }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: '600', color: '#334155' }}>
                  Tệp hình ảnh 360° (file) *
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setNewSceneFile(e.target.files[0]);
                    }
                  }}
                  required
                  style={{
                    padding: '0.6rem',
                    border: '1px solid #cbd5e1',
                    borderRadius: '10px',
                    fontSize: '0.85rem',
                    background: '#f8fafc',
                  }}
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

                <button
                  type="submit"
                  disabled={uploading}
                  style={{
                    padding: '0.65rem 1.4rem',
                    background: 'linear-gradient(135deg, #de913f, #c47926)',
                    border: 'none',
                    borderRadius: '10px',
                    color: '#ffffff',
                    fontWeight: '700',
                    fontSize: '0.875rem',
                    cursor: uploading ? 'not-allowed' : 'pointer',
                    boxShadow: '0 4px 14px rgba(222, 145, 63, 0.4)',
                    opacity: uploading ? 0.7 : 1,
                  }}
                >
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
