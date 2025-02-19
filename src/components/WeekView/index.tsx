import React from 'react';
import { getRandomColor } from '../../utils/getRandomColor';

type typeProps = {
    events: any[],
    weekStartDate: Date,
    handleClickDay: (value: number) => void
};

const WeekView = (props: typeProps) => {
    const { events, weekStartDate, handleClickDay } = props;

    const daysInWeek: Date[] = [];
    for (let i = 0; i < 7; i++) {
        const day = new Date(weekStartDate);
        day.setDate(weekStartDate.getDate() + i);
        daysInWeek.push(day);
    }

    const generateHours = () => {
        const hours = [];
        for (let i = 0; i < 24; i++) {
            hours.push(i < 10 ? `0${i}` : i);
        }
        return hours;
    };

    const hours = generateHours();

    return (
        <table className="week-calendar-table">
            <thead>
                <tr>
                    <th className="time-column"></th>
                    {daysInWeek.map((day, index) => (
                        <th key={index} className="day-header">
                            {day.toLocaleString('default', { weekday: 'short', day: 'numeric' })}
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {hours.map((hour) => (
                    <tr key={hour}>
                        <td className="hour-label">{hour}</td>
                        {daysInWeek.map((day) => {
                            const dateStr = `${day.getDate() < 10 ? '0' + day.getDate() : day.getDate()}-${(day.getMonth() + 1) < 10 ? '0' + (day.getMonth() + 1) : (day.getMonth() + 1)}-${day.getFullYear()}`;
                            const dayEvents = events.filter(event => {
                                if (!event.date || !event.title) return false;
                                const eventDate = new Date(event.date.split('-').reverse().join('-'));
                                const eventDateStr = `${eventDate.getDate() < 10 ? '0' + eventDate.getDate() : eventDate.getDate()}-${(eventDate.getMonth() + 1) < 10 ? '0' + (eventDate.getMonth() + 1) : (eventDate.getMonth() + 1)}-${eventDate.getFullYear()}`;

                                return eventDateStr === dateStr && (String(hour) === (event.time?.split(':')[0] ?? null) || !event.time);
                            });

                            return (
                                <td key={day.getTime()} className="hour-cell" onClick={() => handleClickDay(day.getDate())}>
                                    {dayEvents.map((event, idx) => (
                                        // <div key={idx} className="events" >
                                        //     <p className="event-text" style={{ backgroundColor: getRandomColor() }}>{event.title}</p>
                                        // </div>
                                        <div key={idx} className='div-events' style={{ backgroundColor: getRandomColor() }}>
                                            <div className='left-events'></div>
                                            <p key={idx} className="event-text">{event.title}</p>
                                        </div>
                                    ))}
                                </td>
                            );
                        })}
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default WeekView;