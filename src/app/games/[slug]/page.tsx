import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getGameBySlug, getPublishedGames } from "@/lib/db";
import { GameDetailClient } from "@/components/GameDetailClient";

export const revalidate = 0;

interface GamePageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: GamePageProps): Promise<Metadata> {
  const game = getGameBySlug(params.slug);
  if (!game) {
    return {
      title: "Game Not Found",
    };
  }

  return {
    title: `${game.title} - Free Online Browser Game`,
    description: game.shortDescription,
    openGraph: {
      title: `${game.title} | PlayNest`,
      description: game.shortDescription,
    },
  };
}

export default function GamePage({ params }: GamePageProps) {
  const game = getGameBySlug(params.slug);

  if (!game) {
    notFound();
  }

  // Related games in same category or fallback to other games
  const allGames = getPublishedGames();
  const relatedGames = allGames.filter(
    (g) => g.slug !== game.slug && (g.categorySlug === game.categorySlug || true)
  );

  return <GameDetailClient game={game} relatedGames={relatedGames} />;
}
