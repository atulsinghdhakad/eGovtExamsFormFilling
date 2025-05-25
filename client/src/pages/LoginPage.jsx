import React, { useState } from 'react';
import {
    signInWithEmailAndPassword,
    signInWithPopup,
    sendPasswordResetEmail,
    signInWithPhoneNumber,
    RecaptchaVerifier,
} from 'firebase/auth';
import { auth, googleProvider, facebookProvider } from '../firebase';
import { useNavigate, Link } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import { FaFacebook } from 'react-icons/fa';
import { useLocation } from 'react-router-dom';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [otp, setOtp] = useState('');
    const [message, setMessage] = useState('');
    const [isOtpSent, setIsOtpSent] = useState(false);
    const [isPhoneLogin, setIsPhoneLogin] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || '/';



    const handleLogin = async () => {
        try {
            navigate(from, { replace: true });
            // navigate('/');
            navigate(from, { replace: true }); // ✅ go back to intended page
        } catch (error) {
            setMessage(error.message);
        }
    };


    const handleGoogleLogin = async () => {
        try {
            await signInWithPopup(auth, googleProvider);
            navigate('/');
        } catch (error) {
            setMessage('Google login failed');
        }
    };

    const handleFacebookLogin = async () => {
        try {
            await signInWithPopup(auth, facebookProvider);
            navigate('/');
        } catch (error) {
            setMessage('Facebook login failed');
        }
    };

    const handleForgotPassword = async () => {
        try {
            await sendPasswordResetEmail(auth, email);
            setMessage('Password reset email sent.');
        } catch (error) {
            setMessage('Reset email failed.');
        }
    };

    const handlePhoneLogin = async () => {
        try {
            window.recaptchaVerifier = new RecaptchaVerifier('recaptcha-container', {
                size: 'invisible',
                callback: () => console.log('reCAPTCHA verified'),
            }, auth);

            const appVerifier = window.recaptchaVerifier;
            const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
            window.confirmationResult = confirmationResult;
            setIsOtpSent(true);
        } catch (error) {
            setMessage(`Failed to send OTP: ${error.message}`);
        }
    };

    const handleVerifyOtp = async () => {
        try {
            await window.confirmationResult.confirm(otp);
            navigate('/');
        } catch (error) {
            setMessage(`OTP verification failed: ${error.message}`);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4">
            <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6 w-full max-w-md">
                <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-6">Login</h2>
                {message && <p className="text-red-500 text-center mb-4">{message}</p>}

                {!isOtpSent && !isPhoneLogin ? (
                    <>
                        <input
                            type="email"
                            className="w-full p-3 border border-gray-300 rounded-md mb-4 dark:bg-gray-700 dark:text-white"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <input
                            type="password"
                            className="w-full p-3 border border-gray-300 rounded-md mb-4 dark:bg-gray-700 dark:text-white"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <button
                            onClick={handleLogin}
                            className="w-full bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700 transition mb-3"
                        >
                            Login
                        </button>

                        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300 mb-4">
                            <button onClick={handleForgotPassword} className="hover:underline">Forgot password?</button>
                        </div>

                        <div className="text-center text-gray-500 dark:text-gray-300 mb-3">OR</div>

                        <button
                            onClick={handleGoogleLogin}
                            className="flex items-center justify-center w-full bg-white dark:bg-gray-700 border p-3 rounded-md shadow hover:bg-gray-100 dark:hover:bg-gray-600 transition mb-3"
                        >
                            <FcGoogle className="text-2xl mr-2" />
                            Continue with Google
                        </button>

                        <button
                            onClick={handleFacebookLogin}
                            className="flex items-center justify-center w-full bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700 transition mb-3"
                        >
                            <FaFacebook className="text-2xl mr-2" />
                            Continue with Facebook
                        </button>

                        <button
                            onClick={() => setIsPhoneLogin(true)}
                            className="w-full bg-green-600 text-white p-3 rounded-md hover:bg-green-700 transition"
                        >
                            Login with Phone
                        </button>
                    </>
                ) : isPhoneLogin && !isOtpSent ? (
                    <>
                        <input
                            type="tel"
                            className="w-full p-3 border border-gray-300 rounded-md mb-4 dark:bg-gray-700 dark:text-white"
                            placeholder="+91XXXXXXXXXX"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                        />
                        <button
                            onClick={handlePhoneLogin}
                            className="w-full bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700 transition mb-4"
                        >
                            Send OTP
                        </button>
                        <button
                            onClick={() => setIsPhoneLogin(false)}
                            className="w-full bg-gray-500 text-white p-3 rounded-md hover:bg-gray-600 transition"
                        >
                            Back to Email Login
                        </button>
                    </>
                ) : (
                    <>
                        <input
                            type="text"
                            className="w-full p-3 border border-gray-300 rounded-md mb-4 dark:bg-gray-700 dark:text-white"
                            placeholder="Enter OTP"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                        />
                        <button
                            onClick={handleVerifyOtp}
                            className="w-full bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700 transition"
                        >
                            Verify OTP
                        </button>
                    </>
                )}

                <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-300">
                    Don’t have an account?{' '}
                    <Link to="/register" className="text-blue-500 hover:underline">Sign up</Link>
                </p>
            </div>

            <div id="recaptcha-container"></div>
        </div>
    );
};

export default LoginPage;
