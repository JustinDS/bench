'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navSections = [
    {
      title: 'Manage Data',
      items: [
        { 
          href: '/admin/chip-brands', 
          label: 'Chip Brands', 
          icon: '🔷',
          description: 'Add/edit brands'
        },
        { 
          href: '/admin/board-manufacturers', 
          label: 'Manufacturers', 
          icon: '🏭',
          description: 'Add/edit manufacturers'
        },
        { 
          href: '/admin/manufacturer-series', 
          label: 'Series', 
          icon: '📋',
          description: 'Add/edit series'
        },
      ]
    },
    {
      title: 'Configure Types',
      items: [
        { 
          href: '/admin/chip-brands/config', 
          label: 'Brand Types', 
          icon: '⚙️',
          description: 'Configure component types'
        },
        { 
          href: '/admin/board-manufacturers/config', 
          label: 'Manufacturer Types', 
          icon: '⚙️',
          description: 'Configure component types'
        },
        { 
          href: '/admin/manufacturer-series/config', 
          label: 'Series Types', 
          icon: '⚙️',
          description: 'Configure component types'
        },
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo/Title */}
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white font-bold text-lg">
                A
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">Admin Panel</h1>
                <p className="hidden text-xs text-gray-500 sm:block">Component Management</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              {navSections.map((section) => (
                <div key={section.title} className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-gray-400 uppercase">{section.title}</span>
                  <div className="flex gap-1">
                    {section.items.map((item) => {
                      const isActive = pathname === item.href
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                            isActive
                              ? 'bg-blue-50 text-blue-700'
                              : 'text-gray-700 hover:bg-gray-50'
                          }`}
                          title={item.description}
                        >
                          <span>{item.icon}</span>
                          <span className="hidden lg:inline">{item.label}</span>
                        </Link>
                      )
                    })}
                  </div>
                </div>
              ))}
            </nav>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 md:hidden"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>

          {/* Mobile Navigation Dropdown */}
          {mobileMenuOpen && (
            <div className="border-t border-gray-200 py-2 md:hidden">
              {navSections.map((section) => (
                <div key={section.title} className="mb-3">
                  <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase">
                    {section.title}
                  </div>
                  <nav className="space-y-1">
                    {section.items.map((item) => {
                      const isActive = pathname === item.href
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                            isActive
                              ? 'bg-blue-50 text-blue-700'
                              : 'text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          <span className="text-lg">{item.icon}</span>
                          <div className="flex-1">
                            <div>{item.label}</div>
                            <div className="text-xs text-gray-500">{item.description}</div>
                          </div>
                        </Link>
                      )
                    })}
                  </nav>
                </div>
              ))}
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main>
        {children}
      </main>
    </div>
  )
}
