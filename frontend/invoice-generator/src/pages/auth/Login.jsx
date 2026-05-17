import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Eye, EyeOff, ArrowLeft, Loader2, CheckCircle2, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useState, useEffect } from 'react';
import { API_PATHS } from '../../utils/apiPaths';
import axiosInstance from '../../utils/axiosInstance';
import { validateEmail, validatePassword } from '../../utils/helper';
import toast from 'react-hot-toast';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams(); // 🔥 ADDED: To read the URL for verification success

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isMounted, setIsMounted] = useState(false);

  // Animation mounting effect
  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 50);
    return () => clearTimeout(timer);
  }, []);

  // 🔥 ADDED: Catch the user returning from their email verification link
  useEffect(() => {
    if (searchParams.get('verified') === 'true') {
      toast.success("Email verified successfully! You can now log in.", { duration: 5000 });
      // Clean up the URL so the toast doesn't fire on every page refresh
      navigate('/login', { replace: true }); 
    }
  }, [searchParams, navigate]);

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
    setFieldErrors({ ...fieldErrors, [name]: '' });
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
      
      const token = response.data.token;
      const user = response.data.user || response.data.userData || response.data.data;

      // Pass all THREE variables to the context
      login(user, token, rememberMe);
      
      setSuccess('Login successful! Redirecting...');
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);

    } catch (err) {
      // 🔥 THE FIX: Catch the unverified 403 error specifically!
      if (err.response?.status === 403) {
        const unverifiedMsg = "Account not verified! Please check your email for the verification link.";
        setError("Please verify your email address.");
        toast.error(unverifiedMsg, { duration: 6000 });
      } else {
        const errorMsg = err.response?.data?.message || 'Login failed. Please try again.';
        setError(errorMsg);
        toast.error(errorMsg);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuthLogin = (provider) => {
    toast.success(`${provider} business login will be implemented soon!`);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 transition-colors duration-300 flex overflow-hidden relative">

      {/* LEFT PANE */}
      <div className={`hidden lg:flex lg:w-[45%] bg-slate-50 dark:bg-slate-900 border-r border-gray-200 dark:border-slate-800 relative flex-col justify-center items-center transition-all duration-700 ease-out transform ${isMounted ? 'translate-x-0 opacity-100' : '-translate-x-8 opacity-0'}`}>
        <div className="absolute top-6 left-6 md:top-8 md:left-8 z-10">
          <Link to="/" className="flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-blue-900 dark:hover:text-blue-400 transition-colors group">
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
            Welcome Back to<br/><span className="text-blue-900 dark:text-blue-400">AINVOY</span>
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

      {/* RIGHT PANE - Form */}
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

          <form className="space-y-5" onSubmit={handleSubmit} noValidate>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 transition-colors">
                Email Address
              </label>
              <div className="relative">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="appearance-none block w-full px-3 py-2.5 border border-gray-300 dark:border-slate-600 rounded-lg bg-gray-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-900 dark:focus:ring-blue-500 transition-all"
                  placeholder="you@company.com"
                />
              </div>
            </div>

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
                  className="appearance-none block w-full px-3 py-2.5 border border-gray-300 dark:border-slate-600 rounded-lg bg-gray-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-900 dark:focus:ring-blue-500 pr-10 transition-all"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 dark:text-slate-500 hover:text-gray-600 transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded dark:border-slate-600 dark:bg-slate-800 cursor-pointer"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-700 dark:text-slate-300 cursor-pointer">
                  Remember me
                </label>
              </div>
              <div className="text-sm">
                <Link to="/forgot-password" className="font-medium text-blue-900 dark:text-blue-400 hover:text-blue-700 transition-colors">
                  Forgot password?
                </Link>
              </div>
            </div>

            {error && <p className="text-sm text-red-600 text-center font-medium">{error}</p>}
            {success && <p className="text-sm text-green-600 text-center font-medium">{success}</p>}

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-md text-sm font-bold text-white bg-blue-900 dark:bg-blue-700 hover:bg-blue-800 transition duration-150 disabled:opacity-70 mt-4"
              >
                {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Log In'}
              </button>
            </div>
          </form>

          <div className="mt-8 border-t border-gray-100 dark:border-slate-800 pt-6 transition-colors">
            <div className="flex items-center justify-center text-sm">
              <span className="text-slate-600 dark:text-slate-400">Don't have an account?</span>
              <Link to="/signup" className="ml-2 font-bold text-blue-900 dark:text-blue-400 hover:text-blue-800 transition-colors">
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