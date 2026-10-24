# PlayNest - Browser Gaming Portal

> **Tagline:** Find your next favourite game.  
> **Coursework:** University Web Engineering Lab Project  
> **Stack:** Next.js 14 (App Router) + TypeScript + Tailwind CSS + SQLite (`better-sqlite3`) + Vanilla HTML5 Game Engines

PlayNest is a fast, responsive browser gaming portal where visitors can discover and play free browser games with zero install, instant launch, and private device high scores. It includes a custom server-validated game-management engine and admin dashboard.

---

## 1. Quick Setup & Run Instructions

### Prerequisites
- Node.js 18+ (verified on Node.js v22.22.1)
- npm 9+

### Installation & Run Commands

```bash
# 1. Install dependencies (lockfile reproducible)
npm install

# 2. Configure environment variables (a pre-configured .env.local is supplied)
cp .env.example .env.local

# 3. Build optimized production bundle
npm run build

# 4. Start production server
npm run start
```
The application will be accessible at **`http://localhost:3000`**.

For development with hot reload:
```bash
npm run dev
```

---

## 2. Secure Admin Credentials

An administrative dashboard is located at **`/admin`**.

- **Default Admin Username:** `admin`
- **Default Admin Password:** `adminPassword123!`

### Production Credential Modification
Admin credentials are not committed in plain text. Passwords are hash-verified with `bcryptjs`:
1. Generate a new bcrypt hash:
   ```bash
   node -e 'const bcrypt = require("bcryptjs"); console.log(bcrypt.hashSync("yourNewPasswordHere", 10));'
   ```
2. Update `ADMIN_USERNAME` and `ADMIN_PASSWORD_HASH` in `.env.local`.  
   *(Note: Remember to escape `$` characters as `\$` in `.env` files to prevent shell variable substitution in Next.js).*
3. Set a strong `JWT_SECRET` string (minimum 32 characters).

---

## 3. Technology Architecture & Architectural Trade-Offs

### Technology Choices
- **Next.js 14 App Router & TypeScript:** Provides type safety, instant SSR for SEO, dynamic metadata for game pages, and fast API route handlers.
- **Tailwind CSS:** Consistent design system matching client specifications (Deep navy `#0B1120`, Violet `#8B5CF6`, Cyan `#06B6D4`, responsive cards, accessible contrast, reduced-motion compliance).
- **SQLite with `better-sqlite3`:** Embedded, synchronous, zero-latency database storage with WAL journal mode. No cloud databases, paid accounts, or Docker containers required.
- **JWT + httpOnly Session Cookies:** Stateless, cryptographically signed administrative authentication with server-side origin and CSRF protection.

### Architectural Choice: Custom Module vs. WordPress Gaming Theme/Plugin
| Evaluation Criterion | Custom Next.js + SQLite Module (PlayNest) | WordPress + Gaming Theme / Plugin |
| :--- | :--- | :--- |
| **Licensing & Recurring Costs** | **100% Free & Open Source.** Zero theme fees, zero plugin renewals. | High upfront and annual recurring costs for commercial themes (e.g. MyArcadePlugin, GamePortal themes, $59–$199/yr). |
| **Performance & Load Times** | Extremely lean (<100 kB initial JS bundle). Instantaneous game rendering. | Bloated DOM, heavy database query overhead, multiple third-party plugin stylesheets. |
| **Security Surface** | Minimal attack surface; strict HTTP-only cookies, parameterized SQL queries, server-validated HTTPS embed whitelisting. | Frequent vulnerabilities in PHP plugins, insecure file uploaders, and arbitrary iframe injection. |
| **Lab Project Requirements** | Fully custom-built, demonstrating full-stack engineering proficiency and modern component design. | Pre-made CMS installation with low academic engineering merit. |

---

## 4. Bundled Playable Games

PlayNest ships with **6 genuinely playable, zero-dependency HTML5 games** representing every required category:

1. **Sliding Puzzle (Puzzle):** 3x3 sliding tile challenge with guaranteed solvable permutation generation (via inversion parity check). Tracks moves and completion time.
2. **Target Tap (Action):** High-reflex speed game. Tap random glowing targets within dynamic expiration windows; includes combo multipliers and golden bonus targets.
3. **Lane Racer (Racing):** Neon highway lane-dodging racer. Smooth 60 FPS animation loop with collision detection and distance meter. Includes on-screen touch arrows and WASD/Arrow key controls.
4. **Snake Classic (Arcade):** Grid-based retro snake with growing tail segments, directional controls, pause/resume capability, and apple score points.
5. **Treasure Maze (Adventure):** Procedural stone labyrinth with guaranteed reachability to all 3 sparkling gems and the golden exit chest.
6. **Memory Match (Brain Training):** 12-card glyph recall grid. Turn cards to match twin pairs in the fewest moves.

---

## 5. Adding, Editing, and Organising Games

Through the `/admin` portal:
1. **Add Game:** Click **"Add Game"**. Fill in the title, unique slug, description, instructions, category, and implementation type.
   - For **Built-in Games**, select one of the bundled HTML5 engine identifiers.
   - For **External Embeds**, input a verified HTTPS embed URL from authorized origins (`itch.io`, `html5.gamedistribution.com`). Disallowed origins are rejected by server validation.
2. **Featured Game:** Click the Star icon on any game row to set it as the prominent homepage hero banner.
3. **Publish / Unpublish:** Toggle between "Published" and "Draft" status with a single click. Draft games are hidden from the public catalogue and search.
4. **Category Management:** Create new categories or delete existing ones (with relational cascade integrity protections).

---

## 6. Screenshots

- Desktop Homepage: `screenshots/desktop-home.png`
- Mobile Homepage (390px): `screenshots/mobile-home.png`
- Game Catalogue & Filtering: `screenshots/desktop-games.png`
- Playable Game View: `screenshots/desktop-lane-racer.png`

---

## 7. Hosting & Deployment Notes

- **Persistent Filesystem Requirement:** SQLite stores data in a local file (`./data/playnest.db`). When deploying to production (e.g. VPS, Render, Railway, Fly.io, or DigitalOcean), attach a **persistent volume** so database records and launch counters survive container redeployments. Ephemeral serverless platforms (e.g., standard Vercel serverless functions) have read-only or reset filesystems and are unsuitable without external SQLite syncing (such as Turso or Litestream).
