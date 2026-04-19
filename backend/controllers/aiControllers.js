import { GoogleGenAI } from "@google/genai";
import Invoice from "../models/Invoice.js";

// Initialize the Google Gen AI SDK
const ai = new GoogleGenAI({ 
    apiKey: process.env.GOOGLE_API_KEY
});

// ==========================================
// 1. PARSE TEXT INTO INVOICE JSON
// ==========================================
export const parseInvoiceFormatText = async (req, res) => {
    try {
        const { invoiceText } = req.body;
        
        if (!invoiceText) {
            console.log("🔥 No invoice text provided in request body");
            return res.status(400).json({ message: "Please provide invoice text" });
        }
        
        const prompt = `You are an expert invoice data extraction AI. Analyze the following text and extract the relevant invoice details. 
    Format the extracted data strictly as a JSON object. Text to analyze: "${invoiceText}"
    
    The output MUST be a valid JSON object with exactly this structure:
    {
        "invoiceNumber": "string",
        "invoiceDate": "YYYY-MM-DD",
        "dueDate": "YYYY-MM-DD",
        "clientName": "string",    
        "email": "string",         
        "address": "string",       
        "items": [
            {
                "name": "string",  
                "quantity": number,
                "unitPrice": number,
                "tax": 0           
            }
        ],
        "notes": "string",
        "paymentTerms": "string"
    }`;

        // 🔥 THE FIX: Use config to force pure JSON output
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash", // Flash models are optimized for structured data tasks like this
            contents: prompt,
            config: {
                responseMimeType: "application/json", // This prevents the AI from adding any conversational text or markdown blocks
            }
        });
        
        const extractedText = response.text;
        
        // Because we used responseMimeType, we don't need messy regex replacements anymore!
        const parsedJson = JSON.parse(extractedText);

        res.json({ data: parsedJson });

    } catch (error) {
        console.error("🔥 AI PARSE ERROR:", error);
        res.status(500).json({ message: "Failed to parse invoice text", errorDetails: error.message });
    }
};

// controllers/aiController.js

// ==========================================
// 2 NEW: PARSE INVOICE FROM IMAGE
// ==========================================
export const parseInvoiceFromImage = async (req, res) => {
    try {
        const { imageBase64, mimeType, customInstructions } = req.body;
        
        if (!imageBase64 || !mimeType) {
            return res.status(400).json({ message: "Please provide an image" });
        }
        
        const prompt = `You are an expert AI data extraction engine specializing in complex, messy, handwritten, and multilingual Indian invoices and hospital bills. 
        Your task is to analyze the uploaded image and extract the billing details strictly matching the provided JSON schema.

        CRITICAL EXTRACTION RULES:
        1. Multilingual Names (CRITICAL): Look carefully at the top of the bill for the patient or client name. If the name is written in Devanagari script (Marathi/Hindi, e.g., "प्रशांत शेळके"), you MUST transliterate it accurately into English (e.g., "Prashant Shelke") and place it in the 'clientName' field.
        2. Invoice Number vs. Date: Do not confuse dates with invoice numbers. If a field says "Date: 12/1/2026", format it and put it in 'invoiceDate'. If there is no explicit invoice or receipt number, leave 'invoiceNumber' as an empty string. Do not force a date into the invoice number field.
        3. Medical & Handwriting Context: Apply medical billing context to fix poor handwriting and OCR errors. 
           - Correct "Nac dressing" to "VAC dressing".
           - Correct "Deductions chages" or "Ductus" to "Doctor charges".
           - Correct "Cathetriz" to "Catheterization charges".
           - Correct "Surgical nursig" to "Surgical nursing".
           - Recognize standard terms like "O.T. charges", "Ward charges", "Monitor charges", and "Hosp. biomedical waste".
        4. Clean Line Items: Remove stray marks, squiggles, or circled numbers (like ①, ②, ③) from the item descriptions. Keep the 'name' field clean, professional, and readable.
        5. Mathematical Fidelity: Extract the exact numeric price for every single line item exactly as written. Ensure the quantity is 1 unless explicitly stated otherwise.`;

        if (customInstructions) {
            prompt += `\n\nUSER'S ADDITIONAL INSTRUCTIONS: Pay close attention to this explicit user request and override the image data if necessary: "${customInstructions}"`;
        }

        const response = await ai.models.generateContent({
            // Flash models are extremely fast and cheap for multimodal image tasks
            model: "gemini-2.5-flash", 
            contents: [
                {
                    role: "user",
                    parts: [
                        { text: prompt },
                        {
                            inlineData: {
                                data: imageBase64,
                                mimeType: mimeType
                            }
                        }
                    ]
                }
            ],
            config: {
                responseMimeType: "application/json",
                // Forcing the strict schema so it matches your React formData perfectly
                responseSchema: {
                    type: "OBJECT",
                    properties: {
                        invoiceNumber: { type: "STRING" },
                        invoiceDate: { type: "STRING" },
                        dueDate: { type: "STRING" },
                        clientName: { type: "STRING" },
                        email: { type: "STRING" },
                        address: { type: "STRING" },
                        items: {
                            type: "ARRAY",
                            items: {
                                type: "OBJECT",
                                properties: {
                                    name: { type: "STRING" },
                                    quantity: { type: "NUMBER" },
                                    unitPrice: { type: "NUMBER" },
                                    tax: { type: "NUMBER" }
                                }
                            }
                        },
                        notes: { type: "STRING" },
                        paymentTerms: { type: "STRING" }
                    }
                }
            }
        });
        
        const parsedJson = JSON.parse(response.text);
        res.json({ data: parsedJson });

    } catch (error) {
        console.error("🔥 AI IMAGE PARSE ERROR:", error);
        res.status(500).json({ message: "Failed to parse image", errorDetails: error.message });
    }
};

// ==========================================
// 3. GENERATE REMINDER EMAIL
// ==========================================
export const generateReminderEmail = async (req, res) => {
    try {
        const { invoiceId } = req.body;
        console.log("🔥 BACKEND HIT! Looking for Invoice ID:", req.body.invoiceId);
        if (!invoiceId) {
            return res.status(400).json({ message: "Invoice ID is required" });
        }

        const invoice = await Invoice.findById(invoiceId);
        
        if (!invoice) {
            return res.status(404).json({ message: "Invoice not found" });
        }   

        // Fixed the prompt so it actually asks for an email using the database info
        const prompt = `You are a professional accountant. Write a polite, concise reminder email to a client for an unpaid invoice. 
        Here are the details:
        - Invoice Number: ${invoice.invoiceNumber}
        - Client Name/Address: ${invoice.billTo}
        - Total Amount Due: $${invoice.total}
        - Due Date: ${new Date(invoice.dueDate).toLocaleDateString()}
        
        Keep the tone friendly but professional. Do not include a subject line, just provide the email body.`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });  
        
        const reminderEmail = response.text;
        
        res.json({ reminderEmail });

    } catch (error) {
        console.error("🔥 EMAIL GENERATION ERROR:", error);
        res.status(500).json({ message: "Failed to generate reminder email", errorDetails: error.message });
    }
};

// ==========================================
// 4. GET DASHBOARD SUMMARY (Math Only, No AI needed)
// ==========================================
export const getDashboardSummary = async (req, res) => {
    try {
        const userId = req.user.id;
        
        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }

        // Removed the unused AI prompt that was crashing the function
        const invoices = await Invoice.find({ user: userId });
        
        const totalInvoices = invoices.length;
        const totalRevenue = invoices.reduce((acc, invoice) => acc + invoice.total, 0);
        
        // Calculate overdue invoices by comparing the due date to today
        const today = new Date();
        const overdueInvoices = invoices.filter(invoice => {
            return new Date(invoice.dueDate) < today && invoice.status !== 'Paid';
        }).length;
        
        res.json({ totalInvoices, totalRevenue, overdueInvoices });

    } catch (error) {
        console.error("🔥 DASHBOARD SUMMARY ERROR:", error);
        res.status(500).json({ message: "Failed to get dashboard summary", errorDetails: error.message });
    }
};