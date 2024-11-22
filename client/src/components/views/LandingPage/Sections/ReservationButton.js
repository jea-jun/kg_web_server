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
    
export {
    handleCardClick,
    handleDateChange,
    handleTimeChange,
};