const express = require("express");
const app = express();
const path = require("path");
const cors = require('cors');
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const http = require("http");
const mongoose = require("mongoose");
const setupWebSocket = require("./services/websocket"); 

// MongoDB 연결 설정
const config = require("./config/key");
mongoose.connect(config.mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err));

// Middleware 설정
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

// REST API 라우터 설정
app.use('/api/users', require('./routes/users'));
app.use('/api/product', require('./routes/product'));
app.use('/api/book', require('./routes/book'));
app.use('/api/robot', require('./routes/robot'));

// 이미지 파일 정적 제공
app.use('/uploads', express.static('uploads'));

// 배포 환경에서 정적 파일 제공
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../client", "build", "index.html"));
  });
}

// HTTP 서버 생성 및 WebSocket 설정
const server = http.createServer(app);
setupWebSocket(server); // WebSocket 설정을 위한 함수 호출

const port = process.env.PORT || 5000;

server.listen(port, () => {
  console.log(`Server Running at ${port}`);
});
