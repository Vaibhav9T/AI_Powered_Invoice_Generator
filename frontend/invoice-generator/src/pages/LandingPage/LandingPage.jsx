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
import Footer from '../../components/landing/Footer';

const LandingPage = () => {
  return (
    <div className='relative min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 transition-colors duration-300 overflow-hidden font-sans'>
      {/* Global Decorative Background */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-blue-400/20 dark:bg-blue-900/20 blur-[120px]" />
        <div className="absolute top-[30%] -right-[10%] w-[30%] h-[30%] rounded-full bg-teal-400/20 dark:bg-teal-900/20 blur-[100px]" />
        <div className="absolute bottom-[-10%] left-[20%] w-[50%] h-[50%] rounded-full bg-indigo-400/20 dark:bg-indigo-900/20 blur-[120px]" />
      </div>
      
      <div className="relative z-10">
        <Header />
      
        <main className="pt-20">
        <Hero />

        {/* Social Proof Section - Temporarily Commented Out
        <section className="text-center py-10 bg-white dark:bg-slate-900 transition-colors duration-300">
          <p className="text-sm font-semibold text-slate-500 mb-6 uppercase tracking-wider">
            Trusted by thousands of businesses worldwide
          </p>
          <div className="flex justify-center -space-x-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <img 
                key={i}
                className="w-12 h-12 rounded-full border-4 border-gray-50 dark:border-slate-800"
                src={`https://i.pravatar.cc/100?img=${i + 10}`}
                alt={`User ${i}`}
              />
            ))}
          </div>
        </section>
        */}

    <Features/>
    <Testimonials/>
    <Faq/>

    {/* <Testimonials/> */}
        {/* Bottom CTA Section */}
        <section className="text-center py-24 px-4 relative">
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-6 tracking-tight">
            Ready to streamline your invoicing?
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            Join thousands of freelancers and small businesses who trust InvoiceAI to manage their billing.
          </p>
          <Link 
            to="/signup"
            className="inline-flex items-center justify-center px-10 py-4 text-lg font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl shadow-xl shadow-blue-900/20 transition-all hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-900/30"
          >
            Start for Free Today
          </Link>
        </section>
      </main>

        <Footer/>
      </div>
    </div>
  );
};

export default LandingPage;