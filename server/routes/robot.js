const express = require("express");
const router = express.Router();

let receivedData = {}; // 배열 대신 객체로 변경

// 날짜와 시간 저장
router.post('/datetime', (req, res) => {
    const { date, time, controlNumber } = req.body;

    let validatedDate = null;
    if (date) {
        validatedDate = date; 
    }

    let validatedTime = null;
    if (time) {
        validatedTime = time; 
    }

    let validatedControlNumber = null;
    if (controlNumber) {
        validatedControlNumber = controlNumber;
    }

    // 제어번호와 예약 상태 추가
    const newData = {
        ...(validatedDate && { date: validatedDate }),
        ...(validatedTime && { time: validatedTime }),
        ...(validatedControlNumber && { controlNumber: validatedControlNumber }),
        isReserved: false // 기본값은 false로 설정
    };

    // 기존의 데이터와 병합
    receivedData = { ...receivedData, ...newData }; 

    res.status(200).json({
        success: true,
        message: 'Date, time, and control number received and stored successfully.',
        data: newData
    }); 
});

// 로봇 제어 데이터 저장
router.post('/robot-control', (req, res) => {
    const { agv, robot_arm, ...otherData } = req.body;

    let validatedAgv = null;
    if (agv) {
        if (typeof agv === 'string') {
            validatedAgv = agv;
        } else {
            return res.status(400).json({ success: false, message: 'Invalid AGV data. Must be a string.' });
        }
    }

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

    const newData = {
        ...(validatedAgv && { agv: validatedAgv }),
        ...(validatedRobotArm && { robot_arm: validatedRobotArm }), 
        ...otherData 
    };
    receivedData = { ...receivedData, ...newData }; // 데이터를 덮어쓰기

    res.status(200).json({
        success: true,
        message: 'Robot control data received and stored successfully.',
        data: newData
    });
});

// 로봇 상태 저장
router.post('/robot-status', (req, res) => {
    const { agv, robot_arm, ...otherData } = req.body;

    let validatedAgv = null;
    if (agv) {
        if (typeof agv === 'string') {
            validatedAgv = agv;
        } else {
            return res.status(400).json({ success: false, message: 'Invalid AGV data. Must be a string.' });
        }
    }

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

    const newData = {
        ...(validatedAgv && { agv: validatedAgv }),  
        ...(validatedRobotArm && { robot_arm: validatedRobotArm }), 
        ...otherData 
    };
    receivedData = { ...receivedData, ...newData }; // 데이터를 덮어쓰기

    res.status(200).json({
        success: true,
        message: 'Robot status received and stored successfully.',
        data: newData
    });
});

// 제어번호와 예약 상태 조회
router.get('/check-reservation', (req, res) => {
    const { controlNumber } = req.query;

    // 제어번호에 해당하는 데이터가 있는지 확인
    const reservationData = receivedData[controlNumber];

    if (reservationData) {
        res.status(200).json({
            success: true,
            message: 'Reservation status retrieved successfully.',
            data: {
                controlNumber,
                isReserved: reservationData.isReserved
            }
        });
    } else {
        res.status(404).json({
            success: false,
            message: 'Control number not found.'
        });
    }
});

// 데이터 조회
router.get('/data', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Retrieved stored data successfully.',
        data: receivedData // 전체 객체로 반환
    });
});

module.exports = router;