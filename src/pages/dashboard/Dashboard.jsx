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
  getOrganizationProjects,
  addOrganizationMember,
  removeOrganizationMember,
  updateMemberRole,
} from '../../api/organization';
import styles from './Dashboard.module.scss';

export default function Dashboard() {
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

  // Members & Projects State
  const [members, setMembers] = useState([]);
  const [loadingMembers, setLoadingMembers] = useState(true);
  const [projectsCount, setProjectsCount] = useState(0);

  // Alerts
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [addLoading, setAddLoading] = useState(false);

  const [editRoleMember, setEditRoleMember] = useState(null);
  const [roleLoading, setRoleLoading] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isSelfDelete, setIsSelfDelete] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Verify Organization is selected
  useEffect(() => {
    if (!selectedOrg?.id) {
      navigate('/organizations');
    }
  }, [selectedOrg, navigate]);

  // Is current logged in user the Owner of this org?
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

  // Fetch Projects count for stats
  const fetchProjectsCount = useCallback(async () => {
    if (!selectedOrg?.id) return;
    try {
      const res = await getOrganizationProjects(selectedOrg.id);
      const list = Array.isArray(res?.result) ? res.result : [];
      setProjectsCount(list.length);
    } catch {
      setProjectsCount(0);
    }
  }, [selectedOrg?.id]);

  useEffect(() => {
    if (selectedOrg?.id) {
      fetchMembersList();
      fetchProjectsCount();
    }
  }, [selectedOrg?.id, fetchMembersList, fetchProjectsCount]);

  // Auto-clear success message after 4s
  useEffect(() => {
    if (successMsg) {
      const timer = setTimeout(() => setSuccessMsg(''), 4000);
      return () => clearTimeout(timer);
    }
  }, [successMsg]);

  // ─── API HANDLERS ─────────────────────────────────────────────────────────────

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
        // Current user left the organization -> redirect to select org
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

  const handleSwitchOrg = () => {
    saveSelectedOrganization(null);
    navigate('/organizations');
  };

  if (!selectedOrg) {
    return null;
  }

  // Current user's role in this organization
  const myMemberRecord = members.find((m) => m?.user?.id === currentUser?.id);
  const myRoleDisplay = isOrgOwner
    ? 'Chủ sở hữu (Owner)'
    : myMemberRecord?.role?.name === 'ADMIN'
    ? 'Quản trị viên (Admin)'
    : myMemberRecord?.role?.name === 'CREATED'
    ? 'Người tạo nội dung'
    : 'Thành viên';

  return (
    <DashboardLayout user={currentUser} activeMenu="dashboard">
      {/* Page Header */}
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
          Tổng Quan Tổ Chức
        </h1>
        <p className={styles.pageSubtitle}>
          Quản lý không gian làm việc, danh sách thành viên và các dự án thực tế ảo 360°.
        </p>
      </div>

      {/* Alert Messages */}
      <AlertBox type="error" message={errorMsg} />
      <AlertBox type="success" message={successMsg} />

      {/* Organization Overview Card */}
      <div className={styles.orgOverviewCard}>
        <div className={styles.orgOverviewLeft}>
          <div className={styles.orgAvatar}>
            {(selectedOrg.name || 'O')[0].toUpperCase()}
          </div>
          <div className={styles.orgDetails}>
            <h2 className={styles.orgNameTitle}>{selectedOrg.name}</h2>
            <p className={styles.orgDescription}>
              {selectedOrg.description || 'Chưa có mô tả cho tổ chức này.'}
            </p>
            <div className={styles.orgMetaInfo}>
              <span className={styles.orgMetaItem}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                Chủ sở hữu:{' '}
                <strong>
                  {selectedOrg.owner?.name || selectedOrg.owner?.email || 'Hệ thống'}
                </strong>
              </span>
            </div>
          </div>
        </div>

        <div className={styles.orgOverviewRight}>
          <button
            type="button"
            className={styles.switchOrgBtn}
            onClick={handleSwitchOrg}
            title="Chọn tổ chức khác"
            id="dashboard-switch-org-btn"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="16 3 21 3 21 8" />
              <line x1="4" y1="20" x2="21" y2="3" />
              <polyline points="21 16 21 21 16 21" />
              <line x1="15" y1="15" x2="21" y2="21" />
              <line x1="4" y1="4" x2="9" y2="9" />
            </svg>
            <span>Đổi tổ chức</span>
          </button>

          <button
            type="button"
            className={styles.projectsQuickBtn}
            onClick={() => navigate('/projects')}
            title="Đến danh sách dự án"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <line x1="3" y1="9" x2="21" y2="9" />
              <line x1="9" y1="21" x2="9" y2="9" />
            </svg>
            <span>Quản lý Dự án</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className={styles.statsGrid}>
        {/* Total Members */}
        <div className={styles.statCard}>
          <div className={`${styles.statIconBox} ${styles.membersIcon}`}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statNumber}>
              {loadingMembers ? '—' : members.length}
            </span>
            <span className={styles.statLabel}>Thành viên tổ chức</span>
          </div>
        </div>

        {/* Total Projects */}
        <div className={styles.statCard}>
          <div className={`${styles.statIconBox} ${styles.projectsIcon}`}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <line x1="3" y1="9" x2="21" y2="9" />
              <line x1="9" y1="21" x2="9" y2="9" />
            </svg>
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statNumber}>{projectsCount}</span>
            <span className={styles.statLabel}>Dự án thực tế ảo</span>
          </div>
        </div>

        {/* Your Role */}
        <div className={styles.statCard}>
          <div className={`${styles.statIconBox} ${styles.roleIcon}`}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statNumber} style={{ fontSize: '1.05rem', fontWeight: 600 }}>
              {myRoleDisplay}
            </span>
            <span className={styles.statLabel}>Vai trò của bạn</span>
          </div>
        </div>
      </div>

      {/* Main Members Table (Uses OrganizationMemberController endpoints) */}
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

      {/* Modal: Add Member (POST /organization-members) */}
      <AddMemberModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAddMember}
        loading={addLoading}
      />

      {/* Modal: Update Member Role (PUT /organization-members/{memberId}/role) */}
      <ChangeRoleModal
        isOpen={Boolean(editRoleMember)}
        member={editRoleMember}
        onClose={() => setEditRoleMember(null)}
        onSubmit={handleUpdateRole}
        loading={roleLoading}
      />

      {/* Modal: Confirm Delete Member (DELETE /organization-members/{memberId}) */}
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
