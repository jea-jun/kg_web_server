const express = require("express");
const router = express.Router();
const axios = require("axios");
const config = require("../config/key"); // 키 파일에서 API 키 가져오기

// 미들웨어를 사용하여 요청 로깅
router.use((req, res, next) => {
    console.log("Incoming Request:");
    console.log("Method:", req.method); // 요청 메서드 (GET, POST 등)
    console.log("URL:", req.originalUrl); // 요청 URL
    console.log("Query Parameters:", req.query); // 요청 쿼리 파라미터
    console.log("Body:", req.body); // 요청 바디 (POST 요청 시 유용)
    next(); // 다음 핸들러로 전달
});

// 책 검색 엔드포인트
router.get("/getBooks", async (req, res) => {
    const { search, pageno = 1, displaylines = 10 } = req.query; // 클라이언트 요청 쿼리 파라미터

    try {
        // 국회도서관 API 호출
        const response = await axios.get("http://apis.data.go.kr/9700000/searchservice/basic", {
            params: {
                serviceKey: config.libraryApiKey, // API 키
                search: search,                  // 검색어
                pageno: pageno,                  // 페이지 번호 (기본값 1)
                displaylines: displaylines       // 한 페이지당 결과 개수 (기본값 10)
            }
        });

        // API 호출 성공 시 응답 데이터 처리
        if (response.data.resultCode === "00") {
            console.log("API Call Success:", response.data); // API 성공 응답 로깅
            res.status(200).json({
                success: true,
                total: response.data.total,       // 총 검색 결과 수
                items: response.data.record.item // 검색된 항목 목록
            });
        } else {
            console.log("API Call Error:", response.data.resultMsg); // API 오류 응답 로깅
            res.status(400).json({
                success: false,
                message: `API Error: ${response.data.resultMsg}`
            });
        }
    } catch (error) {
        console.error("API 호출 실패:", error.message); // API 호출 실패 로깅
        res.status(500).json({
            success: false,
            message: "Failed to fetch data from National Library API"
        });
    }
});

module.exports = router;
