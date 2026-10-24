"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Search, Gamepad2, Menu, X, Sparkles, Shield, Compass, Trophy } from "lucide-react";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const pathname = usePathname();
  const router = useRouter();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/games?search=${encodeURIComponent(searchQuery.trim())}`);
      setMobileMenuOpen(false);
    }
  };

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Games", href: "/games" },
    { label: "Categories", href: "/games#categories" },
    { label: "Popular", href: "/games?sort=popular" },
    { label: "New Games", href: "/games?sort=newest" },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-surface-border bg-navy-900/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600 to-cyan-400 p-0.5 shadow-lg shadow-violet-500/20 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-navy-900 rounded-[10px] flex items-center justify-center">
              <Gamepad2 className="w-5 h-5 text-cyan-400 group-hover:text-cyan-300 transition-colors" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-xl tracking-tight text-white flex items-center gap-1">
              Play<span className="text-cyan">Nest</span>
            </span>
            <span className="text-[10px] font-medium text-gray-400 -mt-1 hidden sm:inline">
              Browser Gaming Portal
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.label}
                href={link.href}
                className={`text-sm font-semibold transition-colors hover:text-cyan ${
                  isActive ? "text-cyan" : "text-gray-300"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          {/* Premium Preview Link */}
          <Link
            href="/#premium"
            className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-violet-950/70 text-violet-300 border border-violet-500/30 hover:border-violet-400 transition"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Premium</span>
            <span className="text-[9px] uppercase px-1.5 py-0.5 rounded-sm bg-violet-800 text-violet-200">
              Soon
            </span>
          </Link>
        </nav>

        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="hidden sm:flex items-center relative max-w-xs w-full">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search games..."
            className="w-full bg-navy-950 text-sm text-gray-200 pl-9 pr-3 py-1.5 rounded-xl border border-surface-border focus:border-cyan focus:outline-none transition-colors"
          />
        </form>

        {/* Right Action: Admin Link & Mobile Hamburger */}
        <div className="flex items-center gap-2">
          <Link
            href="/admin"
            title="Admin Portal"
            className="hidden sm:flex items-center gap-1 text-xs font-medium text-gray-400 hover:text-white px-2.5 py-1.5 rounded-lg border border-surface-border bg-surface-card hover:bg-surface-elevated transition"
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Admin</span>
          </Link>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-gray-300 hover:text-white rounded-lg focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Accessible Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-surface-border bg-navy-900 px-4 pt-3 pb-6 space-y-3">
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search games..."
              className="w-full bg-navy-950 text-sm text-gray-200 pl-9 pr-3 py-2 rounded-xl border border-surface-border focus:border-cyan focus:outline-none"
            />
          </form>

          <div className="flex flex-col space-y-2 pt-2">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg text-sm font-semibold text-gray-200 hover:bg-surface-card hover:text-cyan transition"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/#premium"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-sm font-semibold text-violet-300 flex items-center justify-between"
            >
              <span className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" /> Premium Ad-Free
              </span>
              <span className="text-[10px] uppercase px-1.5 py-0.5 rounded bg-violet-800 text-violet-200">
                Coming Soon
              </span>
            </Link>
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-sm font-semibold text-gray-400 hover:text-white flex items-center gap-2"
            >
              <Shield className="w-4 h-4" /> Admin Dashboard
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

export function Footer() {
  return (
    <footer className="w-full border-t border-surface-border bg-navy-950 text-gray-400 text-sm mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Info */}
          <div className="md:col-span-1 space-y-3">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-violet-600 to-cyan-400 p-0.5">
                <div className="w-full h-full bg-navy-950 rounded-[6px] flex items-center justify-center">
                  <Gamepad2 className="w-4 h-4 text-cyan" />
                </div>
              </div>
              <span className="font-extrabold text-lg text-white">
                Play<span className="text-cyan">Nest</span>
              </span>
            </Link>
            <p className="text-xs text-gray-400 leading-relaxed">
              Find your next favourite game. Clean, lightweight, and genuinely playable browser games for all devices.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-3">Explore</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/games" className="hover:text-cyan transition">
                  All Games
                </Link>
              </li>
              <li>
                <Link href="/games?sort=popular" className="hover:text-cyan transition">
                  Popular Games
                </Link>
              </li>
              <li>
                <Link href="/games?sort=newest" className="hover:text-cyan transition">
                  New Releases
                </Link>
              </li>
              <li>
                <Link href="/games#categories" className="hover:text-cyan transition">
                  Browse Categories
                </Link>
              </li>
            </ul>
          </div>

          {/* Portal Information */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-3">PlayNest</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/about" className="hover:text-cyan transition">
                  About Portal
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-cyan transition">
                  Contact Support
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-cyan transition">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-cyan transition">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Lab Project & Cost Disclaimer */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-3">University Lab Project</h4>
            <p className="text-xs text-gray-400 leading-relaxed mb-2">
              Built for the Web Engineering Lab coursework. Developed with Next.js, Tailwind CSS, SQLite, and vanilla HTML5 game loops.
            </p>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-navy-900 border border-surface-border text-[11px] text-cyan">
              <span>● 100% Free & Local Stack</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-surface-border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400">
          <p>© {new Date().getFullYear()} PlayNest. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-white transition">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-white transition">
              Terms
            </Link>
            <Link href="/admin" className="hover:text-white transition">
              Admin Access
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
