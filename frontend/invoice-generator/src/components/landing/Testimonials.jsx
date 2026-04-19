import react from 'react';
import {Quote} from 'lucide-react';
import { TESTIMONIALS } from '../../utils/data';

const Testimonials = () => {
  return (
    <div className="relative">
      <section id="Testimonials" className="py-24 lg:py-32 relative z-10 transition-colors duration-300">
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 '>
          <div className='text-center mb-16'>
            <h2 className='text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white mb-6 tracking-tight'>What our Customers Say</h2>
            {/* <p className='text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed' >We are trusted by thousands of freelancers and businesses worldwide.</p> */}
          </div>
          
          <div className="relative">
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 blur-[4px] select-none pointer-events-none opacity-60 dark:opacity-40'>
              {TESTIMONIALS.map((testimonial, index) => (
                <div key={index} className="bg-white dark:bg-slate-800/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-slate-100 dark:border-slate-700/50 relative">
                  <div className="absolute -top-5 left-8 w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/30 transform rotate-3">
                    <Quote className="w-5 h-5 -rotate-3" />
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 mb-8 mt-2 leading-relaxed italic text-lg">"{testimonial.quote}"</p>
                  <div className="flex items-center space-x-4">
                    <img src={testimonial.avatar} alt={testimonial.author} className="w-14 h-14 rounded-full object-cover border-2 border-white dark:border-slate-700 shadow-md" />
                    <div className="flex-1">
                      <p className="font-bold text-slate-900 dark:text-white">{testimonial.author}</p>
                      <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">{testimonial.title}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Overlay Message */}
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl px-10 py-6 rounded-3xl border border-white/50 dark:border-slate-700/50 shadow-2xl transform hover:scale-105 transition-transform duration-300">
                <p className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 font-extrabold text-2xl text-center">
                  Real Testimonials Coming Soon!
                </p>
                <p className="text-slate-500 dark:text-slate-400 text-center mt-2 font-medium">We're gathering feedback from our amazing early users.</p>
              </div>
            </div>
          </div>
        </div>
        </section>
    </div>
  );
};

export default Testimonials;