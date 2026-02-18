'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function ComponentNav() {
  const pathname = usePathname()

  const links = [
    { href: '/gpus', label: 'GPUs', icon: '🎮' },
    { href: '/cpus', label: 'CPUs', icon: '⚙️' },
    { href: '/ram', label: 'RAM', icon: '💾' },
  ]

  return (
    <>
      <style jsx>{`
        .nav-container {
          position: fixed;
          top: 2rem;
          left: 50%;
          transform: translateX(-50%);
          z-index: 40;
          display: flex;
          gap: 1rem;
          padding: 1rem;
          background: rgba(0, 0, 0, 0.8);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
        }

        .nav-link {
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          font-size: 0.9375rem;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: rgba(255, 255, 255, 0.6);
          border: 1px solid transparent;
        }

        .nav-link:hover {
          color: rgba(255, 255, 255, 0.9);
          background: rgba(255, 255, 255, 0.05);
        }

        .nav-link.active {
          color: #fff;
          background: rgba(255, 255, 255, 0.1);
          border-color: rgba(255, 255, 255, 0.2);
        }

        .nav-icon {
          font-size: 1.25rem;
        }
      `}</style>

      <nav className="nav-container">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`nav-link ${pathname === link.href ? 'active' : ''}`}
          >
            <span className="nav-icon">{link.icon}</span>
            {link.label}
          </Link>
        ))}
      </nav>
    </>
  )
}
