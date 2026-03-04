import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

type AdminJwtPayload = {
  role: "admin";
  iat?: number;
  exp?: number;
};

export function adminAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const header = req.headers.authorization;

    // check header
    if (!header || !header.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // extract token
    const token = header.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Token missing" });
    }

    const secret = process.env.JWT_SECRET;

    if (!secret) {
      return res.status(500).json({
        message: "Server misconfigured (JWT_SECRET missing)",
      });
    }

    const decoded = jwt.verify(token, secret) as unknown as AdminJwtPayload;

    if (!decoded || decoded.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
}