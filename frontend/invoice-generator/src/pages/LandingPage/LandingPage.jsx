import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Wand2, 
  Calculator, 
  FileText, 
  Facebook, 
  Twitter, 
  Github, 
  Menu, 
  X 
} from 'lucide-react';

import Header from '../../components/landing/Header';
const LandingPage = () => {
  return (
    <div className='bg-[#ffffff] text-gray-600'>
      <Header />
      
      <main className="pt-20">
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

        {/* Social Proof Section */}
        <section className="text-center py-10">
          <p className="text-sm font-semibold text-slate-500 mb-6 uppercase tracking-wider">
            Trusted by thousands of businesses worldwide
          </p>
          <div className="flex justify-center -space-x-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <img 
                key={i}
                className="w-12 h-12 rounded-full border-4 border-gray-50"
                src={`https://i.pravatar.cc/100?img=${i + 10}`}
                alt={`User ${i}`}
              />
            ))}
          </div>
        </section>

        {/* Features Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="bg-white rounded-3xl p-8 md:p-16 shadow-sm border border-gray-100">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">
                Why Choose Our AI Invoice Generator?
              </h2>
              <p className="text-lg text-slate-600">
                Our platform is designed to be simple, efficient, and powerful, helping you get paid faster.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-gray-50 rounded-2xl p-8 hover:bg-gray-100 transition-colors duration-300">
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-6 text-indigo-600">
                  <Wand2 size={24} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">AI Data Extraction</h3>
                <p className="text-slate-600 leading-relaxed">
                  Automatically pull client details, line items, and costs from any document or rough notes.
                </p>
              </div>

              <div className="bg-gray-50 rounded-2xl p-8 hover:bg-gray-100 transition-colors duration-300">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6 text-blue-600">
                  <Calculator size={24} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Automated Calculations</h3>
                <p className="text-slate-600 leading-relaxed">
                  Let our AI handle all the math, including taxes and discounts, with zero errors.
                </p>
              </div>

              <div className="bg-gray-50 rounded-2xl p-8 hover:bg-gray-100 transition-colors duration-300">
                <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-6 text-teal-600">
                  <FileText size={24} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Professional Templates</h3>
                <p className="text-slate-600 leading-relaxed">
                  Choose from a variety of clean, professional templates to match your brand identity.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Bottom CTA Section */}
        <section className="text-center py-20 px-4">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">
            Ready to streamline your invoicing?
          </h2>
          <p className="text-slate-600 mb-8 max-w-xl mx-auto">
            Join thousands of freelancers and small businesses who trust InvoiceAI to manage their billing.
          </p>
          <Link 
            to="/signup"
            className="inline-block px-10 py-4 text-lg font-bold text-white bg-blue-900 hover:bg-blue-800 rounded-xl shadow-lg transition-transform hover:-translate-y-1"
          >
            Start for Free Today
          </Link>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div className="col-span-2 md:col-span-1">
              <span className="font-bold text-xl text-slate-900">InvoiceAI</span>
              <p className="mt-4 text-sm text-slate-500">
                Smart invoicing, simplified.
              </p>
            </div>
            
            <div>
              <h4 className="font-bold text-slate-900 mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-slate-600">
                <li><Link to="#" className="hover:text-blue-900">Features</Link></li>
                <li><Link to="#" className="hover:text-blue-900">Pricing</Link></li>
                <li><Link to="#" className="hover:text-blue-900">Integrations</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-slate-600">
                <li><Link to="#" className="hover:text-blue-900">About Us</Link></li>
                <li><Link to="#" className="hover:text-blue-900">Contact</Link></li>
                <li><Link to="#" className="hover:text-blue-900">Blog</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-slate-600">
                <li><Link to="#" className="hover:text-blue-900">Privacy Policy</Link></li>
                <li><Link to="#" className="hover:text-blue-900">Terms of Service</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-slate-500">
              © 2024 InvoiceAI. All rights reserved.
            </p>
            <div className="flex space-x-6 text-slate-400">
              <a href="#" className="hover:text-slate-600 transition-colors"><Facebook size={20} /></a>
              <a href="#" className="hover:text-slate-600 transition-colors"><Twitter size={20} /></a>
              <a href="#" className="hover:text-slate-600 transition-colors"><Github size={20} /></a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;