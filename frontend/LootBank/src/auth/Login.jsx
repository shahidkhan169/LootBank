import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import { FaLock, FaUser, FaEye, FaEyeSlash } from 'react-icons/fa';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);
    const navigate = useNavigate(); // Use navigate hook

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3000/login', { email, password });
            const { token } = response.data;
    
            // Check if token is received
            if (token) {
                // Store token in localStorage
                localStorage.setItem('token', token);
                navigate('/profile'); // Redirect to /profile using navigate
            } else {
                throw new Error('Token not received');
            }
        } catch (err) {
            console.error('Login error:', err); // Log error for debugging
            setError(err.response?.data || 'An error occurred'); // Ensure this is the correct way to access the error message
        }
    };

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    return (
        <div className="bg-cyan-900 flex flex-col items-center justify-center h-screen">
            <div className="mb-8 text-center text-gray-800 font-bold text-4xl">Welcome back thief!!</div>
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm relative">
                <div className="flex justify-center items-center mb-2">
                    <AccountBalanceIcon fontSize="large" className="text-gray-800" /> {/* Large Icon */}
                </div>
                <h1 className="text-center text-3xl font-bold mb-6 text-gray-800">LootEntry</h1>
                <form onSubmit={handleLogin}>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                        <div className="relative">
                            <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="email"
                                id="email"
                                className="pl-10 w-full border border-gray-300 rounded-lg p-2"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <div className="mb-4">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                        <div className="relative">
                            <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type={passwordVisible ? 'text' : 'password'}
                                id="password"
                                className="pl-10 pr-10 w-full border border-gray-300 rounded-lg p-2"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            {passwordVisible ? (
                                <FaEyeSlash 
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
                                    onClick={togglePasswordVisibility}
                                />
                            ) : (
                                <FaEye 
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
                                    onClick={togglePasswordVisibility}
                                />
                            )}
                        </div>
                    </div>
                    {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                    <div className="flex justify-between items-center mb-6">
                        <a href="#" className="text-sm text-gray-800 hover:underline">Forgot password?</a>
                        <Link to="/register" className="text-sm text-gray-800 hover:underline">Don't have an account?</Link>
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-slate-500 text-white py-2 rounded-lg hover:bg-cyan-600"
                    >
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
