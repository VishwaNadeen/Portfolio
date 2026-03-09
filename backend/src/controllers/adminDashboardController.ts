import { Request, Response } from "express";
import mongoose from "mongoose";
import Visit from "../models/Visit";

export async function getAdminHealth(req: Request, res: Response) {
  try {
    const dbConnected = mongoose.connection.readyState === 1;

    return res.json({
      backend: true,
      database: dbConnected,
    });
  } catch (error) {
    return res.status(500).json({
      backend: true,
      database: false,
      message: "Failed to check health",
    });
  }
}

export async function getAdminStats(req: Request, res: Response) {
  try {
    const visitDoc = await Visit.findOne();

    return res.json({
      visits: visitDoc?.count ?? 0,
      lastSync: null, // පස්සේ GitHub sync time add කරන්න පුළුවන්
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to load admin stats",
    });
  }
}