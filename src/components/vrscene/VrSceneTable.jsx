import React, { useState } from 'react';
import styles from './VrScene.module.scss';

export default function VrSceneTable({
  scenes = [],
  loading = false,
  onRefresh,
  onOpenCreateModal,
  onOpen3D,
}) {
  const [searchQuery, setSearchQuery] = useState('');

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
      {/* VR SCENES TABLE CARD */}
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
            {onRefresh && (
              <button
                className={styles.refreshBtn}
                onClick={onRefresh}
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
            )}

            {onOpenCreateModal && (
              <button
                className={styles.addBtn}
                onClick={onOpenCreateModal}
                title="Thêm VR Scene mới"
              >
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
                <span>Thêm VR Scene</span>
              </button>
            )}

            {onOpen3D && (
              <button
                className={styles.open3dBtn}
                onClick={() => onOpen3D(scenes.length > 0 ? scenes[0].id : null)}
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
            )}
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
                              src={item.path}
                              alt={item.name || 'VR Scene'}
                              title={`Đường dẫn: ${item.path}`}
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.style.display = 'none';
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
                      {onOpen3D && (
                        <button
                          className={styles.viewBtn}
                          onClick={() => onOpen3D(item.id)}
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
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
