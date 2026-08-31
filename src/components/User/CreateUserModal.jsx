import React, { useState } from 'react';
import Modal from '../common/Modal';
import AlertBox from '../common/AlertBox';
import styles from './CreateUserModal.module.scss';

export default function CreateUserModal({ isOpen, onClose, onSubmit, creating = false }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.password) {
      setErrorMsg('Vui lòng điền đầy đủ tất cả các trường thông tin!');
      return;
    }

    setErrorMsg('');

    try {
      if (onSubmit) {
        await onSubmit({
          name: formData.name.trim(),
          email: formData.email.trim(),
          password: formData.password,
        });
      }
      setFormData({ name: '', email: '', password: '' });
      onClose();
    } catch (err) {
      console.error('CreateUserModal submit error:', err);
      setErrorMsg(err.message || 'Không thể tạo người dùng. Vui lòng thử lại!');
    }
  };

  const footerButtons = (
    <>
      <button type="button" className={styles.cancelBtn} onClick={onClose}>
        Hủy
      </button>
      <button
        type="submit"
        form="createUserForm"
        className={styles.submitBtn}
        disabled={creating}
      >
        {creating ? (
          <>
            <span className={styles.spinner}></span>
            <span>Đang xử lý...</span>
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
            <span>Tạo Người Dùng</span>
          </>
        )}
      </button>
    </>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Thêm Người Dùng Mới"
      icon={
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="8.5" cy="7" r="4" />
          <line x1="20" y1="8" x2="20" y2="14" />
          <line x1="23" y1="11" x2="17" y2="11" />
        </svg>
      }
      footer={footerButtons}
    >
      <AlertBox type="error" message={errorMsg} />

      <form id="createUserForm" onSubmit={handleSubmit} className={styles.form}>
        {/* Name Input */}
        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="userNameInput">
            Họ và tên <span className={styles.required}>*</span>
          </label>
          <div className={styles.inputWrapper}>
            <span className={styles.inputIcon}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </span>
            <input
              id="userNameInput"
              type="text"
              name="name"
              className={styles.input}
              placeholder="Ví dụ: Nguyễn Văn A"
              value={formData.name}
              onChange={handleChange}
              required
              autoFocus
            />
          </div>
        </div>

        {/* Email Input */}
        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="userEmailInput">
            Địa chỉ Email <span className={styles.required}>*</span>
          </label>
          <div className={styles.inputWrapper}>
            <span className={styles.inputIcon}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
            </span>
            <input
              id="userEmailInput"
              type="email"
              name="email"
              className={styles.input}
              placeholder="Ví dụ: user@lifespace.vn"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* Password Input */}
        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="userPasswordInput">
            Mật khẩu <span className={styles.required}>*</span>
          </label>
          <div className={styles.inputWrapper}>
            <span className={styles.inputIcon}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </span>
            <input
              id="userPasswordInput"
              type="password"
              name="password"
              className={styles.input}
              placeholder="Nhập mật khẩu cho tài khoản mới"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
        </div>
      </form>
    </Modal>
  );
}
