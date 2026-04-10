import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Sparkles, Loader2 } from 'lucide-react';
import axiosInstance from '../../utils/axiosInstance';
import toast from 'react-hot-toast';

const AIGenerateModal = ({ isOpen, onClose }) => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const navigate = useNavigate();

  // If the modal is not open, don't render anything
  if (!isOpen) return null;

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error('Please paste some text first.');
      return;
    }

    setIsGenerating(true);
    const toastId = toast.loading('AI is reading your text...');

    try {
      // Send the text to the backend controller we built!
      // (Adjust this URL if your route is named slightly differently)
    const response = await axiosInstance.post('/ai/parse', { invoiceText: prompt });      const aiData = response.data.data;

      toast.success('Invoice data extracted!', { id: toastId });
      
      // Close the popup and navigate to the create form with the pre-filled data!
      onClose();
      navigate('/invoices/new', { state: { aiData } });
      
    } catch (error) {
      console.error("AI Error:", error);
      toast.error('Failed to parse text with AI.', { id: toastId });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      
      {/* Modal Container */}
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="text-blue-600" size={24} />
            <h2 className="text-xl font-bold text-slate-900">Create Invoice with AI</h2>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors p-1"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 pb-6 space-y-4">
          <p className="text-slate-600 leading-relaxed">
            Paste any text that contains invoice details (like client name, items, quantities, and prices) and the AI will attempt to create an invoice from it.
          </p>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-800">
              Paste Invoice Text Here
            </label>
            <textarea
              rows="6"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., 'Invoice for ClientCorp: 2 hours of design work at $150/hr and 1 logo for $800'"
              className="w-full px-4 py-3 text-slate-700 bg-white border-2 border-blue-500 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 resize-none transition-all placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-gray-100 flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={isGenerating}
            className="px-5 py-2.5 text-sm font-medium text-slate-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleGenerate}
            disabled={isGenerating || !prompt.trim()}
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-[#1e2b5e] rounded-lg hover:bg-[#151f43] transition-colors disabled:opacity-70"
          >
            {isGenerating ? <Loader2 size={18} className="animate-spin" /> : null}
            {isGenerating ? 'Generating...' : 'Generate Invoice'}
          </button>
        </div>

      </div>
    </div>
  );
};

export default AIGenerateModal;