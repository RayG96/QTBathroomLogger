import React, { useEffect, useRef } from 'react';
import './DigitalClock.css';
const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
];

export default function DigitalClock(props) {
    const hourDigital = useRef('');
    const minutesDigital = useRef('');
    const amPm = useRef('');
    const dayNow = useRef('');
    const monthNow = useRef('');
    const yearNow = useRef('');

    useEffect(() => {
        let date = new Date(props.currentTime);
        if (date !== null) {
            let HH = date.getHours(),
                MM = date.getMinutes(),
                day = date.getDate(),
                month = date.getMonth(),
                year = date.getFullYear(),
                ampm;

            if (HH >= 12) {
                HH = HH - 12;
                ampm = "PM";
            } else {
                ampm = "AM";
            }

            if (HH === 0) HH = 12;
            // @ts-ignore
            if (HH < 10) HH = `0${HH}`;
            // @ts-ignore
            if (MM < 10) MM = `0${MM}`;

            // @ts-ignore
            hourDigital.current = HH;
            // @ts-ignore
            minutesDigital.current = MM;
            amPm.current = ampm;
            // @ts-ignore
            dayNow.current = day;
            // @ts-ignore
            monthNow.current = months[month];
            // @ts-ignore
            yearNow.current = year;
        }
    }, [props.currentTime]);

    return (
        <div>
            <div className='clock__text'>
                <div className='clock__text-hour'>{`${hourDigital.current}:`}</div>
                <div className='clock__text-minutes'>{minutesDigital.current}</div>
                <div className='clock__text-ampm'>{amPm.current}</div>
            </div>

            <div className='clock__date'>
                <span>{`${dayNow.current} `}</span>
                <span>{`${monthNow.current} , `}</span>
                <span>{yearNow.current}</span>
            </div>
        </div>
    );
}