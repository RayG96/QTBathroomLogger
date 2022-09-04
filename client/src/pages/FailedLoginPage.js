import { Box, Button, VStack } from '@chakra-ui/react';
import React from 'react';

export default function FailedLoginPage() {
    return (
        <VStack>
            <Box textAlign={'center'} fontSize={'25px'} fontWeight={'medium'} margin={'0 auto'} width={{ base: '85%', md: '66%', lg: '50%' }}>
                Please sign in with a RoboTigers account
            </Box>
            <a style={{ marginTop: '25px' }} href={`http://localhost:5000/auth/google`}>
                <Button colorScheme='teal'>
                    Login with Google
                </Button>
            </a>
        </VStack>
    );
}