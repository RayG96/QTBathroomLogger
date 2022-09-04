import React, { useContext } from 'react';
import { AuthContext } from 'context/auth';
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
    const { user } = useContext(AuthContext);
    console.log(user)
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
                    {user !== 'NoUser' && user !== null && <Button onClick={onOpen} colorScheme='orange' width='50%' size='lg'>Sign Out</Button> }
                    <SignOutModal isOpen={isOpen} onClose={onClose} />
                    <Flex alignItems={'center'}>
                        <Stack direction={'row'} spacing={7}>
                            {user === 'NoUser' || user === null ? null : (
                                <Menu>
                                    <MenuButton
                                        as={Button}
                                        rounded={'full'}
                                        variant={'link'}
                                        cursor={'pointer'}
                                        minW={0}>
                                        <Avatar
                                            showBorder={true}
                                            size={'md'}
                                            src={user.iconImage}
                                        />
                                    </MenuButton>
                                    <MenuList alignItems={'center'}>
                                        <br />
                                        <Center>
                                            <Avatar
                                                size={'xl'}
                                                src={user.iconImage}
                                            />
                                        </Center>
                                        <br />
                                        <Center>
                                            <p>{user.displayName}</p>
                                        </Center>
                                        <br />
                                        <MenuDivider />
                                        <MenuItem as={Link} to={'/rosters'}>Rosters</MenuItem>
                                        <a href={`http://localhost:5000/auth/logout`}><MenuItem>Logout</MenuItem></a>
                                    </MenuList>
                                </Menu>
                            )}
                        </Stack>
                    </Flex>
                </Flex>
            </Box>
        </>
    );
}