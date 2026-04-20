import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Printer, Edit, Mail, Loader2 } from 'lucide-react';
import axiosInstance from '../../utils/axiosInstance';
import toast from 'react-hot-toast'; 

const InvoiceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInvoiceDetails();
  }, [id]);

  const fetchInvoiceDetails = async () => {
    try {
      setLoading(true);
      // Fetching the single invoice by its ID
      const response = await axiosInstance.get(`/invoices/${id}`);
      setInvoice(response.data);
    } catch (error) {
      console.error("Error fetching invoice details:", error);
      toast.error("Failed to load invoice details.");
      navigate('/invoices'); // Redirect back if not found
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="h-10 w-10 animate-spin text-blue-900 mb-4" />
        <p className="text-slate-500 font-medium">Loading invoice details...</p>
      </div>
    );
  }

  if (!invoice) return null;

  // Bulletproof Client Data Extraction (Handles both String and Object formats)
  const clientName = typeof invoice.billTo === 'string' ? invoice.billTo.split('\n')[0] : (invoice.billTo?.clientName || 'Unknown Client');
  const clientEmail = typeof invoice.billTo === 'string' ? '' : (invoice.billTo?.email || '');
  const clientAddress = typeof invoice.billTo === 'string' ? invoice.billTo.replace(clientName, '').trim() : (invoice.billTo?.address || '');
  const clientPhone = typeof invoice.billTo === 'string' ? '' : (invoice.billTo?.phone || '');

  // Format Dates Safely
  const formatDate = (dateString) => {
    if (!dateString) return 'Not Set';
    const d = new Date(dateString);
    return (!isNaN(d.getTime()) && d.getFullYear() > 1970) 
      ? d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
      : 'Not Set';
  };

   // --- Currency Formatting ---
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(amount || 0); // Added '|| 0' as a safety net for empty dashboards
  };


  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      
      {/* ACTION BAR (Hidden when printing) */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4 print:hidden">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors font-medium"
        >
          <ArrowLeft size={20} className="mr-2" /> Back to Invoices
        </button>
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button 
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 px-4 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors text-sm font-medium shadow-sm"
          >
            <Mail size={16} /> Send
          </button>
          <Link 
            to={`/invoices/edit/${invoice._id}`}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 px-4 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors text-sm font-medium shadow-sm"
          >
            <Edit size={16} /> Edit
          </Link>
          <button 
            onClick={handlePrint}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-blue-900 dark:bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-800 dark:hover:bg-blue-700 transition-colors text-sm font-medium shadow-sm"
          >
            <Printer size={16} /> Print / PDF
          </button>
        </div>
      </div>

      {/* THE ACTUAL INVOICE DOCUMENT */}
      <div id="printable-invoice" className="bg-white dark:bg-slate-800 rounded-xl shadow-md border border-gray-200 dark:border-slate-700 overflow-hidden print:shadow-none print:border-none print:m-0 transition-colors">
        
        {/* Top Color Bar */}
        <div className="h-4 bg-blue-900 dark:bg-blue-600 w-full"></div>

        <div className="p-8 sm:p-12">
          
          {/* Invoice Header */}
          <div className="flex flex-col md:flex-row justify-between items-start mb-12 gap-8">
            <div>
              <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white uppercase tracking-wider mb-2">Invoice</h1>
              <p className="text-lg text-slate-500 dark:text-slate-400 font-medium">#{invoice.invoiceNumber}</p>
              
              <div className="mt-4">
                {invoice.status === 'Paid' ? (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-[#e6f4ea] dark:bg-green-900/30 text-[#1e8e3e] dark:text-green-400 uppercase tracking-wide">
                    Paid
                  </span>
                ) : (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-[#fce8e6] dark:bg-red-900/30 text-[#c5221f] dark:text-red-400 uppercase tracking-wide">
                    Unpaid
                  </span>
                )}
              </div>
            </div>

            <div className="text-left md:text-right">
              <h2 className="text-xl font-bold text-slate-800 dark:text-white">{invoice.billFrom?.businessName || 'Your Company'}</h2>
              <p className="text-slate-500 dark:text-slate-400 mt-1 whitespace-pre-wrap">{invoice.billFrom?.address}</p>
              <p className="text-slate-500 dark:text-slate-400">{invoice.billFrom?.email}</p>
              <p className="text-slate-500 dark:text-slate-400">{invoice.billFrom?.phone}</p>
            </div>
          </div>

          {/* Dates & Bill To Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 pb-8 border-b border-gray-100 dark:border-slate-700">
            <div>
              <h3 className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3">Bill To</h3>
              <p className="text-lg font-bold text-slate-800 dark:text-white">{clientName}</p>
              {clientAddress && <p className="text-slate-600 dark:text-slate-400 mt-1 whitespace-pre-wrap">{clientAddress}</p>}
              {clientEmail && <p className="text-slate-600 dark:text-slate-400">{clientEmail}</p>}
              {clientPhone && <p className="text-slate-600 dark:text-slate-400">{clientPhone}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">Invoice Date</h3>
                <p className="font-medium text-slate-800 dark:text-slate-200">{formatDate(invoice.invoiceDate)}</p>
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">Due Date</h3>
                <p className="font-medium text-slate-800 dark:text-slate-200">{formatDate(invoice.dueDate)}</p>
              </div>
              <div className="col-span-2 mt-2">
                <h3 className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">Payment Terms</h3>
                <p className="font-medium text-slate-800 dark:text-slate-200">{invoice.paymentTerms || 'Net 15'}</p>
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="mb-12 overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-900/50 border-y border-gray-200 dark:border-slate-700">
                  <th className="py-3 px-4 font-bold text-slate-700 dark:text-slate-300 text-sm uppercase tracking-wider">Item Description</th>
                  <th className="py-3 px-4 font-bold text-slate-700 dark:text-slate-300 text-sm uppercase tracking-wider text-center">Qty</th>
                  <th className="py-3 px-4 font-bold text-slate-700 dark:text-slate-300 text-sm uppercase tracking-wider text-right">Price</th>
                  <th className="py-3 px-4 font-bold text-slate-700 dark:text-slate-300 text-sm uppercase tracking-wider text-center">Tax</th>
                  <th className="py-3 px-4 font-bold text-slate-700 dark:text-slate-300 text-sm uppercase tracking-wider text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
                {invoice.items && invoice.items.map((item, index) => {
                  const baseTotal = item.quantity * (item.unitPrice || 0);
                  const taxAmount = baseTotal * ((item.taxRate || item.tax || 0) / 100);
                  const itemTotal = baseTotal + taxAmount;

                  return (
                    <tr key={index}>
                      <td className="py-4 px-4 text-slate-800 dark:text-slate-200 font-medium">{ item.name || item.description || 'Service'}</td>
                      <td className="py-4 px-4 text-slate-600 dark:text-slate-400 text-center">{item.quantity}</td>
                      <td className="py-4 px-4 text-slate-600 dark:text-slate-400 text-right">{formatCurrency(item.unitPrice || 0)}</td>
                      <td className="py-4 px-4 text-slate-600 dark:text-slate-400 text-center">{item.taxRate || item.tax || 0}%</td>
                      <td className="py-4 px-4 text-slate-800 dark:text-slate-200 font-bold text-right">{formatCurrency(itemTotal)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Totals Section */}
          <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-12">
            
            {/* Notes Section */}
            <div className="w-full md:w-1/2">
              {invoice.notes && (
                <div>
                  <h3 className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Notes & Instructions</h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg border border-slate-100 dark:border-slate-700 whitespace-pre-wrap">
                    {invoice.notes}
                  </p>
                </div>
              )}
            </div>

            {/* Calculations */}
            <div className="w-full md:w-1/3 space-y-3 text-slate-600 dark:text-slate-400 text-right">
              <div className="flex justify-between items-center px-4">
                <span className="font-medium">Subtotal:</span>
                <span>{formatCurrency(invoice.subtotal || invoice.total || 0)}</span>
              </div>
              <div className="flex justify-between items-center px-4">
                <span className="font-medium">Tax:</span>
                <span>{formatCurrency(invoice.taxTotal || 0)}</span>
              </div>
              <div className="border-t border-slate-200 dark:border-slate-700 pt-3 flex justify-between items-center px-4">
                <span className="text-lg font-bold text-slate-800 dark:text-white uppercase tracking-wider">Grand Total:</span>
                <span className="text-2xl font-extrabold text-blue-900 dark:text-blue-400">{formatCurrency(invoice.total || 0)}</span>
              </div>
            </div>
          </div>

          {/* Footer Signature Area */}
          <div className="pt-8 border-t border-slate-200 dark:border-slate-700 flex justify-center text-slate-400 dark:text-slate-500 text-sm">
            <p>Thank you for your business!</p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default InvoiceDetail;