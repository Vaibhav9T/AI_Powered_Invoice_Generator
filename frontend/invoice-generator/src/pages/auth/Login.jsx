import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, FileText, ArrowLeft, Loader2, Mail, Lock, ArrowRight} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useState } from 'react';
import { API_PATHS } from '../../utils/apiPaths';
import axiosInstance from '../../utils/axiosInstance';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const[isLoading, setIsLoading] = useState(false);
  const[error, setError] = useState('');

  const [sucess, setSucess] = useState('');

  const [fieldErrors, setFieldErrors] = useState({
    email: '',
    password: '',
  });

  const [touched, setTouched] = useState({
    email: false,
    password: false,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Clear field-specific error when user starts typing
    setFieldErrors({ ...fieldErrors, [name]: '' });
    // Mark field as touched
    setTouched({ ...touched, [name]: true });

  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const emailError = validateEmail(formData.email);
    const passwordError = validatePassword(formData.password);

    if (emailError || passwordError) {
      setFieldErrors({
        email: emailError || fieldErrors.email,
        password: passwordError || fieldErrors.password,
      });
      setTouched({
        email: true,
        password: true,
      });
      return;
    }

    setIsLoading(true);
    setError('');
    setSucess('');

    try {
      const response = await axiosInstance.post(API_PATHS.AUTH_API.LOGIN, formData);
      const { token, user } = response.data;
      login(user, token);
      console.log('Login successful:', response.data);
      setSucess('Login successful! Redirecting...');
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
    };

  const validatePassword = (password) => {
    if (!password) return "Password is required";
    if (password.length < 6) return "Password must be at least 6 characters";
    return "";
    };
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return "Email is required";
    if (!emailRegex.test(email)) return "Please enter a valid email address";
    return "";

  };

  return (
    // Main container: Light gray background, centered content
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* --- ADDED: Back Arrow Button --- */}
            <div className="absolute top-6 left-6 md:top-8 md:left-8">
              <Link 
                to="/" 
                className="flex items-center gap-2 text-slate-500 hover:text-blue-900 transition-colors group"
              >
                <div className="p-2 bg-white border border-gray-200 rounded-full group-hover:border-blue-200 group-hover:bg-blue-50 transition-all">
                  <ArrowLeft size={20} className="text-slate-600 group-hover:text-blue-900" />
                </div>
                <span className="font-medium hidden sm:inline text-sm">Back to Home</span>
              </Link>
            </div>
            {/* -------------------------------- */}
            
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
                  value={formData.email}
                  onChange={handleInputChange}
                  // Input style: Light gray background, navy focus ring
                  className={`block w-full px-4 py-3 border ${fieldErrors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg bg-gray-50 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent sm:text-sm`}
                  placeholder="Enter your email"
                />
              </div>
              {fieldErrors.email && <p className="mt-1 text-xs text-red-600">{fieldErrors.email}</p>}
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
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`block w-full px-4 py-3 border ${fieldErrors.password ? 'border-red-500' : 'border-gray-300'} rounded-lg bg-gray-50 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent sm:text-sm pr-10`}
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
              {fieldErrors.password && <p className="mt-1 text-xs text-red-600">{fieldErrors.password}</p>}
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

            {error && <p className="text-sm text-red-600 text-center">{error}</p>}
            {sucess && <p className="text-sm text-green-600 text-center">{sucess}</p>}

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={isLoading}
                // Button style: Full width, navy blue background
                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-blue-900 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-900 transition duration-150 ease-in-out disabled:opacity-70"
              >
                {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Log In'}
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