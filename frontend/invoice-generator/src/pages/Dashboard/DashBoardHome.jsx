import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileText, DollarSign } from 'lucide-react';
import axiosInstance from '../../utils/axiosInstance';
import AIInsights from '../../components/AIInsights.jsx';
import { API_PATHS } from '../../utils/apiPaths.js';
import { useAuth } from '../../context/AuthContext'; // 🔥 Added Auth Context to get user name

const DashboardHome = () => {
  const { user } = useAuth(); // 🔥 Get the user here!
  const [recentInvoices, setRecentInvoices] = useState([]);
  const [dbUser, setDbUser] = useState(null);
  const [stats, setStats] = useState({
    totalInvoices: 0,
    totalPaid: 0,
    totalUnpaid: 0
  });

  useEffect(() => {
    const fetchFreshUserData = async () => {
      try {
        const response = await axiosInstance.get('/users/profile');
        setDbUser(response.data);
      } catch (error) {
        console.error("Failed to fetch fresh user data for dashboard", error);
      }
    };
    fetchFreshUserData();
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.INVOICE_API.GET_ALL);
      const allInvoices = response.data;
      
      setRecentInvoices(allInvoices.slice(0, 5));

      let paid = 0;
      let unpaid = 0;

      allInvoices.forEach(invoice => {
        if (invoice.status === 'Paid') {
          paid += invoice.total || 0;
        } else {
          unpaid += invoice.total || 0;
        }
      });

      setStats({
        totalInvoices: allInvoices.length,
        totalPaid: paid,
        totalUnpaid: unpaid
      });

    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* ================= WELCOME HEADER ================= */}
      {/* 🔥 Moved this here so it ONLY shows on the Home Dashboard! */}
      <div className="mb-2">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white transition-colors">
          Welcome back, {(dbUser?.name || user?.name || 'User').split(' ')[0]}!
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1 transition-colors">
          Here's your invoice overview.
        </p>
      </div>

      {/* ================= METRIC CARDS ================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Total Invoices Card */}
        <div className="bg-white dark:bg-slate-800 border border-gray-200/60 dark:border-slate-700 rounded-xl p-5 flex items-center gap-4 shadow-sm transition-colors">
          <div className="h-12 w-12 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center">
            <FileText className="text-blue-600 dark:text-blue-400 h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-0.5">Total Invoices</p>
            <h3 className="text-2xl font-bold text-slate-800 dark:text-white">{stats.totalInvoices}</h3>
          </div>
        </div>

        {/* Total Paid Card */}
        <div className="bg-white dark:bg-slate-800 border border-gray-200/60 dark:border-slate-700 rounded-xl p-5 flex items-center gap-4 shadow-sm transition-colors">
          <div className="h-12 w-12 rounded-lg bg-green-50 dark:bg-green-900/30 flex items-center justify-center">
            <DollarSign className="text-green-600 dark:text-green-400 h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-0.5">Total Paid</p>
            <h3 className="text-2xl font-bold text-slate-800 dark:text-white">${stats.totalPaid.toFixed(2)}</h3>
          </div>
        </div>

        {/* Total Unpaid Card */}
        <div className="bg-white dark:bg-slate-800 border border-gray-200/60 dark:border-slate-700 rounded-xl p-5 flex items-center gap-4 shadow-sm transition-colors">
          <div className="h-12 w-12 rounded-lg bg-red-50 dark:bg-red-900/30 flex items-center justify-center">
            <DollarSign className="text-red-600 dark:text-red-400 h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-0.5">Total Unpaid</p>
            <h3 className="text-2xl font-bold text-slate-800 dark:text-white">${stats.totalUnpaid.toFixed(2)}</h3>
          </div>
        </div>
      </div>

      <AIInsights invoices={recentInvoices} />

      {/* ================= RECENT INVOICES TABLE ================= */}
      <div className="bg-white dark:bg-slate-800 border border-gray-200/60 dark:border-slate-700 rounded-xl shadow-sm overflow-hidden mt-6 transition-colors">
        
        <div className="px-6 py-5 border-b border-gray-200/60 dark:border-slate-700 flex justify-between items-center">
          <h2 className="text-lg font-bold text-slate-800 dark:text-white tracking-tight">Recent Invoices</h2>
          <Link to="/invoices" className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition-colors">
            View All
          </Link>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-slate-400 dark:text-slate-500 text-xs uppercase tracking-wider border-b border-gray-200/60 dark:border-slate-700">
                <th className="px-6 py-4 font-medium">CLIENT</th>
                <th className="px-6 py-4 font-medium">AMOUNT</th>
                <th className="px-6 py-4 font-medium">STATUS</th>
                <th className="px-6 py-4 font-medium">DUE DATE</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200/60 dark:divide-slate-700">
              {recentInvoices.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-slate-500 dark:text-slate-400">
                    No recent invoices found.
                  </td>
                </tr>
              ) : (
                recentInvoices.map((invoice) => {
                  
                  let clientName = 'Unknown Client';
                  if (typeof invoice.billTo === 'string' && invoice.billTo.trim() !== '') {
                    clientName = invoice.billTo.split('\n')[0];
                  } else if (invoice.billTo && invoice.billTo.clientName) {
                    clientName = invoice.billTo.clientName; 
                  }

                  let formattedDate = 'Not set';
                  if (invoice.dueDate) {
                    const d = new Date(invoice.dueDate);
                    if (!isNaN(d.getTime()) && d.getFullYear() > 1970) {
                      formattedDate = d.toLocaleDateString('en-US', { 
                        month: 'short', day: 'numeric', year: 'numeric' 
                      });
                    }
                  }

                  const safeTotal = invoice.total || 0;

                  return (
                    <tr key={invoice._id} className="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="text-sm font-semibold text-slate-800 dark:text-slate-200">{clientName}</div>
                        <div className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">#{invoice.invoiceNumber || 'INV-000'}</div>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-slate-800 dark:text-slate-200">
                        ${safeTotal.toFixed(2)}
                      </td>
                      <td className="px-6 py-4">
                        {invoice.status === 'Paid' ? (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
                            Paid
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400">
                            Unpaid
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">
                        {formattedDate}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default DashboardHome;