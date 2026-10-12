import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import {
  getMyOrganizations,
  createOrganization,
  saveSelectedOrganization,
} from '../../api/organization';
import { logoutUser } from '../../api/auth';
import styles from './OrganizationSelect.module.scss';

export default function OrganizationSelect() {
  const navigate = useNavigate();

  // User info
  const storedUserRaw = localStorage.getItem('auth_user');
  let user = { name: 'Người dùng', email: '' };
  try {
    if (storedUserRaw) user = { ...user, ...JSON.parse(storedUserRaw) };
  } catch { /* ignore */ }

  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [creating, setCreating] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newOrgName, setNewOrgName] = useState('');
  const [newOrgDesc, setNewOrgDesc] = useState('');
  const [createError, setCreateError] = useState('');

  const fetchOrgs = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await getMyOrganizations();
      let list = [];
      if (Array.isArray(res?.result)) {
        list = res.result;
      } else if (res?.result && typeof res.result === 'object') {
        list = [res.result];
      }
      setOrganizations(list);
    } catch (err) {
      console.error('fetchOrgs error:', err);
      setError(err.message || 'Không thể lấy danh sách tổ chức');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrgs();
  }, []);

  // Close modal on Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && showCreateModal) {
        setShowCreateModal(false);
        setCreateError('');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showCreateModal]);

  const handleSelectOrg = (org) => {
    saveSelectedOrganization(org);
    navigate('/dashboard');
  };

  const handleOpenCreateModal = () => {
    setCreateError('');
    setNewOrgName('');
    setNewOrgDesc('');
    setShowCreateModal(true);
  };

  const handleCloseCreateModal = () => {
    if (creating) return;
    setShowCreateModal(false);
    setCreateError('');
  };

  const handleCreateOrg = async (e) => {
    e.preventDefault();
    setCreateError('');
    if (!newOrgName.trim()) {
      setCreateError('Tên tổ chức không được để trống');
      return;
    }
    setCreating(true);
    try {
      const res = await createOrganization({
        name: newOrgName.trim(),
        description: newOrgDesc.trim(),
      });
      const newOrg = res?.result;
      setShowCreateModal(false);
      setNewOrgName('');
      setNewOrgDesc('');
      if (newOrg) {
        setOrganizations((prev) => [newOrg, ...prev]);
        saveSelectedOrganization(newOrg);
        navigate('/dashboard');
      } else {
        await fetchOrgs();
      }
    } catch (err) {
      setCreateError(err.message || 'Không thể tạo tổ chức');
    } finally {
      setCreating(false);
    }
  };

  const handleLogout = () => {
    logoutUser();
    saveSelectedOrganization(null);
    navigate('/login');
  };

  const getRoleLabel = (member) => {
    const role = member?.roleName || member?.role?.name || '';
    const map = { ADMIN: 'Quản trị viên', CREATED: 'Người tạo nội dung', USER: 'Thành viên' };
    return map[role] || role || 'Thành viên';
  };

  const getRoleBadgeClass = (member) => {
    const role = member?.roleName || member?.role?.name || '';
    if (role === 'ADMIN') return styles.badgeAdmin;
    if (role === 'CREATED') return styles.badgeCreated;
    return styles.badgeUser;
  };

  const filteredOrgs = organizations.filter((org) => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return true;
    return (
      (org.name || '').toLowerCase().includes(query) ||
      (org.description || '').toLowerCase().includes(query)
    );
  });

  return (
    <div className={styles.pageWrapper}>
      {/* Subtle Background Glow */}
      <div className={styles.bgGradients}>
        <div className={styles.gradientTop} />
        <div className={styles.gradientBottom} />
      </div>

      {/* Header / Navbar */}
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <div className={styles.logo}>
            <div className={styles.logoIcon}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                <line x1="12" y1="22.08" x2="12" y2="12" />
              </svg>
            </div>
            <span className={styles.logoText}>LifeSpace VR</span>
          </div>

          <div className={styles.headerRight}>
            <div className={styles.userChip}>
              <div className={styles.userAvatar}>
                {(user.name || user.email || 'U')[0].toUpperCase()}
              </div>
              <span className={styles.userName}>{user.name || user.email}</span>
            </div>

            <button
              className={styles.logoutBtn}
              onClick={handleLogout}
              id="org-select-logout-btn"
              title="Đăng xuất khỏi tài khoản"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              <span>Đăng xuất</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className={styles.main}>
        {/* Page Hero Title */}
        <section className={styles.heroSection}>
          <h1 className={styles.heroTitle}>Chọn Tổ Chức</h1>
          <p className={styles.heroSubtitle}>
            Chọn tổ chức bạn muốn làm việc hoặc tạo tổ chức mới.
          </p>
        </section>

        {/* Global Error Banner */}
        {error && (
          <div className={styles.alertError}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <div className={styles.alertContent}>
              <strong>Có lỗi xảy ra:</strong> {error}
            </div>
            <button className={styles.retryBtn} onClick={fetchOrgs}>
              Thử lại
            </button>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className={styles.loadingWrapper}>
            <div className={styles.spinner} />
            <p>Đang tải danh sách tổ chức...</p>
          </div>
        ) : (
          <div className={styles.content}>
            {organizations.length > 0 ? (
              <>
                {/* Action Bar when orgs exist */}
                <div className={styles.actionBar}>
                  <div className={styles.searchBox}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="11" cy="11" r="8" />
                      <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                    <input
                      type="text"
                      placeholder="Tìm kiếm theo tên tổ chức..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className={styles.searchInput}
                    />
                    {searchQuery && (
                      <button
                        className={styles.clearSearchBtn}
                        onClick={() => setSearchQuery('')}
                        title="Xoá tìm kiếm"
                      >
                        ✕
                      </button>
                    )}
                  </div>

                  <button
                    className={styles.primaryActionBtn}
                    onClick={handleOpenCreateModal}
                    id="create-org-btn"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <line x1="12" y1="5" x2="12" y2="19" />
                      <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                    <span>Tạo Tổ Chức Mới</span>
                  </button>
                </div>

                {/* Organizations Grid */}
                {filteredOrgs.length > 0 ? (
                  <div className={styles.orgGrid}>
                    {filteredOrgs.map((org) => (
                      <button
                        key={org.id}
                        className={styles.orgCard}
                        onClick={() => handleSelectOrg(org)}
                        id={`org-card-${org.id}`}
                      >
                        <div className={styles.orgIcon}>
                          {(org.name || 'O')[0].toUpperCase()}
                        </div>
                        <div className={styles.orgInfo}>
                          <h3 className={styles.orgName}>{org.name}</h3>
                          {org.description ? (
                            <p className={styles.orgDesc}>{org.description}</p>
                          ) : (
                            <p className={styles.orgDescPlaceholder}>Không có mô tả</p>
                          )}
                          <div className={styles.orgMeta}>
                            {org.memberCount !== undefined && (
                              <span className={styles.orgMetaItem}>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                                  <circle cx="9" cy="7" r="4" />
                                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                                </svg>
                                {org.memberCount} thành viên
                              </span>
                            )}
                            {(org.roleName || org.role) && (
                              <span className={`${styles.roleBadge} ${getRoleBadgeClass(org)}`}>
                                {getRoleLabel(org)}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className={styles.orgArrow}>
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <polyline points="9 18 15 12 9 6" />
                          </svg>
                        </div>
                      </button>
                    ))}

                    {/* Quick Add Card */}
                    <button
                      className={styles.addOrgCard}
                      onClick={handleOpenCreateModal}
                      title="Tạo thêm tổ chức mới"
                    >
                      <div className={styles.addOrgIcon}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <line x1="12" y1="5" x2="12" y2="19" />
                          <line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                      </div>
                      <span className={styles.addOrgText}>Tạo tổ chức khác</span>
                    </button>
                  </div>
                ) : (
                  <div className={styles.noSearchResults}>
                    <p>Không tìm thấy tổ chức nào khớp với từ khóa "{searchQuery}"</p>
                    <button
                      className={styles.clearSearchBtnAlt}
                      onClick={() => setSearchQuery('')}
                    >
                      Xem tất cả
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className={styles.emptyCard}>
                <div className={styles.emptyIcon}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <line x1="23" y1="11" x2="17" y2="11" />
                    <line x1="20" y1="8" x2="20" y2="14" />
                  </svg>
                </div>

                <h2 className={styles.emptyTitle}>Chưa có tổ chức nào</h2>
                <p className={styles.emptySubtitle}>
                  Bạn chưa thuộc tổ chức nào. Hãy tạo tổ chức đầu tiên để bắt đầu quản lý dự án và thành viên.
                </p>

                <button
                  className={styles.emptyCreateBtn}
                  onClick={handleOpenCreateModal}
                  id="create-org-btn"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                  <span>Tạo Tổ Chức Mới</span>
                </button>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Modal Tạo Tổ Chức Mới */}
      {showCreateModal && (
        <div className={styles.modalBackdrop} onClick={handleCloseCreateModal}>
          <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div className={styles.modalHeaderTitle}>
                <div className={styles.modalIconBox}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    <polyline points="9 22 9 12 15 12 15 22" />
                  </svg>
                </div>
                <div>
                  <h3>Tạo tổ chức mới</h3>
                  <p>Khởi tạo không gian làm việc cho nhóm của bạn</p>
                </div>
              </div>

              <button
                type="button"
                className={styles.modalCloseBtn}
                onClick={handleCloseCreateModal}
                disabled={creating}
                title="Đóng cửa sổ"
              >
                ✕
              </button>
            </div>

            {createError && (
              <div className={styles.modalError}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <span>{createError}</span>
              </div>
            )}

            <form onSubmit={handleCreateOrg} className={styles.modalForm}>
              <div className={styles.formGroup}>
                <label htmlFor="new-org-name">
                  Tên tổ chức <span className={styles.req}>*</span>
                </label>
                <input
                  id="new-org-name"
                  type="text"
                  placeholder="Ví dụ: LifeSpace Studio, VR Interior..."
                  value={newOrgName}
                  onChange={(e) => setNewOrgName(e.target.value)}
                  className={styles.input}
                  disabled={creating}
                  autoFocus
                />
                <span className={styles.inputHint}>Tên định danh hiển thị trên thanh điều hướng và báo cáo</span>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="new-org-desc">Mô tả tổ chức</label>
                <textarea
                  id="new-org-desc"
                  rows="3"
                  placeholder="Mô tả ngắn gọn về phạm vi hoạt động của tổ chức (tùy chọn)"
                  value={newOrgDesc}
                  onChange={(e) => setNewOrgDesc(e.target.value)}
                  className={styles.textarea}
                  disabled={creating}
                />
              </div>

              <div className={styles.modalActions}>
                <button
                  type="button"
                  className={styles.cancelBtn}
                  onClick={handleCloseCreateModal}
                  disabled={creating}
                >
                  Huỷ
                </button>
                <button
                  type="submit"
                  className={styles.submitBtn}
                  disabled={creating}
                  id="create-org-submit-btn"
                >
                  {creating ? (
                    <>
                      <span className={styles.spinnerSm} />
                      Đang khởi tạo...
                    </>
                  ) : (
                    'Tạo tổ chức'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
