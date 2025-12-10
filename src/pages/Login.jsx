// src/pages/Login.jsx

import React, { useState, useEffect } from 'react';
import { auth } from '../firebase';
import { 
    // Email/Password Imports
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword,
    // Google Imports
    GoogleAuthProvider, 
    signInWithPopup,
    // Phone Imports
    RecaptchaVerifier, 
    signInWithPhoneNumber 
} from 'firebase/auth';

// Global variables for Phone Sign-in
let recaptchaVerifier = null;
let confirmationResult = null;

export default function Login({ setUser }) {
    const [activeTab, setActiveTab] = useState('email'); // 'email', 'phone', or 'google' (implicit)
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [error, setError] = useState('');
    const [isCodeSent, setIsCodeSent] = useState(false);

    // --- 1. RECAPTCHA SETUP (FIXED LOGIC) ---
    // Initialize reCAPTCHA only when the phone tab is active and the element is ready.
    useEffect(() => {
        if (activeTab === 'phone' && !recaptchaVerifier) {
            const container = document.getElementById('recaptcha-container');

            if (container) {
                recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
                    'size': 'invisible',
                    'callback': (response) => { /* reCAPTCHA solved */ },
                    'expired-callback': () => { setError('reCAPTCHA expired. Please try again.'); }
                });
                
                recaptchaVerifier.render(); 
            }
        }
    }, [activeTab]); 

    // --- 2. EMAIL/PASSWORD HANDLERS ---
    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            setUser(userCredential.user);
        } catch (err) {
            setError('Login Failed: ' + err.message);
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            setUser(userCredential.user);
        } catch (err) {
            setError('Registration Failed: ' + err.message);
        }
    };

    // --- 3. GOOGLE SIGN-IN HANDLER ---
    const handleGoogleSignIn = async () => {
        setError('');
        try {
            const provider = new GoogleAuthProvider();
            const userCredential = await signInWithPopup(auth, provider);
            setUser(userCredential.user);
        } catch (err) {
            setError('Google Sign-in Failed: ' + err.message);
        }
    };

    // --- 4. PHONE SIGN-IN HANDLERS ---
    const handleSendCode = async (e) => {
        e.preventDefault();
        setError('');
        setIsCodeSent(false);

        if (!phoneNumber.startsWith('+') || phoneNumber.length < 10) {
            setError('Please enter a valid phone number including country code (e.g., +14085551234).');
            return;
        }

        try {
            if (!recaptchaVerifier) {
                 setError('reCAPTCHA is not initialized. Please refresh the page and try again.');
                 return;
            }

            confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
            setIsCodeSent(true);
            setError('Verification code sent successfully!');
        } catch (err) {
            setError('Failed to send code: ' + err.message);
        }
    };

    const handleVerifyCode = async (e) => {
        e.preventDefault();
        setError('');
        if (!confirmationResult) {
            setError('Please send the verification code first.');
            return;
        }
        try {
            const userCredential = await confirmationResult.confirm(verificationCode);
            setUser(userCredential.user);
        } catch (err) {
            setError('Verification failed. Invalid code or code expired. ' + err.message);
        }
    };


    // --- RENDER FUNCTION ---
    return (
        <div className="login-container">
            <h2>Welcome to the Tracker</h2>
            <p>Please log in or register to save your data.</p>

            {/* TAB SELECTION */}
            <div className="auth-tab-bar">
                <button 
                    className={`auth-tab-button ${activeTab === 'email' ? 'active' : ''}`}
                    onClick={() => setActiveTab('email')}
                >
                    Email
                </button>
                <button 
                    className={`auth-tab-button ${activeTab === 'phone' ? 'active' : ''}`}
                    onClick={() => setActiveTab('phone')}
                >
                    Phone
                </button>
                <button 
                    className={`auth-tab-button ${activeTab === 'google' ? 'active' : ''}`}
                    onClick={() => setActiveTab('google')}
                >
                    Google
                </button>
            </div>

            {/* ERROR DISPLAY */}
            {error && <p className="error-message">{error}</p>}
            
            {/* GOOGLE SIGN-IN BUTTON (Appears under its tab) */}
            {activeTab === 'google' && (
                <div className="login-actions full-width">
                    <button type="button" onClick={handleGoogleSignIn} className="google-button">
                        Sign in with Google
                    </button>
                </div>
            )}

            {/* EMAIL/PASSWORD FORM */}
            {activeTab === 'email' && (
                <form className="login-form">
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <div className="login-actions">
                        <button type="submit" onClick={handleLogin}>Log In</button>
                        <button type="button" onClick={handleRegister} className="register-button">Register</button>
                    </div>
                </form>
            )}

            {/* PHONE SIGN-IN FORM */}
            {activeTab === 'phone' && (
                <form className="login-form">
                    {!isCodeSent ? (
                        <>
                            <input
                                type="tel"
                                placeholder="Phone (e.g., +15551234567)"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                required
                            />
                            <div className="login-actions full-width">
                                <button type="submit" onClick={handleSendCode}>Send Verification Code</button>
                            </div>
                        </>
                    ) : (
                        <>
                            <p className="code-sent-message">Code sent to {phoneNumber}. Enter it below:</p>
                            <input
                                type="text"
                                placeholder="6-digit Verification Code"
                                value={verificationCode}
                                onChange={(e) => setVerificationCode(e.target.value)}
                                required
                            />
                            <div className="login-actions full-width">
                                <button type="submit" onClick={handleVerifyCode}>Verify and Log In</button>
                            </div>
                            <button type="button" onClick={() => setIsCodeSent(false)} className="resend-button">Use a different number</button>
                        </>
                    )}
                    {/* This div must be present for reCAPTCHA to work */}
                    <div id="recaptcha-container"></div>
                </form>
            )}
        </div>
    );
}