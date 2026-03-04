import { Router } from "express";
import { ContactMessage } from "../models/ContactMessage";
import { hashIp } from "../utils/ipHash";

const router = Router();

router.post("/", async (req, res) => {
  const { name, email, subject, message } = req.body ?? {};

  if (!name || !email || !subject || !message) {
    return res.status(400).json({ message: "Missing required fields." });
  }

  const userAgent = String(req.headers["user-agent"] || "");
  const rawIp =
    (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() ||
    req.socket.remoteAddress ||
    "";

  const salt = process.env.IP_HASH_SALT || "dev_salt";
  const ipHash = rawIp ? hashIp(rawIp, salt) : undefined;

  const doc = await ContactMessage.create({
    name,
    email,
    subject,
    message,
    status: "new",
    userAgent,
    ipHash
  });

  return res.status(201).json({ message: "Saved", id: doc._id });
});

export default router;