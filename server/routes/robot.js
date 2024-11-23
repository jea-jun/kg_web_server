const express = require("express");
const router = express.Router();

router.post('/', (req, res) => {
    const { date, time } = req.body;
    if (date && time) {
        res.status(200).json({ success: true, message: 'DateTime received successfully.' });
    } else {
        res.status(400).json({ success: false, message: 'Date or time missing.' });
    }
});


module.exports = router; // 라우터만 내보내기