// The two tabs of the Notch Clipboard guide. Each has its own link
// (/notch-clipboard#help), so a FAQ answer can be sent to someone directly.

export const GUIDE_TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'help', label: 'Help' },
] as const;

export type GuideTabId = (typeof GUIDE_TABS)[number]['id'];

export const DEFAULT_GUIDE_TAB: GuideTabId = 'overview';

// Reads a location hash like "#help". Anything unknown, empty or oddly cased
// falls back to the first tab instead of showing an empty page.
export function tabFromHash(hash: string): GuideTabId {
  const id = hash.replace(/^#/, '').trim().toLowerCase();
  const match = GUIDE_TABS.find((tab) => tab.id === id);
  if (match) {
    return match.id;
  }
  return DEFAULT_GUIDE_TAB;
}

// The hash a tab is linked by. The first tab gets none, so the plain
// /notch-clipboard link stays clean.
export function hashForTab(id: GuideTabId): string {
  if (id === DEFAULT_GUIDE_TAB) {
    return '';
  }
  return `#${id}`;
}
