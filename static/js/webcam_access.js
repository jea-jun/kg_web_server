document.getElementsByTagName("h1")[0].style.fontSize = "6vw";navigator.mediaDevices.getUserMedia({ video: true })
  .then((stream) => {
    const video = document.getElementById('videoElement');
    video.srcObject = stream;  // 웹캠 스트림을 비디오 태그에 연결
  })
  .catch((error) => {
    console.error("Error accessing webcam:", error);
    alert("Webcam access is required to view the stream.");
  });
