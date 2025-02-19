import { useFormik } from "formik";
import { toast } from "react-toastify"
import React, { useState, useEffect } from "react";
import * as Yup from 'yup';
import Select from 'react-select'

const validationSchema = Yup.object({
    title: Yup.string().required('This field is required'),
})

type typeProps = {
    isOpen: boolean;
    date: string;
    setIsOpen: (value: boolean) => void
}

const options = [
    { value: 'Holiday', label: 'Holiday' },
    { value: 'Meeting', label: 'Meeting' },
    { value: 'Other', label: 'Other' }
]

const PopUpInputEvent = (props: typeProps) => {
    const { isOpen, date, setIsOpen } = props;

    const [isOpenAdd, setIsOpenAdd] = useState(false)
    const [events, setEvents] = useState(() => {
        const storedEvents = localStorage.getItem('events');
        return storedEvents ? JSON.parse(storedEvents) : [];
    });
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|Windows Phone/i.test(navigator.userAgent);

    const [dayEvents, setDayEvents] = useState<any[]>([]);
    const initialValues = {
        title: "",
        date: "",
        time: "",
        type: "Holiday",
        url: ""
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
            time: formik.values['time'],
            type: formik.values['type'],
            url: formik.values['url']
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
        const storedEvents = localStorage.getItem('events');
        setEvents(storedEvents ? JSON.parse(storedEvents) : [])
        if (isOpen && !isMobile) {
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
                        <img src="/icon/close-circle-svgrepo-com.svg" alt="icon-close" className="icon-close" onClick={() => setIsOpen(false)}/>
                        <div className="header-From">
                            <div className="title-header">
                                <span>Upcoming Events</span>
                                <button className="button-add" type="button" onClick={() => setIsOpenAdd(true)}>Add Event</button>
                            </div>
                            <h2 >{date}</h2>
                        </div>
                        {isOpenAdd && (
                            <div className="div-form-add">
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
                                <div className="div-input">
                                    <p>Choose type event: </p>
                                    <Select
                                        options={options}
                                        onChange={(selectedOption) => {
                                            formik.setFieldValue('type', selectedOption?.value);
                                        }}
                                        value={{ value: formik?.values?.type, label: formik?.values?.type }}
                                        className="view-mode-select"
                                        classNamePrefix="react-select"
                                    />
                                </div>
                                {formik.values['type'] === 'Meeting' && <div className="div-input">
                                    <p>Enter Url: </p>
                                    <input
                                        type="text"
                                        value={formik.values['url']}
                                        onChange={(e) => formik.setFieldValue("url", e.target.value)}
                                        placeholder="Enter Url"
                                    />
                                </div>}
                                <div className="div-button">
                                    <button className="button-cancel" onClick={() => {setIsOpenAdd(false); formik.resetForm() }}>Cancel</button>
                                    <button className="button-save" type="button" onClick={() => formik.handleSubmit()}>Save</button>
                                </div>
                            </div>
                        )}

                        <div className="show-events">
                            {dayEvents.map((event, index) => (
                                <div key={index} className="event-item">
                                    <div className="left-event-pop-up"></div>
                                    <div className="center-event-pop-up">
                                        <span className="title"><span>{event.title}</span></span>
                                        {event.time && <span className="title">{event.time}</span>}
                                        {event.type === 'Meeting' && (
                                            <div className="div-profile">
                                                <img src="/icon/person-button-svgrepo-com.svg" className="icon-video-call" alt="Description" />
                                                <a href="https://translate.google.com/">View client profile</a>
                                            </div>
                                        )}
                                    </div>
                                    {event.type === 'Meeting' && (
                                        <div className="Right-event-pop-up" onClick={() => window.open(event?.url, '_blank')}>
                                            <img src="/icon/camera-svgrepo-com.svg" className="icon-video-call" alt="Description" />
                                        </div>
                                    )}
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