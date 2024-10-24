from flask import Flask, render_template, url_for, redirect, session
from flask_cors import CORS
import os

app = Flask(__name__)
app.secret_key = os.getenv('SECRET_KEY', 'your_default_secret_key')  # 환경 변수에서 비밀키 가져오기
CORS(app)  # CORS 설정 추가

# 메인 페이지 라우팅
@app.route('/')
def index():
    if 'push_btn' not in session:
        session['push_btn'] = False  # 세션에서 카메라 상태가 없으면 초기화
    return render_template('webcam_control.html', push_btn=session['push_btn'])

# 버튼을 눌렀을 때 카메라 On/Off 상태 변경
@app.route('/push_switch')
def push_switch():
    session['push_btn'] = not session['push_btn']  # 세션에서 상태를 토글
    return redirect(url_for('index'))

# 서버 실행
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8080, debug=True)
