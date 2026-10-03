import { useEffect, useRef, useState, type ComponentType } from 'react';
import { Link } from 'react-router-dom';
import { Cloud, Waypoints, Bot, Cpu, Database, Workflow, Lock, ChevronDown, ChevronRight } from 'lucide-react';
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
  SiLangchain,
  SiKubernetes,
  SiRust,
  SiNestjs,
  SiSqlalchemy,
  SiTypeorm,
  SiOpencv,
  SiLinux,
  SiCaddy,
  SiCloudflare,
  SiTailwindcss,
} from '@icons-pack/react-simple-icons';
import { STACK_GROUPS, EXPERIENCE, EDUCATION, type ExperienceEntry } from '@/content/site';
import { PROJECTS } from '@/content/projects';
import { CommentThread } from '@/components/CommentThread';
import { useViewTracking } from '@/hooks/useViewTracking';
import { careerAccent, tint } from '@/lib/palette';

type Tab = 'stack' | 'career' | 'education';

const TABS: { id: Tab; label: string }[] = [
  { id: 'stack', label: 'stack' },
  { id: 'career', label: 'career' },
  { id: 'education', label: 'education' },
];

const TECH_ICON: Record<string, ComponentType<{ size?: number; className?: string }>> = {
  Python: SiPython,
  TypeScript: SiTypescript,
  Rust: SiRust,
  NestJS: SiNestjs,
  SQLAlchemy: SiSqlalchemy,
  TypeORM: SiTypeorm,
  OpenCV: SiOpencv,
  PgBouncer: Database,
  'Docker Compose': SiDocker,
  Linux: SiLinux,
  Caddy: SiCaddy,
  cloudflared: SiCloudflare,
  age: Lock,
  React: SiReact,
  'Tailwind CSS': SiTailwindcss,
  'SQL (PostgreSQL / ClickHouse)': Database,
  FastAPI: SiFastapi,
  PyTorch: SiPytorch,
  LangChain: SiLangchain,
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
  pgvector: Database,
  Pinecone: Database,
  'pgvector / Pinecone': Database,
  'Google Cloud': SiGooglecloud,
  AWS: Cloud,
  Kubernetes: SiKubernetes,
  Docker: SiDocker,
  Vercel: SiVercel,
  Render: SiRender,
  'Next.js': SiNextdotjs,
  'Next.js 14': SiNextdotjs,
  'React Flow': Workflow,
  'React Native': SiReact,
  Expo: SiExpo,
};

const STACK_HINT_SEEN_KEY = 'stack-hint-seen';

function StackPanel({ onOpenCareer }: { onOpenCareer: (id: string) => void }) {
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
  const usedIn = STACK_GROUPS.flatMap((g) => g.items).find((i) => i.name === selected)?.usedIn ?? [];
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
          return (
            <div key={group.label} style={tint(group.accent)} className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-2">
              <div className="sm:w-[130px] shrink-0 sm:pt-1 text-(--c)">
                <span className="font-dot text-[12px] leading-tight">{group.label}</span>
              </div>
              <div className="flex flex-wrap gap-1 flex-1 min-w-0">
                {group.items.map(({ name: s, usedIn: where }) => {
                  const isSelected = selected === s;
                  const hasMatches = where.length > 0;
                  const Icon = TECH_ICON[s];
                  return (
                    <button
                      key={s}
                      onClick={() => selectItem(s, isSelected)}
                      disabled={!hasMatches}
                      className={`inline-flex items-center gap-1 text-[12px] px-2 py-0.5 rounded-lg border transition-colors ${isSelected
                          ? 'border-(--c) text-(--c) bg-(--c)/10'
                          : hasMatches
                            ? 'border-tile text-body hover:border-tile-hover'
                            : 'border-border text-dim/60 cursor-default'
                        }`}
                    >
                      {/* The group's colour shows on the icons of things actually in use. */}
                      {Icon && <Icon size={12} className={hasMatches ? 'text-(--c)' : ''} />}
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
        <div ref={usedInRef} className="mt-3 pt-2.5 border-t border-dashed border-border text-[12px]">
          {usedIn.length > 0 ? (
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="text-dim">used in:</span>
              {usedIn.map((id) => {
                // Work that isn't a project on the site opens its card in the career tab.
                const career = EXPERIENCE.find((e) => `career-${e.id}` === id);
                if (career) {
                  return (
                    <button key={id} onClick={() => onOpenCareer(career.id)} className="text-heading font-semibold underline-offset-4 hover:underline cursor-pointer">
                      → {career.company}
                    </button>
                  );
                }
                const p = PROJECTS.find((proj) => proj.id === id)!;
                return (
                  <Link key={id} to={p.id === 'spoin' ? '/projects/spoin' : `/projects#${p.id}`} className="text-heading font-semibold underline-offset-4 hover:underline">
                    → {p.title.split(':')[0]}
                  </Link>
                );
              })}
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
  const accent = careerAccent(entry.id);
  useViewTracking('project', targetId, isOpen); // still records the view; no longer displayed

  return (
    <div
      id={targetId}
      style={tint(accent)}
      className={`tile ${isOpen ? 'border-(--c)/50' : 'hover:border-tile-hover'}`}
    >
      <button
        onClick={onToggle}
        className="w-full text-left px-3.5 py-3 cursor-pointer"
      >
        <div className="flex items-baseline gap-x-2 gap-y-0.5 flex-wrap">
          <span className="font-title text-heading text-[1.2rem] leading-none">
            <span aria-hidden="true" className="inline-block w-1.5 h-1.5 rounded-full bg-(--c) mr-2 align-middle -translate-y-[0.12em]" />
            {entry.company}
          </span>
          <span className="font-dot text-dim text-[11px]">{entry.role}</span>
          <div className="ml-auto flex items-center gap-2">
            <span className="font-dot text-dim text-[11px] shrink-0">{entry.period}</span>
            <ChevronDown
              size={12}
              className={`self-center transition-transform duration-150 ${isOpen ? 'rotate-180 text-heading' : 'text-dim'}`}
            />
          </div>
        </div>
        <p className="text-dim text-[12px] leading-snug mt-1.5">{entry.headline}</p>
      </button>

      {isOpen && (
        <div className="px-3.5 pb-3.5 pt-2 border-t border-dashed border-border">
          <div className="space-y-2 mt-1">
            {entry.bullets.map((b, i) => (
              <p
                key={i}
                className="text-[12px] text-body leading-relaxed pl-3 relative before:content-['-'] before:absolute before:left-0 before:text-(--c)"
              >
                {b}
              </p>
            ))}
          </div>
          {/* The long first-person account lives in a scratchpad writeup. The
              home page keeps the brief and links out to it, where one exists. */}
          {entry.story && (
            <Link
              to={entry.story}
              className="btn mt-3"
            >
              Read the full story
              <ChevronRight size={11} />
            </Link>
          )}

          <CommentThread targetType="project" targetId={targetId} accent={accent} />
        </div>
      )}
    </div>
  );
}

function CareerPanel({ selected, setSelected }: { selected: string | null; setSelected: (id: string | null) => void }) {
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
  useViewTracking('project', targetId, true); // still records the view; no longer displayed

  return (
    <div className="tile px-3.5 py-3">
      <div className="flex items-start justify-between gap-2 flex-wrap">
        <div>
          <span className="font-title text-heading text-[1.2rem] leading-none">{EDUCATION.degree}</span>
          <p className="text-body text-xs mt-1.5">{EDUCATION.school}</p>
          <p className="font-dot text-dim text-[11px] mt-1">{EDUCATION.period}</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 mt-2.5 pt-2.5 border-t border-dashed border-border">
        <span className="font-dot text-green text-[12px]">CGPA {EDUCATION.cgpa}</span>
        <span className="text-ochre text-xs font-semibold">{EDUCATION.honor}</span>
      </div>

      <p className="text-dim text-[12px] leading-relaxed mt-2">{EDUCATION.note}</p>

      <CommentThread targetType="project" targetId={targetId} accent="moss" />
    </div>
  );
}

export function ProfileRail() {
  const [tab, setTab] = useState<Tab>('stack');
  // Lives up here so a "used in" link on the stack tab can open a career entry.
  const [career, setCareer] = useState<string | null>(null);

  function openCareer(id: string) {
    setTab('career');
    setCareer(id);
    requestAnimationFrame(() => document.getElementById(`career-${id}`)?.scrollIntoView({ block: 'nearest' }));
  }

  return (
    <div className="flex flex-col sm:flex-row gap-2 sm:gap-5 sm:min-h-56">
      <div className="flex sm:flex-col sm:w-24 sm:shrink-0 gap-1 border-b sm:border-b-0 border-border">
        {TABS.map((t) => {
          const isActive = tab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex-1 sm:flex-initial cursor-pointer text-center sm:text-left text-[12px] font-dot transition-colors py-2 sm:py-1 ${isActive ? 'text-heading' : 'text-dim hover:text-heading'
                }`}
            >
              <span className="relative">
                {t.label}
                {isActive && <span className="absolute left-0 right-0 -bottom-1 h-0.5 rounded-full bg-heading" />}
              </span>
            </button>
          );
        })}
      </div>

      {/* Narrow widths stack this under the tab row, whose border-b already draws the line between them. */}
      <div className="flex-1 min-w-0 sm:border-l border-border pt-2.5 sm:pt-0 sm:pl-5 pr-1 h-[347px] overflow-y-auto">
        {tab === 'stack' && <StackPanel onOpenCareer={openCareer} />}
        {tab === 'career' && <CareerPanel selected={career} setSelected={setCareer} />}
        {tab === 'education' && <EducationPanel />}
      </div>
    </div>
  );
}
