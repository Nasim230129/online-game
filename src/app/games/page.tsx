import { Metadata } from "next";
import { getPublishedGames, getAllCategories } from "@/lib/db";
import { GamesCatalogue } from "@/components/GamesCatalogue";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Browse Games",
  description: "Browse the full collection of free HTML5 browser games on PlayNest. Filter by puzzle, action, racing, arcade, adventure and brain training.",
};

export const revalidate = 0;

export default function GamesPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const games = getPublishedGames();
  const categories = getAllCategories();

  const category = typeof searchParams?.category === "string" ? searchParams.category : "all";
  const search = typeof searchParams?.search === "string" ? searchParams.search : "";
  const sort = typeof searchParams?.sort === "string" ? searchParams.sort : "newest";

  return (
    <Suspense fallback={<div className="p-8 text-center text-gray-400">Loading game catalogue...</div>}>
      <GamesCatalogue
        initialGames={games}
        categories={categories}
        initialCategory={category}
        initialSearch={search}
        initialSort={sort}
      />
    </Suspense>
  );
}
