import React, { useEffect, useState, useRef, Suspense } from 'react';
import axios from 'axios';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';

function RobotModel({ robotData, position }) {
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

  useEffect(() => {
    if (robotData && robotData.robot_arm_joint) {
      const joints = robotData.robot_arm_joint;
      if (axisRefs.base.current) axisRefs.base.current.rotation.y = joints[0] || 0;
      if (axisRefs.shoulder.current) axisRefs.shoulder.current.rotation.x = joints[1] || 0;
      if (axisRefs.upperArm.current) axisRefs.upperArm.current.rotation.x = joints[2] || 0;
      if (axisRefs.elbow.current) axisRefs.elbow.current.rotation.x = joints[3] || 0;
      if (axisRefs.forearm.current) axisRefs.forearm.current.rotation.x = joints[4] || 0;
      if (axisRefs.wrist.current) axisRefs.wrist.current.rotation.x = joints[5] || 0;
      if (axisRefs.gripper.current) axisRefs.gripper.current.rotation.x = joints[6] || 0;
    }
  }, [robotData]);

  return <primitive object={scene} position={position} />;
}

function RobotStatusPage() {
  const [robotData, setRobotData] = useState({});
  const [agvData, setAgvData] = useState({});
  const [forceRender, setForceRender] = useState(false);
  const [position, setPosition] = useState([0, 0, 0]);
  
  // Form data for robot arm joint and AGV
  const [agv, setAgv] = useState('');
  const [robotArm, setRobotArm] = useState(Array(7).fill(0));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/robot/data');
        if (response.data.success) {
          setRobotData(response.data.data);
          setAgvData(response.data.data.agv || {});
          if (response.data.data.agv && response.data.data.agv.agv_position) {
            setPosition(response.data.data.agv.agv_position);
          }
        } else {
          console.error('Failed to fetch robot/AGV data');
        }
      } catch (error) {
        console.error('Error fetching robot/AGV data:', error);
      }
    };

    const interval = setInterval(() => {
      fetchData();
      setForceRender(prev => !prev);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('/api/robot/robot-control', {
        agv,
        robot_arm: robotArm,
      });
      if (response.data.success) {
        console.log('Data sent successfully:', response.data);
      } else {
        console.error('Failed to send data:', response.data.message);
      }
    } catch (error) {
      console.error('Error sending data:', error);
    }
  };

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

      <div className="input-container">
        <h2>Control Robot Arm and AGV</h2>
        <form onSubmit={handleFormSubmit}>
          <div>
            <label>AGV ID: </label>
            <input
              type="text"
              value={agv}
              onChange={(e) => setAgv(e.target.value)}
              placeholder="Enter AGV ID"
            />
          </div>
          <div>
            <label>Robot Arm Joint Angles:</label>
            {robotArm.map((angle, index) => (
              <div key={index}>
                <label>{`Joint ${index + 1}: `}</label>
                <input
                  type="number"
                  value={angle}
                  onChange={(e) => {
                    const newRobotArm = [...robotArm];
                    newRobotArm[index] = parseFloat(e.target.value);
                    setRobotArm(newRobotArm);
                  }}
                />
              </div>
            ))}
          </div>
          <button type="submit">Send Data</button>
        </form>
      </div>

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

      <div className="blender-model-container">
        <h1>3D Robot Model</h1>
        <Canvas camera={{ position: [0, 6, 10], fov: 50 }}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1.0} />
          <Suspense fallback={null}>
            <RobotModel robotData={robotData} position={position} />
          </Suspense>
          <OrbitControls />
        </Canvas>
      </div>
    </div>
  );
}

export default RobotStatusPage;
