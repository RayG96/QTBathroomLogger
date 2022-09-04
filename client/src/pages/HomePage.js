import React, { useContext } from 'react';
import { AuthContext } from 'context/auth';
import { Box, Button, Center } from '@chakra-ui/react';
import { config } from 'util/constants';
import Card from 'components/Card';

export default function HomePage() {
    const { user } = useContext(AuthContext);
    return (
        <>
            {user === 'NoUser' ? (
                <Center>
                    <a style={{ marginTop: '100px' }} href={`${config.API_URL}/auth/google`}>
                        <Button colorScheme='teal'>
                            Login with Google
                        </Button>
                    </a>
                </Center>
            ) : (
                <Box>
                    <Card />
                    <Card />
                </Box>
            )
            }
        </>
    );
}
