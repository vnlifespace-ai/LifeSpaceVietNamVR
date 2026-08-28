import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import AuthCard from '../../components/auth/AuthCard';
import LoginForm from '../../components/auth/LoginForm';
import AlertBox from '../../components/common/AlertBox';
import { loginUser } from '../../api/auth';

export default function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleLoginSubmit = async ({ email, password }) => {
    setErrorMsg('');
    setSuccessMsg('');

    if (!email?.trim() || !password) {
      setErrorMsg('Vui lòng nhập đầy đủ Email và Mật khẩu.');
      return;
    }

    setLoading(true);
    try {
      await loginUser({
        email: email.trim(),
        password,
      });

      setSuccessMsg('Đăng nhập thành công! Đang chuyển đến Dashboard...');
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);
    } catch (err) {
      console.error('API loginUser Error:', err);
      setErrorMsg(err.message || 'Đã có lỗi xảy ra khi đăng nhập!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard
      icon={
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M2 12h20" />
          <path d="M20 12v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8" />
          <path d="m4 8 16-4" />
          <circle cx="12" cy="14" r="3" />
        </svg>
      }
      title="Đăng Nhập"
      subtitle="Chào mừng trở lại! Vui lòng nhập thông tin tài khoản LifeSpace VR."
      footerText="Chưa có tài khoản?"
      footerLinkText="Đăng ký ngay"
      footerLinkTo="/register"
    >
      <AlertBox type="error" message={errorMsg} />
      <AlertBox type="success" message={successMsg} />

      <LoginForm onSubmit={handleLoginSubmit} loading={loading} />
    </AuthCard>
  );
}
