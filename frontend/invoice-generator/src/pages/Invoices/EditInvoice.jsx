import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { Plus, Trash2, Save, ArrowLeft, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

// Custom UI Components
import { InputField } from "../../components/ui/InputField.jsx";
import { TextareaField } from "../../components/ui/TextareaField.jsx";
import { SelectField } from "../../components/ui/SelectField.jsx";

const EditInvoice = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Grab the invoice ID from the URL

  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(true);

  const [formData, setFormData] = useState({
    invoiceNumber: "",
    invoiceDate: "",
    dueDate: "",
    billFrom: { businessName: "", email: "", address: "", phone: "" },
    billTo: { clientName: "", email: "", address: "", phone: "" },
    items: [],
    notes: "",
    paymentTerms: "Net 15",
    status: "Unpaid"
  });

  // 1. Fetch the existing invoice data when the page loads
  useEffect(() => {
    fetchInvoiceData();
  }, [id]);

  const fetchInvoiceData = async () => {
    try {
      const response = await axiosInstance.get(`/invoices/${id}`);
      const data = response.data;

      // Bulletproof check for older string-based test data
      let parsedBillTo = { clientName: "", email: "", address: "", phone: "" };
      if (typeof data.billTo === 'object' && data.billTo !== null) {
        parsedBillTo = data.billTo;
      } else if (typeof data.billTo === 'string') {
        parsedBillTo.clientName = data.billTo.split('\n')[0] || "";
      }

      // Populate the form with the fetched data
      setFormData({
        ...data,
        invoiceDate: data.invoiceDate ? data.invoiceDate.split("T")[0] : "",
        dueDate: data.dueDate ? data.dueDate.split("T")[0] : "",
        billTo: parsedBillTo,
        billFrom: data.billFrom || { businessName: "", email: "", address: "", phone: "" },
      });
    } catch (error) {
      console.error("Error fetching invoice:", error);
      toast.error("Failed to load invoice data");
      navigate("/invoices"); // Send them back if the ID is invalid
    } finally {
      setFetchingData(false);
    }
  };

  const handleAddItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { name: "", quantity: 1, unitPrice: 0, tax: 0 }],
    });
  };

  const handleRemoveItem = (index) => {
    const newItems = formData.items.filter((_, i) => i !== index);
    setFormData({ ...formData, items: newItems });
  };

  // Math Calculations
  const calculateItemTotal = (item) => {
    const baseTotal = item.quantity * item.unitPrice;
    const taxAmount = baseTotal * ((item.tax || 0) / 100);
    return baseTotal + taxAmount;
  };

  const calculateSubtotal = () => formData.items.reduce((acc, item) => acc + (item.quantity * item.unitPrice), 0);
  const calculateTotalTax = () => formData.items.reduce((acc, item) => acc + ((item.quantity * item.unitPrice) * ((item.tax || 0) / 100)), 0);
  const calculateGrandTotal = () => calculateSubtotal() + calculateTotalTax();

  // 2. Submit the UPDATED data to the backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { ...formData, total: calculateGrandTotal() };
      // Notice we use PUT instead of POST here to update!
      await axiosInstance.put(`/invoices/${id}`, payload);
      toast.success("Invoice updated successfully!");
      navigate(`/invoice/${id}`); // Go back to the details page after saving
    } catch (error) {
      toast.error("Failed to update invoice");
    } finally {
      setLoading(false);
    }
  };

  const paymentTermsOptions = [
    { value: "Due on Receipt", label: "Due on Receipt" },
    { value: "Net 15", label: "Net 15" },
    { value: "Net 30", label: "Net 30" },
    { value: "Net 60", label: "Net 60" }
  ];
  
  const statusOptions = [
    { value: "Unpaid", label: "Unpaid" },
    { value: "Paid", label: "Paid" },
    { value: "Pending", label: "Pending" }
  ];

  if (fetchingData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600 mb-4" />
        <p className="text-slate-500 dark:text-slate-400 font-medium">Loading invoice data...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">
      
      <div className="flex items-center justify-between mb-6">
        <button onClick={() => navigate(-1)} className="flex items-center text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors">
          <ArrowLeft size={20} className="mr-2" /> Back
        </button>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Edit Invoice</h1>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit}>
        
        {/* TOP PANEL: Invoice Details */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm grid grid-cols-1 md:grid-cols-4 gap-6 transition-colors">
          <InputField label="Invoice Number" type="text" value={formData.invoiceNumber} onChange={(e) => setFormData({...formData, invoiceNumber: e.target.value})} />
          <InputField label="Invoice Date" type="date" value={formData.invoiceDate} onChange={(e) => setFormData({...formData, invoiceDate: e.target.value})} />
          <InputField label="Due Date" type="date" value={formData.dueDate} onChange={(e) => setFormData({...formData, dueDate: e.target.value})} />
          <SelectField label="Status" options={statusOptions} value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})} />
        </div>

        {/* MIDDLE PANEL: Bill From & Bill To */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm space-y-4 transition-colors">
            <h3 className="font-bold text-slate-800 dark:text-white text-lg mb-2">Bill From</h3>
            <InputField label="Business Name" type="text" value={formData.billFrom.businessName} onChange={(e) => setFormData({...formData, billFrom: {...formData.billFrom, businessName: e.target.value}})} />
            <InputField label="Email" type="email" value={formData.billFrom.email} onChange={(e) => setFormData({...formData, billFrom: {...formData.billFrom, email: e.target.value}})} />
            <TextareaField label="Address" value={formData.billFrom.address} onChange={(e) => setFormData({...formData, billFrom: {...formData.billFrom, address: e.target.value}})} />
            <InputField label="Phone" type="text" value={formData.billFrom.phone} onChange={(e) => setFormData({...formData, billFrom: {...formData.billFrom, phone: e.target.value}})} />
          </div>

          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm space-y-4 transition-colors">
            <h3 className="font-bold text-slate-800 dark:text-white text-lg mb-2">Bill To</h3>
            <InputField label="Client Name" type="text" value={formData.billTo.clientName} onChange={(e) => setFormData({...formData, billTo: {...formData.billTo, clientName: e.target.value}})} />
            <InputField label="Client Email" type="email" value={formData.billTo.email} onChange={(e) => setFormData({...formData, billTo: {...formData.billTo, email: e.target.value}})} />
            <TextareaField label="Client Address" value={formData.billTo.address} onChange={(e) => setFormData({...formData, billTo: {...formData.billTo, address: e.target.value}})} />
            <InputField label="Client Phone" type="text" value={formData.billTo.phone} onChange={(e) => setFormData({...formData, billTo: {...formData.billTo, phone: e.target.value}})} />
          </div>
        </div>

        {/* ITEMS PANEL */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm transition-colors">
          <h3 className="font-bold text-slate-800 dark:text-white text-lg mb-6">Items</h3>
          <div className="grid grid-cols-12 gap-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4 border-b border-gray-100 dark:border-slate-700 pb-3">
            <div className="col-span-4">Item</div><div className="col-span-2">Qty</div><div className="col-span-2">Price</div><div className="col-span-2">Tax (%)</div><div className="col-span-2 text-right pr-10">Total</div>
          </div>
          <div className="space-y-3">
            {formData.items.map((item, index) => (
              <div key={index} className="grid grid-cols-12 gap-4 items-center">
                <div className="col-span-4"><input type="text" className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-600 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors" value={item.name || item.description} onChange={(e) => { const newItems = [...formData.items]; newItems[index].name = e.target.value; setFormData({...formData, items: newItems}); }} /></div>
                <div className="col-span-2"><input type="number" className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-600 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors" value={item.quantity} onChange={(e) => { const newItems = [...formData.items]; newItems[index].quantity = Number(e.target.value); setFormData({...formData, items: newItems}); }} /></div>
                <div className="col-span-2"><input type="number" className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-600 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors" value={item.unitPrice} onChange={(e) => { const newItems = [...formData.items]; newItems[index].unitPrice = Number(e.target.value); setFormData({...formData, items: newItems}); }} /></div>
                <div className="col-span-2"><input type="number" className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-600 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors" value={item.taxRate || item.tax || 0} onChange={(e) => { const newItems = [...formData.items]; newItems[index].taxRate = Number(e.target.value); setFormData({...formData, items: newItems}); }} /></div>
                <div className="col-span-2 flex items-center justify-between"><span className="text-sm text-slate-700 dark:text-slate-300 font-medium ml-2">${calculateItemTotal(item).toFixed(2)}</span><button type="button" onClick={() => handleRemoveItem(index)} disabled={formData.items.length === 1} className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded border border-transparent hover:border-red-200 dark:hover:border-red-900/30 transition-all disabled:opacity-30"><Trash2 size={18} /></button></div>
              </div>
            ))}
          </div>
          <div className="mt-6 pt-4"><button type="button" onClick={handleAddItem} className="flex items-center gap-1 border border-gray-200 dark:border-slate-700 px-3 py-1.5 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"><Plus size={16} /> Add Item</button></div>
        </div>

        {/* BOTTOM SUMMARY PANEL */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm space-y-4 transition-colors">
            <h3 className="font-bold text-slate-800 dark:text-white text-lg mb-2">Notes & Terms</h3>
            <TextareaField label="Notes" value={formData.notes} onChange={(e) => setFormData({...formData, notes: e.target.value})} />
            <SelectField label="Payment Terms" options={paymentTermsOptions} value={formData.paymentTerms} onChange={(e) => setFormData({...formData, paymentTerms: e.target.value})} />
          </div>
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm flex flex-col justify-between transition-colors">
            <div className="space-y-4 text-slate-600 dark:text-slate-400 pt-2">
              <div className="flex justify-between items-center"><span>Subtotal:</span><span>${calculateSubtotal().toFixed(2)}</span></div>
              <div className="flex justify-between items-center"><span>Tax:</span><span>${calculateTotalTax().toFixed(2)}</span></div>
              <div className="border-t border-gray-100 dark:border-slate-700 pt-4 mt-2 flex justify-between items-center"><span className="text-lg font-bold text-slate-800 dark:text-white">Total:</span><span className="text-xl font-bold text-slate-900 dark:text-blue-400">${calculateGrandTotal().toFixed(2)}</span></div>
            </div>
            <button type="submit" disabled={loading} className="mt-8 w-full bg-blue-900 dark:bg-blue-600 text-white py-3 rounded-lg font-medium flex justify-center items-center gap-2 hover:bg-blue-800 dark:hover:bg-blue-700 transition-colors disabled:opacity-70"><Save size={18} /> {loading ? "Updating..." : "Update Invoice"}</button>
          </div>
        </div>

      </form>
    </div>
  );
};

export default EditInvoice;