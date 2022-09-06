import React, { useEffect, useRef } from 'react';
import './AnalogClock.css';

export default function AnalogClock(props) {
    const hour = useRef('');
    const minutes = useRef('');
    const seconds = useRef('');

    useEffect(() => {
        let date = new Date(props.currentTime);
        if (date !== null) {
            let hh = date.getHours() * 30,
                mm = date.getMinutes() * 6,
                ss = date.getSeconds() * 6;

            hour.current = `rotateZ(${hh + mm / 12}deg)`;
            minutes.current = `rotateZ(${mm}deg)`;
            seconds.current = `rotateZ(${ss}deg)`;
        }
    }, [props.currentTime]);

    return (
        <div className='clock__circle'>
            <span className='clock__twelve'></span>
            <span className='clock__three'></span>
            <span className='clock__six'></span>
            <span className='clock__nine'></span>

            <div className='clock__rounder'></div>
            <div className='clock__hour' style={{ transform: hour.current }}></div>
            <div className='clock__minutes' style={{ transform: minutes.current }}></div>
            <div className='clock__seconds' style={{ transform: seconds.current }}></div>
        </div>
    );
}