/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  HotelMetrics,
  HotelRoom,
  Guest,
  AIProduct,
  ActiveSprint,
  SprintItem,
  ABExperiment,
  AIIncident,
  AIIncidentChoice,
  GuestReview,
  ModelTuningConfig,
  GameSpeed,
} from './types/game';
import { INITIAL_AI_PRODUCTS } from './data/aiProducts';
import { INCIDENT_TEMPLATES } from './data/incidents';
import { sound } from './services/sound';
import { PixelCanvas } from './components/PixelCanvas';
import { HeaderHUD } from './components/HeaderHUD';
import { RoadmapView } from './components/RoadmapView';
import { ExperimentationLab } from './components/ExperimentationLab';
import { MetricsDashboard } from './components/MetricsDashboard';
import { IncidentModal } from './components/IncidentModal';
import { RoomModal } from './components/RoomModal';
import { GuestModal } from './components/GuestModal';
import { HelpGuideModal } from './components/HelpGuideModal';

const INITIAL_ROOMS: HotelRoom[] = [
  // Penthouse (Floor 4)
  {
    id: 'room-401',
    number: 401,
    floor: 4,
    tier: 'penthouse',
    basePrice: 550,
    currentPrice: 550,
    occupied: false,
    cleanliness: 100,
    iotStatus: 'normal',
    amenitiesUnlocked: ['Smart Bar', 'Panoramic Jacuzzi', 'Neural Sleep Soundscape']
  },
  {
    id: 'room-402',
    number: 402,
    floor: 4,
    tier: 'penthouse',
    basePrice: 500,
    currentPrice: 500,
    occupied: false,
    cleanliness: 100,
    iotStatus: 'normal',
    amenitiesUnlocked: ['Smart Mirror', 'Champagne Cooler']
  },
  // Executive (Floor 3)
  {
    id: 'room-301',
    number: 301,
    floor: 3,
    tier: 'executive',
    basePrice: 280,
    currentPrice: 280,
    occupied: false,
    cleanliness: 95,
    iotStatus: 'normal',
    amenitiesUnlocked: ['Ergonomic Workspace', 'High-Speed Wi-Fi 7']
  },
  {
    id: 'room-302',
    number: 302,
    floor: 3,
    tier: 'executive',
    basePrice: 260,
    currentPrice: 260,
    occupied: false,
    cleanliness: 90,
    iotStatus: 'normal',
    amenitiesUnlocked: ['Nespresso Smart Pod', 'Wireless Charging Pad']
  },
  {
    id: 'room-303',
    number: 303,
    floor: 3,
    tier: 'executive',
    basePrice: 290,
    currentPrice: 290,
    occupied: false,
    cleanliness: 100,
    iotStatus: 'normal',
    amenitiesUnlocked: ['Dual Monitor Dock', 'Smart Curtains']
  },
  // Smart Pods (Floor 2)
  {
    id: 'room-201',
    number: 201,
    floor: 2,
    tier: 'economy',
    basePrice: 140,
    currentPrice: 140,
    occupied: false,
    cleanliness: 100,
    iotStatus: 'normal',
    amenitiesUnlocked: ['Keyless NFC Doorlock', 'USB-C Fast Charging']
  },
  {
    id: 'room-202',
    number: 202,
    floor: 2,
    tier: 'economy',
    basePrice: 130,
    currentPrice: 130,
    occupied: false,
    cleanliness: 90,
    iotStatus: 'normal',
    amenitiesUnlocked: ['Smart Mood Lighting']
  },
  {
    id: 'room-203',
    number: 203,
    floor: 2,
    tier: 'economy',
    basePrice: 150,
    currentPrice: 150,
    occupied: false,
    cleanliness: 100,
    iotStatus: 'normal',
    amenitiesUnlocked: ['Compact Smart Desk']
  }
];

const INITIAL_EXPERIMENTS: ABExperiment[] = [
  {
    id: 'exp-pricing-1',
    name: 'Dynamic Pricing Elasticity Algorithm',
    hypothesis: 'Testing demand-elastic surge pricing (+15% weekend multiplier) against flat fixed rate.',
    variantA: 'Control: Flat $200 Base Rate',
    variantB: 'Challenger: ML Dynamic Elasticity',
    trafficSplit: 50,
    sampleSize: 42,
    targetSample: 60,
    liftRevPar: 16.4,
    liftCsat: 3,
    pValue: 0.032,
    status: 'running'
  },
  {
    id: 'exp-concierge-2',
    name: 'Concierge LLM Prompt Persona & Tone',
    hypothesis: 'Comparing formal luxury butler tone with warm conversational hospitality assistant.',
    variantA: 'Formal British Royal Butler',
    variantB: 'Warm Friendly Local Expert',
    trafficSplit: 50,
    sampleSize: 55,
    targetSample: 75,
    liftRevPar: 8.2,
    liftCsat: 12,
    pValue: 0.018,
    status: 'running'
  },
  {
    id: 'exp-recovery-3',
    name: 'Automated Service Recovery Incentive',
    hypothesis: 'Does granting a free 14:00 late checkout resolve complaints better than a $25 beverage voucher?',
    variantA: '$25 In-Stay F&B Credit',
    variantB: 'Guaranteed 14:00 Late Checkout',
    trafficSplit: 50,
    sampleSize: 28,
    targetSample: 50,
    liftRevPar: -2.1,
    liftCsat: 14,
    pValue: 0.045,
    status: 'running'
  }
];

const INITIAL_REVIEWS: GuestReview[] = [
  {
    id: 'rev-1',
    author: 'Elena Rostova',
    guestType: 'VIP Guest',
    rating: 5,
    comment: 'The AI Kiosk checked me in within 8 seconds without paper forms. Room 401 was pre-cooled to my exact 68°F preference!',
    platform: 'TripPixel',
    sentiment: 'positive',
    aiMentioned: true,
    day: 1
  },
  {
    id: 'rev-2',
    author: 'Marcus Vance',
    guestType: 'Business',
    rating: 4,
    comment: 'Great Wi-Fi speeds and loved the automated breakfast ordering. A bit surprised by the surge price on Friday night, but worth it.',
    platform: 'HoloReviews',
    sentiment: 'positive',
    aiMentioned: true,
    day: 1
  }
];

const GUEST_NAMES = [
  'Arthur Pendelton', 'Sophia Lin', 'Darius Stone', 'Chloe Dubois',
  'Liam Gallagher', 'Amina Idris', 'Taro Tanaka', 'Maya Patel',
  'Felix Berg', 'Zoe Chen', 'Lucas Rivera', 'Nadia Kowalski'
];

export default function App() {
  // Game Speed & Navigation
  const [gameSpeed, setGameSpeed] = useState<GameSpeed>(1);
  const [activeTab, setActiveTab] = useState<'simulation' | 'roadmap' | 'ab_lab' | 'analytics'>('simulation');

  // Media & retro visual toggles
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState<boolean>(false);
  const [crtEnabled, setCrtEnabled] = useState<boolean>(true);

  // Core Simulation Metrics
  const [metrics, setMetrics] = useState<HotelMetrics>({
    day: 1,
    timeHour: 9,
    timeMinute: 0,
    cash: 12500,
    dailyRevenue: 1800,
    dailyCost: 650,
    occupancyRate: 62.5,
    adr: 280,
    revPar: 175,
    csat: 82,
    aiTrustScore: 88,
    techDebt: 18,
    totalGuestsServed: 8,
    sprintsCompleted: 0
  });

  // Hotel Entities
  const [rooms, setRooms] = useState<HotelRoom[]>(INITIAL_ROOMS);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [products, setProducts] = useState<AIProduct[]>(INITIAL_AI_PRODUCTS);
  const [experiments, setExperiments] = useState<ABExperiment[]>(INITIAL_EXPERIMENTS);
  const [reviews, setReviews] = useState<GuestReview[]>(INITIAL_REVIEWS);

  // Active Sprint
  const [activeSprint, setActiveSprint] = useState<ActiveSprint>({
    number: 1,
    totalPoints: 20,
    allocatedPoints: 0,
    items: [],
    progressPercent: 0,
    daysRemaining: 3,
    status: 'planning'
  });

  // Active Model Configuration
  const [modelConfig, setModelConfig] = useState<ModelTuningConfig>({
    temperature: 0.4,
    hallucinationThreshold: 0.65,
    humanHandoffConfidence: 0.75,
    computeClusterTier: 'Enterprise GPU',
    monthlyComputeCost: 600
  });

  // Modals & Selected Entities
  const [activeIncident, setActiveIncident] = useState<AIIncident | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<HotelRoom | null>(null);
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);
  const [isHelpOpen, setIsHelpOpen] = useState<boolean>(false);

  // Keyboard shortcut listener (Spacebar for pause/play)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.code === 'Space') {
        e.preventDefault();
        setGameSpeed(prev => (prev === 0 ? 1 : 0));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Initial guest spawning
  useEffect(() => {
    const initialGuests: Guest[] = [
      {
        id: 'guest-1',
        name: 'Sophia Lin',
        type: 'vip',
        spriteColor: '#ec4899',
        hairColor: '#312e81',
        roomId: 'room-401',
        status: 'in_room',
        x: 220,
        targetX: 220,
        floor: 4,
        targetFloor: 4,
        direction: 'right',
        satisfaction: 95,
        spendTotal: 550,
        aiInteractionCount: 3,
        loyaltyLevel: 'Diamond',
        stayDaysRemaining: 2,
        bubble: { icon: '⭐', text: 'VIP Service Delight', timer: 30 }
      },
      {
        id: 'guest-2',
        name: 'Darius Stone',
        type: 'business',
        spriteColor: '#3b82f6',
        hairColor: '#78350f',
        roomId: 'room-301',
        status: 'in_room',
        x: 180,
        targetX: 180,
        floor: 3,
        targetFloor: 3,
        direction: 'left',
        satisfaction: 86,
        spendTotal: 280,
        aiInteractionCount: 2,
        loyaltyLevel: 'Gold',
        stayDaysRemaining: 1,
        bubble: { icon: '💼', text: 'Preparing Pitch', timer: 25 }
      },
      {
        id: 'guest-3',
        name: 'Chloe Dubois',
        type: 'tourist',
        spriteColor: '#10b981',
        hairColor: '#b45309',
        roomId: 'room-201',
        status: 'in_room',
        x: 180,
        targetX: 180,
        floor: 2,
        targetFloor: 2,
        direction: 'right',
        satisfaction: 88,
        spendTotal: 140,
        aiInteractionCount: 1,
        loyaltyLevel: 'Silver',
        stayDaysRemaining: 3
      },
      {
        id: 'guest-4',
        name: 'Lucas Rivera',
        type: 'tech_nomad',
        spriteColor: '#8b5cf6',
        hairColor: '#1e293b',
        roomId: 'room-202',
        status: 'in_room',
        x: 330,
        targetX: 330,
        floor: 2,
        targetFloor: 2,
        direction: 'left',
        satisfaction: 82,
        spendTotal: 130,
        aiInteractionCount: 4,
        loyaltyLevel: 'Bronze',
        stayDaysRemaining: 2,
        bubble: { icon: '🤖', text: 'Prompting Concierge', timer: 20 }
      }
    ];

    setGuests(initialGuests);

    // Mark rooms as occupied
    setRooms(prev =>
      prev.map(r => {
        const matching = initialGuests.find(g => g.roomId === r.id);
        return matching ? { ...r, occupied: true, guestId: matching.id } : r;
      })
    );
  }, []);

  // Main Simulation Game Loop
  useEffect(() => {
    if (gameSpeed === 0) return;

    // Tick intervals: 1x = 1000ms, 2x = 500ms, 3x = 250ms
    const intervalMs = gameSpeed === 1 ? 1000 : gameSpeed === 2 ? 500 : 250;

    const timer = setInterval(() => {
      // Advance Game Time (15 in-game minutes per tick)
      setMetrics(prev => {
        let newMinute = prev.timeMinute + 15;
        let newHour = prev.timeHour;
        let newDay = prev.day;
        let dayRollover = false;

        if (newMinute >= 60) {
          newMinute = 0;
          newHour += 1;
        }

        if (newHour >= 24) {
          newHour = 0;
          newDay += 1;
          dayRollover = true;
        }

        // Active AI bonuses
        const pricingTier = products.find(p => p.id === 'dynamic-pricing')?.currentLevel || 0;
        const revParMult = 1 + pricingTier * 0.12;

        // Calculate occupancy
        const occupiedCount = rooms.filter(r => r.occupied).length;
        const occRate = (occupiedCount / rooms.length) * 100;

        // Calculate ADR (Average Daily Rate)
        const totalRoomRates = rooms.filter(r => r.occupied).reduce((sum, r) => sum + r.currentPrice, 0);
        const adr = occupiedCount > 0 ? totalRoomRates / occupiedCount : 200;
        const revPar = (adr * (occRate / 100)) * revParMult;

        // Daily financial accounting on day rollover
        let newCash = prev.cash;
        let dailyRev = prev.dailyRevenue;
        let dailyCost = prev.dailyCost;

        if (dayRollover) {
          dailyRev = totalRoomRates + Math.round(occupiedCount * 45); // Ancillary F&B
          dailyCost = 450 + (modelConfig.monthlyComputeCost / 30) + Math.round(prev.techDebt * 5);
          newCash = prev.cash + dailyRev - dailyCost;
          sound.playCoin();
        }

        return {
          ...prev,
          day: newDay,
          timeHour: newHour,
          timeMinute: newMinute,
          occupancyRate: occRate,
          adr: adr,
          revPar: revPar,
          cash: newCash,
          dailyRevenue: dailyRev,
          dailyCost: dailyCost
        };
      });

      // Update Active Sprint progress if in progress
      setActiveSprint(prev => {
        if (prev.status !== 'in_progress') return prev;
        const newProgress = Math.min(100, prev.progressPercent + 3.5);
        if (newProgress >= 100) {
          sound.playSuccess();
          // Apply completed items to products & tech debt
          prev.items.forEach(item => {
            if (item.category === 'feature' && item.productId && item.targetTier) {
              setProducts(cur =>
                cur.map(p => {
                  if (p.id === item.productId) {
                    return { ...p, currentLevel: Math.max(p.currentLevel, item.targetTier!) };
                  }
                  return p;
                })
              );
            } else if (item.category === 'bugfix') {
              setMetrics(m => ({ ...m, techDebt: Math.max(0, m.techDebt - 15) }));
            } else if (item.category === 'guardrail') {
              setMetrics(m => ({ ...m, aiTrustScore: Math.min(100, m.aiTrustScore + 12) }));
            }
          });

          return {
            ...prev,
            status: 'planning',
            progressPercent: 0,
            allocatedPoints: 0,
            number: prev.number + 1,
            items: []
          };
        }
        return {
          ...prev,
          progressPercent: newProgress
        };
      });

      // Guest simulation updates (walking, bubbles, check-in, check-out)
      setGuests(prevGuests => {
        return prevGuests.map(g => {
          let newG = { ...g };

          // Decrease bubble timer
          if (newG.bubble) {
            newG.bubble = { ...newG.bubble, timer: newG.bubble.timer - 1 };
            if (newG.bubble.timer <= 0) {
              newG.bubble = undefined;
            }
          }

          // Arriving guests walking into lobby
          if (newG.status === 'arriving') {
            if (newG.x < newG.targetX) {
              newG.x += 4;
              newG.direction = 'right';
            } else {
              newG.status = 'checking_in';
              newG.bubble = { icon: '🛎️', text: 'Checking in', timer: 20 };
            }
          }

          // Move toward room
          if (newG.status === 'checking_in' && newG.roomId) {
            const targetRoom = rooms.find(r => r.id === newG.roomId);
            if (targetRoom) {
              newG.targetFloor = targetRoom.floor;
              newG.floor = targetRoom.floor;
              newG.status = 'in_room';
              newG.bubble = { icon: '😊', text: 'Settling in', timer: 25 };
            }
          }

          return newG;
        });
      });

      // Potential AI Incident Trigger (low probability, increased if tech debt is high or random event)
      if (!activeIncident && Math.random() < (0.015 + metrics.techDebt * 0.0005)) {
        const randomIncident = INCIDENT_TEMPLATES[Math.floor(Math.random() * INCIDENT_TEMPLATES.length)];
        sound.playAlert();
        setActiveIncident(randomIncident);
        setGameSpeed(0); // Pause on incident for PM triage
      }

      // Progress A/B experiment sample sizes
      setExperiments(prevExps => {
        return prevExps.map(exp => {
          if (exp.status === 'running' && exp.sampleSize < exp.targetSample) {
            return { ...exp, sampleSize: exp.sampleSize + 1 };
          }
          return exp;
        });
      });

      // Random new guest arrival if there are vacant rooms
      const vacantRooms = rooms.filter(r => !r.occupied);
      if (vacantRooms.length > 0 && Math.random() < 0.12) {
        const assignedRoom = vacantRooms[Math.floor(Math.random() * vacantRooms.length)];
        const types: ('business' | 'tourist' | 'vip' | 'tech_nomad')[] = ['business', 'tourist', 'vip', 'tech_nomad'];
        const randomType = types[Math.floor(Math.random() * types.length)];
        const randomName = GUEST_NAMES[Math.floor(Math.random() * GUEST_NAMES.length)];
        const colors = ['#38bdf8', '#fbbf24', '#a855f7', '#ec4899', '#34d399', '#f97316'];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];

        const newGuest: Guest = {
          id: `guest-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          name: randomName,
          type: randomType,
          spriteColor: randomColor,
          hairColor: '#451a03',
          roomId: assignedRoom.id,
          status: 'arriving',
          x: 40,
          targetX: 230,
          floor: 1,
          targetFloor: 1,
          direction: 'right',
          satisfaction: 85,
          spendTotal: assignedRoom.currentPrice,
          aiInteractionCount: 1,
          loyaltyLevel: randomType === 'vip' ? 'Diamond' : randomType === 'business' ? 'Gold' : 'Silver',
          stayDaysRemaining: Math.floor(Math.random() * 3) + 1,
          bubble: { icon: '👋', text: 'Arrived at Grand Silicon', timer: 20 }
        };

        setGuests(cur => [...cur, newGuest]);
        setRooms(cur =>
          cur.map(r => (r.id === assignedRoom.id ? { ...r, occupied: true, guestId: newGuest.id } : r))
        );
        setMetrics(m => ({
          ...m,
          totalGuestsServed: m.totalGuestsServed + 1,
          cash: m.cash + assignedRoom.currentPrice
        }));
        sound.playCoin();
      }
    }, intervalMs);

    return () => clearInterval(timer);
  }, [gameSpeed, metrics, rooms, guests, products, activeSprint, activeIncident, modelConfig]);

  // Sprint Item Management Handlers
  const handleAddSprintItem = (item: SprintItem) => {
    if (activeSprint.allocatedPoints + item.storyPoints > activeSprint.totalPoints) {
      sound.playAlert();
      return;
    }
    setActiveSprint(prev => ({
      ...prev,
      allocatedPoints: prev.allocatedPoints + item.storyPoints,
      items: [...prev.items, item]
    }));
  };

  const handleRemoveSprintItem = (itemId: string) => {
    const item = activeSprint.items.find(i => i.id === itemId);
    if (!item) return;
    setActiveSprint(prev => ({
      ...prev,
      allocatedPoints: Math.max(0, prev.allocatedPoints - item.storyPoints),
      items: prev.items.filter(i => i.id !== itemId)
    }));
  };

  const handleStartSprint = () => {
    setActiveSprint(prev => ({
      ...prev,
      status: 'in_progress',
      progressPercent: 0
    }));
  };

  const handleFastCompleteSprint = () => {
    if (metrics.cash < 500) {
      sound.playAlert();
      return;
    }
    setMetrics(m => ({ ...m, cash: m.cash - 500 }));
    // Instantly ship items
    activeSprint.items.forEach(item => {
      if (item.category === 'feature' && item.productId && item.targetTier) {
        setProducts(cur =>
          cur.map(p => (p.id === item.productId ? { ...p, currentLevel: Math.max(p.currentLevel, item.targetTier!) } : p))
        );
      } else if (item.category === 'bugfix') {
        setMetrics(m => ({ ...m, techDebt: Math.max(0, m.techDebt - 15) }));
      } else if (item.category === 'guardrail') {
        setMetrics(m => ({ ...m, aiTrustScore: Math.min(100, m.aiTrustScore + 12) }));
      }
    });

    setActiveSprint(prev => ({
      ...prev,
      status: 'planning',
      progressPercent: 0,
      allocatedPoints: 0,
      number: prev.number + 1,
      items: []
    }));
  };

  // Direct unlock helper
  const handleDirectUnlockProduct = (productId: string, level: number) => {
    setProducts(cur =>
      cur.map(p => (p.id === productId ? { ...p, currentLevel: Math.max(p.currentLevel, level) } : p))
    );
  };

  // Incident resolution handler
  const handleResolveIncident = (choice: AIIncidentChoice) => {
    setMetrics(prev => ({
      ...prev,
      cash: prev.cash - choice.cost,
      csat: Math.max(10, Math.min(100, prev.csat + choice.csatDelta)),
      techDebt: Math.max(0, Math.min(100, prev.techDebt + choice.techDebtDelta)),
      aiTrustScore: Math.max(10, Math.min(100, prev.aiTrustScore + choice.aiTrustDelta))
    }));
    setActiveIncident(null);
    setGameSpeed(1); // Resume play
  };

  // A/B Experiment Promotion
  const handlePromoteVariant = (experimentId: string, winner: 'A' | 'B') => {
    setExperiments(prev =>
      prev.map(exp => (exp.id === experimentId ? { ...exp, status: 'completed', winner } : exp))
    );
    if (winner === 'B') {
      const exp = experiments.find(e => e.id === experimentId);
      if (exp) {
        setMetrics(m => ({
          ...m,
          revPar: m.revPar * (1 + exp.liftRevPar / 100),
          csat: Math.min(100, m.csat + exp.liftCsat)
        }));
      }
    }
  };

  // Room Inspection Handlers
  const handleDispatchCleaning = (roomId: string) => {
    setRooms(prev =>
      prev.map(r => (r.id === roomId ? { ...r, cleanliness: 100 } : r))
    );
    sound.playSuccess();
    if (selectedRoom?.id === roomId) {
      setSelectedRoom(prev => (prev ? { ...prev, cleanliness: 100 } : null));
    }
  };

  const handleFixIoT = (roomId: string) => {
    if (metrics.cash < 50) return;
    setMetrics(m => ({ ...m, cash: m.cash - 50 }));
    setRooms(prev =>
      prev.map(r => (r.id === roomId ? { ...r, iotStatus: 'normal' } : r))
    );
    sound.playSuccess();
    if (selectedRoom?.id === roomId) {
      setSelectedRoom(prev => (prev ? { ...prev, iotStatus: 'normal' } : null));
    }
  };

  const handleOverridePrice = (roomId: string, newPrice: number) => {
    setRooms(prev =>
      prev.map(r => (r.id === roomId ? { ...r, currentPrice: newPrice } : r))
    );
  };

  // Guest Perk Handler
  const handleSendPerk = (guestId: string) => {
    if (metrics.cash < 25) return;
    setMetrics(m => ({ ...m, cash: m.cash - 25, csat: Math.min(100, m.csat + 2) }));
    setGuests(prev =>
      prev.map(g =>
        g.id === guestId
          ? {
              ...g,
              satisfaction: Math.min(100, g.satisfaction + 15),
              bubble: { icon: '🍸', text: 'Delight Voucher Received!', timer: 30 }
            }
          : g
      )
    );
    sound.playSuccess();
  };

  // Audio toggles
  const handleToggleMute = () => {
    const nextMute = !isMuted;
    setIsMuted(nextMute);
    sound.setMuted(nextMute);
  };

  const handleToggleMusic = () => {
    const playing = sound.toggleMusic();
    setIsMusicPlaying(playing);
  };

  return (
    <div className="min-h-screen bg-[#090b10] text-slate-100 flex flex-col font-sans antialiased selection:bg-amber-400 selection:text-black">
      {/* CRT Scanline Overlay Effect */}
      {crtEnabled && <div className="fixed inset-0 crt-overlay z-40 pointer-events-none" />}

      {/* Main Arcade HUD Header */}
      <HeaderHUD
        metrics={metrics}
        gameSpeed={gameSpeed}
        onChangeSpeed={setGameSpeed}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        isMusicPlaying={isMusicPlaying}
        onToggleMusic={handleToggleMusic}
        crtEnabled={crtEnabled}
        onToggleCrt={() => setCrtEnabled(prev => !prev)}
        onOpenHelp={() => setIsHelpOpen(true)}
        activeTab={activeTab}
        onChangeTab={setActiveTab}
        hasIncident={activeIncident !== null}
        onOpenIncident={() => {
          if (!activeIncident && INCIDENT_TEMPLATES.length > 0) {
            setActiveIncident(INCIDENT_TEMPLATES[0]);
          }
        }}
      />

      {/* Main View Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-6">
        {activeTab === 'simulation' && (
          <div className="space-y-6">
            {/* Live Cross-Section Canvas */}
            <PixelCanvas
              rooms={rooms}
              guests={guests}
              metrics={metrics}
              products={products}
              onSelectRoom={room => setSelectedRoom(room)}
              onSelectGuest={guest => setSelectedGuest(guest)}
            />

            {/* Quick Status Bar */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-900 border-2 border-slate-800 rounded-xl p-4 pixel-box">
                <span className="font-pixel text-[10px] text-amber-400 block mb-1">AI OPERATIONS STATUS</span>
                <p className="text-xs text-slate-300 font-sans">
                  Dynamic pricing active across {rooms.filter(r => r.occupied).length} occupied rooms. AI concierge kiosks running at 0.4s response latency.
                </p>
              </div>

              <div className="bg-slate-900 border-2 border-slate-800 rounded-xl p-4 pixel-box">
                <span className="font-pixel text-[10px] text-cyan-400 block mb-1">SPRINT VELOCITY</span>
                <div className="flex items-center justify-between text-xs font-mono text-slate-300 mt-1">
                  <span>Sprint #{activeSprint.number}</span>
                  <span className="text-amber-400 font-pixel text-[10px]">
                    {activeSprint.status === 'in_progress' ? `${Math.round(activeSprint.progressPercent)}% DONE` : 'PLANNING'}
                  </span>
                </div>
              </div>

              <div className="bg-slate-900 border-2 border-slate-800 rounded-xl p-4 pixel-box">
                <span className="font-pixel text-[10px] text-emerald-400 block mb-1">HOTEL OCCUPANCY GOAL</span>
                <p className="text-xs text-slate-300 font-sans">
                  Optimal RevPAR target: 85% occupancy with minimal room maintenance downtime.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'roadmap' && (
          <RoadmapView
            products={products}
            activeSprint={activeSprint}
            metrics={metrics}
            onAddSprintItem={handleAddSprintItem}
            onRemoveSprintItem={handleRemoveSprintItem}
            onStartSprint={handleStartSprint}
            onFastCompleteSprint={handleFastCompleteSprint}
            onDirectUnlockProduct={handleDirectUnlockProduct}
          />
        )}

        {activeTab === 'ab_lab' && (
          <ExperimentationLab
            experiments={experiments}
            modelConfig={modelConfig}
            metrics={metrics}
            onUpdateModelConfig={setModelConfig}
            onPromoteVariant={handlePromoteVariant}
            onStartNewExperiment={exp => setExperiments(prev => [...prev, exp])}
          />
        )}

        {activeTab === 'analytics' && (
          <MetricsDashboard
            metrics={metrics}
            reviews={reviews}
            products={products}
          />
        )}
      </main>

      {/* Modals */}
      <IncidentModal
        incident={activeIncident}
        onResolve={handleResolveIncident}
        onClose={() => setActiveIncident(null)}
      />

      <RoomModal
        room={selectedRoom}
        guest={guests.find(g => g.roomId === selectedRoom?.id)}
        onClose={() => setSelectedRoom(null)}
        onDispatchCleaning={handleDispatchCleaning}
        onFixIoT={handleFixIoT}
        onOverridePrice={handleOverridePrice}
      />

      <GuestModal
        guest={selectedGuest}
        room={rooms.find(r => r.id === selectedGuest?.roomId)}
        onClose={() => setSelectedGuest(null)}
        onSendPerk={handleSendPerk}
      />

      {isHelpOpen && <HelpGuideModal onClose={() => setIsHelpOpen(false)} />}
    </div>
  );
}
