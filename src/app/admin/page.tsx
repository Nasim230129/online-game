import { Metadata } from "next";
import { getAdminSession } from "@/lib/auth";
import { getAllGamesAdmin, getAllCategories, getContactMessages } from "@/lib/db";
import { AdminLoginForm } from "@/components/AdminLoginForm";
import { AdminDashboardClient } from "@/components/AdminDashboardClient";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "PlayNest administrative management suite for games, categories, and submissions.",
  robots: {
    index: false,
    follow: false,
  },
};

export const revalidate = 0;

export default async function AdminPage() {
  const session = await getAdminSession();

  if (!session) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
        <AdminLoginForm />
      </div>
    );
  }

  const games = getAllGamesAdmin();
  const categories = getAllCategories();
  const messages = getContactMessages();

  return (
    <AdminDashboardClient
      initialGames={games}
      initialCategories={categories}
      initialMessages={messages}
    />
  );
}
