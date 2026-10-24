import Link from "next/link";
import { Gamepad2, Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full text-center space-y-6 p-8 rounded-3xl bg-surface-card border border-surface-border shadow-2xl">
        <div className="w-16 h-16 rounded-2xl bg-navy-950 border border-surface-border flex items-center justify-center mx-auto text-cyan">
          <Gamepad2 className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h1 className="text-4xl font-black text-white">404</h1>
          <h2 className="text-xl font-bold text-gray-200">Level Not Found</h2>
          <p className="text-xs text-gray-400 leading-relaxed">
            The game or page you are looking for has been moved, unpublished, or does not exist in our catalogue.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href="/"
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 text-white font-bold text-xs flex items-center justify-center gap-2 shadow"
          >
            <Home className="w-4 h-4" /> Return Home
          </Link>
          <Link
            href="/games"
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-navy-950 hover:bg-navy-900 border border-surface-border text-gray-300 hover:text-white font-semibold text-xs flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" /> Browse Games
          </Link>
        </div>
      </div>
    </div>
  );
}
