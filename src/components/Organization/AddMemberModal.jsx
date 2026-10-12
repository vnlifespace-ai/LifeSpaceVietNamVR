import React, { useState } from 'react';
import Modal from '../common/Modal';
import styles from './AddMemberModal.module.scss';

export default function AddMemberModal({
  isOpen = false,
  onClose,
  onSubmit,
  loading = false,
}) {
  const [emailOrUserId, setEmailOrUserId] = useState('');
  const [roleName, setRoleName] = useState('USER');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const cleanInput = emailOrUserId.trim();
    if (!cleanInput) {
      setErrorMsg('Vui lòng nhập địa chỉ Email hoặc ID người dùng!');
      return;
    }

    setErrorMsg('');
    try {
      // If contains '@', assume email, else userId
      const isEmail = cleanInput.includes('@');
      const payload = {
        roleName,
        ...(isEmail ? { email: cleanInput } : { userId: cleanInput }),
      };

      await onSubmit(payload);
      setEmailOrUserId('');
      setRoleName('USER');
      onClose();
    } catch (err) {
      setErrorMsg(err.message || 'Không thể thêm thành viên. Vui lòng kiểm tra lại!');
    }
  };

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
        form="add-member-form"
        className={styles.submitBtn}
        disabled={loading}
        id="submit-add-member-btn"
      >
        {loading ? (
          <>
            <span className={styles.spinnerSm} />
            <span>Đang thêm...</span>
          </>
        ) : (
          <span>Thêm thành viên</span>
        )}
      </button>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={loading ? undefined : onClose}
      title="Thêm thành viên vào tổ chức"
      icon={
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="8.5" cy="7" r="4" />
          <line x1="20" y1="8" x2="20" y2="14" />
          <line x1="23" y1="11" x2="17" y2="11" />
        </svg>
      }
      footer={footer}
    >
      <form id="add-member-form" onSubmit={handleSubmit} className={styles.modalForm}>
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

        {/* Email or User ID Input */}
        <div className={styles.formGroup}>
          <label htmlFor="member-identity-input">
            Email hoặc ID người dùng <span className={styles.req}>*</span>
          </label>
          <div className={styles.inputWrapper}>
            <span className={styles.inputIcon}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
            </span>
            <input
              id="member-identity-input"
              type="text"
              placeholder="Ví dụ: member@lifespace.vn hoặc UUID người dùng"
              value={emailOrUserId}
              onChange={(e) => setEmailOrUserId(e.target.value)}
              disabled={loading}
              autoFocus
              required
            />
          </div>
          <span className={styles.inputHint}>
            Người dùng cần phải có tài khoản đã đăng ký trong hệ thống LifeSpace VR.
          </span>
        </div>

        {/* Role Selection */}
        <div className={styles.formGroup}>
          <label>Vai trò trong tổ chức <span className={styles.req}>*</span></label>
          <div className={styles.roleSelectGroup}>
            {/* USER */}
            <label
              className={`${styles.roleOption} ${roleName === 'USER' ? styles.roleSelected : ''}`}
            >
              <input
                type="radio"
                name="roleName"
                value="USER"
                checked={roleName === 'USER'}
                onChange={() => setRoleName('USER')}
                disabled={loading}
              />
              <div className={styles.roleText}>
                <span className={styles.roleTitle}>Thành viên (USER)</span>
                <span className={styles.roleDesc}>
                  Có quyền xem các dự án 360° được chia sẻ trong tổ chức.
                </span>
              </div>
            </label>

            {/* CREATED */}
            <label
              className={`${styles.roleOption} ${roleName === 'CREATED' ? styles.roleSelected : ''}`}
            >
              <input
                type="radio"
                name="roleName"
                value="CREATED"
                checked={roleName === 'CREATED'}
                onChange={() => setRoleName('CREATED')}
                disabled={loading}
              />
              <div className={styles.roleText}>
                <span className={styles.roleTitle}>Người tạo nội dung (CREATED)</span>
                <span className={styles.roleDesc}>
                  Có quyền tạo mới, cấu hình và biên tập các cảnh thực tế ảo 360°.
                </span>
              </div>
            </label>

            {/* ADMIN */}
            <label
              className={`${styles.roleOption} ${roleName === 'ADMIN' ? styles.roleSelected : ''}`}
            >
              <input
                type="radio"
                name="roleName"
                value="ADMIN"
                checked={roleName === 'ADMIN'}
                onChange={() => setRoleName('ADMIN')}
                disabled={loading}
              />
              <div className={styles.roleText}>
                <span className={styles.roleTitle}>Quản trị viên (ADMIN)</span>
                <span className={styles.roleDesc}>
                  Quản lý các dự án và hỗ trợ quản trị các thành viên trong tổ chức.
                </span>
              </div>
            </label>
          </div>
        </div>
      </form>
    </Modal>
  );
}
