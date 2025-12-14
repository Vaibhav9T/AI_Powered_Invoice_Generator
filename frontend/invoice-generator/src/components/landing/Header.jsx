import { useState, useEffect, use } from "react";
import { Link } from "react-router-dom";
import {FileText, Menu, X} from 'lucide-react';
import ProfileDropdown from "../layout/ProfileDropdown";

const Header = () => {
const [isScrolled, setIsScrolled] = useState(false);
const [isMenuOpen, setIsMenuOpen] = useState(false);
const isAunthenticated = false; // Replace with actual authentication logic
const user= {name:"Vaibhav", email:"vaibhavtembukadea09@gmail,com"}
const logout=()=>{}
const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

useEffect(() => {
    const handleScroll = () => {
        setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
}, []);

 // Helper function for smooth scrolling
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false); // Close mobile menu after clicking
  };

  return (
    <header className={`fixed w-full top-0 z-50 bg-gray-50/80 backdrop-blur-md border-b border-gray-100 ${
    isScrolled ? "bg-white/95  backdrop:blur-sm shadow-lg" : "bg-white/0" } `}>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link to="/LandingPage" className="flex items-center space-x-2">
          {/* 1. Logo Section */}
          <div className="shrink-0 flex items-center gap-2 cursor-pointer">
            {/* Custom Icon to match the blue cone/mountain in your image */}
            <div className="w-8 h-8 bg-blue-900 rounded-lg flex items-center justify-center">
              <svg 
                width="16" 
                height="16" 
                viewBox="0 0 24 24" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M12 2L2 22H22L12 2Z" fill="white" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-900">
              InvoiceAI
            </span>
          </div>
        </Link>
          {/* 2. Navigation Links (Hidden on Mobile) */}
          <nav className="hidden md:flex space-x-10">
            {['Features', 'Testimonials', 'FAQ'].map((item) => {

              if (item === 'Features') {
                return (
                  <button
                    key={item}
                    onClick={() => scrollToSection('Features')}
                    className="text-md font-medium text-slate-600 hover:text-blue-900 transition-colors cursor-pointer bg-transparent border-none"
                  >
                    {item}
                  </button>
                );
              }
              else if(item==='Testimonials'){
                  return (
                  <button
                    key={item}
                    onClick={() => scrollToSection('Testimonials')}
                    className="text-md font-medium text-slate-600 hover:text-blue-900 transition-colors cursor-pointer bg-transparent border-none"
                  >
                    {item}
                  </button>
                );
              }
               else if(item=== 'FAQ'){
                  return (
                  <button
                    key={item}
                    onClick={() => scrollToSection('Faq')}
                    className="text-md font-medium text-slate-600 hover:text-blue-900 transition-colors cursor-pointer bg-transparent border-none"
                  >
                    {item}
                  </button>
                );
              }
              // return (
              //   <Link
              //     key={item}
              //     to={`/${item.toLowerCase()}`}
              //     className="text-md font-medium text-slate-600 hover:text-blue-900 transition-colors"
              //   >
              //     {item}
              //   </Link>
              // );
            })}
          </nav>

            
          {/* 3. Action Buttons */}
          <div className="hidden md:flex items-center gap-4">
            {isAunthenticated ?( 
              <ProfileDropdown
              isOpen={profileDropdownOpen}
              onToggle={(e) => {
                e.stopPropagation();
                setProfileDropdownOpen(!profileDropdownOpen)}
              }
                avatar={user?.avatar || ''}
                companyName={user?.name || 'User'}
                email={user?.email || ''}
                onLogout={logout}
            />
          ) : ( <>
            <Link 
              to="/login" 
              className="px-6 py-2.5 text-sm font-semibold text-slate-700 bg-slate-200/50 hover:bg-slate-200 rounded-lg transition-colors"
            >
              Login
            </Link>
            <Link 
              to="/signup" 
              className="px-6 py-2.5 text-sm font-semibold text-white bg-blue-900 hover:bg-blue-800 rounded-lg shadow-lg shadow-blue-900/20 transition-all transform hover:-translate-y-0.5"
            >
              Sign Up
            </Link>
            </> )}
          </div>

          

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-slate-600 hover:text-slate-900 focus:outline-none"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-xl absolute w-full">
          <div className="px-4 pt-2 pb-6 space-y-2">

  
              {['Features', 'Testimonials', 'FAQ'].map((item) => {
                if (item === 'Features') {
                  return (
                    <button
                      key={item}
                      onClick={() => scrollToSection('Features')}
                      className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-blue-900 hover:bg-gray-50 bg-transparent cursor-pointer border-none"
                    >
                      {item}
                    </button>
                  );
                }
                else if(item==='Testimonials'){
                    return (
                    <button
                      key={item}
                      onClick={() => scrollToSection('Testimonials')}
                      className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-blue-900 hover:bg-gray-50 bg-transparent cursor-pointer border-none"
                    >
                      {item}
                    </button>
                  );
                }
                return (
                  <Link
                    key={item}
                    to={`/${item.toLowerCase()}`}
                    className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-blue-900 hover:bg-gray-50"
                  >
                    {item}
                  </Link>
                );
              })}

              

             {isAunthenticated ?(<div className="mt-4 flex flex-col gap-3"><Link to="/Dashboard" className="w-full text-center py-3 rounded-lg bg-blue-900 font-semibold text-white">
                Go to Dashboard
              </Link></div>):

            <div className="mt-4 flex flex-col gap-3">
              <Link to="/login" className="w-full text-center py-3 rounded-lg bg-slate-100 font-semibold text-slate-700">
                Login
              </Link>
              <Link to="/signup" className="w-full text-center py-3 rounded-lg bg-blue-900 font-semibold text-white">
                Get Started
              </Link>
            </div>}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;