import mongoose, { Document, Model, Schema } from "mongoose";

export interface ICv extends Document {
  filename: string;
  contentType: string;
  size: number;
  data: Buffer;
  uploadedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const CvSchema = new Schema<ICv>(
  {
    filename: {
      type: String,
      required: true,
      trim: true,
    },
    contentType: {
      type: String,
      required: true,
      trim: true,
    },
    size: {
      type: Number,
      required: true,
    },
    data: {
      type: Buffer,
      required: true,
    },
    uploadedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const Cv: Model<ICv> =
  mongoose.models.Cv || mongoose.model<ICv>("Cv", CvSchema);

export default Cv;