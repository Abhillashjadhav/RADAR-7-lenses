import React, { useState } from 'react';

// ── Types ─────────────────────────────────────────────────────────────
type RiskLevel = 'CRITICAL' | 'MODERATE' | 'LOW';
type RiskCategory = 'Geopolitical' | 'Cyber' | 'ESG' | 'Financial';

interface RiskDimension {
  category: RiskCategory;
  score: number;
}

interface Supplier {
  id: string;
  name: string;
  city: string;
  country: string;
  region: string;
  tier: 1 | 2;
  sector: string;
  overallScore: number;
  dimensions: RiskDimension[];
  lastUpdated: string;
}

// ── Helpers ───────────────────────────────────────────────────────────
function riskProfile(score: number): {
  level: RiskLevel;
  text: string;
  bg: string;
  border: string;
  bar: string;
  glow: string;
} {
  if (score >= 70)
    return {
      level: 'CRITICAL',
      text: '#F87171',
      bg: 'rgba(220,38,38,0.12)',
      border: 'rgba(220,38,38,0.35)',
      bar: '#DC2626',
      glow: 'rgba(220,38,38,0.5)',
    };
  if (score >= 40)
    return {
      level: 'MODERATE',
      text: '#FBBF24',
      bg: 'rgba(217,119,6,0.12)',
      border: 'rgba(217,119,6,0.35)',
      bar: '#D97706',
      glow: 'rgba(217,119,6,0.4)',
    };
  return {
    level: 'LOW',
    text: '#4ADE80',
    bg: 'rgba(22,163,74,0.12)',
    border: 'rgba(22,163,74,0.35)',
    bar: '#16A34A',
    glow: 'rgba(22,163,74,0.4)',
  };
}

const CAT_STYLE: Record<RiskCategory, { color: string; bg: string; border: string }> = {
  Geopolitical: {
    color: '#C4B5FD',
    bg: 'rgba(139,92,246,0.15)',
    border: 'rgba(139,92,246,0.4)',
  },
  Cyber: {
    color: '#6EE7B7',
    bg: 'rgba(16,185,129,0.15)',
    border: 'rgba(16,185,129,0.4)',
  },
  ESG: {
    color: '#FDE047',
    bg: 'rgba(234,179,8,0.15)',
    border: 'rgba(234,179,8,0.4)',
  },
  Financial: {
    color: '#60A5FA',
    bg: 'rgba(59,130,246,0.15)',
    border: 'rgba(59,130,246,0.4)',
  },
};

// ── Hardcoded Data ────────────────────────────────────────────────────
const SUPPLIERS: Supplier[] = [
  {
    id: 'winn',
    name: 'Winn',
    city: 'Zhongli',
    country: 'Taiwan',
    region: 'APAC',
    tier: 1,
    sector: 'PCB / Semiconductor',
    overallScore: 87,
    lastUpdated: 'Apr 18, 2026',
    dimensions: [
      { category: 'Geopolitical', score: 92 },
      { category: 'Cyber', score: 74 },
      { category: 'ESG', score: 40 },
      { category: 'Financial', score: 35 },
    ],
  },
  {
    id: 'corevo',
    name: 'Corevo',
    city: 'Eindhoven',
    country: 'Netherlands',
    region: 'EMEA',
    tier: 2,
    sector: 'Electronic Components',
    overallScore: 61,
    lastUpdated: 'Apr 17, 2026',
    dimensions: [
      { category: 'ESG', score: 68 },
      { category: 'Financial', score: 55 },
      { category: 'Geopolitical', score: 30 },
      { category: 'Cyber', score: 25 },
    ],
  },
  {
    id: 'amphenol',
    name: 'Amphenol',
    city: 'Monterrey',
    country: 'Mexico',
    region: 'Americas',
    tier: 1,
    sector: 'Connectors',
    overallScore: 45,
    lastUpdated: 'Apr 18, 2026',
    dimensions: [
      { category: 'Geopolitical', score: 49 },
      { category: 'Cyber', score: 41 },
      { category: 'ESG', score: 38 },
      { category: 'Financial', score: 32 },
    ],
  },
  {
    id: 'ttm',
    name: 'TTM Technologies',
    city: 'Munich',
    country: 'Germany',
    region: 'EMEA',
    tier: 2,
    sector: 'PCB Manufacturer',
    overallScore: 28,
    lastUpdated: 'Apr 16, 2026',
    dimensions: [
      { category: 'Geopolitical', score: 22 },
      { category: 'Cyber', score: 18 },
      { category: 'ESG', score: 15 },
      { category: 'Financial', score: 12 },
    ],
  },
];

// ── Sub-components ────────────────────────────────────────────────────

/** Circular score ring */
const ScoreRing: React.FC<{ score: number; size?: number }> = ({
  score,
  size = 56,
}) => {
  const p = riskProfile(score);
  const strokeW = 5;
  const r = (size - strokeW * 2) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - score / 100);

  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg
        width={size}
        height={size}
        style={{ transform: 'rotate(-90deg)', display: 'block' }}
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="#1E2A3E"
          strokeWidth={strokeW}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={p.bar}
          strokeWidth={strokeW}
          strokeDasharray={circ}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ filter: `drop-shadow(0 0 4px ${p.glow})` }}
        />
      </svg>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <span
          style={{
            color: p.text,
            fontSize: size * 0.26,
            fontWeight: 900,
            lineHeight: 1,
          }}
        >
          {score}
        </span>
      </div>
    </div>
  );
};

/** Revenue at Risk field — the key demo placeholder element */
const RevenueAtRisk: React.FC<{ prominent?: boolean }> = ({
  prominent = false,
}) => (
  <div
    style={{
      borderRadius: 8,
      border: prominent
        ? '1.5px solid rgba(251,191,36,0.4)'
        : '1px solid rgba(251,191,36,0.2)',
      backgroundColor: prominent
        ? 'rgba(251,191,36,0.06)'
        : 'rgba(251,191,36,0.04)',
      padding: prominent ? '14px 18px' : '9px 12px',
    }}
  >
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      {/* Label */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {/* Dollar icon */}
        <div
          style={{
            width: prominent ? 28 : 20,
            height: prominent ? 28 : 20,
            borderRadius: 6,
            backgroundColor: 'rgba(251,191,36,0.12)',
            border: '1px solid rgba(251,191,36,0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <svg
            width={prominent ? 14 : 10}
            height={prominent ? 14 : 10}
            viewBox="0 0 14 14"
            fill="none"
          >
            <path
              d="M7 1v12M4.5 3.5C4.5 2.67 5.67 2 7 2s2.5.67 2.5 1.5S8.33 5 7 5s-2.5.67-2.5 1.5S5.67 8 7 8s2.5.67 2.5 1.5S8.33 11 7 11s-2.5-.67-2.5-1.5"
              stroke="rgba(251,191,36,0.8)"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
          </svg>
        </div>
        <span
          style={{
            color: 'rgba(251,191,36,0.85)',
            fontWeight: 700,
            fontSize: prominent ? '0.75rem' : '0.6rem',
            letterSpacing: '0.1em',
          }}
        >
          REVENUE AT RISK
        </span>
      </div>

      {/* Value placeholder */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <span
          style={{
            color: '#4B5563',
            fontWeight: 700,
            fontSize: prominent ? '1rem' : '0.72rem',
            fontFamily: 'monospace',
          }}
        >
          —
        </span>
        <span
          style={{
            color: '#374151',
            fontSize: prominent ? '0.7rem' : '0.58rem',
            fontStyle: 'italic',
          }}
        >
          (Data Pending)
        </span>
      </div>
    </div>

    {/* Explanation note — prominent only */}
    {prominent && (
      <div
        style={{
          marginTop: 10,
          paddingTop: 10,
          borderTop: '1px solid rgba(251,191,36,0.15)',
          color: '#4B5563',
          fontSize: '0.66rem',
          lineHeight: 1.55,
        }}
      >
        Revenue impact calculation requires{' '}
        <span style={{ color: '#64748B', fontWeight: 500 }}>
          bill of materials + COGS data
        </span>{' '}
        from customer.{' '}
        <span style={{ color: '#374151' }}>
          Placeholder shown for MVP1.
        </span>
      </div>
    )}
  </div>
);

/** Compact supplier list card */
const SupplierCard: React.FC<{
  supplier: Supplier;
  selected: boolean;
  onSelect: () => void;
}> = ({ supplier, selected, onSelect }) => {
  const p = riskProfile(supplier.overallScore);
  const topDims = [...supplier.dimensions]
    .sort((a, b) => b.score - a.score)
    .slice(0, 2)
    .filter((d) => d.score >= 40);

  return (
    <div
      onClick={onSelect}
      style={{
        cursor: 'pointer',
        borderRadius: 10,
        border: selected ? `1.5px solid ${p.border}` : '1px solid #2A2D3E',
        borderLeft: `3px solid ${p.bar}`,
        backgroundColor: selected ? 'rgba(30,58,95,0.25)' : '#1A1D2E',
        padding: '14px 14px 14px 12px',
        transition: 'border-color 0.15s, background-color 0.15s',
      }}
    >
      {/* Row 1: name + score */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          marginBottom: 8,
        }}
      >
        <div>
          <div
            style={{
              color: '#E2E8F0',
              fontWeight: 700,
              fontSize: '0.92rem',
              marginBottom: 3,
            }}
          >
            {supplier.name}
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              flexWrap: 'wrap',
            }}
          >
            <span style={{ color: '#4B5563', fontSize: '0.6rem' }}>
              {supplier.city}, {supplier.country}
            </span>
            <span style={{ color: '#1E3A5F', fontSize: '0.6rem' }}>·</span>
            <span
              style={{
                backgroundColor: 'rgba(30,58,95,0.4)',
                color: '#4B5563',
                border: '1px solid #1E3A5F',
                borderRadius: 4,
                padding: '1px 6px',
                fontSize: '0.52rem',
                fontWeight: 700,
                letterSpacing: '0.06em',
              }}
            >
              TIER {supplier.tier}
            </span>
            <span style={{ color: '#374151', fontSize: '0.58rem' }}>
              {supplier.sector}
            </span>
          </div>
        </div>

        {/* Score */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            gap: 2,
            flexShrink: 0,
            marginLeft: 8,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span
              style={{
                color: p.text,
                fontWeight: 900,
                fontSize: '1.2rem',
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {supplier.overallScore}
            </span>
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                backgroundColor: p.bar,
                boxShadow: `0 0 5px ${p.glow}`,
                animation:
                  p.level === 'CRITICAL' ? 'pulse 2s infinite' : 'none',
              }}
            />
          </div>
          <span
            style={{
              color: p.text,
              fontWeight: 700,
              fontSize: '0.52rem',
              letterSpacing: '0.1em',
              opacity: 0.85,
            }}
          >
            {p.level}
          </span>
        </div>
      </div>

      {/* Mini risk bar */}
      <div
        style={{
          height: 4,
          borderRadius: 2,
          overflow: 'hidden',
          backgroundColor: 'rgba(30,58,95,0.4)',
          marginBottom: 10,
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${supplier.overallScore}%`,
            backgroundColor: p.bar,
            borderRadius: 2,
          }}
        />
      </div>

      {/* Active risk badges */}
      {topDims.length > 0 && (
        <div
          style={{
            display: 'flex',
            gap: 6,
            flexWrap: 'wrap',
            marginBottom: 10,
          }}
        >
          {topDims.map((d) => {
            const cs = CAT_STYLE[d.category];
            return (
              <span
                key={d.category}
                style={{
                  backgroundColor: cs.bg,
                  color: cs.color,
                  border: `1px solid ${cs.border}`,
                  borderRadius: 4,
                  padding: '2px 8px',
                  fontSize: '0.55rem',
                  fontWeight: 700,
                  letterSpacing: '0.07em',
                }}
              >
                {d.category.toUpperCase()} {d.score}
              </span>
            );
          })}
        </div>
      )}

      {/* Revenue placeholder */}
      <RevenueAtRisk prominent={false} />

      {/* View details CTA */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          marginTop: 10,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            color: selected ? '#60A5FA' : '#374151',
            fontSize: '0.62rem',
            fontWeight: 600,
            letterSpacing: '0.06em',
            transition: 'color 0.15s',
          }}
        >
          {selected ? 'VIEWING DETAILS' : 'VIEW DETAILS'}
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path
              d="M4.5 3L7.5 6L4.5 9"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

/** Risk dimension row for detail panel */
const DimensionBar: React.FC<{ dim: RiskDimension; rank: number }> = ({
  dim,
  rank,
}) => {
  const p = riskProfile(dim.score);
  const cs = CAT_STYLE[dim.category];

  return (
    <div
      style={{
        borderRadius: 8,
        border: `1px solid ${p.border}`,
        backgroundColor: '#1A1D2E',
        padding: '12px 14px',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 8,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {rank === 1 && (
            <span
              style={{
                color: '#64748B',
                fontSize: '0.5rem',
                fontWeight: 700,
                letterSpacing: '0.06em',
              }}
            >
              TOP
            </span>
          )}
          <span
            style={{
              backgroundColor: cs.bg,
              color: cs.color,
              border: `1px solid ${cs.border}`,
              borderRadius: 4,
              padding: '2px 8px',
              fontSize: '0.58rem',
              fontWeight: 700,
              letterSpacing: '0.07em',
            }}
          >
            {dim.category.toUpperCase()}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 5 }}>
          <span
            style={{
              color: p.text,
              fontWeight: 900,
              fontSize: '1rem',
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {dim.score}
          </span>
          <span
            style={{
              color: p.text,
              fontWeight: 700,
              fontSize: '0.55rem',
              letterSpacing: '0.09em',
              opacity: 0.75,
            }}
          >
            {p.level}
          </span>
        </div>
      </div>
      <div
        style={{
          height: 6,
          borderRadius: 3,
          overflow: 'hidden',
          backgroundColor: 'rgba(30,58,95,0.4)',
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${dim.score}%`,
            background: `linear-gradient(90deg, ${p.bar}BB, ${p.bar})`,
            borderRadius: 3,
            boxShadow: `0 0 6px ${p.glow}`,
            transition: 'width 0.7s ease',
          }}
        />
      </div>
    </div>
  );
};

/** Full supplier detail panel */
const DetailPanel: React.FC<{
  supplier: Supplier;
  onBack: () => void;
}> = ({ supplier, onBack }) => {
  const p = riskProfile(supplier.overallScore);
  const sorted = [...supplier.dimensions].sort((a, b) => b.score - a.score);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Detail header */}
      <div
        style={{
          flexShrink: 0,
          backgroundColor: '#0B0D16',
          borderBottom: '1px solid #1E3A5F',
          padding: '16px 24px',
        }}
      >
        {/* Breadcrumb */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            marginBottom: 12,
          }}
        >
          <button
            onClick={onBack}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#4B5563',
              fontSize: '0.65rem',
              fontWeight: 600,
              padding: 0,
            }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path
                d="M9 11L5 7L9 3"
                stroke="#4B5563"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            All Suppliers
          </button>
          <span style={{ color: '#1E3A5F', fontSize: '0.6rem' }}>/</span>
          <span
            style={{ color: '#64748B', fontSize: '0.65rem', fontWeight: 600 }}
          >
            {supplier.name}
          </span>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <h2
              style={{
                color: '#E2E8F0',
                fontSize: '1.4rem',
                fontWeight: 900,
                letterSpacing: '-0.01em',
                marginBottom: 6,
              }}
            >
              {supplier.name}
            </h2>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                flexWrap: 'wrap',
              }}
            >
              {[
                supplier.city + ', ' + supplier.country,
                supplier.region,
                `Tier ${supplier.tier}`,
                supplier.sector,
              ].map((item, i) => (
                <React.Fragment key={i}>
                  {i > 0 && (
                    <span style={{ color: '#1E3A5F', fontSize: '0.65rem' }}>
                      ·
                    </span>
                  )}
                  <span
                    style={{
                      color:
                        item.startsWith('Tier') ? '#64748B' : '#4B5563',
                      fontSize: '0.7rem',
                      fontWeight: item.startsWith('Tier') ? 700 : 400,
                    }}
                  >
                    {item}
                  </span>
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Score ring + level */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 4,
            }}
          >
            <ScoreRing score={supplier.overallScore} size={68} />
            <span
              style={{
                color: p.text,
                fontWeight: 700,
                fontSize: '0.6rem',
                letterSpacing: '0.12em',
              }}
            >
              {p.level}
            </span>
          </div>
        </div>
      </div>

      {/* Scrollable body */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '20px 24px',
          display: 'flex',
          flexDirection: 'column',
          gap: 18,
          scrollbarWidth: 'thin',
          scrollbarColor: '#2A2D3E #0F1117',
        }}
      >
        {/* Overall score bar */}
        <div
          style={{
            borderRadius: 10,
            border: `1.5px solid ${p.border}`,
            backgroundColor: '#1A1D2E',
            padding: '14px 18px',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 10,
            }}
          >
            <span
              style={{
                color: '#64748B',
                fontWeight: 700,
                fontSize: '0.62rem',
                letterSpacing: '0.14em',
              }}
            >
              OVERALL RISK SCORE
            </span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 5 }}>
              <span
                style={{
                  color: p.text,
                  fontWeight: 900,
                  fontSize: '1.5rem',
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                {supplier.overallScore}
              </span>
              <span style={{ color: '#374151', fontSize: '0.65rem' }}>
                / 100
              </span>
            </div>
          </div>
          <div
            style={{
              height: 10,
              borderRadius: 5,
              overflow: 'hidden',
              backgroundColor: 'rgba(30,58,95,0.4)',
              marginBottom: 6,
            }}
          >
            <div
              style={{
                height: '100%',
                width: `${supplier.overallScore}%`,
                background: `linear-gradient(90deg, ${p.bar}AA, ${p.bar})`,
                boxShadow: `0 0 10px ${p.glow}`,
                borderRadius: 5,
                transition: 'width 0.8s ease',
              }}
            />
          </div>
          {/* Scale labels */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '0.53rem',
            }}
          >
            <span style={{ color: '#4ADE80', fontWeight: 600 }}>
              0 — LOW
            </span>
            <span style={{ color: '#FBBF24', fontWeight: 600 }}>
              40 — MODERATE
            </span>
            <span style={{ color: '#F87171', fontWeight: 600 }}>
              70 — CRITICAL
            </span>
          </div>
        </div>

        {/* ★ Revenue at Risk — prominent ★ */}
        <RevenueAtRisk prominent={true} />

        {/* Risk dimension breakdown */}
        <div>
          <div
            style={{
              color: '#3B82F6',
              fontWeight: 700,
              fontSize: '0.6rem',
              letterSpacing: '0.14em',
              marginBottom: 10,
            }}
          >
            RISK DIMENSION BREAKDOWN
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 10,
            }}
          >
            {sorted.map((dim, i) => (
              <DimensionBar key={dim.category} dim={dim} rank={i + 1} />
            ))}
          </div>
        </div>

        {/* Supplier profile */}
        <div
          style={{
            borderRadius: 10,
            border: '1px solid #2A2D3E',
            backgroundColor: '#1A1D2E',
            padding: '14px 18px',
          }}
        >
          <div
            style={{
              color: '#3B82F6',
              fontWeight: 700,
              fontSize: '0.6rem',
              letterSpacing: '0.14em',
              marginBottom: 12,
            }}
          >
            SUPPLIER PROFILE
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '10px 20px',
            }}
          >
            {[
              { label: 'LOCATION', value: `${supplier.city}, ${supplier.country}` },
              { label: 'REGION', value: supplier.region },
              { label: 'TIER', value: `Tier ${supplier.tier}` },
              { label: 'SECTOR', value: supplier.sector },
              { label: 'LAST UPDATED', value: supplier.lastUpdated },
            ].map(({ label, value }) => (
              <div key={label}>
                <div
                  style={{
                    color: '#374151',
                    fontSize: '0.55rem',
                    fontWeight: 700,
                    letterSpacing: '0.1em',
                    marginBottom: 3,
                  }}
                >
                  {label}
                </div>
                <div
                  style={{
                    color: '#CBD5E1',
                    fontSize: '0.72rem',
                    fontWeight: 500,
                  }}
                >
                  {value}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pending data callout */}
        <div
          style={{
            borderRadius: 8,
            border: '1px solid rgba(59,130,246,0.2)',
            backgroundColor: 'rgba(30,58,95,0.15)',
            padding: '12px 16px',
            display: 'flex',
            gap: 10,
            alignItems: 'flex-start',
          }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            style={{ flexShrink: 0, marginTop: 1 }}
          >
            <circle
              cx="8"
              cy="8"
              r="7"
              stroke="rgba(59,130,246,0.5)"
              strokeWidth="1.2"
            />
            <line
              x1="8"
              y1="7"
              x2="8"
              y2="11"
              stroke="rgba(59,130,246,0.7)"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
            <circle cx="8" cy="5" r="0.8" fill="rgba(59,130,246,0.7)" />
          </svg>
          <div>
            <div
              style={{
                color: '#3B82F6',
                fontWeight: 700,
                fontSize: '0.6rem',
                letterSpacing: '0.08em',
                marginBottom: 4,
              }}
            >
              DATA INTEGRATION PENDING
            </div>
            <div
              style={{
                color: '#374151',
                fontSize: '0.65rem',
                lineHeight: 1.55,
              }}
            >
              Revenue at Risk and financial exposure calculations will populate
              once{' '}
              <span style={{ color: '#4B5563', fontWeight: 500 }}>
                BOM and COGS data
              </span>{' '}
              are ingested from your ERP system. All other risk signals are
              live.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Main Export ───────────────────────────────────────────────────────
const SupplierRiskMonitor: React.FC = () => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = SUPPLIERS.find((s) => s.id === selectedId) ?? null;

  const counts = {
    critical: SUPPLIERS.filter((s) => s.overallScore >= 70).length,
    moderate: SUPPLIERS.filter(
      (s) => s.overallScore >= 40 && s.overallScore < 70,
    ).length,
    low: SUPPLIERS.filter((s) => s.overallScore < 40).length,
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        backgroundColor: '#0F1117',
      }}
    >
      {/* Monitor sub-header */}
      <div
        style={{
          flexShrink: 0,
          backgroundColor: '#0A0C16',
          borderBottom: '2px solid #1E3A5F',
          padding: '12px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 20,
        }}
      >
        <div>
          <div
            style={{
              color: '#3B82F6',
              fontWeight: 700,
              fontSize: '0.62rem',
              letterSpacing: '0.18em',
              marginBottom: 6,
            }}
          >
            SUPPLIER RISK MONITOR
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ color: '#374151', fontSize: '0.6rem' }}>
              {SUPPLIERS.length} monitored suppliers
            </span>
            {(
              [
                {
                  count: counts.critical,
                  label: 'CRITICAL',
                  color: '#DC2626',
                  bg: 'rgba(220,38,38,0.12)',
                  border: 'rgba(220,38,38,0.3)',
                },
                {
                  count: counts.moderate,
                  label: 'MODERATE',
                  color: '#D97706',
                  bg: 'rgba(217,119,6,0.12)',
                  border: 'rgba(217,119,6,0.3)',
                },
                {
                  count: counts.low,
                  label: 'LOW',
                  color: '#16A34A',
                  bg: 'rgba(22,163,74,0.12)',
                  border: 'rgba(22,163,74,0.3)',
                },
              ] as const
            ).map((s) => (
              <div
                key={s.label}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 5,
                  backgroundColor: s.bg,
                  border: `1px solid ${s.border}`,
                  borderRadius: 6,
                  padding: '3px 8px',
                }}
              >
                <div
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    backgroundColor: s.color,
                    boxShadow: `0 0 4px ${s.color}`,
                  }}
                />
                <span
                  style={{
                    color: s.color,
                    fontWeight: 700,
                    fontSize: '0.58rem',
                    letterSpacing: '0.06em',
                  }}
                >
                  {s.count} {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* MVP1 / QSC demo badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            backgroundColor: 'rgba(30,58,95,0.25)',
            border: '1px solid #1E3A5F',
            borderRadius: 8,
            padding: '8px 14px',
          }}
        >
          <div
            style={{
              width: 7,
              height: 7,
              borderRadius: '50%',
              backgroundColor: '#3B82F6',
              animation: 'pulse 2s infinite',
            }}
          />
          <div>
            <div
              style={{
                color: '#3B82F6',
                fontWeight: 700,
                fontSize: '0.58rem',
                letterSpacing: '0.1em',
                marginBottom: 1,
              }}
            >
              MVP1 · QSC DESIGN REVIEW
            </div>
            <div style={{ color: '#374151', fontSize: '0.52rem' }}>
              MRO Show · April 21, 2026 · Revenue field: placeholder
            </div>
          </div>
        </div>
      </div>

      {/* Two-column body */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Supplier list */}
        <div
          style={{
            width: selected ? 340 : '100%',
            maxWidth: selected ? 340 : 720,
            margin: selected ? 0 : '0 auto',
            flexShrink: 0,
            overflowY: 'auto',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
            borderRight: selected ? '1px solid #1E3A5F' : 'none',
            scrollbarWidth: 'thin',
            scrollbarColor: '#2A2D3E #0F1117',
          }}
        >
          {SUPPLIERS.map((s) => (
            <SupplierCard
              key={s.id}
              supplier={s}
              selected={selectedId === s.id}
              onSelect={() =>
                setSelectedId((prev) => (prev === s.id ? null : s.id))
              }
            />
          ))}
        </div>

        {/* Detail panel */}
        {selected ? (
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <DetailPanel
              supplier={selected}
              onBack={() => setSelectedId(null)}
            />
          </div>
        ) : (
          /* Empty state */
          <div
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderLeft: '1px solid #151820',
            }}
          >
            <div style={{ textAlign: 'center', maxWidth: 260 }}>
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  backgroundColor: 'rgba(30,58,95,0.25)',
                  border: '1px solid #1E3A5F',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 14px',
                }}
              >
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 22 22"
                  fill="none"
                >
                  <circle
                    cx="11"
                    cy="11"
                    r="9"
                    stroke="#1E3A5F"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M8 11h6M11 8v6"
                    stroke="#1E3A5F"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <div
                style={{
                  color: '#374151',
                  fontWeight: 600,
                  fontSize: '0.8rem',
                  marginBottom: 6,
                }}
              >
                Select a supplier
              </div>
              <div
                style={{
                  color: '#1E2A3A',
                  fontSize: '0.65rem',
                  lineHeight: 1.55,
                }}
              >
                Click any card to view the full risk breakdown, dimension
                scores, and data status
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SupplierRiskMonitor;
