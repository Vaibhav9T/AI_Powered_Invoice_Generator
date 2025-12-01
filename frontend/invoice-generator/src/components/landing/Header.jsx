import { useState, useEffect, use } from "react";
import { Link } from "react-router-dom";
import {FileText, Menu} from 'lucide-react';

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
  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md' : 'bg-transparent'}`} >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className=" flex justify-between items-center h-16">
          <div className=" flex items-center space-x-4">
            <div className=" flex items-center space-x-2">
            <FileText className=""></FileText>
          <span className=" font-bold text-lg">
             AI Invoice Generator
          </span>
          </div>
          <a href="#features"
          className=" ">
            Features
          </a>
          <a href="#testimonials"
          className="">
            Testimonials
          </a>
          < a href="#faq"
          className="">
            FAQ 
          </a>
      </div>
      < div className="">
        <Link 
        to="/login"
        className=""
        >
          Login
        </Link>
        <Link 
        to="/signup"
        className=""
        >
          Sign Up
        </Link>
      </div>
      <div className="">
        <button 
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="">

          {isMenuOpen ? (
            <X className=""/>
          ): ( <Menu className=""/>
          )}
        </button>
      </div>
      </div>
    </div>
    </header>
  );
};

export default Header;