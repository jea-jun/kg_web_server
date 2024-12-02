const express = require("express");
const router = express.Router();

let receivedData = {};  // 데이터를 제어번호별로 저장하기 위해 객체 사용

// 날짜와 시간 및 예약 상태 저장
router.post('/datetime', (req, res) => {
    const { date, time, reservationInfo } = req.body;

    // reservationInfo에서 controlNumber와 isReserved를 받음
    const { controlNumber, isReserved } = reservationInfo || {};

    // 유효성 검사
    if (!date || !time || !controlNumber) {
        return res.status(400).json({ success: false, message: '날짜, 시간, 제어번호는 필수 항목입니다.' });
    }

    // isReserved가 없으면 기본값으로 false 설정
    const reservationStatus = typeof isReserved === 'boolean' ? isReserved : false;

    // 제어번호에 해당하는 데이터가 이미 존재하는지 확인
    if (receivedData[controlNumber] && receivedData[controlNumber].reservationInfo.isReserved) {
        return res.status(400).json({ success: false, message: '이 제어번호는 이미 예약되었습니다.' });
    }

    // 제어번호에 해당하는 데이터를 저장 (제어번호를 키로 사용)
    receivedData[controlNumber] = {
        reservationInfo: {
            controlNumber,
            isReserved: reservationStatus
        },
        date,
        time
    };

    res.status(200).json({
        success: true,
        message: 'Date, time, and control number with reservation status received and stored successfully.',
        data: receivedData[controlNumber]
    });
});

// 로봇 제어 데이터 저장
router.post('/robot-control', (req, res) => {
    const { agv, robot_arm, ...otherData } = req.body;

    // AGV 및 로봇 팔 유효성 검사
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

    // 새로운 로봇 제어 데이터
    const newData = {
        ...(validatedAgv && { agv: validatedAgv }),
        ...(validatedRobotArm && { robot_arm: validatedRobotArm }), 
        ...otherData 
    };

    // 데이터 저장
    receivedData = { ...receivedData, ...newData }; 

    res.status(200).json({
        success: true,
        message: 'Robot control data received and stored successfully.',
        data: newData
    });
});

// 로봇 상태 저장
router.post('/robot-status', (req, res) => {
    const { agv, robot_arm, ...otherData } = req.body;

    // AGV 및 로봇 팔 유효성 검사
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

    // 새로운 로봇 상태 데이터
    const newData = {
        ...(validatedAgv && { agv: validatedAgv }),  
        ...(validatedRobotArm && { robot_arm: validatedRobotArm }), 
        ...otherData 
    };

    // 데이터 저장
    receivedData = { ...receivedData, ...newData }; 

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
            data: reservationData.reservationInfo
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
