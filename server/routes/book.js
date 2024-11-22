const express = require("express");
const router = express.Router();
const axios = require("axios");
const { libraryApiKey } = require("../config/key");

// API 요청 라우트
router.get('/getBooks', async (req, res) => {
  const url = "http://apis.data.go.kr/9720000/searchservice/basic"; // API URL
  
  // 클라이언트에서 전달된 쿼리 파라미터 추출
  const { pageno, displaylines, search } = req.query;

  // 요청 파라미터 객체 생성
  const params = {
    serviceKey: libraryApiKey, // URL 인코딩된 인증키
  };

  // 클라이언트 요청에 따라 동적으로 추가
  if (pageno) params.pageno = pageno;          // 페이지 번호
  if (displaylines) params.displaylines = displaylines; // 페이지당 항목 수
  if (search) params.search = search;          // 검색어

  try {
    // GET 요청 전송
    const response = await axios.get(url, { params });
    console.log(params);

    // 요청 성공: 결과 반환
    res.status(200).json({
      success: true,
      status: response.status,
      data: response.data,
    });
  } catch (error) {
    // 요청 실패: 오류 반환
    res.status(error.response ? error.response.status : 500).json({
      success: false,
      error: error.response ? error.response.data : "Internal Server Error",
    });
  }
});

module.exports = router;