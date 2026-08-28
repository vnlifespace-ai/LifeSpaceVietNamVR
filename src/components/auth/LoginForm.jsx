import React, { useState } from 'react';
import InputGroup from '../common/InputGroup';
import styles from './LoginForm.module.scss';

export default function LoginForm({ onSubmit, loading = false }) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(formData);
    }
  };

  return (
    <form className={styles.authForm} onSubmit={handleSubmit}>
      <InputGroup
        id="email"
        label="Email"
        type="email"
        name="email"
        placeholder="vd: user@example.com"
        value={formData.email}
        onChange={handleChange}
        required
        autoComplete="email"
        icon={
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
        }
      />

      <InputGroup
        id="password"
        label="Mật khẩu"
        name="password"
        placeholder="Nhập mật khẩu của bạn"
        value={formData.password}
        onChange={handleChange}
        required
        isPassword
        autoComplete="current-password"
        icon={
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
        }
      />

      <button type="submit" className={styles.submitBtn} disabled={loading}>
        {loading ? (
          <>
            <span className={styles.spinner}></span>
            <span>Đang xử lý...</span>
          </>
        ) : (
          <span>Đăng Nhập</span>
        )}
      </button>
    </form>
  );
}
