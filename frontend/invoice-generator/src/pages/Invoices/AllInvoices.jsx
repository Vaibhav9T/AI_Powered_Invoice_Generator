import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, Plus, Sparkles, Eye, Trash2, Mail, Loader2, X
} from 'lucide-react';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths'; 
import toast from 'react-hot-toast';
import ReminderModal from '../../components/invoices/ReminderModel.jsx';
import UnifiedAiScanner from '../../components/invoices/UnifiedAiScanner.jsx';

const AllInvoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Statuses');
  const navigate = useNavigate();
  
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState(null);

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
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6 relative">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2 transition-colors">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">All Invoices</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Manage all your invoices in one place.</p>
        </div>
        <div className="flex gap-3">
          
          {/* Create with AI Button */}
          <button 
            onClick={() => setIsAIModalOpen(true)}
            className="flex items-center gap-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 px-4 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors text-sm font-medium shadow-sm cursor-pointer"
          >
            <Sparkles size={16} className="text-slate-600 dark:text-slate-400" />
            Create with AI
          </button>

          <Link 
            to="/invoices/new" 
            className="flex items-center gap-2 bg-[#1e2b5e] dark:bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-[#151f43] dark:hover:bg-blue-700 transition-colors text-sm font-medium shadow-sm"
          >
            <Plus size={16} />
            Create Invoice
          </Link>
        </div>
      </div>

      {/* MAIN CONTAINER */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden transition-colors">
        
        {/* Search & Filter Bar */}
        <div className="p-4 border-b border-gray-100 dark:border-slate-700 flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative w-full sm:max-w-lg">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400 dark:text-slate-500" />
            </div>
            <input
              type="text"
              placeholder="Search by invoice # or client..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
          
          <div className="w-full sm:w-48">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
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
              <tr className="bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider border-b border-gray-100 dark:border-slate-700">
                <th className="px-6 py-4 font-semibold">INVOICE #</th>
                <th className="px-6 py-4 font-semibold">CLIENT</th>
                <th className="px-6 py-4 font-semibold">AMOUNT</th>
                <th className="px-6 py-4 font-semibold">DUE DATE</th>
                <th className="px-6 py-4 font-semibold">STATUS</th>
                <th className="px-6 py-4 font-semibold text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-slate-700 bg-white dark:bg-slate-800">
              {isLoading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center">
                    <Loader2 className="h-8 w-8 animate-spin text-slate-400 dark:text-slate-500 mx-auto mb-4" />
                    <p className="text-slate-500 dark:text-slate-400 text-sm">Loading your invoices...</p>
                  </td>
                </tr>
              ) : filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-slate-500 dark:text-slate-400">
                    No invoices found.
                  </td>
                </tr>
              ) : (
                filteredInvoices.map((invoice) => {
                  const isPaid = invoice.status === 'Paid';
                  
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
                      formattedDate = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                    }
                  }

                  const safeTotal = invoice.total || 0;

                  return (
                    <tr key={invoice._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/50 transition-colors group">
                      <td className="px-6 py-4 text-sm font-medium text-slate-900 dark:text-slate-200">
                        {invoice.invoiceNumber || 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-700 dark:text-slate-300">
                        {clientName}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-slate-900 dark:text-slate-200">
                        ${safeTotal.toFixed(2)} {/* Remember to change this to formatCurrency if you want Rupees here too! */}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                        {formattedDate}
                      </td>
                      <td className="px-6 py-4">
                        {isPaid ? (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-[#e6f4ea] dark:bg-green-900/30 text-[#1e8e3e] dark:text-green-400">
                            Paid
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-[#fce8e6] dark:bg-red-900/30 text-[#c5221f] dark:text-red-400">
                            Unpaid
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right flex items-center justify-end gap-3">
                        
                        {!isPaid && (
                          <button 
                            onClick={() => handleMarkPaid(invoice._id)}
                            className="text-xs font-medium text-slate-600 dark:text-slate-300 border border-gray-200 dark:border-slate-700 px-3 py-1.5 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                          >
                            Mark Paid
                          </button>
                        )}
                        
                        <div className="flex items-center gap-1.5 ml-2">
                          <button 
                              onClick={() => navigate(`/invoice/${invoice._id}`)}
                              className="p-1.5 text-slate-400 dark:text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                              title="View Invoice"
                            >
                              <Eye size={16} />
                            </button>
                          
                          <button 
                            onClick={() => handleDelete(invoice._id)}
                            className="p-1.5 text-[#c5221f] dark:text-red-400 opacity-80 hover:opacity-100 transition-opacity"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                          
                          <button 
                            className="p-1.5 text-blue-600 dark:text-blue-400 opacity-80 hover:opacity-100 transition-opacity"
                            title="Send Reminder"
                            onClick={() => {
                              setIsReminderModalOpen(true);
                              setSelectedInvoiceId(invoice._id);
                            }}
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

      {/* 🔥 THE NEW AI SCANNER MODAL 🔥 */}
      {isAIModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-xl rounded-2xl shadow-2xl relative border border-gray-200 dark:border-slate-700 overflow-hidden">
            
            {/* Modal Header & Close Button */}
            <div className="flex justify-between items-center p-4 border-b border-gray-100 dark:border-slate-800">
              <h3 className="font-semibold text-slate-800 dark:text-white flex items-center gap-2">
                <Sparkles size={18} className="text-blue-500" />
                Scan Invoice
              </h3>
              <button 
                onClick={() => setIsAIModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-800 rounded-full transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <UnifiedAiScanner 
                onComplete={(aiData) => {
                  setIsAIModalOpen(false); // 1. Close the modal
                  navigate('/invoices/new', { state: { aiData: aiData } }); // 2. Send user to the Create page with data!
                }} 
              />
            </div>

          </div>
        </div>
      )}
      
      {/* Reminder Modal */}
      <ReminderModal
        isOpen={isReminderModalOpen}
        onClose={() => {
          setIsReminderModalOpen(false);
          setSelectedInvoiceId(null);
        }}
        invoiceId={selectedInvoiceId}
      />
    </div>
  );
};

export default AllInvoices;