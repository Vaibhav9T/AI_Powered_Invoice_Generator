import { useState, useEffect, use } from "react";
import { Link } from "react-router-dom";
import {FileText, Menu, X} from 'lucide-react';
import ProfileDropdown from "../layout/ProfileDropdown";
import { useAuth } from "../../context/AuthContext";
import Logo from "../ui/Logo";

const Header = () => {
const [isScrolled, setIsScrolled] = useState(false);
const [isMenuOpen, setIsMenuOpen] = useState(false);
const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

const { isAuthenticated, user, logout } = useAuth();

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
    <header className={`fixed w-full top-0 z-50 transition-colors duration-300 border-b ${
    isScrolled ? "bg-white/80 dark:bg-slate-950/80 backdrop-blur-lg shadow-sm border-slate-200/50 dark:border-slate-800/50" : "bg-transparent border-transparent" } `}>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link to="/LandingPage" className="flex items-center space-x-2">
          {/* 1. Logo Section */}
          <Logo />
        </Link>
          {/* 2. Navigation Links (Hidden on Mobile) */}
          <nav className="hidden md:flex space-x-10">
            {['Features', 'Testimonials', 'FAQ'].map((item) => {

              if (item === 'Features') {
                return (
                  <button
                    key={item}
                    onClick={() => scrollToSection('Features')}
                  className="text-md font-medium text-slate-600 dark:text-slate-300 hover:text-blue-900 dark:hover:text-blue-400 transition-colors cursor-pointer bg-transparent border-none"
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
                  className="text-md font-medium text-slate-600 dark:text-slate-300 hover:text-blue-900 dark:hover:text-blue-400 transition-colors cursor-pointer bg-transparent border-none"
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
                  className="text-md font-medium text-slate-600 dark:text-slate-300 hover:text-blue-900 dark:hover:text-blue-400 transition-colors cursor-pointer bg-transparent border-none"
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
           
            {isAuthenticated ?( 
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
              className="px-6 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-300 bg-slate-200/50 dark:bg-slate-800/50 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              Login
            </Link>
            <Link 
              to="/signup" 
              className="px-6 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-lg shadow-lg shadow-blue-500/25 transition-all transform hover:-translate-y-0.5"
            >
              Sign Up
            </Link>
            </> )}
           
          </div>

          

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white focus:outline-none"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="md:hidden bg-white dark:bg-slate-900 border-t border-gray-100 dark:border-slate-800 shadow-xl absolute w-full transition-colors duration-300">
          <div className="px-4 pt-2 pb-6 space-y-2">

  
              {['Features', 'Testimonials', 'FAQ'].map((item) => {
                if (item === 'Features') {
                  return (
                    <button
                      key={item}
                      onClick={() => scrollToSection('Features')}
                    className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-slate-700 dark:text-slate-300 hover:text-blue-900 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-slate-800 bg-transparent cursor-pointer border-none"
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
                    className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-slate-700 dark:text-slate-300 hover:text-blue-900 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-slate-800 bg-transparent cursor-pointer border-none"
                    >
                      {item}
                    </button>
                  );
                }
                return (
                  <Link
                    key={item}
                    to={`/${item.toLowerCase()}`}
                  className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 dark:text-slate-300 hover:text-blue-900 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-slate-800"
                  >
                    {item}
                  </Link>
                );
              })}

              

             {isAuthenticated ?(<div className="mt-4 flex flex-col gap-3"><Link to="/Dashboard" className="w-full text-center py-3 rounded-lg bg-blue-900 font-semibold text-white">
                Go to Dashboard
              </Link></div>):
            <div className="mt-4 flex flex-col gap-3">
              
              <Link to="/login" className="w-full text-center py-3 rounded-lg bg-slate-100 dark:bg-slate-800 font-semibold text-slate-700 dark:text-slate-300">
                Login
              </Link>
              <Link to="/signup" className="w-full text-center py-3 rounded-lg bg-blue-900 dark:bg-blue-700 font-semibold text-white">
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