'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Compass,
  FileText,
  Cpu,
  Layers,
  FlaskConical,
  Menu,
  X,
  ExternalLink,
} from 'lucide-react';
import { CommandPalette } from './CommandPalette';
import { ThemeToggle } from './ThemeToggle';
import { WallGlyph } from './icons/WallGlyph';

interface NavItem {
  name: string;
  href: string;
  icon: typeof Compass;
  badge?: string;
  isNested?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { name: 'Overview', href: '/', icon: Compass },
  { name: 'All Work', href: '/work', icon: FileText },
  { name: 'Spoin (Flagship)', href: '/work/spoin', icon: Cpu, isNested: true, badge: 'Live Sim' },
  { name: 'Continuum', href: '/work/continuum', icon: Cpu, isNested: true, badge: 'Spec' },
  { name: 'Systems Principles', href: '/systems', icon: Layers },
  { name: 'Lab Notes', href: '/lab', icon: FlaskConical },
];

export function NavRail() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile Top Header */}
      <header className="md:hidden sticky top-0 z-40 flex items-center justify-between px-4 py-3 border-b border-[var(--border-subtle)] bg-[var(--bg-surface)]/95 backdrop-blur-md">
        <Link href="/" className="flex items-center gap-2 font-semibold text-sm tracking-tight text-[var(--text-primary)] min-h-[44px] items-center">
          <WallGlyph size={18} />
          <span>Anubhav</span>
          <span className="text-[var(--text-muted)] font-mono text-xs font-normal">/ backend &amp; AI</span>
        </Link>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex items-center justify-center min-w-[44px] min-h-[44px] rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="md:hidden fixed inset-0 top-[57px] z-30 bg-[var(--bg-page)] p-6 overflow-y-auto animate-in slide-in-from-top-2 duration-150 flex flex-col justify-between"
        >
          <div className="space-y-6">
            <div>
              <CommandPalette />
            </div>

            <nav className="space-y-1">
              <div className="px-2 pb-2 text-[11px] font-mono uppercase tracking-wider text-[var(--text-muted)]">
                Navigation
              </div>
              {NAV_ITEMS.map((item) => {
                const active = isActive(item.href);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center justify-between px-3 min-h-[44px] rounded-lg text-sm font-medium transition-colors ${
                      active
                        ? 'bg-[var(--accent-subtle)] text-[var(--accent)] font-semibold border border-[var(--accent-border)]'
                        : 'text-[var(--text-secondary)] hover:bg-[var(--bg-subtle)] hover:text-[var(--text-primary)]'
                    } ${item.isNested ? 'ml-3' : ''}`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-4 h-4 text-[var(--text-muted)]" />
                      <span>{item.name}</span>
                    </div>
                    {item.badge && (
                      <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-muted)]">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="pt-6 border-t border-[var(--border-subtle)] space-y-3">
            <a
              href="https://github.com/anubhav-qt"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 min-h-[44px] rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-xs font-mono text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            >
              <span>GitHub</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      )}

      {/* Desktop Persistent Left Rail */}
      <aside className="hidden md:flex flex-col justify-between w-64 h-screen sticky top-0 border-r border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 shrink-0 z-30">
        {/* Top: Identity & Search */}
        <div className="space-y-5">
          <div>
            <Link href="/" className="group block">
              <div className="flex items-center gap-2.5">
                <WallGlyph size={20} className="transition-transform group-hover:scale-110" />
                <span className="font-semibold text-base tracking-tight text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-display)' }}>
                  Anubhav Joshi
                </span>
              </div>
              <p className="text-xs text-[var(--text-muted)] mt-1 pl-[26px]">
                Backend Engineer, AI Infrastructure
              </p>
            </Link>
          </div>

          <div>
            <CommandPalette />
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1 pt-1">
            <div className="px-2 pb-1.5 text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)]">
              Navigation
            </div>
            {NAV_ITEMS.map((item) => {
              const active = isActive(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between px-2.5 py-2 rounded-md text-xs transition-colors group ${
                    active
                      ? 'bg-[var(--accent-subtle)] text-[var(--accent)] font-semibold border border-[var(--accent-border)]'
                      : 'text-[var(--text-secondary)] hover:bg-[var(--bg-subtle)] hover:text-[var(--text-primary)] border border-transparent'
                  } ${item.isNested ? 'ml-3 w-[calc(100%-0.75rem)] text-[11.5px]' : ''}`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Icon
                      className={`w-3.5 h-3.5 shrink-0 transition-colors ${
                        active
                          ? 'text-[var(--accent)]'
                          : 'text-[var(--text-muted)] group-hover:text-[var(--text-primary)]'
                      }`}
                    />
                    <span className="truncate">{item.name}</span>
                  </div>
                  {item.badge && (
                    <span className="font-mono text-[9px] px-1.5 py-0.5 rounded bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-muted)] group-hover:border-[var(--border-strong)]">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom: External links & Theme Toggle */}
        <div className="pt-4 border-t border-[var(--border-subtle)] space-y-3">
          <div className="flex items-center justify-between text-xs font-mono text-[var(--text-muted)]">
            <a
              href="https://github.com/anubhav-qt"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[var(--text-primary)] transition-colors flex items-center gap-1"
              title="GitHub Profile"
            >
              <span>GitHub</span>
            </a>
            <ThemeToggle />
          </div>
        </div>
      </aside>
    </>
  );
}
