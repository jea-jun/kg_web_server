import React, { useEffect, useState } from 'react';
import axios from 'axios';

function LibraryPage() {
  const [robotData, setRobotData] = useState([]);

  useEffect(() => {
    // 로봇 상태 데이터를 서버로부터 가져오기
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
    <div>
      <h1>Robot Status Data</h1>
      {robotData.length > 0 ? (
        <ul>
          {robotData.map((data, index) => (
            <li key={index}>
              <div>Date: {data.date || 'N/A'}</div>
              <div>Time: {data.time || 'N/A'}</div>
              <div>AGV: {data.agv || 'N/A'}</div>
              <div>Robot Arm: {data.robot_arm ? data.robot_arm.join(', ') : 'N/A'}</div>
              <div>Other Data: {JSON.stringify(data.otherData) || 'N/A'}</div>
              <hr />
            </li>
          ))}
        </ul>
      ) : (
        <p>No robot data available.</p>
      )}
    </div>
  );
}

export default LibraryPage;
