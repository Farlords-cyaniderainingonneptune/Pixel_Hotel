import React, { useState } from 'react';
import { AIProduct, ActiveSprint, SprintItem, HotelMetrics } from '../types/game';
import { sound } from '../services/sound';
import { CheckCircle2, AlertTriangle, Layers, Plus, Trash2, ArrowRight, ShieldCheck, Wrench, Sparkles, TrendingUp, Bot, Cpu, MessageSquareText, Boxes } from 'lucide-react';

interface RoadmapViewProps {
  products: AIProduct[];
  activeSprint: ActiveSprint;
  metrics: HotelMetrics;
  onAddSprintItem: (item: SprintItem) => void;
  onRemoveSprintItem: (itemId: string) => void;
  onStartSprint: () => void;
  onFastCompleteSprint: () => void;
  onDirectUnlockProduct: (productId: string, level: number) => void;
}

export const RoadmapView: React.FC<RoadmapViewProps> = ({
  products,
  activeSprint,
  metrics,
  onAddSprintItem,
  onRemoveSprintItem,
  onStartSprint,
  onFastCompleteSprint,
}) => {
  const [selectedProduct, setSelectedProduct] = useState<AIProduct>(products[0]);
  const [filterCategory, setFilterCategory] = useState<string>('All');

  const getProductIcon = (iconName: string) => {
    switch (iconName) {
      case 'TrendingUp': return <TrendingUp className="w-5 h-5 text-amber-400" />;
      case 'Bot': return <Bot className="w-5 h-5 text-cyan-400" />;
      case 'Sparkles': return <Sparkles className="w-5 h-5 text-purple-400" />;
      case 'Cpu': return <Cpu className="w-5 h-5 text-emerald-400" />;
      case 'MessageSquareText': return <MessageSquareText className="w-5 h-5 text-pink-400" />;
      case 'Boxes': return <Boxes className="w-5 h-5 text-blue-400" />;
      default: return <Layers className="w-5 h-5 text-slate-400" />;
    }
  };

  const categories = ['All', 'Revenue Ops', 'Guest Experience', 'IoT & Facilities', 'Autonomous Ops'];

  const filteredProducts = filterCategory === 'All'
    ? products
    : products.filter(p => p.category === filterCategory);

  // Quick action: Add refactor / tech debt task to sprint
  const handleAddRefactorTask = () => {
    sound.playClick();
    const item: SprintItem = {
      id: `refactor-${Date.now()}`,
      title: 'Architectural Refactor & Code Review',
      category: 'bugfix',
      storyPoints: 5,
      description: 'Clean up legacy microservices, reduce database locks, and optimize thread pools.',
      impactPreview: '-15% Tech Debt, +5% System Stability',
      completed: false
    };
    onAddSprintItem(item);
  };

  // Quick action: Add LLM guardrails task
  const handleAddGuardrailsTask = () => {
    sound.playClick();
    const item: SprintItem = {
      id: `guardrails-${Date.now()}`,
      title: 'Deterministic LLM Output Validation & Prompt Guardrails',
      category: 'guardrail',
      storyPoints: 6,
      description: 'Implement Pydantic-style JSON output schemas and adversarial prompt filters on concierge agents.',
      impactPreview: '+15% AI Trust, Prevents Hallucinated Rate Exploits',
      completed: false
    };
    onAddSprintItem(item);
  };

  const handleQueueTier = (product: AIProduct, tier: any) => {
    sound.playClick();
    const item: SprintItem = {
      id: `tier-${product.id}-${tier.level}-${Date.now()}`,
      title: `${product.name} (Tier ${tier.level}: ${tier.title})`,
      category: 'feature',
      storyPoints: tier.storyPointsCost,
      description: tier.description,
      productId: product.id,
      targetTier: tier.level,
      impactPreview: `+${tier.revParBonusPct}% RevPAR, ${tier.csatBonus >= 0 ? '+' : ''}${tier.csatBonus} CSAT`,
      completed: false
    };
    onAddSprintItem(item);
  };

  return (
    <div className="space-y-6">
      {/* Sprint Planning Board Header */}
      <div className="bg-slate-900 border-2 border-slate-800 rounded-xl p-4 pixel-box">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-pixel text-amber-400 text-xs sm:text-sm">
                SPRINT #{activeSprint.number} PLANNING BOARD
              </span>
              <span className="text-xs font-mono text-slate-400">
                Status: <strong className="text-cyan-400 font-retro uppercase">{activeSprint.status}</strong>
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Engineering Velocity Budget: <strong>{activeSprint.totalPoints} Story Points</strong> per 3-day sprint.
              Allocate points between new AI features, tech debt refactoring, and AI safety guardrails.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {activeSprint.status === 'planning' ? (
              <button
                onClick={() => { sound.playSuccess(); onStartSprint(); }}
                disabled={activeSprint.allocatedPoints === 0}
                className="bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 text-white font-pixel text-xs px-4 py-2 rounded pixel-btn transition-colors"
              >
                START SPRINT ({activeSprint.allocatedPoints}/{activeSprint.totalPoints} SP)
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <div className="bg-slate-950 px-3 py-1.5 rounded border border-slate-800 text-xs font-mono">
                  <span className="text-slate-400">Progress: </span>
                  <span className="text-amber-400 font-pixel text-[11px]">{Math.round(activeSprint.progressPercent)}%</span>
                </div>
                <button
                  onClick={() => { sound.playSuccess(); onFastCompleteSprint(); }}
                  className="bg-cyan-600 hover:bg-cyan-500 text-white font-pixel text-[10px] px-3 py-2 rounded pixel-btn"
                >
                  SHIP SPRINT EARLY ($500)
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Sprint Capacity Bar */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-xs font-retro text-slate-400 mb-1">
            <span>Points Allocated: {activeSprint.allocatedPoints} / {activeSprint.totalPoints} SP</span>
            <span>{activeSprint.totalPoints - activeSprint.allocatedPoints} SP Remaining</span>
          </div>
          <div className="w-full bg-slate-950 h-3 rounded overflow-hidden border border-slate-800 flex">
            <div
              className={`h-full transition-all ${
                activeSprint.allocatedPoints > activeSprint.totalPoints
                  ? 'bg-red-500'
                  : 'bg-cyan-500'
              }`}
              style={{ width: `${Math.min(100, (activeSprint.allocatedPoints / activeSprint.totalPoints) * 100)}%` }}
            />
          </div>
        </div>

        {/* Selected Sprint Items Backlog */}
        <div className="mt-4 border-t border-slate-800 pt-3">
          <span className="font-retro text-xs text-slate-300 block mb-2">Committed Backlog:</span>
          {activeSprint.items.length === 0 ? (
            <div className="p-4 bg-slate-950/60 rounded text-center text-xs text-slate-500 font-retro border border-dashed border-slate-800">
              No items committed yet. Select an AI tier below or add technical debt / guardrail tasks to commit story points!
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {activeSprint.items.map(item => (
                <div
                  key={item.id}
                  className="bg-slate-950 p-2.5 rounded border border-slate-800 flex items-start justify-between gap-2"
                >
                  <div className="text-xs">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="font-pixel text-[9px] text-amber-400 bg-amber-950/60 px-1.5 py-0.5 rounded border border-amber-800">
                        {item.storyPoints} SP
                      </span>
                      <span className="font-retro text-slate-300 font-semibold">{item.title}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 line-clamp-1">{item.impactPreview}</p>
                  </div>
                  {activeSprint.status === 'planning' && (
                    <button
                      onClick={() => { sound.playClick(); onRemoveSprintItem(item.id); }}
                      className="text-slate-500 hover:text-red-400 p-1"
                      title="Remove from sprint"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Engineering Action Buttons */}
        {activeSprint.status === 'planning' && (
          <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-slate-800/80">
            <span className="text-xs font-retro text-slate-400">Engineering Work:</span>
            <button
              onClick={handleAddRefactorTask}
              disabled={activeSprint.allocatedPoints + 5 > activeSprint.totalPoints}
              className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-xs font-retro text-emerald-300 border border-slate-700 flex items-center gap-1.5"
            >
              <Wrench className="w-3.5 h-3.5" />
              <span>+ Refactor Tech Debt (5 SP)</span>
            </button>
            <button
              onClick={handleAddGuardrailsTask}
              disabled={activeSprint.allocatedPoints + 6 > activeSprint.totalPoints}
              className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-xs font-retro text-cyan-300 border border-slate-700 flex items-center gap-1.5"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>+ LLM Guardrails & Safety (6 SP)</span>
            </button>
          </div>
        )}
      </div>

      {/* Category Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => { sound.playClick(); setFilterCategory(cat); }}
            className={`px-3 py-1.5 rounded text-xs font-retro transition-colors ${
              filterCategory === cat
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* AI Product Catalog & Tier Progression */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Product Selection List */}
        <div className="space-y-3">
          {filteredProducts.map(prod => {
            const isSelected = selectedProduct.id === prod.id;
            return (
              <div
                key={prod.id}
                onClick={() => { sound.playClick(); setSelectedProduct(prod); }}
                className={`p-3 rounded-xl border-2 cursor-pointer transition-all pixel-btn ${
                  isSelected
                    ? 'bg-slate-800 border-cyan-400 shadow-md'
                    : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded bg-slate-950 border border-slate-800">
                      {getProductIcon(prod.icon)}
                    </div>
                    <div>
                      <h3 className="font-retro text-xs font-bold text-slate-100">{prod.name}</h3>
                      <span className="text-[10px] text-slate-400 font-mono">{prod.category}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-pixel text-[10px] text-amber-400">
                      LVL {prod.currentLevel}/{prod.maxLevel}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-slate-400 mt-2 line-clamp-1">{prod.tagline}</p>
              </div>
            );
          })}
        </div>

        {/* Right 2 Columns: Detailed Tech Tree Tiers for Selected Product */}
        <div className="lg:col-span-2 bg-slate-900 border-2 border-slate-800 rounded-xl p-5 pixel-box">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                {getProductIcon(selectedProduct.icon)}
              </div>
              <div>
                <h2 className="font-pixel text-sm text-cyan-400">{selectedProduct.name}</h2>
                <p className="text-xs text-slate-400 mt-0.5">{selectedProduct.tagline}</p>
              </div>
            </div>
            <div className="bg-slate-950 px-3 py-1.5 rounded border border-slate-800">
              <span className="text-xs font-mono text-slate-400">Current Level: </span>
              <span className="font-pixel text-xs text-amber-400">{selectedProduct.currentLevel} / {selectedProduct.maxLevel}</span>
            </div>
          </div>

          {/* 3 Tiers for the Product */}
          <div className="space-y-4">
            {selectedProduct.tiers.map(tier => {
              const isUnlocked = selectedProduct.currentLevel >= tier.level;
              const isNext = selectedProduct.currentLevel === tier.level - 1;
              const isCommitted = activeSprint.items.some(
                item => item.productId === selectedProduct.id && item.targetTier === tier.level
              );
              const canAffordPoints = activeSprint.allocatedPoints + tier.storyPointsCost <= activeSprint.totalPoints;
              const canAffordCash = metrics.cash >= tier.financialCost;

              return (
                <div
                  key={tier.level}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    isUnlocked
                      ? 'bg-emerald-950/20 border-emerald-800/80 text-emerald-200'
                      : isNext
                      ? 'bg-slate-950 border-amber-500/80 text-slate-200 shadow-md'
                      : 'bg-slate-950/50 border-slate-800 text-slate-500 opacity-60'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-pixel text-xs text-amber-400">
                        TIER {tier.level}: {tier.title}
                      </span>
                      {isUnlocked && (
                        <span className="flex items-center gap-1 text-[11px] font-retro text-emerald-400">
                          <CheckCircle2 className="w-3.5 h-3.5" /> UNLOCKED
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3 text-xs font-mono">
                      <span>{tier.storyPointsCost} Story Points</span>
                      <span>·</span>
                      <span>${tier.financialCost} Capex</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 mb-3">{tier.description}</p>

                  {/* Impact preview metrics */}
                  <div className="grid grid-cols-3 gap-2 bg-slate-900/80 p-2.5 rounded border border-slate-800 text-xs font-mono mb-3">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-retro">RevPAR Lift</span>
                      <span className="text-emerald-400 font-pixel text-[11px]">+{tier.revParBonusPct}%</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-retro">CSAT Effect</span>
                      <span className={`font-pixel text-[11px] ${tier.csatBonus >= 0 ? 'text-cyan-400' : 'text-red-400'}`}>
                        {tier.csatBonus >= 0 ? `+${tier.csatBonus}` : tier.csatBonus} pts
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-retro">Tech Debt</span>
                      <span className="text-amber-400 font-pixel text-[11px]">+{tier.techDebtAdded}%</span>
                    </div>
                  </div>

                  {/* Real world PM note */}
                  <div className="text-[11px] text-slate-400 bg-slate-900/40 p-2 rounded border-l-2 border-cyan-500 mb-3 font-sans">
                    <strong className="text-cyan-300 font-retro">Industry PM Grounding:</strong> {tier.realWorldContext}
                  </div>

                  {/* Action buttons */}
                  {!isUnlocked && isNext && (
                    <div className="flex items-center justify-end gap-2">
                      {isCommitted ? (
                        <span className="text-xs font-retro text-amber-400 bg-amber-950/60 px-3 py-1.5 rounded border border-amber-800">
                          Committed to Sprint #{activeSprint.number}
                        </span>
                      ) : (
                        <button
                          onClick={() => handleQueueTier(selectedProduct, tier)}
                          disabled={!canAffordPoints || !canAffordCash || activeSprint.status !== 'planning'}
                          className="bg-amber-500 hover:bg-amber-400 disabled:bg-slate-800 disabled:text-slate-500 text-slate-950 font-pixel text-[11px] px-3 py-1.5 rounded pixel-btn transition-colors"
                        >
                          {!canAffordCash ? 'INSUFFICIENT FUNDS' : !canAffordPoints ? 'NEED STORY POINTS' : '+ COMMIT TO SPRINT'}
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
