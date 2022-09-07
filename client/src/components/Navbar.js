import React, { useContext, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
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
import { Link } from 'react-router-dom';
import { config } from 'util/constants';
import { StudentsContext } from 'context/students';

export default function Nav() {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { user } = useContext(AuthContext);
    const { students, getRosters } = useContext(StudentsContext);
    const location = useLocation();
    
    useEffect(() => {
        getRosters();
    }, []);
    // const getRosters = () => {
    //     fetch(`${config.API_URL}/rosters/getRosters/${user.googleId}`, {
    //         method: 'GET',
    //     }).then(response =>
    //         response.json()
    //     ).then(data => {
    //         data.forEach(e => {
    //             e.students.forEach(student => {
    //                 students.current.push(student['Student Name']);
    //             })
    //         })
    //     }).catch(err => {
    //         console.error(err);
    //     });
    // }

    // useEffect(() => {
    //     getRosters();
    // }, []);
    return (
        <>
            <Box position={'sticky'} zIndex={999} top={0} w={'100%'} className='navbar' bg={useColorModeValue('#3e3e3e', 'gray.900')} px={4}>
                <Flex h={20} alignItems={'center'} justifyContent={'space-between'}>
                    <Box h='75px' as={Link} to={'/'}>
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
                    {(user !== 'NoUser' && user.admin === true && location.pathname !== '/rosters') && <Button onClick={onOpen} colorScheme='orange' width='50%' size='lg'>Sign Out</Button>}
                    <SignOutModal studentNames={students.current} isOpen={isOpen} onClose={onClose} user={user} />
                    <Flex alignItems={'center'}>
                        <Stack direction={'row'} spacing={7}>
                            {user === 'NoUser' ? null : (
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
                                        <MenuItem as={Link} to={'/'}>Home</MenuItem>
                                        {user.admin === true && <MenuItem as={Link} to={'/rosters'}>Rosters</MenuItem>}
                                        <a href={`${config.API_URL}/auth/logout`}><MenuItem>Logout</MenuItem></a>
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