import React from 'react';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
} from 'recharts';
import { RADAR_CLOCKS } from '../data/clocks';
import { ALL_LENSES } from '../data/lenses';
import type { Urgency } from '../types';

const URGENCY_COLOR: Record<Urgency, string> = {
  CRITICAL: '#DC2626',
  ELEVATED: '#D97706',
  MONITOR: '#16A34A',
};

const URGENCY_BG: Record<Urgency, string> = {
  CRITICAL: 'rgba(220,38,38,0.12)',
  ELEVATED: 'rgba(217,119,6,0.12)',
  MONITOR: 'rgba(22,163,74,0.12)',
};

const LensFramework: React.FC = () => {
  const radarData = ALL_LENSES.map((lens) => ({
    subject: lens.abbr,
    value: RADAR_CLOCKS.filter((c) => c.lenses.includes(lens.name)).length,
    fullMark: 7,
  }));

  return (
    <div className="flex flex-col h-full" style={{ backgroundColor: '#0F1117' }}>
      {/* Section header */}
      <div
        className="flex items-center justify-between px-4 py-2.5 flex-shrink-0 border-b"
        style={{ borderColor: '#1E3A5F', backgroundColor: '#0B0D16' }}
      >
        <div>
          <div
            className="font-bold tracking-widest"
            style={{ color: '#3B82F6', fontSize: '0.62rem', letterSpacing: '0.16em' }}
          >
            ANALYTICAL LENS FRAMEWORK
          </div>
          <div className="mt-0.5" style={{ color: '#374151', fontSize: '0.58rem' }}>
            Each clock is filtered through relevant lenses — revealing which supply chain domains are exposed
          </div>
        </div>
        <div
          className="px-2.5 py-1 rounded"
          style={{
            backgroundColor: 'rgba(30,58,95,0.3)',
            border: '1px solid #1E3A5F',
            color: '#4B5563',
            fontSize: '0.58rem',
          }}
        >
          9 lenses · 7 clocks
        </div>
      </div>

      {/* Two-column body */}
      <div className="flex flex-1 overflow-hidden">
        {/* ── LEFT: Radar chart ── */}
        <div
          className="flex flex-col p-3 border-r flex-shrink-0"
          style={{ width: '36%', borderColor: '#1E3A5F' }}
        >
          <div
            className="font-bold tracking-wider mb-1 flex-shrink-0"
            style={{ color: '#374151', fontSize: '0.52rem', letterSpacing: '0.12em' }}
          >
            SIGNAL INTENSITY BY LENS
          </div>

          {/* Radar */}
          <div className="flex-1" style={{ minHeight: '130px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart
                data={radarData}
                margin={{ top: 10, right: 22, bottom: 10, left: 22 }}
              >
                <PolarGrid stroke="#1E3A5F" strokeDasharray="3 3" />
                <PolarAngleAxis
                  dataKey="subject"
                  tick={{ fill: '#64748B', fontSize: 8, fontWeight: 700 }}
                  tickLine={false}
                />
                <PolarRadiusAxis
                  angle={90}
                  domain={[0, 7]}
                  tickCount={4}
                  tick={{ fill: '#1E3A5F', fontSize: 7 }}
                  axisLine={{ stroke: '#1E3A5F' }}
                />
                <Radar
                  name="Active Signals"
                  dataKey="value"
                  stroke="#3B82F6"
                  fill="#1E3A5F"
                  fillOpacity={0.55}
                  strokeWidth={2}
                  dot={{ fill: '#60A5FA', r: 3, strokeWidth: 0 }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Sorted lens signal counts */}
          <div className="mt-1 space-y-1 flex-shrink-0">
            {[...ALL_LENSES]
              .sort(
                (a, b) =>
                  RADAR_CLOCKS.filter((c) => c.lenses.includes(b.name)).length -
                  RADAR_CLOCKS.filter((c) => c.lenses.includes(a.name)).length,
              )
              .slice(0, 5)
              .map((lens) => {
                const count = RADAR_CLOCKS.filter((c) =>
                  c.lenses.includes(lens.name),
                ).length;
                const pct = (count / 7) * 100;
                return (
                  <div key={lens.name}>
                    <div className="flex items-center justify-between mb-0.5">
                      <div className="flex items-center gap-1.5">
                        <div
                          className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                          style={{ backgroundColor: lens.color }}
                        />
                        <span style={{ color: '#4B5563', fontSize: '0.58rem' }}>
                          {lens.name}
                        </span>
                      </div>
                      <span
                        className="font-mono font-bold"
                        style={{ color: lens.color, fontSize: '0.62rem' }}
                      >
                        {count}
                      </span>
                    </div>
                    <div
                      className="h-1 rounded-full overflow-hidden"
                      style={{ backgroundColor: 'rgba(30,58,95,0.4)' }}
                    >
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${pct}%`,
                          backgroundColor: lens.color,
                          opacity: 0.7,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

        {/* ── RIGHT: Activation Matrix + Lens legend ── */}
        <div className="flex-1 overflow-auto p-3">
          {/* Matrix label */}
          <div
            className="font-bold tracking-wider mb-2 flex-shrink-0"
            style={{ color: '#374151', fontSize: '0.52rem', letterSpacing: '0.12em' }}
          >
            CLOCK × LENS ACTIVATION MATRIX — filled cell = that lens is active for that clock
          </div>

          <div style={{ minWidth: '420px' }}>
            {/* Column headers: lens abbr badges */}
            <div
              className="flex items-end mb-1.5"
              style={{ paddingLeft: '100px', gap: '3px' }}
            >
              {ALL_LENSES.map((lens) => (
                <div
                  key={lens.name}
                  className="flex items-center justify-center rounded flex-shrink-0"
                  style={{
                    width: '30px',
                    height: '28px',
                    backgroundColor: lens.bgColor,
                    border: `1px solid ${lens.borderColor}`,
                    cursor: 'default',
                  }}
                  title={`${lens.name}: ${lens.description}`}
                >
                  <span
                    style={{
                      color: lens.color,
                      fontSize: '0.44rem',
                      fontWeight: 800,
                      letterSpacing: '0.02em',
                    }}
                  >
                    {lens.abbr}
                  </span>
                </div>
              ))}
            </div>

            {/* Matrix rows */}
            {RADAR_CLOCKS.map((clock) => {
              const activeLenses = new Set(clock.lenses);
              return (
                <div
                  key={clock.id}
                  className="flex items-center mb-1"
                  style={{ gap: '3px' }}
                >
                  {/* Clock label cell */}
                  <div
                    className="flex items-center gap-1.5 flex-shrink-0"
                    style={{ width: '98px' }}
                  >
                    {/* Urgency bar */}
                    <div
                      className="flex-shrink-0 w-1 rounded-sm"
                      style={{
                        height: '22px',
                        backgroundColor: URGENCY_COLOR[clock.urgency],
                      }}
                    />
                    {/* Urgency dot */}
                    <div
                      className="flex-shrink-0 w-4 h-4 rounded flex items-center justify-center"
                      style={{
                        backgroundColor: URGENCY_BG[clock.urgency],
                        border: `1px solid ${URGENCY_COLOR[clock.urgency]}40`,
                      }}
                    >
                      <span
                        style={{
                          color: URGENCY_COLOR[clock.urgency],
                          fontSize: '0.5rem',
                          fontWeight: 900,
                        }}
                      >
                        C{clock.id}
                      </span>
                    </div>
                    <span
                      style={{
                        color: '#64748B',
                        fontSize: '0.58rem',
                        fontWeight: 500,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        maxWidth: '64px',
                      }}
                      title={clock.name}
                    >
                      {clock.name}
                    </span>
                  </div>

                  {/* Lens cells */}
                  {ALL_LENSES.map((lens) => {
                    const isActive = activeLenses.has(lens.name);
                    return (
                      <div
                        key={lens.name}
                        className="flex items-center justify-center rounded-sm flex-shrink-0"
                        style={{
                          width: '30px',
                          height: '22px',
                          backgroundColor: isActive
                            ? lens.bgColor
                            : 'rgba(10,12,22,0.7)',
                          border: `1px solid ${
                            isActive ? lens.borderColor : '#12151F'
                          }`,
                          transition: 'background-color 0.15s',
                        }}
                        title={
                          isActive
                            ? `Clock ${clock.id} → ${lens.name}`
                            : undefined
                        }
                      >
                        {isActive && (
                          <div
                            className="rounded-full"
                            style={{
                              width: '8px',
                              height: '8px',
                              backgroundColor: lens.color,
                              boxShadow: `0 0 5px ${lens.color}90`,
                            }}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>

          {/* ── Lens definitions grid ── */}
          <div
            className="mt-3 pt-2.5 border-t"
            style={{ borderColor: '#1E3A5F' }}
          >
            <div
              className="font-bold tracking-wider mb-2"
              style={{ color: '#374151', fontSize: '0.5rem', letterSpacing: '0.12em' }}
            >
              LENS DEFINITIONS — what each analytical lens examines
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '8px 16px',
              }}
            >
              {ALL_LENSES.map((lens) => {
                const count = RADAR_CLOCKS.filter((c) =>
                  c.lenses.includes(lens.name),
                ).length;
                return (
                  <div key={lens.name} className="flex items-start gap-2">
                    {/* Badge */}
                    <div
                      className="flex-shrink-0 flex items-center justify-center rounded"
                      style={{
                        width: '26px',
                        height: '22px',
                        backgroundColor: lens.bgColor,
                        border: `1px solid ${lens.borderColor}`,
                        marginTop: '1px',
                      }}
                    >
                      <span
                        style={{
                          color: lens.color,
                          fontSize: '0.42rem',
                          fontWeight: 800,
                        }}
                      >
                        {lens.abbr}
                      </span>
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div
                        className="flex items-center gap-1"
                        style={{ marginBottom: '1px' }}
                      >
                        <span
                          style={{
                            color: '#94A3B8',
                            fontSize: '0.6rem',
                            fontWeight: 600,
                            lineHeight: '1.2',
                          }}
                        >
                          {lens.name}
                        </span>
                        <span
                          className="font-mono font-bold"
                          style={{
                            color: lens.color,
                            fontSize: '0.55rem',
                            opacity: 0.8,
                          }}
                        >
                          ×{count}
                        </span>
                      </div>
                      <div
                        style={{
                          color: '#374151',
                          fontSize: '0.54rem',
                          lineHeight: '1.35',
                        }}
                      >
                        {lens.description}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LensFramework;
