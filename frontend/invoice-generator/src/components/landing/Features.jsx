import react from 'react';
// import { Wand2, Calculator, FileText } from 'lucide-react';
import { FEATURES } from '../../utils/data';
import { ArrowRight } from 'lucide-react';


const Features = () => {
  return (
    <div className="relative transition-colors duration-300 z-10 ">
       {/* Features Section */}
        <section id="Features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-2xl rounded-[2.5rem] p-8 md:p-16 shadow-xl border border-white/50 dark:border-slate-700/50 transition-colors duration-300 ">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-6 tracking-tight">
                Why Choose Our AI Invoice Generator?
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                Our platform is designed to be simple, efficient, and powerful, helping you get paid faster.
              </p>
            </div>

            
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5'>
              {FEATURES.map((feature, index) => (
                <div key={index} className="group bg-white dark:bg-slate-800 rounded-3xl p-5 shadow-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-slate-100 dark:border-slate-700/50">
                <div className="w-14 h-14 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <feature.icon className="w-7 h-7 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{feature.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm mb-6">{feature.description}</p>
                <a href="#" className="inline-flex items-center text-blue-600 dark:text-blue-400 font-semibold text-sm hover:text-blue-800 dark:hover:text-blue-300 transition-colors duration-200 group/link">
                Learn More <ArrowRight className="w-4 h-4 ml-1 group-hover/link:translate-x-1 transition-transform" />
                </a>
                </div>
                ))}
            </div>

            {/* <div className="grid md:grid-cols-3 gap-8">
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
            </div> */}

          </div>
        </section>

    </div>
  );
};

export default Features;