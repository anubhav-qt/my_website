import React from 'react';
import {
  SiPython,
  SiTypescript,
  SiPostgresql,
  SiDocker,
  SiNextdotjs,
  SiPytorch,
  SiRedis,
  SiFastapi,
  SiReact,
  SiGooglecloud,
  SiVercel,
  SiExpo,
  SiOpencv,
  SiPandas,
  SiNumpy,
  SiScikitlearn,
  SiSupabase,
  SiRender,
  SiNestjs,
  SiExpress,
  SiLangchain,
  SiTailwindcss,
  SiJsonwebtokens,
  SiZod,
  SiNodedotjs,
  SiSqlalchemy,
  SiClickhouse,
  SiGooglegemini,
  SiTanstack,
} from '@icons-pack/react-simple-icons';
import {
  Cloud,
  Brain,
  Database,
  GitBranch,
  Server,
  KeyRound,
  Waypoints,
  Boxes,
  BarChart3,
  ShieldCheck,
  FileJson,
  Layers,
  Radio,
  Sparkles,
  TestTube,
} from 'lucide-react';

type IconComp = React.ComponentType<{ size?: number; className?: string; title?: string }>;

function wrapSimpleIcon(Icon: IconComp): IconComp {
  return function Wrapped({ size = 20, className }) {
    return <Icon size={size} className={className} />;
  };
}

// Exact-match brand icons.
const BRAND_MAP: Record<string, IconComp> = {
  python: wrapSimpleIcon(SiPython),
  typescript: wrapSimpleIcon(SiTypescript),
  postgresql: wrapSimpleIcon(SiPostgresql),
  postgres: wrapSimpleIcon(SiPostgresql),
  docker: wrapSimpleIcon(SiDocker),
  'next.js': wrapSimpleIcon(SiNextdotjs),
  'next.js 14': wrapSimpleIcon(SiNextdotjs),
  'next.js (app router)': wrapSimpleIcon(SiNextdotjs),
  pytorch: wrapSimpleIcon(SiPytorch),
  redis: wrapSimpleIcon(SiRedis),
  fastapi: wrapSimpleIcon(SiFastapi),
  'react native': wrapSimpleIcon(SiReact),
  react: wrapSimpleIcon(SiReact),
  gcp: wrapSimpleIcon(SiGooglecloud),
  'google cloud vision ocr': wrapSimpleIcon(SiGooglecloud),
  vercel: wrapSimpleIcon(SiVercel),
  expo: wrapSimpleIcon(SiExpo),
  opencv: wrapSimpleIcon(SiOpencv),
  pandas: wrapSimpleIcon(SiPandas),
  numpy: wrapSimpleIcon(SiNumpy),
  'scikit-learn': wrapSimpleIcon(SiScikitlearn),
  supabase: wrapSimpleIcon(SiSupabase),
  render: wrapSimpleIcon(SiRender),
  neon: wrapSimpleIcon(SiPostgresql),
  nestjs: wrapSimpleIcon(SiNestjs),
  express: wrapSimpleIcon(SiExpress),
  langchain: wrapSimpleIcon(SiLangchain),
  'tailwind css': wrapSimpleIcon(SiTailwindcss),
  "passport.js": wrapSimpleIcon(SiJsonwebtokens),
  'jwt auth (email/password, google oauth, guest sessions)': wrapSimpleIcon(SiJsonwebtokens),
  zod: wrapSimpleIcon(SiZod),
  'node.js': wrapSimpleIcon(SiNodedotjs),
  'sqlalchemy 2.0': wrapSimpleIcon(SiSqlalchemy),
  'clickhouse mcp': wrapSimpleIcon(SiClickhouse),
  'gemini 2.5 flash': wrapSimpleIcon(SiGooglegemini),
  'tanstack query': wrapSimpleIcon(SiTanstack),
};

// Substring heuristics for names with no exact brand icon.
const HEURISTICS: [RegExp, IconComp][] = [
  [/langgraph|multigraph|state graph|directed/i, GitBranch],
  [/pgvector|vector|embed|fastembed|bge-small|pinecone/i, Database],
  [/aws|amazon/i, Cloud],
  [/gan|dcgan|deep learning|face encoding|finbert|neural|ai agent|google adk|vertex ai/i, Brain],
  [/oauth|jwt|auth|policy|redaction|firewall/i, KeyRound],
  [/websocket|canvas|realtime|low-latency/i, Radio],
  [/xgboost|lightgbm|regression|ensemble|score/i, BarChart3],
  [/rest api|swagger|server|fastapi|microservice/i, Server],
  [/typeorm|prisma|alembic|migration/i, FileJson],
  [/zustand|state management/i, Layers],
  [/event sourcing|ledger|audit/i, ShieldCheck],
  [/openrouter|llm|model/i, Sparkles],
  [/tanstack|query/i, Waypoints],
  [/playwright|jest|test suite|vitest/i, TestTube],
];

function normalize(name: string) {
  return name.trim().toLowerCase();
}

export function getTechIcon(name: string): IconComp {
  const key = normalize(name);
  if (BRAND_MAP[key]) return BRAND_MAP[key];
  for (const [pattern, Icon] of HEURISTICS) {
    if (pattern.test(name)) return Icon;
  }
  return Boxes;
}

/** A single pictogram tile: icon + label, no border, used in grids. */
export function TechTile({ name, size = 'md' }: { name: string; size?: 'sm' | 'md' }) {
  const Icon = getTechIcon(name);
  const iconSize = size === 'sm' ? 18 : 24;
  return (
    <div
      className="group flex flex-col items-center justify-center gap-1.5 text-center px-1"
      title={name}
    >
      <div
        className={`flex items-center justify-center rounded-lg text-[var(--text-secondary)] group-hover:text-[var(--accent)] transition-colors ${
          size === 'sm' ? 'w-8 h-8' : 'w-11 h-11'
        }`}
      >
        <Icon size={iconSize} className="text-current" />
      </div>
      <span className="text-[11px] leading-tight text-[var(--text-muted)] group-hover:text-[var(--text-secondary)] transition-colors">
        {name}
      </span>
    </div>
  );
}

/** Compact inline row of icons only (no labels), for cards. Tooltip on hover via title. */
export function TechIconRow({ names, size = 16 }: { names: string[]; size?: number }) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      {names.map((n) => {
        const Icon = getTechIcon(n);
        return (
          <span
            key={n}
            title={n}
            className="flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors"
          >
            <Icon size={size} className="text-current" />
          </span>
        );
      })}
    </div>
  );
}
