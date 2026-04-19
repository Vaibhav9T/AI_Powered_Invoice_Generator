import React from 'react';
import { Menu } from 'lucide-react';
import ProfileDropdown from './ProfileDropdown';
import ThemeToggle from './ThemeToggle';
import { useLocation } from 'react-router-dom';

const Navbar = ({ onMenuClick }) => {
  const location = useLocation();

  // Optional: A little trick to format the page title based on the URL!
  const getPageTitle = () => {
    const path = location.pathname.split('/')[1];
    if (!path) return 'Dashboard';
    // Capitalize the first letter and replace dashes with spaces
    return path.charAt(0).toUpperCase() + path.slice(1).replace('-', ' ');
  };

  return (
    <div className="w-full h-full flex items-center justify-between">
      
      {/* Left Side: Page Title & Mobile Menu Toggle */}
      <div className="flex items-center gap-4">
        {/* Mobile Menu Toggle */}
        <button 
          onClick={onMenuClick}
          className="md:hidden p-2 -ml-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
        >
          <Menu size={20} />
        </button>
        
        {/* Dynamic Page Title */}
        <h2 className="text-lg font-bold text-slate-800 dark:text-white hidden sm:block">
          {getPageTitle()}
        </h2>
      </div>

      {/* Right Side: Toggles and Profile */}
      <div className="flex items-center gap-2 sm:gap-4">
        
        {/* The Dark Mode Switch we built */}
        <ThemeToggle />
        
        {/* A subtle vertical divider */}
        <div className="h-6 w-px bg-gray-200 dark:bg-slate-700 mx-1 hidden sm:block"></div>
        
        {/* The Profile Dropdown we built */}
        <ProfileDropdown />
        
      </div>
    </div>
  );
};

export default Navbar;