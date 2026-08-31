import React from 'react';
import { Language, TabType } from '../types';
import {
  Shield,
  Radio,
  Volume2,
  VolumeX,
  Eye,
  Layers,
  Smartphone,
  FileText,
  Activity,
  Workflow,
  Database,
  ShieldCheck,
  Compass,
  HardDrive,
  Terminal,
  Users,
} from 'lucide-react';

interface HeaderProps {
  lang: Language;
  setLang: (lang: Language) => void;
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  onOpenFusion: () => void;
  onOpenDevices: () => void;
  onOpenXiaomiPairing?: () => void;
  activeTargetCodeName?: string;
}

export const Header: React.FC<HeaderProps> = ({
  lang,
  setLang,
  activeTab,
  setActiveTab,
  soundEnabled,
  setSoundEnabled,
  onOpenFusion,
  onOpenDevices,
  onOpenXiaomiPairing,
  activeTargetCodeName = 'VIPER-09',
}) => {
  const isAr = lang === 'ar';

  const navItems: { id: TabType; labelEn: string; labelAr: string; icon: React.ReactNode }[] = [
    { id: 'targets', labelEn: 'Targets Directory', labelAr: 'قائمة الأهداف والأشخاص', icon: <Users className="w-3.5 h-3.5" /> },
    { id: 'operations', labelEn: 'Command Grid', labelAr: 'غرفة العمليات', icon: <Activity className="w-3.5 h-3.5" /> },
    { id: 'dfd', labelEn: 'Data Flow (DFD)', labelAr: 'تدفق البيانات (DFD)', icon: <Workflow className="w-3.5 h-3.5" /> },
    { id: 'schema', labelEn: 'DB Schema (14 Tables)', labelAr: 'قاعدة البيانات (١٤ جدول)', icon: <Database className="w-3.5 h-3.5" /> },
    { id: 'security', labelEn: 'Security & TLS 1.3', labelAr: 'بروتوكول الأمان والتشفير', icon: <ShieldCheck className="w-3.5 h-3.5" /> },
    { id: 'location', labelEn: 'GEOINT Radar', labelAr: 'التتبع الجغرافي', icon: <Compass className="w-3.5 h-3.5" /> },
    { id: 'files', labelEn: 'Encrypted Vault', labelAr: 'مستودع الملفات', icon: <HardDrive className="w-3.5 h-3.5" /> },
    { id: 'c2', labelEn: 'C2 Console', labelAr: 'أوامر التحكم C2', icon: <Terminal className="w-3.5 h-3.5" /> },
    { id: 'devices', labelEn: 'Fleet Hub', labelAr: 'أسطول الأجهزة', icon: <Smartphone className="w-3.5 h-3.5" /> },
  ];

  return (
    <header className="flex flex-col xl:flex-row justify-between items-stretch xl:items-center border-b border-[#1e293b] pb-3 mb-4 gap-3 bg-[#050608]/95 backdrop-blur-md sticky top-0 z-40">
      {/* Brand & Logo */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-cyan-500/20 rounded border border-cyan-500/50 flex items-center justify-center relative shadow-[0_0_15px_rgba(6,182,212,0.3)]">
            <div className="w-3.5 h-3.5 rounded-full bg-cyan-400 animate-pulse"></div>
            <div className="absolute inset-0 rounded border border-cyan-400/30 animate-ping"></div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-white font-bold text-base tracking-wider font-mono">
                UIOP <span className="text-cyan-400">V2.4</span>
              </h1>
              <span className="px-1.5 py-0.2 text-[8px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded font-mono">
                SECURE
              </span>
            </div>
            <p className="text-[9px] uppercase tracking-[0.15em] text-slate-400 font-mono">
              {isAr ? 'المنصة الاستخباراتية المتكاملة' : 'Unified Intelligence Operations Platform'}
            </p>
          </div>
        </div>

        {/* Mobile-only Audio & Lang buttons */}
        <div className="flex xl:hidden items-center gap-2">
          <button
            onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
            className="px-2 py-1 bg-slate-900 border border-slate-800 rounded text-xs font-mono text-cyan-300"
          >
            {lang === 'en' ? 'العربية' : 'EN'}
          </button>
        </div>
      </div>

      {/* Navigation Quick Actions Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`px-2.5 py-1.5 rounded text-[11px] font-mono border transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                isActive
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/70 shadow-[0_0_10px_rgba(6,182,212,0.25)] font-bold'
                  : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-200'
              }`}
            >
              <span className={isActive ? 'text-cyan-300' : 'text-slate-400'}>{item.icon}</span>
              <span>{isAr ? item.labelAr : item.labelEn}</span>
            </button>
          );
        })}

        <div className="h-5 w-[1px] bg-slate-800 shrink-0 mx-0.5"></div>

        {onOpenXiaomiPairing && (
          <button
            onClick={onOpenXiaomiPairing}
            className="px-2.5 py-1.5 rounded text-[11px] font-mono border bg-cyan-950/60 text-cyan-300 border-cyan-500/50 hover:bg-cyan-500/20 hover:border-cyan-400 transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 shadow-[0_0_10px_rgba(6,182,212,0.2)]"
          >
            <Smartphone className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span className="font-bold">{isAr ? 'ربط هاتف شاومي A3' : 'Pair Xiaomi A3'}</span>
          </button>
        )}

        <button
          onClick={onOpenFusion}
          className="px-2.5 py-1.5 rounded text-[11px] font-mono border bg-slate-900/60 text-slate-300 border-slate-800 hover:border-cyan-500/40 hover:text-cyan-300 transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0"
        >
          <Layers className="w-3.5 h-3.5 text-cyan-400" />
          <span>{isAr ? 'مطابقة الهوية' : 'Fusion Modal'}</span>
        </button>
      </div>

      {/* Operational Context & Language */}
      <div className="hidden xl:flex items-center justify-end gap-3">
        <div className={`${isAr ? 'text-left' : 'text-right'}`}>
          <div className="text-[9px] text-slate-500 uppercase tracking-wider font-mono">
            {isAr ? 'السياق العملياتي' : 'OPERATIONAL CONTEXT'}
          </div>
          <div className="text-[11px] font-mono text-cyan-400 font-bold flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping"></span>
            ACTIVE_SURVEILLANCE_{activeTargetCodeName}
          </div>
        </div>

        <div className="h-7 w-[1px] bg-slate-800"></div>

        {/* Audio Alert Toggle */}
        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          title={soundEnabled ? 'Mute Alert Audio' : 'Unmute Alert Audio'}
          className={`p-1.5 rounded border transition-colors ${
            soundEnabled
              ? 'bg-cyan-950/40 border-cyan-500/40 text-cyan-400'
              : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-400'
          }`}
        >
          {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>

        {/* Language Switcher */}
        <div className="flex gap-1 bg-slate-900/80 p-0.5 rounded border border-slate-800">
          <button
            onClick={() => setLang('en')}
            className={`px-2 py-1 rounded text-[10px] font-mono transition-colors ${
              lang === 'en'
                ? 'bg-cyan-600/30 text-cyan-300 border border-cyan-500/50'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            EN
          </button>
          <button
            onClick={() => setLang('ar')}
            className={`px-2 py-1 rounded text-[10px] font-arabic font-bold transition-colors ${
              lang === 'ar'
                ? 'bg-cyan-600/30 text-cyan-300 border border-cyan-500/50'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            العربية
          </button>
        </div>
      </div>
    </header>
  );
};
