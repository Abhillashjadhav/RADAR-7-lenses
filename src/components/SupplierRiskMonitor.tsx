import React, { useState } from 'react';

// ── Types ─────────────────────────────────────────────────────────────────────
type RiskLevel = 'CRITICAL' | 'MODERATE' | 'LOW';
type RiskCategory = 'Geopolitical' | 'Cyber' | 'ESG' | 'Financial';
type MitigationEffort = 'Quick Win' | 'Medium Effort' | 'Long-term';

interface RiskDimension {
  category: RiskCategory;
  score: number;
}

interface RiskDriver {
  title: string;
  plainEnglish: string;
  impact: 'HIGH' | 'MEDIUM' | 'LOW';
  dollarTag: string;
  source: string;
  category: RiskCategory;
}

interface Mitigation {
  action: string;
  description: string;
  effort: MitigationEffort;
  recoveryLabel: string;
  timelineWeeks: number;
  owner: string;
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
  trend30d: number;
  lastUpdated: string;
  plainSummary: string;
  alertBanner?: string;
  dimensions: RiskDimension[];
  drivers: RiskDriver[];
  mitigations: Mitigation[];
  signals: {
    timeToImpact: string;
    timeToImpactNote: string;
    substitutability: { score: number; altCount: number; qualWeeks: number };
    financialHealth: { rating: string; trend: 'stable' | 'declining' | 'improving'; source: string };
    tier2Cascade: { score: number; exposed: string };
    newsSentiment: { articles30d: number; tone: 'negative' | 'neutral' | 'positive' };
    concentration: { skus: number };
  };
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function riskProfile(score: number): {
  level: RiskLevel;
  label: string;
  text: string;
  bg: string;
  border: string;
  bar: string;
  glow: string;
} {
  if (score >= 70)
    return { level: 'CRITICAL', label: 'High Risk', text: '#F87171', bg: 'rgba(220,38,38,0.12)', border: 'rgba(220,38,38,0.35)', bar: '#DC2626', glow: 'rgba(220,38,38,0.5)' };
  if (score >= 40)
    return { level: 'MODERATE', label: 'Moderate Risk', text: '#FBBF24', bg: 'rgba(217,119,6,0.12)', border: 'rgba(217,119,6,0.35)', bar: '#D97706', glow: 'rgba(217,119,6,0.4)' };
  return { level: 'LOW', label: 'Low Risk', text: '#4ADE80', bg: 'rgba(22,163,74,0.12)', border: 'rgba(22,163,74,0.35)', bar: '#16A34A', glow: 'rgba(22,163,74,0.4)' };
}

const CAT: Record<RiskCategory, { color: string; bg: string; border: string; icon: string }> = {
  Geopolitical: { color: '#C4B5FD', bg: 'rgba(139,92,246,0.15)', border: 'rgba(139,92,246,0.4)', icon: '🌏' },
  Cyber:        { color: '#6EE7B7', bg: 'rgba(16,185,129,0.15)',  border: 'rgba(16,185,129,0.4)',  icon: '🔒' },
  ESG:          { color: '#FDE047', bg: 'rgba(234,179,8,0.15)',   border: 'rgba(234,179,8,0.4)',   icon: '🌿' },
  Financial:    { color: '#60A5FA', bg: 'rgba(59,130,246,0.15)',  border: 'rgba(59,130,246,0.4)',  icon: '💳' },
};

const IMPACT_COLOR: Record<'HIGH' | 'MEDIUM' | 'LOW', string> = {
  HIGH:   '#F87171',
  MEDIUM: '#FBBF24',
  LOW:    '#4ADE80',
};

const EFFORT_COLOR: Record<MitigationEffort, { text: string; bg: string; border: string }> = {
  'Quick Win':     { text: '#4ADE80', bg: 'rgba(22,163,74,0.12)',   border: 'rgba(22,163,74,0.35)'   },
  'Medium Effort': { text: '#FBBF24', bg: 'rgba(217,119,6,0.12)',   border: 'rgba(217,119,6,0.35)'   },
  'Long-term':     { text: '#93C5FD', bg: 'rgba(59,130,246,0.12)',  border: 'rgba(59,130,246,0.35)'  },
};

// ── Data ──────────────────────────────────────────────────────────────────────
const SUPPLIERS: Supplier[] = [
  {
    id: 'winn',
    name: 'Winn Semiconductors',
    city: 'Zhongli',
    country: 'Taiwan',
    region: 'APAC',
    tier: 1,
    sector: 'PCB / Semiconductor',
    overallScore: 87,
    trend30d: +11,
    lastUpdated: 'May 22, 2026',
    plainSummary: 'Winn sits in a high-risk geography with rising cross-strait tension and is your sole source for 7 critical PCB part numbers.',
    alertBanner: 'Risk score rose 11 points in 30 days — action needed now.',
    dimensions: [
      { category: 'Geopolitical', score: 92 },
      { category: 'Cyber',        score: 74 },
      { category: 'ESG',          score: 40 },
      { category: 'Financial',    score: 35 },
    ],
    drivers: [
      {
        title: 'Taiwan Strait Escalation',
        plainEnglish: 'Military exercises near Taiwan have increased frequency, raising the chance of supply disruption to PCB shipments.',
        impact: 'HIGH',
        dollarTag: 'Largest exposure',
        source: 'Reuters · Nikkei Asia · May 2026',
        category: 'Geopolitical',
      },
      {
        title: 'Single-Source Dependency',
        plainEnglish: 'You have no backup supplier for 7 of your top-spend PCB part numbers. If Winn goes offline, production halts immediately.',
        impact: 'HIGH',
        dollarTag: 'No fallback exists',
        source: 'RADAR supplier mapping',
        category: 'Financial',
      },
      {
        title: 'Ransomware Wave in Taiwan Electronics',
        plainEnglish: 'A ransomware campaign hit 4 Taiwan PCB firms in Jan 2026. Winn has not disclosed its incident-response posture publicly.',
        impact: 'MEDIUM',
        dollarTag: 'Operations at risk',
        source: 'CISA Advisory · ICS-CERT Jan 2026',
        category: 'Cyber',
      },
    ],
    mitigations: [
      {
        action: 'Qualify AT&S (Austria) as alternate PCB supplier',
        description: 'AT&S has comparable specs and EU-based operations. Qualification typically takes 16–20 weeks and removes your single-source exposure.',
        effort: 'Long-term',
        recoveryLabel: 'Removes ~60% of single-source risk',
        timelineWeeks: 18,
        owner: 'Procurement',
      },
      {
        action: 'Build 10-week PCB safety stock',
        description: 'Increase buffer inventory for the 7 sole-sourced part numbers. Buys time to react if a disruption occurs.',
        effort: 'Quick Win',
        recoveryLabel: 'Buys 10 weeks of production runway',
        timelineWeeks: 4,
        owner: 'Supply Planning',
      },
      {
        action: 'Request Winn\'s cyber incident-response plan',
        description: 'Formally request their BCP/DRP documentation as part of annual supplier audit. Flag any gaps to your security team.',
        effort: 'Quick Win',
        recoveryLabel: 'Reduces cyber blind spot',
        timelineWeeks: 2,
        owner: 'Supplier Quality',
      },
    ],
    signals: {
      timeToImpact: '4–8 weeks',
      timeToImpactNote: 'Based on typical strait transit disruption escalation timelines (public historical data).',
      substitutability: { score: 22, altCount: 3, qualWeeks: 18 },
      financialHealth: { rating: 'BB+', trend: 'stable', source: 'S&P Global · 10-K FY2025' },
      tier2Cascade: { score: 71, exposed: 'Copper & glass-fibre from mainland China suppliers' },
      newsSentiment: { articles30d: 47, tone: 'negative' },
      concentration: { skus: 7 },
    },
  },
  {
    id: 'corevo',
    name: 'Corevo Components',
    city: 'Eindhoven',
    country: 'Netherlands',
    region: 'EMEA',
    tier: 2,
    sector: 'Electronic Components',
    overallScore: 61,
    trend30d: +5,
    lastUpdated: 'May 21, 2026',
    plainSummary: 'Corevo failed an EU sustainability audit in Q1 and its operating margin has narrowed for three consecutive quarters per public filings.',
    dimensions: [
      { category: 'ESG',          score: 68 },
      { category: 'Financial',    score: 55 },
      { category: 'Geopolitical', score: 30 },
      { category: 'Cyber',        score: 25 },
    ],
    drivers: [
      {
        title: 'Failed EU CSRD Sustainability Audit',
        plainEnglish: 'Corevo was listed in the EU CSRD non-compliance register in Q1 2026. Fines and operational restrictions are possible in H2.',
        impact: 'HIGH',
        dollarTag: 'Regulatory risk to operations',
        source: 'EUR-Lex · EU CSRD Register · Mar 2026',
        category: 'ESG',
      },
      {
        title: 'Declining Operating Margin',
        plainEnglish: 'Corevo\'s operating margin dropped from 8.2% to 4.1% over three quarters per their annual report. Cash runway is tightening.',
        impact: 'MEDIUM',
        dollarTag: 'Financial stress visible',
        source: 'Corevo Annual Report 2025',
        category: 'Financial',
      },
      {
        title: 'European Electronics Labour Action Risk',
        plainEnglish: 'IndustriALL reports a coordinated strike threat across Dutch electronics manufacturing for Q3 2026.',
        impact: 'MEDIUM',
        dollarTag: 'Delivery delays possible',
        source: 'IndustriALL Global Union · Apr 2026',
        category: 'ESG',
      },
    ],
    mitigations: [
      {
        action: 'Lock in 12-month supply contract now',
        description: 'Secure pricing and volume commitments before potential financial deterioration or an insolvency event.',
        effort: 'Quick Win',
        recoveryLabel: 'Reduces contract disruption risk',
        timelineWeeks: 3,
        owner: 'Procurement',
      },
      {
        action: 'Qualify Molex (US) as alternate source',
        description: 'Molex has comparable component specs and stronger financials. Parallel qualification reduces single-supplier dependency.',
        effort: 'Medium Effort',
        recoveryLabel: 'Removes ~35% of ESG/financial exposure',
        timelineWeeks: 12,
        owner: 'Engineering + Procurement',
      },
      {
        action: 'Request ESG corrective action plan from Corevo',
        description: 'Formally request a CSRD remediation roadmap. Use it to gate future volume awards.',
        effort: 'Quick Win',
        recoveryLabel: 'Reduces compliance exposure',
        timelineWeeks: 3,
        owner: 'Supplier Quality',
      },
    ],
    signals: {
      timeToImpact: '8–16 weeks',
      timeToImpactNote: 'Regulatory fines typically enforced 1–2 quarters after non-compliance listing.',
      substitutability: { score: 55, altCount: 4, qualWeeks: 12 },
      financialHealth: { rating: 'BB−', trend: 'declining', source: 'Moody\'s · Annual Report 2025' },
      tier2Cascade: { score: 38, exposed: 'Polymer resin from Middle East (moderate exposure)' },
      newsSentiment: { articles30d: 14, tone: 'neutral' },
      concentration: { skus: 4 },
    },
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
    trend30d: +3,
    lastUpdated: 'May 22, 2026',
    plainSummary: 'Stable supplier with moderate tariff and logistics exposure due to evolving US–Mexico trade policy and Monterrey water stress.',
    dimensions: [
      { category: 'Geopolitical', score: 49 },
      { category: 'Cyber',        score: 41 },
      { category: 'ESG',          score: 38 },
      { category: 'Financial',    score: 32 },
    ],
    drivers: [
      {
        title: 'US–Mexico Tariff Policy Uncertainty',
        plainEnglish: 'USTR is reviewing electronics tariff schedules under USMCA. A 10–15% tariff increase on connectors would directly raise your landed cost.',
        impact: 'MEDIUM',
        dollarTag: 'COGS impact if tariffs rise',
        source: 'USTR Federal Register · May 2026',
        category: 'Geopolitical',
      },
      {
        title: 'Monterrey Water Stress Advisory',
        plainEnglish: 'Mexican water authority CONAGUA issued a Level 2 water stress advisory for Monterrey. Manufacturing uptime risk if rationing is imposed.',
        impact: 'MEDIUM',
        dollarTag: 'Uptime risk at facility',
        source: 'CONAGUA Public Advisory · Apr 2026',
        category: 'ESG',
      },
      {
        title: 'Probing Activity on Industrial Control Systems',
        plainEnglish: 'US-Mexico manufacturing corridor ISAC flagged increased ICS scanning in the Monterrey area in Q1 2026. Low immediate risk.',
        impact: 'LOW',
        dollarTag: 'Low immediate risk',
        source: 'Manufacturing ISAC Alert · Feb 2026',
        category: 'Cyber',
      },
    ],
    mitigations: [
      {
        action: 'Model tariff impact scenario (+15% on connectors)',
        description: 'Run a landed-cost sensitivity analysis to understand worst-case COGS impact and identify which SKUs to renegotiate.',
        effort: 'Quick Win',
        recoveryLabel: 'Quantifies exposure before it hits',
        timelineWeeks: 2,
        owner: 'Finance + Procurement',
      },
      {
        action: 'Add tariff pass-through clause to next contract',
        description: 'Negotiate FX and tariff sharing language into the upcoming contract renewal to spread risk.',
        effort: 'Medium Effort',
        recoveryLabel: 'Protects margin on tariff changes',
        timelineWeeks: 8,
        owner: 'Legal + Procurement',
      },
      {
        action: 'Request Amphenol water contingency plan',
        description: 'Ask for their operational continuity plan if water rationing is imposed in Monterrey.',
        effort: 'Quick Win',
        recoveryLabel: 'Removes ESG blind spot',
        timelineWeeks: 2,
        owner: 'Supplier Quality',
      },
    ],
    signals: {
      timeToImpact: '12–24 weeks',
      timeToImpactNote: 'Tariff changes typically take effect 1–2 quarters after USTR ruling.',
      substitutability: { score: 68, altCount: 6, qualWeeks: 8 },
      financialHealth: { rating: 'A−', trend: 'stable', source: 'S&P Global · 10-K FY2025' },
      tier2Cascade: { score: 29, exposed: 'Aluminium alloy — diversified sources, low cascade risk' },
      newsSentiment: { articles30d: 8, tone: 'neutral' },
      concentration: { skus: 3 },
    },
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
    trend30d: -2,
    lastUpdated: 'May 20, 2026',
    plainSummary: 'Lowest-risk supplier in your portfolio. Strong financials and political stability. Watch EU energy costs — elevated but stable.',
    dimensions: [
      { category: 'Geopolitical', score: 22 },
      { category: 'Cyber',        score: 18 },
      { category: 'ESG',          score: 15 },
      { category: 'Financial',    score: 12 },
    ],
    drivers: [
      {
        title: 'Elevated EU Industrial Energy Costs',
        plainEnglish: 'European energy prices remain 35% above 2022 levels per Eurostat. This pressures Tier-2 manufacturer margins over the long term.',
        impact: 'LOW',
        dollarTag: 'Margin pressure — long-term',
        source: 'Eurostat Energy Price Index · Q1 2026',
        category: 'Financial',
      },
      {
        title: 'German Export Control Compliance Overhead',
        plainEnglish: 'New EU dual-use export regulations add compliance cost and minor lead time for PCB shipments to non-EU destinations.',
        impact: 'LOW',
        dollarTag: 'Minor lead time impact',
        source: 'BAFA (German Export Authority) · 2025',
        category: 'Geopolitical',
      },
    ],
    mitigations: [
      {
        action: 'Maintain current arrangement — schedule annual review',
        description: 'No immediate action needed. Add TTM to your annual supplier review cycle and set a score threshold alert at 40.',
        effort: 'Quick Win',
        recoveryLabel: 'No action required now',
        timelineWeeks: 0,
        owner: 'Procurement',
      },
    ],
    signals: {
      timeToImpact: '> 6 months',
      timeToImpactNote: 'No near-term trigger identified based on public data.',
      substitutability: { score: 82, altCount: 8, qualWeeks: 6 },
      financialHealth: { rating: 'A+', trend: 'stable', source: 'S&P Global · 10-K FY2025' },
      tier2Cascade: { score: 14, exposed: 'None significant — diversified European raw material base' },
      newsSentiment: { articles30d: 3, tone: 'positive' },
      concentration: { skus: 2 },
    },
  },
];

// ── Small reusables ───────────────────────────────────────────────────────────
const SectionLabel: React.FC<{ children: React.ReactNode; color?: string }> = ({
  children, color = '#3B82F6',
}) => (
  <div style={{
    color,
    fontWeight: 700,
    fontSize: '0.58rem',
    letterSpacing: '0.16em',
    marginBottom: 10,
  }}>
    {children}
  </div>
);

const TrendChip: React.FC<{ delta: number }> = ({ delta }) => {
  const up = delta > 0;
  const eq = delta === 0;
  const color = up ? '#F87171' : eq ? '#6B7280' : '#4ADE80';
  return (
    <span style={{
      backgroundColor: `${color}15`,
      color,
      border: `1px solid ${color}40`,
      borderRadius: 4,
      padding: '1px 7px',
      fontSize: '0.55rem',
      fontWeight: 700,
    }}>
      {up ? '▲' : eq ? '—' : '▼'} {Math.abs(delta)} pts / 30d
    </span>
  );
};

// ── Revenue at Risk block ─────────────────────────────────────────────────────
const RevenueBlock: React.FC<{ prominent?: boolean }> = ({ prominent = false }) => (
  <div style={{
    borderRadius: prominent ? 12 : 8,
    border: `${prominent ? 2 : 1}px solid rgba(251,191,36,${prominent ? 0.4 : 0.18})`,
    backgroundColor: 'rgba(251,191,36,0.04)',
    padding: prominent ? '16px 18px' : '9px 12px',
    position: 'relative',
    overflow: 'hidden',
  }}>
    {prominent && (
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 2,
        background: 'linear-gradient(90deg, transparent, rgba(251,191,36,0.55), transparent)',
      }} />
    )}
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          width: prominent ? 34 : 22,
          height: prominent ? 34 : 22,
          borderRadius: 7,
          backgroundColor: 'rgba(251,191,36,0.1)',
          border: '1px solid rgba(251,191,36,0.28)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: prominent ? '0.9rem' : '0.65rem',
          flexShrink: 0,
        }}>
          💰
        </div>
        <div>
          <div style={{
            color: 'rgba(251,191,36,0.85)',
            fontWeight: 700,
            fontSize: prominent ? '0.68rem' : '0.56rem',
            letterSpacing: '0.1em',
          }}>
            REVENUE AT RISK
          </div>
          {prominent && (
            <div style={{ color: '#4B5563', fontSize: '0.58rem', marginTop: 2 }}>
              Will show $ impact once BOM + COGS data is connected
            </div>
          )}
        </div>
      </div>
      <div style={{ textAlign: 'right' }}>
        <div style={{
          color: '#3D4A5C',
          fontWeight: 700,
          fontSize: prominent ? '1.3rem' : '0.82rem',
          fontFamily: 'monospace',
        }}>
          — —
        </div>
        <div style={{ color: '#374151', fontSize: '0.55rem', fontStyle: 'italic' }}>Data pending</div>
      </div>
    </div>

    {prominent && (
      <div style={{
        marginTop: 12,
        padding: '10px 14px',
        backgroundColor: 'rgba(0,0,0,0.18)',
        borderRadius: 8,
        border: '1px solid rgba(251,191,36,0.1)',
      }}>
        <div style={{ color: '#64748B', fontSize: '0.57rem', fontWeight: 700, letterSpacing: '0.1em', marginBottom: 7 }}>
          WHAT WILL POPULATE THIS FIELD
        </div>
        {[
          ['Bill of Materials (BOM)', 'Which of your parts come from this supplier'],
          ['COGS per part number', 'Cost of each part in your finished product'],
          ['Annual spend volume', 'Total dollar exposure to this supplier'],
        ].map(([item, note]) => (
          <div key={item as string} style={{ display: 'flex', alignItems: 'flex-start', gap: 7, marginBottom: 4 }}>
            <div style={{ width: 4, height: 4, borderRadius: '50%', backgroundColor: 'rgba(251,191,36,0.35)', flexShrink: 0, marginTop: 5 }} />
            <span style={{ color: '#64748B', fontSize: '0.6rem', lineHeight: 1.4 }}>
              <span style={{ color: '#94A3B8', fontWeight: 600 }}>{item as string}</span> — {note as string}
            </span>
          </div>
        ))}
      </div>
    )}
  </div>
);

// ── Supplier card (list view) ─────────────────────────────────────────────────
const SupplierCard: React.FC<{
  supplier: Supplier;
  selected: boolean;
  onSelect: () => void;
}> = ({ supplier, selected, onSelect }) => {
  const p = riskProfile(supplier.overallScore);
  const topDim = [...supplier.dimensions].sort((a, b) => b.score - a.score)[0];

  return (
    <div
      onClick={onSelect}
      style={{
        cursor: 'pointer',
        borderRadius: 12,
        border: selected ? `1.5px solid ${p.bar}` : '1px solid #20243A',
        borderLeft: `4px solid ${p.bar}`,
        backgroundColor: selected ? 'rgba(20,30,55,0.7)' : '#13172A',
        padding: '14px 16px 14px 13px',
        transition: 'all 0.14s',
        boxShadow: selected ? `0 0 18px ${p.glow}20` : 'none',
      }}
    >
      {/* Alert banner */}
      {supplier.alertBanner && (
        <div style={{
          backgroundColor: 'rgba(220,38,38,0.1)',
          border: '1px solid rgba(220,38,38,0.28)',
          borderRadius: 6,
          padding: '5px 10px',
          marginBottom: 10,
          display: 'flex',
          alignItems: 'center',
          gap: 6,
        }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#DC2626', animation: 'pulse 2s infinite', flexShrink: 0 }} />
          <span style={{ color: '#F87171', fontSize: '0.6rem', fontWeight: 600 }}>{supplier.alertBanner}</span>
        </div>
      )}

      {/* Name + score row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 8 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ color: '#E2E8F0', fontWeight: 700, fontSize: '0.92rem', marginBottom: 4 }}>
            {supplier.name}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, flexWrap: 'wrap' }}>
            <span style={{ color: '#4B5563', fontSize: '0.6rem' }}>📍 {supplier.city}, {supplier.country}</span>
            <span style={{ color: '#252838', fontSize: '0.55rem' }}>·</span>
            <span style={{
              backgroundColor: 'rgba(30,58,95,0.35)', color: '#4B5563',
              border: '1px solid #1E3A5F', borderRadius: 3,
              padding: '0px 5px', fontSize: '0.5rem', fontWeight: 700,
            }}>
              TIER {supplier.tier}
            </span>
            <span style={{ color: '#374151', fontSize: '0.58rem' }}>{supplier.sector}</span>
          </div>
        </div>

        {/* Score */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4, marginLeft: 12, flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 3 }}>
            <span style={{ color: p.text, fontWeight: 900, fontSize: '1.55rem', lineHeight: 1 }}>
              {supplier.overallScore}
            </span>
            <span style={{ color: '#374151', fontSize: '0.58rem' }}>/100</span>
          </div>
          <span style={{
            color: p.text, backgroundColor: p.bg, border: `1px solid ${p.border}`,
            borderRadius: 4, padding: '1px 7px', fontSize: '0.5rem', fontWeight: 800, letterSpacing: '0.08em',
          }}>
            {p.label.toUpperCase()}
          </span>
          <TrendChip delta={supplier.trend30d} />
        </div>
      </div>

      {/* Risk bar */}
      <div style={{ height: 4, borderRadius: 2, overflow: 'hidden', backgroundColor: 'rgba(30,42,70,0.5)', marginBottom: 10 }}>
        <div style={{
          height: '100%', width: `${supplier.overallScore}%`,
          background: `linear-gradient(90deg, ${p.bar}80, ${p.bar})`,
          borderRadius: 2, boxShadow: `0 0 5px ${p.glow}`,
        }} />
      </div>

      {/* Top risk + revenue row */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
        <div style={{
          flex: 1,
          backgroundColor: CAT[topDim.category].bg,
          border: `1px solid ${CAT[topDim.category].border}`,
          borderRadius: 7, padding: '7px 10px',
        }}>
          <div style={{ color: '#4B5563', fontSize: '0.5rem', fontWeight: 700, letterSpacing: '0.1em', marginBottom: 3 }}>TOP RISK</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{ fontSize: '0.7rem' }}>{CAT[topDim.category].icon}</span>
            <span style={{ color: CAT[topDim.category].color, fontWeight: 700, fontSize: '0.62rem' }}>{topDim.category}</span>
            <span style={{ color: riskProfile(topDim.score).text, fontWeight: 900, fontSize: '0.9rem', marginLeft: 'auto' }}>{topDim.score}</span>
          </div>
        </div>
        <div style={{
          width: 110,
          backgroundColor: 'rgba(251,191,36,0.03)',
          border: '1px solid rgba(251,191,36,0.18)',
          borderRadius: 7, padding: '7px 10px',
          display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
        }}>
          <div style={{ color: 'rgba(251,191,36,0.55)', fontSize: '0.5rem', fontWeight: 700, letterSpacing: '0.08em' }}>💰 REV AT RISK</div>
          <div style={{ color: '#2D3748', fontSize: '0.72rem', fontWeight: 700, fontFamily: 'monospace' }}>— (pending)</div>
        </div>
      </div>

      {/* CTA */}
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <div style={{
          color: selected ? '#60A5FA' : '#374151',
          fontSize: '0.58rem', fontWeight: 700, letterSpacing: '0.08em',
          display: 'flex', alignItems: 'center', gap: 4,
        }}>
          {selected ? '✓ VIEWING DETAILS' : 'DEEP DIVE →'}
        </div>
      </div>
    </div>
  );
};

// ── Signal tile ───────────────────────────────────────────────────────────────
const SignalTile: React.FC<{
  icon: string;
  label: string;
  value: string;
  subtext: string;
  status: 'critical' | 'moderate' | 'low' | 'info';
  source: string;
}> = ({ icon, label, value, subtext, status, source }) => {
  const colors = {
    critical: { text: '#F87171', border: 'rgba(220,38,38,0.28)', bg: 'rgba(220,38,38,0.06)' },
    moderate: { text: '#FBBF24', border: 'rgba(217,119,6,0.28)',  bg: 'rgba(217,119,6,0.06)'  },
    low:      { text: '#4ADE80', border: 'rgba(22,163,74,0.28)',  bg: 'rgba(22,163,74,0.06)'  },
    info:     { text: '#93C5FD', border: 'rgba(59,130,246,0.22)', bg: 'rgba(59,130,246,0.04)' },
  }[status];

  return (
    <div style={{
      borderRadius: 10,
      border: `1px solid ${colors.border}`,
      backgroundColor: colors.bg,
      padding: '12px 14px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 7 }}>
        <span style={{ fontSize: '0.88rem' }}>{icon}</span>
        <span style={{ color: '#6B7280', fontSize: '0.52rem', fontWeight: 700, letterSpacing: '0.1em' }}>
          {label.toUpperCase()}
        </span>
      </div>
      <div style={{ color: colors.text, fontWeight: 800, fontSize: '0.92rem', marginBottom: 4 }}>{value}</div>
      <div style={{ color: '#64748B', fontSize: '0.58rem', lineHeight: 1.45, marginBottom: 7 }}>{subtext}</div>
      <div style={{ color: '#2D3A4A', fontSize: '0.5rem', borderTop: '1px solid rgba(255,255,255,0.03)', paddingTop: 5, fontStyle: 'italic' }}>
        Source: {source}
      </div>
    </div>
  );
};

// ── Detail panel ──────────────────────────────────────────────────────────────
const DetailPanel: React.FC<{ supplier: Supplier; onBack: () => void }> = ({ supplier, onBack }) => {
  const p = riskProfile(supplier.overallScore);
  const [activeTab, setActiveTab] = useState<'why' | 'what' | 'signals'>('why');
  const sorted = [...supplier.dimensions].sort((a, b) => b.score - a.score);
  const { signals } = supplier;

  const subScore = signals.substitutability.score;
  const subStatus: 'critical' | 'moderate' | 'low' = subScore < 35 ? 'critical' : subScore < 60 ? 'moderate' : 'low';
  const finStatus: 'moderate' | 'low' = signals.financialHealth.trend === 'declining' ? 'moderate' : 'low';
  const tier2Status: 'critical' | 'moderate' | 'low' = signals.tier2Cascade.score >= 60 ? 'critical' : signals.tier2Cascade.score >= 40 ? 'moderate' : 'low';
  const newsStatus: 'moderate' | 'low' | 'info' = signals.newsSentiment.tone === 'negative' ? 'moderate' : signals.newsSentiment.tone === 'positive' ? 'low' : 'info';

  const tabs = [
    { id: 'why'     as const, icon: '❓', label: 'Why is this risky?' },
    { id: 'what'    as const, icon: '🛡️', label: 'What can we do?' },
    { id: 'signals' as const, icon: '📡', label: 'Public signals' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>

      {/* ── Header ── */}
      <div style={{ flexShrink: 0, backgroundColor: '#0B0D18', borderBottom: '1px solid #1A2035', padding: '14px 20px' }}>
        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
          <button onClick={onBack} style={{
            display: 'flex', alignItems: 'center', gap: 4, background: 'none',
            border: 'none', cursor: 'pointer', color: '#4B5563', fontSize: '0.6rem', fontWeight: 600, padding: 0,
          }}>
            ← All Suppliers
          </button>
          <span style={{ color: '#1E3A5F', fontSize: '0.58rem' }}>/</span>
          <span style={{ color: '#64748B', fontSize: '0.6rem', fontWeight: 600 }}>{supplier.name}</span>
        </div>

        {/* Identity + score */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 14 }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 5, flexWrap: 'wrap' }}>
              <h2 style={{ color: '#E2E8F0', fontSize: '1.25rem', fontWeight: 900, margin: 0 }}>{supplier.name}</h2>
              <TrendChip delta={supplier.trend30d} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
              {[`📍 ${supplier.city}, ${supplier.country}`, `Tier ${supplier.tier}`, supplier.region, supplier.sector].map((item, i) => (
                <React.Fragment key={i}>
                  {i > 0 && <span style={{ color: '#1E2A3E', fontSize: '0.58rem' }}>·</span>}
                  <span style={{ color: '#4B5563', fontSize: '0.63rem' }}>{item}</span>
                </React.Fragment>
              ))}
            </div>
            {/* Plain-English summary */}
            <div style={{
              borderLeft: `3px solid ${p.bar}`,
              paddingLeft: 12, paddingRight: 10, paddingTop: 8, paddingBottom: 8,
              backgroundColor: 'rgba(20,28,50,0.4)',
              borderRadius: '0 8px 8px 0',
              color: '#94A3B8', fontSize: '0.66rem', lineHeight: 1.6,
            }}>
              {supplier.plainSummary}
            </div>
          </div>

          {/* Score badge */}
          <div style={{
            flexShrink: 0, textAlign: 'center',
            backgroundColor: p.bg, border: `1.5px solid ${p.border}`,
            borderRadius: 12, padding: '10px 16px',
            boxShadow: `0 0 16px ${p.glow}28`,
          }}>
            <div style={{ color: p.text, fontWeight: 900, fontSize: '2rem', lineHeight: 1 }}>{supplier.overallScore}</div>
            <div style={{ color: '#374151', fontSize: '0.52rem', marginTop: 2 }}>/100</div>
            <div style={{ color: p.text, fontWeight: 800, fontSize: '0.55rem', letterSpacing: '0.1em', marginTop: 5 }}>
              {p.label.toUpperCase()}
            </div>
          </div>
        </div>
      </div>

      {/* ── Revenue block ── */}
      <div style={{ flexShrink: 0, padding: '12px 20px 0', backgroundColor: '#0B0D18' }}>
        <RevenueBlock prominent />
      </div>

      {/* ── Mini score bars ── */}
      <div style={{ flexShrink: 0, padding: '12px 20px', backgroundColor: '#0B0D18', borderBottom: '1px solid #1A2035' }}>
        <SectionLabel>RISK SCORE BREAKDOWN</SectionLabel>
        <div style={{ display: 'flex', gap: 8 }}>
          {sorted.map((dim) => {
            const dp = riskProfile(dim.score);
            const cs = CAT[dim.category];
            return (
              <div key={dim.category} style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                  <span style={{ color: cs.color, fontSize: '0.52rem', fontWeight: 700 }}>{cs.icon} {dim.category}</span>
                  <span style={{ color: dp.text, fontWeight: 800, fontSize: '0.68rem' }}>{dim.score}</span>
                </div>
                <div style={{ height: 4, borderRadius: 2, backgroundColor: 'rgba(30,42,70,0.5)', overflow: 'hidden' }}>
                  <div style={{
                    height: '100%', width: `${dim.score}%`, background: dp.bar, borderRadius: 2,
                    boxShadow: `0 0 4px ${dp.glow}`,
                  }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Tabs ── */}
      <div style={{
        flexShrink: 0, display: 'flex',
        backgroundColor: '#0B0D18', borderBottom: '1px solid #1A2035',
        padding: '0 20px', gap: 2,
      }}>
        {tabs.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            padding: '9px 14px',
            borderBottom: activeTab === tab.id ? '2px solid #3B82F6' : '2px solid transparent',
            color: activeTab === tab.id ? '#60A5FA' : '#4B5563',
            fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.04em', whiteSpace: 'nowrap',
          }}>
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* ── Scrollable body ── */}
      <div style={{
        flex: 1, overflowY: 'auto', padding: '16px 20px',
        display: 'flex', flexDirection: 'column', gap: 12,
        scrollbarWidth: 'thin', scrollbarColor: '#20243A #0B0D18',
      }}>

        {/* WHY TAB */}
        {activeTab === 'why' && (
          <>
            <div style={{ color: '#6B7280', fontSize: '0.63rem', lineHeight: 1.55 }}>
              These are the specific reasons RADAR flagged this supplier. Each is backed by publicly available information — no internal data needed.
            </div>
            {supplier.drivers.map((driver, i) => {
              const ic = IMPACT_COLOR[driver.impact];
              const cs = CAT[driver.category];
              return (
                <div key={i} style={{
                  borderRadius: 10, border: '1px solid #20243A',
                  borderLeft: `3px solid ${ic}`,
                  backgroundColor: '#12162A', padding: '14px 15px',
                }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10, marginBottom: 9 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 6, flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '0.8rem' }}>{cs.icon}</span>
                        <span style={{ color: cs.color, backgroundColor: cs.bg, border: `1px solid ${cs.border}`, borderRadius: 4, padding: '1px 7px', fontSize: '0.5rem', fontWeight: 700 }}>
                          {driver.category.toUpperCase()}
                        </span>
                        <span style={{ color: ic, backgroundColor: `${ic}12`, border: `1px solid ${ic}38`, borderRadius: 4, padding: '1px 7px', fontSize: '0.5rem', fontWeight: 700 }}>
                          {driver.impact} IMPACT
                        </span>
                      </div>
                      <div style={{ color: '#CBD5E1', fontWeight: 700, fontSize: '0.8rem' }}>{driver.title}</div>
                    </div>
                    <div style={{
                      backgroundColor: 'rgba(251,191,36,0.07)', border: '1px solid rgba(251,191,36,0.18)',
                      borderRadius: 6, padding: '4px 8px',
                      color: 'rgba(251,191,36,0.65)', fontSize: '0.52rem', fontWeight: 700,
                      whiteSpace: 'nowrap', flexShrink: 0,
                    }}>
                      💰 {driver.dollarTag}
                    </div>
                  </div>
                  {/* Plain English */}
                  <div style={{
                    backgroundColor: 'rgba(0,0,0,0.18)', borderRadius: 7,
                    padding: '9px 12px', marginBottom: 9,
                    color: '#94A3B8', fontSize: '0.66rem', lineHeight: 1.6,
                  }}>
                    {driver.plainEnglish}
                  </div>
                  {/* Source */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <span style={{ fontSize: '0.65rem' }}>📰</span>
                    <span style={{ color: '#374151', fontSize: '0.54rem' }}>Source:</span>
                    <span style={{
                      color: '#475569', backgroundColor: 'rgba(30,42,70,0.38)',
                      border: '1px solid #1A2035', borderRadius: 4, padding: '1px 7px', fontSize: '0.54rem',
                    }}>
                      {driver.source}
                    </span>
                  </div>
                </div>
              );
            })}
          </>
        )}

        {/* WHAT TAB */}
        {activeTab === 'what' && (
          <>
            <div style={{ color: '#6B7280', fontSize: '0.63rem', lineHeight: 1.55 }}>
              Ranked by how fast you can act. Start with ⚡ Quick Wins. Plan 🔧 Medium Effort items in parallel.
            </div>
            {supplier.mitigations.map((m, i) => {
              const ec = EFFORT_COLOR[m.effort];
              const effortIcon = m.effort === 'Quick Win' ? '⚡' : m.effort === 'Medium Effort' ? '🔧' : '🏗️';
              return (
                <div key={i} style={{ borderRadius: 10, border: '1px solid #20243A', backgroundColor: '#12162A', padding: '14px 15px' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 9 }}>
                    <div style={{
                      flexShrink: 0, width: 26, height: 26, borderRadius: '50%',
                      backgroundColor: `${ec.text}12`, border: `1.5px solid ${ec.text}35`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: ec.text, fontWeight: 900, fontSize: '0.7rem',
                    }}>
                      {i + 1}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 5, flexWrap: 'wrap' }}>
                        <span style={{ color: ec.text, backgroundColor: ec.bg, border: `1px solid ${ec.border}`, borderRadius: 4, padding: '1px 7px', fontSize: '0.5rem', fontWeight: 700 }}>
                          {effortIcon} {m.effort.toUpperCase()}
                        </span>
                        {m.timelineWeeks > 0 && (
                          <span style={{ color: '#4B5563', fontSize: '0.54rem' }}>~{m.timelineWeeks} weeks</span>
                        )}
                        <span style={{ color: '#374151', fontSize: '0.54rem' }}>Owner: {m.owner}</span>
                      </div>
                      <div style={{ color: '#CBD5E1', fontWeight: 700, fontSize: '0.78rem', marginBottom: 7 }}>{m.action}</div>
                    </div>
                  </div>
                  <div style={{
                    backgroundColor: 'rgba(0,0,0,0.18)', borderRadius: 7,
                    padding: '9px 12px', marginBottom: 9,
                    color: '#94A3B8', fontSize: '0.65rem', lineHeight: 1.6,
                  }}>
                    {m.description}
                  </div>
                  <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    backgroundColor: 'rgba(22,163,74,0.05)', border: '1px solid rgba(22,163,74,0.18)',
                    borderRadius: 7, padding: '7px 12px',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontSize: '0.7rem' }}>✅</span>
                      <span style={{ color: '#4B5563', fontSize: '0.55rem', fontWeight: 600 }}>EXPECTED OUTCOME</span>
                    </div>
                    <span style={{ color: '#4ADE80', fontSize: '0.6rem', fontWeight: 700 }}>{m.recoveryLabel}</span>
                  </div>
                </div>
              );
            })}
          </>
        )}

        {/* SIGNALS TAB */}
        {activeTab === 'signals' && (
          <>
            <div style={{ color: '#6B7280', fontSize: '0.63rem', lineHeight: 1.55 }}>
              All signals below come from publicly available sources — company filings, credit ratings, government advisories, and news. No internal data needed.
            </div>

            {/* Time to impact banner */}
            <div style={{
              borderRadius: 10, border: '1px solid rgba(251,191,36,0.28)',
              backgroundColor: 'rgba(251,191,36,0.04)', padding: '13px 16px',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16,
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                  <span style={{ fontSize: '0.9rem' }}>⏱️</span>
                  <span style={{ color: '#6B7280', fontSize: '0.56rem', fontWeight: 700, letterSpacing: '0.1em' }}>
                    ESTIMATED TIME TO IMPACT
                  </span>
                </div>
                <div style={{ color: '#64748B', fontSize: '0.62rem', lineHeight: 1.5, maxWidth: 260 }}>
                  {signals.timeToImpactNote}
                </div>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ color: '#FBBF24', fontWeight: 900, fontSize: '1.2rem' }}>{signals.timeToImpact}</div>
                <div style={{ color: '#374151', fontSize: '0.52rem' }}>if risk materialises</div>
              </div>
            </div>

            {/* 2×2 signal tiles */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <SignalTile
                icon="🔄"
                label="How easy to switch supplier"
                value={subScore < 35 ? 'Hard to replace' : subScore < 60 ? 'Some options' : 'Easy to switch'}
                subtext={`${signals.substitutability.altCount} known alternates · ${signals.substitutability.qualWeeks}wk to qualify`}
                status={subStatus}
                source="RADAR supplier mapping + public vendor data"
              />
              <SignalTile
                icon="💳"
                label="Supplier financial health"
                value={`${signals.financialHealth.rating} — ${signals.financialHealth.trend === 'declining' ? '📉 Declining' : signals.financialHealth.trend === 'stable' ? '→ Stable' : '📈 Improving'}`}
                subtext="Credit rating and operating margin trend"
                status={finStatus}
                source={signals.financialHealth.source}
              />
              <SignalTile
                icon="🏭"
                label="Their own supplier risk"
                value={signals.tier2Cascade.score >= 60 ? 'High cascade risk' : signals.tier2Cascade.score >= 40 ? 'Moderate cascade' : 'Low cascade risk'}
                subtext={signals.tier2Cascade.exposed}
                status={tier2Status}
                source="RADAR Tier-2 mapping · public trade data"
              />
              <SignalTile
                icon="📰"
                label="News & market mood"
                value={`${signals.newsSentiment.articles30d} articles in 30 days`}
                subtext={`Tone: ${signals.newsSentiment.tone} — ${signals.newsSentiment.tone === 'negative' ? 'Monitor closely' : signals.newsSentiment.tone === 'neutral' ? 'Nothing alarming' : 'Positive signals'}`}
                status={newsStatus}
                source="Reuters, Nikkei, Bloomberg headlines"
              />
            </div>

            {/* Parts dependency */}
            <div style={{
              borderRadius: 10, border: '1px solid #20243A', backgroundColor: '#12162A',
              padding: '13px 15px', display: 'flex', alignItems: 'center', gap: 12,
            }}>
              <span style={{ fontSize: '1.3rem' }}>📦</span>
              <div>
                <div style={{ color: '#94A3B8', fontWeight: 700, fontSize: '0.63rem', marginBottom: 4 }}>
                  Parts you depend on from this supplier
                </div>
                <div style={{ color: '#64748B', fontSize: '0.62rem', lineHeight: 1.5 }}>
                  <span style={{ color: '#CBD5E1', fontWeight: 700 }}>{signals.concentration.skus} part numbers</span>
                  {' '}in your product portfolio come from here.{' '}
                  {signals.concentration.skus >= 5
                    ? 'High concentration — diversification recommended.'
                    : signals.concentration.skus >= 3
                    ? 'Moderate concentration — keep monitoring.'
                    : 'Low concentration — manageable.'}
                </div>
              </div>
            </div>

            {/* Data sources callout */}
            <div style={{
              borderRadius: 8, border: '1px solid rgba(59,130,246,0.18)',
              backgroundColor: 'rgba(30,58,95,0.08)', padding: '11px 14px',
            }}>
              <div style={{ color: '#3B82F6', fontSize: '0.56rem', fontWeight: 700, letterSpacing: '0.1em', marginBottom: 7 }}>
                ℹ️ DATA SOURCES USED ON THIS PAGE
              </div>
              {[
                '10-K / Annual Reports — financial health, public statements',
                'S&P Global / Moody\'s — credit ratings (publicly released)',
                'Government advisories — CISA, CONAGUA, BAFA, EUR-Lex',
                'News aggregation — Reuters, Nikkei Asia, Bloomberg',
                'RADAR scoring engine — derived from above, no ERP data needed',
              ].map((s, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 6, marginBottom: 3 }}>
                  <div style={{ width: 3, height: 3, borderRadius: '50%', backgroundColor: '#3B82F6', flexShrink: 0, marginTop: 5 }} />
                  <span style={{ color: '#374151', fontSize: '0.58rem', lineHeight: 1.5 }}>{s}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// ── Main export ───────────────────────────────────────────────────────────────
const SupplierRiskMonitor: React.FC = () => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [filter, setFilter] = useState<'ALL' | 'CRITICAL' | 'MODERATE' | 'LOW'>('ALL');
  const selected = SUPPLIERS.find((s) => s.id === selectedId) ?? null;

  const counts = {
    CRITICAL: SUPPLIERS.filter((s) => s.overallScore >= 70).length,
    MODERATE: SUPPLIERS.filter((s) => s.overallScore >= 40 && s.overallScore < 70).length,
    LOW:      SUPPLIERS.filter((s) => s.overallScore < 40).length,
  };

  const filtered = SUPPLIERS.filter((s) => {
    if (filter === 'CRITICAL') return s.overallScore >= 70;
    if (filter === 'MODERATE') return s.overallScore >= 40 && s.overallScore < 70;
    if (filter === 'LOW')      return s.overallScore < 40;
    return true;
  });

  const filterStyle = (f: typeof filter) => {
    const active = filter === f;
    const clr = { ALL: '#3B82F6', CRITICAL: '#DC2626', MODERATE: '#D97706', LOW: '#16A34A' }[f];
    return {
      background: 'none',
      border: active ? `1px solid ${clr}` : '1px solid #20243A',
      borderRadius: 5, cursor: 'pointer',
      padding: '3px 10px',
      color: active ? clr : '#4B5563',
      fontSize: '0.56rem', fontWeight: 700, letterSpacing: '0.06em',
      backgroundColor: active ? `${clr}15` : 'transparent',
      transition: 'all 0.12s',
    } as React.CSSProperties;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: '#0F1117' }}>

      {/* Sub-header */}
      <div style={{
        flexShrink: 0, backgroundColor: '#0A0C16',
        borderBottom: '2px solid #1A2035',
        padding: '10px 20px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap',
      }}>
        <div>
          <div style={{ color: '#3B82F6', fontWeight: 700, fontSize: '0.56rem', letterSpacing: '0.18em', marginBottom: 5 }}>
            SUPPLIER RISK MONITOR
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <span style={{ color: '#374151', fontSize: '0.58rem' }}>{SUPPLIERS.length} suppliers tracked</span>
            {(['CRITICAL', 'MODERATE', 'LOW'] as const).map((lvl) => {
              const clr = { CRITICAL: '#DC2626', MODERATE: '#D97706', LOW: '#16A34A' }[lvl];
              return (
                <div key={lvl} style={{
                  display: 'flex', alignItems: 'center', gap: 4,
                  backgroundColor: `${clr}12`, border: `1px solid ${clr}38`,
                  borderRadius: 5, padding: '2px 8px',
                }}>
                  <div style={{ width: 5, height: 5, borderRadius: '50%', backgroundColor: clr, boxShadow: `0 0 4px ${clr}` }} />
                  <span style={{ color: clr, fontWeight: 700, fontSize: '0.53rem' }}>
                    {counts[lvl]} {lvl}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <span style={{ color: '#374151', fontSize: '0.56rem', marginRight: 2 }}>Show:</span>
          {(['ALL', 'CRITICAL', 'MODERATE', 'LOW'] as const).map((f) => (
            <button key={f} style={filterStyle(f)} onClick={() => setFilter(f)}>{f}</button>
          ))}
        </div>

        {/* Demo badge */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          backgroundColor: 'rgba(30,58,95,0.18)', border: '1px solid #1E3A5F',
          borderRadius: 8, padding: '6px 12px',
        }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#3B82F6', animation: 'pulse 2s infinite' }} />
          <div>
            <div style={{ color: '#3B82F6', fontWeight: 700, fontSize: '0.52rem', letterSpacing: '0.1em' }}>
              MVP1 · QSC DESIGN REVIEW
            </div>
            <div style={{ color: '#374151', fontSize: '0.48rem' }}>Revenue field: placeholder — awaiting BOM data</div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Supplier list */}
        <div style={{
          width: selected ? 360 : '100%',
          maxWidth: selected ? 360 : 820,
          margin: selected ? 0 : '0 auto',
          flexShrink: 0,
          overflowY: 'auto',
          padding: '14px',
          display: 'flex', flexDirection: 'column', gap: 12,
          borderRight: selected ? '1px solid #1A2035' : 'none',
          scrollbarWidth: 'thin', scrollbarColor: '#20243A #0F1117',
        }}>
          {!selected && (
            <div style={{
              borderRadius: 10, border: '1px solid rgba(59,130,246,0.18)',
              backgroundColor: 'rgba(30,58,95,0.08)', padding: '11px 15px',
              display: 'flex', alignItems: 'center', gap: 10,
            }}>
              <span style={{ fontSize: '0.9rem' }}>👆</span>
              <div style={{ color: '#4B5563', fontSize: '0.62rem', lineHeight: 1.5 }}>
                <span style={{ color: '#94A3B8', fontWeight: 700 }}>Click any supplier card</span>
                {' '}to see exactly why it is flagged, what actions to take, and what public signals say — all in plain language.
              </div>
            </div>
          )}
          {filtered.map((s) => (
            <SupplierCard
              key={s.id}
              supplier={s}
              selected={selectedId === s.id}
              onSelect={() => setSelectedId((prev) => (prev === s.id ? null : s.id))}
            />
          ))}
        </div>

        {/* Detail panel */}
        {selected ? (
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <DetailPanel supplier={selected} onBack={() => setSelectedId(null)} />
          </div>
        ) : (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', borderLeft: '1px solid #111520' }}>
            <div style={{ textAlign: 'center', maxWidth: 270, padding: '0 20px' }}>
              <div style={{ fontSize: '2.4rem', marginBottom: 12 }}>🛰️</div>
              <div style={{ color: '#374151', fontWeight: 700, fontSize: '0.82rem', marginBottom: 6 }}>
                Select a supplier to dive deeper
              </div>
              <div style={{ color: '#1E2A3A', fontSize: '0.63rem', lineHeight: 1.6 }}>
                You will see why it is flagged, the actions you can take to reduce risk, and supporting public data signals.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SupplierRiskMonitor;
