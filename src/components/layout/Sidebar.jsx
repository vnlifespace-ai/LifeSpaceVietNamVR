import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { isUserOwner } from '../../api/auth';
import {
  getOrganizationMembers,
  getOrganizationProjects,
  getSelectedOrganization,
  saveSelectedOrganization,
} from '../../api/organization';
import styles from './Sidebar.module.scss';

export default function Sidebar({ collapsed, activeMenu, user, onCloseMobile }) {
  const navigate = useNavigate();
  const location = useLocation();

  const isOwner = isUserOwner(user);
  const selectedOrg = getSelectedOrganization();

  const currentPath = location.pathname;
  const isDashboardActive = activeMenu === 'dashboard' || currentPath === '/dashboard';
  const isProjectsActive = activeMenu === 'projects' || currentPath === '/projects';
  const isUsersActive = activeMenu === 'users' || currentPath === '/users';

  // Projects & Members for selected org
  const [projects, setProjects] = useState([]);
  const [members, setMembers] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(false);
  const [loadingMembers, setLoadingMembers] = useState(false);

  // Expand/collapse sections
  const [projectsExpanded, setProjectsExpanded] = useState(true);
  const [membersExpanded, setMembersExpanded] = useState(false);

  useEffect(() => {
    if (!selectedOrg?.id) return;

    // Fetch projects of org (org-scoped via organization.js)
    setLoadingProjects(true);
    getOrganizationProjects(selectedOrg.id)
      .then((res) => {
        let list = [];
        if (Array.isArray(res?.result)) list = res.result;
        else if (res?.result) list = [res.result];
        setProjects(list.slice(0, 10)); // show max 10 in sidebar
      })
      .catch(() => setProjects([]))
      .finally(() => setLoadingProjects(false));

    // Fetch members of org
    setLoadingMembers(true);
    getOrganizationMembers(selectedOrg.id)
      .then((res) => {
        let list = [];
        if (Array.isArray(res?.result)) list = res.result;
        else if (res?.result) list = [res.result];
        setMembers(list.slice(0, 10));
      })
      .catch(() => setMembers([]))
      .finally(() => setLoadingMembers(false));
  }, [selectedOrg?.id]);

  const handleNav = (path) => {
    navigate(path);
    if (onCloseMobile && window.innerWidth <= 768) {
      onCloseMobile();
    }
  };

  const handleSwitchOrg = () => {
    saveSelectedOrganization(null);
    navigate('/organizations');
    if (onCloseMobile) onCloseMobile();
  };

  const getRoleBadge = (member) => {
    const role = (member?.role?.name || member?.roleName || '').toUpperCase();
    if (role === 'OWNER') return { label: 'Owner', cls: styles.roleAdmin };
    if (role === 'ADMIN') return { label: 'Admin', cls: styles.roleAdmin };
    if (role === 'CREATED') return { label: 'Creator', cls: styles.roleCreated };
    return { label: 'User', cls: styles.roleUser };
  };

  return (
    <aside className={`${styles.sidebar} ${collapsed ? styles.collapsed : ''}`}>
      <div className={styles.sidebarContent}>

        {/* Organization Badge */}
        {selectedOrg && !collapsed && (
          <div className={styles.orgBadge}>
            <div className={styles.orgBadgeIcon}>
              {(selectedOrg.name || 'O')[0].toUpperCase()}
            </div>
            <div className={styles.orgBadgeInfo}>
              <span className={styles.orgBadgeName}>{selectedOrg.name}</span>
              <button className={styles.switchOrgBtn} onClick={handleSwitchOrg} id="sidebar-switch-org-btn">
                Đổi tổ chức
              </button>
            </div>
          </div>
        )}

        {/* Collapsed: just show org icon */}
        {selectedOrg && collapsed && (
          <div
            className={styles.orgBadgeCollapsed}
            title={selectedOrg.name}
            onClick={handleSwitchOrg}
          >
            {(selectedOrg.name || 'O')[0].toUpperCase()}
          </div>
        )}

        {/* ── Main Menu ── */}
        <div className={styles.sectionTitle}>Menu Chính</div>
        <ul className={styles.menuList}>
          {/* Trang Chủ */}
          <li
            className={`${styles.menuItem} ${isDashboardActive ? styles.active : ''}`}
            onClick={() => handleNav('/dashboard')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            <span className={styles.menuLabel}>Trang chủ</span>
          </li>

          {/* Quản lý Dự án */}
          <li
            className={`${styles.menuItem} ${isProjectsActive ? styles.active : ''}`}
            onClick={() => handleNav('/projects')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <line x1="3" y1="9" x2="21" y2="9" />
              <line x1="9" y1="21" x2="9" y2="9" />
            </svg>
            <span className={styles.menuLabel}>Quản lý Dự án</span>
          </li>

          {/* Quản lý Thành viên Tổ Chức */}
          {selectedOrg && (
            <li
              className={`${styles.menuItem} ${isUsersActive ? styles.active : ''}`}
              onClick={() => handleNav('/users')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              <span className={styles.menuLabel}>Thành viên</span>
            </li>
          )}
        </ul>

        {/* ── Projects of Org ── */}
        {selectedOrg && !collapsed && (
          <div className={styles.orgSection}>
            <button
              className={styles.orgSectionHeader}
              onClick={() => setProjectsExpanded((v) => !v)}
            >
              <span className={styles.orgSectionTitle}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <line x1="3" y1="9" x2="21" y2="9" />
                  <line x1="9" y1="21" x2="9" y2="9" />
                </svg>
                Dự án tổ chức
              </span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className={`${styles.chevron} ${projectsExpanded ? styles.chevronOpen : ''}`}
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>

            {projectsExpanded && (
              <div className={styles.orgSectionBody}>
                {loadingProjects ? (
                  <div className={styles.miniLoader}>
                    <span className={styles.spinnerXs} />
                    <span>Đang tải...</span>
                  </div>
                ) : projects.length === 0 ? (
                  <p className={styles.emptyNote}>Chưa có dự án nào</p>
                ) : (
                  <ul className={styles.subList}>
                    {projects.map((p) => (
                      <li
                        key={p.id}
                        className={styles.subItem}
                        onClick={() => handleNav(`/vrscene/${p.id}`)}
                        title={p.nameProject || p.name || p.id}
                      >
                        <span className={styles.subDot} />
                        <span className={styles.subLabel}>{p.nameProject || p.name || p.id}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        )}

        {/* ── Members of Org ── */}
        {selectedOrg && !collapsed && (
          <div className={styles.orgSection}>
            <button
              className={styles.orgSectionHeader}
              onClick={() => setMembersExpanded((v) => !v)}
            >
              <span className={styles.orgSectionTitle}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
                Thành viên
                {members.length > 0 && (
                  <span className={styles.memberCount}>{members.length}</span>
                )}
              </span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className={`${styles.chevron} ${membersExpanded ? styles.chevronOpen : ''}`}
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>

            {membersExpanded && (
              <div className={styles.orgSectionBody}>
                {loadingMembers ? (
                  <div className={styles.miniLoader}>
                    <span className={styles.spinnerXs} />
                    <span>Đang tải...</span>
                  </div>
                ) : members.length === 0 ? (
                  <p className={styles.emptyNote}>Chưa có thành viên nào</p>
                ) : (
                  <ul className={styles.memberList}>
                    {members.map((m) => {
                      const badge = getRoleBadge(m);
                      const userObj = m?.user || {};
                      const name = userObj.name || userObj.email || m.name || m.userName || m.email || 'Thành viên';
                      return (
                        <li key={m.id || userObj.id || m.userId} className={styles.memberItem}>
                          <div className={styles.memberAvatar}>
                            {name[0].toUpperCase()}
                          </div>
                          <div className={styles.memberInfo}>
                            <span className={styles.memberName}>{name}</span>
                            <span className={`${styles.memberRole} ${badge.cls}`}>{badge.label}</span>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </aside>
  );
}
