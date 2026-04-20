import { useState, useRef } from 'react';
import { UploadCloud, Camera, Loader2, Sparkles, Send, X, Image as ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';

const UnifiedAiScanner = ({ onComplete }) => {
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [customInstructions, setCustomInstructions] = useState("");
    
    // 🔥 NEW: States to hold the image BEFORE sending
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    // Refs to trigger hidden file inputs
    const fileInputRef = useRef(null);
    const cameraInputRef = useRef(null);

    const fileToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result.split(',')[1]);
            reader.onerror = (error) => reject(error);
        });
    };

    // 1. Handle File Selection (Does NOT send to API yet)
    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setSelectedFile(file);
        setPreviewUrl(URL.createObjectURL(file));
        e.target.value = null; // Reset input so the same file can be selected again
    };

    // 2. Remove selected image
    const clearImage = () => {
        setSelectedFile(null);
        setPreviewUrl(null);
    };

    // 3. The Unified Process Function (Sends Text, Image, or Both)
    const handleProcess = async () => {
        if (!selectedFile && !customInstructions.trim()) {
            toast.error("Please add an image or type a prompt.");
            return;
        }

        setIsAnalyzing(true);
        const toastId = toast.loading('AI is processing your request...');

        try {
            let response;

            if (selectedFile) {
                // 🔥 Scenario A: Image + Optional Text Prompt
                const base64Data = await fileToBase64(selectedFile);
                response = await axiosInstance.post(API_PATHS.AI_API.PARSE_IMAGE, {
                    imageBase64: base64Data,
                    mimeType: selectedFile.type,
                    customInstructions: customInstructions 
                });
            } else {
                // 🔥 Scenario B: Text Only
                response = await axiosInstance.post(API_PATHS.AI_API.PARSE, {
                    invoiceText: customInstructions
                });
            }

            onComplete(response.data.data);
            toast.success('Successfully extracted!', { id: toastId });
            
            // Clean up UI after success
            setCustomInstructions("");
            clearImage();

        } catch (error) {
            console.error(error);
            toast.error('Failed to process. Please try again.', { id: toastId });
        } finally {
            setIsAnalyzing(false);
        }
    };

    return (
        <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-gray-200 dark:border-slate-700 space-y-4">
            
            {/* Input Area (Text + Image Preview) */}
            <div className="relative bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 transition-all">
                
                <textarea
                    value={customInstructions}
                    onChange={(e) => setCustomInstructions(e.target.value)}
                    placeholder="Type instructions or paste invoice text here..."
                    className="w-full px-4 py-3 text-sm bg-transparent border-none focus:ring-0 min-h-[100px] resize-none dark:text-white"
                    disabled={isAnalyzing}
                />

                {/* Image Preview Thumbnail */}
                {previewUrl && (
                    <div className="px-4 pb-3">
                        <div className="relative inline-block border border-gray-200 dark:border-slate-700 rounded-lg p-1 bg-slate-50 dark:bg-slate-800">
                            <img src={previewUrl} alt="Preview" className="h-20 w-auto rounded object-cover" />
                            <button 
                                onClick={clearImage}
                                disabled={isAnalyzing}
                                className="absolute -top-2 -right-2 bg-slate-800 text-white rounded-full p-1 hover:bg-red-500 transition-colors shadow-sm"
                            >
                                <X size={12} />
                            </button>
                        </div>
                    </div>
                )}

                {/* Action Bar inside the input box */}
                <div className="flex items-center justify-between px-3 py-2 bg-slate-50 dark:bg-slate-800/80 border-t border-gray-100 dark:border-slate-700">
                    <div className="flex gap-2">
                        {/* Hidden Inputs */}
                        <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileSelect} className="hidden" />
                        <input type="file" accept="image/*" capture="environment" ref={cameraInputRef} onChange={handleFileSelect} className="hidden" />
                        
                        <button 
                            type="button" 
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isAnalyzing}
                            className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-700 rounded-lg transition-colors"
                            title="Upload Image"
                        >
                            <ImageIcon size={18} />
                        </button>
                        <button 
                            type="button" 
                            onClick={() => cameraInputRef.current?.click()}
                            disabled={isAnalyzing}
                            className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-700 rounded-lg transition-colors"
                            title="Take Photo"
                        >
                            <Camera size={18} />
                        </button>
                    </div>

                    <button 
                        onClick={handleProcess}
                        disabled={isAnalyzing || (!selectedFile && !customInstructions.trim())}
                        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-1.5 rounded-lg hover:bg-blue-700 transition-all text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isAnalyzing ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                        Process
                    </button>
                </div>
            </div>

            <div className="text-center">
                <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-bold tracking-widest flex items-center justify-center gap-1">
                    <Sparkles size={12} /> Powered by InvoiceAI
                </p>
            </div>
        </div>
    );
};

export default UnifiedAiScanner;