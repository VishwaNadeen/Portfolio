import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

type AdminJwtPayload = {
  role: "admin";
  username?: string;
  iat?: number;
  exp?: number;
};

const COOKIE_NAME = process.env.COOKIE_NAME || "admin_token";

export function adminAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.cookies?.[COOKIE_NAME];

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const secret = process.env.JWT_SECRET;

    if (!secret) {
      return res.status(500).json({
        message: "Server misconfigured (JWT_SECRET missing)",
      });
    }

    const decoded = jwt.verify(token, secret) as AdminJwtPayload;

    if (!decoded || decoded.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
}