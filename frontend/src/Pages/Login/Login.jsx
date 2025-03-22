import React, { useState } from 'react';
import axios from 'axios';
import LoginImg from '../../assets/images/login-img.png';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
    const navigate = useNavigate();

    // State for form inputs and error/success messages
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email || !password) {
            setError('Please fill in all fields.');
            return;
        }

        try {
            setIsLoading(true); // Set loading to true when starting login request
            setError(''); // Clear previous errors
            
            const response = await axios.post('http://localhost:5000/login', {
                email: email,
                password: password
            });
            
            const token = response.data.token;
            const { user_id, username, email: userEmail } = response.data; // Assuming your backend returns username
            sessionStorage.setItem('user_id', user_id);
            sessionStorage.setItem('username', username); // Store username in sessionStorage
            sessionStorage.setItem('email', userEmail);
            sessionStorage.setItem('token', token);
            
            setSuccess('Login successful!');
            
            // Pass username as state to chatinterface
            navigate('/chatinterface', { state: { username } });

        } catch (error) {
            if (error.response && error.response.data) {
                setError(error.response.data.error || 'Login failed.');
            } else {
                setError('Failed to connect to the server.');
            }
        } finally {
            setIsLoading(false); // Set loading to false when request completes (success or error)
        }
    };

    return (
        <div className="flex h-screen font-outfit">
            {/* Left Section - Form */}
            <div className="md:w-3/5 w-full bg-white flex flex-col justify-center items-center p-10">
                <h1 className="md:text-5xl text-3xl mb-6 poppins-medium">Welcome to Copsify</h1>

                <form className="space-y-4 md:w-3/4 w-full poppins-regular" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            id="email"
                            className="w-full p-3 border rounded mt-1 focus:ring-2 focus:ring-primary focus:outline-none"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={isLoading}
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                        <input
                            type="password"
                            id="password"
                            className="w-full p-3 border rounded mt-1 focus:ring-2 focus:ring-primary focus:outline-none"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={isLoading}
                        />
                    </div>

                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    {success && <p className="text-green-500 text-sm">{success}</p>}

                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="remember"
                                className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                                disabled={isLoading}
                            />
                            <label htmlFor="remember" className="ml-2 block text-sm text-gray-900">Remember me</label>
                        </div>

                        <div className="text-sm">
                            <a href="#" className="text-[#00357B] hover:text-blue-500">Forgot Password?</a>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-[#00357B] text-white p-3 rounded-lg flex justify-center items-center"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Signing In...
                            </>
                        ) : (
                            'Sign In'
                        )}
                    </button>
                </form>

                <p className="mt-4 text-sm poppins-regular text-center text-gray-600">
                    Don't have an account? <Link to='/signup' className="text-[#00357B]">Sign Up</Link>
                </p>
            </div>

            {/* Right Section - Image */}
            <div className="md:flex hidden w-1/2 bg-blue-500 justify-center items-center">
                <img
                    src={LoginImg}
                    alt="Robot holding a phone"
                    className="w-full h-full"
                />
            </div>
        </div>
    );
};

export default Login;