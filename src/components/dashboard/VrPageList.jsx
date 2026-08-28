import React from 'react';
import { Link } from 'react-router';
import styles from './VrPageList.module.scss';

export default function VrPageList({ pages = [] }) {
  if (!pages || pages.length === 0) return null;

  return (
    <div className={styles.existingSection}>
      <h3 className={styles.sectionTitle}>Các Trang VR Đã Tạo</h3>

      <div className={styles.vrGrid}>
        {pages.map((page) => (
          <div key={page.id} className={styles.vrCard}>
            <div className={styles.cardTop}>
              <span className={styles.badge}>{page.type}</span>
            </div>
            <h4 className={styles.vrTitle}>{page.title}</h4>
            <Link to={page.link} className={styles.viewLink}>
              <span>Xem VR 360°</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M5 12h14" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
