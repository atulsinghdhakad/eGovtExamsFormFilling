import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import WidgetCard from './components/WidgetCard';
import LoginPage from './pages/LoginPage'; // create this file
import ProfilePage from './pages/ProfilePage';
import RegisterPage from './pages/RegisterPage';

function Dashboard({ activePage, setActivePage }) {
    return (
        <div className="flex">
            <Sidebar activePage={activePage} onChangePage={setActivePage} />
            <main className="flex-1 p-6">
                {activePage === 'dashboard' && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <WidgetCard title="Forms Filled" count={12} />
                        <WidgetCard title="Pending Actions" count={3} color="text-yellow-500" />
                        <WidgetCard title="Notifications" count={5} color="text-red-500" />
                    </div>
                )}
                {activePage === 'forms' && <div>Forms page content here</div>}
                {activePage === 'notifications' && <div>Notifications page content here</div>}
                {activePage === 'settings' && <div>Settings page content here</div>}
            </main>
        </div>
    );
}

function App() {
    const [activePage, setActivePage] = useState('dashboard');

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white">
            <Header />
            <Routes>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route
                    path="/dashboard"
                    element={<Dashboard activePage={activePage} setActivePage={setActivePage} />}
                />
                <Route path="/login" element={<LoginPage />} />
                {/* Add more routes as needed */}
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/register" element={<RegisterPage />} />
                {/* <Route path="/forgot-password" element={<ForgotPasswordPage />} /> */}
                {/* <Route path="/dashboard/forms" element={<FormsPage />} /> */}
                {/* <Route path="/dashboard/notifications" element={<NotificationsPage />} /> */}
                {/* <Route path="/dashboard/settings" element={<SettingsPage />} /> */}
                <Route path="*" element={<Navigate to="/dashboard" replace />} />


            </Routes>
        </div>
    );
}

export default App;
