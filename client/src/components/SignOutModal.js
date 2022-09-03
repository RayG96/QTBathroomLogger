import {
    Button,

    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
    FormControl,
    FormLabel,
    Input,
    useDisclosure,
    ButtonGroup,
    useBreakpointValue,
} from '@chakra-ui/react';
import React from 'react';
import { FaToilet, FaQuestion } from 'react-icons/fa';
import { IoIosWater } from 'react-icons/io';
import { MdLocalHospital } from 'react-icons/md';

export default function SignOutModal(props) {

    const initialRef = React.useRef(null)
    const finalRef = React.useRef(null)

    return (
        <>
            <Modal initialFocusRef={initialRef} finalFocusRef={finalRef} size="xl" isOpen={props.isOpen} onClose={props.onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Sign Out</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6}>
                        <FormControl>
                            <FormLabel>Name</FormLabel>
                            <Input ref={initialRef} placeholder='Name' />
                        </FormControl>
                        <FormControl mt={4}>
                            <FormLabel>Reason</FormLabel>
                            <ButtonGroup display='flex' justifyContent='center' variant='outline' spacing='4'>
                                <Button leftIcon={<FaToilet />} border='2px' colorScheme='yellow'>Bathroom</Button>
                                <Button leftIcon={<IoIosWater />} border='2px'>Water</Button>
                                <Button leftIcon={<MdLocalHospital />} border='2px'>Nurse</Button>
                                <Button leftIcon={<FaQuestion />} border='2px'>Other</Button>
                            </ButtonGroup>
                        </FormControl>
                    </ModalBody>

                    <ModalFooter>
                        <Button width='25%' colorScheme='blue' mr={3}>
                            Sign Out
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

        </>
    );
}