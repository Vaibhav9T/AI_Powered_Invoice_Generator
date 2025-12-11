import react from 'react';
// import { Wand2, Calculator, FileText } from 'lucide-react';
import { FEATURES } from '../../utils/data';
import { ArrowRight } from 'lucide-react';


const Features = () => {
  return (
    <div className="bg-gray-50">
       {/* Features Section */}
        <section id="Features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="bg-white rounded-3xl p-8 md:p-16 shadow-sm border border-gray-100">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">
                Why Choose Our AI Invoice Generator?
              </h2>
              <p className="text-lg text-slate-600">
                Our platform is designed to be simple, efficient, and powerful, helping you get paid faster.
              </p>
            </div>

            
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
              {FEATURES.map((feature, index) => (
                <div key={index} className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all duration-300 hover:translate-y-1 border border-gray-100">
                <div className="w-16 h-16 bg-gray-100 rounded-2cl flex items-center justify-center mb-2">
                <feature.icon className="w-8 h-8 text-blue-800" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed ">{feature.description}</p>
                <a href="#" className="inline-flex items-center text-blue-900 font-medium mt-4 hover:text-black transition-colors duration-200">
                Learn More <ArrowRight className="w-4 h-4 ml-2" />
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