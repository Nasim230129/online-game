import { NextRequest, NextResponse } from "next/server";
import { incrementLaunchCount, getGameBySlug } from "@/lib/db";

export async function POST(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const game = getGameBySlug(params.slug, true);
    if (!game) {
      return NextResponse.json({ error: "Game not found" }, { status: 404 });
    }

    const newCount = incrementLaunchCount(params.slug);
    return NextResponse.json({ success: true, launchCount: newCount });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal error" }, { status: 500 });
  }
}
