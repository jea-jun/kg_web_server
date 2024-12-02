import React, { useEffect, useState, useRef, Suspense } from 'react';
import axios from 'axios';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';

function RobotModel({ robotData }) {
  // GLTF 모델 로드
  const { scene } = useGLTF('/untitled.glb'); // GLTF 파일 경로 확인

  // 본(Bone) 참조 설정
  const bones = useRef({
    base: null,
    shoulder: null,
    upper_arm: null,
    elbow: null,
    forearm: null,
    wrist: null,
    gripper: null,
  });

  // GLTF의 Bone 객체를 가져오기
  useEffect(() => {
    bones.current.base = scene.getObjectByName('base');
    bones.current.shoulder = scene.getObjectByName('shoulder');
    bones.current.upper_arm = scene.getObjectByName('upper_arm');
    bones.current.elbow = scene.getObjectByName('elbow');
    bones.current.forearm = scene.getObjectByName('forearm');
    bones.current.wrist = scene.getObjectByName('wrist');
    bones.current.gripper = scene.getObjectByName('gripper');

    // 디버깅을 위해 로드된 본 출력
    console.log('Loaded Bones:', bones.current);
  }, [scene]);

  // 애니메이션 프레임마다 로봇 관절 데이터를 업데이트
  useFrame(() => {
    if (robotData && robotData.robot_arm_joint) {
      const joints = robotData.robot_arm_joint;
      if (bones.current.base) bones.current.base.rotation.y = joints[0] || 0;
      if (bones.current.shoulder) bones.current.shoulder.rotation.z = joints[1] || 0;
      if (bones.current.upper_arm) bones.current.upper_arm.rotation.x = joints[2] || 0;
      if (bones.current.elbow) bones.current.elbow.rotation.y = joints[3] || 0;
      if (bones.current.forearm) bones.current.forearm.rotation.z = joints[4] || 0;
      if (bones.current.wrist) bones.current.wrist.rotation.x = joints[5] || 0;
      if (bones.current.gripper) bones.current.gripper.rotation.z = joints[6] || 0;
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
