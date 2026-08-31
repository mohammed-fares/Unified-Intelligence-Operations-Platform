import React, { useState } from 'react';
import { TargetProfile, Language } from '../types';
import { Users, Search, ShieldAlert, Smartphone, CheckCircle, Clock, ChevronRight, Layers, UserCheck } from 'lucide-react';

interface TargetSidebarProps {
  targets: TargetProfile[];
  activeTargetId: string;
  onSelectTarget: (id: string) => void;
  lang: Language;
  onOpenFusion: () => void;
}

export const TargetSidebar: React.FC<TargetSidebarProps> = ({
  targets,
  activeTargetId,
  onSelectTarget,
  lang,
  onOpenFusion,
}) => {
  const isAr = lang === 'ar';
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTargets = targets.filter(
    (t) =>
      t.fullNameEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.fullNameAr.includes(searchTerm) ||
      t.codeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.id.includes(searchTerm)
  );

  const getRiskBadge = (level: string) => {
    switch (level) {
      case 'CRITICAL':
        return 'bg-red-950/80 text-red-400 border-red-500/50';
      case 'HIGH':
        return 'bg-amber-950/80 text-amber-400 border-amber-500/50';
      case 'MEDIUM':
        return 'bg-yellow-950/80 text-yellow-300 border-yellow-500/40';
      default:
        return 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40';
    }
  };

  return (
    <div className="bg-[#0f172a] border border-[#1e293b] rounded-lg p-3 flex flex-col h-full shadow-lg">
      {/* Sidebar Header */}
      <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-cyan-500/20 rounded border border-cyan-500/40 text-cyan-400">
            <Users className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
              {isAr ? 'سجل الأهداف النشطة' : 'Active Targets'}
            </h2>
            <span className="text-[9px] font-mono text-slate-400">
              {targets.length} {isAr ? 'أهداف مراقبة' : 'SUBJECTS TRACKED'}
            </span>
          </div>
        </div>

        <button
          onClick={onOpenFusion}
          title={isAr ? 'مطابقة الهوية' : 'Identity Fusion'}
          className="p-1 rounded bg-slate-800/80 hover:bg-cyan-950 border border-slate-700 hover:border-cyan-500/50 text-cyan-400 text-[10px] flex items-center gap-1 transition-colors"
        >
          <Layers className="w-3 h-3" />
          <span className="font-mono hidden xl:inline">{isAr ? 'مطابقة' : 'Fusion'}</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative mb-3">
        <Search className="w-3.5 h-3.5 absolute left-2.5 rtl:left-auto rtl:right-2.5 top-2.5 text-slate-500" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={isAr ? 'بحث بالاسم، الكود، المعرف...' : 'Filter target / code...'}
          className="w-full bg-slate-950/80 border border-slate-800 rounded px-8 rtl:px-8 py-1.5 text-xs text-slate-200 placeholder-slate-500 font-mono focus:outline-none focus:border-cyan-500/60"
        />
      </div>

      {/* Targets List */}
      <div className="space-y-2 overflow-y-auto max-h-[calc(100vh-280px)] pr-1">
        {filteredTargets.map((target) => {
          const isSelected = target.id === activeTargetId;
          return (
            <div
              key={target.id}
              onClick={() => onSelectTarget(target.id)}
              className={`p-2.5 rounded-lg border transition-all cursor-pointer relative group ${
                isSelected
                  ? 'bg-slate-900 border-cyan-500/80 shadow-[0_0_12px_rgba(6,182,212,0.25)]'
                  : 'bg-slate-950/50 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/40'
              }`}
            >
              {/* Active Indicator Strip */}
              {isSelected && (
                <div className="absolute top-0 bottom-0 left-0 rtl:left-auto rtl:right-0 w-1 bg-cyan-400 rounded-l rtl:rounded-l-none rtl:rounded-r"></div>
              )}

              <div className="flex items-start justify-between gap-1.5">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded bg-slate-800 border border-slate-700 flex items-center justify-center text-[10px] font-mono text-cyan-300 font-bold">
                    {target.codeName.slice(0, 2)}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white font-mono flex items-center gap-1.5">
                      <span>{target.codeName}</span>
                      <span className="text-[9px] text-slate-400 font-normal">#{target.id}</span>
                    </div>
                    <div className="text-[11px] text-slate-300">
                      {isAr ? target.fullNameAr : target.fullNameEn}
                    </div>
                  </div>
                </div>

                <span
                  className={`text-[9px] px-1.5 py-0.5 rounded border font-mono font-bold ${getRiskBadge(
                    target.riskLevel
                  )}`}
                >
                  {target.riskLevel}
                </span>
              </div>

              {/* Target Metadata row */}
              <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-400">
                <div className="flex items-center gap-1">
                  <Smartphone className="w-3 h-3 text-cyan-400" />
                  <span>
                    {target.devicesCount} {isAr ? 'أجهزة' : 'devices'}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>{target.fusionScore}% {isAr ? 'مطابقة' : 'Match'}</span>
                </div>
                <div className="text-slate-500 text-[9px] truncate">{target.lastSync}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
