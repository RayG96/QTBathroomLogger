import React, { useEffect, createContext, useRef, useState } from 'react';
const { config } = require("util/constants");

// @ts-ignore
const StudentsContext = createContext();

function StudentsProvider(props) {
    const students = useRef([]);
    const [rosters, setRosters] = useState([]);

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

    useEffect(() => {
        getRosters();
    }, []);

    return <StudentsContext.Provider value={{students, rosters, getRosters}} {...props} /> ;

}

export { StudentsContext, StudentsProvider };