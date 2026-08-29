import React, { useState, useEffect } from 'react';
import styles from './Modal.module.scss';

export default function CreateActionModal({
  isOpen = false,
  onClose,
  onSubmit,
  scenes = [],
  activeScene = null,
  currentCoordsRef,
  initialCoords = null,
  setToastMsg,
}) {
  const [actionName, setActionName] = useState('');
  const [actionIcon, setActionIcon] = useState('arrow');
  const [targetSceneId, setTargetSceneId] = useState('');
  const [actionCoords, setActionCoords] = useState({ x: 0.1, y: 0.1, z: 0.1 });

  useEffect(() => {
    if (isOpen && activeScene) {
      const otherScenes = scenes.filter((s) => s.id !== activeScene.id);
      const defaultTarget = otherScenes.length > 0 ? otherScenes[0] : scenes[0];

      const currentX = initialCoords?.x ?? currentCoordsRef?.current?.x ?? 0.1;
      const currentY = initialCoords?.y ?? currentCoordsRef?.current?.y ?? 0.1;
      const currentZ = initialCoords?.z ?? currentCoordsRef?.current?.z ?? 0.1;

      setActionCoords({ x: currentX, y: currentY, z: currentZ });
      setTargetSceneId(defaultTarget?.id || '');
      setActionName(defaultTarget ? `Chuyển đến ${defaultTarget.name}` : 'Action Navigation');
      setActionIcon('arrow');
    }
  }, [isOpen, activeScene, scenes, currentCoordsRef, initialCoords]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!targetSceneId) {
      if (setToastMsg) setToastMsg({ type: 'error', text: 'Vui lòng chọn Target Scene!' });
      return;
    }

    const targetSceneObj = scenes.find((s) => s.id === targetSceneId);
    const newNav = {
      name: actionName.trim() || (targetSceneObj ? `Chuyển đến ${targetSceneObj.name}` : 'Action'),
      icon: actionIcon || 'arrow',
      positionX: Number(actionCoords.x),
      positionY: Number(actionCoords.y),
      positionZ: Number(actionCoords.z),
      idSourceScene: activeScene.id,
      idTargetScene: targetSceneId,
      isPending: true,
    };

    if (onSubmit) {
      onSubmit(newNav);
    }
  };

  return (
    <div className={styles.uploadModalOverlay} onClick={onClose}>
      <div className={styles.uploadModalBox} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h3 className={styles.modalTitle}>
            <span style={{ color: '#de913f' }}>+</span> Tạo Action Navigation Chuyển Scene
          </h3>
          <button className={styles.modalCloseBtn} onClick={onClose}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.uploadForm}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Tên Action / Nhãn hiển thị *</label>
            <input
              type="text"
              placeholder="vd: Chuyển sang Phòng Khách"
              value={actionName}
              onChange={(e) => setActionName(e.target.value)}
              required
              className={styles.formInput}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>VR Scene Mục Tiêu (idTargetScene) *</label>
            <select
              value={targetSceneId}
              onChange={(e) => {
                const selId = e.target.value;
                setTargetSceneId(selId);
                const selectedObj = scenes.find((s) => s.id === selId);
                if (selectedObj) {
                  setActionName(`Chuyển đến ${selectedObj.name}`);
                }
              }}
              required
              className={styles.formInput}
              style={{ cursor: 'pointer' }}
            >
              <option value="">-- Chọn VR Scene muốn chuyển sang --</option>
              {scenes.map((s) => (
                <option key={s.id} value={s.id} disabled={s.id === activeScene?.id}>
                  {s.name} {s.id === activeScene?.id ? '(Scene hiện tại)' : ''}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Biểu tượng Icon</label>
            <select
              value={actionIcon}
              onChange={(e) => setActionIcon(e.target.value)}
              className={styles.formInput}
            >
              <option value="arrow">Mũi tên (arrow)</option>
              <option value="door">Cửa ra vào (door)</option>
              <option value="walk">Bước đi (walk)</option>
              <option value="test">Test Icon (test)</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Tọa độ đã chọn</label>
            <div className={styles.coordsBadge}>
              <span>X: <strong>{actionCoords.x}</strong></span>
              <span>Y: <strong>{actionCoords.y}</strong></span>
              <span>Z: <strong>{actionCoords.z}</strong></span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '0.65rem 1.25rem',
                background: '#f1f5f9',
                border: '1px solid #cbd5e1',
                borderRadius: '10px',
                color: '#475569',
                fontWeight: '600',
                fontSize: '0.875rem',
                cursor: 'pointer',
              }}
            >
              Hủy
            </button>

            <button
              type="submit"
              className={styles.submitBtn}
            >
              + Tạo Action (Chưa lưu CSDL)
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
