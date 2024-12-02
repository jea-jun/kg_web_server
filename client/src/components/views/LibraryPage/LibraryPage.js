import React, { useEffect, useState, Suspense } from 'react';
import axios from 'axios';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';

// 계층 구조 탐색 함수
const logSceneHierarchy = (object, depth = 0) => {
  console.log(`${' '.repeat(depth * 2)}${object.name || '(no name)'} - ${object.type}`);
  if (object.children.length > 0) {
    object.children.forEach((child) => logSceneHierarchy(child, depth + 1));
  }
};

// 3D 모델 로드 컴포넌트
function RobotModel() {
  const { scene } = useGLTF('/untitled.glb'); // GLTF 파일 경로를 확인하세요

  useEffect(() => {
    console.log('Scene Hierarchy:');
    logSceneHierarchy(scene);
  }, [scene]);

  return <primitive object={scene} />;
}

// 메인 컴포넌트
function RobotStatusPage() {
  const [robotData, setRobotData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/robot/data');
        if (response.data.success) {
          console.log('Fetched Data:', response.data.data);
          setRobotData(response.data.data);
        } else {
          console.error('Failed to fetch robot/AGV data');
        }
      } catch (error) {
        console.error('Error fetching robot/AGV data:', error);
      }
    };

    // 1초 간격으로 데이터 업데이트
    const interval = setInterval(fetchData, 1000);

    return () => clearInterval(interval); // 컴포넌트 언마운트 시 정리
  }, []);

  return (
    <div className="robot-status-container" style={{ display: 'flex', flexDirection: 'row', height: '100vh' }}>
      {/* 로봇 상태 데이터 표시 */}
      <div className="text-container" style={{ flex: 1, padding: '20px' }}>
        <h1>Robot Status</h1>
        {robotData ? (
          <div>
            <div>Date: {robotData.date || 'N/A'}</div>
            <div>Time: {robotData.time || 'N/A'}</div>
            <div>AGV: {robotData.agv || 'N/A'}</div>
            <div>
              Robot Arm: {(robotData.robot_arm_joint && robotData.robot_arm_joint.join(', ')) || 'N/A'}
            </div>
            <div>Other Data: {JSON.stringify(robotData.otherData) || 'N/A'}</div>
          </div>
        ) : (
          <div>
            <div>Date: N/A</div>
            <div>Time: N/A</div>
            <div>AGV: N/A</div>
            <div>Robot Arm: N/A</div>
            <div>Other Data: N/A</div>
          </div>
        )}
      </div>

      {/* 블렌더 GLTF 모델 표시 */}
      <div className="blender-model-container" style={{ flex: 2 }}>
        <h1>3D Robot Model</h1>
        <Canvas camera={{ position: [0, 6, 10], fov: 50 }}>
          {/* 조명 추가 */}
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1.0} />

          {/* GLTF 모델 로드 */}
          <Suspense fallback={<div>Loading 3D model...</div>}>
            <RobotModel />
          </Suspense>

          {/* 카메라 컨트롤 */}
          <OrbitControls />
        </Canvas>
      </div>
    </div>
  );
}

export default RobotStatusPage;
