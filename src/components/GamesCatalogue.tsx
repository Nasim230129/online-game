"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Game, Category } from "@/types";
import { GameCard, AdPlaceholder } from "@/components/Cards";
import { Search, Filter, RotateCcw, SlidersHorizontal, Gamepad2 } from "lucide-react";

interface GamesCatalogueProps {
  initialGames: Game[];
  categories: Category[];
  initialCategory?: string;
  initialSearch?: string;
  initialSort?: string;
}

export function GamesCatalogue({
  initialGames,
  categories,
  initialCategory = "all",
  initialSearch = "",
  initialSort = "newest",
}: GamesCatalogueProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Read current query parameters if provided
  const querySearch = searchParams.get("search") || initialSearch;
  const queryCategory = searchParams.get("category") || initialCategory;
  const querySort = searchParams.get("sort") || initialSort;

  const [search, setSearch] = useState(querySearch);
  const [selectedCategory, setSelectedCategory] = useState(queryCategory);
  const [sortBy, setSortBy] = useState(querySort);

  // Sync state when URL params change
  React.useEffect(() => {
    if (searchParams.has("search")) setSearch(searchParams.get("search") || "");
    if (searchParams.has("category")) setSelectedCategory(searchParams.get("category") || "all");
    if (searchParams.has("sort")) setSortBy(searchParams.get("sort") || "newest");
  }, [searchParams]);

  const updateFilters = (newCat: string, newSort: string, newSearch: string) => {
    const params = new URLSearchParams();
    if (newCat && newCat !== "all") params.set("category", newCat);
    if (newSort && newSort !== "newest") params.set("sort", newSort);
    if (newSearch.trim()) params.set("search", newSearch.trim());

    const queryString = params.toString();
    router.push(queryString ? `/games?${queryString}` : "/games");
  };

  const handleCategoryChange = (slug: string) => {
    setSelectedCategory(slug);
    updateFilters(slug, sortBy, search);
  };

  const handleSortChange = (newSort: string) => {
    setSortBy(newSort);
    updateFilters(selectedCategory, newSort, search);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters(selectedCategory, sortBy, search);
  };

  const handleReset = () => {
    setSearch("");
    setSelectedCategory("all");
    setSortBy("newest");
    router.push("/games");
  };

  // Filtered and sorted games
  const filteredGames = useMemo(() => {
    return initialGames
      .filter((game) => {
        // Category filter
        const matchCat =
          selectedCategory === "all" || game.categorySlug.toLowerCase() === selectedCategory.toLowerCase();
        // Search filter (title or description or instructions)
        const q = search.toLowerCase().trim();
        const matchSearch =
          !q ||
          game.title.toLowerCase().includes(q) ||
          game.shortDescription.toLowerCase().includes(q) ||
          game.categorySlug.toLowerCase().includes(q);

        return matchCat && matchSearch;
      })
      .sort((a, b) => {
        if (sortBy === "popular") {
          return b.launchCount - a.launchCount || a.title.localeCompare(b.title);
        } else if (sortBy === "name") {
          return a.title.localeCompare(b.title);
        } else {
          // newest
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
      });
  }, [initialGames, selectedCategory, search, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-surface-border pb-6">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Game Catalogue
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Browse, search and launch our collection of instant browser games.
          </p>
        </div>

        {/* Total stats pill */}
        <div className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-surface-card border border-surface-border text-cyan self-start md:self-auto">
          Showing {filteredGames.length} of {initialGames.length} games
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="bg-surface-card border border-surface-border rounded-2xl p-4 sm:p-5 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* Search Field */}
          <form onSubmit={handleSearchSubmit} className="md:col-span-5 relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by game title, keyword or tag..."
              className="w-full bg-navy-950 text-sm text-gray-200 pl-10 pr-4 py-2 rounded-xl border border-surface-border focus:border-cyan focus:outline-none transition"
            />
          </form>

          {/* Category Dropdown */}
          <div className="md:col-span-4 flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400 shrink-0 hidden sm:block" />
            <select
              value={selectedCategory}
              onChange={(e) => handleCategoryChange(e.target.value)}
              aria-label="Filter by category"
              className="w-full bg-navy-950 text-sm text-gray-200 px-3 py-2 rounded-xl border border-surface-border focus:border-cyan focus:outline-none"
            >
              <option value="all">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Sorting Dropdown */}
          <div className="md:col-span-3 flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-gray-400 shrink-0 hidden sm:block" />
            <select
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value)}
              aria-label="Sort games"
              className="w-full bg-navy-950 text-sm text-gray-200 px-3 py-2 rounded-xl border border-surface-border focus:border-cyan focus:outline-none"
            >
              <option value="newest">Sort: Newest</option>
              <option value="popular">Sort: Most Played</option>
              <option value="name">Sort: Name (A-Z)</option>
            </select>
          </div>
        </div>

        {/* Quick Category Chips */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-surface-border/60">
          <span className="text-xs text-gray-400 mr-1">Quick Filter:</span>
          <button
            onClick={() => handleCategoryChange("all")}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition ${
              selectedCategory === "all"
                ? "bg-cyan text-navy-950"
                : "bg-navy-950 text-gray-300 hover:text-white border border-surface-border"
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryChange(cat.slug)}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition ${
                selectedCategory === cat.slug
                  ? "bg-cyan text-navy-950"
                  : "bg-navy-950 text-gray-300 hover:text-white border border-surface-border"
              }`}
            >
              {cat.name}
            </button>
          ))}
          {(selectedCategory !== "all" || search || sortBy !== "newest") && (
            <button
              onClick={handleReset}
              className="ml-auto text-xs font-medium text-rose-400 hover:text-rose-300 flex items-center gap-1 py-1 px-2.5"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Main Content Layout with optional desktop sidebar ad */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Game Grid */}
        <div className="lg:col-span-9">
          {filteredGames.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredGames.map((game) => (
                <GameCard key={game.id} game={game} />
              ))}
            </div>
          ) : (
            /* Clear Empty State */
            <div className="rounded-3xl bg-surface-card border border-surface-border p-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-navy-950 border border-surface-border flex items-center justify-center mx-auto text-gray-400">
                <Gamepad2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-white">No games matched your criteria</h3>
              <p className="text-sm text-gray-400 max-w-sm mx-auto">
                Try adjusting your search terms, clearing keywords, or selecting another category.
              </p>
              <button
                onClick={handleReset}
                className="px-6 py-2.5 bg-gradient-to-r from-violet-600 to-cyan-500 text-white font-bold rounded-xl shadow-lg inline-flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" /> Reset Filters
              </button>
            </div>
          )}
        </div>

        {/* Sidebar Ads & High Score info */}
        <aside className="lg:col-span-3 space-y-6">
          <AdPlaceholder slot="sidebar" />

          {/* Quick tips card */}
          <div className="rounded-2xl bg-surface-card border border-surface-border p-4 text-xs space-y-2">
            <h4 className="font-bold text-white uppercase tracking-wider">Fast Play Tips</h4>
            <p className="text-gray-400 leading-relaxed">
              All games load instantaneously without plugins. Fullscreen mode is supported for immersive play.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
