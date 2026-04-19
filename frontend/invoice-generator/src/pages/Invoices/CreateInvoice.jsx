import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { Plus, Trash2, Save, ArrowLeft, Sparkles } from "lucide-react"; // Added Sparkles for a better UI
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import UnifiedAiScanner from "../../components/invoices/UnifiedAiScanner";

// Custom UI Components
import { InputField } from "../../components/ui/InputField.jsx";
import { TextareaField } from "../../components/ui/TextareaField.jsx";
import { SelectField } from "../../components/ui/SelectField.jsx";

const CreateInvoice = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const existingInvoice = location.state?.existingInvoice;

  // 🔥 State to control the AI Scanner Modal
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);

  const [formData, setFormData] = useState(
    existingInvoice || {
      invoiceNumber: `INV-${Math.floor(10000 + Math.random() * 90000)}`,
      invoiceDate: new Date().toISOString().split("T")[0],
      dueDate: "",
      billFrom: {
        businessName: user?.name || "",
        email: user?.email || "",
        address: "",
        phone: "",
      },
      billTo: { clientName: "", email: "", address: "", phone: "" },
      items: [{ name: "", quantity: 1, unitPrice: 0, tax: 0 }],
      notes: "",
      paymentTerms: "Net 15",
      status: "Unpaid"
    }
  );

  const [loading, setLoading] = useState(false);

  // Fetch User Profile for Bill From auto-fill
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axiosInstance.get('/auth/me');
        const userData = response.data.user;

        if (!existingInvoice) {
          setFormData((prev) => ({
            ...prev,
            billFrom: {
              businessName: userData.businessName || userData.name || "",
              email: userData.email || "",
              address: userData.address || "",
              phone: userData.phone || "",
            }
          }));
        }
      } catch (error) {
        console.error("Could not fetch user profile for auto-fill:", error);
      }
    };
    fetchUserProfile();
  }, [existingInvoice]);

  // 🔥 NEW: Function to handle AI Data directly
  const handleAiDataSync = (aiData) => {
    setFormData((prev) => ({
      ...prev,
      invoiceNumber: aiData.invoiceNumber || prev.invoiceNumber,
      invoiceDate: aiData.invoiceDate || prev.invoiceDate,
      dueDate: aiData.dueDate || prev.dueDate,
      billTo: {
        clientName: aiData.clientName || aiData.billTo?.clientName || "",
        email: aiData.email || aiData.billTo?.email || "",
        address: aiData.address || aiData.billTo?.address || "",
        phone: aiData.phone || aiData.billTo?.phone || "",
      },
      items: aiData.items || prev.items,
      notes: aiData.notes || prev.notes,
    }));
    setIsAIModalOpen(false); // Close modal after success
    toast.success("AI has populated the form!");
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

  const calculateItemTotal = (item) => {
    const baseTotal = item.quantity * item.unitPrice;
    const taxAmount = baseTotal * ((item.tax || 0) / 100);
    return baseTotal + taxAmount;
  };

  const calculateSubtotal = () => {
    return formData.items.reduce((acc, item) => acc + (item.quantity * item.unitPrice), 0);
  };

  const calculateTotalTax = () => {
    return formData.items.reduce((acc, item) => {
      const baseTotal = item.quantity * item.unitPrice;
      return acc + (baseTotal * ((item.tax || 0) / 100));
    }, 0);
  };

  const calculateGrandTotal = () => calculateSubtotal() + calculateTotalTax();

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...formData,
        total: calculateGrandTotal()
      };
      await axiosInstance.post(API_PATHS.INVOICE_API.CREATE, payload);
      toast.success("Invoice created successfully!");
      navigate("/dashboard");
    } catch (error) {
      toast.error("Failed to create invoice");
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

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">
      
      {/* Header */}
      <div className="flex overflow-x-auto no-scrollbar items-center justify-between mb-6">
        <button onClick={() => navigate(-1)} className="flex items-center text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors">
          <ArrowLeft size={20} className="mr-2" /> Back
        </button>

        {/* 🔥 Added an AI Magic Button for better UX */}
        <button 
          onClick={() => setIsAIModalOpen(true)}
          className="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-lg border border-blue-100 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-all font-medium"
        >
          <Sparkles size={18} /> Use AI Scanner
        </button>
      </div>

      {/* 🔥 THE SCANNER MODAL */}
      <UnifiedAiScanner 
        isOpen={isAIModalOpen} 
        onClose={() => setIsAIModalOpen(false)}
        onComplete={handleAiDataSync} 
      />

      <form className="space-y-6" onSubmit={handleSubmit}>
        {/* Invoice Details Panel */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-6 transition-colors">
          <InputField
            label="Invoice Number"
            type="text"
            value={formData.invoiceNumber}
            onChange={(e) => setFormData({...formData, invoiceNumber: e.target.value})}
          />
          <InputField
            label="Invoice Date"
            type="date"
            value={formData.invoiceDate}
            onChange={(e) => setFormData({...formData, invoiceDate: e.target.value})}
          />
          <InputField
            label="Due Date"
            type="date"
            value={formData.dueDate}
            onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
          />
        </div>

        {/* Bill From & To Panels */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-800 dark:text-white text-lg">Bill From</h3>
            <InputField
              label="Business Name"
              value={formData.billFrom.businessName}
              onChange={(e) => setFormData({...formData, billFrom: {...formData.billFrom, businessName: e.target.value}})}
            />
            <InputField
              label="Email"
              value={formData.billFrom.email}
              onChange={(e) => setFormData({...formData, billFrom: {...formData.billFrom, email: e.target.value}})}
            />
            <TextareaField
              label="Address"
              value={formData.billFrom.address}
              onChange={(e) => setFormData({...formData, billFrom: {...formData.billFrom, address: e.target.value}})}
            />
          </div>

          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-800 dark:text-white text-lg">Bill To</h3>
            <InputField
              label="Client Name"
              value={formData.billTo.clientName}
              onChange={(e) => setFormData({...formData, billTo: {...formData.billTo, clientName: e.target.value}})}
            />
            <InputField
              label="Client Email"
              value={formData.billTo.email}
              onChange={(e) => setFormData({...formData, billTo: {...formData.billTo, email: e.target.value}})}
            />
            <TextareaField
              label="Client Address"
              value={formData.billTo.address}
              onChange={(e) => setFormData({...formData, billTo: {...formData.billTo, address: e.target.value}})}
            />
          </div>
        </div>

        {/* Items Panel */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm">
          <h3 className="font-bold text-slate-800 dark:text-white text-lg mb-6">Items</h3>
          <div className="space-y-3">
            {formData.items.map((item, index) => (
              <div key={index} className="grid grid-cols-12 gap-4 items-center">
                <div className="col-span-4">
                  <input
                    type="text"
                    placeholder="Item name"
                    className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-600 rounded-lg text-sm dark:text-white"
                    value={item.name}
                    onChange={(e) => {
                      const newItems = [...formData.items];
                      newItems[index].name = e.target.value;
                      setFormData({...formData, items: newItems});
                    }}
                  />
                </div>
                <div className="col-span-2">
                  <input
                    type="number"
                    className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-600 rounded-lg text-sm dark:text-white"
                    value={item.quantity}
                    onChange={(e) => {
                      const newItems = [...formData.items];
                      newItems[index].quantity = Number(e.target.value);
                      setFormData({...formData, items: newItems});
                    }}
                  />
                </div>
                <div className="col-span-2">
                  <input
                    type="number"
                    className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-600 rounded-lg text-sm dark:text-white"
                    value={item.unitPrice}
                    onChange={(e) => {
                      const newItems = [...formData.items];
                      newItems[index].unitPrice = Number(e.target.value);
                      setFormData({...formData, items: newItems});
                    }}
                  />
                </div>
                <div className="col-span-2">
                   <input
                    type="number"
                    className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-600 rounded-lg text-sm dark:text-white"
                    value={item.tax}
                    onChange={(e) => {
                      const newItems = [...formData.items];
                      newItems[index].tax = Number(e.target.value);
                      setFormData({...formData, items: newItems});
                    }}
                  />
                </div>
                <div className="col-span-2 flex items-center justify-between">
                  <span className="text-sm dark:text-slate-300 font-medium ml-2">
                    {formatCurrency(calculateItemTotal(item))}
                  </span>
                  <button type="button" onClick={() => handleRemoveItem(index)} className="p-1.5 text-red-400">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <button type="button" onClick={handleAddItem} className="mt-4 flex items-center gap-1 text-sm font-medium text-blue-600">
            <Plus size={16} /> Add Item
          </button>
        </div>

        {/* Totals Panel */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm space-y-4">
             <TextareaField
              label="Notes"
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
            />
            <SelectField
              label="Payment Terms"
              options={paymentTermsOptions}
              value={formData.paymentTerms}
              onChange={(e) => setFormData({...formData, paymentTerms: e.target.value})}
            />
          </div>
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm flex flex-col justify-between">
            <div className="space-y-4">
               <div className="flex justify-between"><span>Subtotal:</span><span>{formatCurrency(calculateSubtotal())}</span></div>
               <div className="flex justify-between"><span>Tax:</span><span>{formatCurrency(calculateTotalTax())}</span></div>
               <div className="flex justify-between font-bold text-lg border-t pt-4"><span>Total:</span><span>{formatCurrency(calculateGrandTotal())}</span></div>
            </div>
            <button type="submit" disabled={loading} className="mt-8 w-full bg-blue-900 text-white py-3 rounded-lg font-medium flex justify-center items-center gap-2">
              <Save size={18} /> {loading ? "Saving..." : "Save Invoice"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateInvoice;