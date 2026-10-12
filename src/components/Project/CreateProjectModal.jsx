import React, { useState } from 'react';
import Modal from '../common/Modal';
import AlertBox from '../common/AlertBox';
import styles from './CreateProjectModal.module.scss';

export default function CreateProjectModal({ isOpen, onClose, onSubmit, creating = false, organizationName }) {
  const [nameProject, setNameProject] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nameProject.trim()) {
      setErrorMsg('Vui lòng nhập tên dự án!');
      return;
    }

    setErrorMsg('');

    try {
      if (onSubmit) {
        await onSubmit({ nameProject: nameProject.trim() });
      }
      setNameProject('');
      onClose();
    } catch (err) {
      console.error('CreateProjectModal submit error:', err);
      setErrorMsg(err.message || 'Không thể tạo dự án. Vui lòng thử lại!');
    }
  };

  const footerButtons = (
    <>
      <button type="button" className={styles.cancelBtn} onClick={onClose}>
        Hủy
      </button>
      <button
        type="submit"
        form="createProjectForm"
        className={styles.submitBtn}
        disabled={creating}
      >
        {creating ? (
          <>
            <span className={styles.spinner}></span>
            <span>Đang xử lý...</span>
          </>
        ) : (
          <>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            <span>Thêm Dự Án</span>
          </>
        )}
      </button>
    </>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Tạo Dự Án Mới"
      icon={
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M12 5v14" />
          <path d="M5 12h14" />
        </svg>
      }
      footer={footerButtons}
      maxWidth="480px"
    >
      <AlertBox type="error" message={errorMsg} />

      <form id="createProjectForm" className={styles.createForm} onSubmit={handleSubmit}>
        {/* Org context badge */}
        {organizationName && (
          <div className={styles.orgContext}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            <span>Tổ chức: <strong>{organizationName}</strong></span>
          </div>
        )}
        <div className={styles.inputGroup}>
          <label htmlFor="modalNameProject">Tên dự án (nameProject) *</label>
          <div className={styles.inputWrapper}>
            <span className={styles.inputIcon}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
              </svg>
            </span>
            <input
              id="modalNameProject"
              type="text"
              placeholder="Nhập tên dự án... (vd: Hiyori Tower)"
              value={nameProject}
              onChange={(e) => setNameProject(e.target.value)}
              required
            />
          </div>
        </div>
      </form>
    </Modal>
  );
}
