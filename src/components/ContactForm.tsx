"use client";

import React, { useState } from "react";
import { Mail, Send, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

export function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Submission failed");
      }

      setSubmitted(true);
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (err: any) {
      setError(err.message || "Could not submit enquiry. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12 space-y-8">
      <div className="text-center space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-cyan">Get in touch</span>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">Contact PlayNest</h1>
        <p className="text-sm text-gray-400">
          Have game suggestions, bug reports, or lab feedback? Send us a direct message.
        </p>
      </div>

      <div className="rounded-3xl bg-surface-card border border-surface-border p-6 sm:p-8 shadow-2xl">
        {submitted ? (
          <div className="py-8 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
            <h3 className="text-xl font-bold text-white">Message Received!</h3>
            <p className="text-sm text-gray-300 max-w-sm mx-auto">
              Thank you! Your enquiry has been securely saved to the database. Administrators can inspect your message directly in the admin portal.
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="mt-4 px-6 py-2.5 rounded-xl bg-navy-950 hover:bg-navy-900 border border-surface-border text-xs font-bold text-cyan"
            >
              Send Another Enquiry
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {error && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-300 font-semibold mb-1" htmlFor="c-name">
                  Your Name
                </label>
                <input
                  id="c-name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Alex Smith"
                  className="w-full bg-navy-950 text-white text-sm px-3.5 py-2.5 rounded-xl border border-surface-border focus:border-cyan focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-300 font-semibold mb-1" htmlFor="c-email">
                  Email Address
                </label>
                <input
                  id="c-email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="alex@example.com"
                  className="w-full bg-navy-950 text-white text-sm px-3.5 py-2.5 rounded-xl border border-surface-border focus:border-cyan focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-300 font-semibold mb-1" htmlFor="c-subject">
                Subject
              </label>
              <input
                id="c-subject"
                type="text"
                required
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                placeholder="e.g. Question regarding game mechanics"
                className="w-full bg-navy-950 text-white text-sm px-3.5 py-2.5 rounded-xl border border-surface-border focus:border-cyan focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-gray-300 font-semibold mb-1" htmlFor="c-msg">
                Message Content
              </label>
              <textarea
                id="c-msg"
                required
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Write your note here..."
                className="w-full bg-navy-950 text-white text-sm px-3.5 py-2.5 rounded-xl border border-surface-border focus:border-cyan focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 text-white font-bold text-sm shadow-lg shadow-violet-500/25 flex items-center justify-center gap-2 transition disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              <span>Submit Message</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
