import requests
import json
import time

BASE_URL = "https://kgwebserver-14978e851dae.herokuapp.com/api/robot"

robot_status = {
    "date": time.strftime("%Y-%m-%d"),  # 현재 날짜
    "time": time.strftime("%H:%M:%S"),  # 현재 시간
    "agv": "AGV_ID_001",  # AGV 이름 또는 ID
    "robot_arm_joint": [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],  # 관절 상태
    "otherData": {
        "speed": 1.5,  # 기타 데이터 예시: 속도
        "temperature": 30  # 기타 데이터 예시: 온도
    }
}

received_data = {}  # 데이터를 객체 형태로 저장

def send_robot_status():
    try:
        response = requests.post(f"{BASE_URL}/robot-status", json=robot_status)
        if response.status_code == 200:
            print("Sent Robot Status:", response.json())
        else:
            print(f"Failed to send status. HTTP {response.status_code}: {response.text}")
    except requests.RequestException as e:
        print(f"Error sending status: {e}")

def fetch_data():
    global received_data
    try:
        response = requests.get(f"{BASE_URL}/data")
        if response.status_code == 200:
            try:
                # 응답이 JSON인지 확인하고 파싱
                data = response.json()
                
                # 응답이 문자열이 아니라 딕셔너리인지 확인
                if isinstance(data, dict) and data.get("success"):
                    # 데이터를 키-값 형태로 저장하여 인덱스를 사용하지 않음
                    received_data = {
                        f"{item.get('date', f'data_{idx}')} {item.get('time', f'time_{idx}')}": item
                        for idx, item in enumerate(data.get("data", []))
                        if isinstance(item, dict)  # 각 항목이 딕셔너리인지 확인
                    }
                    print("Updated Received Data:")
                    for key, item in received_data.items():
                        print(f"  {key}: {json.dumps(item, indent=2)}")
                else:
                    print("Failed to fetch data: JSON format error or 'success' key missing.")
            except json.JSONDecodeError:
                print("Error: Received response is not valid JSON")
        else:
            print(f"Failed to fetch data. HTTP {response.status_code}: {response.text}")
    except requests.RequestException as e:
        print(f"Error fetching data: {e}")

# 주기적으로 상태 전송 및 데이터 가져오기
def main_loop():
    while True:
        send_robot_status() 
        fetch_data()
        time.sleep(5) 

if __name__ == "__main__":
    print("Starting REST API client...")
    main_loop()
