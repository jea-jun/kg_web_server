from flask import Flask, render_template, url_for, redirect

app = Flask(__name__)

global push_btn
push_btn = False  # 카메라 On/Off 상태를 저장하는 전역변수

# 메인 페이지 라우팅
@app.route('/')
def index():
    global push_btn
    return render_template('webcam_control.html', push_btn=push_btn)

# 버튼을 눌렀을 때 카메라 On/Off 상태 변경
@app.route('/push_switch')
def push_switch():
    global push_btn
    push_btn = not push_btn  # 상태를 토글
    return redirect(url_for('index'))

# 서버 실행
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8080, debug=True)
