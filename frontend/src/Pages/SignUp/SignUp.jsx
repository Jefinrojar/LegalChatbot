import React, { useState } from 'react';
import axios from 'axios'; // Import axios
import SignUpImg from '../../assets/images/signup-img.png';
import { useNavigate,Link } from 'react-router-dom';
const SignUp = () => {
  // State to store form values
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const navigate = useNavigate();
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form fields before sending request
    if (!userName || !email || !password || !confirmPassword) {
      setError('All fields are required.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    // Send POST request to backend API using axios
    try {
      const response = await axios.post('http://localhost:5000/signup', {
        user_name: userName,
        email: email,
        password: password,
        confirm_password: confirmPassword,
      });

      setSuccess('User created successfully!');
      setError('');
      navigate('/');

    } catch (error) {
      // Handle errors from the API response
      if (error.response && error.response.data) {
        setError(error.response.data.error || 'Something went wrong.');
      } else {
        setError('Failed to connect to the server.');
      }
    }
  };


  return (
    <div className="flex h-screen font-outfit">
      {/* Left Section - Image */}
      <div className="w-2/5 bg-blue-500 md:flex justify-center items-center hidden">
        <img
          src={SignUpImg}
          alt="Robot holding a phone"
          className="w-full h-full"
        />
      </div>
      {/* Right Section - Form */}
      <div className="md:w-1/2 w-full bg-white flex flex-col justify-center items-center">
        <h1 className="md:text-5xl text-3xl mb-6">Sign Up</h1>

        <form className="space-y-4 md:w-3/4 w-full" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
            <input
              type="text"
              id="username"
              className="w-full p-3 border rounded mt-1 focus:ring-2 focus:ring-primary focus:outline-none"
              placeholder="Enter your username"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              className="w-full p-3 border rounded mt-1 focus:ring-2 focus:ring-primary focus:outline-none"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
            />
          </div>
          <div>
            <label htmlFor="confirm_password" className="block text-sm font-medium text-gray-700">Confirm Password</label>
            <input
              type="password"
              id="confirm_password"
              className="w-full p-3 border rounded mt-1 focus:ring-2 focus:ring-primary focus:outline-none"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          {/* Error or Success message */}
          {error && <p className="text-red-500 text-sm">{error}</p>}
          {success && <p className="text-green-500 text-sm">{success}</p>}

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="remember"
                className="h-4 w-4 text-blue-600 border-gray-300 rounded"
              />
              <label htmlFor="remember" className="ml-2 block text-sm text-gray-900">Remember me</label>
            </div>

            <div className="text-sm">
              <a href="#" className="text-[#00357B] hover:text-blue-500">Forgot Password?</a>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-[#00357B] text-white p-3 rounded-lg"
          >
            Sign Up
          </button>
        </form>

        <p className="mt-4 text-sm text-center text-gray-600">
          Already have an account?<Link to='/' className="text-[#00357B]">Sign In</Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
