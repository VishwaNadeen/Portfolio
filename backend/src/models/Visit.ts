import mongoose, { Document, Schema } from "mongoose";

export interface IVisit extends Document {
  count: number;
  updatedAt: Date;
  createdAt: Date;
}

const VisitSchema = new Schema<IVisit>(
  {
    count: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Visit || mongoose.model<IVisit>("Visit", VisitSchema);