import {FAQS} from '../../utils/data';
import { ChevronDown } from 'lucide-react';
import React, {useState} from 'react';


const FaqItem = ({ faq, isOpen, onClick }) => (
        <div className={`border border-slate-200/60 dark:border-slate-700/50 rounded-2xl overflow-hidden transition-all duration-300 bg-white/60 dark:bg-slate-800/40 backdrop-blur-sm ${isOpen ? 'shadow-md' : 'hover:shadow-sm'}`}>
        <button onClick={onClick} className="w-full flex items-center justify-between p-6 hover:bg-slate-50/50 dark:hover:bg-slate-800/60 cursor-pointer transition-colors duration-200 outline-none">
        <span className="text-lg font-semibold text-slate-900 dark:text-white pr-4 text-left leading-snug">{faq.question}</span>
        <ChevronDown className={`w-6 h-6 text-slate-400 shrink-0 transition-transform duration-300 ${ isOpen ? 'transform rotate-180 text-blue-600 dark:text-blue-400' : ''}`} />
        </button>
        <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
            <div className="px-6 pb-6 text-slate-600 dark:text-slate-400 leading-relaxed pt-2">
            {faq.answer}
            </div>
        </div>
        </div>
)


const FAQ = () => {
    const [activeIndex, setActiveIndex] = useState(null);
    
    const handleClick=(index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    return (
        <section id='Faq' className='py-24 lg:py-32 relative z-10 transition-colors duration-300'>
        <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
            <div className='text-center mb-16'>
            <h2 className="text-3xl sm:text-5xl font-extrabold mb-6 text-slate-900 dark:text-white tracking-tight">Frequently Asked Questions</h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
                Everything you know about InvoiceAI
            </p>
            </div>
            <div className="space-y-4 px-4 sm:px-0">
                {FAQS.map((faq, index) => (
                    <FaqItem key={index} faq={faq} isOpen={activeIndex === index} onClick={() => handleClick(index)}  />
                ))}
        
            </div>
        </div>
        </section>
    );
}

export default FAQ;