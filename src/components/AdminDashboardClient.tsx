"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Game, Category, ContactMessage, BUILTIN_GAMES } from "@/types";
import {
  Gamepad2,
  FolderTree,
  Mail,
  Plus,
  Trash2,
  Edit,
  Sparkles,
  Eye,
  EyeOff,
  LogOut,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Loader2,
  RefreshCw,
} from "lucide-react";

interface AdminDashboardClientProps {
  initialGames: Game[];
  initialCategories: Category[];
  initialMessages: ContactMessage[];
}

export function AdminDashboardClient({
  initialGames,
  initialCategories,
  initialMessages,
}: AdminDashboardClientProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"games" | "categories" | "messages">("games");

  const [games, setGames] = useState<Game[]>(initialGames);
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [messages, setMessages] = useState<ContactMessage[]>(initialMessages);

  // Status banners
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  // Game Modal state
  const [showGameModal, setShowGameModal] = useState(false);
  const [editingGame, setEditingGame] = useState<Game | null>(null);
  const [gameFormData, setGameFormData] = useState({
    title: "",
    slug: "",
    shortDescription: "",
    instructions: "",
    categorySlug: initialCategories[0]?.slug || "puzzle",
    thumbnailSvg: "puzzle-thumb",
    gameType: "builtin" as "builtin" | "external",
    builtinId: "sliding-puzzle",
    embedUrl: "",
    isFeatured: false,
    isPublished: true,
  });

  // Category Modal state
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [categoryFormData, setCategoryFormData] = useState({
    name: "",
    slug: "",
    description: "",
    iconName: "Gamepad2",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const showFeedback = (text: string, type: "success" | "error" = "success") => {
    setStatusMessage({ text, type });
    setTimeout(() => setStatusMessage(null), 4000);
  };

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.refresh();
  };

  // Open Create Game modal
  const handleOpenAddGame = () => {
    setEditingGame(null);
    setGameFormData({
      title: "",
      slug: "",
      shortDescription: "",
      instructions: "",
      categorySlug: categories[0]?.slug || "puzzle",
      thumbnailSvg: "puzzle-thumb",
      gameType: "builtin",
      builtinId: "sliding-puzzle",
      embedUrl: "",
      isFeatured: false,
      isPublished: true,
    });
    setShowGameModal(true);
  };

  // Open Edit Game modal
  const handleOpenEditGame = (game: Game) => {
    setEditingGame(game);
    setGameFormData({
      title: game.title,
      slug: game.slug,
      shortDescription: game.shortDescription,
      instructions: game.instructions,
      categorySlug: game.categorySlug,
      thumbnailSvg: game.thumbnailSvg,
      gameType: game.gameType,
      builtinId: game.builtinId || "sliding-puzzle",
      embedUrl: game.embedUrl || "",
      isFeatured: game.isFeatured,
      isPublished: game.isPublished,
    });
    setShowGameModal(true);
  };

  // Submit Game (Add or Update)
  const handleSaveGame = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatusMessage(null);

    try {
      if (editingGame) {
        // PUT update
        const res = await fetch("/api/admin/games", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            slug: editingGame.slug,
            updates: {
              ...gameFormData,
              newSlug: gameFormData.slug !== editingGame.slug ? gameFormData.slug : undefined,
            },
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);

        showFeedback(`Game "${gameFormData.title}" updated successfully.`);
      } else {
        // POST create
        const res = await fetch("/api/admin/games", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(gameFormData),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);

        showFeedback(`New game "${gameFormData.title}" created successfully.`);
      }

      // Refresh games list
      const updated = await fetch("/api/admin/games").then((r) => r.json());
      if (updated.games) setGames(updated.games);
      setShowGameModal(false);
    } catch (err: any) {
      showFeedback(err.message || "Failed to save game", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Toggle Game Published
  const handleTogglePublish = async (game: Game) => {
    try {
      const res = await fetch("/api/admin/games", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug: game.slug,
          updates: { isPublished: !game.isPublished },
        }),
      });
      if (res.ok) {
        setGames((prev) =>
          prev.map((g) => (g.slug === game.slug ? { ...g, isPublished: !g.isPublished } : g))
        );
        showFeedback(`Game "${game.title}" ${!game.isPublished ? "published" : "unpublished"}.`);
      }
    } catch {
      showFeedback("Failed to update status", "error");
    }
  };

  // Toggle Feature Game
  const handleToggleFeature = async (game: Game) => {
    try {
      const res = await fetch("/api/admin/games", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug: game.slug,
          updates: { isFeatured: !game.isFeatured },
        }),
      });
      if (res.ok) {
        setGames((prev) =>
          prev.map((g) => ({
            ...g,
            isFeatured: g.slug === game.slug ? !game.isFeatured : false,
          }))
        );
        showFeedback(`Featured game set to "${game.title}".`);
      }
    } catch {
      showFeedback("Failed to feature game", "error");
    }
  };

  // Delete Game with confirmation
  const handleDeleteGame = async (slug: string, title: string) => {
    if (!window.confirm(`Are you sure you want to permanently delete "${title}"?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/games?slug=${slug}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error);
      }
      setGames((prev) => prev.filter((g) => g.slug !== slug));
      showFeedback(`Game "${title}" deleted.`);
    } catch (err: any) {
      showFeedback(err.message || "Failed to delete game", "error");
    }
  };

  // Create Category
  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(categoryFormData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      const refreshed = await fetch("/api/admin/categories").then((r) => r.json());
      if (refreshed.categories) setCategories(refreshed.categories);
      setShowCategoryModal(false);
      showFeedback(`Category "${categoryFormData.name}" added.`);
    } catch (err: any) {
      showFeedback(err.message || "Failed to add category", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete Category
  const handleDeleteCategory = async (slug: string, name: string) => {
    if (!window.confirm(`Delete category "${name}"?`)) return;

    try {
      const res = await fetch(`/api/admin/categories?slug=${slug}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setCategories((prev) => prev.filter((c) => c.slug !== slug));
      showFeedback(`Category "${name}" deleted.`);
    } catch (err: any) {
      showFeedback(err.message || "Failed to delete category", "error");
    }
  };

  // Total launches across portal
  const totalLaunches = games.reduce((acc, g) => acc + g.launchCount, 0);
  const publishedCount = games.filter((g) => g.isPublished).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Admin Header Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-surface-border pb-6">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-2">
            Play<span className="text-cyan">Nest</span> Control Center
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Server-validated administrative suite for catalogue, categories and submissions.
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="self-start sm:self-auto px-4 py-2 rounded-xl bg-surface-card hover:bg-surface-elevated border border-surface-border text-xs font-semibold text-gray-300 hover:text-rose-400 flex items-center gap-1.5 transition"
        >
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      </div>

      {/* Real Metrics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-surface-card border border-surface-border space-y-1">
          <span className="text-xs text-gray-400 font-medium">Published Games</span>
          <div className="text-2xl font-black text-white">
            {publishedCount} <span className="text-xs text-gray-500 font-normal">/ {games.length}</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-surface-card border border-surface-border space-y-1">
          <span className="text-xs text-gray-400 font-medium">Recorded Launches</span>
          <div className="text-2xl font-black text-cyan">{totalLaunches}</div>
        </div>

        <div className="p-5 rounded-2xl bg-surface-card border border-surface-border space-y-1">
          <span className="text-xs text-gray-400 font-medium">Categories</span>
          <div className="text-2xl font-black text-violet-400">{categories.length}</div>
        </div>

        <div className="p-5 rounded-2xl bg-surface-card border border-surface-border space-y-1">
          <span className="text-xs text-gray-400 font-medium">Contact Enquiries</span>
          <div className="text-2xl font-black text-amber-400">{messages.length}</div>
        </div>
      </div>

      {/* Status Feedback Toast */}
      {statusMessage && (
        <div
          className={`p-4 rounded-2xl border text-sm flex items-center gap-2.5 transition-all animate-fade-in ${
            statusMessage.type === "success"
              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
              : "bg-rose-500/10 border-rose-500/30 text-rose-300"
          }`}
        >
          {statusMessage.type === "success" ? (
            <CheckCircle2 className="w-5 h-5 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 shrink-0" />
          )}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-surface-border">
        <button
          onClick={() => setActiveTab("games")}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 flex items-center gap-2 transition ${
            activeTab === "games"
              ? "border-cyan text-cyan"
              : "border-transparent text-gray-400 hover:text-white"
          }`}
        >
          <Gamepad2 className="w-4 h-4" /> Games ({games.length})
        </button>

        <button
          onClick={() => setActiveTab("categories")}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 flex items-center gap-2 transition ${
            activeTab === "categories"
              ? "border-cyan text-cyan"
              : "border-transparent text-gray-400 hover:text-white"
          }`}
        >
          <FolderTree className="w-4 h-4" /> Categories ({categories.length})
        </button>

        <button
          onClick={() => setActiveTab("messages")}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 flex items-center gap-2 transition ${
            activeTab === "messages"
              ? "border-cyan text-cyan"
              : "border-transparent text-gray-400 hover:text-white"
          }`}
        >
          <Mail className="w-4 h-4" /> Contact Enquiries ({messages.length})
        </button>
      </div>

      {/* TAB 1: GAMES MANAGEMENT */}
      {activeTab === "games" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">Catalogue Management</h2>
            <button
              onClick={handleOpenAddGame}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-violet-500/20"
            >
              <Plus className="w-4 h-4" /> Add Game
            </button>
          </div>

          <div className="rounded-2xl bg-surface-card border border-surface-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-gray-300">
                <thead className="bg-navy-950 text-gray-400 uppercase text-[10px] tracking-wider border-b border-surface-border">
                  <tr>
                    <th className="py-3 px-4">Game</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Type</th>
                    <th className="py-3 px-4">Launches</th>
                    <th className="py-3 px-4">Featured</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-border">
                  {games.map((g) => (
                    <tr key={g.id} className="hover:bg-navy-900/40 transition">
                      <td className="py-3 px-4">
                        <div className="font-bold text-white">{g.title}</div>
                        <div className="text-[11px] text-gray-500 font-mono">/{g.slug}</div>
                      </td>
                      <td className="py-3 px-4 capitalize">{g.categorySlug}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded bg-navy-950 border border-surface-border text-[10px] uppercase">
                          {g.gameType}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-bold text-cyan">{g.launchCount}</td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => handleToggleFeature(g)}
                          title="Click to toggle featured"
                          className={`p-1.5 rounded-lg border text-xs transition ${
                            g.isFeatured
                              ? "bg-amber-500/20 border-amber-500/40 text-amber-300 font-bold"
                              : "bg-navy-950 border-surface-border text-gray-500 hover:text-white"
                          }`}
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                        </button>
                      </td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => handleTogglePublish(g)}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase transition ${
                            g.isPublished
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                              : "bg-slate-800 text-gray-400 border border-slate-700"
                          }`}
                        >
                          {g.isPublished ? "Published" : "Draft"}
                        </button>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenEditGame(g)}
                            title="Edit Game"
                            className="p-1.5 rounded-lg bg-navy-950 hover:bg-navy-900 border border-surface-border text-gray-300 hover:text-white transition"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteGame(g.slug, g.title)}
                            title="Delete Game"
                            className="p-1.5 rounded-lg bg-navy-950 hover:bg-rose-950/40 border border-surface-border text-rose-400 hover:text-rose-300 transition"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CATEGORIES MANAGEMENT */}
      {activeTab === "categories" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">Categories</h2>
            <button
              onClick={() => {
                setCategoryFormData({ name: "", slug: "", description: "", iconName: "Gamepad2" });
                setShowCategoryModal(true);
              }}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 text-white font-bold text-xs flex items-center gap-1.5 shadow"
            >
              <Plus className="w-4 h-4" /> Add Category
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((c) => (
              <div
                key={c.id}
                className="p-4 rounded-2xl bg-surface-card border border-surface-border space-y-2 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-white">{c.name}</span>
                    <span className="text-[10px] font-mono text-gray-500">/{c.slug}</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">{c.description}</p>
                </div>

                <div className="pt-3 border-t border-surface-border flex items-center justify-between text-xs">
                  <span className="text-cyan font-mono text-[11px]">{c.iconName}</span>
                  <button
                    onClick={() => handleDeleteCategory(c.slug, c.name)}
                    className="p-1 text-rose-400 hover:text-rose-300 transition"
                    title="Delete category"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: CONTACT ENQUIRIES */}
      {activeTab === "messages" && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-white">Visitor Inquiries</h2>

          {messages.length === 0 ? (
            <div className="p-8 text-center text-xs text-gray-400 rounded-2xl bg-surface-card border border-surface-border">
              No inquiries received yet. Submissions through the contact form will appear here.
            </div>
          ) : (
            <div className="space-y-3">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className="p-4 rounded-2xl bg-surface-card border border-surface-border space-y-2"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white">{m.name}</span>
                      <span className="text-gray-400">({m.email})</span>
                    </div>
                    <span className="text-[11px] text-gray-500 font-mono">
                      {new Date(m.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <div className="text-xs font-semibold text-cyan">{m.subject}</div>
                  <p className="text-xs text-gray-300 bg-navy-950 p-3 rounded-xl border border-surface-border/60">
                    {m.message}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* GAME MODAL (ADD / EDIT) */}
      {showGameModal && (
        <div className="fixed inset-0 z-50 bg-navy-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-xl bg-surface-card border border-surface-border rounded-3xl p-6 sm:p-8 space-y-4 shadow-2xl my-8">
            <h3 className="text-xl font-bold text-white">
              {editingGame ? "Edit Game Record" : "Add Game to Catalogue"}
            </h3>

            <form onSubmit={handleSaveGame} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 font-semibold mb-1" htmlFor="gm-title">
                    Game Title
                  </label>
                  <input
                    id="gm-title"
                    type="text"
                    required
                    value={gameFormData.title}
                    onChange={(e) => {
                      const t = e.target.value;
                      setGameFormData((prev) => ({
                        ...prev,
                        title: t,
                        slug: editingGame ? prev.slug : t.toLowerCase().replace(/[^a-z0-9]/g, "-"),
                      }));
                    }}
                    placeholder="e.g. Star Shooter"
                    className="w-full bg-navy-950 text-white px-3 py-2 rounded-xl border border-surface-border focus:border-cyan focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 font-semibold mb-1" htmlFor="gm-slug">
                    Unique Slug (URL)
                  </label>
                  <input
                    id="gm-slug"
                    type="text"
                    required
                    value={gameFormData.slug}
                    onChange={(e) => setGameFormData({ ...gameFormData, slug: e.target.value })}
                    placeholder="star-shooter"
                    className="w-full bg-navy-950 text-white px-3 py-2 rounded-xl border border-surface-border focus:border-cyan focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-300 font-semibold mb-1" htmlFor="gm-desc">
                  Short Description
                </label>
                <textarea
                  id="gm-desc"
                  required
                  rows={2}
                  value={gameFormData.shortDescription}
                  onChange={(e) => setGameFormData({ ...gameFormData, shortDescription: e.target.value })}
                  placeholder="Enter a compelling description for game listings..."
                  className="w-full bg-navy-950 text-white px-3 py-2 rounded-xl border border-surface-border focus:border-cyan focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-300 font-semibold mb-1" htmlFor="gm-inst">
                  Gameplay Instructions & Controls
                </label>
                <textarea
                  id="gm-inst"
                  required
                  rows={2}
                  value={gameFormData.instructions}
                  onChange={(e) => setGameFormData({ ...gameFormData, instructions: e.target.value })}
                  placeholder="Control tips, keys, objectives..."
                  className="w-full bg-navy-950 text-white px-3 py-2 rounded-xl border border-surface-border focus:border-cyan focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 font-semibold mb-1" htmlFor="gm-cat">
                    Category
                  </label>
                  <select
                    id="gm-cat"
                    value={gameFormData.categorySlug}
                    onChange={(e) => setGameFormData({ ...gameFormData, categorySlug: e.target.value })}
                    className="w-full bg-navy-950 text-white px-3 py-2 rounded-xl border border-surface-border focus:border-cyan focus:outline-none"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.slug}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-300 font-semibold mb-1" htmlFor="gm-type">
                    Game Implementation Type
                  </label>
                  <select
                    id="gm-type"
                    value={gameFormData.gameType}
                    onChange={(e) =>
                      setGameFormData({
                        ...gameFormData,
                        gameType: e.target.value as "builtin" | "external",
                      })
                    }
                    className="w-full bg-navy-950 text-white px-3 py-2 rounded-xl border border-surface-border focus:border-cyan focus:outline-none"
                  >
                    <option value="builtin">Bundled Built-in Game</option>
                    <option value="external">External Verified Embed</option>
                  </select>
                </div>
              </div>

              {/* Implementation Logic selector */}
              {gameFormData.gameType === "builtin" ? (
                <div>
                  <label className="block text-gray-300 font-semibold mb-1" htmlFor="gm-builtin">
                    Built-in Game Logic
                  </label>
                  <select
                    id="gm-builtin"
                    value={gameFormData.builtinId}
                    onChange={(e) =>
                      setGameFormData({
                        ...gameFormData,
                        builtinId: e.target.value,
                        thumbnailSvg: e.target.value,
                      })
                    }
                    className="w-full bg-navy-950 text-white px-3 py-2 rounded-xl border border-surface-border focus:border-cyan focus:outline-none"
                  >
                    {BUILTIN_GAMES.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name} ({b.categorySlug})
                      </option>
                    ))}
                  </select>
                  <p className="text-[11px] text-gray-400 mt-1">
                    Selects one of the 6 bundled HTML5 implementations. New custom logic must be written as code.
                  </p>
                </div>
              ) : (
                <div>
                  <label className="block text-gray-300 font-semibold mb-1" htmlFor="gm-embed">
                    External HTTPS Embed URL
                  </label>
                  <input
                    id="gm-embed"
                    type="url"
                    value={gameFormData.embedUrl}
                    onChange={(e) => setGameFormData({ ...gameFormData, embedUrl: e.target.value })}
                    placeholder="https://itch.io/..."
                    className="w-full bg-navy-950 text-white px-3 py-2 rounded-xl border border-surface-border focus:border-cyan focus:outline-none font-mono"
                  />
                  <p className="text-[11px] text-gray-400 mt-1">
                    Allowed origins: Itch.io, GameDistribution. Unverified sources are rejected by server origin validation.
                  </p>
                </div>
              )}

              {/* Checkboxes */}
              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-gray-300">
                  <input
                    type="checkbox"
                    checked={gameFormData.isPublished}
                    onChange={(e) => setGameFormData({ ...gameFormData, isPublished: e.target.checked })}
                    className="rounded bg-navy-950 border-surface-border text-cyan focus:ring-0"
                  />
                  <span>Published (Visible to public)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-gray-300">
                  <input
                    type="checkbox"
                    checked={gameFormData.isFeatured}
                    onChange={(e) => setGameFormData({ ...gameFormData, isFeatured: e.target.checked })}
                    className="rounded bg-navy-950 border-surface-border text-cyan focus:ring-0"
                  />
                  <span>Featured on Homepage</span>
                </label>
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-surface-border">
                <button
                  type="button"
                  onClick={() => setShowGameModal(false)}
                  className="px-4 py-2 rounded-xl bg-navy-950 text-gray-400 hover:text-white border border-surface-border"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 text-white font-bold shadow flex items-center gap-1.5 disabled:opacity-50"
                >
                  {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>{editingGame ? "Save Changes" : "Create Game"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CATEGORY MODAL */}
      {showCategoryModal && (
        <div className="fixed inset-0 z-50 bg-navy-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-surface-card border border-surface-border rounded-3xl p-6 space-y-4 shadow-2xl">
            <h3 className="text-xl font-bold text-white">Add Category</h3>

            <form onSubmit={handleSaveCategory} className="space-y-4 text-xs">
              <div>
                <label className="block text-gray-300 font-semibold mb-1" htmlFor="cat-name">
                  Category Name
                </label>
                <input
                  id="cat-name"
                  type="text"
                  required
                  value={categoryFormData.name}
                  onChange={(e) => {
                    const n = e.target.value;
                    setCategoryFormData({
                      ...categoryFormData,
                      name: n,
                      slug: n.toLowerCase().replace(/[^a-z0-9]/g, "-"),
                    });
                  }}
                  placeholder="e.g. Strategy"
                  className="w-full bg-navy-950 text-white px-3 py-2 rounded-xl border border-surface-border focus:border-cyan focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-300 font-semibold mb-1" htmlFor="cat-slug">
                  Slug
                </label>
                <input
                  id="cat-slug"
                  type="text"
                  required
                  value={categoryFormData.slug}
                  onChange={(e) => setCategoryFormData({ ...categoryFormData, slug: e.target.value })}
                  className="w-full bg-navy-950 text-white px-3 py-2 rounded-xl border border-surface-border focus:border-cyan focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-gray-300 font-semibold mb-1" htmlFor="cat-desc">
                  Short Description
                </label>
                <textarea
                  id="cat-desc"
                  rows={2}
                  value={categoryFormData.description}
                  onChange={(e) => setCategoryFormData({ ...categoryFormData, description: e.target.value })}
                  placeholder="Brief summary of games in this genre..."
                  className="w-full bg-navy-950 text-white px-3 py-2 rounded-xl border border-surface-border focus:border-cyan focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-surface-border">
                <button
                  type="button"
                  onClick={() => setShowCategoryModal(false)}
                  className="px-4 py-2 rounded-xl bg-navy-950 text-gray-400 hover:text-white border border-surface-border"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 text-white font-bold shadow flex items-center gap-1.5"
                >
                  {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>Save Category</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
