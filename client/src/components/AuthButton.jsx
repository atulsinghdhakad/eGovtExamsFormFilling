// src/components/AuthButton.jsx
import React, { useState } from 'react';

const AuthButton = () => {
    const [loggedIn, setLoggedIn] = useState(false);

    return (
        <button
            onClick={() => setLoggedIn(!loggedIn)}
            className="ml-4 px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700"
        >
            {loggedIn ? 'Logout' : 'Login'}
        </button>
    );
};

export default AuthButton;
