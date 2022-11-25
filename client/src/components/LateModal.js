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
import React, { useEffect, useRef, useState } from 'react';
import { config } from 'util/constants';
// @ts-ignore
import { ReactSearchAutocomplete } from 'react-search-autocomplete'

export default function LateModal(props) {
    const finalRef = React.useRef(null);

    const name = useRef('');
    const items = useRef([]);

    const [errorText, setErrorText] = useState('');
    const [isError, setIsError] = useState(false);

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
    
    const handleOnSearch = (string) => {
        name.current = string;
    }

    const handleOnSelect = (item) => {
        name.current = item.name;
    }

    useEffect(() => {
        items.current = props.studentNames.map((str, index) => ({id: index + 1, name: str}));
    }, [props.studentNames]);

    return (
        <>
            <Modal finalFocusRef={finalRef} size="xl" isOpen={props.isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent mt={8}>
                    <form onSubmit={onSubmit}>
                        <ModalHeader>Late Log</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody pb={2}>
                            <FormControl isRequired>
                                <FormLabel>Name</FormLabel>
                                <ReactSearchAutocomplete
                                    items={items.current}
                                    onSearch={handleOnSearch}
                                    onSelect={handleOnSelect}
                                    showIcon={false}
                                    maxResults={5}
                                    fuseOptions={{threshold: 0.1}}
                                    styling={{borderRadius: '12px', zIndex: '1', fontFamily: 'Segoe UI'}}
                                    autoFocus
                                    placeholder='Name'
                                />
                            </FormControl>
                        </ModalBody>

                        <ModalFooter marginTop={'2em'}>
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