// const express = require("express");
// const router = express.Router();
// const axios = require("axios");
// const config = require("../config/key"); // 키 파일에서 API 키 가져오기

// // 책 검색 엔드포인트
// router.get("/getBooks", async (req, res) => {
//     const { title, page_no = 1, page_size = 10 } = req.query; // 클라이언트 요청 쿼리 파라미터

//     try {
//         // 국회도서관 API 호출
//         const response = await axios.get("https://api.nl.go.kr/some-endpoint", {
//             params: {
//                 key: config.libraryApiKey, // API 키
//                 title: title,              // 검색할 책 제목
//                 page_no: page_no,          // 페이지 번호
//                 page_size: page_size,       // 한 페이지당 결과 개수
//                 skip: Skip,                   //건너뛸 개수
//                 limit: Limit,                 //한 번에 가져올 상품 개수 
//                 loadMore: true,                //더 많은 데이터를 불러올지 여부
//                 filters: Filters,              //서버에서 데이터를 필터링하기 위해 사용되는
//                 searchTerm: SearchTerms        //사용자가 입력한 검색어를 서버에 전달하여 검색 결과
//             }
//         });

//         // 국회도서관 API 응답 데이터를 클라이언트에 전달
//         res.status(200).json(response.data);
//     } catch (error) {
//         console.error("API 호출 실패:", error.message);
//         res.status(500).json({ success: false, message: "Failed to fetch data from National Library API" });
//     }
// });

// module.exports = router;
