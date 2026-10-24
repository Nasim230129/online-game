import { NextRequest, NextResponse } from "next/server";
import {
  verifyAdminCredentials,
  createAdminToken,
  checkRateLimit,
  recordFailedLogin,
  resetFailedLogin,
} from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for") || "127.0.0.1";
    const rateCheck = checkRateLimit(ip);
    if (!rateCheck.allowed) {
      const waitSec = Math.ceil((rateCheck.remainingMs || 60000) / 1000);
      return NextResponse.json(
        { error: `Too many failed attempts. Try again in ${waitSec} seconds.` },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json({ error: "Username and password required" }, { status: 400 });
    }

    const isValid = await verifyAdminCredentials(username, password);
    if (!isValid) {
      console.log("verifyAdminCredentials returned false. user:", username, "pass length:", password?.length);
      recordFailedLogin(ip);
      return NextResponse.json({ error: "Invalid admin credentials" }, { status: 401 });
    }

    // Success -> reset attempts
    resetFailedLogin(ip);
    const token = await createAdminToken(username);

    const response = NextResponse.json({ success: true, message: "Authentication successful" });
    response.cookies.set("playnest_admin_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24, // 24 hours
    });

    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Server error" }, { status: 500 });
  }
}
