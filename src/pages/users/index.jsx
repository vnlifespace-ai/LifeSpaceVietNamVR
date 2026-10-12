import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import UserTable from '../../components/User/UserTable';
import CreateUserModal from '../../components/User/CreateUserModal';
import AlertBox from '../../components/common/AlertBox';
import { getUsers, createUser } from '../../api/user';
import styles from '../dashboard/Dashboard.module.scss';

export default function UsersPage() {
  // Read stored user info
  const storedUserRaw = localStorage.getItem('auth_user');
  let user = { name: 'Người dùng VR', email: 'user@lifespace.vr' };
  if (storedUserRaw) {
    try {
      user = { ...user, ...JSON.parse(storedUserRaw) };
    } catch {
      // Fallback
    }
  }

  // --- STATE MANAGEMENT ---
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Alert feedback messages
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // --- API HANDLERS ---
  const fetchUsersList = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await getUsers();
      let list = [];
      if (Array.isArray(res?.result)) {
        list = res.result;
      } else if (res?.result && typeof res.result === 'object') {
        list = [res.result];
      }
      setUsers(list);
    } catch (err) {
      console.warn('API getUsers Error:', err);
      setErrorMsg(err.message || 'Không thể lấy danh sách người dùng');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsersList();
  }, []);

  // Handle User Creation
  const handleCreateUser = async (userData) => {
    setCreating(true);
    setErrorMsg('');
    setSuccessMsg('');
    try {
      const res = await createUser(userData);
      setSuccessMsg('Thêm người dùng mới thành công!');
      fetchUsersList();
    } catch (err) {
      console.error('API createUser Error:', err);
      setErrorMsg(err.message || 'Không thể tạo người dùng mới!');
      throw err;
    } finally {
      setCreating(false);
    }
  };

  return (
    <DashboardLayout user={user} activeMenu="users">
      {/* Page Header */}
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
          Quản Lý Người Dùng
        </h1>
        <p className={styles.pageSubtitle}>
          Quản lý tài khoản hệ thống, thông tin người dùng và phân quyền trong LifeSpace VR.
        </p>
      </div>

      {/* Alert notifications */}
      <AlertBox type="error" message={errorMsg} />
      <AlertBox type="success" message={successMsg} />

      {/* Main User Table */}
      <UserTable
        users={users}
        loading={loading}
        onRefresh={fetchUsersList}
        onOpenCreateModal={() => setShowCreateModal(true)}
      />

      {/* Create User Modal */}
      <CreateUserModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateUser}
        creating={creating}
      />
    </DashboardLayout>
  );
}
