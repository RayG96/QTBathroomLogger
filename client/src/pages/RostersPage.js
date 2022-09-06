import { Box, Flex, chakra, Button, Center, Divider, Text, Table, Thead, Tbody, Tr, Th, Td, TableContainer } from "@chakra-ui/react";
import { AiOutlineUpload } from 'react-icons/ai'
import { config } from 'util/constants';
import React, { useContext, useRef, useState } from 'react';
import { AuthContext } from "context/auth";

export default function RostersPage() {
    const { user } = useContext(AuthContext);
    const hiddenImageInput = useRef(null);
    const [showLabel, setShowLabel] = useState(false);
    const [isError, setIsError] = useState(false);

    const handleFileInput = (e) => {
        const file = e.target.files[0];
        if (file.size < 2048) {
            const formData = new FormData();
            formData.append('_id', user._id);
            formData.append('rosterFile', file);

            fetch(`${config.API_URL}/rosters/upload`, {
                method: 'POST',
                body: formData
            }).then(response => {

            }).catch(err => {
                console.error(err);
                setIsError(true);
            });
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
                                        <Tr>
                                            <Td>CS101</Td>
                                            <Td isNumeric>25</Td>
                                            <Td isNumeric><Button colorScheme={'red'} size='sm'>Delete</Button></Td>
                                        </Tr>
                                        <Tr>
                                            <Td>CS101</Td>
                                            <Td isNumeric>25</Td>
                                            <Td isNumeric><Button colorScheme={'red'} size='sm'>Delete</Button></Td>
                                        </Tr>
                                        <Tr>
                                            <Td>CS101</Td>
                                            <Td isNumeric>25</Td>
                                            <Td isNumeric><Button colorScheme={'red'} size='sm'>Delete</Button></Td>
                                        </Tr>
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
