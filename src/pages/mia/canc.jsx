import React, { useState } from 'react';
import VR360Viewer from '../../components/VR360Viewer';


const SCENES = {
    A1: {
        id: 'A1',
        title: 'KHÁCH BẾP',
        shortName: 'Khách bếp',
        imageUrl: 'https://woclxhuxiynyuzohzuqu.supabase.co/storage/v1/object/public/VR/mia/canc/01.%20KHACH%20BEP.jpg',
        initialRotation: Math.PI,
        hotspots: [
            { id: 'hs1_5', position: [4, -1, -8.6], target: 'A5', label: 'Nhà vệ sinh' },
            { id: 'hs1_2', position: [0, 0, -13.9], target: 'A2', label: 'Phòng ngủ 1' },
            { id: 'hs1_3', position: [-3, -1, -14.8], target: 'A3', label: 'Phòng ngủ 2' }
        ]
    },
    A2: {
        id: 'A2',
        title: 'Phòng ngủ 1',
        shortName: 'Phòng ngủ 1',
        imageUrl: 'https://woclxhuxiynyuzohzuqu.supabase.co/storage/v1/object/public/VR/mia/canc/02.%20NGU%201.jpg',
        initialRotation: 0,
        hotspots: [
            { id: 'hs3_1', position: [-0.5, -1, -8.6], target: 'A4', label: 'Nhà vệ sinh' },
            { id: 'hs3_2', position: [3.5, 0, -13.9], target: 'A1', label: 'Khách bếp' }
        ]
    },
    A3: {
        id: 'A3',
        title: 'Phòng ngủ 2',
        shortName: 'Phòng ngủ 2',
        imageUrl: 'https://woclxhuxiynyuzohzuqu.supabase.co/storage/v1/object/public/VR/mia/canc/03.%20NGU%202.jpg',
        initialRotation: 0,
        hotspots: [
            { id: 'hs3_2', position: [14.5, -3.6, 1.6], target: 'A1', label: 'Khách bếp' }
            
        ]
    },
    A4: {
        id: 'A4',
        title: 'Nhà vệ sinh (WC)',
        shortName: 'Nhà vệ sinh',
        imageUrl: 'https://woclxhuxiynyuzohzuqu.supabase.co/storage/v1/object/public/VR/mia/canc/04.%20WC2.jpg',
        initialRotation: 0,
        hotspots: [
            { id: 'hs4_1', position: [0 , -1, 10], target: 'A2', label: 'Phòng ngủ 1' }
        ]
    },
    A5: {
        id: 'A5',
        title: 'Nhà Vệ Sinh (WC)',
        shortName: 'Nhà vệ sinh',
        imageUrl: 'https://woclxhuxiynyuzohzuqu.supabase.co/storage/v1/object/public/VR/mia/canc/05.%20WC1.jpg',
        initialRotation: 0,
        hotspots: [
            { id: 'hs5_1', position: [3, 2, 14.8], target: 'A1', label: 'Khách bếp' }

        ]
    }
};

const scenesList = Object.values(SCENES);

const floorPlanCoords = {
    A1: { x: 23, y: 24 },
    A2: { x: 36, y: 24 },
    A3: { x: 63, y: 40 },
    A4: { x: 49, y: 62 },
    A5: { x: 75, y: 62 }
};

export default function CanCPage() {
    const [currentSceneId, setCurrentSceneId] = useState('A1');
    const currentScene = SCENES[currentSceneId] || SCENES.A1;

    return (
        <VR360Viewer
            imageUrl={currentScene.imageUrl}
            hotspots={currentScene.hotspots}
            onNavigate={(nextSceneId) => setCurrentSceneId(nextSceneId)}
            sceneTitle={currentScene.title}
            currentSceneId={currentSceneId}
            scenesList={scenesList}
            floorPlanCoords={floorPlanCoords}
            initialRotation={currentScene.initialRotation || 0}
            showCoordinateHelper={false}
            projectName="MIA APARTMENT - Căn C"
        />
    );
}
