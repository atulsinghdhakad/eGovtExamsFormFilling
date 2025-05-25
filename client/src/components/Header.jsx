import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import DarkModeToggle from './DarkModeToggle';

const Header = () => {
    const [user, setUser] = useState(null);
    const [openDropdown, setOpenDropdown] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setOpenDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleLogout = async () => {
        await signOut(auth);
        navigate('/login');
    };

    const getInitial = (email) => {
        return email?.charAt(0)?.toUpperCase() || '?';
    };

    return (
        <header className="flex items-center justify-between px-6 py-4 bg-white dark:bg-gray-800 shadow-md">
            <Link to="/" className="flex items-center space-x-3">
                <img
                    src="/logo.jpg"
                    alt="eGovt Logo"
                    className="h-10 w-10 animate-bounce-slow"
                />
                <span className="text-xl font-bold text-gray-800 dark:text-white transition-colors duration-300">
                    eGovtExams<span className="text-blue-600 dark:text-blue-400">FormFilling</span>
                </span>
            </Link>

            <div className="flex items-center space-x-4 relative" ref={dropdownRef}>
                <DarkModeToggle />

                {user ? (
                    <div className="relative">
                        <button
                            onClick={() => setOpenDropdown(!openDropdown)}
                            className="focus:outline-none"
                        >
                            {user.photoURL ? (
                                <img
                                    src={user.photoURL}
                                    alt="User"
                                    className="w-10 h-10 rounded-full border-2 border-blue-500"
                                />
                            ) : (
                                <div className="w-10 h-10 bg-blue-600 text-white flex items-center justify-center rounded-full text-lg font-semibold">
                                    {getInitial(user.displayName || user.email)}
                                </div>
                            )}
                        </button>

                        {openDropdown && (
                            <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-700 shadow-lg rounded-lg p-4 z-50">
                                <p className="text-gray-800 dark:text-white font-semibold mb-1">
                                    Welcome, {user.displayName || user.email.split('@')[0]}
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-300 mb-3">
                                    {user.email}
                                </p>

                                <Link
                                    to="/profile"
                                    className="block text-center w-full mb-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition"
                                >
                                    My Profile
                                </Link>

                                <button
                                    onClick={handleLogout}
                                    className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg transition duration-300"
                                >
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <Link
                        to="/login"
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                    >
                        Login
                    </Link>
                )}
            </div>
        </header>
    );
};

export default Header;
