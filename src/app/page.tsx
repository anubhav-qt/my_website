import React from 'react';
import Link from 'next/link';
import { ArrowRight, ShieldCheck, Cpu, Layers, Brain, GitFork, GraduationCap, Mail } from 'lucide-react';
import { SiGithub } from '@icons-pack/react-simple-icons';
import { LinkedinIcon } from '@/components/icons/BrandIcons';
import { WallGlyph } from '@/components/icons/WallGlyph';
import { TechTile, TechIconRow } from '@/components/TechIcon';
import { Timeline, type TimelineEntry } from '@/components/Timeline';
import { PROJECTS } from '@/content/projects';

const SKILLS = [
  'Python',
  'TypeScript',
  'FastAPI',
  'PostgreSQL',
  'Redis',
  'Docker',
  'PyTorch',
  'LangChain',
  'LangGraph',
  'Next.js',
  'GCP',
  'AWS',
  'React Native',
  'Supabase',
];

const EXPERIENCE: TimelineEntry[] = [
  {
    id: 'anchorate',
    icon: 'ShieldCheck',
    title: 'Anchorate',
    role: 'Co-Founder & CTO',
    period: 'Jan 2026 — Present',
    headline: [
      'Runtime policy firewall between AI agents and tools — PII redaction, injection detection, pgvector audit log.',
      'Own architecture and infra (AWS/GCP, Docker, CI/CD) for two shipping products.',
    ],
    details: [
      'Anchor8 (AI agent governance): runtime policy interception layer with PII redaction, prompt injection detection lanes, and statistical + pgvector similarity anomaly detection over an append-only audit log.',
      'Packaged the platform as a PyPI SDK with a 3-line LangChain integration; designed the policy schema, storage layer, and public SDK surface.',
      'Cargonto (freight document automation): extraction backend converting invoices and packing lists from PDFs and phone photos into structured records with per-field confidence scores, exported to Excel, Tally, and ICEGATE checklists.',
    ],
    tech: ['Python', 'FastAPI', 'PostgreSQL', 'Redis', 'LangGraph', 'pgvector', 'Docker', 'AWS', 'GCP'],
  },
  {
    id: 'blinkadz',
    icon: 'Zap',
    title: 'Blinkadz',
    role: 'SDE Intern',
    period: 'Feb 2025 — Apr 2025',
    headline: [
      '12-agent AI pipeline (Google ADK + FastAPI) cut video ad creation time 95%.',
      'Benchmarked 20 LLMs across 3 production use cases to drive model selection.',
    ],
    details: [
      'Engineered and deployed a 12-agent AI pipeline as a microservice using Google Agent Development Kit and FastAPI, reducing video ad creation time by 95%.',
      'Automated LinkedIn campaign workflows through Marketing API integration, reducing ad setup time by 85%.',
      'Built end-to-end test suites for critical modules with Playwright, raising coverage to 90%.',
    ],
    tech: ['Google ADK', 'FastAPI', 'Python', 'Playwright', 'OpenRouter'],
  },
];

const CATEGORY_ICON: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  Flagship: Cpu,
  'Architecture Spec': Layers,
  'Production & Systems': ShieldCheck,
  'Open Source': GitFork,
  'AI & Machine Learning': Brain,
};

export default function HomePage() {
  const flagship = PROJECTS.filter((p) => p.featured && (p.category === 'Flagship' || p.category === 'Architecture Spec'));
  const otherProjects = PROJECTS.filter((p) => !flagship.includes(p));

  return (
    <div className="space-y-12 animate-in fade-in duration-300">
      {/* HEADER */}
      <section className="space-y-3 pt-2">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <WallGlyph size={22} />
            <h1 className="text-h3 leading-none m-0">Anubhav Joshi</h1>
            <span className="text-sm text-[var(--text-muted)]">— Backend &amp; AI Infrastructure</span>
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--success-subtle)] text-xs font-medium text-[var(--success)]">
            Available for hire
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-[var(--text-secondary)]">
          <span className="inline-flex items-center gap-1.5">
            <Mail size={14} className="text-[var(--text-muted)]" />
            <a href="mailto:magicalfizz@gmail.com" className="hover:text-[var(--accent)] transition-colors">
              magicalfizz@gmail.com
            </a>
          </span>
          <span className="text-[var(--text-muted)]">Jaipur, India</span>
          <div className="flex items-center gap-2">
            <a
              href="https://github.com/anubhav-qt"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="w-8 h-8 rounded-full border border-[var(--border-strong)] flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--text-muted)] transition-colors"
            >
              <SiGithub size={15} />
            </a>
            <a
              href="https://www.linkedin.com/in/anubhav-qt"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="w-8 h-8 rounded-full border border-[var(--border-strong)] flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--text-muted)] transition-colors"
            >
              <LinkedinIcon size={15} />
            </a>
          </div>
        </div>
      </section>

      {/* SKILLS PICTOGRAM GRID */}
      <section className="space-y-4">
        <h2 className="text-h3">Stack</h2>
        <div className="grid grid-cols-4 sm:grid-cols-7 gap-3">
          {SKILLS.map((s) => (
            <TechTile key={s} name={s} />
          ))}
        </div>
      </section>

      {/* EXPERIENCE TIMELINE */}
      <section className="space-y-6">
        <h2 className="text-h3">Experience</h2>
        <Timeline entries={EXPERIENCE} />
      </section>

      {/* EDUCATION — one compact line */}
      <section className="flex items-center gap-3 text-sm text-[var(--text-secondary)]">
        <GraduationCap size={18} className="text-[var(--text-muted)] shrink-0" />
        <span>
          B.Tech, Computer Science (AI &amp; ML) · Manipal University Jaipur · Aug 2022 – Jul 2026 ·{' '}
          <span className="text-[var(--text-primary)] font-medium">CGPA 9.28/10</span> · Dean&apos;s List all 8 semesters
        </span>
      </section>

      {/* FLAGSHIP SYSTEMS */}
      <section className="space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-h3">Flagship systems</h2>
          <Link href="/systems" className="text-sm text-[var(--accent)] hover:underline inline-flex items-center gap-1">
            Principles <ArrowRight size={13} />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {flagship.map((p) => {
            const Icon = CATEGORY_ICON[p.category] ?? Cpu;
            return (
              <Link
                key={p.id}
                href={p.caseStudyHref ?? '#'}
                className="group p-5 rounded-xl border border-[var(--border-strong)] hover:border-[var(--accent)] transition-colors space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="w-9 h-9 rounded-lg bg-[var(--accent-subtle)] text-[var(--accent)] flex items-center justify-center">
                    <Icon size={17} />
                  </div>
                  <ArrowRight size={16} className="text-[var(--text-muted)] group-hover:text-[var(--accent)] group-hover:translate-x-1 transition-all" />
                </div>
                <h3 className="text-base font-semibold text-[var(--text-primary)]">{p.title}</h3>
                <p className="text-sm text-[var(--text-secondary)]">{p.skimDescription}</p>
                <TechIconRow names={p.tech.slice(0, 6)} size={15} />
              </Link>
            );
          })}
        </div>
      </section>

      {/* OTHER PROJECTS — compact */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-h3">Open source &amp; applied ML</h2>
          <Link href="/work" className="text-sm text-[var(--accent)] hover:underline inline-flex items-center gap-1">
            All work <ArrowRight size={13} />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {otherProjects.map((p) => {
            const Icon = CATEGORY_ICON[p.category] ?? Cpu;
            return (
              <a
                key={p.id}
                href={p.repoUrl ?? '/work'}
                target={p.repoUrl ? '_blank' : undefined}
                rel={p.repoUrl ? 'noopener noreferrer' : undefined}
                className="flex items-center gap-2.5 p-3 rounded-lg border border-[var(--border-subtle)] hover:border-[var(--border-strong)] transition-colors"
              >
                <div className="w-7 h-7 rounded-md bg-[var(--bg-subtle)] text-[var(--text-secondary)] flex items-center justify-center shrink-0">
                  <Icon size={14} />
                </div>
                <span className="text-sm font-medium text-[var(--text-primary)] truncate">{p.title.split(':')[0]}</span>
              </a>
            );
          })}
        </div>
      </section>
    </div>
  );
}
