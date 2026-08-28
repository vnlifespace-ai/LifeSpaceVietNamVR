import React, { useEffect, useState } from 'react';
import { getProjectById } from '../../api/project';
import styles from './Project.module.scss';

export default function ProjectDetailModal({ project, onClose }) {
  const [loading, setLoading] = useState(false);
  const [detailData, setDetailData] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (!project?.id) return;

    let isMounted = true;
    const fetchDetail = async () => {
      setLoading(true);
      setErrorMsg('');
      try {
        const res = await getProjectById(project.id);
        if (isMounted) {
          if (res?.result) {
            setDetailData(res.result);
          } else {
            setDetailData(project);
          }
        }
      } catch (err) {
        if (isMounted) {
          console.warn('Cannot fetch project detail from API, using row item fallback:', err);
          // Fallback to row project data if API fails
          setDetailData(project);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchDetail();

    return () => {
      isMounted = false;
    };
  }, [project]);

  if (!project) return null;

  const data = detailData || project;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.modalHeader}>
          <h3 className={styles.modalTitle}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>
            Chi Tiết Dự Án
          </h3>
          <button className={styles.closeBtn} onClick={onClose} title="Đóng">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className={styles.modalBody}>
          {loading ? (
            <div className={styles.emptyState}>
              <div className={styles.spinner} style={{ margin: '0 auto 1rem' }}></div>
              <p>Đang tải thông tin dự án...</p>
            </div>
          ) : (
            <>
              <div className={styles.detailGrid}>
                <div className={styles.detailItem}>
                  <span className={styles.itemLabel}>ID Dự Án</span>
                  <span className={styles.itemValue}>{data.id || 'N/A'}</span>
                </div>

                <div className={styles.detailItem}>
                  <span className={styles.itemLabel}>Tên Dự Án</span>
                  <span className={styles.itemValue}>{data.nameProject || 'N/A'}</span>
                </div>

                <div className={`${styles.detailItem} ${styles.fullWidth}`}>
                  <span className={styles.itemLabel}>Slug đường dẫn</span>
                  <span className={styles.slugTag}>
                    {data.slug || data.nameProject?.toLowerCase().replace(/\s+/g, '-') || 'N/A'}
                  </span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className={styles.modalFooter}>
          <button className={styles.actionBtn} onClick={onClose}>
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
