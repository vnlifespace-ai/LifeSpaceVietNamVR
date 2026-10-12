import React from 'react';
import Modal from '../common/Modal';
import styles from './AddMemberModal.module.scss';

export default function ConfirmDeleteModal({
  isOpen = false,
  member = null,
  isSelf = false,
  onClose,
  onConfirm,
  loading = false,
}) {
  if (!isOpen || !member) return null;

  const memberName = member?.user?.name || member?.user?.email || 'thành viên này';

  const footer = (
    <div className={styles.modalFooter}>
      <button
        type="button"
        className={styles.cancelBtn}
        onClick={onClose}
        disabled={loading}
      >
        Hủy
      </button>
      <button
        type="button"
        style={{
          background: isSelf ? '#ea580c' : '#ef4444',
          borderColor: isSelf ? '#ea580c' : '#ef4444',
        }}
        className={styles.submitBtn}
        onClick={() => onConfirm(member.id)}
        disabled={loading}
      >
        {loading ? (
          <>
            <span className={styles.spinnerSm} />
            <span>Đang xử lý...</span>
          </>
        ) : (
          <span>{isSelf ? 'Rời tổ chức' : 'Xác nhận xóa'}</span>
        )}
      </button>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={loading ? undefined : onClose}
      title={isSelf ? 'Rời khỏi tổ chức' : 'Xóa thành viên khỏi tổ chức'}
      icon={
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke={isSelf ? '#ea580c' : '#ef4444'}
          strokeWidth="2"
        >
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
      }
      footer={footer}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <p style={{ margin: 0, fontSize: '0.925rem', color: '#1e293b', lineHeight: 1.5 }}>
          {isSelf ? (
            <>
              Bạn có chắc chắn muốn rời khỏi tổ chức này không? Bạn sẽ không còn quyền truy cập
              vào các dự án nội bộ của tổ chức trừ khi được mời lại.
            </>
          ) : (
            <>
              Bạn có chắc chắn muốn xóa <strong>{memberName}</strong> khỏi tổ chức này không?
              Thành viên này sẽ mất quyền truy cập vào tất cả tài nguyên thuộc tổ chức.
            </>
          )}
        </p>
      </div>
    </Modal>
  );
}
