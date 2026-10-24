import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { getAllCategories, addCategory, updateCategory, deleteCategory } from "@/lib/db";

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const categories = getAllCategories();
  return NextResponse.json({ categories });
}

export async function POST(request: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { name, slug, description, iconName } = await request.json();
    if (!name || !slug) {
      return NextResponse.json({ error: "Category name and slug are required" }, { status: 400 });
    }

    const id = "cat-" + Date.now();
    addCategory({
      id,
      name: name.trim(),
      slug: slug.toLowerCase().trim().replace(/[^a-z0-9-_]/g, "-"),
      description: (description || "").trim(),
      iconName: iconName || "Gamepad2",
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to add category" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { slug, name, description, iconName } = await request.json();
    updateCategory(slug, name, description, iconName);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to update category" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");
    if (!slug) return NextResponse.json({ error: "Category slug required" }, { status: 400 });

    deleteCategory(slug);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to delete category" }, { status: 400 });
  }
}
