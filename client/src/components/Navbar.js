import React from 'react';
import {
    Box,
    Flex,
    Avatar,
    Image,
    Button,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    MenuDivider,
    useColorModeValue,
    Stack,
    Center,
    useDisclosure,
} from '@chakra-ui/react';
import logo from '../images/QT Logo 2021.png';
import SignOutModal from './SignOutModal';
import { Link, useLocation, useNavigate } from 'react-router-dom';

export default function Nav() {
    const { isOpen, onOpen, onClose } = useDisclosure();
    return (
        <>
            <Box position={'sticky'} zIndex={999} top={0} w={'100%'} className='navbar' bg={useColorModeValue('#3e3e3e', 'gray.900')} px={4}>
                <Flex h={20} alignItems={'center'} justifyContent={'space-between'}>
                    <Box h='75px'>
                        <Image
                            w={'46px'}
                            minW={'46px'}
                            src={logo}
                            _hover={{
                                cursor: 'pointer',
                            }}
                            position={'relative'}
                            top='50%'
                            transform='translateY(-50%)'
                            marginLeft={'15px'}
                        />
                    </Box>
                    <Button onClick={onOpen} colorScheme='orange' width='50%' size='lg'>Sign Out</Button>
                    <SignOutModal isOpen={isOpen} onClose={onClose}/>
                    <Flex alignItems={'center'}>
                        <Stack direction={'row'} spacing={7}>

                            <Menu>
                                <MenuButton
                                    as={Button}
                                    rounded={'full'}
                                    variant={'link'}
                                    cursor={'pointer'}
                                    minW={0}>
                                    <Avatar
                                        size={'md'}
                                        src={'https://avatars.dicebear.com/api/male/username.svg'}
                                    />
                                </MenuButton>
                                <MenuList alignItems={'center'}>
                                    <br />
                                    <Center>
                                        <Avatar
                                            size={'xl'}
                                            src={'https://avatars.dicebear.com/api/male/username.svg'}
                                        />
                                    </Center>
                                    <br />
                                    <Center>
                                        <p>Ms. Singh</p>
                                    </Center>
                                    <br />
                                    <MenuDivider />
                                    <MenuItem as={Link} to={'/rosters'}>Rosters</MenuItem>
                                    <MenuItem>Logout</MenuItem>
                                </MenuList>
                            </Menu>
                        </Stack>
                    </Flex>
                </Flex>
            </Box>
        </>
    );
}