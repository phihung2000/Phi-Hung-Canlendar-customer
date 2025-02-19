import React, { useEffect, useState } from 'react';
import { getRandomColor } from '../../utils/getRandomColor';
import PopUpInputEvent from '../PopUpInputEvent';
import WeekView from '../WeekView';

const Calendar = () => {
  // State lưu trữ tháng và năm hiện tại
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [openPopUp, setOpenPopUp] = useState(false)
  const [isDayChoose, setIsDayChoose] = useState('');
  const [events, setEvents] = useState<any[]>([])
  const [viewMode, setViewMode] = useState('month');

  const getStartOfWeek = (date: any) => {
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - date.getDay());
    return startOfWeek;
  };

  const [currentWeekStart, setCurrentWeekStart] = useState(() => getStartOfWeek(currentMonth));

  const changeWeek = (offset: number) => {
    const newWeekStart = new Date(currentWeekStart);
    newWeekStart.setDate(currentWeekStart.getDate() + offset * 7);
    setCurrentWeekStart(newWeekStart);
    setCurrentMonth(newWeekStart);
  };

  // Hàm để chuyển tháng
  const changeMonth = (offset: number) => {
    const newMonth = new Date(currentMonth.setMonth(currentMonth.getMonth() + offset));
    setCurrentMonth(newMonth);
  };

  const handleViewModeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setViewMode(event.target.value);
  };

  const handleClickDay = (day: any, isChooseToday?: boolean) => {
    const nowDate = new Date()

    const month = isChooseToday ? nowDate.getMonth() + 1 : currentMonth.getMonth() + 1;
    const year = isChooseToday ? nowDate.getFullYear() : currentMonth.getFullYear();
    const formatDay = isChooseToday ? nowDate.getDate() : (day < 10 ? `0${day}` : `${day}`);
    const formatMonth = month < 10 ? `0${month}` : `${month}`;

    const fullDate = `${formatDay}-${formatMonth}-${year}`

    setOpenPopUp(true);
    return day ? setIsDayChoose(fullDate) : '';
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
            <span className='text-left-calendar' onClick={() => handleClickDay(1, true)}>To Day</span>
            <button className='button-calendar' onClick={() => viewMode === 'month' ? changeMonth(-1) : changeWeek(-1)}>&lt;</button>
            <button className='button-calendar' onClick={() => viewMode === 'month' ? changeMonth(1) : changeWeek(1)}>&gt;</button>
            <h2 className='month-year'>{currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}</h2>
          </div>
          <div className='right-calendar'>
            <select onChange={handleViewModeChange} className="view-mode-select">
              <option value="month">Month</option>
              <option value="week">Week</option>
            </select>
          </div>
        </div>

        {/* Giao diện tháng */}
        {viewMode === 'month' && (
          <table className="table-calendar">
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
                <tr key={index}>
                  {week.map((dayData, i) => (
                    <td key={i} onClick={() => dayData?.day ? handleClickDay(dayData?.day) : ''}>
                      {dayData?.day ? (
                        <div className="div-day">
                          <span className={isToday(dayData?.day) ? 'is-today' : 'not-today'}>{dayData?.day}</span>
                          <div className="events">
                            {dayData?.events.map((event, idx) => (
                              <div key={idx} className='div-events' style={{ backgroundColor: getRandomColor() }}>
                                <div className='left-events'></div>
                                <p key={idx} className="event-text">{event.title}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : null}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Giao diện tuần */}
        {viewMode === 'week' && (
          <WeekView
            events={events}
            weekStartDate={currentWeekStart} // Pass the start date
            handleClickDay={handleClickDay}
          />
        )}
      </div>
      <PopUpInputEvent isOpen={openPopUp} date={isDayChoose} setIsOpen={setOpenPopUp} />
    </>
  );
};

export default Calendar;
