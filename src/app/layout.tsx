import type { Metadata, Viewport } from 'next';
import Link from 'next/link';
import { Source_Serif_4, Geist, JetBrains_Mono } from 'next/font/google';
import { NavRail } from '@/components/NavRail';
import './globals.css';

const sourceSerif = Source_Serif_4({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

const geist = Geist({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: "Anubhav Joshi — Systems, Backend & The Determinism Wall",
    template: "%s | Anubhav Joshi",
  },
  description:
    'Backend & AI infrastructure engineer. Architectural thesis: drawing a hard line between what must be provable and what is allowed to be generated.',
  authors: [{ name: 'Anubhav Joshi', url: 'https://github.com/anubhav-qt' }],
  metadataBase: new URL('https://anubhavqt.vercel.app'),
  openGraph: {
    title: 'Anubhav Joshi — Systems, Backend & The Determinism Wall',
    description: 'Technical portfolio on CQRS generation pipelines, deterministic scoring walls, and state multigraphs.',
    type: 'website',
    url: 'https://anubhavqt.vercel.app',
    siteName: 'Anubhav Joshi Engineering Portfolio',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Anubhav Joshi — Systems & The Determinism Wall',
    description: 'Drawing a hard line between what must be provable and what is allowed to be generated.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#faf7f1' },
    { media: '(prefers-color-scheme: dark)', color: '#15130f' },
  ],
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Anubhav Joshi',
  jobTitle: 'Backend Engineer, AI Infrastructure',
  url: 'https://anubhavqt.vercel.app',
  sameAs: [
    'https://github.com/anubhav-qt',
    'https://www.linkedin.com/in/anubhav-qt',
  ],
  alumniOf: {
    '@type': 'EducationalOrganization',
    name: 'Manipal University Jaipur',
  },
  knowsAbout: [
    'Backend Engineering',
    'AI Infrastructure',
    'Distributed Systems',
    'Python',
    'TypeScript',
    'PostgreSQL',
    'CQRS Architecture',
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`h-full antialiased ${sourceSerif.variable} ${geist.variable} ${jetbrainsMono.variable}`}
    >
      <head>
        {/* Anti-FOUC Theme Script */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var storedTheme = localStorage.getItem('theme');
                  var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  if (storedTheme === 'dark' || (!storedTheme && prefersDark)) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col md:flex-row bg-[var(--bg-page)] text-[var(--text-primary)] font-sans selection:bg-[var(--accent)] selection:text-white">
        <NavRail />
        <main className="flex-1 min-w-0 flex flex-col justify-between overflow-x-hidden">
          <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 md:px-8 py-4 md:py-5">
            {children}
          </div>
          <footer className="w-full max-w-5xl mx-auto px-4 sm:px-6 md:px-8 py-4 border-t border-[var(--border-subtle)] text-xs text-[var(--text-muted)] font-mono flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              © 2026 Anubhav Joshi · Systems, Pipelines &amp; Architecture
            </div>
            <div className="flex items-center gap-4">
              <a
                href="https://github.com/anubhav-qt"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[var(--text-primary)] transition-colors"
              >
                github.com/anubhav-qt
              </a>
              <span>·</span>
              <Link href="/work/spoin" className="hover:text-[var(--text-primary)] transition-colors">
                Spoin Flagship
              </Link>
            </div>
          </footer>
        </main>
      </body>
    </html>
  );
}
