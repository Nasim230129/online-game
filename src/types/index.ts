export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  iconName: string;
}

export type GameType = "builtin" | "external";

export interface Game {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  instructions: string;
  categorySlug: string;
  thumbnailSvg: string; // identifier of the SVG icon/illustration
  gameType: GameType;
  builtinId?: string | null; // e.g. "sliding-puzzle", "target-tap", "lane-racer", "snake", "treasure-maze", "memory-match"
  embedUrl?: string | null;
  isFeatured: boolean;
  isPublished: boolean;
  createdAt: string;
  launchCount: number;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
  isRead: boolean;
}

export interface BuiltinGameOption {
  id: string;
  name: string;
  categorySlug: string;
  description: string;
}

export const BUILTIN_GAMES: BuiltinGameOption[] = [
  { id: "sliding-puzzle", name: "Sliding Puzzle", categorySlug: "puzzle", description: "Slide numbered tiles to arrange them sequentially (3x3 solvable board)." },
  { id: "target-tap", name: "Target Tap", categorySlug: "action", description: "Fast-paced reflex game. Tap glowing targets before they disappear!" },
  { id: "lane-racer", name: "Lane Racer", categorySlug: "racing", description: "Dodge rival traffic, switch lanes, and collect turbo boosts!" },
  { id: "snake", name: "Snake Classic", categorySlug: "arcade", description: "Classic grid snake game with apples, score multipliers and speed ramps." },
  { id: "treasure-maze", name: "Treasure Maze", categorySlug: "adventure", description: "Navigate procedural reachable labyrinths to collect gems and the golden chest." },
  { id: "memory-match", name: "Memory Match", categorySlug: "brain-training", description: "Test your focus by matching pairs of symbols in the fewest moves." },
];
