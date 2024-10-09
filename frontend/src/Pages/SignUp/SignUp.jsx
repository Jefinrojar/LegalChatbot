import React from 'react'
import SignUpImg from '../../assets/images/signup-img.png'

const SignUp = () => {
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
  
          <form className="space-y-4 md:w-3/4 w-full">
          <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">username</label>
              <input
                type="username"
                id="username"
                className="w-full p-3 border rounded mt-1 focus:ring-2 focus:ring-primary focus:outline-none"
                placeholder="Enter your username"
              />
            </div>
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                id="email"
                className="w-full p-3 border rounded mt-1 focus:ring-2 focus:ring-primary focus:outline-none"
                placeholder="Enter your email"
              />
            </div>
  
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="email"
                id="email"
                className="w-full p-3 border rounded mt-1 focus:ring-2 focus:ring-primary focus:outline-none"
                placeholder="Enter your password"
              />
            </div>
  
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Confirm Password</label>
              <input
                type="password"
                id="password"
                className="w-full p-3 border rounded mt-1 focus:ring-2 focus:ring-primary focus:outline-none"
                placeholder="Confirm password"
              />
            </div>
  
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
                <a href="#" className="text-primary hover:text-blue-500">Forgot Password?</a>
              </div>
            </div>
  
            <button
              type="submit"
              className="w-full bg-primary text-white p-3 rounded-lg "
            >
              Sign In
            </button>
          </form>
  
          <p className="mt-4 text-sm text-center text-gray-600">
            Don’t have an account? <a href="#" className="text-primary">Sign Up</a>
          </p>
        </div>
      </div>
      );
    };

export default SignUp
