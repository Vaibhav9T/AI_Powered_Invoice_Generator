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

  // Added paymentTerms to state
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...formData,
        total: calculateGrandTotal(),
        billTo: `${formData.billTo.clientName}\n${formData.billTo.address}\n${formData.billTo.phone}`
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
        <button onClick={() => navigate(-1)} className="flex items-center text-slate-500 hover:text-slate-800 transition-colors">
          <ArrowLeft size={20} className="mr-2" /> Back
        </button>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit}>
        
        {/* TOP PANEL: Invoice Details */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-6">
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

        {/* MIDDLE PANEL: Bill From & Bill To */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-800 text-lg mb-2">Bill From</h3>
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

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-800 text-lg mb-2">Bill To</h3>
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
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="font-bold text-slate-800 text-lg mb-6">Items</h3>
          
          <div className="grid grid-cols-12 gap-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 border-b border-gray-100 pb-3">
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
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
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
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
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
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
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
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    value={item.tax}
                    onChange={(e) => {
                      const newItems = [...formData.items];
                      newItems[index].tax = Number(e.target.value);
                      setFormData({...formData, items: newItems});
                    }}
                  />
                </div>
                <div className="col-span-2 flex items-center justify-between">
                  <span className="text-sm text-slate-700 font-medium ml-2">
                    ${calculateItemTotal(item).toFixed(2)}
                  </span>
                  <button 
                    type="button" 
                    onClick={() => handleRemoveItem(index)} 
                    disabled={formData.items.length === 1}
                    className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded border border-transparent hover:border-red-200 transition-all disabled:opacity-30"
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
              className="flex items-center gap-1 border border-gray-200 px-3 py-1.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-gray-50 transition-colors"
            >
              <Plus size={16} /> Add Item
            </button>
          </div>
        </div>

        {/* BOTTOM SUMMARY PANEL: Notes, Terms, and Totals (Matches your image!) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Notes & Terms */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-800 text-lg mb-2">Notes & Terms</h3>
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

          {/* Totals Summary */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
            <div className="space-y-4 text-slate-600 pt-2">
              <div className="flex justify-between items-center">
                <span>Subtotal:</span>
                <span>${calculateSubtotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Tax:</span>
                <span>${calculateTotalTax().toFixed(2)}</span>
              </div>
              <div className="border-t border-gray-100 pt-4 mt-2 flex justify-between items-center">
                <span className="text-lg font-bold text-slate-800">Total:</span>
                <span className="text-xl font-bold text-slate-900">${calculateGrandTotal().toFixed(2)}</span>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading} 
              className="mt-8 w-full bg-blue-900 text-white py-3 rounded-lg font-medium flex justify-center items-center gap-2 hover:bg-blue-800 transition-colors disabled:opacity-70"
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