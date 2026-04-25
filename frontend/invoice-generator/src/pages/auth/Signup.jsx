import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, FileText, ArrowLeft, CheckCircle2, ShieldCheck } from 'lucide-react';
import { useState, useEffect } from 'react';
import { API_PATHS } from '../../utils/apiPaths';
import axiosInstance from '../../utils/axiosInstance';
import { validateEmail, validatePassword } from '../../utils/helper';
import toast from 'react-hot-toast';

const Signup = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    businessName: '',
    phone: '',
    address: '',
    taxId: '',
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState(''); // Fixed typo
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const navigate = useNavigate();

  const [fieldErrors, setFieldErrors] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    businessName: '',
    phone: '',
    address: '',
    taxId: '',
  });

  const [touched, setTouched] = useState({
    fullName: false,
    email: false,
    password: false,
    confirmPassword: false,
    businessName: false,
    phone: false,
    address: false,
    taxId: false,
  });

  // Validation functions
  const validateName = (name) => {
    if (!name.trim()) {
      return 'Name is required';
    }
    return '';
  };

  const validateConfirmPassword = (confirmPassword, password) => {
    if (!confirmPassword.trim()) {
      return 'Please confirm your password';
    }
    if (confirmPassword !== password) {
      return 'Passwords do not match';
    }
    return '';
  };

  const validateBusinessName = (name) => {
    if (!name.trim()) {
      return 'Business name is required';
    }
    return '';
  };

  const validatePhone = (phone) => {
    if (!phone.trim()) return 'Phone number is required';
    const phoneRegex = /^\+?[0-9\s\-()]{7,15}$/;
    if (!phoneRegex.test(phone)) return 'Please enter a valid phone number';
    return '';
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    setFormData(prev => {
      const newData = { ...prev, [name]: value };
      
      // Validate the specific field safely with the latest state snapshot
      let errorMsg = '';
      if (name === 'fullName') errorMsg = validateName(value);
      else if (name === 'email') errorMsg = validateEmail(value);
      else if (name === 'password') errorMsg = validatePassword(value);
      else if (name === 'confirmPassword') errorMsg = validateConfirmPassword(value, newData.password);
      else if (name === 'businessName') errorMsg = validateBusinessName(value);
      else if (name === 'phone') errorMsg = validatePhone(value);
      
      setFieldErrors(prevErrors => ({ ...prevErrors, [name]: errorMsg }));
      return newData;
    });

    setTouched(prev => ({ ...prev, [name]: true })); 
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    
    setFormData(prev => {
      const newData = { ...prev, [name]: value };
      
      let errorMsg = '';
      if (name === 'fullName') errorMsg = validateName(value);
      else if (name === 'email') errorMsg = validateEmail(value);
      else if (name === 'password') errorMsg = validatePassword(value);
      else if (name === 'confirmPassword') errorMsg = validateConfirmPassword(value, newData.password);
      else if (name === 'businessName') errorMsg = validateBusinessName(value);
      else if (name === 'phone') errorMsg = validatePhone(value);
      
      setFieldErrors(prevErrors => ({ ...prevErrors, [name]: errorMsg }));
      return newData;
    });
    
    setTouched(prev => ({ ...prev, [name]: true }));
  };

  const validate = () => {
    let tempErrors = {};
    
    if (!formData.fullName.trim()) {
      tempErrors.fullName = "Name is required";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      tempErrors.email = "Email address is required";
    } else if (!emailRegex.test(formData.email)) {
      tempErrors.email = "Please enter a valid email address";
    }

    if (!formData.businessName.trim()) {
      tempErrors.businessName = "Business name is required";
    }

    if (!formData.phone.trim()) {
      tempErrors.phone = "Phone number is required";
    } else if (!/^\+?[0-9\s\-()]{7,15}$/.test(formData.phone)) {
      tempErrors.phone = "Please enter a valid phone number";
    }

    if (!formData.password) {
      tempErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      tempErrors.password = "Password must be at least 6 characters";
    }

    if (!formData.confirmPassword) {
      tempErrors.confirmPassword = "Confirm password is required";
    } else if (formData.confirmPassword !== formData.password) {
      tempErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(tempErrors);
    setFieldErrors(tempErrors); // Ensure UI reflects the submit-time errors 
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    setSuccess('');

    // 🔥 THE FIX: Map frontend formData to match backend expectations exactly
    const payload = {
        name: formData.fullName, 
        email: formData.email,
        password: formData.password,
        businessName: formData.businessName,
        phone: formData.phone,
        address: formData.address,
        taxId: formData.taxId
    };
    
    // Debugging: Check your browser console when you click submit!
    console.log("Frontend payload being sent to backend:", payload);

    axiosInstance.post(API_PATHS.AUTH_API.REGISTER, payload)
      .then((response) => {
        setSuccess('Account created successfully! Redirecting to login...');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      })
      .catch((err) => {
        setError(err.response?.data?.message || 'Signup failed. Please try again.');
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  // Placeholder function for OAuth login buttons
  const handleOAuthLogin = (provider) => {
    toast.success(`${provider} business login will be implemented soon!`);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 transition-colors duration-300 flex lg:flex-row-reverse overflow-hidden relative">
      
      {/* =========================================
          RIGHT PANE - Brand/Marketing Showcase (due to flex-row-reverse)
      ========================================= */}
      <div className={`hidden lg:flex lg:w-[45%] bg-slate-50 dark:bg-slate-900 border-l border-gray-200 dark:border-slate-800 relative flex-col justify-center items-center transition-all duration-700 ease-out transform ${isMounted ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'}`}>
        {/* Decorative Background Elements */}
        {/* Back Link */}
        <div className="absolute top-6 left-6 md:top-8 md:left-8 z-10">
          <Link 
            to="/" 
            className="flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-blue-900 dark:hover:text-blue-400 transition-colors group"
          >
            <div className="p-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-full group-hover:border-blue-200 dark:group-hover:border-blue-900 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/30 transition-all shadow-sm">
              <ArrowLeft size={20} className="text-slate-600 dark:text-slate-300 group-hover:text-blue-900 dark:group-hover:text-blue-400" />
            </div>
            <span className="font-medium hidden sm:inline text-sm">Back to Home</span>
          </Link>
        </div>
        <div className="absolute inset-0 bg-blue-900/5 dark:bg-blue-900/20 mix-blend-multiply dark:mix-blend-screen pointer-events-none" />
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-teal-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-lg px-10 relative z-10 text-center">
          <div className="mx-auto h-20 w-20 bg-blue-900 dark:bg-blue-800 rounded-2xl flex items-center justify-center mb-8 shadow-xl transform hover:scale-105 transition-transform duration-300">
            <img src="/logo/logo-dark.png" alt="Ainvoy Logo" className="h-10 w-10" />
          </div>
          <h2 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-6 tracking-tight leading-tight transition-colors">
            Manage Your Invoices<br/><span className="text-blue-900 dark:text-blue-400">Like a Pro</span>
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 mb-10 leading-relaxed transition-colors">
            Join thousands of freelancers and businesses getting paid faster with our AI-powered invoice generator.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-left">
             <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 hover:shadow-md transition-all">
               <div className="bg-blue-50 dark:bg-blue-900/30 w-10 h-10 rounded-lg flex items-center justify-center mb-3 transition-colors">
                 <CheckCircle2 className="text-blue-600 dark:text-blue-400 h-5 w-5" />
               </div>
               <h3 className="font-bold text-slate-800 dark:text-white transition-colors">AI Powered</h3>
               <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 transition-colors">Generate invoices from simple text prompts instantly.</p>
             </div>
             <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 hover:shadow-md transition-all">
               <div className="bg-teal-50 dark:bg-teal-900/30 w-10 h-10 rounded-lg flex items-center justify-center mb-3 transition-colors">
                 <ShieldCheck className="text-teal-600 dark:text-teal-400 h-5 w-5" />
               </div>
               <h3 className="font-bold text-slate-800 dark:text-white transition-colors">Secure Data</h3>
               <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 transition-colors">Enterprise-grade security for your business info.</p>
             </div>
          </div>
        </div>
      </div>

      {/* =========================================
          LEFT PANE - Form
      ========================================= */}
      <div className={`flex-1 flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-12 xl:px-20 bg-white dark:bg-slate-900 relative overflow-y-auto h-screen transition-all duration-700 ease-out transform ${isMounted ? 'translate-x-0 opacity-100' : '-translate-x-8 opacity-0'}`}>
        
        
       

        <div className="mx-auto w-full max-w-[650px] mt-12 sm:mt-0">
          <div className="mb-8 text-center sm:text-left">
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight transition-colors">
              Create Your Account
            </h2>
            <p className="mt-2 text-base text-slate-500 dark:text-slate-400 transition-colors">
              Generate invoices in seconds. Free to start.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            <button 
              type="button"
              onClick={() => handleOAuthLogin('Google')}
              className="flex items-center justify-center px-4 py-2.5 border border-gray-300 dark:border-slate-600 rounded-lg shadow-sm bg-white dark:bg-slate-800 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
            >
              <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Continue with Google
            </button>
            <button 
              type="button"
              onClick={() => handleOAuthLogin('Microsoft')}
              className="flex items-center justify-center px-4 py-2.5 border border-gray-300 dark:border-slate-600 rounded-lg shadow-sm bg-white dark:bg-slate-800 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
            >
              <svg className="h-5 w-5 mr-2" viewBox="0 0 23 23">
                <path fill="#f3f3f3" d="M0 0h23v23H0z"/>
                <path fill="#f35325" d="M1 1h10v10H1z"/>
                <path fill="#81bc06" d="M12 1h10v10H12z"/>
                <path fill="#05a6f0" d="M1 12h10v10H1z"/>
                <path fill="#ffba08" d="M12 12h10v10H12z"/>
              </svg>
              Continue with Microsoft
            </button>
          </div>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200 dark:border-slate-700 transition-colors"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-3 bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wide transition-colors">Or sign up with email</span>
            </div>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit} noValidate>
            
            {/* =======================
                ROW 1: Name & Email
            ======================= */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 transition-colors">
                  Full Name
                </label>
                <div className="relative">
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    className={`appearance-none block w-full px-3 py-2.5 border ${
                      fieldErrors.fullName ? 'border-red-300 dark:border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-slate-600 focus:ring-blue-900 dark:focus:ring-blue-500'
                    } rounded-lg bg-gray-50 dark:bg-slate-800 placeholder-gray-400 dark:placeholder-slate-500 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:border-transparent sm:text-sm transition-all`}
                    placeholder="Enter your full name"
                  />
                </div>
                {fieldErrors.fullName && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{fieldErrors.fullName}</p>}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 transition-colors">
                  Work Email
                </label>
                <div className="relative">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    className={`appearance-none block w-full px-3 py-2.5 border ${
                      fieldErrors.email ? 'border-red-300 dark:border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-slate-600 focus:ring-blue-900 dark:focus:ring-blue-500'
                    } rounded-lg bg-gray-50 dark:bg-slate-800 placeholder-gray-400 dark:placeholder-slate-500 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:border-transparent sm:text-sm transition-all`}
                    placeholder="you@company.com"
                  />
                </div>
                {fieldErrors.email && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{fieldErrors.email}</p>}
              </div>
            </div>

            {/* =======================
                ROW 2: Business & Phone
            ======================= */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label htmlFor="businessName" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 transition-colors">
                  Business Name
                </label>
                <div className="relative">
                  <input
                    id="businessName"
                    name="businessName"
                    type="text"
                    required
                    value={formData.businessName}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    className={`appearance-none block w-full px-3 py-2.5 border ${
                      fieldErrors.businessName ? 'border-red-300 dark:border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-slate-600 focus:ring-blue-900 dark:focus:ring-blue-500'
                    } rounded-lg bg-gray-50 dark:bg-slate-800 placeholder-gray-400 dark:placeholder-slate-500 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:border-transparent sm:text-sm transition-all`}
                    placeholder="Acme Corporation"
                  />
                </div>
                {fieldErrors.businessName && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{fieldErrors.businessName}</p>}
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 transition-colors">
                  Phone Number
                </label>
                <div className="relative">
                  <input
                    id="phone"
                    name="phone"
                    type="text"
                    required
                    value={formData.phone}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    className={`appearance-none block w-full px-3 py-2.5 border ${
                      fieldErrors.phone ? 'border-red-300 dark:border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-slate-600 focus:ring-blue-900 dark:focus:ring-blue-500'
                    } rounded-lg bg-gray-50 dark:bg-slate-800 placeholder-gray-400 dark:placeholder-slate-500 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:border-transparent sm:text-sm transition-all`}
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
                {fieldErrors.phone && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{fieldErrors.phone}</p>}
              </div>
            </div>

            {/* =======================
                ROW 3: Address & Tax ID
            ======================= */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 transition-colors">
                  Business Address <span className="text-slate-400 dark:text-slate-500 font-normal">(Optional)</span>
                </label>
                <div className="relative">
                  <input
                    id="address"
                    name="address"
                    type="text"
                    value={formData.address}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    className="appearance-none block w-full px-3 py-2.5 border border-gray-300 dark:border-slate-600 focus:ring-blue-900 dark:focus:ring-blue-500 rounded-lg bg-gray-50 dark:bg-slate-800 placeholder-gray-400 dark:placeholder-slate-500 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:border-transparent sm:text-sm transition-all"
                    placeholder="123 Business Rd, City"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="taxId" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 transition-colors">
                  Tax ID / VAT Number <span className="text-slate-400 dark:text-slate-500 font-normal">(Optional)</span>
                </label>
                <div className="relative">
                  <input
                    id="taxId"
                    name="taxId"
                    type="text"
                    value={formData.taxId}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    className="appearance-none block w-full px-3 py-2.5 border border-gray-300 dark:border-slate-600 focus:ring-blue-900 dark:focus:ring-blue-500 rounded-lg bg-gray-50 dark:bg-slate-800 placeholder-gray-400 dark:placeholder-slate-500 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:border-transparent sm:text-sm transition-all"
                    placeholder="Optional"
                  />
                </div>
              </div>
            </div>

            {/* =======================
                ROW 4: Passwords
            ======================= */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 transition-colors">
                  Password
                </label>
                <div className="relative rounded-md shadow-sm">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    className={`appearance-none block w-full px-3 py-2.5 border ${
                      fieldErrors.password ? 'border-red-300 dark:border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-slate-600 focus:ring-blue-900 dark:focus:ring-blue-500'
                    } rounded-lg bg-gray-50 dark:bg-slate-800 placeholder-gray-400 dark:placeholder-slate-500 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:border-transparent sm:text-sm pr-10 transition-all`}
                    placeholder="Enter your password"
                  />

                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 dark:text-slate-500 hover:text-gray-600 dark:hover:text-slate-300 focus:outline-none transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {fieldErrors.password && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{fieldErrors.password}</p>}
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 transition-colors">
                  Confirm Password
                </label>
                <div className="relative rounded-md shadow-sm">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    className={`appearance-none block w-full px-3 py-2.5 border ${
                      fieldErrors.confirmPassword ? 'border-red-300 dark:border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-slate-600 focus:ring-blue-900 dark:focus:ring-blue-500'
                    } rounded-lg bg-gray-50 dark:bg-slate-800 placeholder-gray-400 dark:placeholder-slate-500 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:border-transparent sm:text-sm pr-10 transition-all`}
                    placeholder="Re-enter your password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 dark:text-slate-500 hover:text-gray-600 dark:hover:text-slate-300 focus:outline-none transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {fieldErrors.confirmPassword && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{fieldErrors.confirmPassword}</p>}
              </div>
            </div>

            {error && <p className="text-sm text-red-600 dark:text-red-400 text-center font-medium">{error}</p>}
            {success && <p className="text-sm text-green-600 dark:text-green-400 text-center font-medium">{success}</p>}

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-md text-sm font-bold text-white bg-blue-900 dark:bg-blue-700 hover:bg-blue-800 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-900 dark:focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed transition duration-150 ease-in-out mt-4"
              >
                {isSubmitting ? 'Creating Account...' : 'Create Free Account'}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 transition-colors">
              By creating an account, you agree to our{' '}
              <a href="#" className="font-medium text-blue-900 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline transition-colors">Terms of Service</a>
              {' '}and{' '}
              <a href="#" className="font-medium text-blue-900 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline transition-colors">Privacy Policy</a>.
            </p>
          </div>
          
          <div className="mt-8 border-t border-gray-100 dark:border-slate-800 pt-6 transition-colors">
            <div className="flex items-center justify-center text-sm">
              <span className="text-slate-600 dark:text-slate-400 transition-colors">Already have an account?</span>
              <Link to="/login" className="ml-2 font-bold text-blue-900 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors">
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