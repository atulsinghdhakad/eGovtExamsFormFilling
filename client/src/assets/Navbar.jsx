import React from "react";

const Navbar = () => {
    return (
        <nav className="bg-white dark:bg-gray-900 shadow-md">
            <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
                <div className="text-xl font-bold text-blue-600">eGovtExamFilling</div>
                <div className="space-x-4 text-sm">
                    <a href="/" className="text-gray-700 dark:text-gray-200 hover:text-blue-600">Home</a>
                    <a href="/login" className="text-gray-700 dark:text-gray-200 hover:text-blue-600">Login</a>
                    <a href="/register" className="text-gray-700 dark:text-gray-200 hover:text-blue-600">Register</a>
                    <a href="/profile" className="text-gray-700 dark:text-gray-200 hover:text-blue-600">Profile</a>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
