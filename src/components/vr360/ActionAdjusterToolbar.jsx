import React from 'react';
import styles from './ActionAdjusterToolbar.module.scss';

export default function ActionAdjusterToolbar({
  nav,
  scenes = [],
  activeScene = null,
  onUpdateNav,
  onClose,
  onDeleteNav,
}) {
  if (!nav) return null;

  const posX = parseFloat(Number(nav.positionX ?? 0.1).toFixed(4));
  const posY = parseFloat(Number(nav.positionY ?? 0.1).toFixed(4));
  const posZ = parseFloat(Number(nav.positionZ ?? 0.1).toFixed(4));

  const handleFieldChange = (field, value) => {
    onUpdateNav({
      ...nav,
      [field]: value,
      isPending: true,
    });
  };

  const handleTargetSceneChange = (targetId) => {
    const selectedObj = scenes.find((s) => s.id === targetId);
    const newName = selectedObj ? `Chuyển đến ${selectedObj.name}` : nav.name;
    onUpdateNav({
      ...nav,
      idTargetScene: targetId,
      name: newName,
      isPending: true,
    });
  };

  const handleSliderChange = (axis, value) => {
    const val = parseFloat(Number(value).toFixed(4));
    let newX = posX;
    let newY = posY;
    let newZ = posZ;

    if (axis === 'x') newX = val;
    if (axis === 'y') newY = val;
    if (axis === 'z') newZ = val;

    onUpdateNav({
      ...nav,
      positionX: newX,
      positionY: newY,
      positionZ: newZ,
      isPending: true,
    });
  };

  const handleStep = (axis, delta) => {
    let newX = posX;
    let newY = posY;
    let newZ = posZ;

    if (axis === 'x') newX = parseFloat((posX + delta).toFixed(4));
    if (axis === 'y') newY = parseFloat((posY + delta).toFixed(4));
    if (axis === 'z') newZ = parseFloat((posZ + delta).toFixed(4));

    newX = Math.max(-1.0, Math.min(1.0, newX));
    newY = Math.max(-1.0, Math.min(1.0, newY));
    newZ = Math.max(-1.0, Math.min(1.0, newZ));

    onUpdateNav({
      ...nav,
      positionX: newX,
      positionY: newY,
      positionZ: newZ,
      isPending: true,
    });
  };

  return (
    <div className={styles.adjusterPanel} onClick={(e) => e.stopPropagation()}>
      <div className={styles.header}>
        <span className={styles.title}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="16" />
            <line x1="8" y1="12" x2="16" y2="12" />
          </svg>
          Chỉnh sửa Action Navigation
        </span>
        <button className={styles.closeBtn} onClick={onClose} title="Đóng bảng chỉnh vị trí">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      <div className={styles.sliderGroup}>
        {/* VR Scene Target Selector */}
        <div className={styles.sliderItem}>
          <div className={styles.labelRow}>
            <span>Scene Mục Tiêu *</span>
          </div>
          <select
            value={nav.idTargetScene || ''}
            onChange={(e) => handleTargetSceneChange(e.target.value)}
            className={styles.selectInput}
          >
            <option value="">-- Chọn VR Scene chuyển đến --</option>
            {scenes.map((s) => (
              <option key={s.id} value={s.id} disabled={s.id === activeScene?.id}>
                {s.name} {s.id === activeScene?.id ? '(Scene hiện tại)' : ''}
              </option>
            ))}
          </select>
        </div>

        {/* Action Display Name Input */}
        <div className={styles.sliderItem}>
          <div className={styles.labelRow}>
            <span>Nhãn hiển thị</span>
          </div>
          <input
            type="text"
            value={nav.name || ''}
            onChange={(e) => handleFieldChange('name', e.target.value)}
            placeholder="vd: Chuyển sang Phòng Khách"
            className={styles.textInput}
          />
        </div>

        {/* Position X Slider */}
        <div className={styles.sliderItem}>
          <div className={styles.labelRow}>
            <span>Vị trí Ngang (X)</span>
            <span className={styles.val}>{posX}</span>
          </div>
          <input
            type="range"
            min="-1.0"
            max="1.0"
            step="0.01"
            value={posX}
            onChange={(e) => handleSliderChange('x', e.target.value)}
            className={styles.rangeInput}
          />
        </div>

        {/* Position Y Slider */}
        <div className={styles.sliderItem}>
          <div className={styles.labelRow}>
            <span>Vị trí Dọc (Y)</span>
            <span className={styles.val}>{posY}</span>
          </div>
          <input
            type="range"
            min="-1.0"
            max="1.0"
            step="0.01"
            value={posY}
            onChange={(e) => handleSliderChange('y', e.target.value)}
            className={styles.rangeInput}
          />
        </div>

        {/* Position Z Slider */}
        <div className={styles.sliderItem}>
          <div className={styles.labelRow}>
            <span>Chiều Sâu (Z)</span>
            <span className={styles.val}>{posZ}</span>
          </div>
          <input
            type="range"
            min="-1.0"
            max="1.0"
            step="0.01"
            value={posZ}
            onChange={(e) => handleSliderChange('z', e.target.value)}
            className={styles.rangeInput}
          />
        </div>
      </div>

      {/* Micro Step Directional Pad */}
      <div className={styles.keypadRow}>
        <span className={styles.keypadLabel}>Tinh chỉnh vi mô:</span>
        <div className={styles.keypadBtns}>
          <button
            className={styles.stepBtn}
            onClick={() => handleStep('x', -0.02)}
            title="Dịch trái (X -0.02)"
          >
            ←
          </button>
          <button
            className={styles.stepBtn}
            onClick={() => handleStep('x', 0.02)}
            title="Dịch phải (X +0.02)"
          >
            →
          </button>
          <button
            className={styles.stepBtn}
            onClick={() => handleStep('y', 0.02)}
            title="Dịch lên (Y +0.02)"
          >
            ↑
          </button>
          <button
            className={styles.stepBtn}
            onClick={() => handleStep('y', -0.02)}
            title="Dịch xuống (Y -0.02)"
          >
            ↓
          </button>
        </div>
      </div>

      <div className={styles.footer}>
        <button
          className={styles.deleteBtn}
          onClick={() => {
            if (onDeleteNav) onDeleteNav(nav);
          }}
          title="Xóa Action này"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
          </svg>
          <span>Xóa</span>
        </button>

        <button className={styles.doneBtn} onClick={onClose}>
          Hoàn tất
        </button>
      </div>
    </div>
  );
}
