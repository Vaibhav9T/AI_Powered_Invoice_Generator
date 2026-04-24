import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Printer, Edit, Mail, Loader2 } from 'lucide-react';
import axiosInstance from '../../utils/axiosInstance';
import toast from 'react-hot-toast'; 
import { useReactToPrint } from 'react-to-print';

const InvoiceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [invoice, setInvoice] = useState(null);
  const [templateConfig, setTemplateConfig] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch both the invoice AND the custom template in parallel
      const [invoiceRes, templateRes] = await Promise.all([
        axiosInstance.get(`/invoices/${id}`),
        axiosInstance.get('/templates').catch(() => ({ data: { data: null } })) // Catch if no template exists yet
      ]);

      setInvoice(invoiceRes.data);

      // Apply saved template or use Fallback defaults
      if (templateRes.data && templateRes.data.data) {
        setTemplateConfig(templateRes.data.data);
      } else {
        setTemplateConfig({
          themeColor: '#1e3a8a', // Default blue
          fontFamily: 'font-sans',
          layoutStyle: 'left',
          pageSize: 'A4'
        });
      }

    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load invoice details.");
      navigate('/invoices');
    } finally {
      setLoading(false);
    }
  };

  // --- THE NEW FLAWLESS PRINT ENGINE ---
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    contentRef: componentRef,
    documentTitle: `Invoice_${invoice?.invoiceNumber || id}`,
    // This forces the browser to keep your colors and exact paper size!
    pageStyle: `
      @page { size: ${templateConfig?.pageSize || 'A4'}; margin: 0mm; }
      @media print {
        body { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
      }
    `
  });

  if (loading || !templateConfig) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="h-10 w-10 animate-spin text-blue-900 mb-4" />
        <p className="text-slate-500 font-medium">Loading invoice design...</p>
      </div>
    );
  }

  if (!invoice) return null;

  // Bulletproof Client Data Extraction
  const clientName = typeof invoice.billTo === 'string' ? invoice.billTo.split('\n')[0] : (invoice.billTo?.clientName || 'Unknown Client');
  const clientEmail = typeof invoice.billTo === 'string' ? '' : (invoice.billTo?.email || '');
  const clientAddress = typeof invoice.billTo === 'string' ? invoice.billTo.replace(clientName, '').trim() : (invoice.billTo?.address || '');
  const clientPhone = typeof invoice.billTo === 'string' ? '' : (invoice.billTo?.phone || '');

  const formatDate = (dateString) => {
    if (!dateString) return 'Not Set';
    const d = new Date(dateString);
    return (!isNaN(d.getTime()) && d.getFullYear() > 1970) 
      ? d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
      : 'Not Set';
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(amount || 0); 
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

      {/* --- THE ACTUAL INVOICE DOCUMENT --- */}
      {/* Wrap it in a scrolling container so large paper sizes fit on mobile screens */}
      <div className="overflow-x-auto w-full flex justify-center bg-gray-100 dark:bg-slate-900 p-4 sm:p-8 rounded-xl print:p-0 print:bg-transparent">
        
        {/* THIS IS THE PAPER. Uses strictly defined dimensions for perfect PDF printing */}
        <div 
          ref={componentRef} 
          className={`bg-white text-black shadow-2xl w-[210mm] min-h-[297mm] p-[15mm] mx-auto print:shadow-none print:w-full print:h-full ${templateConfig.fontFamily}`}
        >
          
          {/* Header Section (Adapts to Left, Right, or Center!) */}
          <div className={`flex items-start border-b-4 pb-6 mb-8
            ${templateConfig.layoutStyle === 'right' ? 'flex-row-reverse justify-between text-right' : 
              templateConfig.layoutStyle === 'center' ? 'flex-col items-center text-center' : 
              'justify-between'}
          `} style={{ borderColor: templateConfig.themeColor }}>
            
            <div className={templateConfig.layoutStyle === 'center' ? 'mb-4 w-full' : ''}>
              <h1 className="text-4xl font-extrabold tracking-widest uppercase" style={{ color: templateConfig.themeColor }}>INVOICE</h1>
              <p className="text-gray-500 mt-1 font-medium">#{invoice.invoiceNumber}</p>
              
              <div className="mt-2">
                {invoice.status === 'Paid' ? (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-green-100 text-green-800 uppercase tracking-wide border border-green-200">Paid</span>
                ) : (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-red-100 text-red-800 uppercase tracking-wide border border-red-200">Unpaid</span>
                )}
              </div>
            </div>

            <div className={templateConfig.layoutStyle === 'center' ? 'w-full text-center' : ''}>
               <h3 className="font-bold text-xl text-gray-800">{invoice.billFrom?.businessName || 'Your Company'}</h3>
               <p className="text-gray-600 text-sm mt-1 whitespace-pre-wrap">{invoice.billFrom?.address}</p>
               <p className="text-gray-600 text-sm mt-1">{invoice.billFrom?.email}</p>
               <p className="text-gray-600 text-sm">{invoice.billFrom?.phone}</p>
            </div>
          </div>

          {/* Dates & Bill To Section */}
          <div className="grid grid-cols-2 gap-8 mb-8">
            <div>
              <h4 className="text-gray-500 font-bold mb-2 uppercase text-sm" style={{ color: templateConfig.themeColor }}>Billed To:</h4>
              <p className="font-bold text-lg text-gray-800">{clientName}</p>
              {clientAddress && <p className="text-gray-600 text-sm mt-1 whitespace-pre-wrap">{clientAddress}</p>}
              {clientEmail && <p className="text-gray-600 text-sm mt-1">{clientEmail}</p>}
              {clientPhone && <p className="text-gray-600 text-sm">{clientPhone}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4 text-right sm:text-left">
              <div>
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">Invoice Date</h3>
                <p className="font-medium text-gray-800">{formatDate(invoice.invoiceDate)}</p>
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">Due Date</h3>
                <p className="font-medium text-gray-800">{formatDate(invoice.dueDate)}</p>
              </div>
              <div className="col-span-2 mt-2">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">Terms</h3>
                <p className="font-medium text-gray-800">{invoice.paymentTerms || 'Net 15'}</p>
              </div>
            </div>
          </div>

          {/* Items Table */}
          <table className="w-full mb-8 text-sm">
            <thead>
              <tr className="border-b-2" style={{ borderColor: templateConfig.themeColor, color: templateConfig.themeColor }}>
                <th className="text-left py-2 font-bold uppercase tracking-wider">Item Description</th>
                <th className="text-center py-2 font-bold uppercase tracking-wider">Qty</th>
                <th className="text-right py-2 font-bold uppercase tracking-wider">Price</th>
                <th className="text-center py-2 font-bold uppercase tracking-wider">Tax</th>
                <th className="text-right py-2 font-bold uppercase tracking-wider">Total</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items && invoice.items.map((item, index) => {
                const baseTotal = item.quantity * (item.unitPrice || 0);
                const taxAmount = baseTotal * ((item.taxRate || item.tax || 0) / 100);
                const itemTotal = baseTotal + taxAmount;

                return (
                  <tr key={index} className="border-b border-gray-200">
                    <td className="py-3 text-gray-800 font-medium">{ item.name || item.description || 'Service'}</td>
                    <td className="text-center py-3 text-gray-600">{item.quantity}</td>
                    <td className="text-right py-3 text-gray-600">{formatCurrency(item.unitPrice || 0)}</td>
                    <td className="text-center py-3 text-gray-600">{item.taxRate || item.tax || 0}%</td>
                    <td className="text-right py-3 text-gray-800 font-medium">{formatCurrency(itemTotal)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Notes & Totals */}
          <div className="flex justify-between items-end gap-8 mb-12">
            
            <div className="w-1/2">
              {invoice.notes && (
                <div>
                  <h4 className="text-sm font-bold uppercase tracking-wider mb-2" style={{ color: templateConfig.themeColor }}>Notes & Instructions</h4>
                  <p className="text-gray-600 text-sm whitespace-pre-wrap">{invoice.notes}</p>
                </div>
              )}
            </div>

            <div className="w-1/2 text-right">
              <div className="flex justify-between py-2 text-gray-600">
                <span>Subtotal:</span>
                <span>{formatCurrency(invoice.subtotal || invoice.total || 0)}</span>
              </div>
              <div className="flex justify-between py-2 text-gray-600">
                <span>Tax:</span>
                <span>{formatCurrency(invoice.taxTotal || 0)}</span>
              </div>
              <div className="flex justify-between py-3 border-t-2 mt-2 font-bold text-xl" style={{ borderColor: templateConfig.themeColor, color: templateConfig.themeColor }}>
                <span>Grand Total:</span>
                <span>{formatCurrency(invoice.total || 0)}</span>
              </div>
            </div>
          </div>

          {/* Footer Notes */}
          <div className="text-sm text-gray-500 border-t pt-4 mt-auto">
            <p className="font-bold text-gray-700" style={{ color: templateConfig.themeColor }}>Thank you for your business!</p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default InvoiceDetail;