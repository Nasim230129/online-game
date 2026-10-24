import Database from "better-sqlite3";
import path from "path";
import fs from "fs";
import { Game, Category, ContactMessage } from "@/types";

const DB_DIR = path.join(process.cwd(), "data");
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

const DB_PATH = path.join(DB_DIR, "playnest.db");

// Singleton SQLite connection
let dbInstance: Database.Database | null = null;

export function getDb(): Database.Database {
  if (!dbInstance) {
    dbInstance = new Database(DB_PATH);
    dbInstance.pragma("journal_mode = WAL");
    dbInstance.pragma("foreign_keys = ON");
    initSchema(dbInstance);
  }
  return dbInstance;
}

function initSchema(db: Database.Database) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      description TEXT NOT NULL,
      iconName TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS games (
      id TEXT PRIMARY KEY,
      slug TEXT UNIQUE NOT NULL,
      title TEXT NOT NULL,
      shortDescription TEXT NOT NULL,
      instructions TEXT NOT NULL,
      categorySlug TEXT NOT NULL,
      thumbnailSvg TEXT NOT NULL,
      gameType TEXT NOT NULL,
      builtinId TEXT,
      embedUrl TEXT,
      isFeatured INTEGER NOT NULL DEFAULT 0,
      isPublished INTEGER NOT NULL DEFAULT 1,
      createdAt TEXT NOT NULL,
      launchCount INTEGER NOT NULL DEFAULT 0,
      FOREIGN KEY (categorySlug) REFERENCES categories(slug) ON UPDATE CASCADE ON DELETE RESTRICT
    );

    CREATE TABLE IF NOT EXISTS contact_messages (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      subject TEXT NOT NULL,
      message TEXT NOT NULL,
      createdAt TEXT NOT NULL,
      isRead INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS login_attempts (
      ip TEXT PRIMARY KEY,
      attempts INTEGER NOT NULL DEFAULT 1,
      lastAttempt TEXT NOT NULL,
      lockedUntil TEXT
    );
  `);

  // Seed default categories if empty
  const countCategories = db.prepare("SELECT COUNT(*) as count FROM categories").get() as { count: number };
  if (countCategories.count === 0) {
    const insertCat = db.prepare(`
      INSERT INTO categories (id, name, slug, description, iconName)
      VALUES (?, ?, ?, ?, ?)
    `);

    const defaultCategories: Category[] = [
      { id: "cat-puzzle", name: "Puzzle", slug: "puzzle", description: "Brain-bending logic puzzles and spatial challenges.", iconName: "Puzzle" },
      { id: "cat-action", name: "Action", slug: "action", description: "Fast-paced reflexes, target practice, and intense gameplay.", iconName: "Crosshair" },
      { id: "cat-racing", name: "Racing", slug: "racing", description: "High-speed lane dodging, traffic evasion, and thrill rides.", iconName: "Car" },
      { id: "cat-arcade", name: "Arcade", slug: "arcade", description: "Retro arcade classics, time attacks, and high-score chases.", iconName: "Gamepad2" },
      { id: "cat-adventure", name: "Adventure", slug: "adventure", description: "Explore mysterious mazes, collect treasures, and discover secrets.", iconName: "Compass" },
      { id: "cat-braintraining", name: "Brain Training", slug: "brain-training", description: "Improve your memory, attention, and cognitive agility.", iconName: "Brain" },
    ];

    const seedTransaction = db.transaction(() => {
      for (const cat of defaultCategories) {
        insertCat.run(cat.id, cat.name, cat.slug, cat.description, cat.iconName);
      }
    });
    seedTransaction();
  }

  // Seed default 6 playable games if empty
  const countGames = db.prepare("SELECT COUNT(*) as count FROM games").get() as { count: number };
  if (countGames.count === 0) {
    const insertGame = db.prepare(`
      INSERT INTO games (
        id, slug, title, shortDescription, instructions, categorySlug,
        thumbnailSvg, gameType, builtinId, embedUrl, isFeatured, isPublished, createdAt, launchCount
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const seedGames: Game[] = [
      {
        id: "game-sliding-puzzle",
        slug: "sliding-puzzle",
        title: "Sliding Puzzle",
        shortDescription: "Slide numbered tiles in numerical sequence into the empty slot. Solvable guaranteed!",
        instructions: "Click or tap any numbered tile adjacent to the empty slot (or use Arrow keys / WASD) to slide it into place. Order tiles from 1 to 8.",
        categorySlug: "puzzle",
        thumbnailSvg: "puzzle-thumb",
        gameType: "builtin",
        builtinId: "sliding-puzzle",
        embedUrl: null,
        isFeatured: false,
        isPublished: true,
        createdAt: "2026-10-20T10:00:00.000Z",
        launchCount: 142,
      },
      {
        id: "game-target-tap",
        slug: "target-tap",
        title: "Target Tap",
        shortDescription: "Test your quick-draw reflexes! Tap glowing pulse targets before they disappear.",
        instructions: "Targets appear randomly. Tap/click them quickly to score points. Golden targets award bonus points. Avoid letting targets expire!",
        categorySlug: "action",
        thumbnailSvg: "target-thumb",
        gameType: "builtin",
        builtinId: "target-tap",
        embedUrl: null,
        isFeatured: false,
        isPublished: true,
        createdAt: "2026-10-21T11:00:00.000Z",
        launchCount: 285,
      },
      {
        id: "game-lane-racer",
        slug: "lane-racer",
        title: "Lane Racer",
        shortDescription: "High-octane neon highway racer. Dodge traffic, collect speed boosts and set distance records.",
        instructions: "Use Left/Right arrow keys (or A/D keys, or on-screen touch buttons) to change lanes. Avoid colliding with slower vehicles!",
        categorySlug: "racing",
        thumbnailSvg: "racing-thumb",
        gameType: "builtin",
        builtinId: "lane-racer",
        embedUrl: null,
        isFeatured: true, // Featured game on homepage!
        isPublished: true,
        createdAt: "2026-10-22T08:30:00.000Z",
        launchCount: 450,
      },
      {
        id: "game-snake",
        slug: "snake",
        title: "Snake Classic",
        shortDescription: "The timeless arcade arcade game revived. Eat apples, grow longer, and don't bite your tail!",
        instructions: "Control the snake using Arrow keys, WASD, or on-screen directional touch controls. Collect glowing food without crashing into walls or yourself.",
        categorySlug: "arcade",
        thumbnailSvg: "snake-thumb",
        gameType: "builtin",
        builtinId: "snake",
        embedUrl: null,
        isFeatured: false,
        isPublished: true,
        createdAt: "2026-10-22T14:15:00.000Z",
        launchCount: 310,
      },
      {
        id: "game-treasure-maze",
        slug: "treasure-maze",
        title: "Treasure Maze",
        shortDescription: "Explore procedural dungeon labyrinths, gather glistening gems and reach the exit portal.",
        instructions: "Use Arrow keys, WASD, or directional touch pads to move your adventurer through the maze. Collect all 3 gems and reach the golden exit chest.",
        categorySlug: "adventure",
        thumbnailSvg: "maze-thumb",
        gameType: "builtin",
        builtinId: "treasure-maze",
        embedUrl: null,
        isFeatured: false,
        isPublished: true,
        createdAt: "2026-10-23T09:00:00.000Z",
        launchCount: 198,
      },
      {
        id: "game-memory-match",
        slug: "memory-match",
        title: "Memory Match",
        shortDescription: "Boost your visual recall. Flip cards to reveal twin pairs in as few moves as possible.",
        instructions: "Click or tap on cards to reveal their hidden glyphs. Match identical pairs. Remember card positions to clear the board in the fewest moves.",
        categorySlug: "brain-training",
        thumbnailSvg: "memory-thumb",
        gameType: "builtin",
        builtinId: "memory-match",
        embedUrl: null,
        isFeatured: false,
        isPublished: true,
        createdAt: "2026-10-24T07:45:00.000Z",
        launchCount: 220,
      },
    ];

    const seedGamesTx = db.transaction(() => {
      for (const g of seedGames) {
        insertGame.run(
          g.id,
          g.slug,
          g.title,
          g.shortDescription,
          g.instructions,
          g.categorySlug,
          g.thumbnailSvg,
          g.gameType,
          g.builtinId,
          g.embedUrl,
          g.isFeatured ? 1 : 0,
          g.isPublished ? 1 : 0,
          g.createdAt,
          g.launchCount
        );
      }
    });
    seedGamesTx();
  }
}

// Queries for public and admin operations
export function getAllCategories(): Category[] {
  const db = getDb();
  return db.prepare("SELECT * FROM categories ORDER BY name ASC").all() as Category[];
}

export function getCategoryBySlug(slug: string): Category | undefined {
  const db = getDb();
  return db.prepare("SELECT * FROM categories WHERE slug = ?").get(slug) as Category | undefined;
}

export function addCategory(category: Category): void {
  const db = getDb();
  db.prepare(`
    INSERT INTO categories (id, name, slug, description, iconName)
    VALUES (?, ?, ?, ?, ?)
  `).run(category.id, category.name, category.slug, category.description, category.iconName);
}

export function updateCategory(slug: string, name: string, description: string, iconName: string): void {
  const db = getDb();
  db.prepare(`
    UPDATE categories
    SET name = ?, description = ?, iconName = ?
    WHERE slug = ?
  `).run(name, description, iconName, slug);
}

export function deleteCategory(slug: string): void {
  const db = getDb();
  // Check if games exist in this category
  const count = db.prepare("SELECT COUNT(*) as count FROM games WHERE categorySlug = ?").get(slug) as { count: number };
  if (count.count > 0) {
    throw new Error(`Cannot delete category "${slug}" because it contains ${count.count} game(s). Reassign or delete them first.`);
  }
  db.prepare("DELETE FROM categories WHERE slug = ?").run(slug);
}

export function getPublishedGames(): Game[] {
  const db = getDb();
  const rows = db.prepare("SELECT * FROM games WHERE isPublished = 1 ORDER BY createdAt DESC").all() as any[];
  return rows.map(formatGameRow);
}

export function getAllGamesAdmin(): Game[] {
  const db = getDb();
  const rows = db.prepare("SELECT * FROM games ORDER BY createdAt DESC").all() as any[];
  return rows.map(formatGameRow);
}

export function getGameBySlug(slug: string, includeUnpublished = false): Game | undefined {
  const db = getDb();
  let query = "SELECT * FROM games WHERE slug = ?";
  if (!includeUnpublished) {
    query += " AND isPublished = 1";
  }
  const row = db.prepare(query).get(slug) as any;
  return row ? formatGameRow(row) : undefined;
}

export function getFeaturedGame(): Game | undefined {
  const db = getDb();
  const row = db.prepare("SELECT * FROM games WHERE isFeatured = 1 AND isPublished = 1 ORDER BY createdAt DESC LIMIT 1").get() as any;
  if (row) return formatGameRow(row);
  // fallback to most launched published game
  const fallback = db.prepare("SELECT * FROM games WHERE isPublished = 1 ORDER BY launchCount DESC LIMIT 1").get() as any;
  return fallback ? formatGameRow(fallback) : undefined;
}

export function incrementLaunchCount(slug: string): number {
  const db = getDb();
  db.prepare("UPDATE games SET launchCount = launchCount + 1 WHERE slug = ?").run(slug);
  const updated = db.prepare("SELECT launchCount FROM games WHERE slug = ?").get(slug) as { launchCount: number } | undefined;
  return updated ? updated.launchCount : 0;
}

export function createGame(game: Omit<Game, "id" | "createdAt" | "launchCount">): Game {
  const db = getDb();
  const id = "game-" + Date.now() + "-" + Math.random().toString(36).substring(2, 7);
  const createdAt = new Date().toISOString();
  const launchCount = 0;

  // If set to featured, unset any existing featured games
  if (game.isFeatured) {
    db.prepare("UPDATE games SET isFeatured = 0").run();
  }

  db.prepare(`
    INSERT INTO games (
      id, slug, title, shortDescription, instructions, categorySlug,
      thumbnailSvg, gameType, builtinId, embedUrl, isFeatured, isPublished, createdAt, launchCount
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    id,
    game.slug,
    game.title,
    game.shortDescription,
    game.instructions,
    game.categorySlug,
    game.thumbnailSvg,
    game.gameType,
    game.builtinId || null,
    game.embedUrl || null,
    game.isFeatured ? 1 : 0,
    game.isPublished ? 1 : 0,
    createdAt,
    launchCount
  );

  return { ...game, id, createdAt, launchCount };
}

export function updateGame(slug: string, updates: Partial<Omit<Game, "id" | "slug" | "createdAt" | "launchCount">> & { newSlug?: string }): void {
  const db = getDb();
  const existing = getGameBySlug(slug, true);
  if (!existing) throw new Error("Game not found");

  if (updates.isFeatured) {
    db.prepare("UPDATE games SET isFeatured = 0").run();
  }

  const finalSlug = updates.newSlug || slug;

  db.prepare(`
    UPDATE games SET
      slug = ?,
      title = COALESCE(?, title),
      shortDescription = COALESCE(?, shortDescription),
      instructions = COALESCE(?, instructions),
      categorySlug = COALESCE(?, categorySlug),
      thumbnailSvg = COALESCE(?, thumbnailSvg),
      gameType = COALESCE(?, gameType),
      builtinId = ?,
      embedUrl = ?,
      isFeatured = COALESCE(?, isFeatured),
      isPublished = COALESCE(?, isPublished)
    WHERE slug = ?
  `).run(
    finalSlug,
    updates.title !== undefined ? updates.title : null,
    updates.shortDescription !== undefined ? updates.shortDescription : null,
    updates.instructions !== undefined ? updates.instructions : null,
    updates.categorySlug !== undefined ? updates.categorySlug : null,
    updates.thumbnailSvg !== undefined ? updates.thumbnailSvg : null,
    updates.gameType !== undefined ? updates.gameType : null,
    updates.builtinId !== undefined ? (updates.builtinId || null) : existing.builtinId,
    updates.embedUrl !== undefined ? (updates.embedUrl || null) : existing.embedUrl,
    updates.isFeatured !== undefined ? (updates.isFeatured ? 1 : 0) : null,
    updates.isPublished !== undefined ? (updates.isPublished ? 1 : 0) : null,
    slug
  );
}

export function deleteGame(slug: string): void {
  const db = getDb();
  db.prepare("DELETE FROM games WHERE slug = ?").run(slug);
}

export function saveContactMessage(msg: { name: string; email: string; subject: string; message: string }): ContactMessage {
  const db = getDb();
  const id = "msg-" + Date.now() + "-" + Math.random().toString(36).substring(2, 7);
  const createdAt = new Date().toISOString();
  db.prepare(`
    INSERT INTO contact_messages (id, name, email, subject, message, createdAt, isRead)
    VALUES (?, ?, ?, ?, ?, ?, 0)
  `).run(id, msg.name, msg.email, msg.subject, msg.message, createdAt);
  return { ...msg, id, createdAt, isRead: false };
}

export function getContactMessages(): ContactMessage[] {
  const db = getDb();
  const rows = db.prepare("SELECT * FROM contact_messages ORDER BY createdAt DESC").all() as any[];
  return rows.map((r) => ({
    ...r,
    isRead: Boolean(r.isRead),
  }));
}

export function markContactMessageRead(id: string): void {
  const db = getDb();
  db.prepare("UPDATE contact_messages SET isRead = 1 WHERE id = ?").run(id);
}

function formatGameRow(row: any): Game {
  return {
    ...row,
    isFeatured: Boolean(row.isFeatured),
    isPublished: Boolean(row.isPublished),
  };
}
