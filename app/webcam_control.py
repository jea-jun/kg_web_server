from flask import Flask, render_template, Response, url_for, redirect
from PIL import ImageFont, ImageDraw, Image
import datetime
import cv2
import numpy as np

app = Flask(__name__)

# 카메라 초기 설정 (USB 웹캠이 연결된 경우 0 사용)
capture = cv2.VideoCapture(0)
capture.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
capture.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)
font = ImageFont.truetype('app/fonts/SCDream6.otf', 20)  # 폰트 경로 수정
global push_btn
push_btn = False  # 카메라 On/Off 상태를 저장하는 전역변수

# 카메라 스트리밍 프레임 생성 함수
def gen_frames():
    global push_btn
    while True:
        now = datetime.datetime.now()
        nowDatetime = now.strftime('%Y-%m-%d %H:%M:%S')
        success, frame = capture.read()
        
        if not success:  # 카메라에서 프레임을 가져오지 못하면 종료
            break
        else:
            if push_btn:  # 카메라 꺼짐 (검은 화면 표시)
                frame = np.zeros([480, 640, 3], dtype="uint8")
                frame = Image.fromarray(frame)
                draw = ImageDraw.Draw(frame)
                draw.text(xy=(10, 15), text="공대선배 웹캠 " + nowDatetime, font=font, fill=(255, 255, 255))
                draw.text(xy=(320, 240), text="off", font=font, fill=(255, 255, 255))
                frame = np.array(frame)
            else:  # 카메라 켜짐
                frame = Image.fromarray(frame)
                draw = ImageDraw.Draw(frame)
                draw.text(xy=(10, 15), text="공대선배 웹캠 " + nowDatetime, font=font, fill=(255, 255, 255))
                frame = np.array(frame)
                
            # 프레임을 JPEG 형식으로 인코딩하고 반환
            ret, buffer = cv2.imencode('.jpg', frame)
            frame = buffer.tobytes()
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')


# 메인 페이지 라우팅
@app.route('/')
def index():
    global push_btn
    return render_template('index.html', push_btn=push_btn)


# 카메라 영상 스트리밍 라우팅
@app.route('/video_feed')
def video_feed():
    return Response(gen_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')


# 버튼을 눌렀을 때 카메라 On/Off 상태 변경
@app.route('/push_switch')
def push_switch():
    global push_btn
    push_btn = not push_btn  # 상태를 토글
    return redirect(url_for('index'))


# 서버 실행
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8080, debug=True)  # 모든 네트워크 인터페이스에서 접속 가능하도록 설정
