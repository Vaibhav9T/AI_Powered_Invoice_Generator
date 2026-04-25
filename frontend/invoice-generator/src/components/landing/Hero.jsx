import react from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Logo from '../ui/Logo';

const Hero = () => {
  const { isAuthenticated } = useAuth();

  
  return (
    <div className="relative transition-colors duration-300">
      {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24 lg:pt-24 lg:pb-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="flex items-center gap-2">
                <span className="bg-blue-500/10 border border-blue-500/20 text-blue-700 dark:text-blue-400 text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wide flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400 animate-pulse"></span>
                  New v2.0
                </span>
                <span className="text-slate-600 dark:text-slate-400 text-sm font-medium border-l border-slate-300 dark:border-slate-700 pl-3">
                  AI-Powered Invoicing is here
                </span>
              </div>
              
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.1]">
                Generate Invoices <br />
                Instantly with <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-400">AI</span>
              </h1>
              
              <p className="text-lg text-slate-600 dark:text-slate-400 max-w-lg leading-relaxed">
                Save time and reduce errors with our intelligent invoice generator. 
                Create professional invoices in seconds just by describing your work.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  to={isAuthenticated ? "/dashboard" : "/signup"} 
                  className="inline-flex justify-center items-center px-8 py-4 text-base font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl shadow-xl shadow-blue-500/25 transition-all hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-500/40"
                >
                  {isAuthenticated ? "Go to Dashboard" : "Get Started for Free"}
                </Link>
              </div>
            </div>

            {/* Right Image/Graphic */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-teal-400 rounded-[2rem] blur-xl opacity-30 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
              
              <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-slate-900 border border-slate-700/50 transition-colors duration-300 transform group-hover:-translate-y-2"> 
                
                <img 
                  src="https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=1000" 
                  alt="Invoice Preview" 
                  className="w-full h-auto object-cover opacity-50 dark:opacity-30 mix-blend-overlay transition-opacity duration-500 group-hover:opacity-40"
                />
                
                {/* Floating UI Element (Mock Invoice) */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-xl shadow-2xl p-6 w-3/4 max-w-sm transition-all duration-500 group-hover:scale-105 border border-white/20 dark:border-slate-700/50">
                  <div className="h-4 w-1/3 bg-gray-200 rounded mb-4"></div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <div className="h-3 w-1/2 bg-gray-100 rounded"></div>
                      <div className="h-3 w-12 bg-gray-100 rounded"></div>
                    </div>
                    <div className="flex justify-between">
                      <div className="h-3 w-2/3 bg-gray-100 rounded"></div>
                      <div className="h-3 w-12 bg-gray-100 rounded"></div>
                    </div>
                    <div className="border-t border-gray-100 my-2"></div>
                    <div className="flex justify-between items-center">
                      <div className="h-3 w-1/4 bg-gray-200 dark:bg-slate-700 rounded"></div>
                      <div className="h-4 w-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
    </div>
  );
};

export default Hero;