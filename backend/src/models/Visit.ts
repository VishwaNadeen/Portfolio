import { Schema, model, models } from "mongoose";

const VisitSchema = new Schema(
  {
    visitedAt: { type: Date, default: Date.now },

    page: { type: String, required: true, trim: true, maxlength: 200 },
    referrer: { type: String, trim: true, maxlength: 500 },

    device: { type: String, enum: ["mobile", "desktop", "unknown"], default: "unknown" },

    country: { type: String, trim: true, maxlength: 80 },
    city: { type: String, trim: true, maxlength: 80 },

    sessionId: { type: String, required: true, trim: true, index: true, maxlength: 100 }
  },
  { timestamps: true }
);

export const Visit = models.Visit || model("Visit", VisitSchema);