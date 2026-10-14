import React from 'react';
import { HotelMetrics, GameSpeed } from '../types/game';
import { Play, Pause, FastForward, Volume2, VolumeX, Music, Tv, HelpCircle, Sparkles } from 'lucide-react';
import { sound } from '../services/sound';

interface HeaderHUDProps {
  metrics: HotelMetrics;
  gameSpeed: GameSpeed;
  onChangeSpeed: (speed: GameSpeed) => void;
  isMuted: boolean;
  onToggleMute: () => void;
  isMusicPlaying: boolean;
  onToggleMusic: () => void;
  crtEnabled: boolean;
  onToggleCrt: () => void;
  onOpenHelp: () => void;
  activeTab: 'simulation' | 'roadmap' | 'ab_lab' | 'analytics';
  onChangeTab: (tab: 'simulation' | 'roadmap' | 'ab_lab' | 'analytics') => void;
  hasIncident: boolean;
  onOpenIncident: () => void;
}

export const HeaderHUD: React.FC<HeaderHUDProps> = ({
  metrics,
  gameSpeed,
  onChangeSpeed,
  isMuted,
  onToggleMute,
  isMusicPlaying,
  onToggleMusic,
  crtEnabled,
  onToggleCrt,
  onOpenHelp,
  activeTab,
  onChangeTab,
  hasIncident,
  onOpenIncident,
}) => {
  const formatTime = (h: number, m: number) => {
    const hh = h.toString().padStart(2, '0');
    const mm = m.toString().padStart(2, '0');
    return `${hh}:${mm}`;
  };

  return (
    <header className="bg-slate-900 border-b-4 border-slate-950 px-4 py-3 select-none">
      {/* Top Bar: Title, Day/Time, Core Hospitality Metrics, Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Brand & Day/Time */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center pixel-btn border-2 border-amber-300">
            <span className="font-pixel text-slate-950 text-sm font-bold">AI</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-pixel text-xs sm:text-sm text-slate-100 tracking-wider">
                PIXEL HOTEL: AI PM
              </h1>
              {hasIncident && (
                <button
                  onClick={onOpenIncident}
                  className="bg-red-600 hover:bg-red-500 text-white font-pixel text-[9px] px-2 py-0.5 rounded pixel-btn animate-pulse flex items-center gap-1"
                >
                  <span>! INCIDENT !</span>
                </button>
              )}
            </div>
            <div className="flex items-center gap-2 text-xs font-retro text-amber-400 mt-0.5">
              <span>DAY {metrics.day}</span>
              <span>·</span>
              <span className="font-mono">{formatTime(metrics.timeHour, metrics.timeMinute)}</span>
              <span>·</span>
              <span className="text-slate-400">SPRINT #{metrics.sprintsCompleted + 1}</span>
            </div>
          </div>
        </div>

        {/* Essential Hospitality & PM KPIs */}
        <div className="flex items-center flex-wrap gap-2 sm:gap-4 font-mono text-xs">
          {/* Cash */}
          <div className="bg-slate-950/80 border border-slate-800 rounded px-2.5 py-1 flex flex-col">
            <span className="text-[10px] text-slate-400 font-retro">BALANCE</span>
            <span className="font-pixel text-emerald-400 text-xs">
              ${metrics.cash.toLocaleString()}
            </span>
          </div>

          {/* RevPAR */}
          <div className="bg-slate-950/80 border border-slate-800 rounded px-2.5 py-1 flex flex-col" title="Revenue Per Available Room">
            <span className="text-[10px] text-slate-400 font-retro">RevPAR</span>
            <span className="font-pixel text-cyan-400 text-xs">
              ${Math.round(metrics.revPar)}
            </span>
          </div>

          {/* ADR */}
          <div className="bg-slate-950/80 border border-slate-800 rounded px-2.5 py-1 flex flex-col" title="Average Daily Rate">
            <span className="text-[10px] text-slate-400 font-retro">ADR</span>
            <span className="font-pixel text-amber-400 text-xs">
              ${Math.round(metrics.adr)}
            </span>
          </div>

          {/* Occupancy */}
          <div className="bg-slate-950/80 border border-slate-800 rounded px-2.5 py-1 flex flex-col">
            <span className="text-[10px] text-slate-400 font-retro">OCCUPANCY</span>
            <span className="font-pixel text-blue-400 text-xs">
              {Math.round(metrics.occupancyRate)}%
            </span>
          </div>

          {/* CSAT */}
          <div className="bg-slate-950/80 border border-slate-800 rounded px-2.5 py-1 flex flex-col" title="Guest Satisfaction">
            <span className="text-[10px] text-slate-400 font-retro">CSAT</span>
            <span className={`font-pixel text-xs ${metrics.csat >= 75 ? 'text-emerald-400' : metrics.csat >= 50 ? 'text-amber-400' : 'text-red-400'}`}>
              {Math.round(metrics.csat)}%
            </span>
          </div>

          {/* Tech Debt */}
          <div className="bg-slate-950/80 border border-slate-800 rounded px-2.5 py-1 flex flex-col" title="Accumulated Technical Debt">
            <span className="text-[10px] text-slate-400 font-retro">TECH DEBT</span>
            <span className={`font-pixel text-xs ${metrics.techDebt > 60 ? 'text-red-400' : metrics.techDebt > 30 ? 'text-amber-400' : 'text-emerald-400'}`}>
              {Math.round(metrics.techDebt)}%
            </span>
          </div>
        </div>

        {/* Speed & Media Controls */}
        <div className="flex items-center gap-1.5">
          {/* Speed Buttons */}
          <div className="flex items-center bg-slate-950 border border-slate-800 rounded p-0.5">
            <button
              onClick={() => { sound.playClick(); onChangeSpeed(0); }}
              className={`p-1.5 rounded text-xs transition-colors ${gameSpeed === 0 ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'}`}
              title="Pause (Spacebar)"
            >
              <Pause className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => { sound.playClick(); onChangeSpeed(1); }}
              className={`p-1.5 rounded text-xs transition-colors ${gameSpeed === 1 ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'}`}
              title="1x Normal Speed"
            >
              <Play className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => { sound.playClick(); onChangeSpeed(2); }}
              className={`p-1.5 rounded text-xs transition-colors ${gameSpeed === 2 ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'}`}
              title="2x Fast Speed"
            >
              <FastForward className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Sound SFX */}
          <button
            onClick={onToggleMute}
            className={`p-1.5 rounded border border-slate-800 transition-colors ${isMuted ? 'bg-slate-950 text-slate-600' : 'bg-slate-800 text-slate-200 hover:bg-slate-700'}`}
            title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
          </button>

          {/* Music */}
          <button
            onClick={onToggleMusic}
            className={`p-1.5 rounded border border-slate-800 transition-colors ${isMusicPlaying ? 'bg-cyan-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
            title={isMusicPlaying ? 'Stop 8-Bit BGM' : 'Play 8-Bit Retro Music'}
          >
            <Music className="w-3.5 h-3.5" />
          </button>

          {/* CRT Scanline Toggle */}
          <button
            onClick={onToggleCrt}
            className={`p-1.5 rounded border border-slate-800 transition-colors ${crtEnabled ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
            title="Toggle CRT Scanline Effect"
          >
            <Tv className="w-3.5 h-3.5" />
          </button>

          {/* Help Modal */}
          <button
            onClick={() => { sound.playClick(); onOpenHelp(); }}
            className="p-1.5 rounded border border-slate-800 bg-slate-800 text-slate-300 hover:text-white"
            title="Hospitality PM Guide & Tutorial"
          >
            <HelpCircle className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Primary Navigation Tabs */}
      <div className="flex items-center gap-2 mt-3 pt-2 border-t border-slate-800">
        <button
          onClick={() => { sound.playClick(); onChangeTab('simulation'); }}
          className={`px-3 py-1.5 rounded text-xs font-pixel transition-all pixel-btn ${
            activeTab === 'simulation'
              ? 'bg-amber-500 text-slate-950 font-bold border-2 border-amber-300'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
        >
          HOTEL LIVE SIM
        </button>

        <button
          onClick={() => { sound.playClick(); onChangeTab('roadmap'); }}
          className={`px-3 py-1.5 rounded text-xs font-pixel transition-all pixel-btn ${
            activeTab === 'roadmap'
              ? 'bg-cyan-500 text-slate-950 font-bold border-2 border-cyan-300'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
        >
          AI ROADMAP & SPRINTS
        </button>

        <button
          onClick={() => { sound.playClick(); onChangeTab('ab_lab'); }}
          className={`px-3 py-1.5 rounded text-xs font-pixel transition-all pixel-btn ${
            activeTab === 'ab_lab'
              ? 'bg-purple-500 text-slate-950 font-bold border-2 border-purple-300'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
        >
          A/B LAB & MODEL TUNING
        </button>

        <button
          onClick={() => { sound.playClick(); onChangeTab('analytics'); }}
          className={`px-3 py-1.5 rounded text-xs font-pixel transition-all pixel-btn ${
            activeTab === 'analytics'
              ? 'bg-emerald-500 text-slate-950 font-bold border-2 border-emerald-300'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
        >
          ANALYTICS & REVIEWS
        </button>
      </div>
    </header>
  );
};
