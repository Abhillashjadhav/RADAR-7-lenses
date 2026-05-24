import React, { useState } from 'react';

// ── Types ─────────────────────────────────────────────────────────────
type RiskLevel = 'CRITICAL' | 'MODERATE' | 'LOW';
type RiskCategory = 'Geopolitical' | 'Cyber' | 'ESG' | 'Financial';
type Trend = 'WORSENING' | 'STABLE' | 'IMPROVING';
type Horizon = 'IMMEDIATE' | '30 DAYS' | 'STRATEGIC';
type Effort = 'LOW' | 'MEDIUM' | 'HIGH';
type Impact = 'LOW' | 'MEDIUM' | 'HIGH';

interface RiskDimension {
  category: RiskCategory;
  score: number;
  headline: string;
  detail: string;
  clockLink?: string;
}

interface MitigationAction {
  horizon: Horizon;
  title: string;
  detail: string;
  owner: string;
  timeline: string;
  effort: Effort;
  impact: Impact;
}

interface Alternative {
  name: string;
  country: string;
  leadTime: string;
  capacity: string;
  riskScore: number;
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
  trend: Trend;
  revenueAtRiskLow: number;
  revenueAtRiskHigh: number;
  revenueBasis: string;
  daysToImpact: number;
  singleSource: boolean;
  spendExposurePct: number;
  costToMitigate: number;
  costOfDisruption: number;
  substitutability: number;
  doNothingOutcome: string;
  dimensions: RiskDimension[];
  actions: MitigationAction[];
  alternatives: Alternative[];
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
  Geopolitical: { color: '#C4B5FD', bg: 'rgba(139,92,246,0.15)', border: 'rgba(139,92,246,0.4)' },
  Cyber: { color: '#6EE7B7', bg: 'rgba(16,185,129,0.15)', border: 'rgba(16,185,129,0.4)' },
  ESG: { color: '#FDE047', bg: 'rgba(234,179,8,0.15)', border: 'rgba(234,179,8,0.4)' },
  Financial: { color: '#60A5FA', bg: 'rgba(59,130,246,0.15)', border: 'rgba(59,130,246,0.4)' },
};

const TREND_STYLE: Record<Trend, { color: string; arrow: string; bg: string; border: string }> = {
  WORSENING: { color: '#F87171', arrow: '▲', bg: 'rgba(220,38,38,0.12)', border: 'rgba(220,38,38,0.35)' },
  STABLE: { color: '#94A3B8', arrow: '▬', bg: 'rgba(100,116,139,0.12)', border: 'rgba(100,116,139,0.3)' },
  IMPROVING: { color: '#4ADE80', arrow: '▼', bg: 'rgba(22,163,74,0.12)', border: 'rgba(22,163,74,0.35)' },
};

const HORIZON_STYLE: Record<Horizon, { color: string; bg: string; border: string }> = {
  IMMEDIATE: { color: '#F87171', bg: 'rgba(220,38,38,0.12)', border: 'rgba(220,38,38,0.35)' },
  '30 DAYS': { color: '#FBBF24', bg: 'rgba(217,119,6,0.12)', border: 'rgba(217,119,6,0.35)' },
  STRATEGIC: { color: '#60A5FA', bg: 'rgba(59,130,246,0.12)', border: 'rgba(59,130,246,0.35)' },
};

function effortImpactStyle(level: Effort | Impact) {
  if (level === 'LOW') return { color: '#4ADE80', bg: 'rgba(22,163,74,0.12)', border: 'rgba(22,163,74,0.3)' };
  if (level === 'MEDIUM') return { color: '#FBBF24', bg: 'rgba(217,119,6,0.12)', border: 'rgba(217,119,6,0.3)' };
  return { color: '#F87171', bg: 'rgba(220,38,38,0.12)', border: 'rgba(220,38,38,0.3)' };
}

// ── Data ──────────────────────────────────────────────────────────────
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
    trend: 'WORSENING',
    revenueAtRiskLow: 42,
    revenueAtRiskHigh: 68,
    revenueBasis: 'Based on FY25 BOM share × 8-week disruption scenario',
    daysToImpact: 14,
    singleSource: true,
    spendExposurePct: 34,
    costToMitigate: 3.2,
    costOfDisruption: 55,
    substitutability: 18,
    doNothingOutcome: 'Production halt at Plant 3 within 14 days. ~$55M revenue loss, 4 OEM customers de-prioritised, and contractual penalty exposure ~$8M. Recovery 90–120 days.',
    lastUpdated: 'Apr 18, 2026',
    dimensions: [
      { category: 'Geopolitical', score: 92, headline: 'Taiwan Strait tension at 12-month high', detail: 'PLA exercise schedule overlapping Q3 shipping window. Port of Keelung reporting 18% slowdown. Insurer Lloyd\'s raised hull rates 22%.', clockLink: 'Clock 2 · Geopolitical' },
      { category: 'Cyber', score: 74, headline: 'Active intrusion on parent network', detail: 'CISA flagged TTP overlap with Volt Typhoon. Winn IT segmented OT 6 days ago; recovery unverified.', clockLink: 'Clock 4 · Cyber' },
      { category: 'ESG', score: 40, headline: 'Water stress + labour audit gaps', detail: 'Hsinchu drought stage 2. Last SA8000 audit overdue 5 months.' },
      { category: 'Financial', score: 35, headline: 'Margin compression, liquidity adequate', detail: 'Operating margin down 280 bps YoY. Cash runway ~11 months. No covenant breach.' },
    ],
    actions: [
      { horizon: 'IMMEDIATE', title: 'Activate safety stock + pull-forward 2 weeks', detail: 'Release reserved inventory at DC-Chicago. Pull next 2 PO releases by 14 days.', owner: 'S. Patel · Ops', timeline: '72 hours', effort: 'LOW', impact: 'HIGH' },
      { horizon: 'IMMEDIATE', title: 'Dual-source qualification on SKU-441 / 442', detail: 'Engage Corevo and Amphenol for emergency RFQ. Waive standard sample cycle.', owner: 'M. Chen · Sourcing', timeline: '5 days', effort: 'MEDIUM', impact: 'HIGH' },
      { horizon: '30 DAYS', title: 'Re-route logistics via Kaohsiung + air freight buffer', detail: 'Shift 40% of shipments off Keelung. Pre-book air capacity for 12 weeks.', owner: 'R. Iyer · Logistics', timeline: '30 days', effort: 'MEDIUM', impact: 'MEDIUM' },
      { horizon: 'STRATEGIC', title: 'Mexico nearshore qualification (TTM + Amphenol)', detail: 'Dual-track NPI with TTM Munich + Amphenol Monterrey. Target 25% volume relocation by FY27.', owner: 'L. Garcia · Strategy', timeline: '9–12 months', effort: 'HIGH', impact: 'HIGH' },
    ],
    alternatives: [
      { name: 'Amphenol', country: 'Mexico', leadTime: '10 wks', capacity: 'Partial', riskScore: 45 },
      { name: 'TTM Technologies', country: 'Germany', leadTime: '14 wks', capacity: 'Full', riskScore: 28 },
      { name: 'Corevo', country: 'Netherlands', leadTime: '8 wks', capacity: 'Partial', riskScore: 61 },
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
    trend: 'WORSENING',
    revenueAtRiskLow: 12,
    revenueAtRiskHigh: 22,
    revenueBasis: 'Based on 14% spend share × 4-week disruption scenario',
    daysToImpact: 45,
    singleSource: false,
    spendExposurePct: 14,
    costToMitigate: 0.8,
    costOfDisruption: 18,
    substitutability: 55,
    doNothingOutcome: 'CSRD non-compliance fines (~€4M) and EU customer audit failures. Q4 shipments to 2 EMEA OEMs at risk if Scope-3 disclosures remain incomplete.',
    lastUpdated: 'Apr 17, 2026',
    dimensions: [
      { category: 'ESG', score: 68, headline: 'CSRD disclosure gap on Scope 3', detail: 'Missing supplier emissions data for 22% of upstream. EU regulator opened informal inquiry.', clockLink: 'Clock 5 · ESG / Regulatory' },
      { category: 'Financial', score: 55, headline: 'Receivables aging up 18 days', detail: 'DSO crept from 47 → 65. Two customers in payment plan. EBITDA flat YoY.' },
      { category: 'Geopolitical', score: 30, headline: 'EU stable; export-control monitoring on dual-use', detail: 'Eindhoven ops unaffected by Russia sanctions. ECCN review on 3 SKUs.' },
      { category: 'Cyber', score: 25, headline: 'ISO 27001 current, no incidents', detail: 'Pen-test passed Jan 2026. MFA enforced.' },
    ],
    actions: [
      { horizon: 'IMMEDIATE', title: 'Issue Scope-3 data request + audit hold', detail: 'Formal request via supplier portal. Pause new POs until response within 10 days.', owner: 'J. Müller · ESG', timeline: '10 days', effort: 'LOW', impact: 'MEDIUM' },
      { horizon: '30 DAYS', title: 'Joint remediation plan for CSRD reporting', detail: 'Co-fund 3rd-party emissions assessment. Define milestone gates for Q3 disclosure.', owner: 'A. Novak · Compliance', timeline: '30 days', effort: 'MEDIUM', impact: 'HIGH' },
      { horizon: 'STRATEGIC', title: 'Add EU back-up supplier (Murata DE)', detail: 'Qualify Murata Germany for the same SKU family to reduce single-country EMEA exposure.', owner: 'P. Larsson · Sourcing', timeline: '6 months', effort: 'MEDIUM', impact: 'MEDIUM' },
    ],
    alternatives: [
      { name: 'Murata Germany', country: 'Germany', leadTime: '10 wks', capacity: 'Full', riskScore: 22 },
      { name: 'Yageo', country: 'Taiwan', leadTime: '12 wks', capacity: 'Full', riskScore: 58 },
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
    trend: 'STABLE',
    revenueAtRiskLow: 8,
    revenueAtRiskHigh: 16,
    revenueBasis: 'Based on 9% spend share × 3-week disruption scenario',
    daysToImpact: 60,
    singleSource: false,
    spendExposurePct: 9,
    costToMitigate: 0.4,
    costOfDisruption: 12,
    substitutability: 72,
    doNothingOutcome: 'Tariff pass-through of ~6% on Mexico-origin assemblies. Modest margin compression, no production stoppage. ~$3M annualised cost.',
    lastUpdated: 'Apr 18, 2026',
    dimensions: [
      { category: 'Geopolitical', score: 49, headline: 'USMCA review + tariff uncertainty', detail: 'Section 232 review on automotive electronics. CBP scrutiny on rules-of-origin paperwork increased.', clockLink: 'Clock 2 · Geopolitical' },
      { category: 'Cyber', score: 41, headline: 'Phishing campaign against MX plants', detail: 'Industry-wide spike. Amphenol reports no compromise; user-awareness program rolled out.' },
      { category: 'ESG', score: 38, headline: 'Water permit review pending', detail: 'Nuevo León drought regulations; new permit expected Q3.' },
      { category: 'Financial', score: 32, headline: 'Strong balance sheet, A- rated', detail: 'No financial stress signals. Free cash flow up 9% YoY.' },
    ],
    actions: [
      { horizon: 'IMMEDIATE', title: 'Pre-clear customs documentation', detail: 'Validate USMCA certificates of origin for top 12 SKUs. Pre-emptive broker review.', owner: 'D. Reyes · Trade', timeline: '7 days', effort: 'LOW', impact: 'MEDIUM' },
      { horizon: '30 DAYS', title: 'Tariff scenario model + price-pass mechanism', detail: 'Quantify impact at 5/10/15% tariff bands. Pre-agree pass-through clauses with top 4 customers.', owner: 'K. Brown · Finance', timeline: '30 days', effort: 'MEDIUM', impact: 'HIGH' },
      { horizon: 'STRATEGIC', title: 'Add US-domestic connector qualification', detail: 'Qualify Molex (US) for top-volume SKU. Hedge against deeper tariff regime.', owner: 'S. Patel · Sourcing', timeline: '6 months', effort: 'MEDIUM', impact: 'MEDIUM' },
    ],
    alternatives: [
      { name: 'Molex', country: 'USA', leadTime: '8 wks', capacity: 'Full', riskScore: 24 },
      { name: 'TE Connectivity', country: 'Switzerland', leadTime: '11 wks', capacity: 'Full', riskScore: 30 },
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
    trend: 'IMPROVING',
    revenueAtRiskLow: 3,
    revenueAtRiskHigh: 7,
    revenueBasis: 'Based on 6% spend share × 2-week disruption scenario',
    daysToImpact: 120,
    singleSource: false,
    spendExposurePct: 6,
    costToMitigate: 0.2,
    costOfDisruption: 5,
    substitutability: 85,
    doNothingOutcome: 'Minor scheduling friction only. No production or revenue impact expected within 6 months. Status quo acceptable.',
    lastUpdated: 'Apr 16, 2026',
    dimensions: [
      { category: 'Geopolitical', score: 22, headline: 'EU stable; energy costs normalised', detail: 'German industrial electricity prices down 14% YoY. No regulatory red flags.' },
      { category: 'Cyber', score: 18, headline: 'NIS2 compliant, low threat surface', detail: 'Independent attestation Mar 2026. No incidents in trailing 12 months.' },
      { category: 'ESG', score: 15, headline: 'Best-in-class disclosure', detail: 'Science-based targets validated. Renewables 78% of plant load.' },
      { category: 'Financial', score: 12, headline: 'Investment grade, strong liquidity', detail: 'BBB+ rated. Net leverage 1.2x. Healthy backlog.' },
    ],
    actions: [
      { horizon: '30 DAYS', title: 'Increase volume allocation', detail: 'Shift 5–10% of Winn volume to TTM Munich while qualifying new SKUs.', owner: 'M. Chen · Sourcing', timeline: '30 days', effort: 'LOW', impact: 'MEDIUM' },
      { horizon: 'STRATEGIC', title: 'Pilot strategic partnership / JDA', detail: 'Joint development on next-gen HDI boards. 3-year framework agreement.', owner: 'L. Garcia · Strategy', timeline: '9 months', effort: 'MEDIUM', impact: 'HIGH' },
    ],
    alternatives: [
      { name: 'AT&S', country: 'Austria', leadTime: '12 wks', capacity: 'Full', riskScore: 26 },
      { name: 'Unimicron', country: 'Taiwan', leadTime: '10 wks', capacity: 'Full', riskScore: 62 },
    ],
  },
];

// ── Small UI atoms ────────────────────────────────────────────────────
const Badge: React.FC<{
  color: string;
  bg: string;
  border: string;
  children: React.ReactNode;
  size?: 'sm' | 'md';
}> = ({ color, bg, border, children, size = 'sm' }) => (
  <span
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 4,
      backgroundColor: bg,
      color,
      border: `1px solid ${border}`,
      borderRadius: 4,
      padding: size === 'sm' ? '2px 7px' : '4px 10px',
      fontSize: size === 'sm' ? '0.55rem' : '0.62rem',
      fontWeight: 700,
      letterSpacing: '0.08em',
      whiteSpace: 'nowrap',
    }}
  >
    {children}
  </span>
);

const SectionLabel: React.FC<{ children: React.ReactNode; color?: string }> = ({
  children,
  color = '#3B82F6',
}) => (
  <div
    style={{
      color,
      fontWeight: 700,
      fontSize: '0.6rem',
      letterSpacing: '0.14em',
      marginBottom: 10,
    }}
  >
    {children}
  </div>
);

const Gauge: React.FC<{ score: number; label: string }> = ({ score, label }) => {
  const p = riskProfile(100 - score);
  const size = 64;
  const strokeW = 6;
  const r = (size - strokeW * 2) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - score / 100);

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)', display: 'block' }}>
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#1E2A3E" strokeWidth={strokeW} />
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
          <span style={{ color: p.text, fontSize: 16, fontWeight: 900, lineHeight: 1 }}>{score}</span>
        </div>
      </div>
      <div>
        <div
          style={{
            color: '#64748B',
            fontSize: '0.55rem',
            fontWeight: 700,
            letterSpacing: '0.12em',
            marginBottom: 3,
          }}
        >
          {label}
        </div>
        <div style={{ color: '#CBD5E1', fontSize: '0.65rem' }}>
          {score >= 70 ? 'Many alternatives' : score >= 40 ? 'Limited alternatives' : 'Few / no alternatives'}
        </div>
      </div>
    </div>
  );
};

// ── Supplier card (left pane) ─────────────────────────────────────────
const SupplierCard: React.FC<{
  supplier: Supplier;
  selected: boolean;
  onSelect: () => void;
}> = ({ supplier, selected, onSelect }) => {
  const p = riskProfile(supplier.overallScore);
  const t = TREND_STYLE[supplier.trend];

  return (
    <div
      onClick={onSelect}
      style={{
        cursor: 'pointer',
        borderRadius: 10,
        border: selected ? `1.5px solid ${p.border}` : '1px solid #2A2D3E',
        borderLeft: `3px solid ${p.bar}`,
        backgroundColor: selected ? 'rgba(30,58,95,0.25)' : '#1A1D2E',
        padding: '14px',
        transition: 'border-color 0.15s, background-color 0.15s',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
        <div>
          <div style={{ color: '#E2E8F0', fontWeight: 700, fontSize: '0.95rem', marginBottom: 3 }}>
            {supplier.name}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
            <span style={{ color: '#94A3B8', fontSize: '0.62rem' }}>{supplier.country}</span>
            <span
              style={{
                backgroundColor: 'rgba(30,58,95,0.4)',
                color: '#94A3B8',
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
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 3 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <span
              style={{
                color: p.text,
                fontWeight: 900,
                fontSize: '1.25rem',
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {supplier.overallScore}
            </span>
            <span style={{ color: t.color, fontSize: '0.7rem', fontWeight: 800 }}>{t.arrow}</span>
          </div>
          <span style={{ color: p.text, fontWeight: 700, fontSize: '0.52rem', letterSpacing: '0.1em' }}>
            {p.level}
          </span>
        </div>
      </div>

      <div
        style={{
          height: 4,
          borderRadius: 2,
          overflow: 'hidden',
          backgroundColor: 'rgba(30,58,95,0.4)',
          marginBottom: 10,
        }}
      >
        <div style={{ height: '100%', width: `${supplier.overallScore}%`, backgroundColor: p.bar }} />
      </div>

      <div style={{ marginBottom: 10, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        <Badge color={t.color} bg={t.bg} border={t.border}>
          {t.arrow} {supplier.trend}
        </Badge>
        {supplier.singleSource && (
          <Badge color="#F87171" bg="rgba(220,38,38,0.12)" border="rgba(220,38,38,0.35)">
            SINGLE SOURCE
          </Badge>
        )}
      </div>

      <div
        style={{
          borderRadius: 8,
          border: '1.5px solid rgba(251,191,36,0.4)',
          backgroundColor: 'rgba(251,191,36,0.05)',
          padding: '8px 10px',
          marginBottom: 8,
        }}
      >
        <div
          style={{
            color: 'rgba(251,191,36,0.85)',
            fontWeight: 700,
            fontSize: '0.55rem',
            letterSpacing: '0.1em',
            marginBottom: 2,
          }}
        >
          REVENUE AT RISK
        </div>
        <div
          style={{
            color: '#FBBF24',
            fontWeight: 800,
            fontSize: '0.95rem',
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          ${supplier.revenueAtRiskLow}M – ${supplier.revenueAtRiskHigh}M
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '0.62rem',
        }}
      >
        <span style={{ color: '#64748B', fontWeight: 700, letterSpacing: '0.08em' }}>
          TIME TO IMPACT
        </span>
        <span
          style={{
            color:
              supplier.daysToImpact <= 30 ? '#F87171' : supplier.daysToImpact <= 60 ? '#FBBF24' : '#4ADE80',
            fontWeight: 800,
          }}
        >
          {supplier.daysToImpact} days
        </span>
      </div>
    </div>
  );
};

// ── Tab: Impact ───────────────────────────────────────────────────────
const ImpactTab: React.FC<{ supplier: Supplier }> = ({ supplier }) => {
  const maxBar = Math.max(supplier.costOfDisruption, supplier.costToMitigate);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div
        style={{
          borderRadius: 10,
          border: '1.5px solid rgba(251,191,36,0.45)',
          backgroundColor: 'rgba(251,191,36,0.06)',
          padding: '18px 20px',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 10,
            flexWrap: 'wrap',
            gap: 8,
          }}
        >
          <span style={{ color: '#FBBF24', fontWeight: 800, fontSize: '0.65rem', letterSpacing: '0.14em' }}>
            REVENUE AT RISK
          </span>
          <span
            style={{
              color: '#FBBF24',
              fontWeight: 900,
              fontSize: '1.6rem',
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            ${supplier.revenueAtRiskLow}M – ${supplier.revenueAtRiskHigh}M
          </span>
        </div>
        <div
          style={{
            color: '#CBD5E1',
            fontSize: '0.68rem',
            lineHeight: 1.6,
            paddingTop: 10,
            borderTop: '1px solid rgba(251,191,36,0.18)',
          }}
        >
          <span style={{ color: 'rgba(251,191,36,0.85)', fontWeight: 700 }}>BASIS — </span>
          {supplier.revenueBasis}
        </div>
      </div>

      <div
        style={{
          borderRadius: 10,
          border: '1px solid #2A2D3E',
          backgroundColor: '#1A1D2E',
          padding: '14px 18px',
        }}
      >
        <SectionLabel>COST TO MITIGATE vs COST OF DISRUPTION</SectionLabel>
        {[
          { label: 'Cost to mitigate', val: supplier.costToMitigate, color: '#4ADE80', bar: '#16A34A' },
          { label: 'Cost of disruption', val: supplier.costOfDisruption, color: '#F87171', bar: '#DC2626' },
        ].map((row) => (
          <div key={row.label} style={{ marginBottom: 10 }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '0.65rem',
                marginBottom: 4,
              }}
            >
              <span style={{ color: '#94A3B8' }}>{row.label}</span>
              <span style={{ color: row.color, fontWeight: 800 }}>${row.val}M</span>
            </div>
            <div
              style={{
                height: 8,
                borderRadius: 4,
                overflow: 'hidden',
                backgroundColor: 'rgba(30,58,95,0.4)',
              }}
            >
              <div
                style={{
                  height: '100%',
                  width: `${(row.val / maxBar) * 100}%`,
                  backgroundColor: row.bar,
                  transition: 'width 0.6s ease',
                }}
              />
            </div>
          </div>
        ))}
        <div
          style={{
            marginTop: 10,
            paddingTop: 10,
            borderTop: '1px solid #2A2D3E',
            color: '#94A3B8',
            fontSize: '0.65rem',
          }}
        >
          Ratio:{' '}
          <span style={{ color: '#4ADE80', fontWeight: 700 }}>
            {(supplier.costOfDisruption / Math.max(supplier.costToMitigate, 0.01)).toFixed(1)}×
          </span>{' '}
          — mitigation is materially cheaper than absorbing the disruption.
        </div>
      </div>

      <div
        style={{
          borderRadius: 10,
          border: '1px solid #2A2D3E',
          backgroundColor: '#1A1D2E',
          padding: '14px 18px',
        }}
      >
        <SectionLabel>SPEND EXPOSURE</SectionLabel>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div
            style={{
              color: '#E2E8F0',
              fontWeight: 900,
              fontSize: '2rem',
              lineHeight: 1,
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {supplier.spendExposurePct}%
          </div>
          <div style={{ flex: 1 }}>
            <div
              style={{
                height: 10,
                borderRadius: 5,
                overflow: 'hidden',
                backgroundColor: 'rgba(30,58,95,0.4)',
                marginBottom: 4,
              }}
            >
              <div
                style={{
                  height: '100%',
                  width: `${supplier.spendExposurePct}%`,
                  background: 'linear-gradient(90deg, rgba(251,191,36,0.7), #FBBF24)',
                }}
              />
            </div>
            <div style={{ color: '#94A3B8', fontSize: '0.62rem' }}>
              Share of category spend concentrated with {supplier.name}.
            </div>
          </div>
        </div>
      </div>

      {supplier.singleSource && (
        <div
          style={{
            borderRadius: 10,
            border: '1.5px solid rgba(220,38,38,0.45)',
            backgroundColor: 'rgba(220,38,38,0.08)',
            padding: '14px 18px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: 12,
          }}
        >
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: '50%',
              backgroundColor: 'rgba(220,38,38,0.2)',
              border: '1px solid rgba(220,38,38,0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              color: '#F87171',
              fontWeight: 900,
              fontSize: '0.85rem',
            }}
          >
            !
          </div>
          <div>
            <div
              style={{
                color: '#F87171',
                fontWeight: 800,
                fontSize: '0.7rem',
                letterSpacing: '0.1em',
                marginBottom: 4,
              }}
            >
              SINGLE-SOURCE SKU FAMILY
            </div>
            <div style={{ color: '#CBD5E1', fontSize: '0.68rem', lineHeight: 1.6 }}>
              No qualified alternate currently exists for the affected SKU family. Any disruption flows
              directly to production within{' '}
              <span style={{ color: '#F87171', fontWeight: 700 }}>{supplier.daysToImpact} days</span>.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ── Tab: Root Cause ───────────────────────────────────────────────────
const RootCauseTab: React.FC<{ supplier: Supplier }> = ({ supplier }) => {
  const sorted = [...supplier.dimensions].sort((a, b) => b.score - a.score);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {sorted.map((dim) => {
        const p = riskProfile(dim.score);
        const cs = CAT_STYLE[dim.category];
        return (
          <div
            key={dim.category}
            style={{
              borderRadius: 10,
              border: `1px solid ${p.border}`,
              backgroundColor: '#1A1D2E',
              padding: '14px 16px',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 8,
                flexWrap: 'wrap',
                gap: 6,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                <Badge color={cs.color} bg={cs.bg} border={cs.border}>
                  {dim.category.toUpperCase()}
                </Badge>
                {dim.clockLink && (
                  <Badge color="#60A5FA" bg="rgba(59,130,246,0.12)" border="rgba(59,130,246,0.35)">
                    ◷ {dim.clockLink}
                  </Badge>
                )}
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 5 }}>
                <span
                  style={{
                    color: p.text,
                    fontWeight: 900,
                    fontSize: '1.1rem',
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
                    letterSpacing: '0.1em',
                    opacity: 0.8,
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
                marginBottom: 10,
              }}
            >
              <div
                style={{
                  height: '100%',
                  width: `${dim.score}%`,
                  background: `linear-gradient(90deg, ${p.bar}BB, ${p.bar})`,
                  boxShadow: `0 0 6px ${p.glow}`,
                }}
              />
            </div>
            <div style={{ color: '#E2E8F0', fontWeight: 700, fontSize: '0.78rem', marginBottom: 4 }}>
              {dim.headline}
            </div>
            <div style={{ color: '#94A3B8', fontSize: '0.68rem', lineHeight: 1.6 }}>{dim.detail}</div>
          </div>
        );
      })}
    </div>
  );
};

// ── Tab: Mitigate ─────────────────────────────────────────────────────
const MitigateTab: React.FC<{ supplier: Supplier }> = ({ supplier }) => {
  const groups: Horizon[] = ['IMMEDIATE', '30 DAYS', 'STRATEGIC'];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      {groups.map((h) => {
        const items = supplier.actions.filter((a) => a.horizon === h);
        if (items.length === 0) return null;
        const hs = HORIZON_STYLE[h];
        return (
          <div key={h}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <Badge color={hs.color} bg={hs.bg} border={hs.border} size="md">
                {h}
              </Badge>
              <span style={{ color: '#64748B', fontSize: '0.62rem' }}>
                {items.length} action{items.length > 1 ? 's' : ''}
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {items.map((a, i) => {
                const es = effortImpactStyle(a.effort);
                const is = effortImpactStyle(a.impact);
                return (
                  <div
                    key={i}
                    style={{
                      borderRadius: 10,
                      border: '1px solid #2A2D3E',
                      borderLeft: `3px solid ${hs.color}`,
                      backgroundColor: '#1A1D2E',
                      padding: '12px 14px',
                    }}
                  >
                    <div style={{ color: '#E2E8F0', fontWeight: 700, fontSize: '0.8rem', marginBottom: 4 }}>
                      {a.title}
                    </div>
                    <div
                      style={{
                        color: '#94A3B8',
                        fontSize: '0.66rem',
                        lineHeight: 1.55,
                        marginBottom: 10,
                      }}
                    >
                      {a.detail}
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center' }}>
                      <Badge color={es.color} bg={es.bg} border={es.border}>
                        EFFORT · {a.effort}
                      </Badge>
                      <Badge color={is.color} bg={is.bg} border={is.border}>
                        IMPACT · {a.impact}
                      </Badge>
                      <span style={{ color: '#64748B', fontSize: '0.6rem' }}>·</span>
                      <span style={{ color: '#CBD5E1', fontSize: '0.62rem' }}>{a.owner}</span>
                      <span style={{ color: '#64748B', fontSize: '0.6rem' }}>·</span>
                      <span style={{ color: '#94A3B8', fontSize: '0.62rem' }}>{a.timeline}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      <div
        style={{
          borderRadius: 10,
          border: '1px solid #2A2D3E',
          backgroundColor: '#1A1D2E',
          padding: '14px 16px',
        }}
      >
        <SectionLabel>ALTERNATIVE SUPPLIERS</SectionLabel>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.66rem' }}>
            <thead>
              <tr style={{ color: '#64748B', textAlign: 'left' }}>
                {['Supplier', 'Country', 'Lead Time', 'Capacity', 'Risk'].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: '6px 8px',
                      borderBottom: '1px solid #2A2D3E',
                      fontWeight: 700,
                      letterSpacing: '0.08em',
                      fontSize: '0.55rem',
                    }}
                  >
                    {h.toUpperCase()}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {supplier.alternatives.map((alt, i) => {
                const ap = riskProfile(alt.riskScore);
                return (
                  <tr key={i}>
                    <td style={{ padding: '8px', color: '#E2E8F0', fontWeight: 600 }}>{alt.name}</td>
                    <td style={{ padding: '8px', color: '#94A3B8' }}>{alt.country}</td>
                    <td style={{ padding: '8px', color: '#CBD5E1' }}>{alt.leadTime}</td>
                    <td style={{ padding: '8px', color: '#CBD5E1' }}>{alt.capacity}</td>
                    <td style={{ padding: '8px' }}>
                      <span style={{ color: ap.text, fontWeight: 800 }}>{alt.riskScore}</span>
                      <span
                        style={{
                          color: ap.text,
                          fontSize: '0.5rem',
                          marginLeft: 4,
                          letterSpacing: '0.08em',
                        }}
                      >
                        {ap.level}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div
        style={{
          borderRadius: 10,
          border: '1.5px solid rgba(220,38,38,0.5)',
          backgroundColor: 'rgba(220,38,38,0.08)',
          padding: '14px 18px',
        }}
      >
        <div
          style={{
            color: '#F87171',
            fontWeight: 800,
            fontSize: '0.7rem',
            letterSpacing: '0.14em',
            marginBottom: 8,
          }}
        >
          IF WE DO NOTHING
        </div>
        <div style={{ color: '#FECACA', fontSize: '0.72rem', lineHeight: 1.6 }}>
          {supplier.doNothingOutcome}
        </div>
      </div>
    </div>
  );
};

// ── Detail Panel ──────────────────────────────────────────────────────
type TabKey = 'impact' | 'root' | 'mitigate';
const TABS: { id: TabKey; label: string }[] = [
  { id: 'impact', label: 'IMPACT' },
  { id: 'root', label: 'ROOT CAUSE' },
  { id: 'mitigate', label: 'MITIGATE' },
];

const DetailPanel: React.FC<{ supplier: Supplier; onBack: () => void }> = ({ supplier, onBack }) => {
  const [tab, setTab] = useState<TabKey>('impact');
  const p = riskProfile(supplier.overallScore);
  const t = TREND_STYLE[supplier.trend];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div
        style={{
          flexShrink: 0,
          backgroundColor: '#0B0D16',
          borderBottom: '1px solid #1E3A5F',
          padding: '16px 24px',
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
            color: '#94A3B8',
            fontSize: '0.65rem',
            fontWeight: 600,
            padding: 0,
            marginBottom: 12,
          }}
        >
          ◀ All Suppliers
        </button>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: 16,
            flexWrap: 'wrap',
          }}
        >
          <div>
            <h2
              style={{
                color: '#E2E8F0',
                fontSize: '1.5rem',
                fontWeight: 900,
                letterSpacing: '-0.01em',
                marginBottom: 4,
              }}
            >
              {supplier.name}
            </h2>
            <div style={{ color: '#94A3B8', fontSize: '0.7rem', marginBottom: 8 }}>
              {supplier.city}, {supplier.country} · {supplier.region} · Tier {supplier.tier} ·{' '}
              {supplier.sector}
            </div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              <Badge color={t.color} bg={t.bg} border={t.border}>
                {t.arrow} {supplier.trend}
              </Badge>
              <Badge
                color={
                  supplier.daysToImpact <= 30
                    ? '#F87171'
                    : supplier.daysToImpact <= 60
                    ? '#FBBF24'
                    : '#4ADE80'
                }
                bg="rgba(30,58,95,0.4)"
                border="rgba(100,116,139,0.3)"
              >
                {supplier.daysToImpact}d TO IMPACT
              </Badge>
              {supplier.singleSource && (
                <Badge color="#F87171" bg="rgba(220,38,38,0.12)" border="rgba(220,38,38,0.35)">
                  SINGLE SOURCE
                </Badge>
              )}
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
              <span
                style={{
                  color: p.text,
                  fontWeight: 900,
                  fontSize: '2rem',
                  lineHeight: 1,
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                {supplier.overallScore}
              </span>
              <span style={{ color: '#64748B', fontSize: '0.7rem' }}>/ 100</span>
            </div>
            <span
              style={{
                color: p.text,
                fontWeight: 800,
                fontSize: '0.62rem',
                letterSpacing: '0.14em',
              }}
            >
              {p.level}
            </span>
            <Gauge score={supplier.substitutability} label="SUBSTITUTABILITY" />
          </div>
        </div>
      </div>

      <div
        style={{
          flexShrink: 0,
          display: 'flex',
          gap: 2,
          padding: '0 24px',
          backgroundColor: '#0A0C16',
          borderBottom: '1px solid #1E3A5F',
        }}
      >
        {TABS.map((tb) => {
          const active = tab === tb.id;
          return (
            <button
              key={tb.id}
              onClick={() => setTab(tb.id)}
              style={{
                background: 'none',
                border: 'none',
                borderBottom: active ? '2px solid #3B82F6' : '2px solid transparent',
                color: active ? '#60A5FA' : '#64748B',
                padding: '12px 18px',
                cursor: 'pointer',
                fontSize: '0.7rem',
                fontWeight: 800,
                letterSpacing: '0.1em',
                transition: 'color 0.15s, border-color 0.15s',
              }}
            >
              {tb.label}
            </button>
          );
        })}
      </div>

      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '20px 24px',
          scrollbarWidth: 'thin',
          scrollbarColor: '#2A2D3E #0F1117',
        }}
      >
        {tab === 'impact' && <ImpactTab supplier={supplier} />}
        {tab === 'root' && <RootCauseTab supplier={supplier} />}
        {tab === 'mitigate' && <MitigateTab supplier={supplier} />}
      </div>
    </div>
  );
};

// ── Main Export ───────────────────────────────────────────────────────
const SupplierRiskMonitor: React.FC = () => {
  const [selectedId, setSelectedId] = useState<string | null>('winn');
  const selected = SUPPLIERS.find((s) => s.id === selectedId) ?? null;

  const counts = {
    critical: SUPPLIERS.filter((s) => s.overallScore >= 70).length,
    moderate: SUPPLIERS.filter((s) => s.overallScore >= 40 && s.overallScore < 70).length,
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
      <div
        style={{
          flexShrink: 0,
          backgroundColor: '#0A0C16',
          borderBottom: '2px solid #1E3A5F',
          padding: '12px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 20,
          flexWrap: 'wrap',
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
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <span style={{ color: '#94A3B8', fontSize: '0.62rem' }}>
              {SUPPLIERS.length} monitored suppliers
            </span>
            {(
              [
                {
                  count: counts.critical,
                  label: 'CRITICAL',
                  color: '#F87171',
                  bg: 'rgba(220,38,38,0.12)',
                  border: 'rgba(220,38,38,0.3)',
                },
                {
                  count: counts.moderate,
                  label: 'MODERATE',
                  color: '#FBBF24',
                  bg: 'rgba(217,119,6,0.12)',
                  border: 'rgba(217,119,6,0.3)',
                },
                {
                  count: counts.low,
                  label: 'LOW',
                  color: '#4ADE80',
                  bg: 'rgba(22,163,74,0.12)',
                  border: 'rgba(22,163,74,0.3)',
                },
              ] as const
            ).map((s) => (
              <Badge key={s.label} color={s.color} bg={s.bg} border={s.border}>
                {s.count} {s.label}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <div
          style={{
            width: 320,
            flexShrink: 0,
            overflowY: 'auto',
            padding: 16,
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
            borderRight: '1px solid #1E3A5F',
            scrollbarWidth: 'thin',
            scrollbarColor: '#2A2D3E #0F1117',
          }}
        >
          {SUPPLIERS.map((s) => (
            <SupplierCard
              key={s.id}
              supplier={s}
              selected={selectedId === s.id}
              onSelect={() => setSelectedId(s.id)}
            />
          ))}
        </div>

        {selected ? (
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <DetailPanel supplier={selected} onBack={() => setSelectedId(null)} />
          </div>
        ) : (
          <div
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#374151',
              fontSize: '0.75rem',
            }}
          >
            Select a supplier to view details
          </div>
        )}
      </div>
    </div>
  );
};

export default SupplierRiskMonitor;
