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
            return res.status(400).json({ message: "Please provide invoice text" });
        }
        
        const prompt = `You are an expert invoice data extraction AI. Analyze the following text and extract the relevant invoice details. 
            Format the extracted data strictly as a JSON object. Text to analyze: "${invoiceText}"
            
            The output MUST be a valid JSON object with exactly this structure:
            {
                "invoiceNumber": "string",
                "invoiceDate": "YYYY-MM-DD",
                "dueDate": "YYYY-MM-DD",
                "billFrom": "string",
                "billTo": "string",
                "items": [
                    {
                        "description": "string",
                        "quantity": number,
                        "unitPrice": number
                    }
                ],
                "notes": "string",
                "paymentTerms": "string"
            }`;

        // Using the correct syntax for the new GoogleGenAI SDK
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-lite",
            contents: prompt,
        });
        
        const extractedText = response.text;
        
        // Gemini often wraps JSON in markdown blocks (```json ... ```).
        // We must strip those out before parsing, otherwise JSON.parse crashes!
        const cleanedData = extractedText.replace(/```json\n?|```/g, '').trim();
        const parsedJson = JSON.parse(cleanedData);

        res.json({ data: parsedJson });

    } catch (error) {
        console.error("🔥 AI PARSE ERROR:", error);
        res.status(500).json({ message: "Failed to parse invoice text", errorDetails: error.message });
    }
};

// ==========================================
// 2. GENERATE REMINDER EMAIL
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
            model: "gemini-2.5-flash-lite",
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
// 3. GET DASHBOARD SUMMARY (Math Only, No AI needed)
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