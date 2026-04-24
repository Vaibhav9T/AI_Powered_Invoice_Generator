import { useState, useEffect, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { Printer, UploadCloud, Sparkles, Loader2, Save, LayoutTemplate } from 'lucide-react';
import toast from 'react-hot-toast';
import axiosInstance from '../../utils/axiosInstance';

const TemplateBuilder = () => {
  const [isCloning, setIsCloning] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // The User-Friendly Configuration State
  const [templateConfig, setTemplateConfig] = useState({
    templateName: 'My Custom Brand',
    themeColor: '#2563eb',
    fontFamily: 'font-sans',
    layoutStyle: 'left',
    pageSize: 'A4' 
  });

  const [previewData, setPreviewData] = useState({
    invoiceNumber: "INV-90210",
    invoiceDate: new Date().toISOString().split('T')[0],
    billFrom: {
      businessName: "Loading your profile...",
      email: "Loading...",
      address: "Loading...",
      phone: "Loading..."
    },
    billTo: {
      clientName: "Prashant Shelke",
      email: "prashantshelke@gmail.com",
      address: "Jaysingpur, Maharashtra",
      phone: "+91 80736-39334"
    },
    items: [
      { name: "Frontend Development", quantity: 1, unitPrice: 30400, tax: 0 },
      { name: "UI/UX Design", quantity: 1, unitPrice: 9000, tax: 0 }
    ],
    total: 39400
  });

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setIsLoading(true);
        const [profileRes, templateRes] = await Promise.all([
          axiosInstance.get('/auth/me'),
          axiosInstance.get('/templates').catch(() => ({ data: { data: null } }))
        ]);

        const userData = profileRes.data.user;
        setPreviewData((prev) => ({
          ...prev,
          billFrom: {
            businessName: userData.businessName || userData.name || "Add Business Name in Profile",
            email: userData.email || "Add Email in Profile",
            address: userData.address || "Add Address in Profile",
            phone: userData.phone || "Add Phone in Profile"
          }
        }));

        if (templateRes.data && templateRes.data.data) {
          // Fallback to ensuring defaults if the DB has old HTML data saved
          const dbData = templateRes.data.data;
          setTemplateConfig({
            templateName: dbData.templateName || 'My Custom Brand',
            themeColor: dbData.themeColor || '#2563eb',
            fontFamily: dbData.fontFamily || 'font-sans',
            layoutStyle: dbData.layoutStyle || 'left',
            pageSize: dbData.pageSize || 'A4'
          });
        }
      } catch (error) {
        console.error("Could not fetch initial data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchInitialData();
  }, []);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsCloning(true);
    const toastId = toast.loading("AI is extracting colors and fonts...");

    try {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = async () => {
            const base64Data = reader.result.split(',')[1];
            
            const response = await axiosInstance.post('/ai/clone-template', {
                imageBase64: base64Data,
                mimeType: file.type
            });

            setTemplateConfig((prev) => ({
                ...prev,
                themeColor: response.data.data.themeColor || prev.themeColor,
                fontFamily: response.data.data.fontFamily || prev.fontFamily,
                layoutStyle: response.data.data.layoutStyle || prev.layoutStyle
            }));

            toast.success("Design Cloned!", { id: toastId });
        };
    } catch (error) {
        toast.error("Failed to clone template", { id: toastId });
    } finally {
        setIsCloning(false);
        e.target.value = null;
    }
  };

  const handleSaveTemplate = async () => {
    setIsSaving(true);
    const toastId = toast.loading("Saving your template...");
    try {
      await axiosInstance.post('/templates', templateConfig);
      toast.success("Template saved successfully!", { id: toastId });
    } catch (error) {
      toast.error("Failed to save template.", { id: toastId });
    } finally {
      setIsSaving(false);
    }
  };

  const componentRef = useRef(null);
  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: `Invoice-Template-Preview`,
    pageStyle: `
      @page { size: ${templateConfig.pageSize}; margin: 0mm; }
      @media print { body { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; } }
    `
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600 mb-4" />
        <p className="text-slate-500 font-medium">Loading your Master Template...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8 p-4 max-w-7xl mx-auto h-[calc(100vh-100px)]">
      
      {/* LEFT: Builder Controls - DARK MODE FIXED */}
      <div className="w-full lg:w-1/3 overflow-y-auto pr-2 pb-10 no-scrollbar">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700">
          
          <div className="flex items-center gap-2 mb-6">
            <LayoutTemplate className="text-blue-600 dark:text-blue-400" />
            <h2 className="font-bold text-xl text-slate-900 dark:text-white">Master Template</h2>
          </div>
          
          <div className="mb-6 p-4 bg-blue-50 dark:bg-slate-900/50 rounded-lg border border-blue-100 dark:border-slate-700">
            <h3 className="text-sm font-semibold text-blue-800 dark:text-blue-400 flex items-center gap-2 mb-2">
              <Sparkles size={16} /> AI Theme Clone
            </h3>
            <label className="flex justify-center items-center gap-2 w-full bg-white dark:bg-slate-800 border border-blue-200 dark:border-slate-600 hover:bg-blue-50 dark:hover:bg-slate-700 cursor-pointer text-sm font-medium py-2 rounded-lg text-slate-700 dark:text-slate-200 transition-colors">
              {isCloning ? <Loader2 size={16} className="animate-spin" /> : <UploadCloud size={16} />}
              {isCloning ? "Analyzing Design..." : "Upload Image to Clone"}
              <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={isCloning} />
            </label>
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">Template Name</label>
              <input 
                type="text" 
                value={templateConfig.templateName}
                onChange={(e) => setTemplateConfig({...templateConfig, templateName: e.target.value})}
                className="w-full p-2.5 border rounded-lg bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-600 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">Paper Size</label>
              <select 
                className="w-full p-2.5 border rounded-lg bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-600 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                value={templateConfig.pageSize}
                onChange={(e) => setTemplateConfig({...templateConfig, pageSize: e.target.value})}
              >
                <option value="A4">A4 (Standard)</option>
                <option value="Letter">US Letter</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">Theme Color</label>
              <div className="flex items-center gap-3">
                <input 
                  type="color" 
                  value={templateConfig.themeColor}
                  onChange={(e) => setTemplateConfig({...templateConfig, themeColor: e.target.value})}
                  className="h-10 w-14 cursor-pointer rounded border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-900 p-1"
                />
                <span className="text-sm font-mono text-slate-500 dark:text-slate-400">{templateConfig.themeColor.toUpperCase()}</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">Typography Style</label>
              <select 
                className="w-full p-2.5 border rounded-lg bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-600 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                value={templateConfig.fontFamily}
                onChange={(e) => setTemplateConfig({...templateConfig, fontFamily: e.target.value})}
              >
                <option value="font-sans">Modern & Clean (Sans)</option>
                <option value="font-serif">Traditional & Formal (Serif)</option>
                <option value="font-mono">Typewriter (Mono)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">Header Alignment</label>
              <select 
                className="w-full p-2.5 border rounded-lg bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-600 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                value={templateConfig.layoutStyle}
                onChange={(e) => setTemplateConfig({...templateConfig, layoutStyle: e.target.value})}
              >
                <option value="left">Left Aligned</option>
                <option value="center">Center Aligned</option>
                <option value="right">Right Aligned</option>
              </select>
            </div>
          </div>

          <div className="mt-8 space-y-3 pt-6 border-t border-gray-100 dark:border-slate-700">
            <button 
              onClick={handleSaveTemplate}
              disabled={isSaving}
              className="w-full bg-blue-600 text-white py-2.5 rounded-lg flex justify-center items-center gap-2 hover:bg-blue-700 transition-colors font-medium disabled:opacity-70 shadow-sm"
            >
              {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />} 
              Save Master Template
            </button>

            <button 
              onClick={handlePrint}
              className="w-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 py-2.5 rounded-lg flex justify-center items-center gap-2 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors font-medium shadow-sm"
            >
              <Printer size={18} /> Test Print Preview
            </button>
          </div>

        </div>
      </div>

      {/* RIGHT: Live Printable Preview */}
      <div className="w-full lg:w-2/3 bg-slate-100 dark:bg-[#0f172a] p-8 rounded-xl flex justify-center overflow-auto shadow-inner h-full border border-gray-200 dark:border-slate-800 no-scrollbar">
        
        <div 
          ref={componentRef} 
          className={`bg-white text-black shadow-2xl w-[210mm] min-h-[297mm] p-[15mm] ${templateConfig.fontFamily} mx-auto print:shadow-none print:w-full print:h-auto print:m-0`}
        >
          {/* Header Section */}
          <div className={`flex items-start border-b-4 pb-6 mb-8
            ${templateConfig.layoutStyle === 'right' ? 'flex-row-reverse justify-between text-right' : 
              templateConfig.layoutStyle === 'center' ? 'flex-col items-center text-center' : 
              'justify-between'}
          `} style={{ borderColor: templateConfig.themeColor }}>
            
            <div className={templateConfig.layoutStyle === 'center' ? 'mb-4 w-full' : ''}>
              <h1 className="text-4xl font-extrabold tracking-widest uppercase" style={{ color: templateConfig.themeColor }}>INVOICE</h1>
              <p className="text-gray-500 mt-1 font-medium">#{previewData.invoiceNumber}</p>
              <p className="text-gray-500 text-sm">Date: {previewData.invoiceDate}</p>
            </div>

            <div className={templateConfig.layoutStyle === 'center' ? 'w-full text-center' : ''}>
               <h3 className="font-bold text-xl text-gray-800">{previewData.billFrom.businessName}</h3>
               <p className="text-gray-600 text-sm mt-1 whitespace-pre-line">{previewData.billFrom.address}</p>
               <p className="text-gray-600 text-sm mt-1">{previewData.billFrom.email}</p>
               <p className="text-gray-600 text-sm">{previewData.billFrom.phone}</p>
            </div>
          </div>

          {/* Bill To Section */}
          <div className="mb-8">
            <h4 className="text-gray-500 font-bold mb-2 uppercase text-sm" style={{ color: templateConfig.themeColor }}>Billed To:</h4>
            <p className="font-bold text-lg text-gray-800">{previewData.billTo.clientName}</p>
            <p className="text-gray-600 text-sm mt-1 whitespace-pre-line">{previewData.billTo.address}</p>
            <p className="text-gray-600 text-sm mt-1">{previewData.billTo.email}</p>
            <p className="text-gray-600 text-sm">{previewData.billTo.phone}</p>
          </div>

          {/* Items Table */}
          <table className="w-full mb-8 text-sm">
            <thead>
              <tr className="border-b-2" style={{ borderColor: templateConfig.themeColor, color: templateConfig.themeColor }}>
                <th className="text-left py-2 font-bold uppercase tracking-wider">Description</th>
                <th className="text-center py-2 font-bold uppercase tracking-wider">Qty</th>
                <th className="text-right py-2 font-bold uppercase tracking-wider">Price</th>
                <th className="text-right py-2 font-bold uppercase tracking-wider">Total</th>
              </tr>
            </thead>
            <tbody>
              {previewData.items.map((item, index) => (
                <tr key={index} className="border-b border-gray-200">
                  <td className="py-3 text-gray-800 font-medium">{item.name}</td>
                  <td className="text-center py-3 text-gray-600">{item.quantity}</td>
                  <td className="text-right py-3 text-gray-600">₹{item.unitPrice.toLocaleString()}</td>
                  <td className="text-right py-3 text-gray-800 font-medium">₹{(item.quantity * item.unitPrice).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totals */}
          <div className="flex justify-end mb-12">
            <div className="w-1/2">
              <div className="flex justify-between py-2 text-gray-600">
                <span>Subtotal:</span>
                <span>₹{previewData.total.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-2 text-gray-600">
                <span>Tax:</span>
                <span>₹0</span>
              </div>
              <div className="flex justify-between py-3 border-t-2 mt-2 font-bold text-xl" style={{ borderColor: templateConfig.themeColor, color: templateConfig.themeColor }}>
                <span>Grand Total:</span>
                <span>₹{previewData.total.toLocaleString()}</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default TemplateBuilder;