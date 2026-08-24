import React, { useState } from 'react';
import VR360Viewer from '../../components/VR360Viewer';


const SCENES = {
    A1: {
        id: 'A1',
        title: 'Phòng ngủ A',
        shortName: 'Phòng ngủ A',
        imageUrl: 'https://woclxhuxiynyuzohzuqu.supabase.co/storage/v1/object/public/VR/mia/cana/01.%20NGU%20A.jpg',
        initialRotation: Math.PI,
        hotspots: [
            { id: 'hs1_3', position: [0, 0, -14.4], target: 'A3', label: 'Khách bếp' }
        ]
    },
    A2: {
        id: 'A2',
        title: 'Phòng ngủ B',
        shortName: 'Phòng ngủ B',
        imageUrl: 'https://woclxhuxiynyuzohzuqu.supabase.co/storage/v1/object/public/VR/mia/cana/02.%20NGU%20B.jpg',
        initialRotation: 0,
        hotspots: [
            { id: 'hs2_3', position: [0, 0, -14.4], target: 'A3', label: 'Khách bếp' },
            { id: 'hs2_5', position: [-3, 0, -14.4], target: 'A5', label: 'Nhà vệ sinh' }
        ]
    },
    A3: {
        id: 'A3',
        title: 'Khách bếp',
        shortName: 'Khách bếp',
        imageUrl: 'https://woclxhuxiynyuzohzuqu.supabase.co/storage/v1/object/public/VR/mia/cana/03.%20KHACH%20BEP.jpg',
        initialRotation: 0,
        hotspots: [
            { id: 'hs3_2', position: [-4.9, 0, -13.9], target: 'A2', label: 'Phòng ngủ B' },
            { id: 'hs3_1', position: [11.8, 0, -8.8], target: 'A1', label: 'Phòng ngủ A' },
            { id: 'hs3_4', position: [0, 0, -14.8], target: 'A4', label: 'Nhà vệ sinh (WC)' },
        ]
    },
    A4: {
        id: 'A4',
        title: 'Nhà vệ sinh (WC)',
        shortName: 'Nhà vệ sinh',
        imageUrl: 'https://woclxhuxiynyuzohzuqu.supabase.co/storage/v1/object/public/VR/mia/cana/04.%20WC2.jpg',
        initialRotation: 0,
        hotspots: [
            { id: 'hs4_3', position: [6, 0, 14.8], target: 'A3', label: 'Khách bếp' }
        ]
    },
    A5: {
        id: 'A5',
        title: 'Nhà Vệ Sinh (WC)',
        shortName: 'Nhà vệ sinh',
        imageUrl: 'https://woclxhuxiynyuzohzuqu.supabase.co/storage/v1/object/public/VR/mia/cana/05.%20WC1.jpg',
        initialRotation: 0,
        hotspots: [
            { id: 'hs5_2', position: [20, 0, 5], target: 'A2', label: 'Phòng ngủ B' }
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

export default function CanAPage() {
    const [currentSceneId, setCurrentSceneId] = useState('A3');
    const currentScene = SCENES[currentSceneId] || SCENES.A3;

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
            projectName="MIA APARTMENT - Căn A"
        />
    );
}
