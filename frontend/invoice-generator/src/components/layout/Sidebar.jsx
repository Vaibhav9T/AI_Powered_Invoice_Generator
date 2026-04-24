import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  Plus, 
  User, 
  LogOut,
  BriefcaseBusiness,
  LayoutTemplate,
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import Logo from '../ui/Logo';

const Sidebar = ({ onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  // Helper function to check if a link is active
  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Invoices', path: '/invoices', icon: <FileText size={20} /> },
    { name: 'Create Invoice', path: '/invoices/new', icon: <Plus size={20} /> },
    { name: 'Profile', path: '/profile', icon: <User size={20} /> },
    { name: 'Templates', path: '/templates', icon: <LayoutTemplate size={20} /> },
  ];

  return (
    <div className="h-full flex flex-col bg-white dark:bg-[#0f172a] transition-colors duration-300">
      
      {/* App Logo & Name */}
      <div className="h-[72px] flex items-center justify-between px-6 border-b border-transparent">
        {/* 1. Logo Section */}
          <Logo />
        {/* Close button for mobile */}
        <button 
          onClick={onClose}
          className="md:hidden p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
        >
          <X size={20} />
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        {navLinks.map((link) => (
          <Link
            key={link.name}
            to={link.path}
            onClick={onClose}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
              isActive(link.path)
                ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400' // Active Style
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-200' // Inactive Style
            }`}
          >
            {link.icon}
            {link.name}
          </Link>
        ))}
      </nav>

      {/* Bottom Logout Button */}
      <div className="p-4 border-t border-gray-100 dark:border-slate-800/50">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-colors"
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;