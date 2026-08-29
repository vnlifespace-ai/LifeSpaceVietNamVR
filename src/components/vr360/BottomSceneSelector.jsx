import React from 'react';
import styles from './BottomSceneSelector.module.scss';

export default function BottomSceneSelector({ scenes = [], activeScene = null, onSelectScene }) {
  if (!scenes || scenes.length === 0) return null;

  return (
    <div className={styles.bottomToolbar}>
      <span className={styles.toolbarLabel}>Danh Sách Scene ({scenes.length}):</span>

      {scenes.map((s, idx) => {
        const isSelected = activeScene?.id === s.id;
        const imgUrl = s.path || '';

        return (
          <button
            key={s.id || idx}
            onClick={() => {
              if (onSelectScene) onSelectScene(s);
            }}
            className={`${styles.sceneChip} ${isSelected ? styles.active : ''}`}
          >
            {imgUrl ? (
              <img
                src={imgUrl}
                alt={s.name}
                style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '6px',
                  objectFit: 'cover',
                }}
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            ) : (
              <div
                style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '6px',
                  background: 'rgba(255, 255, 255, 0.2)',
                }}
              />
            )}
            <span>{s.name || `Scene ${idx + 1}`}</span>
          </button>
        );
      })}
    </div>
  );
}
