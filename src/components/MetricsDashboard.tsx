import React from 'react';
import { HotelMetrics, GuestReview, AIProduct } from '../types/game';
import { Star, MessageSquare, TrendingUp, DollarSign, Award, ThumbsUp, ThumbsDown, AlertCircle } from 'lucide-react';

interface MetricsDashboardProps {
  metrics: HotelMetrics;
  reviews: GuestReview[];
  products: AIProduct[];
}

export const MetricsDashboard: React.FC<MetricsDashboardProps> = ({
  metrics,
  reviews,
  products,
}) => {
  const averageRating = reviews.length > 0
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : '4.8';

  const positiveReviews = reviews.filter(r => r.sentiment === 'positive').length;
  const negativeReviews = reviews.filter(r => r.sentiment === 'negative').length;

  return (
    <div className="space-y-6">
      {/* Hospitality KPIs Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* RevPAR */}
        <div className="bg-slate-900 border-2 border-slate-800 rounded-xl p-4 pixel-box">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="font-retro text-xs">RevPAR</span>
            <TrendingUp className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="font-pixel text-lg text-cyan-400">${Math.round(metrics.revPar)}</div>
          <p className="text-[11px] text-slate-400 mt-1 font-mono">
            ADR (${Math.round(metrics.adr)}) × Occupancy ({Math.round(metrics.occupancyRate)}%)
          </p>
        </div>

        {/* Total Cash Balance */}
        <div className="bg-slate-900 border-2 border-slate-800 rounded-xl p-4 pixel-box">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="font-retro text-xs">HOTEL TREASURY</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="font-pixel text-lg text-emerald-400">${metrics.cash.toLocaleString()}</div>
          <p className="text-[11px] text-slate-400 mt-1 font-mono">
            Daily Net: +${Math.round(metrics.dailyRevenue - metrics.dailyCost)}/day
          </p>
        </div>

        {/* CSAT / Guest Satisfaction */}
        <div className="bg-slate-900 border-2 border-slate-800 rounded-xl p-4 pixel-box">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="font-retro text-xs">CSAT INDEX</span>
            <Award className="w-4 h-4 text-amber-400" />
          </div>
          <div className="font-pixel text-lg text-amber-400">{Math.round(metrics.csat)}%</div>
          <p className="text-[11px] text-slate-400 mt-1 font-mono">
            Avg Star Rating: {averageRating} / 5.0
          </p>
        </div>

        {/* AI Trust Score */}
        <div className="bg-slate-900 border-2 border-slate-800 rounded-xl p-4 pixel-box">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="font-retro text-xs">AI TRUST & ACCURACY</span>
            <span className="font-pixel text-[10px] text-purple-400">MODEL</span>
          </div>
          <div className="font-pixel text-lg text-purple-400">{Math.round(metrics.aiTrustScore)}%</div>
          <p className="text-[11px] text-slate-400 mt-1 font-mono">
            Tech Debt: {Math.round(metrics.techDebt)}%
          </p>
        </div>
      </div>

      {/* Main Analysis Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Hospitality Operations & Unit Economics */}
        <div className="bg-slate-900 border-2 border-slate-800 rounded-xl p-5 pixel-box space-y-4">
          <h3 className="font-pixel text-xs text-amber-400">UNIT ECONOMICS BREAKDOWN</h3>

          <div className="space-y-3 font-mono text-xs">
            <div className="flex justify-between items-center py-1.5 border-b border-slate-800">
              <span className="text-slate-400">Total Guests Accommodated</span>
              <span className="text-slate-100 font-bold">{metrics.totalGuestsServed} guests</span>
            </div>

            <div className="flex justify-between items-center py-1.5 border-b border-slate-800">
              <span className="text-slate-400">Daily Revenue Run-Rate</span>
              <span className="text-emerald-400 font-bold">${Math.round(metrics.dailyRevenue)}</span>
            </div>

            <div className="flex justify-between items-center py-1.5 border-b border-slate-800">
              <span className="text-slate-400">Daily Operating & Cloud Cost</span>
              <span className="text-red-400 font-bold">-${Math.round(metrics.dailyCost)}</span>
            </div>

            <div className="flex justify-between items-center py-1.5 border-b border-slate-800">
              <span className="text-slate-400">Gross Operating Margin</span>
              <span className="text-cyan-400 font-bold">
                {metrics.dailyRevenue > 0
                  ? `${Math.round(((metrics.dailyRevenue - metrics.dailyCost) / metrics.dailyRevenue) * 100)}%`
                  : '0%'}
              </span>
            </div>

            <div className="flex justify-between items-center py-1.5">
              <span className="text-slate-400">Active AI Product Tiers</span>
              <span className="text-amber-400 font-bold">
                {products.reduce((acc, p) => acc + p.currentLevel, 0)} / 18
              </span>
            </div>
          </div>

          {/* Real world PM note */}
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-xs text-slate-300 font-sans">
            <span className="font-retro text-amber-400 block mb-1">PM Insight: RevPAR vs ADR</span>
            High ADR is meaningless if your hotel occupancy crashes. Effective AI dynamic pricing finds the micro-elasticity sweet spot where rooms sell at optimal yield.
          </div>
        </div>

        {/* Right 2 Columns: Live Simulated Social & Guest Review Feed */}
        <div className="lg:col-span-2 bg-slate-900 border-2 border-slate-800 rounded-xl p-5 pixel-box">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-cyan-400" />
              <h3 className="font-pixel text-xs text-slate-100">LIVE GUEST REVIEWS & CHAT FEED</h3>
            </div>
            <div className="flex items-center gap-3 text-xs font-mono text-slate-400">
              <span className="text-emerald-400">+{positiveReviews} Positive</span>
              <span>·</span>
              <span className="text-red-400">-{negativeReviews} Negative</span>
            </div>
          </div>

          {reviews.length === 0 ? (
            <div className="p-8 text-center text-xs font-retro text-slate-500">
              No reviews logged yet. Guests will post reviews upon checkout!
            </div>
          ) : (
            <div className="space-y-3 max-h-[460px] overflow-y-auto pr-2">
              {reviews.map(review => (
                <div
                  key={review.id}
                  className="bg-slate-950 p-3.5 rounded-lg border border-slate-800/80 hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="font-retro text-xs font-bold text-slate-200">{review.author}</span>
                      <span className="text-[10px] font-mono text-slate-400">({review.guestType})</span>
                      <span className="text-[10px] font-retro text-amber-400 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
                        {review.platform}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < review.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-700'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 mb-2 font-sans">"{review.comment}"</p>

                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                    <span className="flex items-center gap-1.5">
                      {review.sentiment === 'positive' ? (
                        <span className="text-emerald-400 flex items-center gap-1">
                          <ThumbsUp className="w-3 h-3" /> Sentiment: Positive
                        </span>
                      ) : review.sentiment === 'negative' ? (
                        <span className="text-red-400 flex items-center gap-1">
                          <ThumbsDown className="w-3 h-3" /> Sentiment: Negative
                        </span>
                      ) : (
                        <span className="text-slate-400">Sentiment: Neutral</span>
                      )}
                    </span>

                    <span>Day {review.day}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
