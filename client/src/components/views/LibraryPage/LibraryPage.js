import React, { useEffect, useState, useRef, Suspense } from 'react';
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

  // robotData가 바뀔 때마다 관절 회전 값 업데이트
  useEffect(() => {
    if (robotData && robotData.robot_arm_joint) {
      const joints = robotData.robot_arm_joint; // 예: [180, 20, 180, 20, 180, 20, 180]
      
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
  }, [robotData]); // robotData가 변경될 때마다 회전값 업데이트

  return <primitive object={scene} />;
}

function RobotStatusPage() {
  const [robotData, setRobotData] = useState({
    robot_arm_joint: [180, 20, 180, 20, 180, 20, 180], // 초기값 설정 (홀수 인덱스는 180, 짝수 인덱스는 20)
  });

  // 임의의 값으로 robotData 업데이트 (홀수는 180, 짝수는 20)
  useEffect(() => {
    const interval = setInterval(() => {
      setRobotData({
        robot_arm_joint: [
          180,  // base
          20,   // shoulder
          180,  // upper arm
          20,   // elbow
          180,  // forearm
          20,   // wrist
          180,  // gripper
        ]
      });
    }, 1000);

    return () => clearInterval(interval); // 1초마다 업데이트
  }, []);

  return (
    <div className="robot-status-container">
      <h1>Robot Status</h1>
      <div>
        <div>Robot Arm Joint: {robotData.robot_arm_joint.join(', ')}</div>
      </div>

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
