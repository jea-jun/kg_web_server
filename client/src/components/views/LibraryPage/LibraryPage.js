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

  useEffect(() => {
    // 모델이 로드된 후, 각 요소가 참조에 제대로 연결되었는지 확인하는 로그
    scene.traverse((child) => {
      if (child.isMesh || child.isBone) {
        console.log('Connected part:', child.name); // 모델의 각 부품 이름 확인
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
  }, [scene]);

  useFrame(() => {
    if (robotData && robotData.robot_arm_joint) {
      const joints = robotData.robot_arm_joint;

      // 모델의 각 부품에 회전 값 적용
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
  });

  return (
    <group>
      <group ref={axisRefs.base}>
        <group ref={axisRefs.shoulder}>
          <group ref={axisRefs.upperArm}>
            <group ref={axisRefs.elbow}>
              <group ref={axisRefs.forearm}>
                <group ref={axisRefs.wrist}>
                  <group ref={axisRefs.gripper}>
                    <primitive object={scene} />
                  </group>
                </group>
              </group>
            </group>
          </group>
        </group>
      </group>
    </group>
  );
}

function RobotStatusPage() {
  const [robotData, setRobotData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/robot/data');
        if (response.data.success) {
          setRobotData(response.data.data);
        } else {
          console.error('Failed to fetch robot data');
        }
      } catch (error) {
        console.error('Error fetching robot data:', error);
      }
    };

    // 1초 간격으로 데이터 업데이트
    const interval = setInterval(fetchData, 1000);

    return () => clearInterval(interval); // 컴포넌트 언마운트 시 정리
  }, []);

  return (
    <div className="robot-status-container">
      <div className="text-container">
        <h1>Robot Status</h1>
        {robotData.length > 0 ? (
          robotData.map((data, index) => (
            <div key={index}>
              <div>Date: {data.date || 'N/A'}</div>
              <div>Time: {data.time || 'N/A'}</div>
              <div>AGV: {data.agv || 'N/A'}</div>
              <div>
                Robot Arm:{' '}
                {(data.robot_arm_joint && data.robot_arm_joint.join(', ')) || 'N/A'}
              </div>
              <div>Other Data: {JSON.stringify(data.otherData) || 'N/A'}</div>
              <hr />
            </div>
          ))
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
          <Suspense fallback={<div>Loading...</div>}>
            {/* RobotModel에 로봇 데이터를 전달 */}
            <RobotModel robotData={robotData[0]} />
          </Suspense>
          <OrbitControls />
        </Canvas>
      </div>
    </div>
  );
}

export default RobotStatusPage;
