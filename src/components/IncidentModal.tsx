import React from 'react';
import { AIIncident, AIIncidentChoice } from '../types/game';
import { sound } from '../services/sound';
import { AlertOctagon, ShieldAlert, CheckCircle2 } from 'lucide-react';

interface IncidentModalProps {
  incident: AIIncident | null;
  onResolve: (choice: AIIncidentChoice) => void;
  onClose: () => void;
}

export const IncidentModal: React.FC<IncidentModalProps> = ({
  incident,
  onResolve,
  onClose,
}) => {
  if (!incident) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm select-none">
      <div className="bg-slate-900 border-4 border-red-600 rounded-xl max-w-xl w-full p-6 pixel-box shadow-2xl animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="flex items-start gap-3 border-b-2 border-red-900/50 pb-4 mb-4">
          <div className="p-3 bg-red-950 rounded-lg border border-red-700 text-red-400">
            <AlertOctagon className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-pixel text-[10px] bg-red-600 text-white px-2 py-0.5 rounded uppercase">
                {incident.severity} SEVERITY
              </span>
              <span className="text-xs font-mono text-slate-400">Source: {incident.triggerSource}</span>
            </div>
            <h2 className="font-pixel text-sm text-red-400 mt-1">{incident.title}</h2>
          </div>
        </div>

        {/* Incident Narrative */}
        <div className="space-y-3 mb-5">
          <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800 text-xs text-slate-200 leading-relaxed font-sans">
            {incident.description}
          </div>

          <div className="bg-amber-950/30 p-2.5 rounded-lg border border-amber-800/60 text-[11px] text-amber-300 font-sans">
            <strong className="font-retro block mb-0.5">PM Takeaway:</strong> {incident.realWorldLesson}
          </div>
        </div>

        {/* Player Choices */}
        <div className="space-y-3 mb-4">
          <span className="font-pixel text-[11px] text-slate-300 block">SELECT PRODUCT TRIAGE STRATEGY:</span>
          {incident.choices.map((choice, idx) => (
            <button
              key={idx}
              onClick={() => {
                sound.playSuccess();
                onResolve(choice);
              }}
              className="w-full text-left p-3.5 rounded-lg bg-slate-950 hover:bg-slate-800 border-2 border-slate-800 hover:border-amber-400 pixel-btn transition-all group"
            >
              <div className="flex items-start justify-between gap-2">
                <span className="font-retro text-xs text-slate-100 group-hover:text-amber-400 font-bold">
                  {choice.text}
                </span>
              </div>
              <div className="flex items-center gap-3 mt-2 text-[11px] font-mono text-slate-400">
                {choice.cost !== 0 && (
                  <span className={choice.cost > 0 ? 'text-red-400' : 'text-emerald-400'}>
                    {choice.cost > 0 ? `-$${choice.cost}` : `+$${Math.abs(choice.cost)}`} Cash
                  </span>
                )}
                <span className={choice.csatDelta >= 0 ? 'text-emerald-400' : 'text-red-400'}>
                  {choice.csatDelta >= 0 ? `+${choice.csatDelta}` : choice.csatDelta} CSAT
                </span>
                <span className={choice.techDebtDelta <= 0 ? 'text-emerald-400' : 'text-red-400'}>
                  {choice.techDebtDelta >= 0 ? `+${choice.techDebtDelta}` : choice.techDebtDelta}% Tech Debt
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
