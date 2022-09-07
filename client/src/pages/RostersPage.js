import { Box, Flex, chakra, Button, Center, Divider, Text, Table, Thead, Tbody, Tr, Th, Td, TableContainer } from "@chakra-ui/react";
import { AiOutlineUpload } from 'react-icons/ai'
import { config } from 'util/constants';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { AuthContext } from "context/auth";
import { StudentsContext } from "context/students";

export default function RostersPage() {
    const { user } = useContext(AuthContext);
    const { rosters, getRosters } = useContext(StudentsContext);

    const hiddenImageInput = useRef(null);

    const [labelText, setLabelText] = useState('');
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
                    <Th>{props.roster.rosterDate}</Th>
                    <Th isNumeric>{props.roster.term}</Th>
                    <Th isNumeric>{props.roster.markingPeriod}</Th>
                    <Th isNumeric>{props.roster.students.length}</Th>
                    <Td><Button onClick={onClick} colorScheme={'red'} size='sm'>Delete</Button></Td>
                </Tr>
            </>)
    }

    const handleFileInput = (e) => {
        const file = e.target.files[0];
        console.log(file)
        if (file.size < 200000) {
            const formData = new FormData();
            formData.append('teacherId', user.googleId);
            formData.append('rosterFile', file);

            fetch(`${config.API_URL}/rosters/upload`, {
                method: 'POST',
                body: formData
            }).then(response => {
                if (response.status === 200) {
                    getRosters();
                    setIsError(false);
                    setLabelText('Roster Uploaded');
                } else {
                    setIsError(true);
                    setLabelText(response.statusText);
                }
                e.target.value = null;
            }).catch(err => {
                e.target.value = null;
                console.error(err);
                setIsError(true);
            });
        } else {
            e.target.value = null;
            setIsError(true);
            setLabelText('Roster file too large');
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
                                            <Th>Date</Th>
                                            <Th isNumeric>Term</Th>
                                            <Th isNumeric>MP</Th>
                                            <Th isNumeric># of Students</Th>
                                            <Th>Delete</Th>
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
                                <Text fontSize='md' p={2} color={isError ? 'red' : 'green'} hidden={!labelText} >
                                    {labelText}
                                </Text>
                            </Center>
                            <Center>
                                <Flex alignItems='center'>
                                    <input type='file' accept='.xlsx' style={{ display: 'none' }} onChange={handleFileInput} ref={hiddenImageInput} />
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
