import React, { useState, useEffect } from 'react';
import { Html } from '@react-three/drei';
import styles from './Modal.module.scss';

export default function ActionPopover({
  coords,
  scenes = [],
  activeScene = null,
  onCancel,
  onSubmit,
}) {
  const [actionName, setActionName] = useState('');
  const [actionIcon, setActionIcon] = useState('arrow');
  const [targetSceneId, setTargetSceneId] = useState('');
  const [customCoords, setCustomCoords] = useState({ x: 0.1, y: 0.1, z: 0.1 });

  useEffect(() => {
    if (coords) {
      setCustomCoords(coords);
      const otherScenes = scenes.filter((s) => s.id !== activeScene?.id);
      const defaultTarget = otherScenes.length > 0 ? otherScenes[0] : scenes[0];
      setTargetSceneId(defaultTarget?.id || '');
      setActionName(defaultTarget ? `Chuyển đến ${defaultTarget.name}` : 'Action Navigation');
      setActionIcon('arrow');
    }
  }, [coords, scenes, activeScene]);

  if (!coords) return null;

  const dirX = Number(customCoords.x) || 0.1;
  const dirY = Number(customCoords.y) || 0.1;
  const dirZ = Number(customCoords.z) || 0.1;

  const isNormalized = Math.abs(dirX) <= 2 && Math.abs(dirY) <= 2 && Math.abs(dirZ) <= 2;
  const radius = isNormalized ? 420 : 1;

  const posX = dirX * radius;
  const posY = dirY * radius;
  const posZ = dirZ * radius;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!targetSceneId) return;

    const targetSceneObj = scenes.find((s) => s.id === targetSceneId);
    const newNav = {
      name: actionName.trim() || (targetSceneObj ? `Chuyển đến ${targetSceneObj.name}` : 'Action'),
      icon: actionIcon || 'arrow',
      positionX: dirX,
      positionY: dirY,
      positionZ: dirZ,
      idSourceScene: activeScene?.id,
      idTargetScene: targetSceneId,
      isPending: true,
    };

    if (onSubmit) {
      onSubmit(newNav);
    }
  };

  return (
    <group position={[posX, posY, posZ]}>
      <Html center distanceFactor={isNormalized ? 420 : undefined} zIndexRange={[100, 0]}>
        <div className={styles.popoverCard} onClick={(e) => e.stopPropagation()}>
          <div className={styles.popoverHeader}>
            <span className={styles.popoverTitle}>
              Đặt điểm Action (X: {dirX}, Y: {dirY}, Z: {dirZ})
            </span>
            <button className={styles.popoverCloseBtn} onClick={onCancel} type="button">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className={styles.popoverForm}>
            <div className={styles.popoverGroup}>
              <label className={styles.popoverLabel}>VR Scene Mục Tiêu (idTargetScene) *</label>
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
                className={styles.popoverSelect}
              >
                <option value="">-- Chọn Scene chuyển đến --</option>
                {scenes.map((s) => (
                  <option key={s.id} value={s.id} disabled={s.id === activeScene?.id}>
                    {s.name} {s.id === activeScene?.id ? '(Scene hiện tại)' : ''}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.popoverGroup}>
              <label className={styles.popoverLabel}>Tên nhãn hiển thị *</label>
              <input
                type="text"
                value={actionName}
                onChange={(e) => setActionName(e.target.value)}
                required
                className={styles.popoverInput}
              />
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', marginTop: '0.4rem' }}>
              <button type="button" onClick={onCancel} className={styles.popoverCancelBtn}>
                Hủy
              </button>
              <button type="submit" className={styles.popoverSubmitBtn}>
                + Thêm Action
              </button>
            </div>
          </form>
        </div>
      </Html>
    </group>
  );
}
