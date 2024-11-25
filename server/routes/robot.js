const express = require("express");
const router = express.Router();

router.post('/', (req, res) => {
    const { date, time, agv, robot_arm } = req.body;

    // 날짜와 시간 검증
    if (!date || !time) {
        return res.status(400).json({ success: false, message: 'Date or time missing.' });
    }

    // AGV 데이터 검증 (문자열이어야 함)
    if (agv && typeof agv !== 'string') {
        return res.status(400).json({ success: false, message: 'Invalid AGV data. Must be a string.' });
    }

    // 로봇 암 데이터 검증 (7개의 숫자 배열이어야 함)
    if (robot_arm) {
        if (!Array.isArray(robot_arm) || robot_arm.length !== 7 || !robot_arm.every(angle => typeof angle === 'number')) {
            return res.status(400).json({
                success: false,
                message: 'Invalid robot_arm data. Must be an array of 7 numbers.'
            });
        }
    }

    // 성공 응답
    res.status(200).json({
        success: true,
        message: 'Data received successfully.',
        data: { date, time, agv, robot_arm }
    });
});

module.exports = router;