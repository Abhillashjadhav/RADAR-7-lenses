import React, { useState, useEffect } from 'react';
import type { RadarClock, Urgency } from '../types';

interface Props {
  clock: RadarClock;
  index: number;
}

const URGENCY_CONFIG: Record<
  Urgency,
  { border: string; badgeBg: string; badgeText: string; badgeBorder: string; dotColor: string; labelColor: string }
> = {
  CRITICAL: {
    border: '#DC2626',
    badgeBg: 'rgba(220, 38, 38, 0.18)',
    badgeText: '#FCA5A5',
    badgeBorder: 'rgba(220, 38, 38, 0.45)',
    dotColor: '#DC2626',
    labelColor: '#F87171',
  },
  ELEVATED: {
    border: '#D97706',
    badgeBg: 'rgba(217, 119, 6, 0.18)',
    badgeText: '#FCD34D',
    badgeBorder: 'rgba(217, 119, 6, 0.45)',
    dotColor: '#D97706',
    labelColor: '#FBBF24',
  },
  MONITOR: {
    border: '#16A34A',
    badgeBg: 'rgba(22, 163, 74, 0.18)',
    badgeText: '#86EFAC',
    badgeBorder: 'rgba(22, 163, 74, 0.45)',
    dotColor: '#16A34A',
    labelColor: '#4ADE80',
  },
};

const LENS_COLORS: Record<string, { bg: string; text: string }> = {
  'Economic/Financial': { bg: 'rgba(59, 130, 246, 0.15)', text: '#93C5FD' },
  'Geopolitical': { bg: 'rgba(139, 92, 246, 0.15)', text: '#C4B5FD' },
  'Market Competition': { bg: 'rgba(236, 72, 153, 0.15)', text: '#F9A8D4' },
  'Logistics & Transport': { bg: 'rgba(20, 184, 166, 0.15)', text: '#5EEAD4' },
  'Catastrophic/Systemic': { bg: 'rgba(239, 68, 68, 0.15)', text: '#FCA5A5' },
  'Labor & Social': { bg: 'rgba(234, 179, 8, 0.15)', text: '#FDE047' },
  'Multi-tier Supplier Viability': { bg: 'rgba(249, 115, 22, 0.15)', text: '#FDBA74' },
  'Infrastructure': { bg: 'rgba(75, 85, 99, 0.3)', text: '#9CA3AF' },
  'Technology/Cyber': { bg: 'rgba(16, 185, 129, 0.15)', text: '#6EE7B7' },
};

function getDaysRemaining(target: Date): number {
  const now = new Date();
  const diff = target.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

function formatDaysRemaining(days: number, urgency: Urgency): string {
  if (urgency === 'MONITOR') return 'Structural';
  if (days < 0) return `${Math.abs(days)}d elapsed`;
  if (days === 0) return 'TODAY';
  return `${days}d`;
}

const ClockCard: React.FC<Props> = ({ clock, index }) => {
  const [days, setDays] = useState(() => getDaysRemaining(clock.deadlineDate));
  const cfg = URGENCY_CONFIG[clock.urgency];

  useEffect(() => {
    const timer = setInterval(() => {
      setDays(getDaysRemaining(clock.deadlineDate));
    }, 60000);
    return () => clearInterval(timer);
  }, [clock.deadlineDate]);

  const daysLabel = formatDaysRemaining(days, clock.urgency);
  const isElapsed = days < 0;

  return (
    <div
      className="relative rounded-lg overflow-hidden"
      style={{
        backgroundColor: '#1A1D2E',
        borderLeft: `3px solid ${cfg.border}`,
        border: `1px solid #2A2D3E`,
        borderLeftWidth: '3px',
        borderLeftColor: cfg.border,
      }}
    >
      {/* Top row: clock number + name + urgency badge + countdown */}
      <div className="flex items-start justify-between px-3.5 pt-3 pb-2">
        <div className="flex items-start gap-2.5 flex-1 min-w-0">
          {/* Clock number */}
          <div
            className="flex-shrink-0 w-5 h-5 rounded flex items-center justify-center text-xxs font-bold mt-0.5"
            style={{
              backgroundColor: 'rgba(30, 58, 95, 0.6)',
              color: '#64748B',
              fontSize: '0.6rem',
            }}
          >
            {index + 1}
          </div>
          <div className="flex-1 min-w-0">
            <div
              className="font-semibold leading-snug text-sm"
              style={{ color: '#E2E8F0', fontSize: '0.82rem' }}
            >
              {clock.name}
            </div>
            <div
              className="text-xs mt-0.5 font-mono"
              style={{ color: '#64748B', fontSize: '0.62rem' }}
            >
              {clock.deadline}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0 ml-2">
          {/* Urgency badge */}
          <div
            className="px-2 py-0.5 rounded text-xxs font-bold tracking-wider flex items-center gap-1"
            style={{
              backgroundColor: cfg.badgeBg,
              border: `1px solid ${cfg.badgeBorder}`,
              color: cfg.badgeText,
              fontSize: '0.6rem',
              letterSpacing: '0.08em',
            }}
          >
            <div
              className="w-1.5 h-1.5 rounded-full"
              style={{
                backgroundColor: cfg.dotColor,
                animation: clock.urgency === 'CRITICAL' ? 'pulse 2s infinite' : 'none',
              }}
            />
            {clock.urgency}
          </div>

          {/* Countdown */}
          <div
            className="px-2 py-0.5 rounded font-mono font-bold text-center min-w-[3rem]"
            style={{
              backgroundColor: isElapsed
                ? 'rgba(100, 116, 139, 0.15)'
                : clock.urgency === 'CRITICAL'
                ? 'rgba(220, 38, 38, 0.12)'
                : clock.urgency === 'ELEVATED'
                ? 'rgba(217, 119, 6, 0.12)'
                : 'rgba(22, 163, 74, 0.12)',
              color: isElapsed ? '#64748B' : cfg.labelColor,
              fontSize: '0.7rem',
              border: `1px solid ${isElapsed ? '#2A2D3E' : cfg.badgeBorder}`,
            }}
          >
            {daysLabel}
          </div>
        </div>
      </div>

      {/* Lens tags */}
      <div className="flex flex-wrap gap-1.5 px-3.5 pb-2">
        {clock.lenses.map((lens) => {
          const lensStyle = LENS_COLORS[lens] || { bg: 'rgba(75, 85, 99, 0.2)', text: '#9CA3AF' };
          return (
            <span
              key={lens}
              className="px-2 py-0.5 rounded-full text-xxs font-medium"
              style={{
                backgroundColor: lensStyle.bg,
                color: lensStyle.text,
                fontSize: '0.58rem',
                border: `1px solid ${lensStyle.text}22`,
              }}
            >
              {lens}
            </span>
          );
        })}
      </div>

      {/* Summary */}
      <div
        className="px-3.5 pb-2 text-xs leading-relaxed"
        style={{ color: '#94A3B8', fontSize: '0.72rem', lineHeight: '1.5' }}
      >
        {clock.summary}
      </div>

      {/* Signal section */}
      <div
        className="mx-3.5 mb-3 px-3 py-2 rounded"
        style={{
          backgroundColor: 'rgba(30, 58, 95, 0.3)',
          border: '1px solid rgba(30, 58, 95, 0.6)',
        }}
      >
        <div
          className="text-xxs font-bold tracking-wider mb-1 flex items-center gap-1.5"
          style={{ color: '#3B82F6', fontSize: '0.58rem', letterSpacing: '0.1em' }}
        >
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M5 1L6.5 4H9L6.8 6L7.5 9L5 7.5L2.5 9L3.2 6L1 4H3.5L5 1Z" fill="#3B82F6" />
          </svg>
          RADAR SIGNAL
        </div>
        <div
          className="text-xs leading-relaxed"
          style={{ color: '#CBD5E1', fontSize: '0.68rem', lineHeight: '1.45' }}
        >
          {clock.signal}
        </div>
      </div>
    </div>
  );
};

export default ClockCard;
