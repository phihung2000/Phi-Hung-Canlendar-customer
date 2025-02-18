import { useFormik } from "formik";
import { toast } from "react-toastify"
import React, { useState, useEffect } from "react";
import * as Yup from 'yup';
import { title } from "process";

const validationSchema = Yup.object({
    title: Yup.string().required('trường này là bắt buộc'),
})

type typeProps = {
    isOpen: boolean;
    date: string;
    setIsOpen: (value: boolean) => void
}

const PopUpInputEvent = (props: typeProps) => {
    const { isOpen, date, setIsOpen } = props;
    const [events, setEvents] = useState(() => {
        const storedEvents = localStorage.getItem('events');
        return storedEvents ? JSON.parse(storedEvents) : [];
      });
    const [dayEvents, setDayEvents] = useState<any[]>([]);
    const initialValues = {
        title: "",
        date: "",
        time: "",
    }
    const formik = useFormik({
        initialValues: initialValues,
        enableReinitialize: true,
        validationSchema: validationSchema,
        onSubmit: (values) => { handleSubmit() }
    });

    const handleSubmit = () => {
        const newEvent = {
            title: formik.values['title'],
            date: date,
            time: formik.values['time']
        }

        events.push(newEvent);
        localStorage.setItem('events', JSON.stringify(events));

        setIsOpen(false)
        toast.success('save success')
        formik.resetForm();
    }

    useEffect(() => {
        // Filter events for the selected date
        if (date) {
            const filteredEvents = events.filter((event: { date: string; }) => event.date === date);
            setDayEvents(filteredEvents);
        } else {
            setDayEvents([])
        }
    }, [date, events]);
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden'; // Prevent scrolling
        } else {
            document.body.style.overflow = 'auto'; // Restore scrolling
        }
        return () => {
            document.body.style.overflow = 'auto'; // Important: Restore on unmount
        };
    }, [isOpen]);

    return (
        <>
            {isOpen ? (
                <div className='Popup-root'>
                    <div className="from-input-data">
                        <div>
                            <h2 className="title-event">Add an event for this date</h2>
                            <h2 className="title-event">{date}</h2>
                        </div>
                        <div className="div-input">
                            <p>Enter name event: </p>
                            <input
                                type="text"
                                value={formik.values['title']}
                                onChange={(e) => formik.setFieldValue("title", e.target.value)}
                                placeholder="Please enter event"
                            />
                            {formik.errors['title'] && formik.touched['title'] &&
                                <span className='error'>{String(formik.errors['title'])}</span>
                            }
                        </div>
                        <div className="div-input">
                            <p>Choose hours: </p>
                            <input
                                type="time"
                                value={formik.values['time']}
                                onChange={(e) => formik.setFieldValue("time", e.target.value)}
                                placeholder="Choose hours"
                            />
                        </div>
                        <div className="div-button">
                            <button className="button-cancel" onClick={() => { setIsOpen(false); formik.resetForm() }}>Cancel</button>
                            <button className="button-save" type="button" onClick={() => formik.handleSubmit()}>Save</button>
                        </div>

                        <div className="show-events">
                            {dayEvents.map((event, index) => (
                                <div key={index} className="event-item">
                                    <p className="title">Name Event: <span>{event.title}</span></p>
                                    {event.time && <p className="title"> Time : {event.time}</p>}
                                </div>
                            ))}
                            {dayEvents.length === 0 && <p>No events for this day.</p>}
                        </div>
                    </div>
                </div>
            ) : null}
        </>
    )
}
export default PopUpInputEvent