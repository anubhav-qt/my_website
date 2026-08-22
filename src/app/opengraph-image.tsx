
import { ImageResponse } from 'next/og';

export const alt = 'Anubhav Joshi — Systems, Backend & AI Infrastructure';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: '#0c0e14',
          color: '#f8fafc',
          padding: '60px 70px',
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        {/* Top Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                backgroundColor: '#d97706',
              }}
            />
            <span style={{ fontSize: '24px', fontWeight: 700, letterSpacing: '-0.02em', color: '#f8fafc' }}>
              Anubhav Joshi
            </span>
            <span style={{ fontSize: '20px', color: '#94a3b8', marginLeft: '8px' }}>
              / systems &amp; infra
            </span>
          </div>

          <div
            style={{
              display: 'flex',
              padding: '6px 16px',
              borderRadius: '9999px',
              backgroundColor: 'rgba(217, 119, 6, 0.15)',
              border: '1px solid rgba(217, 119, 6, 0.4)',
              color: '#f59e0b',
              fontSize: '16px',
              fontWeight: 600,
            }}
          >
            The Determinism Wall
          </div>
        </div>

        {/* Middle Core Thesis */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '960px' }}>
          <div
            style={{
              fontSize: '44px',
              fontWeight: 800,
              lineHeight: 1.15,
              letterSpacing: '-0.03em',
              color: '#ffffff',
            }}
          >
            I draw a hard line between what a system must prove and what it&apos;s allowed to generate.
          </div>
          <div
            style={{
              fontSize: '24px',
              lineHeight: 1.4,
              color: '#94a3b8',
            }}
          >
            CQRS Generation Pipelines · Deterministic Scoring Walls · State Multigraphs
          </div>
        </div>

        {/* Bottom Metrics Bar */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderTop: '1px solid rgba(255, 255, 255, 0.12)',
            paddingTop: '32px',
          }}
        >
          <div style={{ display: 'flex', gap: '48px' }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '14px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Read Latency
              </span>
              <span style={{ fontSize: '26px', fontWeight: 700, color: '#f59e0b' }}>
                &lt; 50ms Swipe
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '14px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Corpus Scale
              </span>
              <span style={{ fontSize: '26px', fontWeight: 700, color: '#10b981' }}>
                5,004 Cards
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '14px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Architecture
              </span>
              <span style={{ fontSize: '26px', fontWeight: 700, color: '#60a5fa' }}>
                33 ADRs Written
              </span>
            </div>
          </div>

          <div style={{ fontSize: '18px', color: '#64748b' }}>
            anubhavqt.vercel.app
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
