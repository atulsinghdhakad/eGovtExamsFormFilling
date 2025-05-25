import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from './App';                // Your main app with sidebar/dashboard
import LoginPage from './components/LoginPage'; // You need to create this

const Root = () => {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/*" element={<App />} />
            </Routes>
        </Router>
    );
};

export default Root;
 