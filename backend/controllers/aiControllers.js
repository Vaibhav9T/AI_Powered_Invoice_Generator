import { GoogleGenAI } from "@google/genai";
import Invoice from "../models/Invoice.js";

// Initialize the Google Gen AI SDK
const ai = new GoogleGenAI({ 
    apiKey: process.env.GOOGLE_API_KEY
});

const normalizeNumber = (value) => {
    if (typeof value === "number" && Number.isFinite(value)) {
        return value;
    }

    if (typeof value !== "string") {
        return 0;
    }

    const cleaned = value.replace(/[^0-9.-]/g, "");
    if (!cleaned || cleaned === "-" || cleaned === "." || cleaned === "-.") {
        return 0;
    }

    const parsed = Number(cleaned);
    return Number.isFinite(parsed) ? parsed : 0;
};

const scrubAiInvoiceData = (data) => {
    const items = Array.isArray(data?.items) ? data.items : [];

    return {
        ...data,
        items: items.map((item) => {
            const rawUnitPrice = item?.unitPrice ?? item?.price ?? item?.rate;
            const rawTax = item?.tax ?? item?.taxRate;

            return {
                ...item,
                name: item?.name || item?.description || item?.itemName || "Extracted Item",
                quantity: normalizeNumber(item?.quantity),
                unitPrice: normalizeNumber(rawUnitPrice),
                tax: normalizeNumber(rawTax)
            };
        })
    };
};

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
    }

    PRICING RULES:
    - Extract numbers exactly as written; do not infer or guess missing digits.
    - Use digits only (no commas or currency symbols).
    - If a numeric value is unclear, set it to 0.
    - Do not compute totals; only extract the values present.`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-lite", 
            contents: prompt,
            config: {
                responseMimeType: "application/json", 
            }
        });
        
        const parsedJson = scrubAiInvoiceData(JSON.parse(response.text));
        res.json({ data: parsedJson });

    } catch (error) {
        console.error("🔥 AI PARSE ERROR:", error);
        res.status(500).json({ message: "Failed to parse invoice text", errorDetails: error.message });
    }
};

// ==========================================
// 2. PARSE INVOICE FROM IMAGE
// ==========================================
export const parseInvoiceFromImage = async (req, res) => {
    try {
        const { imageBase64, mimeType, customInstructions } = req.body;
        
        if (!imageBase64 || !mimeType) {
            return res.status(400).json({ message: "Please provide an image" });
        }
        
        const trimmedInstructions = typeof customInstructions === "string" ? customInstructions.trim() : "";

        // 🔥 THE FIX: A highly specialized, ironclad prompt for handwritten Indian Bills
        let prompt = `
You are an expert financial AI reading handwritten and printed Indian medical/business invoices. Your ONLY output must be a valid JSON object matching the provided schema.

CRITICAL RULES FOR ACCURACY (STRICT COMPLIANCE REQUIRED):
1. TRANSLATE NAMES: Look for handwritten names at the top (e.g., 'प्रशांत शेळके'). Translate/Transliterate them into English (e.g., "Prashant Shelke") and assign it to "clientName".
2. ITEM NAMES (PARTICULARS): Read the 'Particulars' or 'विवरण' column exactly. Write out the handwritten names (e.g., "Ward charges", "Nursing charges", "Doctor charges"). NEVER output generic words like "Service" or "Item". If you cannot read it perfectly, make your best guess based on medical context.
3. IGNORE COMMAS IN NUMBERS: Indian formatting uses commas uniquely (e.g., 1,03,900). A comma is NOT a decimal and NOT the number 3. Remove ALL commas before returning a number. 1,03,900 must become 103900.
4. DOCTOR CHARGES / FINAL ITEM: Be careful with the last item before the total. In many bills, the last item is "Doctor charges". Do NOT confuse the total amount with the last item's amount. 
5. RATE vs AMOUNT: If 'Quantity' is blank or '-', treat the 'Amount' as the 'unitPrice'.
6. NO MATH: Do not calculate the total. Only extract the exact raw numbers written in the rows.
`;

        if (trimmedInstructions) {
            prompt += `\n\nUSER'S ADDITIONAL INSTRUCTIONS (Follow these carefully!): "${trimmedInstructions}"`;
        }

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-lite", 
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
        
        const parsedJson = scrubAiInvoiceData(JSON.parse(response.text));

        // Cleanup notes if they just parrot the user prompt
        if (trimmedInstructions && typeof parsedJson.notes === "string") {
            const normalizedNotes = parsedJson.notes.trim().toLowerCase();
            const normalizedPrompt = trimmedInstructions.toLowerCase();
            const minMatchLength = 12;
            const notesContainPrompt = normalizedPrompt.length >= minMatchLength && normalizedNotes.includes(normalizedPrompt);
            const promptContainsNotes = normalizedNotes.length >= minMatchLength && normalizedPrompt.includes(normalizedNotes);

            if (normalizedNotes === normalizedPrompt || notesContainPrompt || promptContainsNotes) {
                parsedJson.notes = "";
            }
        }
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
        if (!invoiceId) {
            return res.status(400).json({ message: "Invoice ID is required" });
        }

        const invoice = await Invoice.findById(invoiceId);
        
        if (!invoice) {
            return res.status(404).json({ message: "Invoice not found" });
        }   

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
// 4. GET DASHBOARD SUMMARY
// ==========================================
export const getDashboardSummary = async (req, res) => {
    try {
        const userId = req.user.id;
        
        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }

        const invoices = await Invoice.find({ user: userId });
        
        const totalInvoices = invoices.length;
        const totalRevenue = invoices.reduce((acc, invoice) => acc + invoice.total, 0);
        
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



export const cloneTemplateFromImage = async (req, res) => {
    try {
        const { imageBase64, mimeType } = req.body;
        
        if (!imageBase64) return res.status(400).json({ message: "Please provide an image" });

        const prompt = `
        You are an expert UI/UX designer. Analyze the uploaded invoice image and extract its core design system.
        Return ONLY a strict JSON object matching this schema.
        
        RULES:
        1. themeColor: Find the dominant primary color used for headings, borders, or the logo. Return it as a HEX code (e.g., "#1E3A8A").
        2. fontFamily: Guess the closest CSS font family. Output strictly one of these three strings: "font-sans", "font-serif", or "font-mono".
        3. layoutStyle: Where is the main company logo or header text aligned? Output strictly one of these three strings: "left", "center", or "right".
        
        {
            "themeColor": "#HEXCODE",
            "fontFamily": "font-sans",
            "layoutStyle": "left"
        }
        `;

        const response = await ai.models.generateContent({
            // Switching back to Flash-Lite for instant 1-second responses
            model: "gemini-1.5-flash", 
            contents: [
                {
                    role: "user",
                    parts: [
                        { text: prompt },
                        { inlineData: { data: imageBase64, mimeType: mimeType } }
                    ]
                }
            ],
            config: {
                responseMimeType: "application/json"
            }
        });
        
        res.json({ data: JSON.parse(response.text) });

    } catch (error) {
        console.error("🔥 AI TEMPLATE CLONE ERROR:", error);
        res.status(500).json({ message: "Failed to clone template design." });
    }
};