import React, { useState } from 'react';
import { ABExperiment, ModelTuningConfig, HotelMetrics } from '../types/game';
import { sound } from '../services/sound';
import { Sliders, TestTube, CheckCircle2, AlertCircle, ArrowUpRight, Zap, RefreshCw } from 'lucide-react';

interface ExperimentationLabProps {
  experiments: ABExperiment[];
  modelConfig: ModelTuningConfig;
  metrics: HotelMetrics;
  onUpdateModelConfig: (newConfig: ModelTuningConfig) => void;
  onPromoteVariant: (experimentId: string, winner: 'A' | 'B') => void;
  onStartNewExperiment: (exp: ABExperiment) => void;
}

export const ExperimentationLab: React.FC<ExperimentationLabProps> = ({
  experiments,
  modelConfig,
  metrics,
  onUpdateModelConfig,
  onPromoteVariant,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'ab_testing' | 'model_tuning'>('ab_testing');

  const handleSliderChange = (key: keyof ModelTuningConfig, value: any) => {
    onUpdateModelConfig({
      ...modelConfig,
      [key]: value
    });
  };

  return (
    <div className="space-y-6">
      {/* Sub navigation */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => { sound.playClick(); setActiveSubTab('ab_testing'); }}
            className={`px-3 py-1.5 rounded text-xs font-pixel transition-all ${
              activeSubTab === 'ab_testing'
                ? 'bg-purple-600 text-white font-bold pixel-btn'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            A/B EXPERIMENTATION
          </button>
          <button
            onClick={() => { sound.playClick(); setActiveSubTab('model_tuning'); }}
            className={`px-3 py-1.5 rounded text-xs font-pixel transition-all ${
              activeSubTab === 'model_tuning'
                ? 'bg-purple-600 text-white font-bold pixel-btn'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            MODEL TUNING & GUARDRAILS
          </button>
        </div>

        <div className="text-xs font-mono text-slate-400">
          AI Trust Score: <strong className="text-cyan-400 font-pixel text-[11px]">{Math.round(metrics.aiTrustScore)}%</strong>
        </div>
      </div>

      {activeSubTab === 'ab_testing' ? (
        <div className="space-y-5">
          <div className="bg-slate-900 border-2 border-slate-800 rounded-xl p-4 pixel-box">
            <h2 className="font-pixel text-xs text-purple-400 mb-1">
              HOSPITALITY A/B EXPERIMENTATION MATRIX
            </h2>
            <p className="text-xs text-slate-400">
              In AI product management, algorithmic changes must be validated against a baseline with statistically significant p-values (p &lt; 0.05). Running experiments tests elasticity, concierge tone, and recovery vouchers in real time.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {experiments.map(exp => {
              const isSignificant = exp.pValue <= 0.05;
              const isFinished = exp.sampleSize >= exp.targetSample;

              return (
                <div
                  key={exp.id}
                  className="bg-slate-900 border-2 border-slate-800 rounded-xl p-5 pixel-box flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <span className="font-pixel text-[10px] text-amber-400 block mb-1">
                          EXPERIMENT #{exp.id.toUpperCase()}
                        </span>
                        <h3 className="font-retro text-sm font-bold text-slate-100">{exp.name}</h3>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-pixel ${
                        exp.status === 'completed'
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                          : 'bg-purple-950 text-purple-300 border border-purple-800'
                      }`}>
                        {exp.status.toUpperCase()}
                      </span>
                    </div>

                    <p className="text-xs text-slate-400 mb-4 italic">"{exp.hypothesis}"</p>

                    {/* Variant comparison cards */}
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      {/* Variant A */}
                      <div className="p-3 bg-slate-950 rounded border border-slate-800">
                        <span className="text-[10px] font-retro text-slate-400 block mb-1">Variant A (Control - 50%)</span>
                        <p className="text-xs text-slate-200 font-semibold">{exp.variantA}</p>
                      </div>

                      {/* Variant B */}
                      <div className="p-3 bg-slate-950 rounded border border-purple-900/60">
                        <span className="text-[10px] font-retro text-purple-400 block mb-1">Variant B (Challenger - 50%)</span>
                        <p className="text-xs text-purple-200 font-semibold">{exp.variantB}</p>
                      </div>
                    </div>

                    {/* Sample Size Progress */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-1">
                        <span>Sample Size: {exp.sampleSize} / {exp.targetSample} bookings</span>
                        <span>{Math.round((exp.sampleSize / exp.targetSample) * 100)}%</span>
                      </div>
                      <div className="w-full bg-slate-950 h-2 rounded overflow-hidden">
                        <div
                          className="bg-purple-500 h-full transition-all"
                          style={{ width: `${Math.min(100, (exp.sampleSize / exp.targetSample) * 100)}%` }}
                        />
                      </div>
                    </div>

                    {/* Measured Metrics */}
                    <div className="grid grid-cols-3 gap-2 bg-slate-950 p-3 rounded border border-slate-800 text-xs font-mono mb-4">
                      <div>
                        <span className="text-[10px] text-slate-400 font-retro block">RevPAR Lift</span>
                        <span className={`font-pixel text-[11px] ${exp.liftRevPar >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                          {exp.liftRevPar >= 0 ? `+${exp.liftRevPar}%` : `${exp.liftRevPar}%`}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 font-retro block">CSAT Impact</span>
                        <span className={`font-pixel text-[11px] ${exp.liftCsat >= 0 ? 'text-cyan-400' : 'text-red-400'}`}>
                          {exp.liftCsat >= 0 ? `+${exp.liftCsat}` : exp.liftCsat}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 font-retro block">p-Value</span>
                        <span className={`font-pixel text-[11px] ${isSignificant ? 'text-emerald-400' : 'text-amber-400'}`}>
                          {exp.pValue.toFixed(3)} {isSignificant && '✓'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Promotion Button */}
                  <div>
                    {exp.status === 'completed' ? (
                      <div className="flex items-center gap-2 text-xs font-retro text-emerald-400 bg-emerald-950/40 p-2.5 rounded border border-emerald-900">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Promoted Variant {exp.winner} to Global Production</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => { sound.playSuccess(); onPromoteVariant(exp.id, 'B'); }}
                          disabled={!isFinished}
                          className="flex-1 bg-purple-600 hover:bg-purple-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-pixel text-[10px] py-2 rounded pixel-btn transition-colors"
                        >
                          {isFinished ? 'ROLLOUT VARIANT B' : 'COLLECTING DATA...'}
                        </button>
                        <button
                          onClick={() => { sound.playClick(); onPromoteVariant(exp.id, 'A'); }}
                          disabled={!isFinished}
                          className="px-3 bg-slate-800 hover:bg-slate-700 disabled:bg-slate-800 text-slate-300 font-pixel text-[10px] py-2 rounded"
                          title="Keep Control Variant A"
                        >
                          KEEP A
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Model Tuning & Guardrails Studio */
        <div className="bg-slate-900 border-2 border-slate-800 rounded-xl p-5 pixel-box space-y-6">
          <div>
            <h2 className="font-pixel text-xs text-purple-400 mb-1">
              NEURAL INFERENCE & SAFETY GUARDRAILS
            </h2>
            <p className="text-xs text-slate-400">
              Configure hyperparameters for the hotel LLM concierge and ML pricing models. Higher temperatures increase conversational flair but increase hallucination risks!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Model Temperature Slider */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-retro text-xs font-bold text-slate-200">Model Temperature</h4>
                  <p className="text-[11px] text-slate-400">Controls creative variability vs strict consistency</p>
                </div>
                <span className="font-pixel text-amber-400 text-xs">{modelConfig.temperature.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="1.0"
                step="0.05"
                value={modelConfig.temperature}
                onChange={e => handleSliderChange('temperature', parseFloat(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-500">
                <span>0.1 (Deterministic)</span>
                <span>0.5 (Balanced)</span>
                <span>1.0 (High Flair / Hallucination Risk)</span>
              </div>
            </div>

            {/* Hallucination Filter Strictness */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-retro text-xs font-bold text-slate-200">Hallucination Guardrail Strictness</h4>
                  <p className="text-[11px] text-slate-400">Regex & semantic filters blocking contract promises</p>
                </div>
                <span className="font-pixel text-cyan-400 text-xs">{Math.round(modelConfig.hallucinationThreshold * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.2"
                max="0.95"
                step="0.05"
                value={modelConfig.hallucinationThreshold}
                onChange={e => handleSliderChange('hallucinationThreshold', parseFloat(e.target.value))}
                className="w-full accent-cyan-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-500">
                <span>20% (Loose)</span>
                <span>60% (Recommended)</span>
                <span>95% (Maximum Guard)</span>
              </div>
            </div>

            {/* Human Handoff Confidence Threshold */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-retro text-xs font-bold text-slate-200">Human Handoff Confidence Floor</h4>
                  <p className="text-[11px] text-slate-400">Routes guest inquiry to front desk when confidence dips</p>
                </div>
                <span className="font-pixel text-emerald-400 text-xs">{Math.round(modelConfig.humanHandoffConfidence * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="0.95"
                step="0.05"
                value={modelConfig.humanHandoffConfidence}
                onChange={e => handleSliderChange('humanHandoffConfidence', parseFloat(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-500">
                <span>50% (Autonomous)</span>
                <span>75% (Balanced)</span>
                <span>95% (High Human Overhead)</span>
              </div>
            </div>

            {/* Compute Cluster Tier */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <h4 className="font-retro text-xs font-bold text-slate-200">Cloud AI Inference Infrastructure</h4>
              <p className="text-[11px] text-slate-400">Determines model response latency and compute billing</p>
              <div className="grid grid-cols-3 gap-2 pt-1">
                {(['Standard TPU', 'Enterprise GPU', 'Edge Mesh Node'] as const).map(cluster => (
                  <button
                    key={cluster}
                    onClick={() => {
                      sound.playClick();
                      const costs = { 'Standard TPU': 200, 'Enterprise GPU': 600, 'Edge Mesh Node': 1200 };
                      onUpdateModelConfig({
                        ...modelConfig,
                        computeClusterTier: cluster,
                        monthlyComputeCost: costs[cluster]
                      });
                    }}
                    className={`p-2 rounded text-left border transition-all ${
                      modelConfig.computeClusterTier === cluster
                        ? 'bg-purple-950 border-purple-400 text-purple-200 font-bold'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <span className="font-pixel text-[9px] block mb-1">{cluster}</span>
                    <span className="text-[10px] font-mono text-amber-400">
                      ${cluster === 'Standard TPU' ? '200' : cluster === 'Enterprise GPU' ? '600' : '1,200'}/mo
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
