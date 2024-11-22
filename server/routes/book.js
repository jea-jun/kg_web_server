const express = require("express");
const router = express.Router();
const axios = require("axios");
const config = require("../config/key"); // 키 파일에서 API 키 가져오기

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
            res.status(200).json({
                success: true,
                total: response.data.total,       // 총 검색 결과 수
                items: response.data.record.item // 검색된 항목 목록
            });
        } else {
            // API에서 오류 반환 시 처리
            res.status(400).json({
                success: false,
                message: `API Error: ${response.data.resultMsg}`
            });
        }
    } catch (error) {
        // API 호출 실패 시 처리
        console.error("API 호출 실패:", error.message);
        res.status(500).json({
            success: false,
            message: "Failed to fetch data from National Library API"
        });
    }
});

module.exports = router;

// skip: Skip,                   //건너뛸 개수
// limit: Limit,                 //한 번에 가져올 상품 개수 
// loadMore: true,                //더 많은 데이터를 불러올지 여부
// filters: Filters,              //서버에서 데이터를 필터링하기 위해 사용되는
// searchTerm: SearchTerms        //사용자가 입력한 검색어를 서버에 전달하여 검색 결과