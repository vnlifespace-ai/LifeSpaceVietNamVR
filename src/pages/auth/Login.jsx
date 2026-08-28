import React from 'react';
import AuthCard from '../../components/auth/AuthCard';
import LoginForm from '../../components/auth/LoginForm';

export default function Login() {
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
      <LoginForm />
    </AuthCard>
  );
}
