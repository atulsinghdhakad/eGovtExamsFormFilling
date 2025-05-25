import React from "react";

const RegisterPage = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
            <div className="bg-white dark:bg-gray-800 p-8 rounded shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800 dark:text-gray-200">Register</h2>
                <form className="space-y-4">
                    <input type="text" placeholder="Full Name" className="w-full px-4 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                    <input type="email" placeholder="Email" className="w-full px-4 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                    <input type="password" placeholder="Password" className="w-full px-4 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                    <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Sign Up</button>
                </form>
            </div>
        </div>
    );
};

export default RegisterPage;
