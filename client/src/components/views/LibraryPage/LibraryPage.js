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
  };

  // 로봇 모델의 각 부품에 접근하여 회전 값을 설정
  useEffect(() => {
    if (scene) {
      scene.traverse((child) => {
        if (child.isBone || child.isMesh) {
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
            default:
              break;
          }
        }
      });
    }
  }, [scene]);

  // 로봇의 관절 회전 값 업데이트
  useEffect(() => {
    if (robotData && robotData.robot_arm_joint) {
      const joints = robotData.robot_arm_joint; // 예: [0, 0.5, -1.2, 0.3, 0.8, -0.5, 1.0]
      
      // 각 관절에 대한 회전 값 설정
      if (axisRefs.base.current) {
        axisRefs.base.current.rotation.y = joints[0] || 0;
      }
      if (axisRefs.shoulder.current) {
        axisRefs.shoulder.current.rotation.x = joints[1] || 0;
      }
      if (axisRefs.upperArm.current) {
        axisRefs.upperArm.current.rotation.x = joints[2] || 0;
      }
      if (axisRefs.elbow.current) {
        axisRefs.elbow.current.rotation.x = joints[3] || 0;
      }
      if (axisRefs.forearm.current) {
        axisRefs.forearm.current.rotation.x = joints[4] || 0;
      }
      if (axisRefs.wrist.current) {
        axisRefs.wrist.current.rotation.x = joints[5] || 0;
      }
      if (axisRefs.gripper.current) {
        axisRefs.gripper.current.rotation.x = joints[6] || 0;
      }
    }
  }, [robotData]); // robotData가 변경될 때마다 관절 업데이트

  return <primitive object={scene} />;
}

function RobotStatusPage() {
  const [robotData, setRobotData] = useState({});
  const [agvData, setAgvData] = useState({});
  const [forceRender, setForceRender] = useState(false); // 렌더링 강제 트리거용 상태

  // API에서 데이터를 주기적으로 가져오기
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/robot/data');
        if (response.data.success) {
          setRobotData(response.data.data);
          setAgvData(response.data.data.agv || {});
        } else {
          console.error('Failed to fetch robot/AGV data');
        }
      } catch (error) {
        console.error('Error fetching robot/AGV data:', error);
      }
    };

    // 1초 간격으로 데이터 업데이트
    const interval = setInterval(() => {
      fetchData();
      setForceRender(prev => !prev); // 강제 리렌더링을 위해 상태 반전
    }, 1000);

    return () => clearInterval(interval); // 컴포넌트 언마운트 시 정리
  }, []);

  return (
    <div className="robot-status-container">
      <div className="text-container">
        <h1>Robot Status</h1>
        {robotData ? (
          <div>
            <div>Date: {robotData.date || 'N/A'}</div>
            <div>Time: {robotData.time || 'N/A'}</div>
            <div>AGV ID: {robotData.agv || 'N/A'}</div>
            <div>
              Robot Arm Joint:{' '}
              {robotData.robot_arm_joint ? robotData.robot_arm_joint.join(', ') : 'N/A'}
            </div>
            <div>Other Data: {JSON.stringify(robotData.otherData) || 'N/A'}</div>
          </div>
        ) : (
          <div>No data available</div>
        )}
      </div>

      {/* 카메라 피드 렌더링 */}
      <div className="camera-container">
        <h1>Camera View</h1>
        {robotData.camera ? (
          <div className="camera-feed">
            <img 
              src={`data:image/jpeg;base64,${robotData.camera}`} 
              alt="Camera Feed" 
              style={{ width: '100%', height: 'auto' }} 
            />
          </div>
        ) : (
          <div>No camera data available</div>
        )}
      </div>

      {/* 3D 로봇 모델 */}
      <div className="blender-model-container">
        <h1>3D Robot Model</h1>
        <Canvas camera={{ position: [0, 6, 10], fov: 50 }}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1.0} />
          <Suspense fallback={null}>
            <RobotModel robotData={robotData} />
          </Suspense>
          <OrbitControls />
        </Canvas>
      </div>
    </div>
  );
}

export default RobotStatusPage;


