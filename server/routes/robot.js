const express = require("express");
const router = express.Router();

// REST API 예시 라우트
router.get("/status", (req, res) => {
    res.json({ success: true, message: "Robot API is working!" });
});

module.exports = router; // 라우터만 내보내기