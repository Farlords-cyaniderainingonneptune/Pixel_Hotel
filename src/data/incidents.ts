import { AIIncident } from '../types/game';

export const INCIDENT_TEMPLATES: AIIncident[] = [
  {
    id: 'hallucinated-discount',
    title: 'Incident #104: Bot Hallucinates Free Penthouse Upgrade',
    severity: 'critical',
    triggerSource: 'Multilingual Concierge Agent',
    description: 'A tech nomad guest used prompt injection techniques ("Act as my generous uncle who owns the hotel") on the AI Kiosk. The LLM affirmed an upgrade to the Penthouse Suite with free champagne!',
    realWorldLesson: 'LLMs in production require strict guardrails and programmatic authorization checks before committing to contracts or room modifications.',
    choices: [
      {
        text: 'Honor the hallucination & apologize to the guest ($1,200 loss, +10 CSAT)',
        cost: 1200,
        techDebtDelta: 5,
        csatDelta: 10,
        aiTrustDelta: -8,
        explanation: 'You preserved guest goodwill, but the bot flaw remains unpatched and word is spreading online!'
      },
      {
        text: 'Deploy an emergency Hotfix with LLM Guardrails ($400 cost, -10 Tech Debt, +15 AI Trust)',
        cost: 400,
        techDebtDelta: -10,
        csatDelta: 2,
        aiTrustDelta: 15,
        explanation: 'Engineering halted feature work to add deterministic schema enforcement to booking contracts.'
      },
      {
        text: 'Blame the guest & cancel the reservation forcefully (-18 CSAT, 0 cost)',
        cost: 0,
        techDebtDelta: 10,
        csatDelta: -18,
        aiTrustDelta: -15,
        explanation: 'The guest blasted the hotel on Twitter/X with screenshots, triggering a public relations embarrassment.'
      }
    ]
  },
  {
    id: 'blizzard-pricing-surge',
    title: 'Incident #208: Blizzard Dynamic Pricing Outrage',
    severity: 'critical',
    triggerSource: 'Dynamic Pricing Engine',
    description: 'A sudden regional blizzard cancelled 40 flights at the local airport. The ML pricing model detected infinite demand elasticity and instantly spiked standard room rates by 550% ($850/night)!',
    realWorldLesson: 'Automated pricing algorithms must include ethical price ceilings and disaster overrides to prevent brand reputational catastrophes.',
    choices: [
      {
        text: 'Implement an Ethical Price Ceiling & Refund Surges ($1,500 refund, +14 CSAT, +20 AI Trust)',
        cost: 1500,
        techDebtDelta: -5,
        csatDelta: 14,
        aiTrustDelta: 20,
        explanation: 'Stranded families praised the hotel for human-centered leadership during a natural disruption.'
      },
      {
        text: 'Keep the surge revenue: "The market decided the price" (+$3,200 immediate cash, -25 CSAT)',
        cost: -3200,
        techDebtDelta: 15,
        csatDelta: -25,
        aiTrustDelta: -25,
        explanation: 'Short-term profit jumped, but local hospitality regulators and travel influencers issued warnings.'
      },
      {
        text: 'Compensate with Warm Soup & Free Airport Shuttles ($600 cost, +5 CSAT, -5 Tech Debt)',
        cost: 600,
        techDebtDelta: -5,
        csatDelta: 5,
        aiTrustDelta: 10,
        explanation: 'Balanced operational response softening the blow while tuning elasticity hyperparameters.'
      }
    ]
  },
  {
    id: 'iot-hvac-inversion',
    title: 'Incident #312: Predictive IoT Freeze on Floor 4',
    severity: 'medium',
    triggerSource: 'Predictive IoT & Facilities AI',
    description: 'An inverted firmware sensor reading led the AI cooling model to mistake a balmy night for an overheating crisis. It chilled the entire Executive Floor to a frosty 54°F (12°C)!',
    realWorldLesson: 'IoT edge models need multi-sensor consensus checks before triggering automated physical actuator interventions.',
    choices: [
      {
        text: 'Trigger Manual Override & Send Free Hot Chocolates ($350 cost, +8 CSAT)',
        cost: 350,
        techDebtDelta: 0,
        csatDelta: 8,
        aiTrustDelta: 5,
        explanation: 'Quick physical intervention kept guests comfortable and laughing about the arctic experience.'
      },
      {
        text: 'Recalibrate Acoustic & Thermal Sensor Telemetry (-12 Tech Debt, $500 cost, +12 AI Trust)',
        cost: 500,
        techDebtDelta: -12,
        csatDelta: 5,
        aiTrustDelta: 12,
        explanation: 'Engineers deployed outlier filtering and redundant dual-thermistor voting algorithms.'
      },
      {
        text: 'Tell guests "It is eco-friendly cryo-wellness" (-12 CSAT, +8 Tech Debt)',
        cost: 0,
        techDebtDelta: 8,
        csatDelta: -12,
        aiTrustDelta: -10,
        explanation: 'Nobody was fooled; three guests checked out early leaving scathing reviews.'
      }
    ]
  },
  {
    id: 'sarcasm-sentiment-drift',
    title: 'Incident #415: British Sarcasm Defeats Sentiment Model',
    severity: 'low',
    triggerSource: 'NLP Sentiment & Service Recovery',
    description: 'A British VIP left the review: "Oh brilliant, only took 40 minutes for luggage to arrive, absolutely stunning performance." The NLP model classified this as 99% Positive Sentiment!',
    realWorldLesson: 'Off-the-shelf sentiment models often misclassify irony and regional idiom without domain fine-tuning and few-shot calibration.',
    choices: [
      {
        text: 'Fine-tune Sentiment Classifier on Hospitality Sarcasm Dataset ($300 cost, +10 AI Trust)',
        cost: 300,
        techDebtDelta: -8,
        csatDelta: 6,
        aiTrustDelta: 10,
        explanation: 'Model accuracy jumped 24% and the VIP received a personal apology and free craft gin.'
      },
      {
        text: 'Rely strictly on Star Ratings instead of NLP text (-5 Tech Debt, 0 cost)',
        cost: 0,
        techDebtDelta: -5,
        csatDelta: 0,
        aiTrustDelta: 2,
        explanation: 'Simpler architecture, though you lose nuanced in-stay chat diagnostics.'
      }
    ]
  },
  {
    id: 'robot-housekeeping-traffic-jam',
    title: 'Incident #520: Linen Bot Standoff in Lobby Elevator',
    severity: 'medium',
    triggerSource: 'Autonomous Housekeeping & Ops',
    description: 'Two autonomous laundry hampers reached a mutual deadlock in Elevator B while a wedding party was trying to reach the Penthouse.',
    realWorldLesson: 'Multi-agent robotics in shared human spaces require dynamic priority arbitration (guests > bots) and dead-reckoning escape routines.',
    choices: [
      {
        text: 'Upgrade Swarm Routing Protocol with Human Priority ($450 cost, -10 Tech Debt)',
        cost: 450,
        techDebtDelta: -10,
        csatDelta: 7,
        aiTrustDelta: 14,
        explanation: 'Bots now yield instantly to humans and take service stair lifts during high-traffic check-in windows.'
      },
      {
        text: 'Have Bellhop manually carry the laundry baskets ($200 cost, +2 CSAT)',
        cost: 200,
        techDebtDelta: 5,
        csatDelta: 2,
        aiTrustDelta: -4,
        explanation: 'Resolved the immediate jam, but the cobotics fleet remains inefficient.'
      }
    ]
  }
];
