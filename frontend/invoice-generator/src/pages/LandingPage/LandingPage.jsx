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
import Features from '../../components/landing/Features';
import Testimonials from '../../components/landing/Testimonials';
import Hero from '../../components/landing/Hero';
import Faq from '../../components/landing/Faqs';

const LandingPage = () => {
  return (
    <div className='bg-[#ffffff] text-gray-600'>
      <Header />
      
      <main className="pt-20">
        <Hero />

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

    <Features/>
    <Testimonials/>
    <Faq/>

    {/* <Testimonials/> */}
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