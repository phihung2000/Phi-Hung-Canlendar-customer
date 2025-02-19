import React, { useEffect, useState } from 'react';
import { getRandomColor } from '../../utils/getRandomColor';
import PopUpInputEvent from '../PopUpInputEvent';
import WeekView from '../WeekView';
import Select from 'react-select'

const options = [
  { value: 'Month', label: 'Month' },
  { value: 'Week', label: 'Week' },
]

const Calendar = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [openPopUp, setOpenPopUp] = useState(false)
  const [isDayChoose, setIsDayChoose] = useState('');
  const [events, setEvents] = useState<any[]>([])
  const [viewMode, setViewMode] = useState('Month');

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

  const handleClickDay = (day: any, isChooseToday?: boolean) => {
    const daySpan = document.querySelector(`.div-day span[data-day="${day}"]`);
    const allDaySpans = document.querySelectorAll('.div-day span');
    allDaySpans.forEach(span => span.classList.remove('isClick'));
    if (daySpan) {
      daySpan.classList.add('isClick');
    }
    const nowDate = new Date()

    const month = isChooseToday ? nowDate.getMonth() + 1 : currentMonth.getMonth() + 1;
    const year = isChooseToday ? nowDate.getFullYear() : currentMonth.getFullYear();
    const formatDay = isChooseToday ? nowDate.getDate() : (day < 10 ? `0${day}` : `${day}`);
    const formatMonth = month < 10 ? `0${month}` : `${month}`;

    const fullDate = `${formatDay}-${formatMonth}-${year}`

    setOpenPopUp(true);
    return day ? setIsDayChoose(fullDate) : '';
  }

  // Function to generate list of days in month
  const generateCalendar = (month: Date) => {
    const startDate = new Date(month.getFullYear(), month.getMonth(), 1);
    const endDate = new Date(month.getFullYear(), month.getMonth() + 1, 0);

    const startDay = startDate.getDay();

    const totalDaysInMonth = endDate.getDate();

    const days = [];
    let dayCounter = 1;

    for (let i = 0; i < 6; i++) {
      const week = [];
      for (let j = 0; j < 7; j++) {
        if (i === 0 && j < startDay) {
          week.push(null);
        } else if (dayCounter <= totalDaysInMonth) {
          const currentDate = new Date(month.getFullYear(), month.getMonth(), dayCounter);
          // Filter events of current day
          const formattedDate = `${currentDate.getDate() < 10 ? '0' + currentDate.getDate() : currentDate.getDate()}-${(currentDate.getMonth() + 1) < 10 ? '0' + (currentDate.getMonth() + 1) : (currentDate.getMonth() + 1)}-${currentDate.getFullYear()}`;
          const dayEvents = events.filter(event => event.date === formattedDate);
          week.push({
            day: dayCounter,
            events: dayEvents,
          });
          dayCounter++;
        } else {
          week.push(null);
        }
      }
      days.push(week);
    }

    return days;
  };

  useEffect(() => {
    // Function to get event from localStorage
    const loadEvents = () => {
      const storedEvents = JSON.parse(localStorage.getItem('events') || '[]');
      setEvents(storedEvents);
    };
    loadEvents();

    window.addEventListener('storage', loadEvents);

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
            <button className='button-calendar' onClick={() => viewMode === 'Month' ? changeMonth(-1) : changeWeek(-1)}>&lt;</button>
            <button className='button-calendar-desktop' onClick={() => viewMode === 'Month' ? changeMonth(1) : changeWeek(1)}>&gt;</button>
            <h2 className='month-year'>{currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}</h2>
            <button className='button-calendar-mobile' onClick={() => viewMode === 'Month' ? changeMonth(1) : changeWeek(1)}>&gt;</button>
          </div>
          <div className='right-calendar'>
            <Select
              options={options}
              onChange={(selectedOption) => selectedOption && setViewMode(selectedOption.value)}
              value={{ value: viewMode, label: viewMode }}
              className="view-mode-select"
              classNamePrefix="react-select"
            />
          </div>
        </div>

        {/* page month*/}
        {viewMode === 'Month' && (
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
                          <span className={isToday(dayData?.day) ? 'is-today' : dayData.events.length > 0 ? 'is-Events' : 'not-today'} data-day={dayData?.day}>{dayData?.day}</span>
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

        {/* page week */}
        {viewMode === 'Week' && (
          <WeekView
            events={events}
            weekStartDate={currentWeekStart}
            handleClickDay={handleClickDay}
          />
        )}
      </div>
      <PopUpInputEvent isOpen={openPopUp} date={isDayChoose} setIsOpen={setOpenPopUp} />
    </>
  );
};

export default Calendar;
