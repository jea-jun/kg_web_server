import React, { useEffect, useState } from 'react';
import axios from 'axios';

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
    </div>
  );
}

export default RobotStatusPage;