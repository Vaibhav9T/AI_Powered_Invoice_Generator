import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, FileText, CheckCircle, ArrowLeft } from 'lucide-react';

const Signup = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validation Logic
  const validate = () => {
    let tempErrors = {};
    
    // Name Validation
    if (!formData.fullName.trim()) {
      tempErrors.fullName = "Full name is required";
    }

    // Email Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      tempErrors.email = "Email address is required";
    } else if (!emailRegex.test(formData.email)) {
      tempErrors.email = "Please enter a valid email address";
    }

    // Password Validation
    if (!formData.password) {
      tempErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      tempErrors.password = "Password must be at least 6 characters";
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (validate()) {
      // Simulation of API call
      console.log('Form Submitted Successfully:', formData);
      // Here you would typically call your register API
      setTimeout(() => {
        alert("Account created successfully!");
        setIsSubmitting(false);
      }, 1000);
    } else {
      setIsSubmitting(false);
    }
  };

  return (
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

      {/* Top Logo Icon */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-6">
        <div className="mx-auto h-12 w-12 bg-blue-900 rounded-lg flex items-center justify-center mb-4 shadow-lg shadow-blue-900/20">
          <FileText className="h-6 w-6 text-white" />
        </div>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-xl sm:px-10 border border-gray-100">
          
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-extrabold text-slate-900">
              Create Your Account
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Generate invoices in seconds. Free to start.
            </p>
          </div>

          {/* Social Sign Up Section */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-slate-700 hover:bg-gray-50 transition-colors">
              <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Google
            </button>
            <button className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-slate-700 hover:bg-gray-50 transition-colors">
              <svg className="h-5 w-5 mr-2" viewBox="0 0 23 23">
                <path fill="#f3f3f3" d="M0 0h23v23H0z"/>
                <path fill="#f35325" d="M1 1h10v10H1z"/>
                <path fill="#81bc06" d="M12 1h10v10H12z"/>
                <path fill="#05a6f0" d="M1 12h10v10H1z"/>
                <path fill="#ffba08" d="M12 12h10v10H12z"/>
              </svg>
              Microsoft
            </button>
          </div>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-slate-400 uppercase">Or</span>
            </div>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit} noValidate>
            
            {/* Full Name Field */}
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-slate-700 mb-1">
                Full Name
              </label>
              <div className="relative">
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={handleChange}
                  className={`appearance-none block w-full px-3 py-2.5 border ${
                    errors.fullName ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-900'
                  } rounded-lg bg-gray-50 placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent sm:text-sm transition-all`}
                  placeholder="Enter your full name"
                />
              </div>
              {errors.fullName && <p className="mt-1 text-xs text-red-600">{errors.fullName}</p>}
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
                Work Email
              </label>
              <div className="relative">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className={`appearance-none block w-full px-3 py-2.5 border ${
                    errors.email ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-900'
                  } rounded-lg bg-gray-50 placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent sm:text-sm transition-all`}
                  placeholder="you@company.com"
                />
              </div>
              {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">
                Password
              </label>
              <div className="relative rounded-md shadow-sm">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className={`appearance-none block w-full px-3 py-2.5 border ${
                    errors.password ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-900'
                  } rounded-lg bg-gray-50 placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent sm:text-sm pr-10 transition-all`}
                  placeholder="Enter your password"
                />
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
              {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password}</p>}
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-blue-900 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-900 disabled:opacity-70 disabled:cursor-not-allowed transition duration-150 ease-in-out"
              >
                {isSubmitting ? 'Creating Account...' : 'Create Free Account'}
              </button>
            </div>
          </form>

          {/* Footer Terms */}
          <div className="mt-6 text-center">
            <p className="text-xs text-slate-500">
              By creating an account, you agree to our{' '}
              <a href="#" className="font-medium text-blue-900 hover:underline">Terms of Service</a>
              {' '}and{' '}
              <a href="#" className="font-medium text-blue-900 hover:underline">Privacy Policy</a>.
            </p>
          </div>
          
          <div className="mt-6 border-t border-gray-100 pt-6">
            <div className="flex items-center justify-center text-sm">
              <span className="text-slate-600">Already have an account?</span>
              <Link to="/login" className="ml-2 font-bold text-blue-900 hover:text-blue-800">
                Log in
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Signup;