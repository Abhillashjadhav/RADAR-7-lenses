import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { RADAR_CLOCKS, OPERATOR_ACTIONS, LENS_COUNTS } from '../data/clocks';
import type { ImpactBucket } from '../types';

const BUCKET_COLORS: Record<ImpactBucket, { color: string; bg: string; border: string }> = {
  Delivery: { color: '#818CF8', bg: 'rgba(99, 102, 241, 0.15)', border: 'rgba(99, 102, 241, 0.4)' },
  Compliance: { color: '#F472B6', bg: 'rgba(236, 72, 153, 0.15)', border: 'rgba(236, 72, 153, 0.4)' },
  Cost: { color: '#FBBF24', bg: 'rgba(245, 158, 11, 0.15)', border: 'rgba(245, 158, 11, 0.4)' },
};

const LENS_BAR_COLORS = [
  '#3B82F6',
  '#14B8A6',
  '#F97316',
  '#8B5CF6',
  '#10B981',
  '#F59E0B',
  '#EF4444',
];

function getDaysRemaining(target: Date): number {
  const now = new Date();
  const diff = target.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ value: number; name: string }> }) => {
  if (active && payload && payload.length) {
    return (
      <div
        className="px-3 py-2 rounded text-xs"
        style={{
          backgroundColor: '#1A1D2E',
          border: '1px solid #2A2D3E',
          color: '#E2E8F0',
          fontSize: '0.7rem',
        }}
      >
        <div style={{ color: '#94A3B8' }}>Active signals</div>
        <div style={{ color: '#3B82F6', fontWeight: 700, fontSize: '1rem' }}>
          {payload[0].value}
        </div>
      </div>
    );
  }
  return null;
};

const RightPanel: React.FC = () => {
  const [checkedActions, setCheckedActions] = useState<Record<number, boolean>>({});

  const criticalClocks = RADAR_CLOCKS.filter((c) => c.urgency === 'CRITICAL');

  // Decision window: max days window from now
  const maxDays = 30;
  const timelineClocks = criticalClocks.map((c) => {
    const days = getDaysRemaining(c.deadlineDate);
    return { ...c, days };
  });

  const toggleAction = (id: number) => {
    setCheckedActions((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Truncate long lens names for chart axis
  const chartData = LENS_COUNTS.map((lc) => ({
    ...lc,
    shortLens:
      lc.lens.length > 16
        ? lc.lens.split('/')[0].trim()
        : lc.lens,
  }));

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Panel header */}
      <div
        className="flex items-center justify-between px-4 py-3 border-b flex-shrink-0"
        style={{ borderColor: '#1E3A5F', backgroundColor: '#0F1117' }}
      >
        <div>
          <div
            className="text-xs font-bold tracking-widest"
            style={{ color: '#3B82F6', fontSize: '0.65rem', letterSpacing: '0.16em' }}
          >
            IMPACT SUMMARY
          </div>
          <div
            className="text-xs mt-0.5"
            style={{ color: '#4B5563', fontSize: '0.6rem' }}
          >
            Decision support view
          </div>
        </div>
      </div>

      <div
        className="flex-1 overflow-y-auto p-3 flex flex-col gap-3"
        style={{ scrollbarWidth: 'thin', scrollbarColor: '#2A2D3E #0F1117' }}
      >
        {/* ── SECTION 1: Decision Window ── */}
        <div
          className="rounded-lg p-3.5"
          style={{ backgroundColor: '#1A1D2E', border: '1px solid #2A2D3E' }}
        >
          <div className="flex items-center justify-between mb-3">
            <div
              className="text-xxs font-bold tracking-widest"
              style={{ color: '#3B82F6', fontSize: '0.6rem', letterSpacing: '0.14em' }}
            >
              DECISION WINDOW
            </div>
            <div
              className="text-xxs"
              style={{ color: '#4B5563', fontSize: '0.58rem' }}
            >
              30-day horizon · CRITICAL only
            </div>
          </div>

          {/* Timeline bar */}
          <div className="space-y-3">
            {timelineClocks.map((clock) => {
              const pct = Math.max(0, Math.min(100, (clock.days / maxDays) * 100));
              const isElapsed = clock.days < 0;
              const label = isElapsed
                ? `${Math.abs(clock.days)}d ago`
                : `${clock.days}d`;

              return (
                <div key={clock.id}>
                  <div className="flex items-center justify-between mb-1">
                    <div
                      className="text-xs font-medium leading-tight flex-1 pr-2"
                      style={{ color: '#CBD5E1', fontSize: '0.68rem' }}
                    >
                      {clock.name}
                    </div>
                    <div
                      className="font-mono font-bold text-xs flex-shrink-0"
                      style={{
                        color: isElapsed ? '#64748B' : '#F87171',
                        fontSize: '0.7rem',
                      }}
                    >
                      {label}
                    </div>
                  </div>
                  {/* Progress track */}
                  <div
                    className="relative h-2 rounded-full w-full overflow-hidden"
                    style={{ backgroundColor: 'rgba(220, 38, 38, 0.1)' }}
                  >
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: isElapsed ? '100%' : `${pct}%`,
                        background: isElapsed
                          ? '#374151'
                          : 'linear-gradient(90deg, #DC2626, #F87171)',
                        boxShadow: isElapsed ? 'none' : '0 0 8px rgba(220, 38, 38, 0.6)',
                      }}
                    />
                    {/* Deadline tick */}
                    {!isElapsed && (
                      <div
                        className="absolute top-0 h-full w-0.5 rounded-full"
                        style={{
                          left: `${pct}%`,
                          backgroundColor: '#FFFFFF',
                          opacity: 0.6,
                        }}
                      />
                    )}
                  </div>
                  <div className="flex justify-between mt-0.5">
                    <span style={{ color: '#374151', fontSize: '0.55rem' }}>Today</span>
                    <span style={{ color: '#374151', fontSize: '0.55rem' }}>+{maxDays}d</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── SECTION 2: Affected Supply Chain Layers ── */}
        <div
          className="rounded-lg p-3.5"
          style={{ backgroundColor: '#1A1D2E', border: '1px solid #2A2D3E' }}
        >
          <div className="flex items-center justify-between mb-3">
            <div
              className="text-xxs font-bold tracking-widest"
              style={{ color: '#3B82F6', fontSize: '0.6rem', letterSpacing: '0.14em' }}
            >
              AFFECTED SUPPLY CHAIN LAYERS
            </div>
            <div
              className="text-xxs"
              style={{ color: '#4B5563', fontSize: '0.58rem' }}
            >
              Active signals by lens
            </div>
          </div>

          <div style={{ width: '100%', height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                layout="vertical"
                margin={{ top: 0, right: 30, left: 0, bottom: 0 }}
                barSize={10}
              >
                <XAxis
                  type="number"
                  domain={[0, 6]}
                  tickCount={7}
                  tick={{ fill: '#374151', fontSize: 9 }}
                  axisLine={{ stroke: '#1E3A5F' }}
                  tickLine={false}
                />
                <YAxis
                  type="category"
                  dataKey="shortLens"
                  width={95}
                  tick={{ fill: '#94A3B8', fontSize: 9.5 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  content={<CustomTooltip />}
                  cursor={{ fill: 'rgba(30, 58, 95, 0.2)' }}
                />
                <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                  {chartData.map((_, i) => (
                    <Cell key={i} fill={LENS_BAR_COLORS[i % LENS_BAR_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Legend */}
          <div className="mt-2 space-y-1">
            {LENS_COUNTS.map((lc, i) => (
              <div key={lc.lens} className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <div
                    className="w-2 h-2 rounded-sm flex-shrink-0"
                    style={{ backgroundColor: LENS_BAR_COLORS[i % LENS_BAR_COLORS.length] }}
                  />
                  <span style={{ color: '#64748B', fontSize: '0.62rem' }}>{lc.lens}</span>
                </div>
                <span
                  className="font-mono font-bold"
                  style={{
                    color: LENS_BAR_COLORS[i % LENS_BAR_COLORS.length],
                    fontSize: '0.65rem',
                  }}
                >
                  {lc.count}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ── SECTION 3: Operator Actions Required ── */}
        <div
          className="rounded-lg p-3.5"
          style={{ backgroundColor: '#1A1D2E', border: '1px solid #2A2D3E' }}
        >
          <div className="flex items-center justify-between mb-3">
            <div
              className="text-xxs font-bold tracking-widest"
              style={{ color: '#3B82F6', fontSize: '0.6rem', letterSpacing: '0.14em' }}
            >
              OPERATOR ACTIONS REQUIRED
            </div>
            <div
              className="text-xxs"
              style={{ color: '#4B5563', fontSize: '0.58rem' }}
            >
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
                  className="flex items-start gap-2.5 p-2.5 rounded cursor-pointer group transition-all"
                  style={{
                    backgroundColor: checked
                      ? 'rgba(22, 163, 74, 0.05)'
                      : 'rgba(30, 58, 95, 0.15)',
                    border: `1px solid ${checked ? 'rgba(22, 163, 74, 0.2)' : '#2A2D3E'}`,
                  }}
                  onClick={() => toggleAction(action.id)}
                >
                  {/* Checkbox */}
                  <div
                    className="flex-shrink-0 w-4 h-4 rounded flex items-center justify-center mt-0.5 transition-all"
                    style={{
                      backgroundColor: checked
                        ? '#16A34A'
                        : 'transparent',
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
                      className="text-xs leading-relaxed"
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
                      {/* Impact bucket tag */}
                      <span
                        className="px-2 py-0.5 rounded-full text-xxs font-bold"
                        style={{
                          backgroundColor: bucketCfg.bg,
                          color: bucketCfg.color,
                          border: `1px solid ${bucketCfg.border}`,
                          fontSize: '0.58rem',
                          letterSpacing: '0.06em',
                        }}
                      >
                        {action.impactBucket.toUpperCase()}
                      </span>
                      {/* Clock reference */}
                      <span style={{ color: '#374151', fontSize: '0.58rem' }}>
                        Clock {action.clockId}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Action completion tracker */}
          <div className="mt-3 pt-3" style={{ borderTop: '1px solid #2A2D3E' }}>
            <div className="flex items-center justify-between mb-1.5">
              <span style={{ color: '#4B5563', fontSize: '0.6rem' }}>Actions acknowledged</span>
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
