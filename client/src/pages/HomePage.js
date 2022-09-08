import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from 'context/auth';
import { SocketContext } from 'context/socket';
import { Box, Button, Center } from '@chakra-ui/react';
import { config } from 'util/constants';
import Card from 'components/Card';
import AnalogClock from 'components/Clock/AnalogClock';
import DigitalClock from 'components/Clock/DigitalClock';

export default function HomePage() {
    const { user } = useContext(AuthContext);
    const socket = useContext(SocketContext);

    const [studentsOut, setStudentsOut] = useState([]);
    const [currentTime, setCurrentTime] = useState(null);

    const getCurrentlySignedOut = () => {
        fetch(`${config.API_URL}/transactions/getCurrentlySignedOut/${user.googleId}`, {
            method: 'GET',
        }).then(response =>
            response.json()
        ).then(data => {
            setStudentsOut(data);
        }).catch(err => {
            console.error(err);
        });
    }

    useEffect(() => {
        getCurrentlySignedOut();
        // client-side
        socket.on('connect', () => {
            getCurrentlySignedOut();
        });
        socket.on('currentDateTime', (body) => {
            setCurrentTime(body);
        });

        // clean up
        return () => {
            socket.off('connect');
            socket.off('currentDateTime');
        }
    }, []);

    useEffect(() => {
        socket.on('studentTransaction', (body) => {
            if (body.action === 'add') {
                setStudentsOut([...studentsOut, body.result]);
            } else if (body.action === 'delete') {
                setStudentsOut(studentsOut.filter((o) => body.result._id !== o._id));
            }
        });

        // clean up
        return () => {
            socket.off('studentTransaction');
        }
    }, [studentsOut]);

    return (
        <>
            {user === 'NoUser' ? (
                <Center>
                    <a style={{ marginTop: '100px' }} href={`${config.API_URL}/auth/google`}>
                        <Button colorScheme='teal'>
                            Login with Google
                        </Button>
                    </a>
                </Center>
            ) : (
                < Box >
                    <Center mt={10} hidden={studentsOut.length > 0}>
                        <AnalogClock currentTime={currentTime} />
                    </Center>
                    <Center mt={6} hidden={studentsOut.length > 0}>
                        <DigitalClock currentTime={currentTime} />
                    </Center>
                    {studentsOut.map((student, index) => <Card key={student._id} index={index} currentTime={currentTime} setCurrentTime={setCurrentTime} student={student} />)}
                </Box>
            )}
        </>
    );
}
