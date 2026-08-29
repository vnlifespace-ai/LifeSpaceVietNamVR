import React, { Suspense, useEffect, useRef } from 'react';
import { Canvas, useLoader, useThree, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import HotspotMarker from './HotspotMarker';
import ActionPopover from './ActionPopover';

// 360 Panorama Sphere Mesh (optimized with texture filtering and 48x32 geometry)
function PanoramaMesh({ imageUrl, onSphereClick, isPlacingAction }) {
  const texture = useLoader(THREE.TextureLoader, imageUrl);
  const { camera } = useThree();

  useEffect(() => {
    if (texture) {
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.generateMipmaps = false;
      texture.minFilter = THREE.LinearFilter;
    }
  }, [texture]);

  // Handle Right-Click (ContextMenu) to create/place hotspot directly
  const handleContextMenu = (e) => {
    e.stopPropagation();
    if (e.nativeEvent) {
      e.nativeEvent.preventDefault();
    }

    if (onSphereClick && e.point) {
      // Calculate sub-pixel accurate direction vector from camera origin to intersected sphere surface
      const clickPoint = e.point.clone();
      const dir = clickPoint.sub(camera.position).normalize();
      const x = parseFloat(Number(dir.x).toFixed(4)) || 0.1;
      const y = parseFloat(Number(dir.y).toFixed(4)) || 0.1;
      const z = parseFloat(Number(dir.z).toFixed(4)) || 0.1;
      onSphereClick({ x, y, z });
    }
  };

  // Also support left-click when isPlacingAction mode is explicitly toggled ON
  const handleLeftClick = (e) => {
    if (!isPlacingAction || !onSphereClick) return;
    if (e.point) {
      e.stopPropagation();
      const clickPoint = e.point.clone();
      const dir = clickPoint.sub(camera.position).normalize();
      const x = parseFloat(Number(dir.x).toFixed(4)) || 0.1;
      const y = parseFloat(Number(dir.y).toFixed(4)) || 0.1;
      const z = parseFloat(Number(dir.z).toFixed(4)) || 0.1;
      onSphereClick({ x, y, z });
    }
  };

  return (
    <mesh
      scale={[-1, 1, 1]}
      onContextMenu={handleContextMenu}
      onClick={handleLeftClick}
    >
      <sphereGeometry args={[500, 48, 32]} />
      <meshBasicMaterial map={texture} side={THREE.DoubleSide} />
    </mesh>
  );
}

// Camera FOV controller for Zoom in / Zoom out
function FovController({ fov }) {
  const { camera } = useThree();
  useEffect(() => {
    if (camera) {
      camera.fov = fov;
      camera.updateProjectionMatrix();
    }
  }, [fov, camera]);
  return null;
}

// Camera Position & Direction Controller based on positionX, positionY, positionZ
function CameraController({ positionX, positionY, positionZ, controlsRef }) {
  const { camera } = useThree();

  useEffect(() => {
    const posX = Number(positionX) ?? 0.1;
    const posY = Number(positionY) ?? 0.1;
    const posZ = Number(positionZ) ?? 0.1;

    if (camera && controlsRef?.current) {
      camera.position.set(0, 0, 0.0001);
      controlsRef.current.target.set(posX * 100, posY * 100, posZ * 100);
      controlsRef.current.update();
    }
  }, [positionX, positionY, positionZ, camera, controlsRef]);

  return null;
}

// Live Camera Direction Vector Tracker (updates DOM directly for 60fps+ GPU butter-smooth performance without React re-renders)
function CameraTracker({ coordsSpanRef, currentCoordsRef }) {
  const { camera } = useThree();
  const dirVec = useRef(new THREE.Vector3());

  useFrame(() => {
    if (camera) {
      camera.getWorldDirection(dirVec.current);
      const x = parseFloat(Number(dirVec.current.x).toFixed(4)) || 0.1;
      const y = parseFloat(Number(dirVec.current.y).toFixed(4)) || 0.1;
      const z = parseFloat(Number(dirVec.current.z).toFixed(4)) || 0.1;

      if (
        currentCoordsRef.current.x !== x ||
        currentCoordsRef.current.y !== y ||
        currentCoordsRef.current.z !== z
      ) {
        currentCoordsRef.current = { x, y, z };
        if (coordsSpanRef.current) {
          coordsSpanRef.current.innerText = `Tọa độ hiện tại: X: ${x}, Y: ${y}, Z: ${z}`;
        }
      }
    }
  });

  return null;
}

export default function ThreeCanvasScene({
  currentImageUrl,
  fov,
  activeScene,
  controlsRef,
  coordsSpanRef,
  currentCoordsRef,
  autoRotate,
  navigations = [],
  scenes = [],
  selectedNavId = null,
  onSelectScene,
  onDeleteNavigation,
  onSelectNavToAdjust,
  isPlacingAction,
  activePointerCoords,
  onSphereClick,
  onCancelPointer,
  onCreateActionSubmit,
}) {
  return (
    <Canvas
      camera={{ position: [0, 0, 0.0001], fov }}
      gl={{ powerPreference: 'high-performance', antialias: true }}
      dpr={[1, 2]}
      style={{ width: '100%', height: '100%', cursor: isPlacingAction ? 'crosshair' : 'grab' }}
    >
      <FovController fov={fov} />
      <CameraController
        positionX={activeScene?.positionX}
        positionY={activeScene?.positionY}
        positionZ={activeScene?.positionZ}
        controlsRef={controlsRef}
      />
      <CameraTracker coordsSpanRef={coordsSpanRef} currentCoordsRef={currentCoordsRef} />

      {currentImageUrl ? (
        <Suspense
          fallback={
            <mesh>
              <sphereGeometry args={[500, 32, 16]} />
              <meshBasicMaterial color="#0f172a" side={THREE.BackSide} />
            </mesh>
          }
        >
          <PanoramaMesh
            key={currentImageUrl}
            imageUrl={currentImageUrl}
            onSphereClick={onSphereClick}
            isPlacingAction={isPlacingAction}
          />
        </Suspense>
      ) : (
        <mesh>
          <sphereGeometry args={[500, 32, 16]} />
          <meshBasicMaterial color="#0a0c10" side={THREE.BackSide} />
        </mesh>
      )}

      {/* Render 3D Action Navigation Hotspots */}
      {navigations.map((nav, index) => {
        const navKey = nav.id || nav._tempId || `nav-${index}`;
        const isSelected = Boolean(
          selectedNavId &&
            (nav.id
              ? nav.id === selectedNavId
              : nav._tempId
              ? nav._tempId === selectedNavId
              : nav === selectedNavId)
        );

        return (
          <HotspotMarker
            key={navKey}
            nav={nav}
            scenes={scenes}
            isSelected={isSelected}
            onSelectScene={onSelectScene}
            onDeleteNavigation={onDeleteNavigation}
            onSelectNavToAdjust={onSelectNavToAdjust}
          />
        );
      })}

      {/* Render Active Pointer Action Creation Popover anchored at clicked 3D coordinates */}
      {activePointerCoords && (
        <ActionPopover
          coords={activePointerCoords}
          scenes={scenes}
          activeScene={activeScene}
          onCancel={onCancelPointer}
          onSubmit={onCreateActionSubmit}
        />
      )}

      <OrbitControls
        ref={controlsRef}
        enableZoom={false}
        enablePan={false}
        rotateSpeed={-0.5}
        autoRotate={autoRotate}
        autoRotateSpeed={0.8}
      />
    </Canvas>
  );
}
