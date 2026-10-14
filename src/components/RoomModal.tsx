import React from 'react';
import { HotelRoom, Guest } from '../types/game';
import { sound } from '../services/sound';
import { X, Wrench, Sparkles, DollarSign, Cpu, CheckCircle } from 'lucide-react';

interface RoomModalProps {
  room: HotelRoom | null;
  guest?: Guest;
  onClose: () => void;
  onDispatchCleaning: (roomId: string) => void;
  onFixIoT: (roomId: string) => void;
  onOverridePrice: (roomId: string, newPrice: number) => void;
}

export const RoomModal: React.FC<RoomModalProps> = ({
  room,
  guest,
  onClose,
  onDispatchCleaning,
  onFixIoT,
  onOverridePrice,
}) => {
  if (!room) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm select-none">
      <div className="bg-slate-900 border-4 border-slate-700 rounded-xl max-w-md w-full p-6 pixel-box shadow-2xl animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
          <div>
            <span className="font-pixel text-[10px] text-amber-400 uppercase">
              FLOOR {room.floor} · {room.tier.toUpperCase()} TIER
            </span>
            <h2 className="font-pixel text-base text-slate-100">ROOM #{room.number}</h2>
          </div>
          <button
            onClick={() => { sound.playClick(); onClose(); }}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Room Status & Details */}
        <div className="space-y-4 mb-5">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
              <span className="text-[10px] font-retro text-slate-400 block mb-0.5">OCCUPANCY STATUS</span>
              <span className={`font-pixel text-xs ${room.occupied ? 'text-emerald-400' : 'text-slate-400'}`}>
                {room.occupied ? 'OCCUPIED' : 'VACANT'}
              </span>
              {guest && (
                <p className="text-xs text-slate-300 font-sans mt-1">Guest: {guest.name}</p>
              )}
            </div>

            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
              <span className="text-[10px] font-retro text-slate-400 block mb-0.5">CURRENT NIGHTLY RATE</span>
              <span className="font-pixel text-xs text-amber-400">${room.currentPrice}</span>
              <p className="text-[11px] text-slate-400 font-mono mt-1">Base: ${room.basePrice}</p>
            </div>
          </div>

          {/* Cleanliness Meter */}
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1.5">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-400 font-retro">Cleanliness</span>
              <span className={room.cleanliness > 70 ? 'text-emerald-400' : 'text-amber-400'}>
                {Math.round(room.cleanliness)}%
              </span>
            </div>
            <div className="w-full bg-slate-900 h-2 rounded overflow-hidden">
              <div
                className={`h-full ${room.cleanliness > 70 ? 'bg-emerald-500' : 'bg-amber-500'}`}
                style={{ width: `${room.cleanliness}%` }}
              />
            </div>
          </div>

          {/* IoT Telemetry */}
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-cyan-400" />
              <div>
                <span className="text-xs font-retro text-slate-200 block">IoT Edge Telemetry</span>
                <span className={`text-[11px] font-mono ${
                  room.iotStatus === 'normal' ? 'text-emerald-400' : 'text-red-400'
                }`}>
                  Status: {room.iotStatus.replace('_', ' ').toUpperCase()}
                </span>
              </div>
            </div>
            {room.iotStatus !== 'normal' && (
              <button
                onClick={() => { sound.playClick(); onFixIoT(room.id); }}
                className="bg-cyan-600 hover:bg-cyan-500 text-white font-pixel text-[10px] px-2.5 py-1.5 rounded pixel-btn"
              >
                FIX SENSOR ($50)
              </button>
            )}
          </div>
        </div>

        {/* PM Actions */}
        <div className="space-y-2 pt-2 border-t border-slate-800">
          <div className="flex gap-2">
            <button
              onClick={() => { sound.playClick(); onDispatchCleaning(room.id); }}
              disabled={room.cleanliness >= 95}
              className="flex-1 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-200 font-retro text-xs py-2 rounded border border-slate-700 flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Dispatch Cleaning Bot</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
