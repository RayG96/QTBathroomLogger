import React, { useEffect, useRef } from "react";
import {
    Box, Flex, Avatar, Stat, StatLabel, StatHelpText, Button
} from "@chakra-ui/react";
import { FaToilet, FaQuestion } from 'react-icons/fa';
import { IoIosWater } from 'react-icons/io';
import { MdLocalHospital } from 'react-icons/md';
import { config } from 'util/constants';

export default function Card(props) {
    const timeIn = useRef(new Date(props.student.timeOut).getTime());
    const timeDifferenceTotalSeconds = useRef(0);
    const timeDifferenceMinutes = useRef(0);
    const timeDifferenceSeconds = useRef(0);

    useEffect(() => {
        if (props.currentTime !== null) {
            timeDifferenceTotalSeconds.current = (props.currentTime - timeIn.current) / 1000;
            timeDifferenceMinutes.current = Math.floor(timeDifferenceTotalSeconds.current / 60);
            timeDifferenceSeconds.current = Math.floor(timeDifferenceTotalSeconds.current - timeDifferenceMinutes.current * 60);
        }
    }, [props.currentTime])

    const onClick = (e) => {
        e.preventDefault();

        fetch(`${config.API_URL}/transactions/sign-in`, {
            method: 'POST',
            // We convert the React state to JSON and send it as the POST body
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                _id: props.student._id
            })
        }).then(response => {
            // console.log(response);
            // if (response.status === 200) {
            //     props.onDelete(props.student._id);
            // }
        }).catch(err => {
            console.error(err);
        });
    };

    return (
        <>
            <Flex
                p={50}
                paddingBottom={2}
                w="full"
                alignItems="center"
                justifyContent="center"
            >
                <Box
                    w="container.xl"
                    mx="auto"
                    py={4}
                    px={8}
                    bg="white"
                    _dark={{ bg: "gray.800" }}
                    shadow="lg"
                    rounded="lg"
                >
                    <Flex justifyContent={{ base: "center", md: "end" }} mt={-12}>
                        {props.student.signOutReason === 'bathroom' && <Avatar size='lg' bg='orange.400' icon={<FaToilet fontSize='2.5rem' color='white' />} />}
                        {props.student.signOutReason === 'water' && <Avatar size='lg' bg='blue.400' icon={<IoIosWater fontSize='2.5rem' color='white' />} />}
                        {props.student.signOutReason === 'nurse' && <Avatar size='lg' bg='red.500' icon={<MdLocalHospital fontSize='2.5rem' color='white' />} />}
                        {props.student.signOutReason === 'other' && <Avatar size='lg' bg='purple.400' icon={<FaQuestion fontSize='2.5rem' color='white' />} />}
                    </Flex>

                    <Stat mt={-2}>
                        <StatLabel fontSize={['2xl', '4xl']}><StatHelpText as='span' fontSize={['2xl', '4xl']}>{props.index+1}|</StatHelpText> {props.student.studentName}</StatLabel>
                        <StatHelpText fontSize={['sm', 'md', 'lg', 'xl']}>Time signed out:
                            <StatLabel as='span' fontSize={['sm', 'md', 'lg', 'xl']}> {new Date(props.student.timeOut).toLocaleTimeString('en', { timeStyle: 'short' })}</StatLabel>
                        </StatHelpText>
                        <StatHelpText fontSize={['sm', 'md', 'lg', 'xl']}>Time since signed out: <StatLabel as='span' fontSize={['sm', 'md', 'lg', 'xl']}>{timeDifferenceMinutes.current}m {timeDifferenceSeconds.current}s</StatLabel></StatHelpText>
                    </Stat>

                    <Flex justifyContent='end' mt={['0', '-10']}>
                        <Button onClick={onClick} colorScheme='teal' width='20%' size='md' fontSize={[12, 16]}>Sign In</Button>
                    </Flex>
                </Box>
            </Flex>
        </>
    );
};

