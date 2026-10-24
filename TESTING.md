# Testing and Verification Report: PlayNest

## Summary of Verification Procedures

The PlayNest platform was tested comprehensively across static compilation, database integrity, backend route authorization, gameplay mechanics, and multi-resolution visual layout.

---

## 1. Automated Test Results

An automated integration script was executed against the live server instance at `http://localhost:3000`:

| Test Case | Scenario / Operation | Expected Behavior | Actual Result | Status |
| :--- | :--- | :--- | :--- | :--- |
| **TC-01** | Public Homepage (`/`) | HTTP 200 with PlayNest title & featured game | HTTP 200, Title verified, Lane Racer hero rendered | **PASS** |
| **TC-02** | Playable Game Pages (`/games/[slug]`) | All 6 game routes return HTTP 200 | Sliding Puzzle, Target Tap, Lane Racer, Snake, Treasure Maze, Memory Match all return 200 | **PASS** |
| **TC-03** | Unauthenticated Mutation Protection | Direct `GET /api/admin/games` without token | HTTP 401 Unauthorized returned | **PASS** |
| **TC-04** | Launch Counter Increment | `POST /api/games/sliding-puzzle/launch` | HTTP 200, launchCount incremented from 142 to 143 | **PASS** |
| **TC-05** | Contact Form Submission | `POST /api/contact` with valid student payload | HTTP 200, message stored with ID `msg-*` in SQLite | **PASS** |
| **TC-06** | Brute Force / Invalid Admin Login | `POST /api/admin/login` with bad password | HTTP 401 Unauthorized, failed attempt recorded | **PASS** |
| **TC-07** | Rate Limiting Check | 5 consecutive failed logins from same IP | HTTP 429 Too Many Requests, IP locked for 5 minutes | **PASS** |
| **TC-08** | Authorized Admin Login | `POST /api/admin/login` with `adminPassword123!` | HTTP 200, `playnest_admin_token` issued via `httpOnly` cookie | **PASS** |
| **TC-09** | Admin Create Game | `POST /api/admin/games` with "Turbo Reflex Arena" | HTTP 200, new game persisted into SQLite database | **PASS** |
| **TC-10** | Public Verification of New Game | `GET /games/turbo-reflex-arena` | HTTP 200, immediately playable from database record | **PASS** |
| **TC-11** | Admin Edit Game | `PUT /api/admin/games` updating title | HTTP 200, title updated in SQLite | **PASS** |
| **TC-12** | Admin Delete Game | `DELETE /api/admin/games?slug=turbo-reflex-arena` | HTTP 200, record purged from SQLite database | **PASS** |
| **TC-13** | Malicious Embed Rejection | `POST /api/admin/games` with untrusted origin URL | HTTP 400 Bad Request: "Embed URL rejected. For security, only verified HTTPS URLs from authorized origins are permitted." | **PASS** |
| **TC-14** | Admin View Contact Submissions | `GET /api/contact` with valid admin cookie | HTTP 200, contact messages returned successfully | **PASS** |

---

## 2. Gameplay & Mechanics Testing

1. **Sliding Puzzle:**
   - **Solvability Check:** Implemented inversion count parity validation; impossible odd-inversion permutations are mathematically prevented.
   - **Inputs:** Numbered tile click/tap, WASD, and Arrow keys.
   - **Win State:** Verifies numerical sequence `1..8` with `0` in bottom right; records moves and elapsed seconds.
2. **Target Tap:**
   - **Mechanics:** Dynamic timer tick (30s countdown), random target placement, golden 2x bonus targets, combo streak tracking.
   - **Pause/Resume:** Successfully stops timer and target spawning.
3. **Lane Racer:**
   - **Animation:** `requestAnimationFrame` delta-time loop avoiding frame-rate dependency.
   - **Collision:** AABB bounding box collision in player lane.
   - **Controls:** Arrow keys, A/D keys, and on-screen touch arrow buttons for mobile.
4. **Snake Classic:**
   - **Grid Logic:** 16x16 grid with tail array, prevents 180-degree immediate self-reversal, eats apples, and handles game-over wall collisions.
5. **Treasure Maze:**
   - **Reachability:** Verified 9x9 layout guarantees direct unblocked path to 3 gem coordinates and exit chest.
6. **Memory Match:**
   - **State Handling:** Reshuffled 12-card array, flipping animation, card lock during mismatch comparison, and win condition check upon 6 pairs.

---

## 3. Responsive Layout & Screenshot Verification

Headless Chrome browser capture was run across standard breakpoints:
- **Desktop (1440x900):** Tested spacious grid, hero spotlight, and sidebar advertising slot. Saved to `screenshots/desktop-home.png` and `screenshots/desktop-games.png`.
- **Mobile (390x844):** Tested collapsible navigation bar, stacked sections, and 2-column game cards without horizontal overflow. Saved to `screenshots/mobile-home.png`.
- **Play Area:** Verified full aspect ratio container and fullscreen toggle fallback. Saved to `screenshots/desktop-lane-racer.png`.

---

## 4. Known Limitations & Production Notes

1. **SQLite Storage on Ephemeral Clouds:**  
   In serverless hosting environments (e.g. AWS Lambda, Vercel Serverless), local filesystems are reset upon container spin-down. For cloud deployments, a persistent volume mount (such as on Fly.io, Railway, or VPS) or an external SQLite database driver (e.g. Turso) should be used.
2. **Third-Party Embed Framing:**  
   Certain external gaming platforms send `X-Frame-Options: SAMEORIGIN` or restrictive CSP headers which block browser iframe embedding. The admin suite clearly informs administrators of this limitation.
3. **Local Score Isolation:**  
   High scores are saved to browser `localStorage` as requested. They represent the current device's personal best and are not synchronized across devices without a user account service.
