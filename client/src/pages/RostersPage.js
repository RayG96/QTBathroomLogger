import { Box, Flex, chakra, Button, Center, Divider, Text, Table, Thead, Tbody, Tr, Th, Td, TableContainer } from "@chakra-ui/react";
import { AiOutlineUpload } from 'react-icons/ai'
import { config } from 'util/constants';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { AuthContext } from "context/auth";

export default function RostersPage() {
    const { user } = useContext(AuthContext);
    const hiddenImageInput = useRef(null);

    const [rosters, setRosters] = useState([]);
    const [showLabel, setShowLabel] = useState(false);
    const [isError, setIsError] = useState(false);

    const TableRow = (props) => {
        const onClick = (e) => {
            e.preventDefault();
    
            fetch(`${config.API_URL}/rosters/remove`, {
                method: 'POST',
                // We convert the React state to JSON and send it as the POST body
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    _id: props.roster._id
                })
            }).then(response => {
                console.log(response);
                if (response.status === 200) {
                    getRosters();
                }
            }).catch(err => {
                console.error(err);
            });
        };
    
        return (
            <>
                <Tr>
                    <Td>{props.roster.classId}</Td>
                    <Td isNumeric>{props.roster.students.length}</Td>
                    <Td isNumeric><Button onClick={onClick} colorScheme={'red'} size='sm'>Delete</Button></Td>
                </Tr>
            </>)
    }

    const getRosters = () => {
        fetch(`${config.API_URL}/rosters/getRosters/${user.googleId}`, {
            method: 'GET',
        }).then(response =>
            response.json()
        ).then(data => {
            setRosters(data);
        }).catch(err => {
            console.error(err);
        });
    }

    useEffect(() => {
        getRosters();
    }, []);

    const handleFileInput = (e) => {
        const file = e.target.files[0];
        if (file.size < 2048) {
            const formData = new FormData();
            formData.append('teacherId', user.googleId);
            formData.append('rosterFile', file);

            fetch(`${config.API_URL}/rosters/upload`, {
                method: 'POST',
                body: formData
            }).then(response => {
                if (response.status === 200) {
                    getRosters();
                }
            }).catch(err => {
                console.error(err);
                setIsError(true);
            });
        } else {

        }
    }

    return (
        <>
            <Flex
                p={50}
                w="full"
                alignItems="center"
                justifyContent="center"
            >
                <Box
                    mx="auto"
                    rounded="lg"
                    shadow="md"
                    bg="white"
                    _dark={{ bg: "gray.800" }}
                    w="full"
                >
                    <Box p={6}>
                        <Box>
                            <chakra.span fontSize="lg" textTransform="uppercase" color="brand.600">
                                Rosters
                            </chakra.span>
                        </Box>
                        <Divider />
                        <Box>
                            <TableContainer>
                                <Table variant='simple'>
                                    <Thead>
                                        <Tr>
                                            <Th>Class</Th>
                                            <Th isNumeric># of students</Th>
                                            <Th isNumeric>Action</Th>
                                        </Tr>
                                    </Thead>
                                    <Tbody>
                                        {rosters.map((roster, index) => <TableRow key={roster._id} roster={roster} />)}
                                    </Tbody>
                                </Table>
                            </TableContainer>
                        </Box>
                        <Box mt={4}>
                            <Center>
                                <Text fontSize='md' color={isError ? 'red' : 'brand.600'} hidden={!showLabel} >
                                    Rosters
                                </Text>
                            </Center>
                            <Center>
                                <Flex alignItems='center'>
                                    <input type='file' accept='.csv' style={{ display: 'none' }} onChange={handleFileInput} ref={hiddenImageInput} />
                                    <Button rightIcon={<AiOutlineUpload />} colorScheme={'teal'} onClick={() => hiddenImageInput.current.click()} >Upload Roster</Button>
                                </Flex>
                            </Center>
                        </Box>
                    </Box>
                </Box>
            </Flex>
        </>
    );
}
