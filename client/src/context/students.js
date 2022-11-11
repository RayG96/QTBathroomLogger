import React, { useEffect, createContext, useRef, useState } from 'react';
const { config } = require("util/constants");

// @ts-ignore
const StudentsContext = createContext();

function StudentsProvider(props) {
    const students = useRef([]);
    const [rosters, setRosters] = useState([]);
    const [latelogs, setLateLogs] = useState([]);

    const getRosters = () => {
        fetch(`${config.API_URL}/rosters/getRosters/${props.user.googleId}`, {
            method: 'GET',
        }).then(response =>
            response.json()
        ).then(data => {
            setRosters(data);
            students.current = [];
            data.forEach(e => {
                e.students.forEach(student => {
                    students.current.push(student['Student Name']);
                })
            })
        }).catch(err => {
            console.error(err);
        });
    }

    const getLateLogs = () => {
        fetch(`${config.API_URL}/transactions/getLateLogs/${props.user.googleId}`, {
            method: 'GET',
        }).then(response =>
            response.json()
        ).then(data => {
            setLateLogs(data);
        }).catch(err => {
            console.error(err);
        });
    }

    useEffect(() => {
        getRosters();
        getLateLogs();
    }, []);

    return <StudentsContext.Provider value={{students, rosters, latelogs, getRosters, getLateLogs }} {...props} /> ;

}

export { StudentsContext, StudentsProvider };