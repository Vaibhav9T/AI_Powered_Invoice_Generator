import { Link } from "react-router-dom";
import {Github, Linkedin, FileText} from 'lucide-react';

const FooterLink=({
    href, to , children
})=>{
    const className="block text-gray-400 hover:text-white transition-colors duration-200 mb-2";
    if(to){
        return <Link to={to} className={className}>{children}</Link>;
    }
    return <a href={href} className={className}>{children}</a>;
};

const SocialLink = ({ href, children }) => {
return (
        <a
        href={href}
        className="w-10 h-10 bg-blue-950 flex rounded-lg items-center justify-center hover:bg-gray-700  transition-colors duration-200"
        target="_blank"
        rel="noopener noreferrer"
        >
        {children}
        </a>
        );
};

const Footer = () => {


  return (
    
        <footer className="bg-gray-900 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                    <div className="space-y-4 md:col-span-2 lg:col-span-1">
                    <Link to="/LandingPage" className="flex items-center space-x-2 mb-6">
                    <div className="w-8 jh-8 bg-blue-950 rounded-md flex items-center justify-center" >
                    
                    <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                    <svg 
                        width="16" 
                        height="16" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path d="M12 2L2 22H22L12 2Z" fill="blue" stroke="blue" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    </div>
                    </div>
                    <span className="text-xl font-bold">InvoiceAI</span>
                    </Link>
                    <p className="text-gray-400 leading-relaxed max-w-sm w-50">
                    The simplest way to create and send professional invoices.
                    </p>
                    </div>
                    <div>
                    <h3 className="text-base font-semibold mb-4">Product</h3>
                    <ul className="space-y-2">
                    <li>
                    <FooterLink href="#Features">Features</FooterLink>
                    </li>
                    <li>
                        <FooterLink href="#Testimonials">Testimonials</FooterLink>
                    </li>
                    <li>
                    <FooterLink href="#Faq">FAQ</FooterLink>
                    </li>
                    </ul>
                    </div>
                    <div>
                    <h3 className="text-base font-semibold mb-4">Company</h3>
                    <ul className="space-y-2">
                    <li><FooterLink to="/about">About Us</FooterLink></li>
                    <li><FooterLink to="/contact">Contact</FooterLink></li>
                    </ul>
                    </div>
                    <div>
                    <h3 className="text-base font-semibold mb-4">Legal</h3>
                    <ul className="space-y-2">
                    <li>
                    <FooterLink to="/privacy">Privacy Policy</FooterLink>
                    </li>
                    <li>
                        <FooterLink to="/terms">Terms of Service</FooterLink>
                    </li>
                    </ul>
                    </div>
                    </div>
                    <div className="border-t border-gray-800 py-8 mt-16">
                    <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                    <p className="text-gray-400">
                    &copy; 2025 AI Invoice App. All rights reserved.
                    </p>
                    <div className="flex space-x-4">
                    <SocialLink href="#">
                    <Github className="w-5 h-5 " />
                    </SocialLink>
                    <SocialLink href="#">
                    <Linkedin className="w-5 h-5" />
                    </SocialLink>
                    </div>
                    </div>
                    </div>
                </div>
            </footer>
  );
};

export default Footer;