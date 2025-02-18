import React, { useEffect, useState } from 'react';
import { getRandomColor } from '../../utils/getRandomColor';
import PopUpInputEvent from '../PopUpInputEvent';

const Calendar = () => {
  // State lưu trữ tháng và năm hiện tại
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [openPopUp, setOpenPopUp] = useState(false)
  const [isDayChoose, setIsDayChoose] = useState('');
  const [events, setEvents] = useState<any[]>([])

  // Hàm để chuyển tháng
  const changeMonth = (offset: number) => {
    const newMonth = new Date(currentMonth.setMonth(currentMonth.getMonth() + offset));
    setCurrentMonth(newMonth);
  };

  const handleMonthSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedMonth = parseInt(event.target.value);
    const newDate = new Date(currentMonth.setMonth(selectedMonth));
    setCurrentMonth(newDate);
  };

  const handleClickDay = (day: any) => {
    const month = currentMonth.getMonth()+1;
    const year = currentMonth.getFullYear();
    const formatDay = day < 10? `0${day}` : `${day}`;
    const formatMonth = month < 10 ? `0${month}` : `${month}`;

    const fullDate = `${formatDay}-${formatMonth}-${year}`

    setOpenPopUp(true);
    return day? setIsDayChoose(fullDate): '';
  }

  // Hàm để tạo danh sách các ngày trong tháng
  const generateCalendar = (month: Date) => {
    const startDate = new Date(month.getFullYear(), month.getMonth(), 1); // Ngày đầu tháng
    const endDate = new Date(month.getFullYear(), month.getMonth() + 1, 0); // Ngày cuối tháng

    // Lấy ngày trong tuần của ngày đầu tháng
    const startDay = startDate.getDay();

    // Tổng số ngày trong tháng
    const totalDaysInMonth = endDate.getDate();

    // Tạo một mảng các ngày cho calendar
    const days = [];
    let dayCounter = 1;

    // Thêm các ngày vào mảng, bắt đầu từ vị trí của startDay
    for (let i = 0; i < 6; i++) {
      const week = [];
      for (let j = 0; j < 7; j++) {
        if (i === 0 && j < startDay) {
          week.push(null); // Thêm null nếu ngày chưa đến
        } else if (dayCounter <= totalDaysInMonth) {
          const currentDate = new Date(month.getFullYear(), month.getMonth(), dayCounter);
          // Lọc các sự kiện của ngày hiện tại
          const formattedDate = `${currentDate.getDate() < 10 ? '0' + currentDate.getDate() : currentDate.getDate()}-${(currentDate.getMonth() + 1) < 10 ? '0' + (currentDate.getMonth() + 1) : (currentDate.getMonth() + 1)}-${currentDate.getFullYear()}`;
          const dayEvents = events.filter(event => event.date === formattedDate);
          week.push({
            day: dayCounter,
            events: dayEvents, // Lưu tất cả sự kiện của ngày đó
          });
          dayCounter++;
        } else {
          week.push(null); // Thêm null nếu đã hết ngày trong tháng
        }
      }
      days.push(week);
    }

    return days;
  };

  useEffect(() => {
    // Hàm để lấy sự kiện từ localStorage
    const loadEvents = () => {
        const storedEvents = JSON.parse(localStorage.getItem('events') || '[]');
        setEvents(storedEvents);
    };

    // Lấy dữ liệu ban đầu khi component mount
    loadEvents();

    // Lắng nghe sự thay đổi của localStorage
    window.addEventListener('storage', loadEvents);

    // Cleanup khi component unmount
    return () => {
        window.removeEventListener('storage', loadEvents);
    };
}, [openPopUp]);

  const daysInMonth = generateCalendar(currentMonth);
  const isToday = (day: number | null) =>
    day === new Date().getDate() && currentMonth.getMonth() === new Date().getMonth() && currentMonth.getFullYear() === new Date().getFullYear();

  return (
    <>
      <div className='root-calendar'>
        <div className='header-calendar'>
          <div className='left-calendar'>
            <span className='text-left-calendar'>To Day</span>
            <button className='button-calendar' onClick={() => changeMonth(-1)}>&lt;</button>
            <button className='button-calendar' onClick={() => changeMonth(1)}>&gt;</button>
            <h2 className='month-year'>{currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}</h2>
          </div>
          <div className='right-calendar'>
            <select value={currentMonth.getMonth()} onChange={handleMonthSelect} className='selected-month'>
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i} value={i}>
                  {new Date(0, i).toLocaleString('default', { month: 'long' })}
                </option>
              ))}
            </select>
          </div>
        </div>

        <table className='table-calendar'>
          <thead>
            <tr>
              <th>Sun</th>
              <th>Mon</th>
              <th>Tue</th>
              <th>Wed</th>
              <th>Thu</th>
              <th>Fri</th>
              <th>Sat</th>
            </tr>
          </thead>
          <tbody>
            {daysInMonth.map((week, index) => (
              <tr key={index} id={`${index}`}>
                {week.map((dayData, i) => (
                  <td key={i} onClick={() => dayData?.day ? handleClickDay(dayData?.day) : ''}>
                    {dayData?.day ?
                      <div className='div-day'>
                        <span className={isToday(dayData?.day) ? 'is-today' : 'not-today'}>{dayData?.day}</span>
                        <div className="events">
                          {dayData && dayData?.events.map((event, idx) => (
                            <p key={idx} className="event-text" style={{backgroundColor: getRandomColor()}}>{event.title}</p>
                          ))}
                        </div>
                      </div>
                      : null}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <PopUpInputEvent isOpen={openPopUp} date={isDayChoose} setIsOpen={setOpenPopUp}/>
    </>
  );
};

export default Calendar;
