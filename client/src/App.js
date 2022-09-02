import { React, useContext } from 'react';
import { ChakraProvider, theme } from '@chakra-ui/react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Card from './components/Card';

function App() {
    return (
        <ChakraProvider theme={theme}>
            <Router>
                <Navbar />
                    <Card />
                    <Card />
                    <Card />
                    <Card />
                    <Card />
                    <Card />
                <Routes>
                </Routes>
            </Router>
        </ChakraProvider>
    );
}

export default App;
