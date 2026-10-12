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
  const [selectedProject, setSelectedProject] = useState(null);

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
    const creatorName = p.createdBy?.name || '';
    const creatorEmail = p.createdBy?.email || '';
    const orgName = p.organizationName || '';
    return (
      (p.nameProject && p.nameProject.toLowerCase().includes(q)) ||
      (p.slug && p.slug.toLowerCase().includes(q)) ||
      (p.id && p.id.toLowerCase().includes(q)) ||
      orgName.toLowerCase().includes(q) ||
      creatorName.toLowerCase().includes(q) ||
      creatorEmail.toLowerCase().includes(q)
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
            <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600, background: '#f1f5f9', padding: '0.2rem 0.6rem', borderRadius: '9999px', marginLeft: '0.5rem' }}>
              {projects.length}
            </span>
          </h3>

          <div className={styles.actionsGroup}>
            <input
              type="text"
              placeholder="Tìm theo tên, slug, tổ chức, người tạo..."
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
                <th>Tên Dự Án</th>
                <th>Tổ Chức</th>
                <th>Người Tạo</th>
                <th>VR Scene</th>
                <th>View 360°</th>
                <th className={styles.hideMobile}>Thao Tác</th>
              </tr>
            </thead>
            <tbody>
              {loading && filteredProjects.length === 0 ? (
                <tr>
                  <td colSpan="7" className={styles.emptyState}>
                    <div className={styles.spinner} style={{ margin: '0 auto 0.5rem' }}></div>
                    <p>Đang tải dữ liệu dự án từ API...</p>
                  </td>
                </tr>
              ) : filteredProjects.length === 0 ? (
                <tr>
                  <td colSpan="7" className={styles.emptyState}>
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
                    <p>
                      {searchQuery
                        ? `Không tìm thấy dự án nào khớp với "${searchQuery}".`
                        : 'Chưa có dự án nào trong tổ chức này.'}
                    </p>
                  </td>
                </tr>
              ) : (
                filteredProjects.map((item, index) => {
                  const creator = item.createdBy || {};
                  const creatorName = creator.name || creator.email || 'Hệ thống';
                  const creatorEmail = creator.email || '';
                  const hasVRScene = Boolean(item.idVRScene);

                  return (
                    <tr key={item.id || index}>
                      {/* STT */}
                      <td className={styles.sttCol}>{index + 1}</td>

                      {/* Tên Dự Án & ID */}
                      <td>
                        <div
                          className={styles.projectName}
                          onClick={() => {
                            if (onOpenDetail) onOpenDetail(item);
                            navigate(`/vrscene/${item.id}`, { state: { project: item } });
                          }}
                          style={{ cursor: 'pointer' }}
                          title="Nhấp để mở không gian VR Scene"
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
                          <div>
                            <span style={{ display: 'block', fontWeight: 600 }}>{item.nameProject}</span>
                            <span style={{ fontSize: '0.725rem', color: '#94a3b8', fontFamily: 'monospace' }}>
                              ID: {item.id}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Tổ Chức */}
                      <td>
                        <span className={styles.orgNameBadge}>
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                            <polyline points="9 22 9 12 15 12 15 22" />
                          </svg>
                          {item.organizationName || 'Chưa gán tổ chức'}
                        </span>
                      </td>

                      {/* Người Tạo */}
                      <td>
                        <div className={styles.creatorUser}>
                          <div className={styles.creatorAvatar}>
                            {(creatorName || 'U')[0].toUpperCase()}
                          </div>
                          <div className={styles.creatorInfo}>
                            <span className={styles.creatorName}>
                              {creatorName}
                              {creator.veriffVerified && (
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="3" title="Đã xác thực">
                                  <polyline points="20 6 9 17 4 12" />
                                </svg>
                              )}
                            </span>
                            {creatorEmail && (
                              <span className={styles.creatorEmail}>{creatorEmail}</span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* VR Scene Mặc Định */}
                      <td>
                        {hasVRScene ? (
                          <span className={`${styles.sceneBadge} ${styles.sceneReady}`} title={`Mã Scene: ${item.idVRScene}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                            Đã có cảnh VR
                          </span>
                        ) : (
                          <span className={`${styles.sceneBadge} ${styles.sceneNone}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <circle cx="12" cy="12" r="10" />
                              <line x1="12" y1="8" x2="12" y2="12" />
                              <line x1="12" y1="16" x2="12.01" y2="16" />
                            </svg>
                            Chưa có cảnh
                          </span>
                        )}
                      </td>

                      {/* View 360° */}
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

                      {/* Thao Tác */}
                      <td className={styles.hideMobile}>
                        <div className={styles.actionGroup}>
                          {/* Nút Xem Chi Tiết */}
                          <button
                            className={styles.infoBtn}
                            onClick={() => setSelectedProject(item)}
                            title="Xem chi tiết đầy đủ thông tin dự án"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <circle cx="12" cy="12" r="10" />
                              <line x1="12" y1="16" x2="12" y2="12" />
                              <line x1="12" y1="8" x2="12.01" y2="8" />
                            </svg>
                          </button>

                          {/* Nút Quản Lý VR Scene */}
                          <button
                            className={styles.detailBtn}
                            onClick={() => {
                              if (onOpenDetail) onOpenDetail(item);
                              navigate(`/vrscene/${item.id}`, { state: { project: item } });
                            }}
                            title="Quản lý và biên tập các cảnh VR"
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

                          {/* Nút Xóa Dự Án */}
                          {onDeleteProject && (
                            <button
                              className={styles.deleteBtn}
                              onClick={() => onDeleteProject(item)}
                              title="Xóa dự án này"
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
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL CHI TIẾT ĐẦY ĐỦ THÔNG TIN DỰ ÁN */}
      {selectedProject && (
        <div className={styles.modalOverlay} onClick={() => setSelectedProject(null)}>
          <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                </svg>
                Chi Tiết Dự Án
              </h3>
              <button
                type="button"
                className={styles.closeBtn}
                onClick={() => setSelectedProject(null)}
                title="Đóng cửa sổ"
              >
                ✕
              </button>
            </div>

            <div className={styles.modalBody}>
              <div className={styles.detailGrid}>
                {/* Tên Dự Án */}
                <div className={`${styles.detailItem} ${styles.fullWidth}`}>
                  <span className={styles.itemLabel}>Tên dự án</span>
                  <span className={styles.itemValue} style={{ fontSize: '1.1rem', color: '#0f172a' }}>
                    {selectedProject.nameProject}
                  </span>
                </div>

                {/* Mã ID */}
                <div className={styles.detailItem}>
                  <span className={styles.itemLabel}>Mã định danh ID</span>
                  <span className={styles.itemValue} style={{ fontSize: '0.85rem', fontFamily: 'monospace' }}>
                    {selectedProject.id}
                  </span>
                </div>

                {/* Slug */}
                <div className={styles.detailItem}>
                  <span className={styles.itemLabel}>Đường dẫn Slug</span>
                  <span className={styles.itemValue} style={{ fontSize: '0.85rem', fontFamily: 'monospace', color: '#de913f' }}>
                    {selectedProject.slug}
                  </span>
                </div>

                {/* Tổ Chức */}
                <div className={styles.detailItem}>
                  <span className={styles.itemLabel}>Tổ chức sở hữu</span>
                  <span className={styles.itemValue}>
                    {selectedProject.organizationName || 'Chưa gán tổ chức'}
                  </span>
                  {selectedProject.organizationId && (
                    <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontFamily: 'monospace' }}>
                      ID: {selectedProject.organizationId}
                    </span>
                  )}
                </div>

                {/* Người Tạo */}
                <div className={styles.detailItem}>
                  <span className={styles.itemLabel}>Người khởi tạo</span>
                  <span className={styles.itemValue}>
                    {selectedProject.createdBy?.name || selectedProject.createdBy?.email || 'Hệ thống'}
                  </span>
                  {selectedProject.createdBy?.email && (
                    <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                      {selectedProject.createdBy.email}
                    </span>
                  )}
                </div>

                {/* Cảnh VR Mặc Định */}
                <div className={`${styles.detailItem} ${styles.fullWidth}`}>
                  <span className={styles.itemLabel}>Cảnh VR khởi đầu (idVRScene)</span>
                  <span className={styles.itemValue}>
                    {selectedProject.idVRScene ? (
                      <span style={{ color: '#059669', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        Đã thiết lập (ID: {selectedProject.idVRScene})
                      </span>
                    ) : (
                      <span style={{ color: '#94a3b8' }}>Chưa thiết lập cảnh VR khởi đầu</span>
                    )}
                  </span>
                </div>
              </div>
            </div>

            <div className={styles.modalFooter}>
              <a
                href={`/view/${selectedProject.slug || selectedProject.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.actionBtn}
                style={{ background: '#f8fafc', color: '#0f172a', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
                <span>Xem 360° Trực Tiếp</span>
              </a>

              <button
                type="button"
                className={styles.actionBtn}
                style={{ background: '#de913f', color: '#ffffff', borderColor: '#de913f', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
                onClick={() => {
                  const pId = selectedProject.id;
                  setSelectedProject(null);
                  navigate(`/vrscene/${pId}`, { state: { project: selectedProject } });
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
                <span>Vào Trình Quản Lý VR Scene</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
