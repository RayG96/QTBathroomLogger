import { Box, Button, Image, VStack } from '@chakra-ui/react';
import React from 'react';
import { config } from 'util/constants';
import shallNotPass from 'images/You_Shall_Not_Pass.jpg';

export default function FailedLoginPage() {
    return (
        <VStack>
            <Box textAlign={'center'} fontSize={'25px'} fontWeight={'medium'} margin={'0 auto'} width={{ base: '85%', md: '66%', lg: '50%' }}>
                Teachers Only
                <Image src={shallNotPass} alt='You shall not pass!' />
            </Box>
        </VStack>
    );
}