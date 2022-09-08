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
    ButtonGroup,
    FormErrorMessage,
} from '@chakra-ui/react';
import React, { useRef, useState } from 'react';
import { FaToilet, FaQuestion } from 'react-icons/fa';
import { IoIosWater } from 'react-icons/io';
import { MdLocalHospital } from 'react-icons/md';
import { config } from 'util/constants';
import AutoComplete from './AutoComplete';

export default function SignOutModal(props) {
    const initialRef = React.useRef(null);
    const finalRef = React.useRef(null);

    const name = useRef('');
    const [reason, setReason] = useState('bathroom');

    const [errorText, setErrorText] = useState('');
    const [isError, setIsError] = useState(false);

    // const handleInputChange = (e) => {
    //     const regex = /^[a-zA-Z\s.,'`-]+$/; // only allow letters, comma, single quote, backtick, period, and hyphen
    //     if (regex.test(e.target.value) || !e.target.value) {
    //         setName(e.target.value);
    //     }
    // }

    const onClose = () => {
        props.onClose();
        name.current = '';
        setErrorText('');
        setIsError(false);
        setReason('bathroom')
    }

    const onSubmit = (e) => {
        e.preventDefault();

        fetch(`${config.API_URL}/transactions/sign-out`, {
            method: 'POST',
            // We convert the React state to JSON and send it as the POST body
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                teacherId: props.user.googleId,
                name: name.current,
                reason: reason
            })
        }).then(response => {
            if (response.status === 200) {
                onClose();
            } else if (response.status === 400) {
                setErrorText(response.statusText);
                setIsError(true);
            } else {
                setErrorText('Error occurred');
                setIsError(true);
            }
        }).catch(err => {
            console.error(err);
            setErrorText('Network error occurred');
            setIsError(true);
        });
    };

    return (
        <>
            <Modal initialFocusRef={initialRef} finalFocusRef={finalRef} size="xl" isOpen={props.isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent mt={8}>
                    <form onSubmit={onSubmit}>
                        <ModalHeader>Sign Out</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody pb={2}>
                            <FormControl isRequired>
                                <FormLabel>Name</FormLabel>
                                <AutoComplete suggestions={props.studentNames} name={name} initialRef={initialRef} placeholder='Name'></AutoComplete>
                            </FormControl>

                            <FormControl mt={4}>
                                <FormLabel>Reason</FormLabel>
                                <ButtonGroup size={['sm', 'lg']} display='flex' justifyContent='center' variant='outline' spacing={['1', '4']}>
                                    <Button onClick={() => setReason('bathroom')} leftIcon={<FaToilet />} border='2px' colorScheme={reason === 'bathroom' ? 'orange' : 'gray'}>Bathroom</Button>
                                    <Button onClick={() => setReason('water')} leftIcon={<IoIosWater />} border='2px' colorScheme={reason === 'water' ? 'blue' : 'gray'}>Water</Button>
                                    <Button onClick={() => setReason('nurse')} leftIcon={<MdLocalHospital />} border='2px' colorScheme={reason === 'red' ? 'orange' : 'gray'}>Nurse</Button>
                                    <Button onClick={() => setReason('other')} leftIcon={<FaQuestion />} border='2px' colorScheme={reason === 'other' ? 'purple' : 'gray'}>Other</Button>
                                </ButtonGroup>
                            </FormControl>
                        </ModalBody>

                        <ModalFooter>
                            <FormControl isInvalid={isError}>
                                <FormErrorMessage>{errorText}</FormErrorMessage>
                            </FormControl>
                            <Button type='submit' width='25%' colorScheme='blue' mr={3}>
                                Sign Out
                            </Button>
                        </ModalFooter>
                    </form>
                </ModalContent>
            </Modal>

        </>
    );
}