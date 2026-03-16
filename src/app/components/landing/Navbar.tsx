"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { useUser } from "@/app/contexts/UserContext";
import { createClient } from "@/utils/supabase/client";
import { usePathname } from "next/navigation";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileAdminMenuOpen, setMobileAdminMenuOpen] = useState(false);

  const pathname = usePathname();
  const { user, loading } = useUser();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
  };

  const navSections = [
    {
      title: "Manage Data",
      items: [
        {
          href: "/admin/chip-brands",
          label: "Chip Brands",
          icon: "🔷",
          description: "Add/edit brands",
        },
        {
          href: "/admin/board-manufacturers",
          label: "Manufacturers",
          icon: "🏭",
          description: "Add/edit manufacturers",
        },
        {
          href: "/admin/manufacturer-series",
          label: "Series",
          icon: "📋",
          description: "Add/edit series",
        },
      ],
    },
    {
      title: "Configure Types",
      items: [
        {
          href: "/admin/chip-brands/config",
          label: "Brand Types",
          icon: "⚙️",
          description: "Configure component types",
        },
        {
          href: "/admin/board-manufacturers/config",
          label: "Manufacturer Types",
          icon: "⚙️",
          description: "Configure component types",
        },
        {
          href: "/admin/manufacturer-series/config",
          label: "Series Types",
          icon: "⚙️",
          description: "Configure component types",
        },
      ],
    },
  ];

  return (
    <header className="sticky top-0 left-0 right-0 z-50 backdrop-blur-xl bg-black/80 border-b border-white/5">
      <nav className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent"
            style={{ fontFamily: "Syne, sans-serif" }}
          >
            BenchmarkHub
          </Link>

          {/* Desktop Navigation */}
          <ul className="hidden md:flex items-center gap-8">
            <li>
              <Link
                href="/#features"
                className="text-slate-400 hover:text-cyan-400 font-semibold transition-colors"
              >
                Features
              </Link>
            </li>
            <li>
              <Link
                href="/#how-it-works"
                className="text-slate-400 hover:text-cyan-400 font-semibold transition-colors"
              >
                How It Works
              </Link>
            </li>
            <li>
              <Link
                href="/#pricing"
                className="text-slate-400 hover:text-cyan-400 font-semibold transition-colors"
              >
                Pricing
              </Link>
            </li>
            <li>
              <Link
                href="/docs"
                className="text-slate-400 hover:text-cyan-400 font-semibold transition-colors"
              >
                Docs
              </Link>
            </li>
          </ul>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <div className="flex space-x-6">
                <Link
                  href="/dashboard"
                  className="text-slate-400 hover:text-white font-semibold transition-colors"
                >
                  Dashboard
                </Link>
                <Link
                  href="/"
                  className="text-slate-400 hover:text-white font-semibold transition-colors"
                  onClick={() => handleLogout()}
                >
                  Logout
                </Link>
              </div>
            ) : (
              <Link
                href="/login"
                className="text-slate-400 hover:text-white font-semibold transition-colors"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-white p-2 cursor-pointer hover:bg-gray-500 rounded-xl"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-4">
            <Link
              href="/#features"
              className="block text-slate-400 hover:text-cyan-400 font-semibold"
              onClick={() => setMobileMenuOpen(false)}
            >
              Features
            </Link>
            <Link
              href="/#how-it-works"
              className="block text-slate-400 hover:text-cyan-400 font-semibold"
              onClick={() => setMobileMenuOpen(false)}
            >
              How It Works
            </Link>
            <Link
              href="/#pricing"
              className="block text-slate-400 hover:text-cyan-400 font-semibold"
              onClick={() => setMobileMenuOpen(false)}
            >
              Pricing
            </Link>
            <Link
              href="/docs"
              className="block text-slate-400 hover:text-cyan-400 font-semibold"
              onClick={() => setMobileMenuOpen(false)}
            >
              Docs
            </Link>
            <div className="pt-4 space-y-3">
              {user ? (
                <Link
                  href="/"
                  className="block text-center text-slate-400 hover:text-white font-semibold"
                  onClick={() => handleLogout()}
                >
                  Logout
                </Link>
              ) : (
                <Link
                  href="/login"
                  className="block text-center text-slate-400 hover:text-white font-semibold"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>

      {user && pathname.includes("admin") ? (
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo/Title */}
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-700 text-black font-bold text-lg">
                A
              </div>
              <div>
                <h1 className="text-lg font-bold text-slate-400">
                  Admin Panel
                </h1>
                <p className="hidden text-xs text-slate-400 sm:block">
                  Component Management
                </p>
              </div>
            </div>
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-3">
              {navSections.map((section) => (
                <div key={section.title} className="flex items-center">
                  <div className="flex gap-3">
                    {section.items.map((item) => {
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={`block text-center text-slate-400 hover:text-white font-semibold`}
                          title={item.description}
                        >
                          <span>{item.icon}</span>
                          <span className="hidden lg:inline">{item.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </nav>

            {/* Mobile Menu Button */}
            {/* <button
              onClick={() => setMobileAdminMenuOpen(!mobileAdminMenuOpen)}
              className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 md:hidden"
              aria-label="Toggle menu"
            >
              {mobileAdminMenuOpen ? (
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button> */}
            <button
              onClick={() => setMobileAdminMenuOpen(!mobileAdminMenuOpen)}
              className="md:hidden text-white p-2 cursor-pointer hover:bg-gray-500 rounded-xl"
            >
              {mobileAdminMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Navigation Dropdown */}
          {mobileAdminMenuOpen && (
            <div className="border-t border-gray-200 py-2 md:hidden">
              {navSections.map((section) => (
                <div key={section.title} className="mb-3">
                  <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase">
                    {section.title}
                  </div>
                  <nav className="space-y-1">
                    {section.items.map((item) => {
                      const isActive = pathname === item.href;
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setMobileAdminMenuOpen(false)}
                          className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                            isActive
                              ? "bg-blue-50 text-blue-700"
                              : "text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          <span className="text-lg">{item.icon}</span>
                          <div className="flex-1 text-slate-400 hover:text-black font-semibold transition-colors">
                            <div>{item.label}</div>
                            <div className="text-xs text-slate-400 font-semibold transition-colors">
                              {item.description}
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </nav>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : null}
    </header>
  );
}
