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

      <Footer/>
    </div>
  );
};

export default LandingPage;