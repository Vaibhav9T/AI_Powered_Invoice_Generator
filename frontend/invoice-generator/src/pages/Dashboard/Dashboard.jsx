import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutGrid, 
  FileText, 
  Plus, 
  User, 
  LogOut,
  Briefcase
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';


const Dashboard = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth(); 

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Helper function to style the active sidebar link
  const getLinkClasses = (path) => {
    const baseClasses = "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors w-full";
    if (location.pathname === path) {
      // Active state: Light blue background with darker blue text (like the screenshot)
      return `${baseClasses} bg-blue-100/50 text-blue-900`;
    }
    // Inactive state: Gray text that darkens on hover
    return `${baseClasses} text-slate-600 hover:bg-gray-200/50 hover:text-slate-900`;
  };

  return (
    // The specific light gray background from the tutorial
    <div className="flex h-screen bg-[#eef0f4] overflow-hidden">
      
      {/* ================= SIDEBAR ================= */}
      <aside className="w-64 flex flex-col justify-between border-r border-gray-200/60">
        
        <div>
          {/* Logo Area */}
          <div className="p-6 flex items-center gap-3">
            <div className="bg-blue-700 p-1.5 rounded-lg">
              <Briefcase className="text-white h-5 w-5" />
            </div>
            <span className="font-bold text-lg text-slate-800 tracking-tight">AI Invoice App</span>
          </div>

          {/* Navigation Links */}
          <nav className="px-4 space-y-1 mt-2">
            <Link to="/dashboard" className={getLinkClasses('/dashboard')}>
              <LayoutGrid size={18} />
              Dashboard
            </Link>
            
            <Link to="/invoices" className={getLinkClasses('/invoices')}>
              <FileText size={18} />
              Invoices
            </Link>
            
            <Link to="/invoices/new" className={getLinkClasses('/invoices/new')}>
              <Plus size={18} />
              Create Invoice
            </Link>
            
            <Link to="/profile" className={getLinkClasses('/profile')}>
              <User size={18} />
              Profile
            </Link>
          </nav>
        </div>

        

        {/* Logout Button (Pinned to bottom) */}
        <div className="p-4 mb-4">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-gray-200/50 rounded-lg transition-colors"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* ================= MAIN CONTENT AREA ================= */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        
        {/* Header */}
        <header className="px-8 py-8 flex justify-between items-start">
          <div>
            <h1 className="text-xl font-bold text-slate-800">
              Welcome back, {user?.name ? user.name.split(' ')[0] : 'John'}!
            </h1>
            <p className="text-sm text-slate-500 mt-1">Here's your invoice overview.</p>
          </div>
          
          {/* Profile Widget (Top Right) */}
          <div className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity">
            <div className="h-10 w-10 rounded-full bg-blue-800 flex items-center justify-center text-white font-semibold text-sm">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'J'}
            </div>
            <div className="hidden sm:block text-left pr-2">
              <p className="text-sm font-medium text-slate-800 leading-tight">
                {user?.name || 'John Doe'}
              </p>
              <p className="text-xs text-slate-500">
                {user?.email || 'john@timetoprogram.com'}
              </p>
            </div>
            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </header>
        
        {/* Dynamic Content (This is where the "Dashboard" text is in your screenshot) */}
        <div className="px-8 pb-8 flex-1">
          {children ? children : (
            <div className="text-slate-800 text-lg">Dashboard</div>
          )}
        </div>
      
      </main>
    </div>
  );
};

export default Dashboard;