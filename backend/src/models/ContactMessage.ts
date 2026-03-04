import { Schema, model, models } from "mongoose";

export type ContactStatus = "new" | "replied" | "spam";

const ContactMessageSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    email: { type: String, required: true, trim: true, lowercase: true, maxlength: 254 },
    subject: { type: String, required: true, trim: true, maxlength: 120 },
    message: { type: String, required: true, trim: true, maxlength: 4000 },

    status: { type: String, enum: ["new", "replied", "spam"], default: "new" },

    userAgent: { type: String, trim: true, maxlength: 500 },
    ipHash: { type: String, trim: true, index: true }
  },
  { timestamps: true }
);

export const ContactMessage =
  models.ContactMessage || model("ContactMessage", ContactMessageSchema);