import React from "react";

interface GameThumbnailProps {
  type: string;
  className?: string;
  title?: string;
}

export function GameThumbnail({ type, className = "w-full h-full", title }: GameThumbnailProps) {
  switch (type) {
    case "puzzle-thumb":
    case "sliding-puzzle":
      return (
        <svg viewBox="0 0 400 250" className={className} xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="puzGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#312E81" />
              <stop offset="100%" stopColor="#1E1B4B" />
            </linearGradient>
            <linearGradient id="tileGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8B5CF6" />
              <stop offset="100%" stopColor="#6D28D9" />
            </linearGradient>
            <linearGradient id="tileGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#06B6D4" />
              <stop offset="100%" stopColor="#0891B2" />
            </linearGradient>
          </defs>
          <rect width="400" height="250" fill="url(#puzGrad)" />
          {/* Subtle grid pattern background */}
          <g opacity="0.15" stroke="#FFFFFF" strokeWidth="1">
            <line x1="0" y1="50" x2="400" y2="50" />
            <line x1="0" y1="100" x2="400" y2="100" />
            <line x1="0" y1="150" x2="400" y2="150" />
            <line x1="0" y1="200" x2="400" y2="200" />
            <line x1="80" y1="0" x2="80" y2="250" />
            <line x1="160" y1="0" x2="160" y2="250" />
            <line x1="240" y1="0" x2="240" y2="250" />
            <line x1="320" y1="0" x2="320" y2="250" />
          </g>
          {/* 3x3 Puzzle Tiles */}
          <rect x="110" y="35" width="55" height="55" rx="8" fill="url(#tileGrad)" filter="drop-shadow(0 4px 6px rgba(0,0,0,0.4))" />
          <text x="137" y="70" fill="#FFFFFF" fontSize="22" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">1</text>

          <rect x="175" y="35" width="55" height="55" rx="8" fill="url(#tileGrad)" filter="drop-shadow(0 4px 6px rgba(0,0,0,0.4))" />
          <text x="202" y="70" fill="#FFFFFF" fontSize="22" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">2</text>

          <rect x="240" y="35" width="55" height="55" rx="8" fill="url(#tileGrad)" filter="drop-shadow(0 4px 6px rgba(0,0,0,0.4))" />
          <text x="267" y="70" fill="#FFFFFF" fontSize="22" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">3</text>

          <rect x="110" y="100" width="55" height="55" rx="8" fill="url(#tileGrad)" />
          <text x="137" y="135" fill="#FFFFFF" fontSize="22" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">4</text>

          <rect x="175" y="100" width="55" height="55" rx="8" fill="url(#tileGrad2)" />
          <text x="202" y="135" fill="#FFFFFF" fontSize="22" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">5</text>

          {/* Empty slot with dashed neon border */}
          <rect x="240" y="100" width="55" height="55" rx="8" fill="#0F172A" stroke="#06B6D4" strokeWidth="2" strokeDasharray="4 4" />

          <rect x="110" y="165" width="55" height="55" rx="8" fill="url(#tileGrad)" />
          <text x="137" y="200" fill="#FFFFFF" fontSize="22" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">6</text>

          <rect x="175" y="165" width="55" height="55" rx="8" fill="url(#tileGrad)" />
          <text x="202" y="200" fill="#FFFFFF" fontSize="22" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">7</text>

          <rect x="240" y="165" width="55" height="55" rx="8" fill="url(#tileGrad)" />
          <text x="267" y="200" fill="#FFFFFF" fontSize="22" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">8</text>
        </svg>
      );

    case "target-thumb":
    case "target-tap":
      return (
        <svg viewBox="0 0 400 250" className={className} xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="targetBg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1E1B4B" />
              <stop offset="100%" stopColor="#090D16" />
            </linearGradient>
            <radialGradient id="crosshairGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#F43F5E" stopOpacity="0.8" />
              <stop offset="60%" stopColor="#BE123C" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#881337" stopOpacity="0" />
            </radialGradient>
          </defs>
          <rect width="400" height="250" fill="url(#targetBg)" />
          {/* Radar rings */}
          <circle cx="200" cy="125" r="90" fill="none" stroke="#334155" strokeWidth="1.5" strokeDasharray="6 6" />
          <circle cx="200" cy="125" r="60" fill="none" stroke="#475569" strokeWidth="1.5" />
          <circle cx="200" cy="125" r="30" fill="none" stroke="#F43F5E" strokeWidth="2" />
          <circle cx="200" cy="125" r="10" fill="#F43F5E" />
          <circle cx="200" cy="125" r="45" fill="url(#crosshairGlow)" />
          {/* Crosshair lines */}
          <line x1="70" y1="125" x2="330" y2="125" stroke="#F43F5E" strokeWidth="1.5" opacity="0.7" />
          <line x1="200" y1="20" x2="200" y2="230" stroke="#F43F5E" strokeWidth="1.5" opacity="0.7" />
          {/* Target satellites */}
          <circle cx="90" cy="70" r="14" fill="#06B6D4" opacity="0.8" />
          <circle cx="90" cy="70" r="7" fill="#FFFFFF" />
          <circle cx="310" cy="170" r="16" fill="#FBBF24" opacity="0.9" />
          <circle cx="310" cy="170" r="8" fill="#FFFFFF" />
        </svg>
      );

    case "racing-thumb":
    case "lane-racer":
      return (
        <svg viewBox="0 0 400 250" className={className} xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="raceBg" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#0B132B" />
              <stop offset="50%" stopColor="#1C2541" />
              <stop offset="100%" stopColor="#0A0E17" />
            </linearGradient>
            <linearGradient id="playerCarGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#06B6D4" />
              <stop offset="100%" stopColor="#3B82F6" />
            </linearGradient>
            <linearGradient id="rivalCarGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#EF4444" />
              <stop offset="100%" stopColor="#991B1B" />
            </linearGradient>
          </defs>
          <rect width="400" height="250" fill="url(#raceBg)" />
          {/* Road highway */}
          <polygon points="150,0 250,0 350,250 50,250" fill="#131B2E" stroke="#253352" strokeWidth="2" />
          {/* Road dash lanes */}
          <line x1="183" y1="0" x2="150" y2="250" stroke="#FBBF24" strokeWidth="3" strokeDasharray="16 14" />
          <line x1="217" y1="0" x2="250" y2="250" stroke="#FBBF24" strokeWidth="3" strokeDasharray="16 14" />
          {/* Player Car in middle lane */}
          <g transform="translate(180, 160)">
            <rect x="0" y="0" width="40" height="65" rx="8" fill="url(#playerCarGrad)" filter="drop-shadow(0 0 8px #06B6D4)" />
            <rect x="6" y="15" width="28" height="18" rx="3" fill="#0F172A" />
            <circle cx="8" cy="6" r="3" fill="#67E8F9" />
            <circle cx="32" cy="6" r="3" fill="#67E8F9" />
            <rect x="6" y="58" width="8" height="3" fill="#EF4444" />
            <rect x="26" y="58" width="8" height="3" fill="#EF4444" />
          </g>
          {/* Rival Car in right lane */}
          <g transform="translate(240, 50) scale(0.65)">
            <rect x="0" y="0" width="40" height="65" rx="8" fill="url(#rivalCarGrad)" />
            <rect x="6" y="15" width="28" height="18" rx="3" fill="#0F172A" />
            <circle cx="8" cy="58" r="3" fill="#EF4444" />
            <circle cx="32" cy="58" r="3" fill="#EF4444" />
          </g>
        </svg>
      );

    case "snake-thumb":
    case "snake":
      return (
        <svg viewBox="0 0 400 250" className={className} xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="snakeBg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#064E3B" />
              <stop offset="100%" stopColor="#022C22" />
            </linearGradient>
            <linearGradient id="snakeBodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10B981" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>
          </defs>
          <rect width="400" height="250" fill="url(#snakeBg)" />
          {/* Retro subtle grid */}
          <g opacity="0.1" stroke="#34D399" strokeWidth="1">
            {Array.from({ length: 16 }).map((_, i) => (
              <line key={`v-${i}`} x1={i * 25} y1="0" x2={i * 25} y2="250" />
            ))}
            {Array.from({ length: 10 }).map((_, i) => (
              <line key={`h-${i}`} x1="0" y1={i * 25} x2="400" y2={i * 25} />
            ))}
          </g>
          {/* Apple */}
          <circle cx="275" cy="87.5" r="14" fill="#EF4444" filter="drop-shadow(0 0 6px #EF4444)" />
          <path d="M 275 73 Q 278 68 283 67" stroke="#10B981" strokeWidth="3" fill="none" />
          {/* Snake segments */}
          <rect x="75" y="162.5" width="23" height="23" rx="5" fill="url(#snakeBodyGrad)" opacity="0.7" />
          <rect x="100" y="162.5" width="23" height="23" rx="5" fill="url(#snakeBodyGrad)" opacity="0.8" />
          <rect x="125" y="162.5" width="23" height="23" rx="5" fill="url(#snakeBodyGrad)" opacity="0.9" />
          <rect x="150" y="162.5" width="23" height="23" rx="5" fill="url(#snakeBodyGrad)" />
          <rect x="175" y="162.5" width="23" height="23" rx="5" fill="url(#snakeBodyGrad)" />
          <rect x="175" y="137.5" width="23" height="23" rx="5" fill="url(#snakeBodyGrad)" />
          <rect x="175" y="112.5" width="23" height="23" rx="5" fill="url(#snakeBodyGrad)" />
          <rect x="175" y="87.5" width="23" height="23" rx="5" fill="url(#snakeBodyGrad)" />
          <rect x="200" y="87.5" width="23" height="23" rx="5" fill="url(#snakeBodyGrad)" />
          {/* Head */}
          <rect x="225" y="87.5" width="23" height="23" rx="6" fill="#34D399" filter="drop-shadow(0 0 8px #10B981)" />
          <circle cx="237" cy="93" r="3" fill="#022C22" />
          <circle cx="237" cy="105" r="3" fill="#022C22" />
        </svg>
      );

    case "maze-thumb":
    case "treasure-maze":
      return (
        <svg viewBox="0 0 400 250" className={className} xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="mazeBg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1E1E2F" />
              <stop offset="100%" stopColor="#0E0E18" />
            </linearGradient>
          </defs>
          <rect width="400" height="250" fill="url(#mazeBg)" />
          {/* Maze stone walls */}
          <g stroke="#6366F1" strokeWidth="8" strokeLinecap="round" opacity="0.85">
            <line x1="50" y1="40" x2="350" y2="40" />
            <line x1="50" y1="40" x2="50" y2="210" />
            <line x1="50" y1="210" x2="350" y2="210" />
            <line x1="350" y1="40" x2="350" y2="160" />
            {/* Interior maze pathways */}
            <line x1="110" y1="40" x2="110" y2="150" />
            <line x1="110" y1="150" x2="200" y2="150" />
            <line x1="170" y1="90" x2="280" y2="90" />
            <line x1="280" y1="90" x2="280" y2="160" />
            <line x1="220" y1="150" x2="220" y2="210" />
          </g>
          {/* Adventurer token */}
          <circle cx="80" cy="90" r="14" fill="#06B6D4" filter="drop-shadow(0 0 8px #06B6D4)" />
          <circle cx="80" cy="90" r="6" fill="#FFFFFF" />
          {/* Gem */}
          <polygon points="140,110 148,122 140,134 132,122" fill="#EC4899" filter="drop-shadow(0 0 6px #EC4899)" />
          {/* Golden Treasure Chest at Exit */}
          <g transform="translate(325, 175)">
            <rect x="0" y="0" width="30" height="22" rx="4" fill="#F59E0B" filter="drop-shadow(0 0 10px #F59E0B)" />
            <rect x="3" y="3" width="24" height="6" fill="#D97706" />
            <circle cx="15" cy="12" r="3" fill="#78350F" />
          </g>
        </svg>
      );

    case "memory-thumb":
    case "memory-match":
      return (
        <svg viewBox="0 0 400 250" className={className} xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="memBg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2E1065" />
              <stop offset="100%" stopColor="#0F172A" />
            </linearGradient>
            <linearGradient id="memCardFront" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8B5CF6" />
              <stop offset="100%" stopColor="#4C1D95" />
            </linearGradient>
          </defs>
          <rect width="400" height="250" fill="url(#memBg)" />
          {/* Cards grid */}
          <g transform="translate(60, 40)">
            {/* Card 1 - Face down */}
            <rect x="0" y="0" width="60" height="75" rx="8" fill="#1E293B" stroke="#6D28D9" strokeWidth="2" />
            <text x="30" y="45" fill="#8B5CF6" fontSize="24" textAnchor="middle">✦</text>

            {/* Card 2 - Face Up (Diamond Match) */}
            <rect x="75" y="0" width="60" height="75" rx="8" fill="url(#memCardFront)" stroke="#A78BFA" strokeWidth="2" />
            <text x="105" y="47" fill="#FBBF24" fontSize="26" textAnchor="middle">★</text>

            {/* Card 3 - Face down */}
            <rect x="150" y="0" width="60" height="75" rx="8" fill="#1E293B" stroke="#6D28D9" strokeWidth="2" />
            <text x="180" y="45" fill="#8B5CF6" fontSize="24" textAnchor="middle">✦</text>

            {/* Card 4 - Face Up (Diamond Match) */}
            <rect x="225" y="0" width="60" height="75" rx="8" fill="url(#memCardFront)" stroke="#A78BFA" strokeWidth="2" />
            <text x="255" y="47" fill="#FBBF24" fontSize="26" textAnchor="middle">★</text>

            {/* Row 2 */}
            <rect x="0" y="90" width="60" height="75" rx="8" fill="#1E293B" stroke="#6D28D9" strokeWidth="2" />
            <text x="30" y="135" fill="#8B5CF6" fontSize="24" textAnchor="middle">✦</text>

            <rect x="75" y="90" width="60" height="75" rx="8" fill="#1E293B" stroke="#6D28D9" strokeWidth="2" />
            <text x="105" y="135" fill="#8B5CF6" fontSize="24" textAnchor="middle">✦</text>

            <rect x="150" y="90" width="60" height="75" rx="8" fill="#1E293B" stroke="#6D28D9" strokeWidth="2" />
            <text x="180" y="135" fill="#8B5CF6" fontSize="24" textAnchor="middle">✦</text>

            <rect x="225" y="90" width="60" height="75" rx="8" fill="#1E293B" stroke="#6D28D9" strokeWidth="2" />
            <text x="255" y="135" fill="#8B5CF6" fontSize="24" textAnchor="middle">✦</text>
          </g>
        </svg>
      );

    default:
      return (
        <svg viewBox="0 0 400 250" className={className} xmlns="http://www.w3.org/2000/svg">
          <rect width="400" height="250" fill="#1E293B" />
          <circle cx="200" cy="115" r="40" fill="#334155" />
          <text x="200" y="125" fill="#94A3B8" fontSize="28" textAnchor="middle" fontFamily="sans-serif">🎮</text>
          <text x="200" y="185" fill="#E2E8F0" fontSize="16" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
            {title || "PlayNest Game"}
          </text>
        </svg>
      );
  }
}
