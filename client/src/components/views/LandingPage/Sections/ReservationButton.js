import React, { useState } from 'react';

const handleCardClick = (index, setSelectedCard, setIsTimePickerVisible) => {
    setSelectedCard(index);
    console.log(`Card ${index} clicked`); // 클릭한 카드의 인덱스를 로깅
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
};

export {
    handleCardClick,
    handleDateChange,
    handleTimeChange,
    handleReservation
};
