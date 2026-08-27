import { useEffect, useRef, useState, type ComponentType } from 'react';
import { Link } from 'react-router-dom';
import { Cloud, Waypoints, Bot, Cpu, Database, Workflow, ChevronDown } from 'lucide-react';
import {
  SiPython,
  SiTypescript,
  SiFastapi,
  SiPostgresql,
  SiRedis,
  SiDocker,
  SiPytorch,
  SiNextdotjs,
  SiGooglecloud,
  SiReact,
  SiClickhouse,
  SiNeon,
  SiVercel,
  SiRender,
  SiExpo,
  SiCockroachlabs,
} from '@icons-pack/react-simple-icons';
import { STACK_GROUPS, EXPERIENCE, EDUCATION, type Accent, type ExperienceEntry } from '@/content/site';
import { PROJECTS } from '@/content/projects';
import { CommentThread } from '@/components/CommentThread';
import { ContentMeta } from '@/components/ContentMeta';
import { useViewTracking } from '@/hooks/useViewTracking';
import { useLikeTracking } from '@/hooks/useLikeTracking';
import { useCommentTracking } from '@/hooks/useCommentTracking';

type Tab = 'stack' | 'career' | 'education';

const TABS: { id: Tab; label: string }[] = [
  { id: 'stack', label: 'stack' },
  { id: 'career', label: 'career' },
  { id: 'education', label: 'education' },
];

const TECH_ICON: Record<string, ComponentType<{ size?: number; className?: string }>> = {
  Python: SiPython,
  TypeScript: SiTypescript,
  'SQL (PostgreSQL / ClickHouse)': Database,
  FastAPI: SiFastapi,
  PyTorch: SiPytorch,
  'Google ADK': Bot,
  'Google Agent Builder': Bot,
  LangGraph: Waypoints,
  MCP: Cpu,
  'Model Context Protocol (MCP)': Cpu,
  ClickHouse: SiClickhouse,
  PostgreSQL: SiPostgresql,
  Neon: SiNeon,
  'Neon Serverless': SiNeon,
  CockroachDB: SiCockroachlabs,
  Redis: SiRedis,
  'pgvector / Pinecone': Database,
  'Google Cloud': SiGooglecloud,
  AWS: Cloud,
  Docker: SiDocker,
  Vercel: SiVercel,
  Render: SiRender,
  'Next.js': SiNextdotjs,
  'Next.js 14': SiNextdotjs,
  'React Flow': Workflow,
  'React Native': SiReact,
  Expo: SiExpo,
};

const ACCENT: Record<Accent, { text: string; border: string; bg: string }> = {
  amber: { text: 'text-amber', border: 'border-amber', bg: 'bg-amber/10' },
  sage: { text: 'text-sage', border: 'border-sage', bg: 'bg-sage/10' },
  rose: { text: 'text-rose', border: 'border-rose', bg: 'bg-rose/10' },
  clay: { text: 'text-clay', border: 'border-clay', bg: 'bg-clay/10' },
  gold: { text: 'text-gold', border: 'border-gold', bg: 'bg-gold/10' },
};

function projectsUsing(item: string) {
  const needle = item.toLowerCase();
  return PROJECTS.filter((p) =>
    p.tech.some((t) => {
      const tLower = t.toLowerCase();
      if (needle.includes('python') && tLower.includes('python')) return true;
      if (needle.includes('clickhouse') && tLower.includes('clickhouse')) return true;
      if (needle.includes('postgresql') && (tLower.includes('postgresql') || tLower.includes('postgres'))) return true;
      if (needle.includes('pgvector') && tLower.includes('pgvector')) return true;
      if (needle.includes('agent builder') && tLower.includes('agent builder')) return true;
      if (needle.includes('mcp') && tLower.includes('mcp')) return true;
      if (needle.includes('next.js') && tLower.includes('next.js')) return true;
      if (needle.includes('docker') && tLower.includes('docker')) return true;
      if (needle.includes('redis') && tLower.includes('redis')) return true;
      if (needle.includes('fastapi') && tLower.includes('fastapi')) return true;
      if (needle.includes('pytorch') && tLower.includes('pytorch')) return true;
      if (needle.includes('langgraph') && tLower.includes('langgraph')) return true;
      if (needle.includes('react native') && tLower.includes('react native')) return true;
      if (needle.includes('google cloud') && (tLower.includes('gcp') || tLower.includes('google cloud'))) return true;
      return tLower.includes(needle) || needle.includes(tLower);
    })
  );
}

const STACK_HINT_SEEN_KEY = 'stack-hint-seen';

function StackPanel() {
  const [selected, setSelected] = useState<string | null>(null);
  // main.tsx uses createRoot (not hydrateRoot) -- the client fully replaces
  // the prerendered static HTML in one synchronous commit, it never
  // reconciles against it. So reading localStorage directly here is already
  // correct on the very first real paint; no hydration mismatch to guard
  // against. (The prerender step itself forces this to 'seen' so the static
  // snapshot -- which crawlers and pre-JS page loads briefly show -- never
  // bakes in a hint that most real visitors have already dismissed; see
  // scripts/prerender.mjs.)
  const [hintSeen, setHintSeen] = useState(() => localStorage.getItem(STACK_HINT_SEEN_KEY) === '1');
  const matches = selected ? projectsUsing(selected) : [];
  const usedInRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selected) usedInRef.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }, [selected]);

  function selectItem(s: string, isSelected: boolean) {
    if (!hintSeen) {
      localStorage.setItem(STACK_HINT_SEEN_KEY, '1');
      setHintSeen(true);
    }
    setSelected(isSelected ? null : s);
  }

  return (
    <div>
      <div className="flex flex-col gap-2">
        {STACK_GROUPS.map((group, groupIdx) => {
          const accent = ACCENT[group.accent];
          return (
            <div key={group.label} className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-2">
              <div className={`sm:w-[130px] shrink-0 sm:pt-0.5 ${accent.text}`}>
                <span className="text-xs font-semibold leading-tight">{group.label.toLowerCase()}</span>
              </div>
              <div className="flex flex-wrap gap-1 flex-1 min-w-0">
                {group.items.map((s) => {
                  const isSelected = selected === s;
                  const hasMatches = projectsUsing(s).length > 0;
                  const Icon = TECH_ICON[s];
                  return (
                    <button
                      key={s}
                      onClick={() => selectItem(s, isSelected)}
                      disabled={!hasMatches}
                      className={`inline-flex items-center gap-1 text-[12px] px-1.5 py-0.5 border transition-colors ${
                        isSelected
                          ? `${accent.border} ${accent.text} ${accent.bg}`
                          : hasMatches
                            ? 'border-border text-body hover:border-dim'
                            : 'border-border/60 text-dim/70 cursor-default'
                      }`}
                    >
                      {Icon && <Icon size={12} />}
                      {s}
                    </button>
                  );
                })}
              </div>
              {groupIdx === 0 && !hintSeen && (
                <span className="hidden sm:inline-block shrink-0 pt-0.5 text-dim text-[11px] italic whitespace-nowrap">
                  {'<--- click to see where it\'s used'}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {selected && (
        <div ref={usedInRef} className="mt-2.5 pt-2 border-t border-dashed border-border text-[12px]">
          {matches.length > 0 ? (
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="text-dim">used in:</span>
              {matches.map((p) => (
                <Link key={p.id} to={`/projects#${p.id}`} className="text-heading font-semibold hover:text-amber transition-colors lowercase">
                  → {p.title.split(':')[0]}
                </Link>
              ))}
            </div>
          ) : (
            <span className="text-dim">not shipped anywhere yet.</span>
          )}
        </div>
      )}
    </div>
  );
}

function CareerItem({
  entry,
  isOpen,
  onToggle,
}: {
  entry: ExperienceEntry;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const targetId = `career-${entry.id}`;
  const views = useViewTracking('project', targetId, isOpen);
  const like = useLikeTracking('project', targetId);
  const commentCount = useCommentTracking('project', targetId);

  return (
    <div
      id={targetId}
      className={`border transition-colors ${
        isOpen ? 'border-amber/70 bg-surface/50' : 'border-border hover:border-dim'
      }`}
    >
      <button
        onClick={onToggle}
        className="w-full text-left px-2.5 py-2 transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-amber text-xs font-bold">{entry.company}</span>
          <span className="text-heading text-xs lowercase">{entry.role}</span>
          <div className="ml-auto flex items-center gap-2">
            <span className="text-dim text-[11px] shrink-0">{entry.period}</span>
            <ContentMeta views={views} liked={like.liked} likeCount={like.count} commentCount={commentCount} />
            <ChevronDown
              size={12}
              className={`transition-transform duration-150 ${isOpen ? 'rotate-180 text-amber' : 'text-dim'}`}
            />
          </div>
        </div>
        <p className="text-dim text-[12px] leading-snug mt-1">{entry.headline}</p>
      </button>

      {isOpen && (
        <div className="px-2.5 pb-3 pt-2 border-t border-dashed border-border/70">
          <div className="space-y-2 mt-1">
            {entry.bullets.map((b, i) => (
              <p
                key={i}
                className="text-[12px] text-body/90 leading-relaxed pl-3 relative before:content-['-'] before:absolute before:left-0 before:text-amber"
              >
                {b}
              </p>
            ))}
          </div>
          <CommentThread targetType="project" targetId={targetId} accent="amber" like={like} />
        </div>
      )}
    </div>
  );
}

function CareerPanel() {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-2">
      {EXPERIENCE.map((e) => (
        <CareerItem
          key={e.id}
          entry={e}
          isOpen={selected === e.id}
          onToggle={() => setSelected(selected === e.id ? null : e.id)}
        />
      ))}
    </div>
  );
}

function EducationPanel() {
  const targetId = 'education';
  const views = useViewTracking('project', targetId, true);
  const like = useLikeTracking('project', targetId);
  const commentCount = useCommentTracking('project', targetId);

  return (
    <div className="border border-border/70 bg-surface/30 p-3">
      <div className="flex items-start justify-between gap-2 flex-wrap">
        <div>
          <span className="text-heading text-xs font-bold">{EDUCATION.degree}</span>
          <p className="text-body text-xs mt-1">{EDUCATION.school}</p>
          <p className="text-dim text-[12px] mt-0.5">{EDUCATION.period}</p>
        </div>
        <ContentMeta views={views} liked={like.liked} likeCount={like.count} commentCount={commentCount} />
      </div>

      <div className="flex flex-wrap items-center gap-3 mt-2.5 pt-2.5 border-t border-dashed border-border">
        <span className="text-sage text-xs font-bold">CGPA {EDUCATION.cgpa}</span>
        <span className="text-gold text-xs font-semibold">{EDUCATION.honor}</span>
      </div>

      <p className="text-dim text-[12px] leading-relaxed mt-2">{EDUCATION.note}</p>

      <CommentThread targetType="project" targetId={targetId} accent="amber" like={like} />
    </div>
  );
}

export function ProfileRail() {
  const [tab, setTab] = useState<Tab>('stack');

  return (
    <div className="flex flex-col sm:flex-row gap-2 sm:gap-5 sm:min-h-56">
      <div className="flex sm:flex-col sm:w-24 sm:shrink-0 gap-1 border-b sm:border-b-0 border-border">
        {TABS.map((t) => {
          const isActive = tab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex-1 sm:flex-initial text-center sm:text-left text-xs font-bold tracking-wide transition-colors underline-offset-4 py-2 sm:py-0 border-b-2 sm:border-b-0 ${
                isActive ? 'text-amber border-amber sm:underline' : 'text-dim border-transparent hover:text-body'
              }`}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      <div className="flex-1 min-w-0 border-t sm:border-t-0 sm:border-l border-border pt-2.5 sm:pt-0 sm:pl-5 pr-1">
        {tab === 'stack' && <StackPanel />}
        {tab === 'career' && <CareerPanel />}
        {tab === 'education' && <EducationPanel />}
      </div>
    </div>
  );
}
