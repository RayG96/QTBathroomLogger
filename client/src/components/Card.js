import React from "react";
import {
    Box, Flex, Avatar, Image, Link, Stat, StatLabel, StatNumber, StatHelpText, StatArrow, StatGroup, Button, chakra
} from "@chakra-ui/react";
import { FaToilet } from 'react-icons/fa'

export default function Card() {
    return (
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
                    <Avatar size='lg' bg='blue.500' icon={<FaToilet fontSize='2.5rem' />} />
                </Flex>

                <Stat marginTop={-2}>
                    <StatLabel fontSize={'4xl'}>Lil' Bob</StatLabel>
                    <StatHelpText fontSize={'xl'}>Time signed out: <StatLabel as="span" fontSize={'xl'}>2:55pm</StatLabel></StatHelpText>
                    <StatHelpText fontSize={'xl'}>Time since signed out: <StatLabel as="span" fontSize={'xl'}>07m 02s</StatLabel></StatHelpText>
                </Stat>

                <Flex justifyContent="end" mt={-10}>
                    <Button colorScheme='teal' width='20%' size='md'>Sign In</Button>
                </Flex>
            </Box>
        </Flex>
    );
};

