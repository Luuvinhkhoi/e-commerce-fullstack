import React, { useEffect, useState } from 'react';
import clevr from '../../../util/clevr';
import './countdown.css'
const FlashSaleCountdown = () => {
  const [timeLeft, setTimeLeft] = useState({});
  const [endTime, setEndTime] = useState(null); // Thời gian kết thúc flash sale từ backend
  console.log(timeLeft)
  console.log(endTime)
  // Hàm gọi API để lấy endTime từ backend

  // Hàm tính thời gian còn lại
  const calculateTimeLeft = (endTime) => {
    const difference = endTime - new Date();
    return {
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / (1000 * 60)) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  };
  async function getEndTime(){
    try {
      const data = await clevr.getEndtime();
      setEndTime(new Date(data.endTime)); // Lưu endTime vào state
    } catch (error) {
      console.error('Error fetching end time:', error.message);
    }
  }
  useEffect(() => {
    getEndTime(); // Gọi API khi component được mount
  }, []);

  useEffect(() => {
    if (!endTime) return; // Chờ lấy endTime xong mới chạy

    const timer = setInterval(() => {
      const remainingTime = calculateTimeLeft(endTime);
      setTimeLeft(remainingTime);

      // Nếu thời gian kết thúc, gọi lại API để reset bộ đếm
      if (
        remainingTime.hours === 0 &&
        remainingTime.minutes === 0 &&
        remainingTime.seconds === 0
      ) {
        clearInterval(timer);
        getEndTime(); // Reset bằng cách gọi API lấy endTime mới
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [endTime]);

  return (
    <div className='countdown-timer'>
      {endTime ? (
        <div>
          <span>{String(timeLeft.hours).padStart(2, '0')}</span> :
          <span>{String(timeLeft.minutes).padStart(2, '0')}</span> :
          <span>{String(timeLeft.seconds).padStart(2, '0')}</span>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default FlashSaleCountdown;
