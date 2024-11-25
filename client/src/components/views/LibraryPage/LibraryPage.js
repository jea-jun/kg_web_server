import React, { useEffect, useState, Suspense } from 'react';
import axios from 'axios';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';

function RobotModel() {
  const { scene } = useGLTF('/untitled.glb');
  return <primitive object={scene} />;
}

function RobotStatusPage() {
  const [robotData, setRobotData] = useState([]);

  useEffect(() => {
    axios.get('/data')
      .then(response => {
        if (response.data.success) {
          setRobotData(response.data.data);
        } else {
          console.error('Failed to fetch robot data');
        }
      })
      .catch(error => {
        console.error('Error fetching robot data:', error);
      });
  }, []);

  return (
    <div className="robot-status-container">
      <div className="text-container">
        <h1>Robot Status Data</h1>
        <ul>
          {robotData.length > 0 ? (
            robotData.map((data, index) => (
              <li key={index}>
                <div>Date: {data.date || 'N/A'}</div>
                <div>Time: {data.time || 'N/A'}</div>
                <div>AGV: {data.agv || 'N/A'}</div>
                <div>Robot Arm: {data.robot_arm ? data.robot_arm.join(', ') : 'N/A'}</div>
                <div>Other Data: {JSON.stringify(data.otherData) || 'N/A'}</div>
                <hr />
              </li>
            ))
          ) : (
            <li>
              <div>Date: N/A</div>
              <div>Time: N/A</div>
              <div>AGV: N/A</div>
              <div>Robot Arm: N/A</div>
              <div>Other Data: N/A</div>
              <hr />
            </li>
          )}
        </ul>
      </div>
      <div className="camera-container">
        <h1>Camera View</h1>
        <div className="camera-feed">
          {/* 여기에 카메라 피드를 표시하기 위한 요소를 추가 */}
          <img src="/path/to/camera/feed" alt="Camera Feed" />
        </div>
      </div>
      <div className="blender-model-container">
        <h1>3D Robot Model</h1>
        <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          <Suspense fallback={null}>
            <RobotModel />
          </Suspense>
          <OrbitControls />
        </Canvas>
      </div>
    </div>
  );
}

export default RobotStatusPage;

// Notes:
// 1. Replace '/path/to/your/robot-model.glb' with the actual path to your GLB file.
// 2. Install dependencies compatible with React 17:
//    npm install @react-three/fiber@^6.2.3 @react-three/drei@^6.2.2 three@^0.128.0 --legacy-peer-deps
// 3. Ensure your Node version is 16 to avoid compatibility issues.
// 4. The <Suspense> component helps with loading the model asynchronously.
// 5. To check if the necessary packages are installed, run:
//    npm list @react-three/fiber @react-three/drei three
