import crypto from "crypto";

export function hashIp(ip: string, salt: string) {
  return crypto.createHmac("sha256", salt).update(ip).digest("hex");
}