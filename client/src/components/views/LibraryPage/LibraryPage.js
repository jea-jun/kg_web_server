import React, { useEffect, useState, useRef, Suspense } from 'react';
import axios from 'axios';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';

function RobotModel({ robotData }) {
  const { scene } = useGLTF('/untitled.glb');

  const axisRefs = {
    axis1: useRef(),
    axis2: useRef(),
    axis3: useRef(),
    axis4: useRef(),
    axis5: useRef(),
    axis6: useRef(),
    axis7: useRef(),
  };

  useFrame(() => {
    if (robotData && robotData.robot_arm_joint) {
      // 로봇 암 관절 데이터를 적용
      const joints = robotData.robot_arm_joint; // 예: [0, 0.5, -1.2, 0.3, 0.8, -0.5, 1.0]
      axisRefs.axis1.current.rotation.y = joints[0] || 0;
      axisRefs.axis2.current.rotation.z = joints[1] || 0;
      axisRefs.axis3.current.rotation.x = joints[2] || 0;
      axisRefs.axis4.current.rotation.y = joints[3] || 0;
      axisRefs.axis5.current.rotation.z = joints[4] || 0;
      axisRefs.axis6.current.rotation.x = joints[5] || 0;
      axisRefs.axis7.current.rotation.z = joints[6] || 0; // 7번째 축 추가
    }
  });

  return (
    <group>
      <group ref={axisRefs.axis1}>
        <group ref={axisRefs.axis2}>
          <group ref={axisRefs.axis3}>
            <group ref={axisRefs.axis4}>
              <group ref={axisRefs.axis5}>
                <group ref={axisRefs.axis6}>
                  <group ref={axisRefs.axis7}>
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
  const [robotData, setRobotData] = useState(null);  // 객체로 초기화
  const [agvData, setAgvData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/robot/data');
        if (response.data.success) {
          console.log("Fetched Data:", response.data.data);
          setRobotData(response.data.data);  // 데이터를 객체로 설정
          setAgvData(response.data.data.agv || {});
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
            <hr />
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
          <Suspense fallback={<div>Loading 3D model...</div>}>
            {/* RobotModel에 로봇 데이터를 전달 */}
            <RobotModel robotData={robotData} />
          </Suspense>
          <OrbitControls />
        </Canvas>
      </div>
    </div>
  );
}

export default RobotStatusPage;