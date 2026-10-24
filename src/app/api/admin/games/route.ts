import { NextRequest, NextResponse } from "next/server";
import { getAdminSession, isAllowedEmbedOrigin } from "@/lib/auth";
import {
  getAllGamesAdmin,
  createGame,
  updateGame,
  deleteGame,
  getGameBySlug,
} from "@/lib/db";
import { BUILTIN_GAMES } from "@/types";

// GET all games for admin table
export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const games = getAllGamesAdmin();
  return NextResponse.json({ games });
}

// POST create game
export async function POST(request: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const {
      title,
      slug,
      shortDescription,
      instructions,
      categorySlug,
      thumbnailSvg,
      gameType,
      builtinId,
      embedUrl,
      isFeatured,
      isPublished,
    } = body;

    // Strict validation
    if (!title || !slug || !shortDescription || !instructions || !categorySlug) {
      return NextResponse.json({ error: "All text fields are required" }, { status: 400 });
    }

    // Slug format validation
    const formattedSlug = slug
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9-_]/g, "-");

    const existing = getGameBySlug(formattedSlug, true);
    if (existing) {
      return NextResponse.json({ error: `Game with slug "${formattedSlug}" already exists.` }, { status: 400 });
    }

    if (gameType === "builtin") {
      const validBuiltin = BUILTIN_GAMES.some((b) => b.id === builtinId);
      if (!validBuiltin) {
        return NextResponse.json({ error: "Invalid built-in game identifier selected." }, { status: 400 });
      }
    } else if (gameType === "external") {
      if (!embedUrl || !isAllowedEmbedOrigin(embedUrl)) {
        return NextResponse.json(
          {
            error:
              "Embed URL rejected. For security, only verified HTTPS URLs from authorized origins are permitted.",
          },
          { status: 400 }
        );
      }
    }

    const created = createGame({
      title: title.trim(),
      slug: formattedSlug,
      shortDescription: shortDescription.trim(),
      instructions: instructions.trim(),
      categorySlug,
      thumbnailSvg: thumbnailSvg || builtinId || "puzzle-thumb",
      gameType: gameType || "builtin",
      builtinId: builtinId || null,
      embedUrl: embedUrl || null,
      isFeatured: Boolean(isFeatured),
      isPublished: isPublished !== undefined ? Boolean(isPublished) : true,
    });

    return NextResponse.json({ success: true, game: created });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to create game" }, { status: 500 });
  }
}

// PUT update game
export async function PUT(request: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { slug, updates } = body;

    if (!slug) {
      return NextResponse.json({ error: "Game slug is required" }, { status: 400 });
    }

    const existing = getGameBySlug(slug, true);
    if (!existing) {
      return NextResponse.json({ error: "Game not found" }, { status: 404 });
    }

    if (updates.gameType === "external" && updates.embedUrl) {
      if (!isAllowedEmbedOrigin(updates.embedUrl)) {
        return NextResponse.json(
          { error: "Embed URL rejected. Only verified HTTPS origins are allowed." },
          { status: 400 }
        );
      }
    }

    updateGame(slug, updates);
    return NextResponse.json({ success: true, message: "Game updated successfully" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to update game" }, { status: 500 });
  }
}

// DELETE game
export async function DELETE(request: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");

    if (!slug) {
      return NextResponse.json({ error: "Game slug is required" }, { status: 400 });
    }

    deleteGame(slug);
    return NextResponse.json({ success: true, message: "Game deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to delete game" }, { status: 500 });
  }
}
