import React, { useState } from 'react';
import styles from '../Project/Project.module.scss';

export default function UserTable({
  users = [],
  loading = false,
  onRefresh,
  onOpenCreateModal,
}) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredUsers = users.filter((u) => {
    const q = searchQuery.toLowerCase();
    return (
      (u.name && u.name.toLowerCase().includes(q)) ||
      (u.email && u.email.toLowerCase().includes(q)) ||
      (u.id && u.id.toLowerCase().includes(q))
    );
  });

  return (
    <div className={styles.projectWrapper}>
      {/* USERS TABLE CARD */}
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
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            Danh Sách Người Dùng ({users.length})
          </h3>

          <div className={styles.actionsGroup}>
            <input
              type="text"
              placeholder="Tìm kiếm người dùng..."
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

        {/* TABLE CONTENT */}
        <div className={styles.tableResponsive}>
          {loading && users.length === 0 ? (
            <div className={styles.loadingContainer}>
              <div className={styles.spinner}></div>
              <span>Đang tải danh sách người dùng...</span>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className={styles.emptyContainer}>
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
                  <th>STT</th>
                  <th>Họ và Tên</th>
                  <th>Email</th>
                  <th>Chức vụ (Owner)</th>
                  <th>Xác thực Veriff</th>
                  <th>Mã ID</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((userItem, idx) => (
                  <tr key={userItem.id || idx}>
                    <td style={{ fontWeight: '600', color: '#64748b' }}>{idx + 1}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div
                          style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '50%',
                            background: userItem.ower ? '#de913f' : '#3b82f6',
                            color: '#ffffff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: '700',
                            fontSize: '0.875rem',
                          }}
                        >
                          {(userItem.name || 'U').charAt(0).toUpperCase()}
                        </div>
                        <span style={{ fontWeight: '600', color: '#0f172a' }}>
                          {userItem.name || 'Chưa cập nhật'}
                        </span>
                      </div>
                    </td>
                    <td style={{ color: '#475569' }}>{userItem.email}</td>
                    <td>
                      {userItem.ower ? (
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            padding: '0.25rem 0.65rem',
                            borderRadius: '20px',
                            fontSize: '0.75rem',
                            fontWeight: '600',
                            background: 'rgba(222, 145, 63, 0.15)',
                            color: '#c2782b',
                            border: '1px solid rgba(222, 145, 63, 0.3)',
                          }}
                        >
                          Owner (Chủ sở hữu)
                        </span>
                      ) : (
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            padding: '0.25rem 0.65rem',
                            borderRadius: '20px',
                            fontSize: '0.75rem',
                            fontWeight: '600',
                            background: '#f1f5f9',
                            color: '#64748b',
                            border: '1px solid #e2e8f0',
                          }}
                        >
                          Thành viên
                        </span>
                      )}
                    </td>
                    <td>
                      {userItem.veriffVerified ? (
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            padding: '0.25rem 0.65rem',
                            borderRadius: '20px',
                            fontSize: '0.75rem',
                            fontWeight: '600',
                            background: 'rgba(34, 197, 94, 0.15)',
                            color: '#15803d',
                            border: '1px solid rgba(34, 197, 94, 0.3)',
                          }}
                        >
                          ✓ Đã xác thực
                        </span>
                      ) : (
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            padding: '0.25rem 0.65rem',
                            borderRadius: '20px',
                            fontSize: '0.75rem',
                            fontWeight: '600',
                            background: '#f1f5f9',
                            color: '#94a3b8',
                            border: '1px solid #e2e8f0',
                          }}
                        >
                          Chưa xác thực
                        </span>
                      )}
                    </td>
                    <td style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: '#64748b' }}>
                      {userItem.id}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
