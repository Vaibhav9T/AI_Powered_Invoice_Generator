import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, FileText } from 'lucide-react';

const Login = () => {
  // State for form fields and password visibility
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add your login logic here (e.g., call your AuthContext login function)
    console.log('Login attempt with:', { email, password });
  };

  return (
    // Main container: Light gray background, centered content
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* The Login Card: White background, shadow, rounded corners */}
        <div className="bg-white py-8 px-4 shadow sm:rounded-xl sm:px-10 border border-gray-100">
          
          {/* Header Section: Icon and Title */}
          <div className="sm:mx-auto sm:w-full sm:max-w-md mb-6 text-center">
            {/* Icon Container */}
            <div className="mx-auto h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <FileText className="h-6 w-6 text-blue-900" />
            </div>
            <h2 className="text-center text-2xl font-extrabold text-gray-900 leading-9">
              Log in to your account
            </h2>
          </div>

          {/* Login Form */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            
            {/* Email Address Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  // Input style: Light gray background, navy focus ring
                  className="block w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent sm:text-sm"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <input
                  id="password"
                  name="password"
                  // Toggle input type based on showPassword state
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent sm:text-sm pr-10"
                  placeholder="Enter your password"
                />
                {/* Show/Hide Password Button */}
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" aria-hidden="true" />
                  ) : (
                    <Eye className="h-5 w-5" aria-hidden="true" />
                  )}
                </button>
              </div>
            </div>

            {/* Forgot Password Link */}
            <div className="flex items-center justify-end">
              <div className="text-sm leading-5">
                <Link
                  to="/forgot-password"
                  className="font-medium text-blue-900 hover:text-blue-700 transition duration-150 ease-in-out"
                >
                  Forgot password?
                </Link>
              </div>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                // Button style: Full width, navy blue background
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-blue-900 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-900 transition duration-150 ease-in-out"
              >
                Log In
              </button>
            </div>
          </form>

          {/* Sign Up Link Footer */}
          <div className="mt-6">
            <div className="relative">
              <div className="relative flex justify-center text-sm leading-5">
                <span className="px-2 text-gray-600 font-medium">
                  Don't have an account?{' '}
                  <Link
                    to="/signup"
                    className="font-bold text-blue-900 hover:text-blue-700 transition duration-150 ease-in-out"
                  >
                    Sign Up
                  </Link>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;