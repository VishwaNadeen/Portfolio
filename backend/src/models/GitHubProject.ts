import mongoose, { Schema, model, models, type Model } from "mongoose";

export type DeviceType = "mobile" | "desktop" | "unknown";

export interface IGitHubProject {
  repoId: number;
  name: string;
  fullName: string;
  htmlUrl: string;

  description?: string;
  language?: string;
  topics: string[];

  stars: number;
  forks: number;

  updatedAtGithub?: Date;
  pushedAt?: Date;

  featured: boolean;
  displayOrder: number;
  isHidden: boolean;

  customTitle?: string;
  customDescription?: string;
  liveUrl?: string;
}

const GitHubProjectSchema = new Schema<IGitHubProject>(
  {
    repoId: { type: Number, required: true, unique: true, index: true },
    name: { type: String, required: true, trim: true },
    fullName: { type: String, required: true, trim: true },
    htmlUrl: { type: String, required: true, trim: true },

    description: { type: String, trim: true, default: "" },
    language: { type: String, trim: true, default: "" },
    topics: { type: [String], default: [] },

    stars: { type: Number, default: 0 },
    forks: { type: Number, default: 0 },

    updatedAtGithub: { type: Date },
    pushedAt: { type: Date },

    featured: { type: Boolean, default: false, index: true },
    displayOrder: { type: Number, default: 9999, index: true },
    isHidden: { type: Boolean, default: false, index: true },

    customTitle: { type: String, trim: true },
    customDescription: { type: String, trim: true },
    liveUrl: { type: String, trim: true }
  },
  { timestamps: true }
);

export const GitHubProject: Model<IGitHubProject> =
  (models.GitHubProject as Model<IGitHubProject>) ||
  model<IGitHubProject>("GitHubProject", GitHubProjectSchema);