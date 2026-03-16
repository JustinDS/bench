"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <main>{children}</main>
    </div>
  );
}
