"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Shield, Lock, User, AlertCircle, Loader2 } from "lucide-react";

export function AdminLoginForm() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Login failed");
      } else {
        router.refresh();
      }
    } catch {
      setError("An unexpected network error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-8 rounded-3xl bg-surface-card border border-surface-border shadow-2xl space-y-6">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-violet-600 to-cyan-500 flex items-center justify-center mx-auto shadow-lg shadow-violet-500/25">
          <Shield className="w-6 h-6 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-white tracking-tight">Admin Portal</h2>
        <p className="text-xs text-gray-400">
          Enter authorized administrative credentials to manage games, categories and enquiries.
        </p>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-gray-300 mb-1.5" htmlFor="admin-user">
            Username
          </label>
          <div className="relative">
            <User className="w-4 h-4 text-gray-400 absolute left-3 top-3 pointer-events-none" />
            <input
              id="admin-user"
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. admin"
              className="w-full bg-navy-950 text-sm text-gray-200 pl-10 pr-3 py-2.5 rounded-xl border border-surface-border focus:border-cyan focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-300 mb-1.5" htmlFor="admin-pass">
            Password
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3 pointer-events-none" />
            <input
              id="admin-pass"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full bg-navy-950 text-sm text-gray-200 pl-10 pr-3 py-2.5 rounded-xl border border-surface-border focus:border-cyan focus:outline-none"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-gradient-to-r from-violet-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 text-white font-bold rounded-xl shadow-lg shadow-violet-500/25 flex items-center justify-center gap-2 transition disabled:opacity-50"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Sign In to Dashboard"}
        </button>
      </form>

      <div className="p-3 rounded-xl bg-navy-950/60 border border-surface-border/60 text-[11px] text-gray-400 text-center">
        <span>Default local demo: </span>
        <code className="text-cyan">admin</code> / <code className="text-cyan">adminPassword123!</code>
      </div>
    </div>
  );
}
