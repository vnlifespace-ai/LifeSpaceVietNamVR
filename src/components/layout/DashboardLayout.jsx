import React, { useState } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import styles from '../../pages/dashboard/Dashboard.module.scss';

export default function DashboardLayout({ children, activeMenu, onSelectMenu, user }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className={styles.dashboardLayout}>
      {/* Common Navbar */}
      <Navbar
        user={user}
        sidebarCollapsed={sidebarCollapsed}
        onToggleSidebar={() => setSidebarCollapsed((prev) => !prev)}
      />

      {/* Body with Common Sidebar and Content Area */}
      <div className={styles.bodyWrapper}>
        <Sidebar
          collapsed={sidebarCollapsed}
          activeMenu={activeMenu}
          onSelectMenu={onSelectMenu}
          user={user}
        />

        <main className={styles.mainContainer}>{children}</main>
      </div>
    </div>
  );
}
