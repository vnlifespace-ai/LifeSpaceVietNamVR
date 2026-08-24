import React, { useState } from 'react';
import VR360Viewer from '../../components/VR360Viewer';


const SCENES = {
    A1: {
        id: 'A1',
        title: 'Khách Bếp',
        shortName: 'Khách Bếp',
        imageUrl: 'https://woclxhuxiynyuzohzuqu.supabase.co/storage/v1/object/public/VR/mia/cane/1F/KHACH%20BEP.jpg',
        initialRotation: Math.PI,
        hotspots: [
            { id: 'hs1_2', position: [0, 0, -14.4], target: 'A2', label: 'Phòng ngủ 1' },
            { id: 'hs1_5', position: [-5, 0, 14.4], target: 'A5', label: 'Lên tầng 2' },
            
        ]
    },
    A2: {
        id: 'A2',
        title: 'Phòng ngủ 1',
        shortName: 'Phòng ngủ 1',
        imageUrl: 'https://woclxhuxiynyuzohzuqu.supabase.co/storage/v1/object/public/VR/mia/cane/1F/NGU%201.jpg',
        initialRotation: 0,
        hotspots: [
            { id: 'hs2_1', position: [-20, 0, 14.4], target: 'A1', label: 'Khách bếp' },
            { id: 'hs2_4', position: [-12, 0, 14.4], target: 'A4', label: 'Nhà vệ sinh' }
        ]
    },
    A3: {
        id: 'A3',
        title: 'Nhà vệ sinh chung',
        shortName: 'Nhà vệ sinh chung',
        imageUrl: 'https://woclxhuxiynyuzohzuqu.supabase.co/storage/v1/object/public/VR/mia/cane/1F/WC%20CHUNG.jpg',
        initialRotation: 0,
        hotspots: [
        ]
    },
    A4: {
        id: 'A4',
        title: 'Nhà vệ sinh',
        shortName: 'Nhà vệ sinh',
        imageUrl: 'https://woclxhuxiynyuzohzuqu.supabase.co/storage/v1/object/public/VR/mia/cane/1F/WC%20NGU%201.jpg',
        initialRotation: 0,
        hotspots: [
            { id: 'hs4_2', position: [20, 0, -14.4], target: 'A2', label: 'Phòng ngủ 1' },
            { id: 'hs4_1', position: [14, 0, -14.4], target: 'A5', label: 'Phòng khách 1' }
        ]
    },
    A5: {
        id: 'A5',
        title: 'Khòng khách 2',
        shortName: 'Phòng khách 2',
        imageUrl: 'https://woclxhuxiynyuzohzuqu.supabase.co/storage/v1/object/public/VR/mia/cane/2F/SINH%20HOAT%20CHUNG.jpg',
        initialRotation: 0,
        hotspots: [
            { id: 'hs5_1', position: [-15, -10, 14.4], target: 'A1', label: 'Xuống tầng 1' },
            { id: 'hs5_2', position: [15, 0, -14.4], target: 'A6', label: 'Phòng ngủ 2' },
            { id: 'hs5_3', position: [12.1, 1.6, 8.7], target: 'A8', label: 'Nhà vệ sinh 2' },

        ]
    },
    A6: {
        id: 'A6',
        title: 'Phòng ngủ 2',
        shortName: 'Phòng ngủ 2',
        imageUrl: 'https://woclxhuxiynyuzohzuqu.supabase.co/storage/v1/object/public/VR/mia/cane/2F/NGU%202.jpg',
        initialRotation: 0,
        hotspots: [
            { id: 'hs6_5', position: [4, 0, -14.4], target: 'A5', label: 'Phòng khách 2' },
            { id: 'hs6_1', position: [-4, 0, -14.4], target: 'A7', label: 'Nhà vệ sinh 1' }
        ]
    },
    A7: {
        id: 'A7',
        title: 'Nhà vệ sinh 1',
        shortName: 'Nhà vệ sinh 1',
        imageUrl: 'https://woclxhuxiynyuzohzuqu.supabase.co/storage/v1/object/public/VR/mia/cane/2F/WC1.jpg',
        initialRotation: 0,
        hotspots: [

            { id: 'hs7_6', position: [4, 0, -14.4], target: 'A6', label: 'Phòng ngủ 2' }
            
        ]
    },
    A8: {
        id: 'A8',
        title: 'Nhà vệ sinh 2',
        shortName: 'Nhà vệ sinh 2',
        imageUrl: 'https://woclxhuxiynyuzohzuqu.supabase.co/storage/v1/object/public/VR/mia/cane/2F/WC2.jpg',
        initialRotation: 0,
        hotspots: [
            { id: 'hs8_5', position: [12, -2, 14.4], target: 'A5', label: 'Phòng khách 2' }
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

export default function CanEPage() {
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
            projectName="MIA APARTMENT - Căn E"
        />
    );
}
