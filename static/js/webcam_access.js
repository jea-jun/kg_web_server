const video = document.getElementById('videoElement');
const canvas = document.getElementById('overlay');
const context = canvas.getContext('2d');

// 웹캠 스트림 가져오기
navigator.mediaDevices.getUserMedia({ video: true })
    .then((stream) => {
        video.srcObject = stream;
        video.onloadedmetadata = () => {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            captureFrame();
        };
    })
    .catch((err) => {
        console.error("Error accessing webcam: ", err);
    });

// 프레임 캡처 및 서버로 전송
function captureFrame() {
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageData = canvas.toDataURL('image/jpeg');
    fetch('/detect', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ image: imageData })
    })
    .then(response => response.json())
    .then(data => {
        drawBoxes(data.objects);
        requestAnimationFrame(captureFrame);
    })
    .catch(err => console.error(err));
}

// 인식된 객체들의 경계 상자 그리기
function drawBoxes(objects) {
    objects.forEach(obj => {
        context.strokeStyle = 'red';
        context.lineWidth = 2;
        context.strokeRect(obj.x, obj.y, obj.width, obj.height);
        context.fillStyle = 'red';
        context.fillText(obj.label, obj.x, obj.y - 10);
    });
}
