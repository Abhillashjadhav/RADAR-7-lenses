export interface LensDefinition {
  name: string;
  abbr: string;
  description: string;
  color: string;
  bgColor: string;
  borderColor: string;
}

export const ALL_LENSES: LensDefinition[] = [
  {
    name: 'Economic/Financial',
    abbr: 'ECO',
    description: 'Commodity prices, cost volatility, contract repricing across supply tiers',
    color: '#60A5FA',
    bgColor: 'rgba(59, 130, 246, 0.15)',
    borderColor: 'rgba(59, 130, 246, 0.4)',
  },
  {
    name: 'Geopolitical',
    abbr: 'GEO',
    description: 'State actions, trade restrictions, sanctions, territorial disputes',
    color: '#C4B5FD',
    bgColor: 'rgba(139, 92, 246, 0.15)',
    borderColor: 'rgba(139, 92, 246, 0.4)',
  },
  {
    name: 'Market Competition',
    abbr: 'MKT',
    description: 'Acreage data, supply/demand shifts, commodity market resets',
    color: '#F9A8D4',
    bgColor: 'rgba(236, 72, 153, 0.15)',
    borderColor: 'rgba(236, 72, 153, 0.4)',
  },
  {
    name: 'Logistics & Transport',
    abbr: 'LOG',
    description: 'Shipping routes, freight costs, port capacity, transit delays',
    color: '#5EEAD4',
    bgColor: 'rgba(20, 184, 166, 0.15)',
    borderColor: 'rgba(20, 184, 166, 0.4)',
  },
  {
    name: 'Catastrophic/Systemic',
    abbr: 'CAT',
    description: 'Cascading failures, systemic shocks, UN emergency declarations',
    color: '#FCA5A5',
    bgColor: 'rgba(239, 68, 68, 0.15)',
    borderColor: 'rgba(239, 68, 68, 0.4)',
  },
  {
    name: 'Labor & Social',
    abbr: 'LAB',
    description: 'Workforce disruption, social unrest, food security crises',
    color: '#FDE047',
    bgColor: 'rgba(234, 179, 8, 0.15)',
    borderColor: 'rgba(234, 179, 8, 0.4)',
  },
  {
    name: 'Multi-tier Supplier Viability',
    abbr: 'SUP',
    description: 'Tier 2/3 supplier health, single-source exposure, buffer depletion',
    color: '#FDBA74',
    bgColor: 'rgba(249, 115, 22, 0.15)',
    borderColor: 'rgba(249, 115, 22, 0.4)',
  },
  {
    name: 'Infrastructure',
    abbr: 'INF',
    description: 'Energy, feedstock, production process infrastructure resilience',
    color: '#9CA3AF',
    bgColor: 'rgba(75, 85, 99, 0.25)',
    borderColor: 'rgba(107, 114, 128, 0.45)',
  },
  {
    name: 'Technology/Cyber',
    abbr: 'TCH',
    description: 'Semiconductor supply, critical components, AI hardware dependencies',
    color: '#6EE7B7',
    bgColor: 'rgba(16, 185, 129, 0.15)',
    borderColor: 'rgba(16, 185, 129, 0.4)',
  },
];
