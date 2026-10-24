# Requirements Mapping Document: PlayNest

This document maps all specified client and lab criteria directly to their concrete implementation locations in the PlayNest codebase.

| Lab / Client Requirement | Implemented Location / Mechanism | Verification Status |
| :--- | :--- | :--- |
| **Brand Identity** | Name: **PlayNest**, Tagline: *"Find your next favourite game."* Deep navy `#0B1120`, violet `#8B5CF6`, cyan `#06B6D4`. | Verified in `tailwind.config.ts`, `globals.css`, `Navigation.tsx`. |
| **Zero Cost & Free Stack** | Next.js 14, Tailwind CSS, SQLite (`better-sqlite3`), Lucide icons, bcryptjs, jose. Zero paid APIs, accounts, or themes. | Verified in `package.json`, runs 100% locally. |
| **Public vs Admin Separation** | Public routes (`/`, `/games`, `/games/[slug]`, `/about`, `/contact`, `/privacy`, `/terms`). Protected route (`/admin`). | Verified in `src/app/*`. |
| **Catalogue Database Persistence** | SQLite database with WAL mode in `data/playnest.db`. Seeds automatically if empty. No localStorage reliance for games catalogue. | Verified in `src/lib/db.ts`. |
| **Homepage: Featured Game Banner** | Prominent hero banner showing featured game with original SVG artwork, launch count, and direct "Play Now" action. | Verified in `src/app/page.tsx`. |
| **Homepage: 6 Required Categories** | Puzzle, Action, Racing, Arcade, Adventure, Brain Training. Direct links to filtered catalogue. | Verified in `src/app/page.tsx` & `src/lib/db.ts`. |
| **Homepage: Popular & New Games** | Popular ranked deterministically by actual tracked `launchCount`. New ranked by `createdAt` timestamp. | Verified in `src/app/page.tsx`. |
| **Homepage: Labelled Ads & Premium Preview** | Clearly marked "Advertisement" slots. "Premium Pass" with explicit "Coming soon" notice and non-checkout informational button. | Verified in `src/components/Cards.tsx` & `src/app/page.tsx`. |
| **Game Catalogue & Browsing** | Search input, category dropdown + chips, sorting (Newest, Most Played, Name A-Z), clear empty state, reset filters button. | Verified in `src/components/GamesCatalogue.tsx`. |
| **6 Playable Bundled Games** | 1. Sliding Puzzle (Solvable guaranteed parity check)<br>2. Target Tap (Reflex speed challenge with combos)<br>3. Lane Racer (Smooth 60fps traffic dodging with distance)<br>4. Snake Classic (Apples, pause, length score)<br>5. Treasure Maze (9x9 guaranteed path, gems, exit chest)<br>6. Memory Match (12 cards, pair matching, move tracking) | Verified in `src/components/games/*.tsx`. |
| **Game Page Details & Cleanup** | Breadcrumb navigation, title, instructions, responsive playable canvas, fullscreen toggle, related games, and local device high scores. Timers & animation frames cleaned up on unmount. | Verified in `src/components/GameDetailClient.tsx`. |
| **Actual Launch Count Tracking** | Launches incremented via `POST /api/games/[slug]/launch` only when user actively clicks "Start Game", never on render or page view. | Verified in `src/components/GameDetailClient.tsx` & `src/app/api/games/[slug]/launch/route.ts`. |
| **Protected Admin Dashboard** | `/admin` with bcrypt-verified login, JWT HTTP-only cookies, rate-limiting brute force protection, game CRUD, publish/unpublish, feature toggling, category management, contact enquiries view. | Verified in `src/app/admin/page.tsx`, `src/lib/auth.ts`, `src/app/api/admin/*`. |
| **Embed Security & Origin Whitelist** | Rejects unverified or HTTP origins. Embed iframes sandboxed with `allow-scripts allow-same-origin allow-forms`. Explains embed blocks. | Verified in `src/lib/auth.ts`, `src/app/api/admin/games/route.ts`, `src/components/GameDetailClient.tsx`. |
| **Supporting Pages** | `/about`, `/contact` (stores validated enquiries into SQLite database), `/privacy`, `/terms`, custom `/not-found`. | Verified in `src/app/*`. |
| **Performance, SEO & Accessibility** | Semantic HTML, labels on inputs, keyboard arrows/WASD + on-screen mobile touch D-Pads, `sitemap.xml`, `robots.txt` (blocking admin/api). | Verified in `src/app/sitemap.ts`, `src/app/robots.ts`, responsive tests. |
