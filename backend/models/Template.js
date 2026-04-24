import mongoose from "mongoose";

const templateSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  templateName: { type: String, default: "Default Template" },
  themeColor: { type: String, default: "#2563eb" }, // Default Tailwind Blue
  customHTML: { type: String, required: true },
  fontFamily: { type: String, default: "font-sans" },
  layoutStyle: { type: String, enum: ["left", "center", "right"], default: "left" },
  pageSize: { type: String, default: "A4" }
}, { timestamps: true });

const Template = mongoose.model("Template", templateSchema);
export default Template;