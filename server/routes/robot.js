const express = require("express");
const router = express.Router();

let receivedData = []; // 데이터를 저장하는 임시 메모리 저장소

router.post('/', (req, res) => {
    const { date, time, agv, robot_arm } = req.body;

    // 날짜 검증 (유효하면 저장)
    let validatedDate = null;
    if (date) {
        validatedDate = date; // 추가적인 날짜 유효성 검사가 필요하면 이곳에서 처리 가능
    }

    // 시간 검증 (유효하면 저장)
    let validatedTime = null;
    if (time) {
        validatedTime = time; // 추가적인 시간 유효성 검사가 필요하면 이곳에서 처리 가능
    }

    // AGV 데이터 검증 (문자열일 경우만 저장)
    let validatedAgv = null;
    if (agv) {
        if (typeof agv === 'string') {
            validatedAgv = agv;
        } else {
            return res.status(400).json({ success: false, message: 'Invalid AGV data. Must be a string.' });
        }
    }

    // 로봇 암 데이터 검증 (7개의 숫자 배열일 경우만 저장)
    let validatedRobotArm = null;
    if (robot_arm) {
        if (Array.isArray(robot_arm) && robot_arm.length === 7 && robot_arm.every(angle => typeof angle === 'number')) {
            validatedRobotArm = robot_arm;
        } else {
            return res.status(400).json({
                success: false,
                message: 'Invalid robot_arm data. Must be an array of 7 numbers.'
            });
        }
    }

    // 유효한 데이터만 저장
    const newData = {
        ...(validatedDate && { date: validatedDate }), // 날짜가 있으면 포함
        ...(validatedTime && { time: validatedTime }), // 시간이 있으면 포함
        ...(validatedAgv && { agv: validatedAgv }),    // agv가 있으면 포함
        ...(validatedRobotArm && { robot_arm: validatedRobotArm }) // robot_arm이 있으면 포함
    };
    receivedData.push(newData);

    // 성공 응답
    res.status(200).json({
        success: true,
        message: 'Data received and stored successfully.',
        data: newData
    });
});

// GET 엔드포인트: 저장된 데이터를 확인
router.get('/data', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Retrieved stored data successfully.',
        data: receivedData
    });
});

module.exports = router;
