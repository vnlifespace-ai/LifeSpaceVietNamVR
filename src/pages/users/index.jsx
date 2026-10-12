import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router';
import DashboardLayout from '../../components/layout/DashboardLayout';
import AlertBox from '../../components/common/AlertBox';
import MemberTable from '../../components/Organization/MemberTable';
import AddMemberModal from '../../components/Organization/AddMemberModal';
import ChangeRoleModal from '../../components/Organization/ChangeRoleModal';
import ConfirmDeleteModal from '../../components/Organization/ConfirmDeleteModal';
import {
  getSelectedOrganization,
  saveSelectedOrganization,
  getOrganizationMembers,
  addOrganizationMember,
  removeOrganizationMember,
  updateMemberRole,
} from '../../api/organization';
import styles from '../dashboard/Dashboard.module.scss';

export default function UsersPage() {
  const navigate = useNavigate();

  // Read stored user info
  const storedUserRaw = localStorage.getItem('auth_user');
  let currentUser = { id: '', name: 'Người dùng VR', email: 'user@lifespace.vr' };
  if (storedUserRaw) {
    try {
      currentUser = { ...currentUser, ...JSON.parse(storedUserRaw) };
    } catch {
      // Fallback
    }
  }

  // Active Organization
  const [selectedOrg, setSelectedOrg] = useState(() => getSelectedOrganization());

  // Members State
  const [members, setMembers] = useState([]);
  const [loadingMembers, setLoadingMembers] = useState(true);

  // Alerts
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [addLoading, setAddLoading] = useState(false);

  const [editRoleMember, setEditRoleMember] = useState(null);
  const [roleLoading, setRoleLoading] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isSelfDelete, setIsSelfDelete] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Redirect if no organization selected
  useEffect(() => {
    if (!selectedOrg?.id) {
      navigate('/organizations');
    }
  }, [selectedOrg, navigate]);

  // Is current user owner of this organization
  const isOrgOwner = Boolean(
    (selectedOrg?.ownerId && selectedOrg.ownerId === currentUser.id) ||
    (selectedOrg?.owner?.id && selectedOrg.owner.id === currentUser.id) ||
    selectedOrg?.roleName === 'OWNER' ||
    selectedOrg?.role === 'OWNER'
  );

  // Fetch Members via GET /organization-members/{organizationId}
  const fetchMembersList = useCallback(async () => {
    if (!selectedOrg?.id) return;
    setLoadingMembers(true);
    try {
      const res = await getOrganizationMembers(selectedOrg.id);
      let list = [];
      if (Array.isArray(res?.result)) {
        list = res.result;
      } else if (res?.result && typeof res.result === 'object') {
        list = [res.result];
      }
      setMembers(list);
    } catch (err) {
      console.error('getOrganizationMembers Error:', err);
      setErrorMsg(err.message || 'Không thể tải danh sách thành viên tổ chức');
    } finally {
      setLoadingMembers(false);
    }
  }, [selectedOrg?.id]);

  useEffect(() => {
    if (selectedOrg?.id) {
      fetchMembersList();
    }
  }, [selectedOrg?.id, fetchMembersList]);

  // Auto-clear success message after 4s
  useEffect(() => {
    if (successMsg) {
      const timer = setTimeout(() => setSuccessMsg(''), 4000);
      return () => clearTimeout(timer);
    }
  }, [successMsg]);

  // Add Member: POST /organization-members
  const handleAddMember = async ({ email, userId, roleName }) => {
    if (!selectedOrg?.id) return;
    setAddLoading(true);
    setErrorMsg('');
    try {
      await addOrganizationMember({
        organizationId: selectedOrg.id,
        email,
        userId,
        roleName,
      });
      setSuccessMsg('Thêm thành viên vào tổ chức thành công!');
      setShowAddModal(false);
      await fetchMembersList();
    } catch (err) {
      console.error('handleAddMember Error:', err);
      throw err;
    } finally {
      setAddLoading(false);
    }
  };

  // Update Role: PUT /organization-members/{memberId}/role?roleName=...
  const handleUpdateRole = async (memberId, roleName) => {
    setRoleLoading(true);
    setErrorMsg('');
    try {
      await updateMemberRole(memberId, { roleName });
      setSuccessMsg('Cập nhật vai trò thành viên thành công!');
      setEditRoleMember(null);
      await fetchMembersList();
    } catch (err) {
      console.error('handleUpdateRole Error:', err);
      throw err;
    } finally {
      setRoleLoading(false);
    }
  };

  // Remove Member: DELETE /organization-members/{memberId}
  const handleConfirmDelete = async (memberId) => {
    setDeleteLoading(true);
    setErrorMsg('');
    try {
      await removeOrganizationMember(memberId);
      if (isSelfDelete) {
        saveSelectedOrganization(null);
        navigate('/organizations');
        return;
      }
      setSuccessMsg('Xóa thành viên khỏi tổ chức thành công!');
      setDeleteTarget(null);
      await fetchMembersList();
    } catch (err) {
      console.error('handleConfirmDelete Error:', err);
      setErrorMsg(err.message || 'Không thể xóa thành viên khỏi tổ chức!');
    } finally {
      setDeleteLoading(false);
    }
  };

  if (!selectedOrg) {
    return null;
  }

  return (
    <DashboardLayout user={currentUser} activeMenu="users">
      {/* Page Header */}
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
          Quản Lý Thành Viên Tổ Chức
        </h1>
        <p className={styles.pageSubtitle}>
          Quản lý tài khoản, danh sách thành viên và phân quyền trong tổ chức{' '}
          <strong>{selectedOrg.name}</strong>.
        </p>
      </div>

      {/* Alert Notifications */}
      <AlertBox type="error" message={errorMsg} />
      <AlertBox type="success" message={successMsg} />

      {/* Main Member Table (Using OrganizationMemberController endpoints) */}
      <MemberTable
        members={members}
        loading={loadingMembers}
        isOrgOwner={isOrgOwner}
        currentUserId={currentUser.id}
        onRefresh={fetchMembersList}
        onOpenAddModal={() => setShowAddModal(true)}
        onOpenEditRole={(member) => setEditRoleMember(member)}
        onOpenDeleteModal={(member, isSelf) => {
          setDeleteTarget(member);
          setIsSelfDelete(Boolean(isSelf));
        }}
      />

      {/* Modal: Add Member */}
      <AddMemberModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAddMember}
        loading={addLoading}
      />

      {/* Modal: Update Role */}
      <ChangeRoleModal
        isOpen={Boolean(editRoleMember)}
        member={editRoleMember}
        onClose={() => setEditRoleMember(null)}
        onSubmit={handleUpdateRole}
        loading={roleLoading}
      />

      {/* Modal: Confirm Delete */}
      <ConfirmDeleteModal
        isOpen={Boolean(deleteTarget)}
        member={deleteTarget}
        isSelf={isSelfDelete}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        loading={deleteLoading}
      />
    </DashboardLayout>
  );
}
