import websocket
import json

# WebSocket 서버 URL (로봇 ID는 robot123로 가정)
WEBSOCKET_URL = "ws://https://kgwebserver-14978e851dae.herokuapp.com/api/robot/robot123"

# 서버로부터 메시지를 수신할 때 호출되는 함수
def on_message(ws, message):
    try:
        # 수신한 메시지 파싱
        command = json.loads(message)

        # 명령의 유형에 따라 작업 수행
        if command.get("type") == "COMMAND":
            action = command.get("action")
            payload = command.get("payload")

            if action == "MOVE_FORWARD":
                speed = payload.get("speed")
                duration = payload.get("duration")
                print(f"Moving forward with speed {speed} for {duration} seconds.")
                # 실제 로봇 이동 제어 코드 추가

            elif action == "MOVE_ARM":
                joint = payload.get("joint")
                angle = payload.get("angle")
                print(f"Moving joint {joint} to {angle} degrees.")
                # 실제 로봇 관절 제어 코드 추가

            else:
                print(f"Unknown command action: {action}")

        else:
            print("Unknown message type:", command.get("type"))

    except json.JSONDecodeError as e:
        print(f"Failed to parse command: {e}")

# 연결이 성공했을 때 호출되는 함수
def on_open(ws):
    print("Connected to WebSocket server.")

# 연결이 닫혔을 때 호출되는 함수
def on_close(ws, close_status_code, close_msg):
    print("WebSocket connection closed.")

# 오류가 발생했을 때 호출되는 함수
def on_error(ws, error):
    print(f"WebSocket error: {error}")

# WebSocket 클라이언트 설정
websocket.enableTrace(True)
ws = websocket.WebSocketApp(WEBSOCKET_URL,
                            on_open=on_open,
                            on_message=on_message,
                            on_close=on_close,
                            on_error=on_error)

# WebSocket 클라이언트 실행
ws.run_forever()
