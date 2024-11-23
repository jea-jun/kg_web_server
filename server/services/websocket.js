const WebSocket = require("ws");
const robotManager = require("./robotManager"); // 로봇 연결 관리 모듈 가져오기

function setupWebSocket(server) {
    const wss = new WebSocket.Server({ server }); // HTTP 서버와 통합된 WebSocket 서버 생성

    wss.on("connection", (ws, req) => {
        const robotId = req.url?.split("/")?.[2]; // 예: ws://localhost:5000/api/robot/robot123
        if (!robotId) {
            console.log("Connection rejected: robotId is missing.");
            ws.close(1008, "Robot ID is required.");
            return;
        }

        // 로봇 연결 등록
        robotManager.addConnection(robotId, ws);
        console.log(`[Connected] Robot ${robotId} connected.`);

        // 메시지 수신 처리
        ws.on("message", (message) => {
            console.log(`[Message] From Robot ${robotId}:`, message);
        });

        // 연결 종료 처리
        ws.on("close", () => {
            robotManager.removeConnection(robotId);
            console.log(`[Disconnected] Robot ${robotId} disconnected.`);
        });

        ws.on("error", (err) => {
            console.error(`[Error] Robot ${robotId}:`, err.message);
        });
    });

    console.log("WebSocket server is ready.");
}

module.exports = setupWebSocket; // WebSocket 설정 함수 내보내기
