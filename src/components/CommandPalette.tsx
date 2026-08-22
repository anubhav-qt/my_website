'use client';

import React, { useEffect, useState, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, FileText, Cpu, Compass, ExternalLink, ArrowRight, X, Layers, FlaskConical } from 'lucide-react';
import { PROJECTS } from '@/content/projects';

interface SearchItem {
  id: string;
  title: string;
  category: 'Pages' | 'Case Studies' | 'Production & Projects' | 'Systems Principles' | 'External';
  summary?: string;
  href: string;
  isExternal?: boolean;
  icon: typeof Search;
}

export function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const items: SearchItem[] = useMemo(() => {
    const baseItems: SearchItem[] = [
      {
        id: 'home',
        title: 'Home: Thesis & Proof Points',
        category: 'Pages',
        summary: 'The Determinism Wall thesis, verified production metrics, and project catalog',
        href: '/',
        icon: Compass,
      },
      {
        id: 'work',
        title: 'All Work: 4-Beat Audits',
        category: 'Pages',
        summary: 'Problem → Constraint → Decision → What Broke audits for all systems',
        href: '/work',
        icon: FileText,
      },
      {
        id: 'systems',
        title: 'Systems Principles: The Determinism Wall',
        category: 'Systems Principles',
        summary: 'Engineering tenets: CQRS separation, local embedding walls, and deterministic scoring',
        href: '/systems',
        icon: Layers,
      },
      {
        id: 'lab',
        title: 'Lab Notes & Open Investigations',
        category: 'Pages',
        summary: 'Active research logs and open distributed systems questions',
        href: '/lab',
        icon: FlaskConical,
      },
    ];

    const projectItems: SearchItem[] = PROJECTS.map((p) => {
      const isCaseStudy = Boolean(p.caseStudyHref);
      return {
        id: p.id,
        title: p.title,
        category: isCaseStudy ? 'Case Studies' : 'Production & Projects',
        summary: p.skimDescription,
        href: p.caseStudyHref || p.repoUrl || `/work#${p.id}`,
        isExternal: !p.caseStudyHref && Boolean(p.repoUrl),
        icon: isCaseStudy ? Cpu : ExternalLink,
      };
    });

    const externalItems: SearchItem[] = [
      {
        id: 'resume',
        title: 'Download Resume (PDF)',
        category: 'External',
        summary: 'Curated technical resume in PDF format',
        href: '/resume.pdf',
        isExternal: true,
        icon: FileText,
      },
      {
        id: 'github',
        title: 'GitHub Profile (@anubhav-qt)',
        category: 'External',
        summary: 'Open source repositories and system implementations',
        href: 'https://github.com/anubhav-qt',
        isExternal: true,
        icon: ExternalLink,
      },
      {
        id: 'linkedin',
        title: 'LinkedIn Profile',
        category: 'External',
        summary: 'Professional experience and connections',
        href: 'https://www.linkedin.com/in/anubhav-qt',
        isExternal: true,
        icon: ExternalLink,
      },
    ];

    return [...baseItems, ...projectItems, ...externalItems];
  }, []);

  // Filter items based on search query
  const filteredItems = useMemo(() => {
    if (!query.trim()) return items;
    const lowerQuery = query.toLowerCase();
    return items.filter(
      (item) =>
        item.title.toLowerCase().includes(lowerQuery) ||
        item.summary?.toLowerCase().includes(lowerQuery) ||
        item.category.toLowerCase().includes(lowerQuery)
    );
  }, [items, query]);

  // Keyboard shortcut listener (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      } else if (e.key === 'Escape' && isOpen) {
        e.preventDefault();
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Lock body scroll and focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      document.body.style.overflow = '';
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Keep selected index within bounds
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Auto scroll highlighted item into view
  useEffect(() => {
    if (listRef.current) {
      const selectedEl = listRef.current.children[selectedIndex] as HTMLElement;
      if (selectedEl) {
        selectedEl.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [selectedIndex]);

  // Arrow key navigation inside modal
  const handleModalKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % filteredItems.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredItems[selectedIndex]) {
        handleSelect(filteredItems[selectedIndex]);
      }
    }
  };

  const handleSelect = (item: SearchItem) => {
    setIsOpen(false);
    if (item.isExternal) {
      window.open(item.href, '_blank');
    } else {
      router.push(item.href);
    }
  };

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="w-full flex items-center justify-between px-3 py-2 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-subtle)] text-[var(--text-muted)] hover:border-[var(--border-strong)] hover:text-[var(--text-secondary)] text-xs font-mono transition-all group"
      >
        <div className="flex items-center gap-2">
          <Search className="w-3.5 h-3.5 text-[var(--text-muted)] group-hover:text-[var(--text-secondary)]" />
          <span>Search portfolio...</span>
        </div>
        <div className="flex items-center gap-1">
          <kbd className="px-1.5 py-0.5 text-[10px] bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded text-[var(--text-muted)] shadow-xs">
            ⌘K
          </kbd>
        </div>
      </button>

      {/* Modal Dialog */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Command Palette Search"
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            onKeyDown={handleModalKeyDown}
            className="w-full max-w-xl rounded-xl border border-[var(--border-strong)] bg-[var(--bg-surface)] shadow-2xl overflow-hidden flex flex-col max-h-[80vh] animate-in zoom-in-95 duration-150"
          >
            {/* Input Search Header */}
            <div className="flex items-center px-4 py-3.5 border-b border-[var(--border-subtle)] bg-[var(--bg-subtle)]/50">
              <Search className="w-4 h-4 text-[var(--text-muted)] mr-3 shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Type a command, case study, or principle..."
                className="w-full bg-transparent text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-hidden font-mono"
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] px-1.5 py-0.5 rounded"
                  aria-label="Clear search input"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Results List */}
            <div ref={listRef} className="flex-1 overflow-y-auto p-2 space-y-1">
              {filteredItems.length === 0 ? (
                <div className="py-12 text-center text-xs font-mono text-[var(--text-muted)]">
                  No matching files, principles, or projects found for &quot;{query}&quot;
                </div>
              ) : (
                filteredItems.map((item, index) => {
                  const isSelected = index === selectedIndex;
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.id}
                      onClick={() => handleSelect(item)}
                      onMouseEnter={() => setSelectedIndex(index)}
                      className={`px-3 py-2.5 rounded-lg flex items-center justify-between cursor-pointer transition-colors ${
                        isSelected
                          ? 'bg-[var(--accent-subtle)] border border-[var(--accent-border)] text-[var(--text-primary)]'
                          : 'hover:bg-[var(--bg-subtle)] text-[var(--text-secondary)] border border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0 pr-2">
                        <div
                          className={`p-1.5 rounded-md shrink-0 ${
                            isSelected
                              ? 'bg-[var(--bg-surface)] text-[var(--accent)]'
                              : 'bg-[var(--bg-subtle)] text-[var(--text-muted)]'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-semibold text-[var(--text-primary)] truncate flex items-center gap-1.5">
                            <span>{item.title}</span>
                            {item.isExternal && <ExternalLink className="w-3 h-3 text-[var(--text-muted)] shrink-0" />}
                          </div>
                          {item.summary && (
                            <p className="text-[11px] text-[var(--text-muted)] truncate mt-0.5 font-mono">
                              {item.summary}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="shrink-0 flex items-center gap-2">
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-muted)]">
                          {item.category}
                        </span>
                        {isSelected && <ArrowRight className="w-3.5 h-3.5 text-[var(--accent)]" />}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer Hints */}
            <div className="px-4 py-2.5 border-t border-[var(--border-subtle)] bg-[var(--bg-subtle)]/40 flex items-center justify-between text-[11px] font-mono text-[var(--text-muted)]">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <kbd className="px-1 py-0.5 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded text-[10px]">
                    ↑
                  </kbd>
                  <kbd className="px-1 py-0.5 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded text-[10px]">
                    ↓
                  </kbd>{' '}
                  Navigate
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded text-[10px]">
                    ↵
                  </kbd>{' '}
                  Select
                </span>
              </div>
              <div className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded text-[10px]">
                  ESC
                </kbd>{' '}
                Close
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
