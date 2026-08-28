import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import AuthCard from '../../components/auth/AuthCard';
import RegisterForm from '../../components/auth/RegisterForm';
import AlertBox from '../../components/common/AlertBox';
import { registerUser } from '../../api/auth';

export default function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleRegisterSubmit = async ({ name, email, password, confirmPassword }) => {
    setErrorMsg('');
    setSuccessMsg('');

    if (!name?.trim() || !email?.trim() || !password) {
      setErrorMsg('Vui lòng điền đầy đủ các thông tin bắt buộc.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('Xác nhận mật khẩu không trùng khớp.');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Mật khẩu phải có ít nhất 6 ký tự.');
      return;
    }

    setLoading(true);
    try {
      await registerUser({
        name: name.trim(),
        email: email.trim(),
        password,
      });

      setSuccessMsg('Đăng ký thành công! Đang chuyển đến trang Đăng nhập...');
      setTimeout(() => {
        navigate('/login');
      }, 1200);
    } catch (err) {
      console.error('API registerUser Error:', err);
      setErrorMsg(err.message || 'Đã có lỗi xảy ra trong quá trình đăng ký!');
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
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <line x1="19" y1="8" x2="19" y2="14" />
          <line x1="16" y1="11" x2="22" y2="11" />
        </svg>
      }
      title="Tạo Tài Khoản"
      subtitle="Trải nghiệm không gian thực tế ảo ấn tượng với LifeSpace VR."
      footerText="Đã có tài khoản?"
      footerLinkText="Đăng nhập"
      footerLinkTo="/login"
    >
      <AlertBox type="error" message={errorMsg} />
      <AlertBox type="success" message={successMsg} />

      <RegisterForm onSubmit={handleRegisterSubmit} loading={loading} />
    </AuthCard>
  );
}
