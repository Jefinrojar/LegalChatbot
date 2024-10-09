import React from 'react'
import LoginImg from '../../assets/images/login-img.png'

const Login = () => {
    
  return (
    <div className="flex h-screen font-outfit">
      {/* Left Section - Form */}
      <div className="md:w-3/5  w-full bg-white flex flex-col justify-center items-center p-10">
        <h1 className="md:text-5xl text-3xl  mb-6">Welcome to Copsify</h1>

        <form className="space-y-4 md:w-3/4 w-full">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
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
              type="password"
              id="password"
              className="w-full p-3 border rounded mt-1 focus:ring-2 focus:ring-primary focus:outline-none"
              placeholder="Enter your password"
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

      {/* Right Section - Image */}
      <div className="md:block hidden w-1/2 bg-blue-500 flex justify-center items-center">
        <img
          src={LoginImg}
          alt="Robot holding a phone"
          className="w-full h-full"
        />
      </div>
    </div>
  )
}

export default Login
