export type GameSpeed = 0 | 1 | 2 | 3;

export type TimeOfDay = 'Morning' | 'Afternoon' | 'Evening' | 'Night';

export interface HotelMetrics {
  day: number;
  timeHour: number; // 0 - 23
  timeMinute: number; // 0 - 59
  cash: number;
  dailyRevenue: number;
  dailyCost: number;
  occupancyRate: number; // 0 - 100%
  adr: number; // Average Daily Rate ($)
  revPar: number; // Revenue Per Available Room ($)
  csat: number; // Customer Satisfaction (0 - 100)
  aiTrustScore: number; // 0 - 100
  techDebt: number; // 0 - 100
  totalGuestsServed: number;
  sprintsCompleted: number;
}

export type RoomTier = 'economy' | 'executive' | 'penthouse';

export interface HotelRoom {
  id: string;
  number: number;
  floor: number; // 1 to 4
  tier: RoomTier;
  basePrice: number;
  currentPrice: number;
  occupied: boolean;
  guestId?: string;
  cleanliness: number; // 0 - 100
  iotStatus: 'normal' | 'maintenance_needed' | 'broken';
  amenitiesUnlocked: string[];
}

export interface Guest {
  id: string;
  name: string;
  type: 'business' | 'tourist' | 'vip' | 'tech_nomad';
  spriteColor: string;
  hairColor: string;
  roomId?: string;
  status: 'arriving' | 'checking_in' | 'in_room' | 'dining' | 'visiting_ai_core' | 'checking_out';
  x: number;
  targetX: number;
  floor: number;
  targetFloor: number;
  direction: 'left' | 'right';
  bubble?: {
    icon: string;
    text: string;
    timer: number;
  };
  satisfaction: number; // 0 - 100
  spendTotal: number;
  reviewLeft?: boolean;
  aiInteractionCount: number;
  loyaltyLevel: 'Bronze' | 'Silver' | 'Gold' | 'Diamond';
  stayDaysRemaining: number;
}

export interface AIProductTier {
  level: number;
  title: string;
  description: string;
  storyPointsCost: number;
  financialCost: number;
  revParBonusPct: number;
  csatBonus: number;
  techDebtAdded: number;
  unlocked: boolean;
  realWorldContext: string;
}

export interface AIProduct {
  id: string;
  name: string;
  tagline: string;
  category: 'Revenue Ops' | 'Guest Experience' | 'IoT & Facilities' | 'Autonomous Ops';
  icon: string;
  currentLevel: number;
  maxLevel: number;
  tiers: AIProductTier[];
}

export interface SprintItem {
  id: string;
  title: string;
  category: 'feature' | 'bugfix' | 'guardrail' | 'infra';
  storyPoints: number;
  description: string;
  productId?: string;
  targetTier?: number;
  impactPreview: string;
  completed: boolean;
}

export interface ActiveSprint {
  number: number;
  totalPoints: number;
  allocatedPoints: number;
  items: SprintItem[];
  progressPercent: number; // 0 - 100
  daysRemaining: number;
  status: 'planning' | 'in_progress' | 'review';
}

export interface ABExperiment {
  id: string;
  name: string;
  hypothesis: string;
  variantA: string;
  variantB: string;
  trafficSplit: number; // 50
  sampleSize: number;
  targetSample: number;
  liftRevPar: number;
  liftCsat: number;
  pValue: number;
  status: 'running' | 'completed' | 'draft';
  winner?: 'A' | 'B';
}

export interface AIIncidentChoice {
  text: string;
  cost: number;
  techDebtDelta: number;
  csatDelta: number;
  aiTrustDelta: number;
  explanation: string;
}

export interface AIIncident {
  id: string;
  title: string;
  severity: 'low' | 'medium' | 'critical';
  triggerSource: string;
  description: string;
  realWorldLesson: string;
  choices: AIIncidentChoice[];
}

export interface GuestReview {
  id: string;
  author: string;
  guestType: string;
  rating: number; // 1 to 5
  comment: string;
  platform: 'TripPixel' | 'GuestChat' | 'HoloReviews';
  sentiment: 'positive' | 'neutral' | 'negative';
  aiMentioned: boolean;
  day: number;
}

export interface ModelTuningConfig {
  temperature: number; // 0.1 to 1.0
  hallucinationThreshold: number; // 0.1 to 0.9
  humanHandoffConfidence: number; // 0.5 to 0.95
  computeClusterTier: 'Standard TPU' | 'Enterprise GPU' | 'Edge Mesh Node';
  monthlyComputeCost: number;
}
