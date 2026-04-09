export type Urgency = 'CRITICAL' | 'ELEVATED' | 'MONITOR';
export type ImpactBucket = 'Delivery' | 'Compliance' | 'Cost';

export interface RiskLens {
  name: string;
}

export interface RadarClock {
  id: number;
  name: string;
  deadline: string;
  deadlineDate: Date;
  urgency: Urgency;
  lenses: string[];
  summary: string;
  signal: string;
  mapMarkers?: MapMarker[];
}

export interface MapMarker {
  lat: number;
  lng: number;
  label: string;
  urgency: Urgency;
  clockId: number;
  clockName: string;
  summary: string;
}

export interface OperatorAction {
  id: number;
  text: string;
  impactBucket: ImpactBucket;
  clockId: number;
  urgency: Urgency;
}

export interface LensCount {
  lens: string;
  count: number;
}
