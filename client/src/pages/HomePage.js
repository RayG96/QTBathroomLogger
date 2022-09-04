import React, { useContext, useEffect, useRef, useState } from 'react';
import { AuthContext } from 'context/auth';
import { SocketContext } from 'context/socket';
import { Box, Button, Center } from '@chakra-ui/react';
import { config } from 'util/constants';
import Card from 'components/Card';

export default function HomePage() {
    const { user } = useContext(AuthContext);
    const socket = useContext(SocketContext);
    
    const [studentsOut, setStudentsOut] = useState([]);
    const [currentTime, setCurrentTime] = useState(null);

    useEffect(() => {
        fetch(`${config.API_URL}/transactions/getCurrentlySignedOut/${user.googleId}`, {
            method: 'GET',
        }).then(response =>
            response.json()
        ).then(data => {
            setStudentsOut(data);
        }).catch(err => {
            console.error(err);
        });

        // client-side
        socket.on('connect', () => {
            console.log(socket.id);
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
                <Box>
                    {studentsOut.map((student, index) => <Card key={student._id} index={index} currentTime={currentTime} setCurrentTime={setCurrentTime} student={student} />)}
                </Box>
            )
            }
        </>
    );
}
