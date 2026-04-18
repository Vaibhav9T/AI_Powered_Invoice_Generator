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
    <div className="max-w-3xl mx-auto animate-in fade-in duration-500 transition-colors">
      
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button 
          onClick={() => navigate(-1)}
          className="p-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors text-slate-500 dark:text-slate-400"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2 transition-colors">
            <Sparkles className="text-blue-600 dark:text-blue-400" size={24} />
            Generate with AI
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Paste your raw notes, emails, or text messages below.</p>
        </div>
      </div>

      {/* Main AI Box */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden transition-colors">
        
        <div className="bg-blue-50 dark:bg-blue-900/20 border-b border-blue-100 dark:border-blue-900/30 p-6 flex gap-4 items-start transition-colors">
          <div className="bg-blue-600 p-2 rounded-lg text-white mt-1">
            <Bot size={24} />
          </div>
          <div>
            <h3 className="font-semibold text-blue-900 dark:text-blue-300">How it works</h3>
            <p className="text-sm text-blue-800 dark:text-blue-400 mt-1 leading-relaxed">
              Just describe what you billed your client for in plain English. Gemini 2.0 will automatically extract the client details, itemize the services, calculate the prices, and format the dates.
            </p>
            <div className="mt-3 bg-white/60 dark:bg-slate-900/40 p-3 rounded text-xs text-blue-900 dark:text-blue-300 border border-blue-200 dark:border-blue-900/50 font-mono">
              <strong>Example:</strong> "Bill Tony Stark at Stark Industries for 10 hours of server maintenance at $150/hr, and a $500 flat fee for database setup. Due date is next Friday."
            </div>
          </div>
        </div>

        <form onSubmit={handleGenerate} className="p-6">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Raw Invoice Text
          </label>
          <textarea
            required
            rows="8"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Type or paste your text here..."
            className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none text-slate-700 dark:text-slate-200 shadow-inner transition-colors"
          />

          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              disabled={isGenerating || !prompt.trim()}
              className="flex items-center gap-2 bg-blue-600 dark:bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
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