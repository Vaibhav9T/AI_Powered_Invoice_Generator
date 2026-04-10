import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowLeft, Loader2, Bot } from 'lucide-react';
import axiosInstance from '../../utils/axiosInstance';
import toast from 'react-hot-toast';

const AIGenerate = () => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const navigate = useNavigate();

  const handleGenerate = async (e) => {
    e.preventDefault();
    
    if (!prompt.trim()) {
      toast.error('Please enter some text for the AI to analyze.');
      return;
    }

    setIsGenerating(true);
    
    try {
      // 1. Send the raw text to our Gemini AI route
      toast.loading('Gemini is analyzing your text...', { id: 'ai-toast' });
      const aiResponse = await axiosInstance.post('/api/ai/parse', { invoiceText: prompt });
      
      const extractedData = aiResponse.data.data;

      // 2. Add a random invoice number if the AI didn't find one in the text
      if (!extractedData.invoiceNumber) {
        extractedData.invoiceNumber = `INV-${Math.floor(1000 + Math.random() * 9000)}`;
      }

      // 3. Save the newly structured AI data directly to your database!
      toast.loading('Saving your new invoice...', { id: 'ai-toast' });
      await axiosInstance.post('/api/invoices', extractedData);

      // 4. Success!
      toast.success('AI Invoice generated perfectly!', { id: 'ai-toast' });
      navigate('/invoices'); // Take them back to the table to see it

    } catch (error) {
      console.error("AI Generation Error:", error);
      toast.error(error.response?.data?.message || 'Failed to generate invoice with AI.', { id: 'ai-toast' });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button 
          onClick={() => navigate(-1)}
          className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-slate-500"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Sparkles className="text-blue-600" size={24} />
            Generate with AI
          </h1>
          <p className="text-sm text-slate-500">Paste your raw notes, emails, or text messages below.</p>
        </div>
      </div>

      {/* Main AI Box */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        
        <div className="bg-blue-50 border-b border-blue-100 p-6 flex gap-4 items-start">
          <div className="bg-blue-600 p-2 rounded-lg text-white mt-1">
            <Bot size={24} />
          </div>
          <div>
            <h3 className="font-semibold text-blue-900">How it works</h3>
            <p className="text-sm text-blue-800 mt-1 leading-relaxed">
              Just describe what you billed your client for in plain English. Gemini 2.0 will automatically extract the client details, itemize the services, calculate the prices, and format the dates.
            </p>
            <div className="mt-3 bg-white/60 p-3 rounded text-xs text-blue-900 border border-blue-200 font-mono">
              <strong>Example:</strong> "Bill Tony Stark at Stark Industries for 10 hours of server maintenance at $150/hr, and a $500 flat fee for database setup. Due date is next Friday."
            </div>
          </div>
        </div>

        <form onSubmit={handleGenerate} className="p-6">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Raw Invoice Text
          </label>
          <textarea
            required
            rows="8"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Type or paste your text here..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none text-slate-700 shadow-inner"
          />

          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              disabled={isGenerating || !prompt.trim()}
              className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            >
              {isGenerating ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
              {isGenerating ? 'Gemini is thinking...' : 'Generate Invoice'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default AIGenerate;