/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: 'class', // enable class-based dark mode
    content: [
        "./src/**/*.{js,jsx,ts,tsx}", // scan all React source files
    ],
    theme: {
        extend: {
            keyframes: {
                'bounce-slow': {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-5%)' },
                },
            },
            animation: {
                'bounce-slow': 'bounce-slow 2s infinite',
            },
        },
    },
    plugins: [],
};
