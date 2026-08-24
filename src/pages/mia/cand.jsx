import React, { useState } from 'react';
import VR360Viewer from '../../components/VR360Viewer';


const SCENES = {
    A1: {
        id: 'A1',
        title: 'Phòng khách 1',
        shortName: 'Phòng khách 1',
        imageUrl: 'https://woclxhuxiynyuzohzuqu.supabase.co/storage/v1/object/public/VR/mia/cand/KHACH%201.jpg',
        initialRotation: Math.PI,
        hotspots: [

            { id: 'hs1_3', position: [8, 0, 14.4], target: 'A3', label: 'Phòng ngủ 1' },
            { id: 'hs1_8', position: [0, 0, -14.4], target: 'A8', label: 'Nhà vệ sinh' },
            
        ]
    },
    A2: {
        id: 'A2',
        title: 'Phòng khách 2',
        shortName: 'Phòng khách 2',
        imageUrl: 'https://woclxhuxiynyuzohzuqu.supabase.co/storage/v1/object/public/VR/mia/cand/KHACH%202.jpg',
        initialRotation: 0,
        hotspots: [
            { id: 'hs2_5', position: [-7, 0, -14.4], target: 'A5', label: 'Phòng ngủ 3' },
            { id: 'hs2_4', position: [30, 0, -14.4], target: 'A4', label: 'Phòng ngủ 2' },
            { id: 'hs2_6', position: [40, 0, 14.4], target: 'A6', label: 'Nhà vệ sinh' }
        ]
    },
    A3: {
        id: 'A3',
        title: 'Phòng ngủ 1',
        shortName: 'Phòng ngủ 1',
        imageUrl: 'https://woclxhuxiynyuzohzuqu.supabase.co/storage/v1/object/public/VR/mia/cand/NGU%201.jpg',
        initialRotation: 0,
        hotspots: [
            { id: 'hs3_1', position: [2, 0, 14.4], target: 'A1', label: 'Phòng khách 1' },
        ]
    },
    A4: {
        id: 'A4',
        title: 'Phòng ngủ 2',
        shortName: 'Phòng ngủ 2',
        imageUrl: 'https://woclxhuxiynyuzohzuqu.supabase.co/storage/v1/object/public/VR/mia/cand/NGU%202.jpg',
        initialRotation: 0,
        hotspots: [
        ]
    },
    A5: {
        id: 'A5',
        title: 'Phòng ngủ 3',
        shortName: 'Phòng ngủ 3',
        imageUrl: 'https://woclxhuxiynyuzohzuqu.supabase.co/storage/v1/object/public/VR/mia/cand/NGU%203.jpg',
        initialRotation: 0,
        hotspots: [
            { id: 'hs5_2', position: [0, 0, -14.4], target: 'A2', label: 'Phòng khách 2' },

        ]
    },
    A6: {
        id: 'A6',
        title: 'Nhà vệ sinh 1',
        shortName: 'Nhà vệ sinh 1',
        imageUrl: 'https://woclxhuxiynyuzohzuqu.supabase.co/storage/v1/object/public/VR/mia/cand/WC%201.jpg',
        initialRotation: 0,
        hotspots: [
            { id: 'hs6_2', position: [-10, 0, -14.4], target: 'A2', label: 'Phòng khách 2' }
            
        ]
    },
    A7: {
        id: 'A7',
        title: 'Nhà vệ sinh 2',
        shortName: 'Nhà vệ sinh 2',
        imageUrl: 'https://woclxhuxiynyuzohzuqu.supabase.co/storage/v1/object/public/VR/mia/cand/WC%202.jpg',
        initialRotation: 0,
        hotspots: [
            
        ]
    },
    A8: {
        id: 'A8',
        title: 'Nhà vệ sinh 3',
        shortName: 'Nhà vệ sinh 3',
        imageUrl: 'https://woclxhuxiynyuzohzuqu.supabase.co/storage/v1/object/public/VR/mia/cand/WC%203.jpg',
        initialRotation: 0,
        hotspots: [
            { id: 'hs8_1', position: [12, -2, 14.4], target: 'A1', label: 'Phòng khách 1' }
        ]
    }

};

const scenesList = Object.values(SCENES);

const floorPlanCoords = {
    A1: { x: 23, y: 24 },
    A2: { x: 36, y: 24 },
    A3: { x: 63, y: 40 },
    A4: { x: 49, y: 62 },
    A5: { x: 75, y: 62 },
    A6: { x: 23, y: 24 },
    A7: { x: 36, y: 24 },
    A8: { x: 63, y: 40 }
};

export default function CanDPage() {
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
            projectName="MIA APARTMENT - Căn D"
        />
    );
}
