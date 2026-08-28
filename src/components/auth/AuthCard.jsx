import React from 'react';
import { Link } from 'react-router';
import styles from './AuthCard.module.scss';

export default function AuthCard({
  icon,
  title,
  subtitle,
  children,
  footerText,
  footerLinkText,
  footerLinkTo,
}) {
  return (
    <div className={styles.authContainer}>
      <div className={styles.authCard}>
        {/* Brand Header */}
        <div className={styles.brandHeader}>
          {icon && <div className={styles.logoBadge}>{icon}</div>}
          {title && <h1 className={styles.title}>{title}</h1>}
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        </div>

        {/* Form or Card Content */}
        {children}

        {/* Footer switcher */}
        {footerLinkTo && (
          <div className={styles.authFooter}>
            {footerText}
            <Link to={footerLinkTo}>{footerLinkText}</Link>
          </div>
        )}
      </div>
    </div>
  );
}
