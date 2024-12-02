import React, { useEffect, useState, useRef, Suspense } from 'react';
import axios from 'axios';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';

function RobotModel({ robotData }) {
  const { scene } = useGLTF('/untitled.glb');

  const axisRefs = {
    base: useRef(),
    shoulder: useRef(),
    upperArm: useRef(),
    elbow: useRef(),
    forearm: useRef(),
    wrist: useRef(),
    gripper: useRef(),
    gripperLeft: useRef(),
    gripperRight: useRef(),
  };

  useEffect(() => {
    // 모델 로드 시 한 번 콘솔에 scene 요소 출력
    console.log('Loaded Robot Model Scene:', scene);

    // 접근 가능한 요소만 로그로 출력 및 참조 저장
    if (scene) {
      scene.traverse((child) => {
        if (child.isBone || child.isMesh) {
          console.log('Accessible Child:', child.name, child);
          switch (child.name) {
            case 'base':
              axisRefs.base.current = child;
              break;
            case 'shoulder':
              axisRefs.shoulder.current = child;
              break;
            case 'upper_arm':
              axisRefs.upperArm.current = child;
              break;
            case 'elbow':
              axisRefs.elbow.current = child;
              break;
            case 'forearm':
              axisRefs.forearm.current = child;
              break;
            case 'wrist':
              axisRefs.wrist.current = child;
              break;
            case 'gripper':
              axisRefs.gripper.current = child;
              break;
            case 'gripper_left':
              axisRefs.gripperLeft.current = child;
              break;
            case 'gripper_right':
              axisRefs.gripperRight.current = child;
              break;
            default:
              break;
          }
        }
      });
    }
  }, [scene]);

  useFrame(() => {
    if (robotData && robotData.robot_arm_joint) {
      // 로봇 암 관절 데이터를 적용
      const joints = robotData.robot_arm_joint; // 예: [0, 0.5, -1.2, 0.3, 0.8, -0.5, 1.0]
      if (axisRefs.base.current) axisRefs.base.current.rotation.y = joints[0] || 0;
      if (axisRefs.shoulder.current) axisRefs.shoulder.current.rotation.x = joints[1] || 0;
      if (axisRefs.upperArm.current) axisRefs.upperArm.current.rotation.x = joints[2] || 0;
      if (axisRefs.elbow.current) axisRefs.elbow.current.rotation.x = joints[3] || 0;
      if (axisRefs.forearm.current) axisRefs.forearm.current.rotation.x = joints[4] || 0;
      if (axisRefs.wrist.current) axisRefs.wrist.current.rotation.x = joints[5] || 0;
      if (axisRefs.gripper.current) axisRefs.gripper.current.rotation.x = joints[6] || 0;
    }
  });

  return (
    <group>
      <primitive object={scene} />
    </group>
  );
}

function RobotStatusPage() {
  const [robotData, setRobotData] = useState(null); // 초기 상태 null로 설정

  useEffect(() => {
    // 데이터 fetch 함수
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/robot/data');
        console.log('Fetched Robot Data:', response.data); // 데이터가 있는지 확인
        if (response.data.success) {
          setRobotData(response.data.data); // 성공적으로 데이터가 오면 상태 업데이트
        } else {
          console.error('Failed to fetch robot/AGV data');
        }
      } catch (error) {
        console.error('Error fetching robot/AGV data:', error);
      }
    };

    // 컴포넌트가 마운트될 때와 주기적으로 데이터를 가져오기
    fetchData(); // 처음 호출

    const interval = setInterval(fetchData, 1000); // 1초마다 데이터 갱신

    // 컴포넌트 언마운트 시 interval 정리
    return () => clearInterval(interval);
  }, []); // 빈 배열을 넣어 컴포넌트가 처음 마운트될 때만 실행되도록 함

  return (
    <div className="robot-status-container">
      <div className="text-container">
        <h1>Robot Status</h1>
        {robotData ? (
          <div>
            <div>Date: {robotData.date || 'N/A'}</div>
            <div>Time: {robotData.time || 'N/A'}</div>
            <div>AGV ID: {robotData.agv || 'N/A'}</div>
            <div>Robot Arm Joint: {(robotData.robot_arm_joint && robotData.robot_arm_joint.join(', ')) || 'N/A'}</div>
            <div>Speed: {robotData.otherData && robotData.otherData.speed ? robotData.otherData.speed : 'N/A'}</div>
            <div>Temperature: {robotData.otherData && robotData.otherData.temperature ? robotData.otherData.temperature : 'N/A'}</div>
          </div>
        ) : (
          <div>Loading...</div> // 데이터가 로딩 중일 때 "Loading..." 출력
        )}
      </div>
      <div className="camera-container">
        <h1>Camera View</h1>
        {/* 카메라 피드가 포함될 HTML */}
        <div className="camera-feed">
          <img src="/path/to/camera/feed" alt="Camera Feed" />
        </div>
      </div>
      <div className="blender-model-container">
        <h1>3D Robot Model</h1>
        <Canvas camera={{ position: [0, 6, 10], fov: 50 }}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1.0} />
          <Suspense fallback={null}>
            {/* RobotModel에 로봇 데이터를 전달 */}
            {robotData && <RobotModel robotData={robotData} />}
          </Suspense>
          <OrbitControls />
        </Canvas>
      </div>
    </div>
  );
}

export default RobotStatusPage;
