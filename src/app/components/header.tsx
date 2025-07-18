"use client";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import { useUser } from "../contexts/UserContext";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
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
        <nav className="hidden md:flex space-x-6 text-sm font-medium text-gray-600">
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
        {/* Right hamburger menu for mobile */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-gray-500 hover:text-black focus:outline-none"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
      {/* Mobile nav menu */}
      {isOpen && (
        <div className="md:hidden pb-4 mx-4 flex flex-col gap-2 items-end">
          <Link href="/about" className="hover:underline">
            About
          </Link>
          <Link href="/contact" className="hover:underline">
            Contact
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
        </div>
      )}
    </header>
  );
}
