import Invoice from '../models/Invoice.js';

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

// ==========================================
// 1. GENERATE INVOICE VIA AI (Placeholder)
// ==========================================
export const generateInvoiceAI = async (req, res) => {
    const { prompt } = req.body;

    try {
        if (!prompt) {
            return res.status(400).json({ message: "Please provide a prompt for the AI" });
        }

        // --- MOCK AI RESPONSE (Replace with actual OpenAI/Gemini call later) ---
        const aiGeneratedData = {
            invoiceNumber: `INV-${Math.floor(Math.random() * 10000)}`,
            billTo: "Generated Client\nFrom Prompt",
            items: [
                { description: "AI Extracted Service", quantity: 1, unitPrice: 500, taxRate: 0 }
            ]
        };

        res.status(200).json({
            message: "AI successfully generated invoice data",
            data: aiGeneratedData
        });

    } catch (error) {
        console.error("🔥 AI GENERATION ERROR:", error);
        res.status(500).json({ message: "Failed to generate AI invoice", errorDetails: error.message });
    }
};

// ==========================================
// 2. CREATE INVOICE
// ==========================================
export const createInvoice = async (req, res) => {
    try {
        const user = req.user.id;
        
        // Removed the duplicate 'items' extraction that was crashing the app!
        const {
            invoiceNumber,
            invoiceDate,
            dueDate,
            billFrom,
            billTo,
            items,
            notes,
            paymentTerms,
        } = req.body;

        let subtotal = 0;
        let taxTotal = 0;

        // SMART FIX: Map items to calculate 'total' per item and ensure 'unitPrice' is used for Mongoose
        const formattedItems = items.map(item => {
            const quantity = normalizeNumber(item.quantity);
            const itemPrice = normalizeNumber(item.unitPrice || item.price || 0);
            const lineItemTotal = quantity * itemPrice;
            const itemTaxRate = normalizeNumber(item.taxRate || item.tax || 0);

            subtotal += lineItemTotal;
            taxTotal += lineItemTotal * itemTaxRate / 100;

            return {
                name: item.name || item.description,
                description: item.description || item.name,
                quantity,
                unitPrice: itemPrice, 
                taxRate: itemTaxRate,
                total: lineItemTotal  
            };
        });

        const total = subtotal + taxTotal;

        const invoice = new Invoice({
            user,
            invoiceNumber,
            invoiceDate,
            dueDate,
            billFrom,
            billTo,
            items: formattedItems, // Send the formatted items with individual totals
            notes,
            paymentTerms,
            subtotal,
            taxTotal,
            total,
        });

        const createdInvoice = await invoice.save();
        res.status(201).json(createdInvoice);

    } catch (error) {
        console.error("🔥 CREATE INVOICE ERROR:", error);
        res.status(500).json({ message: "Server error", errorDetails: error.message });
    }
};

// ==========================================
// 3. GET ALL INVOICES
// ==========================================
export const getInvoices = async (req, res) => {
    try {
        // Added a sort so the newest invoices show up at the top
        const invoices = await Invoice.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.json(invoices);
    } catch (error) {
        console.error("🔥 GET INVOICES ERROR:", error);
        res.status(500).json({ message: "Server error", errorDetails: error.message });
    }
};

// ==========================================
// 4. GET SINGLE INVOICE BY ID
// ==========================================
export const getInvoiceById = async (req, res) => {
    try {
        const invoice = await Invoice.findById(req.params.id);
        
        if (invoice && invoice.user.toString() === req.user.id) {
            res.json(invoice);
        } else {
            res.status(404).json({ message: "Invoice not found or unauthorized" });
        }
    } catch (error) {
        console.error("🔥 GET INVOICE BY ID ERROR:", error);
        res.status(500).json({ message: "Server error", errorDetails: error.message });
    }
};

// ==========================================
// 5. UPDATE INVOICE
// ==========================================
export const updateInvoice = async (req, res) => {
    try {
        let invoice = await Invoice.findById(req.params.id);
        
        if (invoice && invoice.user.toString() === req.user.id) {
            
            // Re-calculate totals and ensure items have description & taxRate mapped
            if (req.body.items) {
                let subtotal = 0;
                let taxTotal = 0;

                req.body.items = req.body.items.map(item => {
                    const quantity = normalizeNumber(item.quantity);
                    const itemPrice = normalizeNumber(item.unitPrice || item.price || 0);
                    const lineItemTotal = quantity * itemPrice;
                    const itemTaxRate = normalizeNumber(item.taxRate || item.tax || 0);

                    subtotal += lineItemTotal;
                    taxTotal += lineItemTotal * itemTaxRate / 100;

                    return {
                        ...item,
                        name: item.name || item.description,
                        description: item.description || item.name,
                        quantity,
                        unitPrice: itemPrice,
                        taxRate: itemTaxRate,
                        total: lineItemTotal
                    };
                });

                req.body.subtotal = subtotal;
                req.body.taxTotal = taxTotal;
                req.body.total = subtotal + taxTotal;
            }

            // Using findByIdAndUpdate is much safer and cleaner for updating full documents
            const updatedInvoice = await Invoice.findByIdAndUpdate(
                req.params.id,
                req.body, // This will apply whatever fields you send from Postman
                { new: true, runValidators: true } // Return the updated document & run schema checks
            );
            
            res.json(updatedInvoice);
        } else {
            res.status(404).json({ message: "Invoice not found or unauthorized" });
        }
    } catch (error) {
        console.error("🔥 UPDATE INVOICE ERROR:", error);
        res.status(500).json({ message: "Server error", errorDetails: error.message });
    }
};

// ==========================================
// 6. DELETE INVOICE
// ==========================================
export const deleteInvoice = async (req, res) => {
    try {
        const invoice = await Invoice.findById(req.params.id);
        
        if (invoice && invoice.user.toString() === req.user.id) {
            // Updated to deleteOne() as remove() is deprecated in newer Mongoose versions
            await invoice.deleteOne();
            res.json({ message: "Invoice removed successfully" });
        } else {
            res.status(404).json({ message: "Invoice not found or unauthorized" });
        }
    } catch (error) {
        console.error("🔥 DELETE INVOICE ERROR:", error);
        res.status(500).json({ message: "Server error", errorDetails: error.message });
    }
};
