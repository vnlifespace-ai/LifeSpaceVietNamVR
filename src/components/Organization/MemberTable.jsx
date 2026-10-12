import React, { useState } from 'react';
import styles from './MemberTable.module.scss';

export default function MemberTable({
  members = [],
  loading = false,
  isOrgOwner = false,
  currentUserId = '',
  onRefresh,
  onOpenAddModal,
  onOpenEditRole,
  onOpenDeleteModal,
}) {
  const [searchQuery, setSearchQuery] = useState('');

  const getRoleBadge = (roleName) => {
    const r = (roleName || '').toUpperCase();
    if (r === 'OWNER') {
      return {
        label: 'Chủ sở hữu',
        className: styles.ownerRole,
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        ),
      };
    }
    if (r === 'ADMIN') {
      return {
        label: 'Quản trị viên',
        className: styles.adminRole,
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
        ),
      };
    }
    if (r === 'CREATED') {
      return {
        label: 'Người tạo nội dung',
        className: styles.creatorRole,
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 20h9" />
            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
          </svg>
        ),
      };
    }
    return {
      label: 'Thành viên',
      className: styles.userRole,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="7" r="4" />
          <path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" />
        </svg>
      ),
    };
  };

  const filteredMembers = members.filter((m) => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return true;
    const userObj = m?.user || {};
    const name = (userObj.name || m.userName || '').toLowerCase();
    const email = (userObj.email || m.email || '').toLowerCase();
    const role = (m?.role?.name || m?.roleName || '').toLowerCase();
    return name.includes(q) || email.includes(q) || role.includes(q);
  });

  return (
    <div className={styles.tableContainer}>
      {/* Table Header Bar */}
      <div className={styles.tableHeader}>
        <div className={styles.titleArea}>
          <div className={styles.titleIcon}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </div>
          <h3 className={styles.titleText}>
            Thành Viên Tổ Chức
            <span className={styles.badgeCount}>{members.length}</span>
          </h3>
        </div>

        <div className={styles.actionsGroup}>
          {/* Search Box */}
          <div className={styles.searchBox}>
            <svg className={styles.searchIcon} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder="Tìm theo tên, email, vai trò..."
              className={styles.searchInput}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                type="button"
                className={styles.clearBtn}
                onClick={() => setSearchQuery('')}
                title="Xóa tìm kiếm"
              >
                ✕
              </button>
            )}
          </div>

          {/* Refresh Button */}
          {onRefresh && (
            <button
              type="button"
              className={styles.refreshBtn}
              onClick={onRefresh}
              disabled={loading}
              title="Tải lại danh sách"
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

          {/* Add Member Button (Chỉ hiển thị cho Owner) */}
          {isOrgOwner && onOpenAddModal && (
            <button
              type="button"
              className={styles.addBtn}
              onClick={onOpenAddModal}
              id="org-add-member-btn"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              <span>Thêm thành viên</span>
            </button>
          )}
        </div>
      </div>

      {/* Table Content */}
      <div className={styles.tableResponsive}>
        {loading && members.length === 0 ? (
          <div className={styles.loadingState}>
            <div className={styles.spinner} />
            <span>Đang tải danh sách thành viên...</span>
          </div>
        ) : filteredMembers.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <line x1="23" y1="11" x2="17" y2="11" />
              </svg>
            </div>
            <h4>Không có thành viên nào</h4>
            <p>
              {searchQuery
                ? `Không tìm thấy thành viên nào khớp với "${searchQuery}".`
                : 'Tổ chức này chưa có thành viên nào khác hoặc bạn chưa thêm ai.'}
            </p>
          </div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th style={{ width: '50px' }}>STT</th>
                <th>Thành viên</th>
                <th>Email</th>
                <th>Vai trò</th>
                <th>Ngày tham gia</th>
                <th>Xác thực</th>
                <th style={{ textAlign: 'right' }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredMembers.map((member, index) => {
                const userObj = member?.user || {};
                const name = userObj.name || userObj.email || member.userName || 'Thành viên';
                const email = userObj.email || member.email || 'Chưa có email';
                const roleName = member?.role?.name || member?.roleName || 'USER';
                const roleBadge = getRoleBadge(roleName);
                const isVerified = Boolean(userObj.veriffVerified);
                const isSelf = currentUserId && userObj.id === currentUserId;
                const isMemberOwner = roleName.toUpperCase() === 'OWNER';

                let avatarCls = styles.avatar;
                if (roleName === 'OWNER') avatarCls += ` ${styles.ownerAvatar}`;
                else if (roleName === 'ADMIN') avatarCls += ` ${styles.adminAvatar}`;
                else if (roleName === 'CREATED') avatarCls += ` ${styles.creatorAvatar}`;

                return (
                  <tr key={member.id || index}>
                    {/* Index */}
                    <td style={{ color: '#94a3b8', fontWeight: 600 }}>{index + 1}</td>

                    {/* Member Info */}
                    <td>
                      <div className={styles.userCell}>
                        <div className={avatarCls}>
                          {(name || 'U')[0].toUpperCase()}
                        </div>
                        <div className={styles.userInfo}>
                          <span className={styles.userName}>
                            {name}
                            {isSelf && (
                              <span style={{ fontSize: '0.725rem', color: '#de913f', marginLeft: '0.4rem', fontWeight: 700 }}>
                                (Bạn)
                              </span>
                            )}
                          </span>
                          <span className={styles.userEmail}>{email}</span>
                        </div>
                      </div>
                    </td>

                    {/* Email */}
                    <td>
                      <span style={{ color: '#475569' }}>{email}</span>
                    </td>

                    {/* Role Badge */}
                    <td>
                      <span className={`${styles.roleBadge} ${roleBadge.className}`}>
                        {roleBadge.icon}
                        <span>{roleBadge.label}</span>
                      </span>
                    </td>

                    {/* Joined Date */}
                    <td>
                      <span style={{ color: '#64748b', fontSize: '0.825rem' }}>
                        {member.joinedAt
                          ? new Date(member.joinedAt).toLocaleDateString('vi-VN', {
                              year: 'numeric',
                              month: '2-digit',
                              day: '2-digit',
                            })
                          : '—'}
                      </span>
                    </td>

                    {/* Verification Status */}
                    <td>
                      {isVerified ? (
                        <span className={`${styles.veriffBadge} ${styles.verified}`}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
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

                    {/* Actions */}
                    <td style={{ textAlign: 'right' }}>
                      <div className={styles.actionBtns} style={{ justifyContent: 'flex-end' }}>
                        {/* Owner can edit roles of other members */}
                        {isOrgOwner && !isMemberOwner && onOpenEditRole && (
                          <button
                            type="button"
                            className={styles.editRoleBtn}
                            onClick={() => onOpenEditRole(member)}
                            title="Đổi vai trò"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                            </svg>
                            <span>Đổi vai trò</span>
                          </button>
                        )}

                        {/* Owner can remove non-owner members */}
                        {isOrgOwner && !isMemberOwner && onOpenDeleteModal && (
                          <button
                            type="button"
                            className={styles.deleteBtn}
                            onClick={() => onOpenDeleteModal(member, false)}
                            title="Xóa khỏi tổ chức"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <polyline points="3 6 5 6 21 6" />
                              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                            </svg>
                            <span>Xóa</span>
                          </button>
                        )}

                        {/* Non-owner can leave organization if it's themselves */}
                        {!isOrgOwner && isSelf && onOpenDeleteModal && (
                          <button
                            type="button"
                            className={styles.leaveBtn}
                            onClick={() => onOpenDeleteModal(member, true)}
                            title="Rời khỏi tổ chức này"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                              <polyline points="16 17 21 12 16 7" />
                              <line x1="21" y1="12" x2="9" y2="12" />
                            </svg>
                            <span>Rời tổ chức</span>
                          </button>
                        )}
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
  );
}
