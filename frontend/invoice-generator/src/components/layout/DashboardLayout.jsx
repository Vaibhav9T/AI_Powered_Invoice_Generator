import React from 'react';
import { Outlet } from 'react-router-dom'; 
import Sidebar from './Sidebar'; // Ensure this path points to your Sidebar.jsx
import Navbar from './Navbar';   // Ensure this path points to your Navbar.jsx

const DashboardLayout = () => { 
  return (
    <div className="flex h-screen w-full bg-slate-50 dark:bg-slate-900 transition-colors duration-300 overflow-hidden">
      
      {/* =========================================
          LEFT SIDE: THE SIDEBAR
      ========================================= */}
      <div className="w-64 flex-shrink-0 border-r border-gray-200 dark:border-slate-800 bg-white dark:bg-[#0f172a] transition-colors hidden md:block">
        <Sidebar />
      </div>

      {/* =========================================
          RIGHT SIDE: HEADER & MAIN CONTENT
      ========================================= */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* TOP HEADER */}
        <header className="h-[72px] border-b border-gray-200 dark:border-slate-800 bg-white dark:bg-[#0f172a] transition-colors flex items-center justify-between px-6 z-10 shadow-sm">
          <Navbar />
        </header>

        {/* THE DYNAMIC PAGE CONTENT */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {/* The Outlet acts as a window that shows the current page */}
            <Outlet /> 
          </div>
        </main>

      </div>
    </div>
  );
};

export default DashboardLayout;