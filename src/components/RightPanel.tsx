import React, { useState } from 'react';
import { RADAR_CLOCKS, OPERATOR_ACTIONS } from '../data/clocks';
import type { ImpactBucket } from '../types';

const BUCKET_COLORS: Record<ImpactBucket, { color: string; bg: string; border: string }> = {
  Delivery: {
    color: '#818CF8',
    bg: 'rgba(99, 102, 241, 0.15)',
    border: 'rgba(99, 102, 241, 0.4)',
  },
  Compliance: {
    color: '#F472B6',
    bg: 'rgba(236, 72, 153, 0.15)',
    border: 'rgba(236, 72, 153, 0.4)',
  },
  Cost: {
    color: '#FBBF24',
    bg: 'rgba(245, 158, 11, 0.15)',
    border: 'rgba(245, 158, 11, 0.4)',
  },
};

function getDaysRemaining(target: Date): number {
  const now = new Date();
  return Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

const HOW_TO_READ = [
  {
    step: '①',
    title: 'CLOCKS',
    body: 'Each clock is a real disruption event with a countdown timer. When it runs out, a forced supply chain decision occurs — with or without your preparation.',
    color: '#DC2626',
    bg: 'rgba(220,38,38,0.08)',
    border: 'rgba(220,38,38,0.2)',
  },
  {
    step: '②',
    title: 'LENSES',
    body: 'Each clock activates 2–3 analytical lenses — domains where the impact cascades. The matrix (centre panel) shows which lenses each risk touches simultaneously.',
    color: '#3B82F6',
    bg: 'rgba(59,130,246,0.08)',
    border: 'rgba(59,130,246,0.2)',
  },
  {
    step: '③',
    title: 'SIGNALS',
    body: 'Each clock ends with a RADAR Signal — a specific, time-bound action for your team. Operator Actions (below) aggregate the critical ones into a checklist.',
    color: '#16A34A',
    bg: 'rgba(22,163,74,0.08)',
    border: 'rgba(22,163,74,0.2)',
  },
];

const RightPanel: React.FC = () => {
  const [checkedActions, setCheckedActions] = useState<Record<number, boolean>>({});
  const criticalClocks = RADAR_CLOCKS.filter((c) => c.urgency === 'CRITICAL');
  const maxDays = 30;

  const toggleAction = (id: number) =>
    setCheckedActions((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Panel header */}
      <div
        className="flex items-center justify-between px-4 py-2.5 border-b flex-shrink-0"
        style={{ borderColor: '#1E3A5F', backgroundColor: '#0B0D16' }}
      >
        <div>
          <div
            className="font-bold tracking-widest"
            style={{ color: '#3B82F6', fontSize: '0.62rem', letterSpacing: '0.16em' }}
          >
            IMPACT SUMMARY
          </div>
          <div className="mt-0.5" style={{ color: '#374151', fontSize: '0.58rem' }}>
            Decision support &amp; operator actions
          </div>
        </div>
      </div>

      <div
        className="flex-1 overflow-y-auto p-3 flex flex-col gap-3"
        style={{ scrollbarWidth: 'thin', scrollbarColor: '#2A2D3E #0F1117' }}
      >
        {/* ══ HOW TO READ THIS DASHBOARD ══ */}
        <div
          className="rounded-lg overflow-hidden"
          style={{ border: '1px solid #1E3A5F', backgroundColor: '#1A1D2E' }}
        >
          {/* Card header */}
          <div
            className="flex items-center gap-2 px-3 py-2 border-b"
            style={{ borderColor: '#1E3A5F', backgroundColor: 'rgba(30,58,95,0.3)' }}
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <circle cx="6" cy="6" r="5" stroke="#3B82F6" strokeWidth="1.2" />
              <line x1="6" y1="5" x2="6" y2="9" stroke="#3B82F6" strokeWidth="1.2" strokeLinecap="round" />
              <circle cx="6" cy="3.5" r="0.75" fill="#3B82F6" />
            </svg>
            <span
              className="font-bold tracking-wider"
              style={{ color: '#3B82F6', fontSize: '0.6rem', letterSpacing: '0.12em' }}
            >
              HOW TO READ THIS DASHBOARD
            </span>
          </div>

          <div className="p-3 space-y-2.5">
            {HOW_TO_READ.map((item) => (
              <div
                key={item.step}
                className="flex gap-2.5 rounded p-2.5"
                style={{
                  backgroundColor: item.bg,
                  border: `1px solid ${item.border}`,
                }}
              >
                {/* Step number */}
                <div
                  className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center font-bold"
                  style={{
                    backgroundColor: item.bg,
                    border: `1.5px solid ${item.border}`,
                    color: item.color,
                    fontSize: '0.72rem',
                  }}
                >
                  {item.step}
                </div>
                <div>
                  <div
                    className="font-bold mb-1"
                    style={{ color: item.color, fontSize: '0.65rem', letterSpacing: '0.08em' }}
                  >
                    {item.title}
                  </div>
                  <div
                    style={{
                      color: '#94A3B8',
                      fontSize: '0.68rem',
                      lineHeight: '1.5',
                    }}
                  >
                    {item.body}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ══ DECISION WINDOW ══ */}
        <div
          className="rounded-lg p-3.5"
          style={{ backgroundColor: '#1A1D2E', border: '1px solid #2A2D3E' }}
        >
          <div className="flex items-center justify-between mb-3">
            <div
              className="font-bold tracking-widest"
              style={{ color: '#3B82F6', fontSize: '0.6rem', letterSpacing: '0.14em' }}
            >
              DECISION WINDOW
            </div>
            <div style={{ color: '#4B5563', fontSize: '0.58rem' }}>
              30-day horizon · CRITICAL only
            </div>
          </div>

          <div className="space-y-3">
            {criticalClocks.map((clock) => {
              const days = getDaysRemaining(clock.deadlineDate);
              const isElapsed = days < 0;
              const pct = Math.max(0, Math.min(100, (days / maxDays) * 100));
              const label = isElapsed ? `${Math.abs(days)}d ago` : `${days}d`;

              return (
                <div key={clock.id}>
                  <div className="flex items-center justify-between mb-1">
                    <div
                      className="flex-1 pr-2 font-medium"
                      style={{ color: '#CBD5E1', fontSize: '0.68rem' }}
                    >
                      {clock.name}
                    </div>
                    <div
                      className="font-mono font-bold flex-shrink-0"
                      style={{
                        color: isElapsed ? '#64748B' : '#F87171',
                        fontSize: '0.7rem',
                      }}
                    >
                      {label}
                    </div>
                  </div>
                  <div
                    className="relative h-2 rounded-full overflow-hidden"
                    style={{ backgroundColor: 'rgba(220,38,38,0.1)' }}
                  >
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: isElapsed ? '100%' : `${pct}%`,
                        background: isElapsed
                          ? '#374151'
                          : 'linear-gradient(90deg, #DC2626, #F87171)',
                        boxShadow: isElapsed
                          ? 'none'
                          : '0 0 8px rgba(220,38,38,0.6)',
                      }}
                    />
                  </div>
                  <div className="flex justify-between mt-0.5">
                    <span style={{ color: '#1F2937', fontSize: '0.52rem' }}>Today</span>
                    <span style={{ color: '#1F2937', fontSize: '0.52rem' }}>+30d</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ══ OPERATOR ACTIONS ══ */}
        <div
          className="rounded-lg p-3.5"
          style={{ backgroundColor: '#1A1D2E', border: '1px solid #2A2D3E' }}
        >
          <div className="flex items-center justify-between mb-3">
            <div
              className="font-bold tracking-widest"
              style={{ color: '#3B82F6', fontSize: '0.6rem', letterSpacing: '0.14em' }}
            >
              OPERATOR ACTIONS REQUIRED
            </div>
            <div style={{ color: '#4B5563', fontSize: '0.58rem' }}>
              Critical clocks only
            </div>
          </div>

          <div className="space-y-2.5">
            {OPERATOR_ACTIONS.map((action) => {
              const checked = checkedActions[action.id] || false;
              const bucketCfg = BUCKET_COLORS[action.impactBucket];

              return (
                <div
                  key={action.id}
                  className="flex items-start gap-2.5 p-2.5 rounded cursor-pointer"
                  style={{
                    backgroundColor: checked
                      ? 'rgba(22,163,74,0.05)'
                      : 'rgba(30,58,95,0.15)',
                    border: `1px solid ${
                      checked ? 'rgba(22,163,74,0.2)' : '#2A2D3E'
                    }`,
                  }}
                  onClick={() => toggleAction(action.id)}
                >
                  {/* Checkbox */}
                  <div
                    className="flex-shrink-0 w-4 h-4 rounded flex items-center justify-center mt-0.5"
                    style={{
                      backgroundColor: checked ? '#16A34A' : 'transparent',
                      border: `1.5px solid ${checked ? '#16A34A' : '#374151'}`,
                    }}
                  >
                    {checked && (
                      <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                        <path
                          d="M1 4L3.5 6.5L9 1"
                          stroke="white"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div
                      style={{
                        color: checked ? '#4B5563' : '#CBD5E1',
                        fontSize: '0.7rem',
                        lineHeight: '1.45',
                        textDecoration: checked ? 'line-through' : 'none',
                      }}
                    >
                      {action.text}
                    </div>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span
                        className="px-2 py-0.5 rounded-full font-bold"
                        style={{
                          backgroundColor: bucketCfg.bg,
                          color: bucketCfg.color,
                          border: `1px solid ${bucketCfg.border}`,
                          fontSize: '0.55rem',
                          letterSpacing: '0.07em',
                        }}
                      >
                        {action.impactBucket.toUpperCase()}
                      </span>
                      <span style={{ color: '#374151', fontSize: '0.58rem' }}>
                        Clock {action.clockId}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Progress bar */}
          <div className="mt-3 pt-3" style={{ borderTop: '1px solid #2A2D3E' }}>
            <div className="flex items-center justify-between mb-1.5">
              <span style={{ color: '#4B5563', fontSize: '0.6rem' }}>
                Actions acknowledged
              </span>
              <span
                className="font-mono font-bold"
                style={{ color: '#94A3B8', fontSize: '0.65rem' }}
              >
                {Object.values(checkedActions).filter(Boolean).length} /{' '}
                {OPERATOR_ACTIONS.length}
              </span>
            </div>
            <div
              className="h-1.5 rounded-full overflow-hidden"
              style={{ backgroundColor: '#1E3A5F' }}
            >
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${
                    (Object.values(checkedActions).filter(Boolean).length /
                      OPERATOR_ACTIONS.length) *
                    100
                  }%`,
                  background: 'linear-gradient(90deg, #16A34A, #4ADE80)',
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RightPanel;
