import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';

const Calendar: React.FC = () => {
  return (
    <div style={{ maxWidth: '900px', margin: 'auto', padding: '20px' }}>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: 'today prev,next',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay'
        }}
        events={[
          { title: 'First Session with L...', start: '2021-04-05', color: '#FFAA33' },
          { title: 'Webinar: How to en...', start: '2021-04-12', color: '#FFAA33' },
          { title: 'Chemistry Session', start: '2021-04-17', color: '#335DFF' }
        ]}
      />
    </div>
  );
};

export default Calendar;
