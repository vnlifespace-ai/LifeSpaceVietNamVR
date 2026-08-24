import React, { useState } from 'react';
import VR360Viewer from '../../components/VR360Viewer';


const SCENES = {
    A1: {
        id: 'A1',
        title: 'KHÁCH BẾP',
        shortName: 'Khách bếp',
        imageUrl: 'https://woclxhuxiynyuzohzuqu.supabase.co/storage/v1/object/public/VR/mia/canb/KHACH%20BEP.jpg',
        initialRotation: Math.PI,
        hotspots: [
        ]
    },
    A2: {
        id: 'A2',
        title: 'Master',
        shortName: 'Master',
        imageUrl: 'https://woclxhuxiynyuzohzuqu.supabase.co/storage/v1/object/public/VR/mia/canb/MASTER.jpg',
        initialRotation: 0,
        hotspots: [
        ]
    },
    A3: {
        id: 'A3',
        title: 'Phòng ngủ con trai',
        shortName: 'Phòng ngủ con trai',
        imageUrl: 'https://woclxhuxiynyuzohzuqu.supabase.co/storage/v1/object/public/VR/mia/canb/NGU%20CON%20PA1.jpg',
        initialRotation: 0,
        hotspots: [
        ]
    },
    A4: {
        id: 'A4',
        title: 'Nhà vệ sinh (WC)',
        shortName: 'Nhà vệ sinh',
        imageUrl: 'https://woclxhuxiynyuzohzuqu.supabase.co/storage/v1/object/public/VR/mia/canb/WC%201.jpg',
        initialRotation: 0,
        hotspots: [
        ]
    },
    A5: {
        id: 'A5',
        title: 'Nhà Vệ Sinh (WC)',
        shortName: 'Nhà vệ sinh',
        imageUrl: 'https://woclxhuxiynyuzohzuqu.supabase.co/storage/v1/object/public/VR/mia/canb/WC%202.jpg',
        initialRotation: 0,
        hotspots: [

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

export default function CanBPage() {
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
            showCoordinateHelper={true}
            projectName="MIA APARTMENT - Căn B"
        />
    );
}
