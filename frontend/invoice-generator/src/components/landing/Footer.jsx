import { Link } from "react-router-dom";
import {Github, Linkedin, FileText} from 'lucide-react';
import ThemeToggle from "../layout/ThemeToggle";
import Logo from "../ui/Logo";

const FooterLink = ({ href, to, children }) => {
    const className="block text-slate-400 hover:text-white transition-colors duration-200 mb-2 text-sm";
    
    const scrollToSection = (e, sectionId) => {
        e.preventDefault();
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    if(to){
        return <Link to={to} className={className}>{children}</Link>;
    }
    return (
        <a href={href} onClick={(e) => scrollToSection(e, href.replace('#', ''))} className={className}>
            {children}
        </a>
    );
};

const SocialLink = ({ href, children }) => {
return (
        <a
        href={href}
        className="w-10 h-10 bg-slate-800/50 flex rounded-full items-center justify-center hover:bg-blue-600 hover:text-white text-slate-400 transition-all duration-300"
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
                    <div className="[&_span]:text-white">
                      <Logo />
                    </div>
                    </Link>
                    <p className="text-slate-400 leading-relaxed max-w-sm text-sm">
                    The simplest way to create, manage, and send professional invoices using the power of AI.
                    </p>
                    </div>
                    <div className="lg:ml-auto">
                    <h3 className="text-base font-bold mb-4 text-white">Product</h3>
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
                    <div className="lg:ml-auto">
                    <h3 className="text-base font-bold mb-4 text-white">Company</h3>
                    <ul className="space-y-2">
                    <li><FooterLink to="/about">About Us</FooterLink></li>
                    <li><FooterLink to="/contact">Contact</FooterLink></li>
                    </ul>
                    </div>
                    <div className="lg:ml-auto">
                    <h3 className="text-base font-bold mb-4 text-white">Legal</h3>
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
                    <div className="border-t border-slate-800/80 pt-8 mt-16 flex flex-col md:flex-row justify-between items-center gap-6">
                    
                    <p className="text-slate-500 text-sm">
                    &copy; 2025 AI Invoice App. All rights reserved.
                    </p>
                    
                    <div className="flex items-center gap-4">
                        
                    <ThemeToggle />
                      
                    <SocialLink href="https://github.com/vaibhav9t/AI_Powered_Invoice_Generator">
                    <Github className="w-4 h-4 " />
                    </SocialLink>
                    <SocialLink href="https://www.linkedin.com/in/vaibhav9t">
                    <Linkedin className="w-4 h-4" />
                    </SocialLink>
                    </div>
                    </div>
                </div>
            </footer>
  );
};

export default Footer;