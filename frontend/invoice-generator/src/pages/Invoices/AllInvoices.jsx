import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, Plus, Sparkles, Edit, Trash2, Mail, Loader2, Eye
} from 'lucide-react';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths'; 
import toast from 'react-hot-toast';
import AIGenerateModal from '../../components/invoices/AIGenerate.jsx';

const AllInvoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Statuses');
  const navigate = useNavigate();
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get(API_PATHS.INVOICE_API.GET_ALL);
      setInvoices(response.data);
    } catch (error) {
      console.error("Error fetching invoices:", error);
      toast.error("Failed to load invoices");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this invoice?")) {
      try {
        // 🔥 Change this line to use the exact raw URL:
        await axiosInstance.delete(`/invoices/${id}`);
        
        setInvoices(invoices.filter(inv => inv._id !== id));
        toast.success("Invoice deleted successfully");
      } catch (error) {
        console.error("Error deleting invoice:", error);
        toast.error("Failed to delete invoice");
      }
    }
  };

  const handleMarkPaid = async (id) => {
    try {
      await axiosInstance.put(`/invoices/${id}`, { status: 'Paid' });
      setInvoices(invoices.map(inv => 
        inv._id === id ? { ...inv, status: 'Paid' } : inv
      ));
      toast.success("Invoice marked as paid!");
    } catch (error) {
      console.error("Error marking as paid:", error);
      toast.error("Failed to update status");
    }
  };




  const filteredInvoices = invoices.filter(invoice => {
    // Bulletproof client extraction for searching
    let clientName = '';
    if (typeof invoice.billTo === 'string') clientName = invoice.billTo;
    else if (invoice.billTo && invoice.billTo.clientName) clientName = invoice.billTo.clientName;

    const matchesSearch = 
      (invoice.invoiceNumber || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      clientName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'All Statuses' || invoice.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">All Invoices</h1>
          <p className="text-slate-500 text-sm mt-1">Manage all your invoices in one place.</p>
        </div>
        <div className="flex gap-3">
          
          {/* 🔥 CHANGED FROM <Link> TO <button> 🔥 */}
          <button 
            onClick={() => setIsAIModalOpen(true)}
            className="flex items-center gap-2 bg-white border border-gray-200 text-slate-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium shadow-sm cursor-pointer"
          >
            <Sparkles size={16} className="text-slate-600" />
            Create with AI
          </button>

          <Link 
            to="/invoices/new" 
            className="flex items-center gap-2 bg-[#1e2b5e] text-white px-4 py-2 rounded-lg hover:bg-[#151f43] transition-colors text-sm font-medium shadow-sm"
          >
            <Plus size={16} />
            Create Invoice
          </Link>
        </div>
      </div>

      {/* MAIN CONTAINER */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        
        {/* Search & Filter Bar */}
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative w-full sm:max-w-lg">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by invoice # or client..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg bg-white text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
          
          <div className="w-full sm:w-48">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-200 rounded-lg bg-white text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
            >
              <option value="All Statuses">All Statuses</option>
              <option value="Paid">Paid</option>
              <option value="Unpaid">Unpaid</option>
              <option value="Pending">Pending</option>
            </select>
          </div>
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white text-slate-500 text-xs uppercase tracking-wider border-b border-gray-100">
                <th className="px-6 py-4 font-semibold">INVOICE #</th>
                <th className="px-6 py-4 font-semibold">CLIENT</th>
                <th className="px-6 py-4 font-semibold">AMOUNT</th>
                <th className="px-6 py-4 font-semibold">DUE DATE</th>
                <th className="px-6 py-4 font-semibold">STATUS</th>
                <th className="px-6 py-4 font-semibold text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {isLoading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center">
                    <Loader2 className="h-8 w-8 animate-spin text-slate-400 mx-auto mb-4" />
                    <p className="text-slate-500 text-sm">Loading your invoices...</p>
                  </td>
                </tr>
              ) : filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-slate-500">
                    No invoices found.
                  </td>
                </tr>
              ) : (
                filteredInvoices.map((invoice) => {
                  const isPaid = invoice.status === 'Paid';
                  
                  // Bulletproof client name extraction
                  let clientName = 'Unknown Client';
                  if (typeof invoice.billTo === 'string' && invoice.billTo.trim() !== '') {
                    clientName = invoice.billTo.split('\n')[0];
                  } else if (invoice.billTo && invoice.billTo.clientName) {
                    clientName = invoice.billTo.clientName;
                  }
                  
                  // Bulletproof date formatting
                  let formattedDate = 'Not set';
                  if (invoice.dueDate) {
                    const d = new Date(invoice.dueDate);
                    if (!isNaN(d.getTime()) && d.getFullYear() > 1970) {
                      formattedDate = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                    }
                  }

                  const safeTotal = invoice.total || 0;

                  return (
                    <tr key={invoice._id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-6 py-4 text-sm font-medium text-slate-900">
                        {invoice.invoiceNumber || 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-700">
                        {clientName}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-slate-900">
                        ${safeTotal.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {formattedDate}
                      </td>
                      <td className="px-6 py-4">
                        {isPaid ? (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-[#e6f4ea] text-[#1e8e3e]">
                            Paid
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-[#fce8e6] text-[#c5221f]">
                            Unpaid
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right flex items-center justify-end gap-3">
                        
                        {!isPaid && (
                          <button 
                            onClick={() => handleMarkPaid(invoice._id)}
                            className="text-xs font-medium text-slate-600 border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors"
                          >
                            Mark Paid
                          </button>
                        )}
                        
                        <div className="flex items-center gap-1.5 ml-2">
                          <button 
                              onClick={() => navigate(`/invoice/${invoice._id}`)}
                              className="p-1.5 text-slate-400 hover:text-blue-600 transition-colors"
                              title="View Invoice"
                            >
                              <Eye size={16} />
                            </button>
                          
                          <button 
                            onClick={() => handleDelete(invoice._id)}
                            className="p-1.5 text-[#c5221f] opacity-80 hover:opacity-100 transition-opacity"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                          
                          <button 
                            className="p-1.5 text-blue-600 opacity-80 hover:opacity-100 transition-opacity"
                            title="Send Reminder"
                          >
                            <Mail size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
      <AIGenerateModal 
        isOpen={isAIModalOpen} 
        onClose={() => setIsAIModalOpen(false)} 
      />
    </div>
  );
};

export default AllInvoices;