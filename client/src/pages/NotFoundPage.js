import { Box } from '@chakra-ui/react';
import React from 'react';

export default function NotFoundPage() {
    return (
        <Box textAlign={'center'} fontSize={'25px'} fontWeight={'medium'} paddingTop={20} margin={'0 auto'} width={{ base: '85%', md: '66%', lg: '50%' }}>
            Page Not Found
        </Box>
    );
}