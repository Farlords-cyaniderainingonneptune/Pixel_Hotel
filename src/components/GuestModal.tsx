import React from 'react';
import { Guest, HotelRoom } from '../types/game';
import { sound } from '../services/sound';
import { X, User, Heart, MessageSquare, Gift, Award, DollarSign } from 'lucide-react';

interface GuestModalProps {
  guest: Guest | null;
  room?: HotelRoom;
  onClose: () => void;
  onSendPerk: (guestId: string) => void;
}

export const GuestModal: React.FC<GuestModalProps> = ({
  guest,
  room,
  onClose,
  onSendPerk,
}) => {
  if (!guest) return null;

  const getPersonaDescription = (type: string) => {
    switch (type) {
      case 'vip': return 'High net-worth guest with zero tolerance for service friction or model hallucinations.';
      case 'tech_nomad': return 'Remote worker who tests IoT endpoints, values high-bandwidth Wi-Fi and instant AI concierge replies.';
      case 'business': return 'Corporate executive sensitive to check-in velocity and expense-account seamlessness.';
      default: return 'Leisure tourist looking for personalized local excursions and cozy hotel amenities.';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm select-none">
      <div className="bg-slate-900 border-4 border-slate-700 rounded-xl max-w-md w-full p-6 pixel-box shadow-2xl animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center border-2 border-slate-700"
              style={{ backgroundColor: guest.spriteColor }}
            >
              <User className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-pixel text-[10px] text-amber-400 uppercase">
                {guest.loyaltyLevel} TIER · {guest.type.replace('_', ' ').toUpperCase()}
              </span>
              <h2 className="font-pixel text-sm text-slate-100">{guest.name}</h2>
            </div>
          </div>
          <button
            onClick={() => { sound.playClick(); onClose(); }}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-4 mb-5">
          <p className="text-xs text-slate-300 font-sans italic bg-slate-950 p-2.5 rounded border border-slate-800">
            "{getPersonaDescription(guest.type)}"
          </p>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
              <span className="text-[10px] font-retro text-slate-400 block mb-0.5">ROOM ALLOCATION</span>
              <span className="font-pixel text-xs text-cyan-400">
                {room ? `Room ${room.number}` : 'Lobby / In Transit'}
              </span>
              <span className="text-[10px] font-mono text-slate-400 block mt-0.5">
                Stay Remaining: {guest.stayDaysRemaining} days
              </span>
            </div>

            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
              <span className="text-[10px] font-retro text-slate-400 block mb-0.5">GUEST SATISFACTION</span>
              <span className={`font-pixel text-xs ${
                guest.satisfaction >= 75 ? 'text-emerald-400' : guest.satisfaction >= 50 ? 'text-amber-400' : 'text-red-400'
              }`}>
                {Math.round(guest.satisfaction)}%
              </span>
              <span className="text-[10px] font-mono text-slate-400 block mt-0.5">
                Spend: ${guest.spendTotal}
              </span>
            </div>
          </div>

          {/* AI Interaction Log */}
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-retro text-purple-300">
              <MessageSquare className="w-3.5 h-3.5" />
              <span>AI Concierge Touchpoints ({guest.aiInteractionCount})</span>
            </div>
            <div className="text-[11px] font-mono text-slate-400 space-y-1">
              <div>✓ Contactless check-in processed via Neural Kiosk</div>
              <div>✓ Personalized amenity matrix: Firm pillows, Oat milk latte</div>
              {guest.aiInteractionCount > 2 && (
                <div>✓ In-stay sentiment classified: 94% delight score</div>
              )}
            </div>
          </div>
        </div>

        {/* Action: Send Instant Recovery Perk */}
        <div className="pt-2 border-t border-slate-800">
          <button
            onClick={() => {
              sound.playSuccess();
              onSendPerk(guest.id);
            }}
            className="w-full bg-purple-600 hover:bg-purple-500 text-white font-pixel text-[10px] py-2.5 rounded pixel-btn transition-colors flex items-center justify-center gap-2"
          >
            <Gift className="w-3.5 h-3.5" />
            <span>ISSUE AI DELIGHT RECOVERY PERK ($25)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
