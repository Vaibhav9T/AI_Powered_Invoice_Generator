import react from 'react';
import { Link } from 'react-router-dom';


const Hero = () => {
  return (
    <div className="bg-white">
      {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="flex items-center gap-2">
                <span className="bg-blue-100 text-blue-900 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                  New v2.0
                </span>
                <span className="text-slate-500 text-sm font-medium">
                  AI-Powered Invoicing is here
                </span>
              </div>
              
              <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.1]">
                Generate Invoices <br />
                Instantly with <span className="text-blue-900">AI</span>
              </h1>
              
              <p className="text-lg text-slate-600 max-w-lg leading-relaxed">
                Save time and reduce errors with our intelligent invoice generator. 
                Create professional invoices in seconds just by describing your work.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  to="/signup" 
                  className="inline-flex justify-center items-center px-8 py-4 text-base font-bold text-white bg-blue-900 hover:bg-blue-800 rounded-xl shadow-lg shadow-blue-900/20 transition-all hover:-translate-y-1"
                >
                  Get Started for Free
                </Link>
              </div>
            </div>

            {/* Right Image/Graphic */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-teal-400 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
              
              <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-[#2A4A4A]"> 
                <img 
                  src="https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=1000" 
                  alt="Invoice Preview" 
                  className="w-full h-auto object-cover opacity-80 mix-blend-overlay"
                />
                
                {/* Floating UI Element (Mock Invoice) */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl p-6 w-3/4 max-w-sm">
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
                      <div className="h-3 w-1/4 bg-gray-200 rounded"></div>
                      <div className="h-4 w-16 bg-blue-900 rounded"></div>
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