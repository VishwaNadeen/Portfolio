import { Schema, model, models, type Model } from "mongoose";

export type Platform = "github" | "youtube";

export interface IPlatformStats {
  platform: Platform;
  data: Record<string, any>;
  fetchedAt: Date;
}

const PlatformStatsSchema = new Schema<IPlatformStats>(
  {
    platform: {
      type: String,
      enum: ["github", "youtube"],
      required: true,
      index: true,
    },

    // store any stats object (github/youtube)
    data: {
      type: Schema.Types.Mixed,
      required: true,
    },

    fetchedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  { timestamps: true }
);

PlatformStatsSchema.index({ platform: 1, fetchedAt: -1 });

export const PlatformStats: Model<IPlatformStats> =
  (models.PlatformStats as Model<IPlatformStats>) ||
  model<IPlatformStats>("PlatformStats", PlatformStatsSchema);