'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function AdminLayoutTabs({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  const navItems = [
    { 
      href: '/admin/chip-brands', 
      label: 'Chip Brands', 
      shortLabel: 'Brands',
      icon: '🔷'
    },
    { 
      href: '/admin/board-manufacturers', 
      label: 'Manufacturers', 
      shortLabel: 'Mfrs',
      icon: '🏭'
    },
    { 
      href: '/admin/manufacturer-series', 
      label: 'Series', 
      shortLabel: 'Series',
      icon: '📋'
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Tabs */}
      <div className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Title Section */}
          <div className="flex items-center justify-between border-b border-gray-100 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 text-white font-bold text-lg shadow-sm">
                A
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
                <p className="text-xs text-gray-500">Component Type Management</p>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <nav className="flex -mb-px overflow-x-auto">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group flex items-center gap-2 whitespace-nowrap border-b-2 px-6 py-4 text-sm font-medium transition-all ${
                    isActive
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-600 hover:border-gray-300 hover:text-gray-900'
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span className="hidden sm:inline">{item.label}</span>
                  <span className="sm:hidden">{item.shortLabel}</span>
                  {isActive && (
                    <span className="ml-2 hidden lg:inline rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">
                      Active
                    </span>
                  )}
                </Link>
              )
            })}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main>
        {children}
      </main>
    </div>
  )
}
