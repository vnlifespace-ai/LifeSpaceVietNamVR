import React, { useState } from 'react';
import Modal from '../common/Modal';
import AlertBox from '../common/AlertBox';
import styles from './CreateVrSceneModal.module.scss';

export default function CreateVrSceneModal({ isOpen, onClose, onSubmit, creating = false }) {
  const [formData, setFormData] = useState({
    name: '',
    positionX: 0.1,
    positionY: 0.1,
    positionZ: 0.1,
  });
  const [file, setFile] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setErrorMsg('Vui lòng nhập tên VR Scene!');
      return;
    }

    if (!file) {
      setErrorMsg('Vui lòng chọn hình ảnh Panorama 360° (tệp file là bắt buộc)!');
      return;
    }

    setErrorMsg('');

    try {
      if (onSubmit) {
        await onSubmit({
          name: formData.name.trim(),
          positionX: formData.positionX,
          positionY: formData.positionY,
          positionZ: formData.positionZ,
          file,
        });
      }

      setFormData({ name: '', positionX: 0.1, positionY: 0.1, positionZ: 0.1 });
      setFile(null);
      onClose();
    } catch (err) {
      console.error('CreateVrSceneModal submit error:', err);
      setErrorMsg(err.message || 'Không thể tạo VR Scene. Vui lòng thử lại!');
    }
  };

  const footerButtons = (
    <>
      <button type="button" className={styles.cancelBtn} onClick={onClose}>
        Hủy
      </button>
      <button
        type="submit"
        form="createVrSceneForm"
        className={styles.submitBtn}
        disabled={creating}
      >
        {creating ? (
          <>
            <span className={styles.spinner}></span>
            <span>Đang tải lên...</span>
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
            <span>Tạo VR Scene</span>
          </>
        )}
      </button>
    </>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Thêm VR Scene Mới"
      icon={
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      }
      footer={footerButtons}
      maxWidth="560px"
    >
      <AlertBox type="error" message={errorMsg} />

      <form id="createVrSceneForm" className={styles.createForm} onSubmit={handleSubmit}>
        <div className={styles.formGrid}>
          {/* Name */}
          <div className={styles.inputGroup} style={{ gridColumn: '1 / -1' }}>
            <label htmlFor="modalSceneName">Tên VR Scene (name) *</label>
            <input
              id="modalSceneName"
              name="name"
              type="text"
              placeholder="vd: Phòng Khách 360°"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>

          {/* Position X */}
          <div className={styles.inputGroup}>
            <label htmlFor="modalPositionX">Tọa độ X</label>
            <input
              id="modalPositionX"
              name="positionX"
              type="number"
              step="0.1"
              value={formData.positionX}
              onChange={handleInputChange}
            />
          </div>

          {/* Position Y */}
          <div className={styles.inputGroup}>
            <label htmlFor="modalPositionY">Tọa độ Y</label>
            <input
              id="modalPositionY"
              name="positionY"
              type="number"
              step="0.1"
              value={formData.positionY}
              onChange={handleInputChange}
            />
          </div>

          {/* Position Z */}
          <div className={styles.inputGroup}>
            <label htmlFor="modalPositionZ">Tọa độ Z</label>
            <input
              id="modalPositionZ"
              name="positionZ"
              type="number"
              step="0.1"
              value={formData.positionZ}
              onChange={handleInputChange}
            />
          </div>

          {/* File Upload */}
          <div className={styles.inputGroup} style={{ gridColumn: '1 / -1' }}>
            <label htmlFor="modalFile">Hình Ảnh Panorama 360° (file) *</label>
            <input
              id="modalFile"
              name="file"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              required
            />
          </div>
        </div>
      </form>
    </Modal>
  );
}
