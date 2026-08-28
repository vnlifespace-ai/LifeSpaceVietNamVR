import React, { useState } from 'react';
import styles from './CreateVrForm.module.scss';

export default function CreateVrForm({ onCreateSuccess }) {
  const [vrForm, setVrForm] = useState({
    title: '',
    type: 'can-ho',
    description: '',
    panoramaUrl: '',
    floorPlanUrl: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setVrForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!vrForm.title.trim()) return;

    const newPage = {
      id: Date.now(),
      title: vrForm.title.trim(),
      type: vrForm.type === 'can-ho' ? 'Căn hộ' : vrForm.type === 'biet-thu' ? 'Biệt thự' : 'Shophouse',
      link: '/hiyori/can1a',
    };

    if (onCreateSuccess) {
      onCreateSuccess(newPage);
    }

    setVrForm({
      title: '',
      type: 'can-ho',
      description: '',
      panoramaUrl: '',
      floorPlanUrl: '',
    });
  };

  return (
    <div className={styles.createVrCard}>
      <h2 className={styles.cardTitle}>Thông Tin Trang VR</h2>

      <form className={styles.createForm} onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label htmlFor="title">Tên trang VR / Căn hộ *</label>
          <input
            id="title"
            type="text"
            name="title"
            placeholder="vd: Hiyori Penthouse 360"
            value={vrForm.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="type">Loại bất động sản</label>
          <select id="type" name="type" value={vrForm.type} onChange={handleChange}>
            <option value="can-ho">Căn hộ chung cư</option>
            <option value="biet-thu">Biệt thự / Villa</option>
            <option value="shophouse">Shophouse</option>
            <option value="penthouse">Penthouse</option>
          </select>
        </div>

        <div className={`${styles.formGroup} ${styles.fullWidth}`}>
          <label htmlFor="description">Mô tả ngắn</label>
          <textarea
            id="description"
            name="description"
            placeholder="Nhập mô tả về phong cách thiết kế, vị trí hoặc tiện ích căn hộ..."
            value={vrForm.description}
            onChange={handleChange}
          />
        </div>

        <div className={`${styles.formGroup} ${styles.fullWidth}`}>
          <label>Hình ảnh 360° Panorama</label>
          <div className={styles.uploadDropzone}>
            <svg
              className={styles.uploadIcon}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
            <div className={styles.uploadText}>Kéo thả ảnh 360° vào đây hoặc bấm để chọn tệp</div>
            <div className={styles.uploadHint}>Hỗ trợ định dạng JPG, PNG (tỷ lệ 2:1, tối đa 25MB)</div>
          </div>
        </div>

        <div className={`${styles.formGroup} ${styles.fullWidth}`}>
          <button type="submit" className={styles.submitBtn}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M12 5v14" />
              <path d="M5 12h14" />
            </svg>
            <span>Tạo Trang VR</span>
          </button>
        </div>
      </form>
    </div>
  );
}
