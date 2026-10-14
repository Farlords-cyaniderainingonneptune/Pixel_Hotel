import { AIProduct } from '../types/game';

export const INITIAL_AI_PRODUCTS: AIProduct[] = [
  {
    id: 'dynamic-pricing',
    name: 'Dynamic Pricing Engine',
    tagline: 'Real-time ML room rate optimization based on demand, flights & weather',
    category: 'Revenue Ops',
    icon: 'TrendingUp',
    currentLevel: 0,
    maxLevel: 3,
    tiers: [
      {
        level: 1,
        title: 'Rule-Based Surge Heuristics',
        description: 'Applies weekend multipliers and peak-hour surge adjustments automatically.',
        storyPointsCost: 8,
        financialCost: 1500,
        revParBonusPct: 12,
        csatBonus: -2,
        techDebtAdded: 5,
        unlocked: false,
        realWorldContext: 'Standard algorithmic pricing used by early OTAs. Boosts ADR quickly but risks alienating price-sensitive guests during sudden swings.'
      },
      {
        level: 2,
        title: 'Demand Elasticity Gradient Boosting',
        description: 'Scrapes local convention calendars, airline arrivals, and competitor pricing to dynamically price rooms.',
        storyPointsCost: 14,
        financialCost: 3500,
        revParBonusPct: 22,
        csatBonus: 4,
        techDebtAdded: 10,
        unlocked: false,
        realWorldContext: 'Modern hospitality RMS (Revenue Management Systems) like IDeaS/Duetto that predict willingness-to-pay with 8-15% sustained RevPAR lift.'
      },
      {
        level: 3,
        title: 'Reinforcement Learning Bidding Agent',
        description: 'Deep RL agent continuously tuning micro-rates per channel with zero latency and high occupancy preservation.',
        storyPointsCost: 20,
        financialCost: 7500,
        revParBonusPct: 35,
        csatBonus: 8,
        techDebtAdded: 15,
        unlocked: false,
        realWorldContext: 'Cutting-edge multi-agent AI pricing optimizing inventory yields across direct and third-party distribution channels.'
      }
    ]
  },
  {
    id: 'ai-concierge',
    name: 'Multilingual Concierge Agent',
    tagline: '24/7 guest conversational assistant for check-in, dining & instant requests',
    category: 'Guest Experience',
    icon: 'Bot',
    currentLevel: 0,
    maxLevel: 3,
    tiers: [
      {
        level: 1,
        title: 'Self-Serve Kiosk & FAQ Bot',
        description: 'Automates contactless mobile key delivery, Wi-Fi passwords, and basic hotel information.',
        storyPointsCost: 6,
        financialCost: 1200,
        revParBonusPct: 5,
        csatBonus: 10,
        techDebtAdded: 4,
        unlocked: false,
        realWorldContext: 'Over 50% of modern hotel guests prefer mobile kiosk check-ins to skip front desk queues during peak arrivals.'
      },
      {
        level: 2,
        title: 'Contextual In-Stay LLM Concierge',
        description: 'Provides personalized local restaurant reservations, taxi hailing, and room service upselling.',
        storyPointsCost: 12,
        financialCost: 3000,
        revParBonusPct: 14,
        csatBonus: 18,
        techDebtAdded: 8,
        unlocked: false,
        realWorldContext: 'Generative AI concierge grounded on local knowledge graphs, increasing auxiliary food and beverage sales by 18%.'
      },
      {
        level: 3,
        title: 'Multimodal Voice & Vision In-Room Hub',
        description: 'Autonomous voice room assistant with automatic translation in 40 languages and instant staff ticket creation.',
        storyPointsCost: 18,
        financialCost: 6500,
        revParBonusPct: 20,
        csatBonus: 28,
        techDebtAdded: 12,
        unlocked: false,
        realWorldContext: 'Enterprise hotel in-room assistants integrated into IoT controls, smart mirrors, and instant housekeeping dispatch.'
      }
    ]
  },
  {
    id: 'hyper-personalization',
    name: 'Guest Personalization Matrix',
    tagline: 'Vector database storing preferences, pillows, dietary needs & room temperature',
    category: 'Guest Experience',
    icon: 'Sparkles',
    currentLevel: 0,
    maxLevel: 3,
    tiers: [
      {
        level: 1,
        title: 'Dynamic Guest Preference Profiling',
        description: 'Remembers historical pillow firmness, coffee preferences, and floor selection across bookings.',
        storyPointsCost: 7,
        financialCost: 1800,
        revParBonusPct: 6,
        csatBonus: 12,
        techDebtAdded: 4,
        unlocked: false,
        realWorldContext: 'Core hospitality CRM personalization: returning guests arrive to customized rooms, multiplying repeat stay rates.'
      },
      {
        level: 2,
        title: 'Predictive Amenity & Dining Pairings',
        description: 'Recommends tailored breakfast slots and custom spa packages aligned with guest travel personas.',
        storyPointsCost: 13,
        financialCost: 4000,
        revParBonusPct: 16,
        csatBonus: 22,
        techDebtAdded: 9,
        unlocked: false,
        realWorldContext: 'Generative upsell engines driving personalized high-margin ancillary revenue without feeling intrusive.'
      },
      {
        level: 3,
        title: 'AI Curated Travel Itinerary Studio',
        description: 'Synthesizes real-time personalized city guides, museum tickets, and VIP partner bookings directly into hotel bill.',
        storyPointsCost: 19,
        financialCost: 8000,
        revParBonusPct: 26,
        csatBonus: 32,
        techDebtAdded: 14,
        unlocked: false,
        realWorldContext: 'Full concierge ecosystem transformation turning the hotel into an experiential lifestyle platform with partner commissions.'
      }
    ]
  },
  {
    id: 'predictive-iot',
    name: 'Predictive IoT & Facilities AI',
    tagline: 'Acoustic and thermal sensor models detecting HVAC and plumbing faults early',
    category: 'IoT & Facilities',
    icon: 'Cpu',
    currentLevel: 0,
    maxLevel: 3,
    tiers: [
      {
        level: 1,
        title: 'Smart Energy & Eco-Thermostats',
        description: 'Automates HVAC setbacks in unoccupied rooms, cutting daily electricity overhead.',
        storyPointsCost: 6,
        financialCost: 1500,
        revParBonusPct: 4,
        csatBonus: 6,
        techDebtAdded: 3,
        unlocked: false,
        realWorldContext: 'Energy management IoT systems reduce hotel utility bills by 20-30% while maintaining thermal comfort upon guest entry.'
      },
      {
        level: 2,
        title: 'Vibration & Acoustic Anomaly Detection',
        description: 'Predicts elevator cable wear, chiller motor friction, and water pressure leaks 48 hours before failure.',
        storyPointsCost: 12,
        financialCost: 3800,
        revParBonusPct: 10,
        csatBonus: 16,
        techDebtAdded: 7,
        unlocked: false,
        realWorldContext: 'Predictive maintenance cuts unexpected downtime by 70%, preventing disastrous mid-stay guest moves and complaints.'
      },
      {
        level: 3,
        title: 'Autonomous Digital Twin & Self-Healing Ops',
        description: 'Full 3D telemetry simulation with automatic valve shutoffs and instant maintenance drone routing.',
        storyPointsCost: 17,
        financialCost: 7000,
        revParBonusPct: 18,
        csatBonus: 25,
        techDebtAdded: 11,
        unlocked: false,
        realWorldContext: 'Smart building digital twins delivering zero-carbon operations and proactive repair scheduling during turnover windows.'
      }
    ]
  },
  {
    id: 'sentiment-recovery',
    name: 'NLP Sentiment & Service Recovery',
    tagline: 'Real-time sentiment monitoring across chats and instant automated recovery perks',
    category: 'Revenue Ops',
    icon: 'MessageSquareText',
    currentLevel: 0,
    maxLevel: 3,
    tiers: [
      {
        level: 1,
        title: 'Multi-Channel Review Classifier',
        description: 'Aggregates Google, TripAdvisor, and OTA reviews with aspect-based sentiment tagging.',
        storyPointsCost: 5,
        financialCost: 1000,
        revParBonusPct: 5,
        csatBonus: 8,
        techDebtAdded: 3,
        unlocked: false,
        realWorldContext: 'Automated review intelligence helping product and general managers pinpoint systemic service issues quickly.'
      },
      {
        level: 2,
        title: 'In-Stay Frustration Interceptor',
        description: 'Analyzes chat interactions and kiosk hesitation times, alerting duty managers before bad reviews happen.',
        storyPointsCost: 11,
        financialCost: 3200,
        revParBonusPct: 12,
        csatBonus: 19,
        techDebtAdded: 7,
        unlocked: false,
        realWorldContext: 'Early service recovery transforms a disgruntled guest into a loyal advocate before they step out of the lobby.'
      },
      {
        level: 3,
        title: 'Autonomous Compensation & Delight Engine',
        description: 'Empowers AI to autonomously grant late check-out, cocktail vouchers, or loyalty points with fraud prevention.',
        storyPointsCost: 16,
        financialCost: 6200,
        revParBonusPct: 18,
        csatBonus: 30,
        techDebtAdded: 10,
        unlocked: false,
        realWorldContext: 'Algorithmic instant restitution saves customer acquisition costs and boosts post-stay Net Promoter Scores.'
      }
    ]
  },
  {
    id: 'housekeeping-fleet',
    name: 'Autonomous Housekeeping & Ops',
    tagline: 'Dynamic turnover routing and robotic cleaning fleets for rapid room turnarounds',
    category: 'Autonomous Ops',
    icon: 'Boxes',
    currentLevel: 0,
    maxLevel: 3,
    tiers: [
      {
        level: 1,
        title: 'AI Smart Roster & Priority Queue',
        description: 'Optimizes maid schedules based on checkout telemetry and incoming flight arrival times.',
        storyPointsCost: 6,
        financialCost: 1400,
        revParBonusPct: 6,
        csatBonus: 10,
        techDebtAdded: 3,
        unlocked: false,
        realWorldContext: 'Dynamic housekeeping dispatch cuts room vacant-dirty duration from 3 hours down to 45 minutes.'
      },
      {
        level: 2,
        title: 'F&B Food Waste & Inventory Forecaster',
        description: 'Predicts breakfast buffet consumption to eliminate food spoilage and automate wholesale supply orders.',
        storyPointsCost: 11,
        financialCost: 2900,
        revParBonusPct: 12,
        csatBonus: 14,
        techDebtAdded: 6,
        unlocked: false,
        realWorldContext: 'AI kitchen management saves hotels 15% on procurement and supports sustainability accreditations.'
      },
      {
        level: 3,
        title: 'Autonomous Linen Drones & Floor Scrubbers',
        description: 'Fleet of robotic vacuums and automated delivery carts operating during quiet hours.',
        storyPointsCost: 18,
        financialCost: 7200,
        revParBonusPct: 20,
        csatBonus: 26,
        techDebtAdded: 12,
        unlocked: false,
        realWorldContext: 'Cobotics in modern luxury hospitality handles repetitive heavy tasks so human hosts can focus on heartfelt hospitality.'
      }
    ]
  }
];
