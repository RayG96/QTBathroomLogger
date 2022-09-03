import React, { useContext } from 'react';
import { ChakraProvider, theme } from '@chakra-ui/react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import NotFoundPage from 'pages/NotFoundPage';
import HomePage from 'pages/HomePage';
import RostersPage from 'pages/RostersPage';

function App() {
    return (
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
