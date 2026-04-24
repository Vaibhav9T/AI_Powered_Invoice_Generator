import Template from "../models/Template.js";

// @desc    Create or update the user's invoice template
// @route   POST /api/templates
// @access  Private
export const saveTemplate = async (req, res) => {
    try {
        const userId = req.user.id; // From your auth middleware

        // "upsert: true" means if it doesn't exist, create it. If it does, update it!
        const template = await Template.findOneAndUpdate(
            { user: userId },
            { ...req.body, user: userId },
            { new: true, upsert: true }
        );

        res.status(200).json({
            success: true,
            message: "Template saved successfully",
            data: template
        });
    } catch (error) {
        console.error("🔥 TEMPLATE SAVE ERROR:", error);
        res.status(500).json({ success: false, message: "Failed to save template" });
    }
};

// @desc    Get the user's saved template
// @route   GET /api/templates
// @access  Private
export const getTemplate = async (req, res) => {
    try {
        const template = await Template.findOne({ user: req.user.id });
        
        // If they don't have one yet, return a null data object so frontend can use defaults
        res.status(200).json({
            success: true,
            data: template || null
        });
    } catch (error) {
        console.error("🔥 TEMPLATE FETCH ERROR:", error);
        res.status(500).json({ success: false, message: "Failed to fetch template" });
    }
};