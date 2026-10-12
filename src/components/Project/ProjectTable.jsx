import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import styles from './Project.module.scss';

export default function ProjectTable({
  projects = [],
  loading = false,
  onRefresh,
  onOpenCreateModal,
  onOpenDetail,
  onDeleteProject,
}) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedSlug, setCopiedSlug] = useState(null);

  const handleCopyLink = (slug) => {
    if (!slug) return;
    const publicUrl = `${window.location.origin}/view/${slug}`;
    navigator.clipboard.writeText(publicUrl);
    setCopiedSlug(slug);
    setTimeout(() => {
      setCopiedSlug(null);
    }, 2200);
  };

  const filteredProjects = projects.filter((p) => {
    const q = searchQuery.toLowerCase();
    return (
      (p.nameProject && p.nameProject.toLowerCase().includes(q)) ||
      (p.slug && p.slug.toLowerCase().includes(q)) ||
      (p.id && p.id.toLowerCase().includes(q))
    );
  });

  return (
    <div className={styles.projectWrapper}>
      {/* PROJECTS TABLE CARD */}
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
            Danh Sách Dự Án
          </h3>

          <div className={styles.actionsGroup}>
            <input
              type="text"
              placeholder="Tìm kiếm dự án..."
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
                className={`${styles.addBtn} ${styles.hideMobile}`}
                onClick={onOpenCreateModal}
                title="Tạo dự án mới"
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
                <span>Tạo Dự Án Mới</span>
              </button>
            )}
          </div>
        </div>

        {/* TABLE CONTENT */}
        <div className={styles.tableResponsive}>
          <table className={styles.projectTable}>
            <thead>
              <tr>
                <th className={styles.sttCol}>STT</th>
                <th className={styles.hideMobile}>Mã ID</th>
                <th>Tên Dự Án</th>
                <th>View 360°</th>
                <th className={styles.hideMobile}>Thao Tác</th>
              </tr>
            </thead>
            <tbody>
              {loading && filteredProjects.length === 0 ? (
                <tr>
                  <td colSpan="5" className={styles.emptyState}>
                    <div className={styles.spinner} style={{ margin: '0 auto 0.5rem' }}></div>
                    <p>Đang tải dữ liệu dự án từ API...</p>
                  </td>
                </tr>
              ) : filteredProjects.length === 0 ? (
                <tr>
                  <td colSpan="5" className={styles.emptyState}>
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
                    <p>Chưa có dự án nào trong hệ thống.</p>
                  </td>
                </tr>
              ) : (
                filteredProjects.map((item, index) => (
                  <tr key={item.id || index}>
                    <td className={styles.sttCol}>{index + 1}</td>
                    <td className={styles.hideMobile}>
                      <span className={styles.idBadge}>{item.id || `proj-${index + 1}`}</span>
                    </td>
                    <td>
                      <div
                        className={styles.projectName}
                        onClick={() => {
                          if (onOpenDetail) onOpenDetail(item);
                          navigate(`/vrscene/${item.id}`, { state: { project: item } });
                        }}
                        style={{ cursor: 'pointer' }}
                        title="Nhấp để xem và quản lý VR Scene"
                      >
                        <div className={styles.projectIcon}>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                          </svg>
                        </div>
                        <span>{item.nameProject}</span>
                      </div>
                    </td>
                    <td>
                      <div className={styles.slugCell}>
                        <span className={`${styles.slugTag} ${styles.hideMobile}`}>
                          {item.slug || item.nameProject?.toLowerCase().replace(/\s+/g, '-')}
                        </span>

                        <div className={styles.slugActions}>
                          <a
                            href={`/view/${item.slug || item.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.viewLinkBtn}
                            title="Mở trải nghiệm VR 360 công khai trong tab mới"
                          >
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                              <polyline points="15 3 21 3 21 9" />
                              <line x1="10" y1="14" x2="21" y2="3" />
                            </svg>
                            <span>View</span>
                          </a>

                          <button
                            className={`${styles.copyLinkBtn} ${styles.hideMobile} ${copiedSlug === (item.slug || item.id) ? styles.copied : ''}`}
                            onClick={() => handleCopyLink(item.slug || item.id)}
                            title="Sao chép đường dẫn View VR công khai"
                          >
                            {copiedSlug === (item.slug || item.id) ? (
                              <>
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                  <polyline points="20 6 9 17 4 12" />
                                </svg>
                                <span>Đã chép!</span>
                              </>
                            ) : (
                              <>
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                                </svg>
                                <span>Copy</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </td>
                    <td className={styles.hideMobile}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                        <button
                          className={styles.detailBtn}
                          onClick={() => {
                            if (onOpenDetail) onOpenDetail(item);
                            navigate(`/vrscene/${item.id}`, { state: { project: item } });
                          }}
                          title="Xem danh sách VR Scene của dự án"
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
                        </button>

                        {onDeleteProject && (
                          <button
                            className={styles.deleteBtn}
                            onClick={() => onDeleteProject(item)}
                            title="Xóa dự án"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <polyline points="3 6 5 6 21 6" />
                              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                              <line x1="10" y1="11" x2="10" y2="17" />
                              <line x1="14" y1="11" x2="14" y2="17" />
                            </svg>
                          </button>
                        )}
                      </div>
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
