import React from 'react';
import { RADAR_CLOCKS } from '../data/clocks';
import { ALL_LENSES } from '../data/lenses';

const PurposeStrip: React.FC = () => {
  const criticalCount = RADAR_CLOCKS.filter((c) => c.urgency === 'CRITICAL').length;
  const elevatedCount = RADAR_CLOCKS.filter((c) => c.urgency === 'ELEVATED').length;

  return (
    <div
      className="flex items-center flex-shrink-0"
      style={{
        backgroundColor: '#0A0C16',
        borderBottom: '2px solid #1E3A5F',
        padding: '10px 24px',
        gap: '28px',
        minHeight: '56px',
      }}
    >
      {/* Icon + mission statement */}
      <div className="flex items-start gap-3 flex-1 min-w-0">
        {/* Decorative bracket */}
        <div
          className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded"
          style={{ backgroundColor: 'rgba(30,58,95,0.5)', border: '1px solid #1E3A5F' }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="6.5" stroke="#3B82F6" strokeWidth="1" strokeOpacity="0.3" />
            <circle cx="8" cy="8" r="4" stroke="#3B82F6" strokeWidth="1" strokeOpacity="0.5" />
            <circle cx="8" cy="8" r="1.5" stroke="#3B82F6" strokeWidth="1" />
            <line x1="8" y1="2" x2="8" y2="8" stroke="#60A5FA" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>

        <div>
          <div style={{ color: '#E2E8F0', fontSize: '0.75rem', fontWeight: 600, lineHeight: '1.4', marginBottom: '2px' }}>
            <span style={{ color: '#60A5FA' }}>RADAR</span>
            {' '}maps concurrent supply chain disruption events onto a{' '}
            <span style={{ color: '#FBBF24' }}>30-day decision timeline</span>
            {' '}— each risk filtered through{' '}
            <span style={{ color: '#60A5FA' }}>{ALL_LENSES.length} analytical lenses</span>
            {' '}to reveal which supply chain domains are exposed and what action is required.
          </div>
          <div style={{ color: '#374151', fontSize: '0.6rem', lineHeight: '1.3' }}>
            Current view: Aerospace &amp; Defense sector ·{' '}
            <span style={{ color: '#4B5563' }}>Hormuz disruption cascade &amp; agricultural repricing · March 2026</span>
          </div>
        </div>
      </div>

      {/* Stat counters */}
      <div className="flex gap-2 flex-shrink-0">
        {[
          {
            value: String(criticalCount),
            label: 'CRITICAL',
            sub: 'clocks',
            color: '#DC2626',
            bg: 'rgba(220,38,38,0.12)',
            border: 'rgba(220,38,38,0.3)',
            pulse: true,
          },
          {
            value: String(elevatedCount),
            label: 'ELEVATED',
            sub: 'clocks',
            color: '#D97706',
            bg: 'rgba(217,119,6,0.12)',
            border: 'rgba(217,119,6,0.3)',
            pulse: false,
          },
          {
            value: String(ALL_LENSES.length),
            label: 'LENSES',
            sub: 'active',
            color: '#3B82F6',
            bg: 'rgba(30,58,95,0.4)',
            border: 'rgba(59,130,246,0.3)',
            pulse: false,
          },
          {
            value: '30',
            label: 'DAY',
            sub: 'horizon',
            color: '#94A3B8',
            bg: 'rgba(30,58,95,0.2)',
            border: 'rgba(30,58,95,0.5)',
            pulse: false,
          },
        ].map((s) => (
          <div
            key={s.label}
            className="flex flex-col items-center justify-center rounded"
            style={{
              backgroundColor: s.bg,
              border: `1px solid ${s.border}`,
              padding: '6px 12px',
              minWidth: '56px',
            }}
          >
            <div className="flex items-center gap-1">
              {s.pulse && (
                <div
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: s.color, animation: 'pulse 2s infinite' }}
                />
              )}
              <span
                style={{
                  color: s.color,
                  fontSize: '1.2rem',
                  fontWeight: 900,
                  lineHeight: 1,
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                {s.value}
              </span>
            </div>
            <span
              style={{
                color: s.color,
                fontSize: '0.5rem',
                fontWeight: 700,
                letterSpacing: '0.1em',
                opacity: 0.85,
                marginTop: '3px',
              }}
            >
              {s.label}
            </span>
            <span
              style={{
                color: s.color,
                fontSize: '0.48rem',
                opacity: 0.5,
                letterSpacing: '0.06em',
              }}
            >
              {s.sub}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PurposeStrip;
