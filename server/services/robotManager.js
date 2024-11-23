// 로봇 연결 관리 모듈
const robotConnections = {};

// 로봇 연결 등록
function addConnection(robotId, ws) {
    if (robotConnections[robotId]) {
        console.log(`[Info] Closing existing connection for Robot ${robotId}`);
        robotConnections[robotId].close();
    }
    robotConnections[robotId] = ws;
}

// 로봇 연결 제거
function removeConnection(robotId) {
    if (robotConnections[robotId]) {
        delete robotConnections[robotId];
    }
}

// 특정 로봇에 명령 전송
function sendToRobot(robotId, command) {
    const ws = robotConnections[robotId];
    if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(command);
        console.log(`[Command Sent] To Robot ${robotId}:`, command);
    } else {
        console.error(`[Error] Robot ${robotId} is not connected.`);
    }
}

module.exports = {
    addConnection,
    removeConnection,
    sendToRobot,
};
