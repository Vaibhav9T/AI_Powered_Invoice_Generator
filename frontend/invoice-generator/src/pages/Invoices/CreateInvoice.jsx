import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { Plus, Trash2, Save, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";

// Custom UI Components
import { InputField } from "../../components/ui/InputField.jsx";
import { TextareaField } from "../../components/ui/TextareaField.jsx";
import { SelectField } from "../../components/ui/SelectField.jsx";

const CreateInvoice = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const existingInvoice = location.state?.existingInvoice;

  const [formData, setFormData] = useState(
    existingInvoice || {
      invoiceNumber: `INV-${Math.floor(10000 + Math.random() * 90000)}`,
      invoiceDate: new Date().toISOString().split("T")[0],
      dueDate: "",
      billFrom: {
        businessName: user?.name || "ABCD Industries Inc.",
        email: user?.email || "alex@example.com",
        address: "123 Innovation Drive, Tech City",
        phone: "123-456-7890",
      },
      billTo: { clientName: "", email: "", address: "", phone: "" },
      items: [{ name: "", quantity: 1, unitPrice: 0, tax: 0 }],
      notes: "",
      paymentTerms: "Net 15",
      status: "Unpaid"
    }
  );

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        // Grab the latest profile data from the database
        const response = await axiosInstance.get('/users/profile');
        const userData = response.data;

        // If we are making a NEW invoice (not editing an old one), fill in the Bill From
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

  useEffect(() => {
    const aiData = location.state?.aiData;
    if (aiData) {
      setFormData((prev) => ({
        ...prev,
        billTo: {
          ...prev.billTo,
          clientName: aiData.clientName || "",
          email: aiData.email || "",
          address: aiData.address || "",
        },
        items: aiData.items || [{ name: "", quantity: 1, unitPrice: 0, tax: 0 }],
      }));
    }
  }, [location.state]);

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

  // --- Math Calculations ---
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

  const calculateGrandTotal = () => {
    return calculateSubtotal() + calculateTotalTax();
  };

  // 🔥 THE FIX IS HERE: We no longer smash the billTo object into a string!
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...formData,
        total: calculateGrandTotal()
        // We removed the bad billTo string formatting here.
        // It will now safely send the whole formData object exactly as it is.
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
      <div className="flex items-center justify-between mb-6">
        <button onClick={() => navigate(-1)} className="flex items-center text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors">
          <ArrowLeft size={20} className="mr-2" /> Back
        </button>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit}>
        
        {/* TOP PANEL: Invoice Details */}
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
            className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-600 rounded-lg text-sm text-slate-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors dark:[&::-webkit-calendar-picker-indicator]:invert"
          />
          <InputField
            label="Due Date"
            type="date"
            className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-600 rounded-lg text-sm text-slate-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors dark:[&::-webkit-calendar-picker-indicator]:invert"
            value={formData.dueDate}
            onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
          />
        </div>

        {/* MIDDLE PANEL: Bill From & Bill To */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm space-y-4 transition-colors">
            <h3 className="font-bold text-slate-800 dark:text-white text-lg mb-2">Bill From</h3>
            <InputField
              label="Business Name"
              type="text"
              value={formData.billFrom.businessName}
              onChange={(e) => setFormData({...formData, billFrom: {...formData.billFrom, businessName: e.target.value}})}
            />
            <InputField
              label="Email"
              type="email"
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
              type="text"
              value={formData.billFrom.phone}
              onChange={(e) => setFormData({...formData, billFrom: {...formData.billFrom, phone: e.target.value}})}
            />
          </div>

          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm space-y-4 transition-colors">
            <h3 className="font-bold text-slate-800 dark:text-white text-lg mb-2">Bill To</h3>
            <InputField
              label="Client Name"
              type="text"
              value={formData.billTo.clientName}
              onChange={(e) => setFormData({...formData, billTo: {...formData.billTo, clientName: e.target.value}})}
            />
            <InputField
              label="Client Email"
              type="email"
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
              type="text"
              value={formData.billTo.phone}
              onChange={(e) => setFormData({...formData, billTo: {...formData.billTo, phone: e.target.value}})}
            />
          </div>
        </div>

        {/* ITEMS PANEL */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm transition-colors">
          <h3 className="font-bold text-slate-800 dark:text-white text-lg mb-6">Items</h3>
          
          <div className="grid grid-cols-12 gap-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4 border-b border-gray-100 dark:border-slate-700 pb-3">
            <div className="col-span-4">Item</div>
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
                    className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-600 rounded-lg text-sm text-slate-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
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
                    className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-600 rounded-lg text-sm text-slate-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
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
                    className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-600 rounded-lg text-sm text-slate-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
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
                    className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-600 rounded-lg text-sm text-slate-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
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
                    ${calculateItemTotal(item).toFixed(2)}
                  </span>
                  <button 
                    type="button" 
                    onClick={() => handleRemoveItem(index)} 
                    disabled={formData.items.length === 1}
                    className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded border border-transparent hover:border-red-200 dark:hover:border-red-900/30 transition-all disabled:opacity-30"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4">
            <button 
              type="button" 
              onClick={handleAddItem} 
              className="flex items-center gap-1 border border-gray-200 dark:border-slate-700 px-3 py-1.5 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
            >
              <Plus size={16} /> Add Item
            </button>
          </div>
        </div>

        {/* BOTTOM SUMMARY PANEL: Notes, Terms, and Totals */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm space-y-4 transition-colors">
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

          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm flex flex-col justify-between transition-colors">
            <div className="space-y-4 text-slate-600 dark:text-slate-400 pt-2">
              <div className="flex justify-between items-center">
                <span>Subtotal:</span>
                <span>${calculateSubtotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Tax:</span>
                <span>${calculateTotalTax().toFixed(2)}</span>
              </div>
              <div className="border-t border-gray-100 dark:border-slate-700 pt-4 mt-2 flex justify-between items-center">
                <span className="text-lg font-bold text-slate-800 dark:text-white">Total:</span>
                <span className="text-xl font-bold text-slate-900 dark:text-blue-400">${calculateGrandTotal().toFixed(2)}</span>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading} 
              className="mt-8 w-full bg-blue-900 dark:bg-blue-600 text-white py-3 rounded-lg font-medium flex justify-center items-center gap-2 hover:bg-blue-800 dark:hover:bg-blue-700 transition-colors disabled:opacity-70"
            >
              <Save size={18} /> {loading ? "Saving..." : "Save Invoice"}
            </button>
          </div>
          
        </div>

      </form>
    </div>
  );
};

export default CreateInvoice;