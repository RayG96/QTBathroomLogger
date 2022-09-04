import React, { useContext } from 'react';
import { ChakraProvider, theme } from '@chakra-ui/react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import NotFoundPage from 'pages/NotFoundPage';
import HomePage from 'pages/HomePage';
import RostersPage from 'pages/RostersPage';
import { AuthContext } from 'context/auth';
import FailedLoginPage from 'pages/FailedLoginPage';

function App() {
    const { user } = useContext(AuthContext);
    return user === null ? null : user === 'NoUser' ? (
        <ChakraProvider>
            <Router>
                <Navbar />
                <Routes>
                    <Route path='/' element={<HomePage />} />
                    <Route path='/failedLogin' element={<FailedLoginPage />} />
                    <Route path='*' element={<Navigate replace to='/' />} />
                </Routes>
            </Router>
        </ChakraProvider>
    ) : (
        <ChakraProvider theme={theme}>
            <Router>
                <Navbar />
                <Routes>
                    <Route path='/' element={<HomePage />} />
                    <Route path='/rosters' element={<RostersPage />} />
                    <Route path='*' element={<NotFoundPage />} />
                </Routes>
            </Router>
        </ChakraProvider>
    );
}

export default App;
