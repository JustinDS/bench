"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminLayoutCompact({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const navItems = [
    {
      href: "/admin/chip-brands",
      label: "Chip Brands",
      icon: "🔷",
    },
    {
      href: "/admin/board-manufacturers",
      label: "Manufacturers",
      icon: "🏭",
    },
    {
      href: "/admin/manufacturer-series",
      label: "Series",
      icon: "📋",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Compact Top Bar */}
      <div className="sticky top-0 z-50 border-b border-gray-200 bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            {/* Title */}
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-sm font-bold text-white">
                A
              </div>
              <h1 className="text-lg font-bold text-gray-900">Admin Panel</h1>
            </div>

            {/* Pill Navigation */}
            <nav className="flex gap-2 overflow-x-auto pb-1 sm:pb-0">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all ${
                      isActive
                        ? "bg-blue-600 text-white shadow-md"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main>{children}</main>
    </div>
  );
}
