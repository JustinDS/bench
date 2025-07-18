"use client";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import { useUser } from "../contexts/UserContext";

export default function Header() {
  const { user, loading } = useUser();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
  };

  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
        <Link
          href="/"
          className="text-2xl font-bold text-gray-600 cursor-pointer"
        >
          Bench
        </Link>
        <nav className="space-x-6 text-sm font-medium text-gray-600">
          <Link href="#benchmarks" className="hover:underline">
            Benchmarks
          </Link>
          <Link href="#components" className="hover:underline">
            Components
          </Link>
          <Link href="#about" className="hover:underline">
            About
          </Link>
          {user ? (
            <Link
              href="/"
              className="hover:underline"
              onClick={() => handleLogout()}
            >
              Logout
            </Link>
          ) : (
            <Link href="/login" className="hover:underline">
              Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
