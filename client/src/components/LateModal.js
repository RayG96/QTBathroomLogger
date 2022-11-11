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
    FormErrorMessage,
} from '@chakra-ui/react';
import React, { useRef, useState } from 'react';
import { config } from 'util/constants';
import AutoComplete from './AutoComplete';

export default function LateModal(props) {
    const initialRef = React.useRef(null);
    const finalRef = React.useRef(null);

    const name = useRef('');

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
    }

    const onSubmit = (e) => {
        e.preventDefault();

        fetch(`${config.API_URL}/transactions/late-log`, {
            method: 'POST',
            // We convert the React state to JSON and send it as the POST body
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                teacherId: props.user.googleId,
                name: name.current
            })
        }).then(response => {
            if (response.status === 200) {
                onClose();
            } else if (response.status === 400) {
                setIsError(true);
            } else {
                setErrorText('Error occurred');
                setIsError(true);
            }
            return response.text();
        }).then(function(data) {
            if(data) setErrorText(data);
          })
          .catch(err => {
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
                        <ModalHeader>Late Log</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody pb={2}>
                            <FormControl isRequired>
                                <FormLabel>Name</FormLabel>
                                <AutoComplete suggestions={props.studentNames} name={name} initialRef={initialRef} placeholder='Name'></AutoComplete>
                            </FormControl>
                        </ModalBody>

                        <ModalFooter>
                            <FormControl isInvalid={isError}>
                                <FormErrorMessage>{errorText}</FormErrorMessage>
                            </FormControl>
                            <Button type='submit' width='25%' colorScheme='blue' mr={3}>
                                Log
                            </Button>
                        </ModalFooter>
                    </form>
                </ModalContent>
            </Modal>

        </>
    );
}