import React, { useEffect, useState, Suspense } from 'react';
import axios from 'axios';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';

function RobotModel({ robotData }) {
  // GLB 파일 로드
  const { scene, animations } = useGLTF('/untitled.glb'); // GLB 파일 경로

  // 애니메이션이 있는지 확인하고, 애니메이션을 실행하는 처리
  const mixerRef = React.useRef(null);
  
  useEffect(() => {
    if (animations && animations.length) {
      // 애니메이션을 시작하려면 mixer가 필요합니다.
      mixerRef.current = new THREE.AnimationMixer(scene);
      animations.forEach((clip) => {
        mixerRef.current.clipAction(clip).play();
      });
    }
  }, [animations, scene]);

  // 프레임마다 애니메이션을 업데이트
  useFrame((state, delta) => {
    if (mixerRef.current) {
      mixerRef.current.update(delta);
    }
  });

  return <primitive object={scene} />;
}

function RobotStatusPage() {
  const [robotData, setRobotData] = useState({});
  const [forceRender, setForceRender] = useState(false); // 렌더링 강제 트리거용 상태

  // API에서 데이터를 주기적으로 가져오기
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