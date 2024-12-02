import React, { useEffect, useState, useRef, Suspense } from 'react';
import axios from 'axios';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';

function RobotModel({ robotData }) {
  // GLTF 모델 로드
  const { nodes, scene } = useGLTF('/untitled.glb'); // 모델 경로 수정

  // 본(Bone) 참조 설정
  const bones = {
    base: scene.getObjectByName('base'),
    shoulder: scene.getObjectByName('shoulder'),
    upper_arm: scene.getObjectByName('upper_arm'),
    elbow: scene.getObjectByName('elbow'),
    forearm: scene.getObjectByName('forearm'),
    wrist: scene.getObjectByName('wrist'),
    gripper: scene.getObjectByName('gripper'),
  };

  // 애니메이션 프레임마다 로봇 관절 데이터를 업데이트
  useFrame(() => {
    if (robotData && robotData.robot_arm_joint) {
      const joints = robotData.robot_arm_joint;
      if (bones.base) bones.base.rotation.y = joints[0] || 0;
      if (bones.shoulder) bones.shoulder.rotation.z = joints[1] || 0;
      if (bones.upper_arm) bones.upper_arm.rotation.x = joints[2] || 0;
      if (bones.elbow) bones.elbow.rotation.y = joints[3] || 0;
      if (bones.forearm) bones.forearm.rotation.z = joints[4] || 0;
      if (bones.wrist) bones.wrist.rotation.x = joints[5] || 0;
      if (bones.gripper) bones.gripper.rotation.z = joints[6] || 0;
    }
  });

  return <primitive object={scene} />;
}

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

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="robot-status-container">
      <div className="text-container">
        <h1>Robot Status</h1>
        {robotData ? (
          <div>
            <div>Date: {robotData.date || 'N/A'}</div>
            <div>Time: {robotData.time || 'N/A'}</div>
            <div>AGV: {robotData.agv || 'N/A'}</div>
            <div>
              Robot Arm:{' '}
              {(robotData.robot_arm_joint && robotData.robot_arm_joint.join(', ')) || 'N/A'}
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
      <div className="blender-model-container">
        <h1>3D Robot Model</h1>
        <Canvas camera={{ position: [0, 6, 10], fov: 50 }}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1.0} />
          <Suspense fallback={<div>Loading 3D model...</div>}>
            <RobotModel robotData={robotData} />
          </Suspense>
          <OrbitControls />
        </Canvas>
      </div>
    </div>
  );
}

export default RobotStatusPage;
