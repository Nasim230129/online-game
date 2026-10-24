import { NextRequest, NextResponse } from "next/server";
import { saveContactMessage, getContactMessages, markContactMessageRead } from "@/lib/db";
import { getAdminSession } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const { name, email, subject, message } = await request.json();

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    // Basic email check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
    }

    const saved = saveContactMessage({
      name: name.trim(),
      email: email.trim(),
      subject: subject.trim(),
      message: message.trim(),
    });

    return NextResponse.json({
      success: true,
      message: "Message received and stored successfully in the database.",
      id: saved.id,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to submit message" }, { status: 500 });
  }
}

// GET contact messages for admin
export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const messages = getContactMessages();
  return NextResponse.json({ messages });
}

// PATCH to mark as read
export async function PATCH(request: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { id } = await request.json();
    if (!id) return NextResponse.json({ error: "Message id required" }, { status: 400 });
    markContactMessageRead(id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed" }, { status: 500 });
  }
}
