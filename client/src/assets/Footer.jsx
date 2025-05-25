import React from "react";

const Footer = () => {
    return (
        <footer className="bg-gray-100 dark:bg-gray-800 text-center text-sm text-gray-600 dark:text-gray-300 py-4">
            © {new Date().getFullYear()} eGovtExamFilling. All rights reserved.
        </footer>
    );
};

export default Footer;
