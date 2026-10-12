import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import styles from './AddMemberModal.module.scss';

export default function ChangeRoleModal({
  isOpen = false,
  member = null,
  onClose,
  onSubmit,
  loading = false,
}) {
  const [roleName, setRoleName] = useState('USER');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (member) {
      const currentRole = member?.role?.name || member?.roleName || 'USER';
      setRoleName(currentRole);
      setErrorMsg('');
    }
  }, [member]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!member?.id) return;
    setErrorMsg('');
    try {
      await onSubmit(member.id, roleName);
      onClose();
    } catch (err) {
      setErrorMsg(err.message || 'Không thể cập nhật vai trò thành viên!');
    }
  };

  const memberName = member?.user?.name || member?.user?.email || 'thành viên này';

  const footer = (
    <div className={styles.modalFooter}>
      <button
        type="button"
        className={styles.cancelBtn}
        onClick={onClose}
        disabled={loading}
      >
        Hủy
      </button>
      <button
        type="submit"
        form="change-role-form"
        className={styles.submitBtn}
        disabled={loading}
      >
        {loading ? (
          <>
            <span className={styles.spinnerSm} />
            <span>Đang lưu...</span>
          </>
        ) : (
          <span>Cập nhật vai trò</span>
        )}
      </button>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={loading ? undefined : onClose}
      title="Thay đổi vai trò thành viên"
      icon={
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
        </svg>
      }
      footer={footer}
    >
      <form id="change-role-form" onSubmit={handleSubmit} className={styles.modalForm}>
        {errorMsg && (
          <div className={styles.errorBanner}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span>{errorMsg}</span>
          </div>
        )}

        <p style={{ margin: 0, fontSize: '0.9rem', color: '#475569' }}>
          Chọn vai trò mới cho <strong>{memberName}</strong>:
        </p>

        <div className={styles.roleSelectGroup}>
          {/* USER */}
          <label
            className={`${styles.roleOption} ${roleName === 'USER' ? styles.roleSelected : ''}`}
          >
            <input
              type="radio"
              name="changeRole"
              value="USER"
              checked={roleName === 'USER'}
              onChange={() => setRoleName('USER')}
              disabled={loading}
            />
            <div className={styles.roleText}>
              <span className={styles.roleTitle}>Thành viên (USER)</span>
              <span className={styles.roleDesc}>
                Chỉ xem và tương tác với các dự án thực tế ảo được chia sẻ.
              </span>
            </div>
          </label>

          {/* CREATED */}
          <label
            className={`${styles.roleOption} ${roleName === 'CREATED' ? styles.roleSelected : ''}`}
          >
            <input
              type="radio"
              name="changeRole"
              value="CREATED"
              checked={roleName === 'CREATED'}
              onChange={() => setRoleName('CREATED')}
              disabled={loading}
            />
            <div className={styles.roleText}>
              <span className={styles.roleTitle}>Người tạo nội dung (CREATED)</span>
              <span className={styles.roleDesc}>
                Được phép tạo mới và chỉnh sửa các cảnh thực tế ảo 360°.
              </span>
            </div>
          </label>

          {/* ADMIN */}
          <label
            className={`${styles.roleOption} ${roleName === 'ADMIN' ? styles.roleSelected : ''}`}
          >
            <input
              type="radio"
              name="changeRole"
              value="ADMIN"
              checked={roleName === 'ADMIN'}
              onChange={() => setRoleName('ADMIN')}
              disabled={loading}
            />
            <div className={styles.roleText}>
              <span className={styles.roleTitle}>Quản trị viên (ADMIN)</span>
              <span className={styles.roleDesc}>
                Quản lý các tài nguyên và quản trị các thành viên khác trong tổ chức.
              </span>
            </div>
          </label>
        </div>
      </form>
    </Modal>
  );
}
