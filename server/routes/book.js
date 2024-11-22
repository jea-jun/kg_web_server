const express = require("express");
const router = express.Router();
const axios = require("axios");
const config = require("../config/key");


// API 요청 라우트
router.get('/getBooks', async (req, res) => {
  const url = "http://apis.data.go.kr/9720000/searchservice/basic"; // API URL
  const params = {
    serviceKey: config.libraryApiKey, // URL 인코딩된 인증키
    pageno: req.query.pageno || 1,              // 페이지 번호 (기본값: 1)
    displaylines: req.query.displaylines || 10, // 페이지당 항목 수 (기본값: 10)
    search: req.query.search || "자료명,미래의 설계" // 검색어 (기본값: "미래의 설계")
  };

  try {
    // GET 요청 전송
    const response = await axios.get(url, { params });

    // 요청 성공: 결과 반환
    res.status(200).json({
      status: response.status,
      data: response.data,
    });
  } catch (error) {
    // 요청 실패: 오류 반환
    res.status(error.response ? error.response.status : 500).json({
      error: error.response ? error.response.data : "Internal Server Error",
    });
  }
});

module.exports = router;
