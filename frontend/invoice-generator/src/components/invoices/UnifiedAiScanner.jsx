// UnifiedAiScanner.jsx
import { useState } from 'react';
import { UploadCloud, Camera, Loader2, Sparkles, Send } from 'lucide-react';
import toast from 'react-hot-toast';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';

const UnifiedAiScanner = ({ onComplete }) => {
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [customInstructions, setCustomInstructions] = useState("");

    const fileToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result.split(',')[1]);
            reader.onerror = (error) => reject(error);
        });
    };

    // --- ACTION 1: Handle Text-Only Parsing (Like your old model) ---
    const handleTextOnlyParse = async () => {
        if (!customInstructions.trim()) {
            toast.error("Please enter some text or upload an image first.");
            return;
        }

        setIsAnalyzing(true);
        const toastId = toast.loading('AI is converting your text to a bill...');

        try {
            const response = await axiosInstance.post(API_PATHS.AI_API.PARSE, {
                invoiceText: customInstructions
            });
            
            onComplete(response.data.data);
            toast.success('Generated from text!', { id: toastId });
            setCustomInstructions("");
        } catch (error) {
            toast.error('Failed to parse text', { id: toastId });
        } finally {
            setIsAnalyzing(false);
        }
    };

    // --- ACTION 2: Handle Image (or Image + Text) Parsing ---
    const handleImageProcess = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setIsAnalyzing(true);
        const toastId = toast.loading('AI is scanning the document...');

        try {
            const base64Data = await fileToBase64(file);
            const response = await axiosInstance.post(API_PATHS.AI_API.PARSE_IMAGE, {
                imageBase64: base64Data,
                mimeType: file.type,
                customInstructions: customInstructions // Includes text instructions if provided!
            });

            onComplete(response.data.data);
            toast.success('Extracted from image!', { id: toastId });
            setCustomInstructions("");
        } catch (error) {
            toast.error('Failed to read image', { id: toastId });
        } finally {
            setIsAnalyzing(false);
            e.target.value = null; 
        }
    };

    return (
        <div className="no-scrollbar space-y-4">
            {/* Input for Raw Text or Custom Instructions */}
            <div className="relative">
                <textarea
                    value={customInstructions}
                    onChange={(e) => setCustomInstructions(e.target.value)}
                    placeholder="Paste raw text here OR type instructions for the image scan..."
                    className="w-full px-4 py-3 text-sm bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 min-h-[120px] resize-none transition-all"
                    disabled={isAnalyzing}
                />
                
                {/* Text-Only Submit Button (Floating) */}
                {customInstructions && !isAnalyzing && (
                    <button 
                        onClick={handleTextOnlyParse}
                        className="absolute bottom-3 right-3 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg flex items-center gap-2 text-xs font-bold uppercase tracking-wider"
                    >
                        <Send size={14} /> Process Text
                    </button>
                )}
            </div>

            <div className="grid grid-cols-2 gap-3">
                {/* Upload Image */}
                <div className="relative flex-1">
                    <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleImageProcess}
                        disabled={isAnalyzing}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <button type="button" disabled={isAnalyzing} className="w-full flex justify-center items-center gap-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 px-4 py-3 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-all text-sm font-semibold border border-gray-200 dark:border-slate-700">
                        {isAnalyzing ? <Loader2 size={18} className="animate-spin" /> : <UploadCloud size={18} />}
                        Gallery
                    </button>
                </div>

                {/* Take Photo */}
                <div className="relative flex-1">
                    <input 
                        type="file" 
                        accept="image/*" 
                        capture="environment" 
                        onChange={handleImageProcess}
                        disabled={isAnalyzing}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <button type="button" disabled={isAnalyzing} className="w-full flex justify-center items-center gap-2 bg-blue-600 text-white px-4 py-3 rounded-xl hover:bg-blue-700 transition-all text-sm font-semibold shadow-md shadow-blue-500/20">
                        {isAnalyzing ? <Loader2 size={18} className="animate-spin" /> : <Camera size={18} />}
                        Camera
                    </button>
                </div>
            </div>

            <div className="text-center">
                <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-bold tracking-widest">
                    Powered by InvoiceAI Intelligence
                </p>
            </div>
        </div>
    );
};

export default UnifiedAiScanner;