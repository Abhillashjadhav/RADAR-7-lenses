import type { RadarClock, MapMarker, OperatorAction, LensCount } from '../types';

export const RADAR_CLOCKS: RadarClock[] = [
  {
    id: 1,
    name: 'Nitrogen / Corn Planting',
    deadline: 'Mid-April 2026',
    deadlineDate: new Date('2026-04-15'),
    urgency: 'CRITICAL',
    lenses: ['Economic/Financial', 'Geopolitical', 'Market Competition'],
    summary:
      'Urea at $610/tonne makes corn uneconomical. 4.8M acres shifting to soybeans. Downstream food, packaging, and agricultural chemical supply chains repricing.',
    signal:
      'Flag any supplier sourcing corn derivatives or agricultural packaging for cost impact review before mid-April.',
  },
  {
    id: 2,
    name: 'USDA Prospective Plantings Report',
    deadline: 'March 31, 2026',
    deadlineDate: new Date('2026-03-31'),
    urgency: 'CRITICAL',
    lenses: ['Economic/Financial', 'Market Competition', 'Logistics & Transport'],
    summary:
      'Official acreage data resets commodity pricing globally for 12 months. Every supply chain with agricultural input exposure reprices from this single report.',
    signal:
      'Pull supplier exposure to corn and soy-derived inputs. Cross-reference forward contract coverage before March 31.',
  },
  {
    id: 3,
    name: 'FAO Food Price Index',
    deadline: 'April 3, 2026',
    deadlineDate: new Date('2026-04-03'),
    urgency: 'CRITICAL',
    lenses: ['Economic/Financial', 'Catastrophic/Systemic', 'Labor & Social'],
    summary:
      'First post-Hormuz commodity reading. If it breaches the 2022 peak of 159.7, a UN food emergency declaration becomes probable — triggering export restrictions across manufacturing hubs.',
    signal:
      'Map Tier 2 and Tier 3 suppliers in high food-import-dependency countries. Flag for labour disruption and export restriction risk.',
  },
  {
    id: 4,
    name: 'India Pharmaceutical API Buffers',
    deadline: 'Late May 2026',
    deadlineDate: new Date('2026-05-25'),
    urgency: 'ELEVATED',
    lenses: ['Multi-tier Supplier Viability', 'Infrastructure', 'Economic/Financial'],
    summary:
      'India supplies 47% of US generics. Methanol (87.7% Hormuz-exposed) feeds API production. Buffer depletion window: late May. Requalifying an alternate API supplier takes 12–18 months.',
    signal:
      'Identify Tier 2 and Tier 3 suppliers in India\'s pharmaceutical belt. Flag methanol-dependent production processes.',
  },
  {
    id: 5,
    name: 'China Commercial Crude Reserve Draw',
    deadline: 'Mid to Late April 2026',
    deadlineDate: new Date('2026-04-20'),
    urgency: 'ELEVATED',
    lenses: ['Geopolitical', 'Economic/Financial', 'Catastrophic/Systemic'],
    summary:
      'China drawing reserves at 1M barrels/day from March 19. Exhaustion window: 4–6 weeks. At depletion, China chooses options that each reprice petroleum-derived manufacturing inputs globally — plastics, resins, adhesives, coatings.',
    signal:
      'Flag any supplier using petroleum-derived inputs. Pre-position inventory hedges before the exhaustion window closes.',
  },
  {
    id: 6,
    name: 'Semiconductor Helium Inventory',
    deadline: 'Late May to Early June 2026',
    deadlineDate: new Date('2026-05-28'),
    urgency: 'ELEVATED',
    lenses: ['Technology/Cyber', 'Infrastructure', 'Multi-tier Supplier Viability'],
    summary:
      'South Korea imports 64.7% of helium from Qatar\'s Ras Laffan — offline. SK Hynix and Samsung depletion window: late May. DRAM and NAND production rationing affects the entire AI hardware supply chain.',
    signal:
      'Map suppliers sourcing semiconductors from Korean foundries. Identify alternative chip supply routes from TSMC or Micron. Lead time: 8–16 weeks.',
  },
  {
    id: 7,
    name: 'Marine War Risk Insurance',
    deadline: '6–16 Months Post-Ceasefire',
    deadlineDate: new Date('2027-06-01'),
    urgency: 'MONITOR',
    lenses: ['Logistics & Transport', 'Catastrophic/Systemic', 'Economic/Financial'],
    summary:
      'Solvency II requires 30–60 days of zero incidents before P&I clubs can reinstate. Based on Red Sea precedent (26 months and counting), logistics costs stay structurally elevated long after headlines move on.',
    signal:
      'Any supplier contract with pre-February 2026 freight cost assumptions should be revised. Cape of Good Hope routing adds 10–14 days and $800–1,200 per container — model this as the baseline through 2027.',
  },
];

export const MAP_MARKERS: MapMarker[] = [
  {
    lat: 26.5,
    lng: 56.3,
    label: 'Strait of Hormuz',
    urgency: 'CRITICAL',
    clockId: 3,
    clockName: 'FAO Food Price Index',
    summary: 'First post-Hormuz commodity reading. UN food emergency risk.',
  },
  {
    lat: 17.38,
    lng: 78.48,
    label: 'Hyderabad (Pharma Belt)',
    urgency: 'ELEVATED',
    clockId: 4,
    clockName: 'India Pharmaceutical API Buffers',
    summary: 'Methanol-dependent API production. Buffer depletion: late May.',
  },
  {
    lat: 23.03,
    lng: 72.58,
    label: 'Ahmedabad (Pharma Belt)',
    urgency: 'ELEVATED',
    clockId: 4,
    clockName: 'India Pharmaceutical API Buffers',
    summary: 'India supplies 47% of US generics. Hormuz exposure: 87.7%.',
  },
  {
    lat: 37.57,
    lng: 126.98,
    label: 'Seoul (SK Hynix / Samsung)',
    urgency: 'ELEVATED',
    clockId: 6,
    clockName: 'Semiconductor Helium Inventory',
    summary: '64.7% helium from Ras Laffan (offline). DRAM/NAND rationing risk.',
  },
  {
    lat: 10.82,
    lng: 106.63,
    label: 'Vietnam (PCB Manufacturing)',
    urgency: 'MONITOR',
    clockId: 7,
    clockName: 'Marine War Risk Insurance',
    summary: 'Logistics cost elevation. Cape of Good Hope re-routing baseline.',
  },
  {
    lat: 39.91,
    lng: 116.39,
    label: 'China (Crude Reserves)',
    urgency: 'ELEVATED',
    clockId: 5,
    clockName: 'China Commercial Crude Reserve Draw',
    summary: 'Drawing 1M bbl/day from Mar 19. Exhaustion: 4–6 weeks.',
  },
  {
    lat: 25.9,
    lng: 51.55,
    label: 'Qatar — Ras Laffan LNG',
    urgency: 'ELEVATED',
    clockId: 6,
    clockName: 'Semiconductor Helium Inventory',
    summary: 'Ras Laffan offline. South Korea helium supply chain disrupted.',
  },
];

export const OPERATOR_ACTIONS: OperatorAction[] = [
  {
    id: 1,
    text: 'Pull supplier exposure to corn and soy-derived inputs. Cross-reference forward contract coverage before March 31.',
    impactBucket: 'Cost',
    clockId: 2,
    urgency: 'CRITICAL',
  },
  {
    id: 2,
    text: 'Map Tier 2 and Tier 3 suppliers in high food-import-dependency countries. Flag for labour disruption and export restriction risk.',
    impactBucket: 'Compliance',
    clockId: 3,
    urgency: 'CRITICAL',
  },
  {
    id: 3,
    text: 'Flag any supplier sourcing corn derivatives or agricultural packaging for cost impact review before mid-April.',
    impactBucket: 'Delivery',
    clockId: 1,
    urgency: 'CRITICAL',
  },
];

export const LENS_COUNTS: LensCount[] = [
  { lens: 'Economic/Financial', count: 5 },
  { lens: 'Logistics & Transport', count: 3 },
  { lens: 'Multi-tier Supplier Viability', count: 3 },
  { lens: 'Catastrophic/Systemic', count: 2 },
  { lens: 'Geopolitical', count: 2 },
  { lens: 'Technology/Cyber', count: 1 },
  { lens: 'Labor & Social', count: 1 },
];
