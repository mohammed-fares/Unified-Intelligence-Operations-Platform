import React, { useState } from 'react';
import { BehavioralMetric, Language } from '../types';
import { Brain, Activity, TrendingUp, AlertTriangle, Sparkles, Compass } from 'lucide-react';

interface BehavioralAnalyticsProps {
  metrics: BehavioralMetric[];
  lang: Language;
}

export const BehavioralAnalytics: React.FC<BehavioralAnalyticsProps> = ({ metrics, lang }) => {
  const isAr = lang === 'ar';
  const [selectedScenario, setSelectedScenario] = useState<number>(0);

  const scenarios = [
    {
      insightEn: 'AI Recommendation: Target is preparing for unscheduled travel. Financial and flight applications accessed 4 times in the past 2 hours.',
      insightAr: 'توصية الذكاء الاصطناعي: الهدف يستعد لسفر غير مجدول. تم فتح تطبيقات مالية وتتبع رحلات ٤ مرات خلال الساعتين الماضيتين.',
      level: 'HIGH_ALERT',
    },
    {
      insightEn: 'Pattern Shift: Night communication surge (+120%) with encrypted endpoints detected between 02:00 and 04:00.',
      insightAr: 'تغير في النمط: ارتفاع حاد في الاتصالات الليلية (+١٢٠٪) مع نقاط نهاية مشفرة بين الساعة ٠٢:٠٠ و ٠٤:٠٠ فجراً.',
      level: 'ELEVATED',
    },
  ];

  return (
    <div className="flex-1 bg-[#0f172a] border border-[#1e293b] rounded-lg p-3.5 flex flex-col justify-between shadow-lg">
      <div>
        <div className="flex justify-between items-center mb-3 pb-1 border-b border-slate-800">
          <h3 className="text-[10px] text-slate-400 font-bold uppercase tracking-widest font-mono flex items-center gap-1.5">
            <Brain className="w-3.5 h-3.5 text-cyan-400" />
            {isAr ? 'التحليل السلوكي (AI)' : 'Behavioral Analysis'}
          </h3>
          <span className="text-[9px] font-mono text-cyan-400 flex items-center gap-1">
            <Sparkles className="w-2.5 h-2.5" />
            BASELINE_ACTIVE
          </span>
        </div>

        {/* Progress Metrics List */}
        <div className="space-y-3">
          {/* Metric 1: Routine Deviation */}
          <div>
            <div className="flex justify-between text-[10px] mb-1 font-mono">
              <span className="text-slate-300">{isAr ? 'انحراف الروتين' : 'Routine Deviation'}</span>
              <span className="text-amber-400 font-bold">High (+42%)</span>
            </div>
            <div className="h-1.5 w-full bg-slate-800 rounded overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-red-500 rounded shadow-[0_0_8px_rgba(245,158,11,0.5)] transition-all duration-500"
                style={{ width: '72%' }}
              ></div>
            </div>
          </div>

          {/* Metric 2: Emotional Tone / Stress */}
          <div>
            <div className="flex justify-between text-[10px] mb-1 font-mono">
              <span className="text-slate-300">{isAr ? 'النبرة الانفعالية' : 'Emotional Tone'}</span>
              <span className="text-cyan-400 font-bold">Anxious / Alert</span>
            </div>
            <div className="h-1.5 w-full bg-slate-800 rounded overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-600 to-cyan-400 rounded shadow-[0_0_8px_rgba(6,182,212,0.5)] transition-all duration-500"
                style={{ width: '35%' }}
              ></div>
            </div>
          </div>

          {/* Metric 3: Communication Surge */}
          <div>
            <div className="flex justify-between text-[10px] mb-1 font-mono">
              <span className="text-slate-300">{isAr ? 'كثافة الاتصال' : 'Comms Intensity'}</span>
              <span className="text-purple-400 font-bold">Surge (+88%)</span>
            </div>
            <div className="h-1.5 w-full bg-slate-800 rounded overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded shadow-[0_0_8px_rgba(168,85,247,0.5)] transition-all duration-500"
                style={{ width: '88%' }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Recommendation Quote Box */}
      <div className="mt-3 pt-2.5 border-t border-slate-800 bg-slate-900/60 p-2 rounded border border-slate-800/80">
        <div className="flex justify-between items-center mb-1 text-[8px] font-mono text-cyan-400">
          <span className="flex items-center gap-1 font-bold">
            <Activity className="w-2.5 h-2.5" />
            AI INTEL PREDICTION
          </span>
          <button
            onClick={() => setSelectedScenario((prev) => (prev === 0 ? 1 : 0))}
            className="text-slate-400 hover:text-cyan-300 underline"
          >
            {isAr ? 'تبديل التحليل' : 'CYCLE'}
          </button>
        </div>
        <p className="text-[10px] text-slate-300 font-arabic italic leading-snug">
          "{isAr ? scenarios[selectedScenario].insightAr : scenarios[selectedScenario].insightEn}"
        </p>
      </div>
    </div>
  );
};
