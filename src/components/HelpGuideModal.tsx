import React from 'react';
import { sound } from '../services/sound';
import { X, BookOpen, TrendingUp, Bot, Cpu, ShieldCheck, CheckCircle } from 'lucide-react';

interface HelpGuideModalProps {
  onClose: () => void;
}

export const HelpGuideModal: React.FC<HelpGuideModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm select-none">
      <div className="bg-slate-900 border-4 border-slate-700 rounded-xl max-w-2xl w-full p-6 pixel-box shadow-2xl max-h-[85vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-500/20 text-amber-400 rounded-lg border border-amber-500/40">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <span className="font-pixel text-[10px] text-amber-400">PRODUCT MANAGEMENT HANDBOOK</span>
              <h2 className="font-pixel text-sm text-slate-100">AI & HOSPITALITY PM GUIDE</h2>
            </div>
          </div>
          <button
            onClick={() => { sound.playClick(); onClose(); }}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content sections */}
        <div className="space-y-5 text-xs text-slate-300 font-sans leading-relaxed">
          {/* Section 1: The Golden Hospitality Metrics */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-cyan-400 font-retro text-xs font-bold">
              <TrendingUp className="w-4 h-4" />
              <span>1. The Golden Hospitality Metrics</span>
            </div>
            <ul className="space-y-1.5 list-disc list-inside text-slate-300">
              <li>
                <strong className="text-slate-100 font-mono">RevPAR (Revenue Per Available Room):</strong> The primary North Star metric in hotel management. Calculated as <code className="text-amber-400 font-mono">ADR × Occupancy Rate</code>. It measures how effectively your total hotel room inventory is generating income.
              </li>
              <li>
                <strong className="text-slate-100 font-mono">ADR (Average Daily Rate):</strong> The average rental revenue earned per paid occupied room per day.
              </li>
              <li>
                <strong className="text-slate-100 font-mono">Occupancy Rate:</strong> Percentage of total available rooms occupied by guests.
              </li>
              <li>
                <strong className="text-slate-100 font-mono">CSAT (Customer Satisfaction):</strong> Influenced by check-in speed, room comfort, temperature reliability, and AI accuracy. High CSAT yields repeat VIP guests!
              </li>
            </ul>
          </div>

          {/* Section 2: AI Product Management Principles */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-purple-400 font-retro text-xs font-bold">
              <Bot className="w-4 h-4" />
              <span>2. AI Product Management Best Practices</span>
            </div>
            <p>
              Unlike traditional software, AI products are non-deterministic. As an AI Product Manager, your responsibilities include:
            </p>
            <ul className="space-y-1.5 list-disc list-inside text-slate-300">
              <li>
                <strong className="text-slate-100">Balancing Story Points & Tech Debt:</strong> Rushing to ship feature after feature adds technical debt. High tech debt triggers catastrophic server crashes and hallucinations during peak hours.
              </li>
              <li>
                <strong className="text-slate-100">Prompt Guardrails & Schema Enforcement:</strong> Concierge LLMs without guardrails can hallucinate free presidential suites or $0 rates when tricked by guests.
              </li>
              <li>
                <strong className="text-slate-100">A/B Testing with Statistical Significance:</strong> Never roll out dynamic pricing tweaks or concierge tone changes without verifying p-values (&lt; 0.05) on test cohorts.
              </li>
              <li>
                <strong className="text-slate-100">Human-in-the-Loop Handoff:</strong> When an AI agent confidence score drops below your threshold, seamlessly route the inquiry to the human front desk.
              </li>
            </ul>
          </div>

          {/* Section 3: The 6 AI Hotel Systems */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 font-retro text-xs font-bold">
              <Cpu className="w-4 h-4" />
              <span>3. The 6 AI Hotel Systems in the Game</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px] font-mono">
              <div className="p-2 bg-slate-900 rounded border border-slate-800">
                <span className="text-amber-400 block font-retro">Dynamic Pricing</span>
                Optimizes rates based on flights, weather, and competitor demand elasticity.
              </div>
              <div className="p-2 bg-slate-900 rounded border border-slate-800">
                <span className="text-cyan-400 block font-retro">Multilingual Concierge</span>
                24/7 guest check-in kiosks and voice assistants in 40+ languages.
              </div>
              <div className="p-2 bg-slate-900 rounded border border-slate-800">
                <span className="text-purple-400 block font-retro">Hyper-Personalization</span>
                Remembers pillow preferences, room temperature, and custom travel itineraries.
              </div>
              <div className="p-2 bg-slate-900 rounded border border-slate-800">
                <span className="text-emerald-400 block font-retro">Predictive IoT</span>
                Vibration & acoustic sensors preventing HVAC and elevator breakdowns.
              </div>
              <div className="p-2 bg-slate-900 rounded border border-slate-800">
                <span className="text-pink-400 block font-retro">NLP Sentiment Recovery</span>
                Detects guest frustration early and issues automated delight perks.
              </div>
              <div className="p-2 bg-slate-900 rounded border border-slate-800">
                <span className="text-blue-400 block font-retro">Autonomous Housekeeping</span>
                Dynamic turnover routing and robotic cleaning fleets for fast turnarounds.
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 mt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={() => { sound.playClick(); onClose(); }}
            className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-pixel text-xs px-4 py-2 rounded pixel-btn"
          >
            GOT IT, LET'S SHIP!
          </button>
        </div>
      </div>
    </div>
  );
};
