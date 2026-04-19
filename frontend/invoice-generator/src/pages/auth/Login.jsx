import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, FileText, ArrowLeft, Loader2, Mail, Lock, ArrowRight, CheckCircle2, ShieldCheck} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useState, useEffect } from 'react';
import { API_PATHS } from '../../utils/apiPaths';
import axiosInstance from '../../utils/axiosInstance';
import { validateEmail, validatePassword } from '../../utils/helper';
import toast from 'react-hot-toast';

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

  const [success, setSuccess] = useState('');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 50);
    return () => clearTimeout(timer);
  }, []);

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
    setSuccess('');

    try {
      const response = await axiosInstance.post(API_PATHS.AUTH_API.LOGIN, formData);
      const { token, user } = response.data;
      login(user, token);
      console.log('Login successful:', response.data);
      setSuccess('Login successful! Redirecting...');
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Placeholder function for OAuth login buttons
  const handleOAuthLogin = (provider) => {
    toast.success(`${provider} business login will be implemented soon!`);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 transition-colors duration-300 flex overflow-hidden relative">

      {/* =========================================
          LEFT PANE - Brand/Marketing Showcase
      ========================================= */}
      <div className={`hidden lg:flex lg:w-[45%] bg-slate-50 dark:bg-slate-900 border-r border-gray-200 dark:border-slate-800 relative flex-col justify-center items-center transition-all duration-700 ease-out transform ${isMounted ? 'translate-x-0 opacity-100' : '-translate-x-8 opacity-0'}`}>
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
            <FileText className="h-10 w-10 text-white" />
          </div>
          <h2 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-6 tracking-tight leading-tight transition-colors">
            Welcome Back to<br/><span className="text-blue-900 dark:text-blue-400">InvoiceAI</span>
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 mb-10 leading-relaxed transition-colors">
            Log in to continue managing your invoices and getting paid faster.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-left">
             <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 hover:shadow-md transition-all">
               <div className="bg-blue-50 dark:bg-blue-900/30 w-10 h-10 rounded-lg flex items-center justify-center mb-3 transition-colors">
                 <CheckCircle2 className="text-blue-600 dark:text-blue-400 h-5 w-5" />
               </div>
               <h3 className="font-bold text-slate-800 dark:text-white transition-colors">Fast & Easy</h3>
               <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 transition-colors">Access all your AI-generated invoices in one place.</p>
             </div>
             <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 hover:shadow-md transition-all">
               <div className="bg-teal-50 dark:bg-teal-900/30 w-10 h-10 rounded-lg flex items-center justify-center mb-3 transition-colors">
                 <ShieldCheck className="text-teal-600 dark:text-teal-400 h-5 w-5" />
               </div>
               <h3 className="font-bold text-slate-800 dark:text-white transition-colors">Secure Login</h3>
               <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 transition-colors">Your business data is always protected and encrypted.</p>
             </div>
          </div>
        </div>
      </div>

      {/* =========================================
          RIGHT PANE - Form
      ========================================= */}
      <div className={`flex-1 flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-12 xl:px-20 bg-white dark:bg-slate-900 relative overflow-y-auto h-screen transition-all duration-700 ease-out transform ${isMounted ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'}`}>
        
       

        <div className="mx-auto w-full max-w-[450px] mt-12 sm:mt-0">
          <div className="mb-8 text-center sm:text-left">
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight transition-colors">
              Log in to your account
            </h2>
            <p className="mt-2 text-base text-slate-500 dark:text-slate-400 transition-colors">
              Welcome back! Please enter your details.
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
              Google
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
              Microsoft
            </button>
          </div>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200 dark:border-slate-700 transition-colors"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-3 bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wide transition-colors">Or log in with email</span>
            </div>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit} noValidate>
            
            {/* Email Address Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 transition-colors">
                Email Address
              </label>
              <div className="relative">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`appearance-none block w-full px-3 py-2.5 border ${
                    fieldErrors.email ? 'border-red-300 dark:border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-slate-600 focus:ring-blue-900 dark:focus:ring-blue-500'
                  } rounded-lg bg-gray-50 dark:bg-slate-800 placeholder-gray-400 dark:placeholder-slate-500 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:border-transparent sm:text-sm transition-all`}
                  placeholder="you@company.com"
                />
              </div>
              {fieldErrors.email && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{fieldErrors.email}</p>}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 transition-colors">
                Password
              </label>
              <div className="relative rounded-md shadow-sm">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
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

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded dark:border-slate-600 dark:bg-slate-800"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-700 dark:text-slate-300">
                  Remember me
                </label>
              </div>
              <div className="text-sm">
                <Link
                  to="/forgot-password"
                  className="font-medium text-blue-900 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
            </div>

            {error && <p className="text-sm text-red-600 dark:text-red-400 text-center font-medium">{error}</p>}
            {success && <p className="text-sm text-green-600 dark:text-green-400 text-center font-medium">{success}</p>}

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-md text-sm font-bold text-white bg-blue-900 dark:bg-blue-700 hover:bg-blue-800 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-900 dark:focus:ring-blue-500 transition duration-150 ease-in-out disabled:opacity-70 mt-4"
              >
                {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Log In'}
              </button>
            </div>
          </form>

          <div className="mt-8 border-t border-gray-100 dark:border-slate-800 pt-6 transition-colors">
            <div className="flex items-center justify-center text-sm">
              <span className="text-slate-600 dark:text-slate-400 transition-colors">Don't have an account?</span>
              <Link to="/signup" className="ml-2 font-bold text-blue-900 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors">
                Sign up for free
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Login;