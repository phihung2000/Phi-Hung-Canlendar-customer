import { useFormik } from "formik";
import { toast } from "react-toastify"
import React, { useState } from "react";
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
    const initialValues = {
        title: "",
        date: "",
        time: "",
    }
    const formik = useFormik({
        initialValues: initialValues,
        enableReinitialize: true,
        validationSchema: validationSchema,
        onSubmit: (values) => { handleSubmit()}
    });

    const handleSubmit = () => {
        const newEvent = {
            title: formik.values['title'],
            date: date,
            time: formik.values['time']
        }
        const events = JSON.parse(localStorage.getItem('events') || '[]')

        events.push(newEvent);
        localStorage.setItem('events', JSON.stringify(events));

        setIsOpen(false)
        toast.success('save success')
        formik.resetForm();
    }

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
                            <button className="button-cancel"  onClick={() => {setIsOpen(false); formik.resetForm()}}>Cancel</button>
                            <button className="button-save" type="button" onClick={() => formik.handleSubmit()}>Save</button>
                        </div>
                    </div>
                </div>
            ) : null}
        </>
    )
}
export default PopUpInputEvent