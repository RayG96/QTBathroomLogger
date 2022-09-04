import React, { useContext } from 'react';
import { AuthContext } from 'context/auth';
import { Box, Button, Center } from '@chakra-ui/react';
import Card from 'components/Card';

export default function HomePage() {
    const { user } = useContext(AuthContext);
    return (
        <Box>
            {user === 'NoUser' || user === null ? (
                <Center>
                    <a style={{ marginTop: '100px' }} href={`http://localhost:5000/auth/google`}>
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
        </Box>

    );
}
