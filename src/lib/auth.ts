import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { getDb } from "./db";

const JWT_SECRET = process.env.JWT_SECRET || "super_secret_playnest_dev_jwt_key_93817420938471203984712398";
const SECRET_KEY = new TextEncoder().encode(JWT_SECRET);
const COOKIE_NAME = "playnest_admin_token";

// Configured admin credentials
const ADMIN_USER = process.env.ADMIN_USERNAME || "admin";
// Default password hash for "adminPassword123!" if not overridden
const ADMIN_HASH = process.env.ADMIN_PASSWORD_HASH || "$2b$10$okzo53XmSgIYYk6.i6EN0O7ndViWaO4pwrGasVXB/HIuKMEJQNfc.";

export interface SessionPayload {
  username: string;
  role: "admin";
  iat?: number;
  exp?: number;
}

// Rate limiting for admin login attempts
export function checkRateLimit(ip: string): { allowed: boolean; remainingMs?: number } {
  const db = getDb();
  const row = db.prepare("SELECT * FROM login_attempts WHERE ip = ?").get(ip) as any;
  const now = new Date().getTime();

  if (row && row.lockedUntil) {
    const lockedUntilMs = new Date(row.lockedUntil).getTime();
    if (lockedUntilMs > now) {
      return { allowed: false, remainingMs: lockedUntilMs - now };
    }
  }
  return { allowed: true };
}

export function recordFailedLogin(ip: string): void {
  const db = getDb();
  const row = db.prepare("SELECT * FROM login_attempts WHERE ip = ?").get(ip) as any;
  const now = new Date();

  if (!row) {
    db.prepare("INSERT INTO login_attempts (ip, attempts, lastAttempt) VALUES (?, 1, ?)").run(ip, now.toISOString());
  } else {
    const newAttempts = row.attempts + 1;
    let lockedUntil: string | null = null;
    // Lock for 5 minutes after 5 consecutive failed attempts
    if (newAttempts >= 5) {
      lockedUntil = new Date(now.getTime() + 5 * 60 * 1000).toISOString();
    }
    db.prepare("UPDATE login_attempts SET attempts = ?, lastAttempt = ?, lockedUntil = ? WHERE ip = ?").run(
      newAttempts,
      now.toISOString(),
      lockedUntil,
      ip
    );
  }
}

export function resetFailedLogin(ip: string): void {
  const db = getDb();
  db.prepare("DELETE FROM login_attempts WHERE ip = ?").run(ip);
}

export async function verifyAdminCredentials(user: string, pass: string): Promise<boolean> {
  const adminUser = process.env.ADMIN_USERNAME || "admin";
  const adminHash = process.env.ADMIN_PASSWORD_HASH || "$2b$10$okzo53XmSgIYYk6.i6EN0O7ndViWaO4pwrGasVXB/HIuKMEJQNfc.";
  console.log("Checking credentials: inputUser=", user, "expectedUser=", adminUser, "hashPrefix=", adminHash.substring(0, 10));
  if (user !== adminUser) {
    return false;
  }
  return bcrypt.compare(pass, adminHash);
}

export async function createAdminToken(username: string): Promise<string> {
  return new SignJWT({ username, role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(SECRET_KEY);
}

export async function verifyAdminToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET_KEY);
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

export async function getAdminSession(): Promise<SessionPayload | null> {
  const cookieStore = cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyAdminToken(token);
}

export function isAllowedEmbedOrigin(urlString: string): boolean {
  try {
    const url = new URL(urlString);
    if (url.protocol !== "https:") return false;

    const allowed = (process.env.ALLOWED_EMBED_ORIGINS || "https://itch.io,https://v6p9d9t4.ssl.hwcdn.net,https://html5.gamedistribution.com")
      .split(",")
      .map((s) => s.trim().toLowerCase());

    return allowed.some((allowedOrigin) => {
      const allowedUrl = new URL(allowedOrigin);
      return url.origin.toLowerCase() === allowedUrl.origin.toLowerCase();
    });
  } catch {
    return false;
  }
}
