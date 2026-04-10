import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileText, DollarSign } from 'lucide-react';
import axiosInstance from '../../utils/axiosInstance';
import AIInsights from '../../components/AIInsights.jsx';
const DashboardHome = () => {
  const [recentInvoices, setRecentInvoices] = useState([]);
  const [stats, setStats] = useState({
    totalInvoices: 0,
    totalPaid: 0,
    totalUnpaid: 0
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch all invoices for the logged-in user
      const response = await axiosInstance.get('/api/invoices');
      const allInvoices = response.data;
      
      // Get the 5 most recent invoices for the table
      setRecentInvoices(allInvoices.slice(0, 5));

      // Calculate the metrics for the top cards
      let paid = 0;
      let unpaid = 0;

      allInvoices.forEach(invoice => {
        if (invoice.status === 'Paid') {
          paid += invoice.total;
        } else {
          unpaid += invoice.total;
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
      
      {/* ================= METRIC CARDS ================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Total Invoices Card */}
        <div className="bg-[#e9ecef] border border-gray-200/60 rounded-xl p-5 flex items-center gap-4 shadow-sm">
          <div className="h-12 w-12 rounded-lg bg-[#dbe4ff] flex items-center justify-center">
            <FileText className="text-[#4c6ef5] h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 mb-0.5">Total Invoices</p>
            <h3 className="text-2xl font-bold text-slate-800">{stats.totalInvoices}</h3>
          </div>
        </div>

        {/* Total Paid Card */}
        <div className="bg-[#e9ecef] border border-gray-200/60 rounded-xl p-5 flex items-center gap-4 shadow-sm">
          <div className="h-12 w-12 rounded-lg bg-[#d3f9d8] flex items-center justify-center">
            <DollarSign className="text-[#37b24d] h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 mb-0.5">Total Paid</p>
            <h3 className="text-2xl font-bold text-slate-800">{stats.totalPaid.toFixed(2)}</h3>
          </div>
        </div>

        {/* Total Unpaid Card */}
        <div className="bg-[#e9ecef] border border-gray-200/60 rounded-xl p-5 flex items-center gap-4 shadow-sm">
          <div className="h-12 w-12 rounded-lg bg-[#ffe3e3] flex items-center justify-center">
            <DollarSign className="text-[#f03e3e] h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 mb-0.5">Total Unpaid</p>
            <h3 className="text-2xl font-bold text-slate-800">{stats.totalUnpaid.toFixed(2)}</h3>
          </div>
        </div>
      </div>
        <AIInsights />
      {/* ================= RECENT INVOICES TABLE ================= */}
      <div className="bg-[#e9ecef] border border-gray-200/60 rounded-xl shadow-sm overflow-hidden mt-6">
        
        {/* Table Header Area */}
        <div className="px-6 py-5 border-b border-gray-200/60 flex justify-between items-center">
          <h2 className="text-lg font-bold text-slate-800 tracking-tight">Recent Invoices</h2>
          <Link to="/invoices" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
            View All
          </Link>
        </div>
        
        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-slate-400 text-xs uppercase tracking-wider border-b border-gray-200/60">
                <th className="px-6 py-4 font-medium">CLIENT</th>
                <th className="px-6 py-4 font-medium">AMOUNT</th>
                <th className="px-6 py-4 font-medium">STATUS</th>
                <th className="px-6 py-4 font-medium">DUE DATE</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200/60">
              {recentInvoices.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-slate-500">
                    No recent invoices found.
                  </td>
                </tr>
              ) : (
                recentInvoices.map((invoice) => {
                  // Safely format the client name and date
                  const clientName = invoice.billTo ? invoice.billTo.split('\n')[0] : 'Unknown Client';
                  const formattedDate = new Date(invoice.dueDate).toLocaleDateString('en-US', { 
                    month: 'short', day: 'numeric', year: 'numeric' 
                  });

                  return (
                    <tr key={invoice._id} className="hover:bg-gray-200/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="text-sm font-semibold text-slate-800">{clientName}</div>
                        <div className="text-xs text-slate-400 mt-0.5">#{invoice.invoiceNumber || 'INV-000'}</div>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-slate-800">
                        ${invoice.total.toFixed(2)}
                      </td>
                      <td className="px-6 py-4">
                        {invoice.status === 'Paid' ? (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-[#d3f9d8] text-[#2b8a3e]">
                            Paid
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-[#ffe3e3] text-[#c92a2a]">
                            Unpaid
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500">
                        {formattedDate === 'Invalid Date' ? 'Not set' : formattedDate}
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