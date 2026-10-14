import React, { useEffect, useRef, useState } from 'react';
import { HotelRoom, Guest, HotelMetrics, AIProduct } from '../types/game';
import { sound } from '../services/sound';

interface PixelCanvasProps {
  rooms: HotelRoom[];
  guests: Guest[];
  metrics: HotelMetrics;
  products: AIProduct[];
  onSelectRoom: (room: HotelRoom) => void;
  onSelectGuest: (guest: Guest) => void;
}

export const PixelCanvas: React.FC<PixelCanvasProps> = ({
  rooms,
  guests,
  metrics,
  products,
  onSelectRoom,
  onSelectGuest,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [hoveredEntity, setHoveredEntity] = useState<string | null>(null);
  const [elevatorY, setElevatorY] = useState<number>(360);
  const elevatorTargetY = useRef<number>(360);
  const animFrameId = useRef<number | null>(null);
  const tickCounter = useRef<number>(0);

  // Calculate day-night lighting phase
  const hour = metrics.timeHour;
  let skyColorTop = '#38bdf8';
  let skyColorBottom = '#bae6fd';
  let isNight = false;

  if (hour >= 20 || hour < 6) {
    // Night
    skyColorTop = '#090d16';
    skyColorBottom = '#1e1b4b';
    isNight = true;
  } else if (hour >= 6 && hour < 9) {
    // Dawn
    skyColorTop = '#f97316';
    skyColorBottom = '#fef08a';
  } else if (hour >= 17 && hour < 20) {
    // Sunset
    skyColorTop = '#831843';
    skyColorBottom = '#fb923c';
  }

  // Active AI upgrades checks
  const dynamicPricingLevel = products.find(p => p.id === 'dynamic-pricing')?.currentLevel || 0;
  const conciergeLevel = products.find(p => p.id === 'ai-concierge')?.currentLevel || 0;
  const iotLevel = products.find(p => p.id === 'predictive-iot')?.currentLevel || 0;
  const housekeepingLevel = products.find(p => p.id === 'housekeeping-fleet')?.currentLevel || 0;

  // Move elevator smoothly toward target
  useEffect(() => {
    // If there is any guest traveling between floors, move elevator to them
    const travelingGuest = guests.find(g => g.floor !== g.targetFloor);
    if (travelingGuest) {
      // Floor mapping: 0=Basement (440), 1=Lobby (360), 2=Floor 2 (280), 3=Floor 3 (200), 4=Penthouse (120)
      const floorYMap: { [key: number]: number } = {
        0: 440,
        1: 360,
        2: 280,
        3: 200,
        4: 120
      };
      elevatorTargetY.current = floorYMap[travelingGuest.floor] || 360;
    }
  }, [guests]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.imageSmoothingEnabled = false;

    const render = () => {
      tickCounter.current += 1;
      const t = tickCounter.current;

      // Smooth elevator interpolation
      setElevatorY(prev => {
        const diff = elevatorTargetY.current - prev;
        if (Math.abs(diff) < 1) return elevatorTargetY.current;
        return prev + diff * 0.08;
      });

      const width = canvas.width;
      const height = canvas.height;

      // 1. SKY & WEATHER
      const skyGradient = ctx.createLinearGradient(0, 0, 0, height);
      skyGradient.addColorStop(0, skyColorTop);
      skyGradient.addColorStop(0.55, skyColorBottom);
      skyGradient.addColorStop(1, '#0f172a');
      ctx.fillStyle = skyGradient;
      ctx.fillRect(0, 0, width, height);

      // Pixel Stars at night
      if (isNight) {
        ctx.fillStyle = '#ffffff';
        for (let i = 0; i < 40; i++) {
          const starX = (i * 37 + (i % 3) * 17) % width;
          const starY = (i * 19 + (i % 5) * 11) % 180;
          const twinkle = (t + i * 20) % 60 > 30 ? 2 : 1;
          ctx.fillRect(starX, starY, twinkle, twinkle);
        }
        // Pixel Crescent Moon
        ctx.fillStyle = '#fef08a';
        ctx.fillRect(width - 90, 24, 20, 20);
        ctx.fillStyle = skyColorTop;
        ctx.fillRect(width - 98, 20, 16, 20);
      } else {
        // Pixel Sun
        ctx.fillStyle = '#fbbf24';
        ctx.fillRect(width - 95, 30, 28, 28);
        ctx.fillStyle = '#fef08a';
        ctx.fillRect(width - 91, 34, 20, 20);

        // Pixel Clouds
        const cloudX1 = (t * 0.4) % (width + 120) - 60;
        const cloudX2 = (t * 0.25 + 350) % (width + 120) - 60;
        drawPixelCloud(ctx, cloudX1, 40);
        drawPixelCloud(ctx, cloudX2, 85);
      }

      // 2. HOTEL BUILDING ARCHITECTURE (Multi-Floor Cross-Section)
      const hotelX = 40;
      const hotelW = width - 80;
      const floorH = 75;

      // Rooftop (Skyline & Neon Sign)
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(hotelX, 55, hotelW, 25);
      // Roof parapet crenellations
      for (let rx = hotelX; rx < hotelX + hotelW; rx += 24) {
        ctx.fillStyle = '#334155';
        ctx.fillRect(rx, 50, 14, 8);
      }

      // Neon 8-Bit Sign: "THE GRAND SILICON"
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(hotelX + 120, 24, hotelW - 240, 28);
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;
      ctx.strokeRect(hotelX + 120, 24, hotelW - 240, 28);

      // Sign text with retro flicker
      const signFlicker = Math.sin(t * 0.05) > -0.8;
      ctx.font = '10px "Press Start 2P", monospace';
      ctx.fillStyle = signFlicker ? '#38bdf8' : '#0284c7';
      ctx.textAlign = 'center';
      ctx.fillText('THE GRAND SILICON', hotelX + hotelW / 2, 42);

      // AI Drone on rooftop if Tier 2+ housekeeping / IoT
      if (housekeepingLevel >= 2 || iotLevel >= 2) {
        const droneHover = Math.sin(t * 0.15) * 4;
        drawDrone(ctx, hotelX + 70, 36 + droneHover);
      }

      // 3. HOTEL FLOORS & ROOMS
      // Floor 4: Penthouse AI Suites (Rooms 401, 402) - Y: 80
      drawFloorBackground(ctx, hotelX, 80, hotelW, floorH, '#1e2235', '#0f111a', 'PENTHOUSE');
      drawRoomBox(ctx, hotelX + 110, 80, 220, floorH, rooms.find(r => r.number === 401), 'Suite 401 (VIP Penthouse)', t);
      drawRoomBox(ctx, hotelX + 350, 80, 220, floorH, rooms.find(r => r.number === 402), 'Suite 402 (Sky Sanctuary)', t);

      // Floor 3: Executive Business Rooms (Rooms 301, 302, 303) - Y: 155
      drawFloorBackground(ctx, hotelX, 155, hotelW, floorH, '#22283e', '#131826', 'FLOOR 3');
      drawRoomBox(ctx, hotelX + 110, 155, 145, floorH, rooms.find(r => r.number === 301), '301 Executive', t);
      drawRoomBox(ctx, hotelX + 265, 155, 145, floorH, rooms.find(r => r.number === 302), '302 Executive', t);
      drawRoomBox(ctx, hotelX + 420, 155, 150, floorH, rooms.find(r => r.number === 303), '303 Executive', t);

      // Floor 2: Economy & Smart Pods (Rooms 201, 202, 203, 204) - Y: 230
      drawFloorBackground(ctx, hotelX, 230, hotelW, floorH, '#202638', '#121622', 'FLOOR 2');
      drawRoomBox(ctx, hotelX + 110, 230, 145, floorH, rooms.find(r => r.number === 201), '201 Smart Pod', t);
      drawRoomBox(ctx, hotelX + 265, 230, 145, floorH, rooms.find(r => r.number === 202), '202 Smart Pod', t);
      drawRoomBox(ctx, hotelX + 420, 230, 150, floorH, rooms.find(r => r.number === 203), '203 Smart Pod', t);

      // Floor 1: The Grand Lobby & Autonomous Concierge - Y: 305 (Height 85)
      drawLobby(ctx, hotelX, 305, hotelW, 85, conciergeLevel, dynamicPricingLevel, t);

      // Basement (Floor 0): AI Core Server Room & Bot Charging - Y: 390 (Height 85)
      drawServerBasement(ctx, hotelX, 390, hotelW, 85, metrics, products, t);

      // 4. ELEVATOR SHAFT (Left column: hotelX + 15 to hotelX + 85)
      drawElevatorShaft(ctx, hotelX + 15, 80, 75, 395, elevatorY, t);

      // 5. GUESTS & ENTITIES
      guests.forEach(guest => {
        drawPixelGuest(ctx, guest, hotelX, t);
      });

      // 6. HOUSEKEEPING / CONCIERGE ROBOTS
      if (housekeepingLevel >= 1) {
        const botX = hotelX + 180 + ((t * 0.8) % 360);
        drawHousekeepingBot(ctx, botX, 355, t);
      }

      // Draw sidewalk & entrance street outside lobby
      ctx.fillStyle = '#334155';
      ctx.fillRect(0, 475, width, 55);
      // Street road markings
      ctx.fillStyle = '#64748b';
      for (let mx = 10; mx < width; mx += 60) {
        ctx.fillRect(mx, 500, 35, 6);
      }

      // Subtle scanline overlay pass in canvas
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      for (let y = 0; y < height; y += 4) {
        ctx.fillRect(0, y, width, 2);
      }

      animFrameId.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animFrameId.current) {
        cancelAnimationFrame(animFrameId.current);
      }
    };
  }, [rooms, guests, metrics, products, skyColorTop, skyColorBottom, isNight]);

  // Handle Canvas Clicking for Room or Guest interaction
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const clickX = (e.clientX - rect.left) * scaleX;
    const clickY = (e.clientY - rect.top) * scaleY;

    // Check click on guests
    for (const guest of guests) {
      // Guest approximate bounding box
      const guestY = 70 + (4 - guest.floor) * 75 + 30;
      if (
        clickX >= guest.x - 20 &&
        clickX <= guest.x + 20 &&
        clickY >= guestY - 35 &&
        clickY <= guestY + 10
      ) {
        sound.playClick();
        onSelectGuest(guest);
        return;
      }
    }

    // Check click on rooms
    const hotelX = 40;
    // Floor 4 Penthouse
    if (clickY >= 80 && clickY <= 155) {
      if (clickX >= hotelX + 110 && clickX <= hotelX + 330) {
        const r = rooms.find(rm => rm.number === 401);
        if (r) { sound.playClick(); onSelectRoom(r); return; }
      }
      if (clickX >= hotelX + 350 && clickX <= hotelX + 570) {
        const r = rooms.find(rm => rm.number === 402);
        if (r) { sound.playClick(); onSelectRoom(r); return; }
      }
    }
    // Floor 3 Executive
    if (clickY >= 155 && clickY <= 230) {
      if (clickX >= hotelX + 110 && clickX <= hotelX + 255) {
        const r = rooms.find(rm => rm.number === 301);
        if (r) { sound.playClick(); onSelectRoom(r); return; }
      }
      if (clickX >= hotelX + 265 && clickX <= hotelX + 410) {
        const r = rooms.find(rm => rm.number === 302);
        if (r) { sound.playClick(); onSelectRoom(r); return; }
      }
      if (clickX >= hotelX + 420 && clickX <= hotelX + 570) {
        const r = rooms.find(rm => rm.number === 303);
        if (r) { sound.playClick(); onSelectRoom(r); return; }
      }
    }
    // Floor 2 Smart Pods
    if (clickY >= 230 && clickY <= 305) {
      if (clickX >= hotelX + 110 && clickX <= hotelX + 255) {
        const r = rooms.find(rm => rm.number === 201);
        if (r) { sound.playClick(); onSelectRoom(r); return; }
      }
      if (clickX >= hotelX + 265 && clickX <= hotelX + 410) {
        const r = rooms.find(rm => rm.number === 202);
        if (r) { sound.playClick(); onSelectRoom(r); return; }
      }
      if (clickX >= hotelX + 420 && clickX <= hotelX + 570) {
        const r = rooms.find(rm => rm.number === 203);
        if (r) { sound.playClick(); onSelectRoom(r); return; }
      }
    }
  };

  return (
    <div className="relative w-full rounded-xl overflow-hidden bg-slate-950 pixel-box border-4 border-slate-900 shadow-2xl">
      <div className="flex items-center justify-between px-3 py-2 bg-slate-900 border-b-2 border-slate-800 text-xs">
        <div className="flex items-center gap-3">
          <span className="font-pixel text-[11px] text-amber-400">HOTEL SIMULATION VIEW</span>
          <span className="text-slate-400 font-retro">CROSS-SECTION TELEMETRY</span>
        </div>
        <div className="flex items-center gap-4 text-slate-300 font-mono text-[11px]">
          <span>Floor 4: Penthouse</span>
          <span>·</span>
          <span>Floor 3: Executive</span>
          <span>·</span>
          <span>Floor 2: Smart Pods</span>
          <span>·</span>
          <span>B1: AI Core</span>
        </div>
      </div>

      <canvas
        ref={canvasRef}
        width={720}
        height={520}
        onClick={handleCanvasClick}
        className="w-full h-auto cursor-pointer block pixelated bg-slate-950"
      />

      <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between pointer-events-none text-[11px] font-retro text-slate-400 bg-slate-950/80 px-3 py-1.5 rounded border border-slate-800">
        <span>Click any room or guest to inspect real-time AI analytics</span>
        <span className="text-amber-400 font-pixel text-[9px]">LIVE TELEMETRY ACTIVE</span>
      </div>
    </div>
  );
};

// --- Canvas Pixel Drawing Helpers ---

function drawPixelCloud(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
  ctx.fillRect(x + 10, y, 40, 12);
  ctx.fillRect(x, y + 6, 60, 14);
  ctx.fillRect(x + 15, y - 6, 30, 12);
}

function drawDrone(ctx: CanvasRenderingContext2D, x: number, y: number) {
  // Drone body
  ctx.fillStyle = '#0284c7';
  ctx.fillRect(x + 6, y + 4, 12, 6);
  // Rotors
  ctx.fillStyle = '#38bdf8';
  ctx.fillRect(x, y + 1, 8, 2);
  ctx.fillRect(x + 16, y + 1, 8, 2);
  // Sensor light
  ctx.fillStyle = '#34d399';
  ctx.fillRect(x + 11, y + 8, 2, 2);
}

function drawFloorBackground(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  wallColor: string,
  floorColor: string,
  floorLabel: string
) {
  // Wall background
  ctx.fillStyle = wallColor;
  ctx.fillRect(x, y, w, h);

  // Floor beam line
  ctx.fillStyle = floorColor;
  ctx.fillRect(x, y + h - 5, w, 5);
  ctx.fillStyle = '#475569';
  ctx.fillRect(x, y + h - 2, w, 2);

  // Exterior wall column borders
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(x, y, 15, h);
  ctx.fillRect(x + w - 15, y, 15, h);

  // Subtle floor tag
  ctx.font = '8px "Press Start 2P", monospace';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
  ctx.textAlign = 'left';
  ctx.fillText(floorLabel, x + 18, y + 16);
}

function drawRoomBox(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  room: HotelRoom | undefined,
  label: string,
  t: number
) {
  const isOccupied = room?.occupied;
  const isMaintenance = room?.iotStatus === 'maintenance_needed' || room?.iotStatus === 'broken';

  // Room Wall & Floor
  ctx.fillStyle = isOccupied ? '#1b2234' : '#141824';
  ctx.fillRect(x, y + 6, w, h - 11);

  // Room Divider Wall
  ctx.fillStyle = '#334155';
  ctx.fillRect(x, y + 6, 4, h - 11);
  ctx.fillRect(x + w - 4, y + 6, 4, h - 11);

  // Interior Pixel Furniture:
  // Bed
  ctx.fillStyle = '#94a3b8';
  ctx.fillRect(x + 12, y + h - 22, 34, 14); // Bed frame
  ctx.fillStyle = isOccupied ? '#3b82f6' : '#cbd5e1';
  ctx.fillRect(x + 18, y + h - 20, 26, 11); // Blanket
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(x + 13, y + h - 20, 6, 11); // Pillow

  // Nightstand & Lamp
  ctx.fillStyle = '#64748b';
  ctx.fillRect(x + 50, y + h - 16, 10, 8);
  // Glowing Smart Lamp
  const lampOn = isOccupied;
  ctx.fillStyle = lampOn ? '#fef08a' : '#475569';
  ctx.fillRect(x + 53, y + h - 24, 4, 8);

  // Smart TV / Terminal Screen
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(x + w - 40, y + 20, 24, 16);
  if (isOccupied) {
    // Screen flicker
    ctx.fillStyle = t % 40 > 20 ? '#38bdf8' : '#818cf8';
    ctx.fillRect(x + w - 38, y + 22, 20, 12);
  }

  // IoT Sensor status indicator light on ceiling
  const sensorColor = isMaintenance ? '#ef4444' : isOccupied ? '#10b981' : '#64748b';
  ctx.fillStyle = sensorColor;
  ctx.fillRect(x + w / 2 - 3, y + 7, 6, 3);

  // Room Number Header & Price Badge
  ctx.font = '7px "Press Start 2P", monospace';
  ctx.fillStyle = '#e2e8f0';
  ctx.textAlign = 'left';
  ctx.fillText(room ? `R${room.number}` : label, x + 8, y + 17);

  // Price tag
  if (room) {
    ctx.font = '8px "Silkscreen", monospace';
    ctx.fillStyle = isOccupied ? '#10b981' : '#f59e0b';
    ctx.textAlign = 'right';
    ctx.fillText(`$${room.currentPrice}`, x + w - 8, y + 17);
  }

  // Status icon / maintenance banner
  if (isMaintenance) {
    ctx.fillStyle = 'rgba(239, 68, 68, 0.2)';
    ctx.fillRect(x + 4, y + 6, w - 8, h - 11);
    ctx.font = '7px "Press Start 2P", monospace';
    ctx.fillStyle = '#f87171';
    ctx.textAlign = 'center';
    ctx.fillText('! IOT REPAIR !', x + w / 2, y + h / 2);
  }
}

function drawLobby(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  conciergeLevel: number,
  dynamicPricingLevel: number,
  t: number
) {
  // Lobby walls & checkered marble floor
  ctx.fillStyle = '#282339';
  ctx.fillRect(x, y, w, h);

  // Checkered retro tiles
  for (let tx = x + 10; tx < x + w - 10; tx += 16) {
    for (let ty = y + h - 16; ty < y + h - 5; ty += 8) {
      ctx.fillStyle = ((tx + ty) / 8) % 2 === 0 ? '#3f3956' : '#2b263d';
      ctx.fillRect(tx, ty, 16, 8);
    }
  }

  // Front Reception Desk
  ctx.fillStyle = '#78350f';
  ctx.fillRect(x + 130, y + h - 35, 75, 20);
  ctx.fillStyle = '#b45309';
  ctx.fillRect(x + 130, y + h - 37, 75, 4);
  // Golden Bell 🛎️
  ctx.fillStyle = '#facc15';
  ctx.fillRect(x + 145, y + h - 41, 6, 4);

  // Human Receptionist
  drawHumanSprite(ctx, x + 170, y + h - 37, '#e0a96d', '#1e293b', '#e2e8f0');

  // AI Autonomous Check-In Kiosks (Upgrades with conciergeLevel)
  const kioskX = x + 230;
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(kioskX, y + h - 42, 22, 28);
  ctx.fillStyle = '#38bdf8';
  ctx.fillRect(kioskX + 3, y + h - 39, 16, 14); // Screen
  // Hologram emitter beam if Tier 2+
  if (conciergeLevel >= 2) {
    const pulse = (Math.sin(t * 0.1) + 1) * 0.5;
    ctx.fillStyle = `rgba(56, 189, 248, ${0.15 + pulse * 0.25})`;
    ctx.beginPath();
    ctx.moveTo(kioskX + 11, y + h - 42);
    ctx.lineTo(kioskX + 1, y + h - 60);
    ctx.lineTo(kioskX + 21, y + h - 60);
    ctx.closePath();
    ctx.fill();

    // Floating pixel avatar icon
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(kioskX + 8, y + h - 56, 6, 6);
  }

  // Hotel Lobby Lounge Couch & Plant
  ctx.fillStyle = '#047857';
  ctx.fillRect(x + 380, y + h - 30, 16, 16); // Potted palm plant
  ctx.fillStyle = '#4ade80';
  ctx.fillRect(x + 376, y + h - 42, 24, 12);

  // Velvet lounge couch
  ctx.fillStyle = '#991b1b';
  ctx.fillRect(x + 420, y + h - 28, 48, 14);
  ctx.fillStyle = '#dc2626';
  ctx.fillRect(x + 420, y + h - 34, 48, 6);

  // Live Dynamic Pricing Ticker Screen on wall
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(x + w - 160, y + 14, 130, 22);
  ctx.strokeStyle = '#22c55e';
  ctx.lineWidth = 1;
  ctx.strokeRect(x + w - 160, y + 14, 130, 22);
  ctx.font = '8px "Press Start 2P", monospace';
  ctx.fillStyle = '#22c55e';
  ctx.textAlign = 'left';
  const tickerText = dynamicPricingLevel >= 1 ? 'AI REVPAR OPTIMIZER' : 'STATIC RATES';
  ctx.fillText(tickerText, x + w - 154, y + 29);
}

function drawServerBasement(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  metrics: HotelMetrics,
  products: AIProduct[],
  t: number
) {
  // Dark industrial concrete server bunker
  ctx.fillStyle = '#0a0d14';
  ctx.fillRect(x, y, w, h);

  // Warning hazard stripes at top edge
  for (let hx = x; hx < x + w; hx += 20) {
    ctx.fillStyle = '#eab308';
    ctx.fillRect(hx, y, 10, 4);
    ctx.fillStyle = '#000000';
    ctx.fillRect(hx + 10, y, 10, 4);
  }

  // Label: AI NEURAL CORE & ML SERVERS
  ctx.font = '8px "Press Start 2P", monospace';
  ctx.fillStyle = '#38bdf8';
  ctx.textAlign = 'left';
  ctx.fillText('AI NEURAL CORE & COMPUTE SERVERS', x + 110, y + 18);

  // 4 Enterprise Server Racks with blinking LEDs
  for (let rackIdx = 0; rackIdx < 5; rackIdx++) {
    const rx = x + 110 + rackIdx * 80;
    const ry = y + 24;
    // Server chassis
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(rx, ry, 65, 52);
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1;
    ctx.strokeRect(rx, ry, 65, 52);

    // Blinking activity LEDs
    for (let u = 0; u < 4; u++) {
      const uy = ry + 6 + u * 11;
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(rx + 4, uy, 57, 8);

      // Random blinking LEDs
      const ledOn1 = (t + rackIdx * 7 + u * 3) % 15 > 6;
      const ledOn2 = (t + rackIdx * 11 + u * 5) % 20 > 8;
      const ledColor = metrics.techDebt > 50 && u === 3 ? '#ef4444' : '#10b981';

      ctx.fillStyle = ledOn1 ? ledColor : '#064e3b';
      ctx.fillRect(rx + 8, uy + 2, 4, 4);
      ctx.fillStyle = ledOn2 ? '#38bdf8' : '#0c4a6e';
      ctx.fillRect(rx + 16, uy + 2, 4, 4);

      // Mini drive slot lights
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(rx + 24, uy + 3, 28, 2);
    }
  }

  // Server ventilation fans
  const fanSpin = (t * 0.3) % (Math.PI * 2);
  ctx.fillStyle = '#475569';
  ctx.beginPath();
  ctx.arc(x + w - 40, y + 45, 14, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#94a3b8';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x + w - 40 - Math.cos(fanSpin) * 12, y + 45 - Math.sin(fanSpin) * 12);
  ctx.lineTo(x + w - 40 + Math.cos(fanSpin) * 12, y + 45 + Math.sin(fanSpin) * 12);
  ctx.stroke();
}

function drawElevatorShaft(
  ctx: CanvasRenderingContext2D,
  x: number,
  topY: number,
  w: number,
  h: number,
  elevatorY: number,
  t: number
) {
  // Shaft interior
  ctx.fillStyle = '#090d16';
  ctx.fillRect(x, topY, w, h);

  // Cables
  ctx.fillStyle = '#475569';
  ctx.fillRect(x + w / 2 - 2, topY, 4, h);

  // Structural guide rails
  ctx.fillStyle = '#334155';
  ctx.fillRect(x + 2, topY, 3, h);
  ctx.fillRect(x + w - 5, topY, 3, h);

  // Elevator Cabin
  const cabY = Math.max(topY + 10, Math.min(topY + h - 65, elevatorY));
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(x + 6, cabY, w - 12, 58);
  ctx.strokeStyle = '#06b6d4';
  ctx.lineWidth = 2;
  ctx.strokeRect(x + 6, cabY, w - 12, 58);

  // Cabin interior light
  ctx.fillStyle = '#fef08a';
  ctx.fillRect(x + 12, cabY + 6, w - 24, 6);

  // Glass door with reflection
  ctx.fillStyle = 'rgba(6, 182, 212, 0.25)';
  ctx.fillRect(x + 10, cabY + 12, w - 20, 42);
}

function drawPixelGuest(
  ctx: CanvasRenderingContext2D,
  guest: Guest,
  hotelX: number,
  t: number
) {
  // Calculate floor Y base
  // Floor 1 (Lobby): 380, Floor 2: 300, Floor 3: 225, Floor 4 (Penthouse): 150
  const floorYMap: { [key: number]: number } = {
    0: 450,
    1: 375,
    2: 295,
    3: 220,
    4: 145
  };
  const baseY = floorYMap[guest.floor] || 375;

  // Walking cycle animation
  const isWalking = guest.status === 'arriving' || guest.status === 'checking_out';
  const walkPhase = isWalking ? Math.sin(t * 0.25 + guest.x) : 0;
  const legOffset = walkPhase * 3;

  const gx = guest.x;
  const gy = baseY - 24;

  // Guest Shadow
  ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
  ctx.fillRect(gx - 8, baseY - 2, 16, 4);

  // Body / Suit
  ctx.fillStyle = guest.spriteColor || '#3b82f6';
  ctx.fillRect(gx - 5, gy + 8, 10, 10);

  // Legs (animated)
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(gx - 4, gy + 18, 3, 6 + legOffset);
  ctx.fillRect(gx + 1, gy + 18, 3, 6 - legOffset);

  // Head
  ctx.fillStyle = '#fcd34d'; // Skin tone
  ctx.fillRect(gx - 4, gy, 8, 8);

  // Hair / Hat
  ctx.fillStyle = guest.hairColor || '#78350f';
  ctx.fillRect(gx - 5, gy - 2, 10, 4);

  // Luggage (rolling suitcase) if arriving or checking out
  if (guest.status === 'arriving' || guest.status === 'checking_out') {
    const lugX = guest.direction === 'right' ? gx - 10 : gx + 6;
    ctx.fillStyle = '#b91c1c';
    ctx.fillRect(lugX, gy + 12, 6, 10);
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(lugX + 1, gy + 8, 4, 4); // Handle
  }

  // Floating Emote Bubble
  if (guest.bubble) {
    const bx = gx - 16;
    const by = gy - 26;
    // Bubble box
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(bx, by, 32, 16);
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 1;
    ctx.strokeRect(bx, by, 32, 16);

    // Pointer notch
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(gx - 2, by + 16, 4, 3);

    // Icon or Emoji
    ctx.font = '10px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(guest.bubble.icon, bx + 16, by + 12);
  }
}

function drawHumanSprite(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  skinColor: string,
  hairColor: string,
  suitColor: string
) {
  // Head
  ctx.fillStyle = skinColor;
  ctx.fillRect(x - 4, y - 18, 8, 8);
  // Hair
  ctx.fillStyle = hairColor;
  ctx.fillRect(x - 5, y - 21, 10, 4);
  // Suit
  ctx.fillStyle = suitColor;
  ctx.fillRect(x - 6, y - 10, 12, 12);
}

function drawHousekeepingBot(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  t: number
) {
  // Mobile cylinder bot
  ctx.fillStyle = '#cbd5e1';
  ctx.fillRect(x - 8, y - 16, 16, 14);
  // Glowing blue eye scanner
  const eyeFlicker = Math.sin(t * 0.2) > 0;
  ctx.fillStyle = eyeFlicker ? '#06b6d4' : '#0891b2';
  ctx.fillRect(x - 6, y - 13, 12, 4);
  // Wheels
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(x - 9, y - 2, 18, 4);
  // Linen basket
  ctx.fillStyle = '#38bdf8';
  ctx.fillRect(x - 5, y - 22, 10, 6);
}
