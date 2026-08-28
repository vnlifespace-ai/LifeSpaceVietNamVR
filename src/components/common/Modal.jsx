import React, { useEffect } from 'react';
import styles from './Modal.module.scss';

export default function Modal({
  isOpen = true,
  onClose,
  title,
  icon,
  children,
  footer,
  maxWidth = '520px',
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && onClose) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div
        className={styles.modalCard}
        style={{ maxWidth }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.modalHeader}>
          <h3 className={styles.modalTitle}>
            {icon && <span className={styles.titleIcon}>{icon}</span>}
            {title}
          </h3>
          {onClose && (
            <button className={styles.closeBtn} onClick={onClose} title="Đóng cửa sổ">
              ✕
            </button>
          )}
        </div>

        <div className={styles.modalBody}>{children}</div>

        {footer && <div className={styles.modalFooter}>{footer}</div>}
      </div>
    </div>
  );
}
