const express = require("express");
const router = express.Router();
const axios = require("axios");
const cors = require("cors");
const config = require("../config/key");
const { auth } = require("../middleware/auth");

const API_BASE_URL = "http://apis.data.go.kr/9700000/searchservice/basic";

// CORS 설정
router.use(cors());

// 요청 로깅
router.use((req, res, next) => {
    console.log("Incoming Request:");
    console.log("Method:", req.method);
    console.log("URL:", req.originalUrl);
    console.log("Query Parameters:", req.query);
    console.log("Body:", req.body);
    console.log("Authenticated User:", req.user || "Not authenticated");
    next();
});

// 책 검색 엔드포인트
router.get("/getBooks", auth, async (req, res) => {
    const { search, pageno = 1, displaylines = 10 } = req.query;

    if (!config.libraryApiKey) {
        console.error("Error: Missing API Key in config.");
        return res.status(500).json({
            success: false,
            message: "Server configuration error: Missing API Key."
        });
    }

    try {
        const params = {
            serviceKey: config.libraryApiKey,
            search: search,
            pageno: pageno,
            displaylines: displaylines
        };

        const response = await axios.get(API_BASE_URL, { params });

        if (response.data.resultCode === "00" && Array.isArray(response.data.record?.item)) {
            res.status(200).json({
                success: true,
                total: response.data.total || 0,
                items: response.data.record.item
            });
        } else {
            res.status(400).json({
                success: false,
                message: `API Error: ${response.data.resultMsg || "Unexpected response format"}`
            });
        }
    } catch (error) {
        console.error("API 호출 실패:", error.message);
        res.status(500).json({
            success: false,
            message: "Failed to fetch data from National Library API"
        });
    }
});

module.exports = router;
