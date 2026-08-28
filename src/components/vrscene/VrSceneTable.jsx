import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { getVrScenesByProjectId, createVrScene } from '../../api/vrscene';
import AlertBox from '../common/AlertBox';
import VR360ViewerModal from '../vr360';
import styles from './VrScene.module.scss';

export default function VrSceneTable({ idProject, projectName }) {
  const navigate = useNavigate();

  const [scenes, setScenes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [show3DModal, setShow3DModal] = useState(false);
  const [selectedSceneId, setSelectedSceneId] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    positionX: 0.1,
    positionY: 0.1,
    positionZ: 0.1,
  });
  const [file, setFile] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const getImageUrl = (path) => {
    if (!path) return '';
    if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
      return path;
    }
    const baseUrl = (import.meta.env.VITE_API_URL || 'https://lifespacevrbackend-production.up.railway.app').replace(/\/api\/?$/, '');
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${baseUrl}${cleanPath}`;
  };

  const fetchScenes = async () => {
    if (!idProject) return;
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await getVrScenesByProjectId(idProject);
      let list = [];
      if (Array.isArray(res?.result)) {
        list = res.result;
      } else if (res?.result && typeof res.result === 'object') {
        list = [res.result];
      }

      setScenes(list);
    } catch (err) {
      console.warn('getVrScenesByProjectId API Error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScenes();
  }, [idProject]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleCreateScene = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setErrorMsg('Vui lòng nhập tên VR Scene!');
      return;
    }

    if (!file) {
      setErrorMsg('Vui lòng chọn hình ảnh Panorama 360° (tệp file là bắt buộc)!');
      return;
    }

    setCreating(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = await createVrScene({
        name: formData.name.trim(),
        positionX: formData.positionX,
        positionY: formData.positionY,
        positionZ: formData.positionZ,
        idProject,
        file,
      });

      const newScene = res?.result;
      if (newScene) {
        setScenes((prev) => [newScene, ...prev]);
        setSuccessMsg(`Đã tạo VR Scene "${newScene.name || formData.name.trim()}" thành công!`);
      } else {
        setSuccessMsg(`Tạo VR Scene thành công!`);
        fetchScenes();
      }

      setFormData({ name: '', positionX: 0.1, positionY: 0.1, positionZ: 0.1 });
      setFile(null);
    } catch (err) {
      console.error('API createVrScene Error:', err);
      setErrorMsg(err.message || 'Không thể tạo VR Scene. Vui lòng thử lại!');
    } finally {
      setCreating(false);
    }
  };

  const filteredScenes = scenes.filter((s) => {
    const q = searchQuery.toLowerCase();
    return (
      (s.name && s.name.toLowerCase().includes(q)) ||
      (s.id && s.id.toLowerCase().includes(q)) ||
      (s.path && s.path.toLowerCase().includes(q))
    );
  });

  return (
    <div className={styles.vrSceneWrapper}>
      <AlertBox type="error" message={errorMsg} />
      <AlertBox type="success" message={successMsg} />

      {/* CREATE VR SCENE FORM */}
      <div className={styles.createCard}>
        <div className={styles.cardHeader}>
          <h3 className={styles.cardTitle}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Thêm VR Scene Mới
          </h3>
          <span className={styles.cardBadge}>POST /vrscene/</span>
        </div>

        <form className={styles.createForm} onSubmit={handleCreateScene}>
          <div className={styles.formGrid}>
            {/* Name */}
            <div className={styles.inputGroup}>
              <label htmlFor="name">Tên VR Scene (name) *</label>
              <input
                id="name"
                name="name"
                type="text"
                placeholder="vd: Phòng Khách 360°"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>

            {/* Position X */}
            <div className={styles.inputGroup}>
              <label htmlFor="positionX">Tọa độ X (positionX)</label>
              <input
                id="positionX"
                name="positionX"
                type="number"
                step="0.1"
                value={formData.positionX}
                onChange={handleInputChange}
              />
            </div>

            {/* Position Y */}
            <div className={styles.inputGroup}>
              <label htmlFor="positionY">Tọa độ Y (positionY)</label>
              <input
                id="positionY"
                name="positionY"
                type="number"
                step="0.1"
                value={formData.positionY}
                onChange={handleInputChange}
              />
            </div>

            {/* Position Z */}
            <div className={styles.inputGroup}>
              <label htmlFor="positionZ">Tọa độ Z (positionZ)</label>
              <input
                id="positionZ"
                name="positionZ"
                type="number"
                step="0.1"
                value={formData.positionZ}
                onChange={handleInputChange}
              />
            </div>

            {/* File Upload */}
            <div className={styles.inputGroup} style={{ gridColumn: '1 / -1' }}>
              <label htmlFor="file">Hình Ảnh Panorama 360° (file)</label>
              <input
                id="file"
                name="file"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
              />
            </div>
          </div>

          <button type="submit" className={styles.submitBtn} disabled={creating}>
            {creating ? (
              <>
                <span className={styles.spinner}></span>
                <span>Đang tải lên...</span>
              </>
            ) : (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                <span>Tạo VR Scene</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* VR SCENES TABLE */}
      <div className={styles.tableCard}>
        <div className={styles.tableHeader}>
          <h3 className={styles.headerTitle}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <line x1="3" y1="9" x2="21" y2="9" />
              <line x1="9" y1="21" x2="9" y2="9" />
            </svg>
            Danh Sách VR Scene
          </h3>

          <div className={styles.actionsGroup}>
            <input
              type="text"
              placeholder="Tìm kiếm VR Scene..."
              className={styles.searchInput}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button
              className={styles.refreshBtn}
              onClick={fetchScenes}
              title="Tải lại danh sách"
              disabled={loading}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }}
              >
                <polyline points="23 4 23 10 17 10" />
                <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
              </svg>
              <span>Làm mới</span>
            </button>

            <button
              className={styles.open3dBtn}
              onClick={() => {
                setSelectedSceneId(scenes.length > 0 ? scenes[0].id : null);
                setShow3DModal(true);
              }}
              title="Trải nghiệm không gian 3D VR 360°"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
              </svg>
              <span>Mở 3D Viewer</span>
            </button>
          </div>
        </div>

        {/* TABLE CONTENT */}
        <div className={styles.tableResponsive}>
          <table className={styles.sceneTable}>
            <thead>
              <tr>
                <th className={styles.sttCol}>STT</th>
                <th>Mã Scene ID</th>
                <th>Hình Ảnh</th>
                <th>Tên VR Scene (name)</th>
                <th>Tọa độ (X, Y, Z)</th>
                <th>Thao Tác</th>
              </tr>
            </thead>
            <tbody>
              {loading && filteredScenes.length === 0 ? (
                <tr>
                  <td colSpan="6" className={styles.emptyState}>
                    <div className={styles.spinner} style={{ margin: '0 auto 0.5rem' }}></div>
                    <p>Đang tải danh sách VR Scene từ API...</p>
                  </td>
                </tr>
              ) : filteredScenes.length === 0 ? (
                <tr>
                  <td colSpan="6" className={styles.emptyState}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="12" />
                      <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    <p>Chưa có VR Scene nào trong dự án này.</p>
                  </td>
                </tr>
              ) : (
                filteredScenes.map((item, index) => (
                  <tr key={item.id || index}>
                    <td className={styles.sttCol}>{index + 1}</td>
                    <td>
                      <span className={styles.idBadge}>{item.id || `scene-${index + 1}`}</span>
                    </td>
                    <td>
                      <div className={styles.imageCell}>
                        <div className={styles.imageThumbnail}>
                          {item.path ? (
                            <img
                              src={getImageUrl(item.path)}
                              alt={item.name || 'VR Scene'}
                              title={`Đường dẫn: ${item.path}`}
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src =
                                  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=200&q=80';
                              }}
                            />
                          ) : (
                            <span className={styles.noImage}>Chưa có ảnh</span>
                          )}
                        </div>
                        {item.path && (
                          <span className={styles.pathLabel} title={item.path}>
                            {item.path.length > 18 ? `${item.path.slice(0, 15)}...` : item.path}
                          </span>
                        )}
                      </div>
                    </td>
                    <td>
                      <div className={styles.sceneName}>
                        <div className={styles.sceneIcon}>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <circle cx="12" cy="12" r="9" />
                            <path d="m10 15 5-3-5-3v6z" />
                          </svg>
                        </div>
                        <span>{item.name}</span>
                      </div>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.825rem', fontFamily: 'monospace', color: '#64748b' }}>
                        X: {item.positionX ?? 0.1}, Y: {item.positionY ?? 0.1}, Z: {item.positionZ ?? 0.1}
                      </span>
                    </td>
                    <td>
                      <button
                        className={styles.viewBtn}
                        onClick={() => {
                          setSelectedSceneId(item.id);
                          setShow3DModal(true);
                        }}
                        title="Xem VR 360°"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                        <span>Xem VR 360°</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3D VR VIEWER MODAL */}
      {show3DModal && (
        <VR360ViewerModal
          idProject={idProject}
          projectName={projectName}
          initialSceneId={selectedSceneId}
          onClose={() => setShow3DModal(false)}
        />
      )}
    </div>
  );
}
