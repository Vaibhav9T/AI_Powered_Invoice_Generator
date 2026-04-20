import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { Plus, Trash2, Save, ArrowLeft, Sparkles } from "lucide-react";
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

  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

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

  // Auto-fill Bill From
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

  // Load AI Data if coming from the Dashboard routing
  useEffect(() => {
    const aiData = location.state?.aiData;
    if (aiData) {
      handleAiDataSync(aiData);
    }
  }, [location.state]);

  // The Data Scrubber
  const handleAiDataSync = (aiData) => {
    if (!aiData) return;

    const normalizeNumber = (value) => {
      if (typeof value === "number" && Number.isFinite(value)) return value;
      if (typeof value !== "string") return 0;

      const cleaned = value.replace(/[^0-9.-]/g, "");
      if (!cleaned || cleaned === "-" || cleaned === "." || cleaned === "-.") return 0;

      const parsed = Number(cleaned);
      return Number.isFinite(parsed) ? parsed : 0;
    };

    // 1. Scrub the items array so 'name' is NEVER blank
    let scrubbedItems = [{ name: "", quantity: 1, unitPrice: 0, tax: 0 }];
    
    if (aiData.items && aiData.items.length > 0) {
      scrubbedItems = aiData.items.map(item => ({
        name: item.name || item.description || item.itemName || item.title || item.item || "Extracted Item",
        quantity: normalizeNumber(item.quantity) || 1,
        unitPrice: normalizeNumber(item.unitPrice || item.price || item.rate),
        tax: normalizeNumber(item.tax || item.taxPercent)
      }));
    }

    // 2. Safely merge the data
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
      items: scrubbedItems,
      notes: aiData.notes || prev.notes,
    }));

    setIsAIModalOpen(false); // Close the modal
    toast.success("AI Data Applied Successfully!");
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

  // --- Calculations ---
  const calculateItemTotal = (item) => {
    const baseTotal = item.quantity * item.unitPrice;
    return baseTotal + (baseTotal * ((item.tax || 0) / 100));
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
    
    // 🔥 THE FIX: Frontend Validation Gatekeeper
    if (!formData.invoiceNumber.trim()) {
      toast.error("Please enter an Invoice Number.");
      return;
    }
    if (!formData.invoiceDate) {
      toast.error("Please select an Invoice Date.");
      return;
    }
    if (!formData.billTo.clientName.trim()) {
      toast.error("Client Name (Bill To) is required.");
      return;
    }
    if (formData.items.length === 0) {
      toast.error("You must add at least one item.");
      return;
    }
    // Check if any item has an empty name
    const hasEmptyItemName = formData.items.some(item => !item.name.trim());
    if (hasEmptyItemName) {
      toast.error("All items must have a name or description.");
      return;
    }

    // If it passes all validation, proceed with saving
    setLoading(true);
    try {
      const payload = { ...formData, total: calculateGrandTotal() };
      await axiosInstance.post(API_PATHS.INVOICE_API.CREATE, payload);
      toast.success("Invoice created successfully!");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create invoice");
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
      <div className="flex items-center justify-between mb-6">
        <button onClick={() => navigate(-1)} className="flex items-center text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors">
          <ArrowLeft size={20} className="mr-2" /> Back
        </button>

        <button 
          onClick={() => setIsAIModalOpen(true)}
          className="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-lg border border-blue-100 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-all font-medium shadow-sm"
        >
          <Sparkles size={18} /> Auto-fill with AI
        </button>
      </div>

      {/* AI Scanner Modal */}
      <UnifiedAiScanner 
        isOpen={isAIModalOpen} 
        onClose={() => setIsAIModalOpen(false)}
        onComplete={handleAiDataSync} 
      />

      <form className="space-y-6 mt-4" onSubmit={handleSubmit}>
        
        {/* TOP PANEL: Invoice Details */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-6">
          <InputField
            label="Invoice Number *"
            type="text"
            value={formData.invoiceNumber}
            onChange={(e) => setFormData({...formData, invoiceNumber: e.target.value})}
          />
          <InputField
            label="Invoice Date *"
            type="date"
            value={formData.invoiceDate}
            onChange={(e) => setFormData({...formData, invoiceDate: e.target.value})}
            className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-600 rounded-lg text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:[&::-webkit-calendar-picker-indicator]:invert"
          />
          <InputField
            label="Due Date"
            type="date"
            value={formData.dueDate}
            onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
            className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-600 rounded-lg text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:[&::-webkit-calendar-picker-indicator]:invert"
          />
        </div>

        {/* MIDDLE PANEL: Bill From & Bill To */}
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
            <InputField
              label="Phone"
              value={formData.billFrom.phone}
              onChange={(e) => setFormData({...formData, billFrom: {...formData.billFrom, phone: e.target.value}})}
            />
          </div>

          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-800 dark:text-white text-lg">Bill To</h3>
            <InputField
              label="Client Name *"
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
            <InputField
              label="Client Phone"
              value={formData.billTo.phone}
              onChange={(e) => setFormData({...formData, billTo: {...formData.billTo, phone: e.target.value}})}
            />
          </div>
        </div>

        {/* ITEMS PANEL */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm">
          <h3 className="font-bold text-slate-800 dark:text-white text-lg mb-6">Items</h3>
          
          <div className="grid grid-cols-12 gap-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4 border-b border-gray-100 dark:border-slate-700 pb-3">
            <div className="col-span-4">Item *</div>
            <div className="col-span-2">Qty</div>
            <div className="col-span-2">Price</div>
            <div className="col-span-2">Tax (%)</div>
            <div className="col-span-2 text-right pr-10">Total</div>
          </div>

          <div className="space-y-3">
            {formData.items.map((item, index) => (
              <div key={index} className="grid grid-cols-12 gap-4 items-center">
                <div className="col-span-4">
                  <input
                    type="text"
                    placeholder="Item name"
                    className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-600 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-600 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-600 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-600 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={item.tax}
                    onChange={(e) => {
                      const newItems = [...formData.items];
                      newItems[index].tax = Number(e.target.value);
                      setFormData({...formData, items: newItems});
                    }}
                  />
                </div>
                <div className="col-span-2 flex items-center justify-between">
                  <span className="text-sm text-slate-700 dark:text-slate-300 font-medium ml-2">
                    {formatCurrency(calculateItemTotal(item))}
                  </span>
                  <button type="button" onClick={() => handleRemoveItem(index)} disabled={formData.items.length === 1} className="p-1.5 text-red-400 hover:text-red-600 disabled:opacity-30">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <button type="button" onClick={handleAddItem} className="mt-4 flex items-center gap-1 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-slate-700 transition-colors">
            <Plus size={16} /> Add Item
          </button>
        </div>

        {/* BOTTOM SUMMARY PANEL */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-800 dark:text-white text-lg mb-2">Notes & Terms</h3>
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
            <div className="space-y-4 text-slate-600 dark:text-slate-400 pt-2">
               <div className="flex justify-between items-center">
                 <span>Subtotal:</span>
                 <span>{formatCurrency(calculateSubtotal())}</span>
               </div>
               <div className="flex justify-between items-center">
                 <span>Tax:</span>
                 <span>{formatCurrency(calculateTotalTax())}</span>
               </div>
               <div className="border-t border-gray-100 dark:border-slate-700 pt-4 mt-2 flex justify-between items-center">
                 <span className="text-lg font-bold text-slate-800 dark:text-white">Total:</span>
                 <span className="text-xl font-bold text-slate-900 dark:text-blue-400">{formatCurrency(calculateGrandTotal())}</span>
               </div>
            </div>
            
            <button type="submit" disabled={loading} className="mt-8 w-full bg-blue-900 dark:bg-blue-600 text-white py-3 rounded-lg font-medium flex justify-center items-center gap-2 hover:bg-blue-800 dark:hover:bg-blue-700 transition-colors disabled:opacity-70">
              <Save size={18} /> {loading ? "Saving..." : "Save Invoice"}
            </button>
          </div>
        </div>

      </form>
    </div>
  );
};

export default CreateInvoice;