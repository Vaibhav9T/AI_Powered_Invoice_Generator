import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, LogOut, ChevronDown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import axiosInstance from '../../utils/axiosInstance'; 
import toast from 'react-hot-toast';

const ProfileDropdown = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [dbUser, setDbUser] = useState(null);

  useEffect(() => {
    const fetchFreshUserData = async () => {
      try {
        const response = await axiosInstance.get('/auth/me');
        setDbUser(response.data);
      } catch (error) {
        console.error("Failed to fetch fresh user data for navbar", error);
      }
    };
    fetchFreshUserData();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout(); 
    toast.success('Logged out successfully');
    navigate('/login'); 
  };

  // 1. Grab whatever name is available
  const displayName = dbUser?.name || user?.name || "User";
  const displayEmail = dbUser?.email || user?.email || "";
  const displayBusiness = dbUser?.businessName || user?.businessName || "Administrator";
  
  // 2. 🔥 BULLETPROOF FIX: Force it to be a String no matter what. This CANNOT crash.
  const initial = String(displayName).charAt(0).toUpperCase();

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none"
      >
        <div className="h-9 w-9 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-400 flex items-center justify-center font-bold border border-blue-200 dark:border-blue-800/50 transition-colors">
          {initial}
        </div>
        <div className="hidden md:block text-left mr-1">
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 leading-tight transition-colors">
            {displayName}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium truncate w-24 transition-colors">
            {displayBusiness}
          </p>
        </div>
        <ChevronDown size={16} className={`text-slate-400 dark:text-slate-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-gray-100 dark:border-slate-700 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="px-4 py-3 border-b border-gray-100 dark:border-slate-700 mb-1">
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">{displayName}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{displayEmail}</p>
          </div>

          <Link
            to="/profile"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-700/50 transition-colors"
          >
            <User size={16} />
            My Profile
          </Link>

          <div className="h-px bg-gray-100 dark:bg-slate-700 my-1"></div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          >
            <LogOut size={16} />
            Log Out
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;