import { type KeyboardEvent, type ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowUpRight, ChevronDown, ChevronLeft, ChevronRight, Download } from 'lucide-react';
import { SiGithub } from '@icons-pack/react-simple-icons';
import { NOTCH_CLIPBOARD as G, type GuideItem } from '@/content/notchClipboard';
import { GUIDE_TABS, hashForTab, tabFromHash, type GuideTabId } from '@/lib/guideTabs';
import { useSEO } from '@/hooks/useSEO';
import { projectAccent, tint } from '@/lib/palette';

// The guide for Notch Clipboard, written for Mac users who aren't developers,
// with a short part for developers at the end of Help. Two tabs, each with
// its own link. Both panels stay in the page (the hidden one with `hidden`),
// so the prerendered HTML and find-in-page cover the whole guide.
export default function NotchClipboard() {
  useSEO({
    title: G.name,
    description: `${G.tagline} A free, open-source Mac app. How to install it, use it and remove it.`,
    path: '/notch-clipboard',
  });

  const location = useLocation();
  const navigate = useNavigate();
  // App.tsx keeps a page mounted after you leave it and hands it a location
  // with no hash, so a missing hash is normal here.
  const activeTab = tabFromHash(location.hash ?? '');

  function openTab(id: GuideTabId) {
    navigate({ hash: hashForTab(id) }, { replace: true });
  }

  // The buttons at the end of a tab switch tabs and go back to the top,
  // so the new tab starts from its beginning.
  function openTabFromBottom(id: GuideTabId) {
    openTab(id);
    window.scrollTo({ top: 0, behavior: 'instant' });
  }

  // Arrow keys move between the tabs, the way a tab list is expected to work.
  function onTabKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') {
      return;
    }
    event.preventDefault();
    const index = GUIDE_TABS.findIndex((tab) => tab.id === activeTab);
    const step = event.key === 'ArrowRight' ? 1 : -1;
    const next = GUIDE_TABS[(index + step + GUIDE_TABS.length) % GUIDE_TABS.length];
    openTab(next.id);
    document.getElementById(`guide-tab-${next.id}`)?.focus();
  }

  return (
    <div className="pb-12" style={tint(projectAccent('notch-clipboard'))}>
      <Link
        to="/projects"
        className="inline-flex items-center gap-1 font-dot text-dim text-[12px] hover:text-heading transition-colors mb-4"
      >
        <ChevronLeft size={12} />
        Projects
      </Link>

      <div className="flex items-start justify-between gap-2 flex-wrap">
        <div className="flex items-baseline gap-x-2.5 gap-y-1 flex-wrap">
          <h1 className="font-title text-heading text-[2rem] leading-none pt-1">
            <span
              aria-hidden="true"
              className="inline-block w-2 h-2 rounded-full bg-(--c) mr-2.5 align-middle -translate-y-[0.12em]"
            />
            {G.name}
          </h1>
          <span className="font-dot text-dim text-[10px] uppercase tracking-wider">Mac app</span>
        </div>
        <a
          href={G.repoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-dim hover:text-heading transition-colors p-1.5 -m-1.5"
          aria-label="Notch Clipboard on GitHub"
        >
          <SiGithub size={13} />
        </a>
      </div>
      <p className="text-sm text-dim leading-relaxed mt-2">{G.tagline}</p>

      <div
        role="tablist"
        aria-label="Guide"
        className="flex flex-wrap gap-1 mt-4 pt-4 border-t border-border mb-5"
      >
        {GUIDE_TABS.map((tab) => {
          const isActive = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              id={`guide-tab-${tab.id}`}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-controls={`guide-panel-${tab.id}`}
              tabIndex={isActive ? 0 : -1}
              onClick={() => openTab(tab.id)}
              onKeyDown={onTabKeyDown}
              className={`font-dot text-[12px] px-3 py-1.5 rounded-lg border transition-colors duration-200 cursor-pointer ${
                isActive ? 'border-heading bg-heading text-bg' : 'border-tile text-dim hover:text-heading hover:border-tile-hover'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      <div
        id="guide-panel-overview"
        role="tabpanel"
        aria-labelledby="guide-tab-overview"
        hidden={activeTab !== 'overview'}
      >
        <OverviewPanel onOpenHelp={() => openTabFromBottom('help')} />
      </div>
      <div id="guide-panel-help" role="tabpanel" aria-labelledby="guide-tab-help" hidden={activeTab !== 'help'}>
        <HelpPanel onOpenOverview={() => openTabFromBottom('overview')} />
      </div>
    </div>
  );
}

function OverviewPanel({ onOpenHelp }: { onOpenHelp: () => void }) {
  return (
    <>
      {G.intro.map((paragraph) => (
        <p key={paragraph} className="text-sm text-body leading-relaxed mb-3">
          {paragraph}
        </p>
      ))}

      <figure className="mt-4 mb-5">
        <video
          controls
          muted
          playsInline
          preload="metadata"
          src={G.video.src}
          poster={G.video.poster}
          aria-label="Notch Clipboard demo video"
          className="w-full aspect-video rounded-[18px] border border-border bg-black"
        />
        <figcaption className="font-dot text-dim text-[11px] mt-2">{G.video.caption}</figcaption>
      </figure>

      <DownloadCard />

      <Section title="Features">
        <ItemGrid items={G.features} />
      </Section>

      <Section title="What You Need">
        <ItemList items={G.requirements} />
      </Section>

      <Section title="Install">
        <ol className="flex flex-col gap-3">
          {G.install.map((step, i) => (
            <li key={step.title} className="flex gap-3">
              <span
                aria-hidden="true"
                className="shrink-0 w-6 h-6 rounded-full border border-(--c)/60 text-(--c) font-dot text-[12px] flex items-center justify-center mt-0.5"
              >
                {i + 1}
              </span>
              <div className="min-w-0">
                <p className="text-[13px] text-heading font-semibold leading-snug">
                  <span className="sr-only">Step {i + 1}: </span>
                  {step.title}
                </p>
                <p className="text-xs text-body leading-relaxed mt-0.5 break-words">{step.text}</p>
              </div>
            </li>
          ))}
        </ol>
        <p className="text-xs text-dim leading-relaxed mt-4">{G.installNote}</p>
        <div className="tile px-4 py-3 mt-3">
          <p className="text-xs text-body leading-relaxed">{G.warningNote}</p>
        </div>
        <p className="text-xs text-body leading-relaxed mt-3">{G.afterInstall}</p>
        <div className="mt-4">
          <button type="button" onClick={onOpenHelp} className="btn group cursor-pointer">
            How to use it
            <ChevronRight size={11} className="transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>
      </Section>
    </>
  );
}

function DownloadCard() {
  return (
    <div className="tile px-4 py-3.5 flex flex-wrap items-center gap-x-4 gap-y-2.5">
      <a href={G.download.url} className="btn group">
        <Download size={11} />
        {G.download.label}
      </a>
      <div className="min-w-0 flex-1 basis-48">
        <p className="text-[11px] text-dim leading-snug">{G.download.detail}</p>
        <a
          href={G.releaseUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-0.5 font-dot text-heading text-[11px] underline underline-offset-4 decoration-(--c) hover:opacity-70 transition-opacity mt-1"
        >
          Release page
          <ArrowUpRight size={10} />
        </a>
      </div>
    </div>
  );
}

function HelpPanel({ onOpenOverview }: { onOpenOverview: () => void }) {
  return (
    <>
      <Section title="How to Use It" first>
        <ItemList items={G.usage} />
      </Section>

      <Section title="Start at Login">
        <Text>{G.loginItems}</Text>
      </Section>

      <Section title="Quit">
        <Text>{G.quit}</Text>
      </Section>

      <Section title="Uninstall">
        <div className="flex flex-col gap-2">
          {G.uninstall.map((line) => (
            <Text key={line}>{line}</Text>
          ))}
        </div>
      </Section>

      <Section title="Privacy">
        <ul className="flex flex-col gap-2">
          {G.privacy.map((line) => (
            <li key={line} className="flex gap-2.5 text-xs text-body leading-relaxed">
              <span aria-hidden="true" className="shrink-0 w-1 h-1 rounded-full bg-(--c) mt-[0.6em]" />
              <span className="min-w-0 break-words">{line}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="FAQ">
        <div className="flex flex-col gap-2">
          {G.faq.map((item) => (
            <details key={item.title} className="tile group px-4 py-2.5 hover:border-tile-hover open:border-(--c)/50">
              <summary className="flex items-center justify-between gap-3 cursor-pointer list-none text-[13px] text-heading font-semibold leading-snug [&::-webkit-details-marker]:hidden">
                {item.title}
                <ChevronDown
                  size={13}
                  aria-hidden="true"
                  className="shrink-0 text-dim transition-transform duration-150 group-open:rotate-180 group-open:text-(--c)"
                />
              </summary>
              <p className="text-xs text-body leading-relaxed mt-1.5 break-words">{item.text}</p>
            </details>
          ))}
        </div>
      </Section>

      <Section title="Build From Source">
        <Text>{G.developers.intro}</Text>
        <div className="flex flex-col gap-2 mt-3">
          <Code>{G.developers.clone}</Code>
          <Code>{G.developers.install}</Code>
        </div>
        <p className="text-xs text-dim leading-relaxed mt-3 break-words">{G.developers.installNote}</p>
        <div className="divide-y divide-border/60 mt-3">
          {G.developers.commands.map((c) => (
            <div key={c.command} className="flex flex-col xs:flex-row xs:items-baseline gap-x-3 gap-y-0.5 py-2">
              <code className="shrink-0 xs:w-40 text-[12px] text-heading">{c.command}</code>
              <span className="text-xs text-dim leading-relaxed">{c.text}</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-dim leading-relaxed mt-3">{G.developers.checksumNote}</p>
        <p className="text-[11px] text-body break-all mt-1 font-mono">{G.developers.checksum}</p>
        <div className="mt-6">
          <button type="button" onClick={onOpenOverview} className="btn group cursor-pointer">
            <ChevronLeft size={11} className="transition-transform group-hover:-translate-x-0.5" />
            Back to download
          </button>
        </div>
      </Section>
    </>
  );
}

// A section heading in the site's style: a dotted label and a dashed rule.
function Section({ title, first = false, children }: { title: string; first?: boolean; children: ReactNode }) {
  return (
    <section className={first ? '' : 'mt-9'}>
      <div className="mb-3 flex items-center gap-3">
        <h2 className="font-dot text-dim text-[11px] uppercase tracking-widest shrink-0">{title}</h2>
        <span className="flex-1 border-t border-dashed border-border" />
      </div>
      {children}
    </section>
  );
}

function ItemGrid({ items }: { items: GuideItem[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
      {items.map((item) => (
        <Item key={item.title} item={item} />
      ))}
    </div>
  );
}

function ItemList({ items }: { items: GuideItem[] }) {
  return (
    <div className="flex flex-col gap-3">
      {items.map((item) => (
        <Item key={item.title} item={item} />
      ))}
    </div>
  );
}

function Item({ item }: { item: GuideItem }) {
  return (
    <div className="min-w-0">
      <p className="text-[13px] text-heading font-semibold leading-snug">{item.title}</p>
      <p className="text-xs text-body leading-relaxed mt-0.5 break-words">{item.text}</p>
    </div>
  );
}

function Text({ children }: { children: ReactNode }) {
  return <p className="text-xs text-body leading-relaxed break-words">{children}</p>;
}

// A command to type. Scrolls sideways inside its own box on a narrow phone,
// so the page itself never does.
function Code({ children }: { children: ReactNode }) {
  return (
    <pre className="rounded-lg bg-surface px-3 py-2 overflow-x-auto text-[12px] text-heading leading-relaxed">
      <code>{children}</code>
    </pre>
  );
}
