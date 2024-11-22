const express = require("express");
const router = express.Router();
const axios = require("axios");
const config = require("../config/key");

const API_BASE_URL = "http://apis.data.go.kr/9700000/searchservice/basic";

// 책 검색 엔드포인트
router.get("/getBooks", async (req, res) => {
    const { search = "", pageno = 1, displaylines = 10 } = req.query;

    console.log(`[LOG] API Request - search: ${search}, pageno: ${pageno}, displaylines: ${displaylines}`);

    // API 키 확인
    if (!config.libraryApiKey) {
        console.error("[ERROR] Missing API Key in config.");
        return res.status(500).json({
            success: false,
            message: "Server configuration error: Missing API Key."
        });
    }

    try {
        // API 요청
        const params = {
            serviceKey: config.libraryApiKey,
            search: search,
            pageno: pageno,
            displaylines: displaylines
        };
        const response = await axios.get(API_BASE_URL, { params });

        // API 응답 로그
        console.log("[LOG] API Response Received:", response.data);

        // 성공적인 응답 처리
        if (response.data.resultCode === "00" && Array.isArray(response.data.record?.item)) {
            return res.status(200).json({
                success: true,
                total: response.data.total || 0,
                items: response.data.record.item
            });
        } else {
            return res.status(400).json({
                success: false,
                message: `API Error: ${response.data.resultMsg || "Unexpected response format"}`
            });
        }
    } catch (error) {
        console.error("[ERROR] API Request Failed:", error.message);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch data from National Library API"
        });
    }
});

module.exports = router;
