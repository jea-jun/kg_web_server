import React, { useState } from 'react';

const handleCardClick = (index, setSelectedCard, setIsTimePickerVisible) => {
    setSelectedCard(index);
    setIsTimePickerVisible(true); // 시간 선택 창을 보이도록 설정
};

const handleDateChange = (e, selectedDateTime, setSelectedDateTime) => {
    setSelectedDateTime({ ...selectedDateTime, date: e.target.value });
};

const handleTimeChange = (e, selectedDateTime, setSelectedDateTime) => {
    setSelectedDateTime({ ...selectedDateTime, time: e.target.value });
};

const handleReservation = (selectedDateTime, setIsTimePickerVisible) => {
    alert(`Reservation confirmed for ${selectedDateTime.date} at ${selectedDateTime.time}`);
    setIsTimePickerVisible(false);
    setSelectedDateTime({ date: '', time: '' }); // 선택된 날짜와 시간을 초기화
};

// 외부 클릭 감지 핸들러
const handleOutsideClick = (e) => {
    if (!e.target.closest('.card')) {
        setSelectedCard(null); // 외부를 클릭하면 선택 해제
    }
};
    
export {
    handleCardClick,
    handleDateChange,
    handleTimeChange,
    handleReservation,
    handleOutsideClick
};