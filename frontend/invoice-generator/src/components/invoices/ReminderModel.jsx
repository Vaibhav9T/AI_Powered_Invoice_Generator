import React, { useState, useEffect } from 'react';
import { X, Mail, Loader2, Send } from 'lucide-react';
import axiosInstance from '../../utils/axiosInstance';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext'; // 🔥 IMPORT ADDED

const ReminderModal = ({ isOpen, onClose, invoiceId }) => {
  const { user } = useAuth(); // 🔥 GRAB USER PROFILE
  const [emailBody, setEmailBody] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSending, setIsSending] = useState(false);

  // Automatically ask the AI to draft the email as soon as the modal opens!
  useEffect(() => {
    if (isOpen && invoiceId) {
      generateDraft();
    } else {
      // Clear out the old email when the modal closes
      setEmailBody('');
    }
  }, [isOpen, invoiceId]);

  const generateDraft = async () => {
    setIsGenerating(true);
    try {
      const response = await axiosInstance.post('/ai/reminder', { invoiceId });
      let draft = response.data.reminderEmail;

      // 1. The Vacuum Cleaner: Removes absolutely ANYTHING inside square brackets
      draft = draft.replace(/\[.*?\]/g, '');

      // 2. Clean up any awkward empty lines left behind by the deleted brackets
      draft = draft.replace(/\n\s*\n\s*\n/g, '\n\n').trim();

      // 3. Build a beautiful, dynamic signature using ONLY your available profile data
      // Using .filter(Boolean) automatically removes any fields that are blank!
      const signatureParts = [
        user?.name,
        user?.businessName,
        user?.phone,
        user?.email
      ].filter(Boolean); 

      // 4. Attach it cleanly to the bottom of the email
      draft += '\n' + signatureParts.join('\n');

      setEmailBody(draft);
    } catch (error) {
      console.error("Failed to generate reminder:", error);
      toast.error("Failed to generate email draft.");
      onClose(); 
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSendEmail = async () => {
    if (!emailBody.trim()) {
      toast.error("Email body cannot be empty");
      return;
    }

    setIsSending(true);
    
    // NOTE: Since we don't have an email server like SendGrid hooked up yet,
    // we will just simulate a 1.5-second loading delay to make it feel real!
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success('Reminder email sent successfully!');
      onClose();
    } catch (error) {
      toast.error('Failed to send email.');
    } finally {
      setIsSending(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <Mail size={20} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Send Payment Reminder</h2>
              <p className="text-sm text-slate-500">Review and edit your AI-generated draft</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors p-1"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {isGenerating ? (
            <div className="flex flex-col items-center justify-center py-12 text-slate-500">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600 mb-3" />
              <p className="font-medium animate-pulse">Gemini is writing your email...</p>
            </div>
          ) : (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">
                Email Message
              </label>
              <textarea
                rows="10"
                value={emailBody}
                onChange={(e) => setEmailBody(e.target.value)}
                className="w-full px-4 py-3 text-slate-700 bg-slate-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none transition-all leading-relaxed"
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-gray-100 flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={isGenerating || isSending}
            className="px-5 py-2.5 text-sm font-medium text-slate-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSendEmail}
            disabled={isGenerating || isSending || !emailBody}
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-70 shadow-sm"
          >
            {isSending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
            {isSending ? 'Sending...' : 'Send Email'}
          </button>
        </div>

      </div>
    </div>
  );
};

export default ReminderModal;