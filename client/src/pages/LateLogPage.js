import { Box, Flex, chakra, Center, Divider, Text, Table, Thead, Tbody, Tr, Th, Td, TableContainer } from "@chakra-ui/react";
import React, { useContext, useEffect} from 'react';
import { StudentsContext } from "context/students";

export default function LateLogPage() {
    const { latelogs, getLateLogs } = useContext(StudentsContext);

    useEffect(() => {
        getLateLogs();
    }, []);
    const TableRow = (props) => {
        return (
            <>
                <Tr>
                    <Th>{props.latelogs.studentName}</Th>
                    <Th>{new Date(props.latelogs.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</Th>
                    <Th>{new Date(props.latelogs.timeIn).toLocaleTimeString()}</Th>
                </Tr>
            </>)
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
                        <Box marginBottom='1rem'>
                            <chakra.span fontSize="lg" textTransform="uppercase" color="brand.600">
                                Late Logs
                            </chakra.span>
                        </Box>
                        <Divider />
                        <Box>
                            <TableContainer>
                                <Table variant='simple'>
                                    <Thead>
                                        <Tr>
                                            <Th>Name</Th>
                                            <Th>Date</Th>
                                            <Th>Time</Th>
                                        </Tr>
                                    </Thead>
                                    <Tbody>
                                        {latelogs.map((latelogs, index) => <TableRow key={latelogs._id} latelogs={latelogs} />)}
                                    </Tbody>
                                </Table>
                            </TableContainer>
                        </Box>
                    </Box>
                </Box>
            </Flex>
        </>
    );
}
