import React, { useState } from 'react';
import styles from './UserTable.module.scss';

export default function UserTable({
  users = [],
  loading = false,
  onRefresh,
  onOpenCreateModal,
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState(null);

  const handleCopyId = (id) => {
    if (!id) return;
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  const filteredUsers = users.filter((u) => {
    const q = searchQuery.toLowerCase();
    return (
      (u.name && u.name.toLowerCase().includes(q)) ||
      (u.email && u.email.toLowerCase().includes(q)) ||
      (u.id && u.id.toLowerCase().includes(q))
    );
  });

  return (
    <div className={styles.userTableWrapper}>
      {/* TABLE CARD */}
      <div className={styles.tableCard}>
        {/* HEADER BAR */}
        <div className={styles.tableHeader}>
          <h3 className={styles.headerTitle}>
            <span className={styles.titleIcon}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </span>
            <span>Danh Sách Người Dùng</span>
            <span className={styles.badgeCount}>{users.length}</span>
          </h3>

          <div className={styles.actionsGroup}>
            {/* Search Box */}
            <div className={styles.searchBox}>
              <svg
                className={styles.searchIcon}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                placeholder="Tìm kiếm theo tên, email, ID..."
                className={styles.searchInput}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Refresh Button */}
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

            {/* Add User Button */}
            {onOpenCreateModal && (
              <button
                className={styles.addBtn}
                onClick={onOpenCreateModal}
                title="Thêm người dùng mới"
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
                <span>Thêm người dùng</span>
              </button>
            )}
          </div>
        </div>

        {/* TABLE BODY */}
        <div className={styles.tableResponsive}>
          {loading && users.length === 0 ? (
            <div className={styles.loadingState}>
              <div className={styles.spinner}></div>
              <span>Đang tải danh sách người dùng...</span>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className={styles.emptyState}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
              </svg>
              <p>Chưa có người dùng nào hoặc không tìm thấy kết quả phù hợp.</p>
            </div>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th style={{ width: '60px' }}>STT</th>
                  <th>Họ và Tên</th>
                  <th>Email</th>
                  <th>Chức vụ (Owner)</th>
                  <th>Xác thực Veriff</th>
                  <th>Mã ID người dùng</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((userItem, idx) => {
                  const isOwner = Boolean(userItem.owner);
                  const isVerified = Boolean(userItem.veriffVerified);

                  return (
                    <tr key={userItem.id || idx}>
                      {/* STT */}
                      <td style={{ fontWeight: '600', color: '#64748b' }}>{idx + 1}</td>

                      {/* Name & Avatar */}
                      <td>
                        <div className={styles.userCell}>
                          <div
                            className={`${styles.avatar} ${
                              isOwner ? styles.ownerAvatar : styles.memberAvatar
                            }`}
                          >
                            {(userItem.name || userItem.email || 'U')
                              .charAt(0)
                              .toUpperCase()}
                          </div>
                          <div className={styles.userInfoText}>
                            <span className={styles.userName}>
                              {userItem.name || 'Chưa cập nhật tên'}
                            </span>
                            <span className={styles.userEmailSub}>{userItem.email}</span>
                          </div>
                        </div>
                      </td>

                      {/* Email */}
                      <td>
                        <span className={styles.emailText}>{userItem.email}</span>
                      </td>

                      {/* Owner Role Badge */}
                      <td>
                        {isOwner ? (
                          <span className={`${styles.roleBadge} ${styles.ownerRole}`}>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                            </svg>
                            Owner (Chủ sở hữu)
                          </span>
                        ) : (
                          <span className={`${styles.roleBadge} ${styles.memberRole}`}>
                            Thành viên
                          </span>
                        )}
                      </td>

                      {/* Veriff Verified Status Badge */}
                      <td>
                        {isVerified ? (
                          <span className={`${styles.veriffBadge} ${styles.verified}`}>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="12"
                              height="12"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="3"
                            >
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                            Đã xác thực
                          </span>
                        ) : (
                          <span className={`${styles.veriffBadge} ${styles.unverified}`}>
                            Chưa xác thực
                          </span>
                        )}
                      </td>

                      {/* Copyable User ID */}
                      <td>
                        <div className={styles.idChip}>
                          <span>{userItem.id}</span>
                          <button
                            className={styles.copyBtn}
                            onClick={() => handleCopyId(userItem.id)}
                            title={copiedId === userItem.id ? 'Đã sao chép!' : 'Sao chép ID'}
                          >
                            {copiedId === userItem.id ? (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="#16a34a"
                                strokeWidth="2.5"
                              >
                                <polyline points="20 6 9 17 4 12" />
                              </svg>
                            ) : (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                              >
                                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                              </svg>
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
