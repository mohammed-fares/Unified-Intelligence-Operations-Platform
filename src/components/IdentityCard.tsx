import React from 'react';
import { TargetProfile, Language } from '../types';
import { ShieldCheck, UserCheck, Smartphone, Clock, Sparkles, ChevronRight, Fingerprint } from 'lucide-react';

interface IdentityCardProps {
  target: TargetProfile;
  lang: Language;
  onOpenFusion: () => void;
  onOpenDevices: () => void;
}

export const IdentityCard: React.FC<IdentityCardProps> = ({
  target,
  lang,
  onOpenFusion,
  onOpenDevices,
}) => {
  const isAr = lang === 'ar';

  return (
    <div className="bg-[#0f172a] border border-[#1e293b] rounded-lg p-4 flex flex-col gap-4 shadow-lg relative overflow-hidden group">
      {/* Background ambient gradient */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none"></div>

      {/* Top Header with Avatar Scanbox */}
      <div className="flex justify-between items-start">
        {/* Holographic Avatar Box */}
        <div className="w-20 h-24 bg-slate-900 rounded border border-slate-700 relative overflow-hidden flex items-center justify-center shadow-inner">
          {/* Cyber grid & gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/20 via-transparent to-transparent"></div>
          
          {/* Target Silhouette Graphic */}
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-8 h-8 rounded-full border border-cyan-400/40 bg-slate-800 flex items-center justify-center text-cyan-300">
              <UserCheck className="w-4 h-4" />
            </div>
            <div className="w-12 h-6 mt-1 bg-slate-800/80 rounded-t-lg border-t border-cyan-400/30"></div>
          </div>

          {/* Animated Scanline */}
          <div className="w-full h-[2px] bg-cyan-400 absolute top-1/2 shadow-[0_0_10px_#06b6d4] animate-pulse"></div>
          <div className="scanline"></div>

          <div className="absolute bottom-1 left-1 right-1 flex justify-between items-center text-[7px] font-mono text-cyan-400/80 px-0.5 bg-black/40 rounded">
            <span>BIO</span>
            <span>VERIFIED</span>
          </div>
        </div>

        {/* Target ID & Fusion Rating */}
        <div className="flex flex-col items-end gap-1.5">
          <div className="px-2 py-0.5 bg-cyan-500 text-black text-[9px] font-mono font-bold rounded shadow-[0_0_8px_rgba(6,182,212,0.4)]">
            TARGET ID: {target.id}
          </div>
          <div className="text-[10px] text-emerald-400 font-mono flex items-center gap-1 bg-emerald-950/40 px-1.5 py-0.5 rounded border border-emerald-500/30">
            <Sparkles className="w-3 h-3 text-emerald-400" />
            FUSION: {target.fusionScore}%
          </div>
          <span className="text-[9px] font-mono text-amber-400 bg-amber-950/30 px-1 rounded border border-amber-500/20">
            RISK: {target.riskLevel}
          </span>
        </div>
      </div>

      {/* Target Ground Truth Details */}
      <div className="space-y-2.5 text-xs">
        <div>
          <label className="text-[10px] text-slate-500 block uppercase font-mono tracking-wider">
            {isAr ? 'الهوية الموثقة' : 'Identity / Ground Truth'}
          </label>
          <div className="text-sm text-white font-semibold flex items-center justify-between">
            <span>{isAr ? target.fullNameAr : target.fullNameEn}</span>
            <span className="text-[10px] text-slate-400 font-normal">({target.codeName})</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="bg-slate-900/50 p-1.5 rounded border border-slate-800/80">
            <label className="text-[9px] text-slate-500 block font-mono">
              {isAr ? 'تاريخ الميلاد' : 'DOB'}
            </label>
            <div className="text-[11px] text-slate-200 font-mono font-medium">{target.dob}</div>
          </div>
          <div className="bg-slate-900/50 p-1.5 rounded border border-slate-800/80">
            <label className="text-[9px] text-slate-500 block font-mono">
              {isAr ? 'الجنسية' : 'NATIONALITY'}
            </label>
            <div className="text-[11px] text-slate-200 truncate" title={isAr ? target.nationalityAr : target.nationalityEn}>
              {isAr ? target.nationalityAr : target.nationalityEn}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="bg-slate-900/50 p-1.5 rounded border border-slate-800/80">
            <label className="text-[9px] text-slate-500 block font-mono">
              {isAr ? 'رقم الجواز' : 'PASSPORT NO'}
            </label>
            <div className="text-[11px] text-cyan-300 font-mono">{target.passportId}</div>
          </div>
          <div className="bg-slate-900/50 p-1.5 rounded border border-slate-800/80">
            <label className="text-[9px] text-slate-500 block font-mono">
              {isAr ? 'العنوان المسجل' : 'PERMANENT ADDR'}
            </label>
            <div className="text-[10px] text-slate-300 truncate" title={isAr ? target.permanentAddressAr : target.permanentAddressEn}>
              {isAr ? target.permanentAddressAr : target.permanentAddressEn}
            </div>
          </div>
        </div>
      </div>

      {/* Target Quick Stats */}
      <div className="pt-2 border-t border-slate-800 space-y-2">
        <button
          onClick={onOpenDevices}
          className="w-full flex justify-between items-center text-xs p-1.5 rounded bg-slate-900/40 hover:bg-slate-800/60 border border-slate-800/80 hover:border-cyan-500/40 transition-colors"
        >
          <span className="text-slate-400 flex items-center gap-1.5">
            <Smartphone className="w-3.5 h-3.5 text-cyan-400" />
            {isAr ? 'الأجهزة النشطة' : 'Active Devices'}
          </span>
          <div className="flex items-center gap-1">
            <span className="text-cyan-400 font-mono font-bold">0{target.devicesCount}</span>
            <ChevronRight className="w-3 h-3 text-slate-500" />
          </div>
        </button>

        <div className="flex justify-between items-center text-xs px-1.5">
          <span className="text-slate-400 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            {isAr ? 'آخر تزامن' : 'Last Sync'}
          </span>
          <span className="text-slate-200 font-mono">{target.lastSync}</span>
        </div>

        <button
          onClick={onOpenFusion}
          className="w-full mt-1 py-1.5 px-2.5 bg-cyan-950/40 hover:bg-cyan-900/50 text-cyan-300 text-[11px] font-mono rounded border border-cyan-500/40 flex items-center justify-center gap-1.5 transition-all shadow-[0_0_10px_rgba(6,182,212,0.15)]"
        >
          <Fingerprint className="w-3.5 h-3.5 text-cyan-400" />
          {isAr ? 'عرض لوحة الربط والمطابقة' : 'Open Fusion Matrix'}
        </button>
      </div>
    </div>
  );
};
