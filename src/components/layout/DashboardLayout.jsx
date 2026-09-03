import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import styles from './DashboardLayout.module.scss';

export default function DashboardLayout({ children, activeMenu, onSelectMenu, user }) {
  // Mặc định tự động thu gọn sidebar nếu là màn hình di động (<= 768px)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    return typeof window !== 'undefined' && window.innerWidth <= 768;
  });

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setSidebarCollapsed(true);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
          onCloseMobile={() => setSidebarCollapsed(true)}
        />

        {/* Mobile Backdrop Overlay khi mở Sidebar */}
        {!sidebarCollapsed && (
          <div
            className={styles.sidebarBackdrop}
            onClick={() => setSidebarCollapsed(true)}
            aria-label="Đóng menu"
          />
        )}

        <main className={styles.mainContainer}>{children}</main>
      </div>
    </div>
  );
}

