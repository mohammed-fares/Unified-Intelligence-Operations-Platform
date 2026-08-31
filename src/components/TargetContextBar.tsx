import React from 'react';
import { TargetProfile, DeviceInfo, Language, TabType } from '../types';
import {
  ArrowLeft,
  ArrowRight,
  Users,
  Smartphone,
  ShieldAlert,
  Layers,
  ChevronDown,
  Activity,
  Compass,
  HardDrive,
  Terminal,
  Cpu,
  Radio,
  Eye,
} from 'lucide-react';

interface TargetContextBarProps {
  activeTarget: TargetProfile;
  targets: TargetProfile[];
  devices: DeviceInfo[];
  lang: Language;
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  onBackToDirectory: () => void;
  onSwitchTarget: (targetId: string) => void;
  onOpenFusion: () => void;
  onOpenDevices: () => void;
}

export const TargetContextBar: React.FC<TargetContextBarProps> = ({
  activeTarget,
  targets,
  devices,
  lang,
  activeTab,
  setActiveTab,
  onBackToDirectory,
  onSwitchTarget,
  onOpenFusion,
  onOpenDevices,
}) => {
  const isAr = lang === 'ar';
  const targetDevices = devices.filter((d) => d.targetId === activeTarget.id);
  const onlineCount = targetDevices.filter((d) => d.status === 'online').length;

  const targetSubTabs: { id: TabType; labelEn: string; labelAr: string; icon: React.ReactNode }[] = [
    { id: 'operations', labelEn: 'Operations Grid', labelAr: 'غرفة العمليات', icon: <Activity className="w-3.5 h-3.5" /> },
    { id: 'location', labelEn: 'GEOINT Radar', labelAr: 'التتبع الجغرافي', icon: <Compass className="w-3.5 h-3.5" /> },
    { id: 'files', labelEn: 'Encrypted Vault', labelAr: 'مستودع الملفات', icon: <HardDrive className="w-3.5 h-3.5" /> },
    { id: 'c2', labelEn: 'C2 Console', labelAr: 'أوامر C2', icon: <Terminal className="w-3.5 h-3.5" /> },
    { id: 'devices', labelEn: 'Device Fleet', labelAr: 'أسطول الأجهزة', icon: <Smartphone className="w-3.5 h-3.5" /> },
  ];

  const getRiskStyle = (level: string) => {
    switch (level) {
      case 'CRITICAL':
        return 'bg-red-500/20 text-red-400 border-red-500/50';
      case 'HIGH':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/50';
      case 'MEDIUM':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40';
      default:
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
    }
  };

  return (
    <div className="bg-[#0b101b] border border-cyan-900/50 rounded-xl p-3 shadow-xl mb-4 flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-3">
      {/* Back Button & Target Identity Badge */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Back to Directory Button */}
        <button
          onClick={onBackToDirectory}
          className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-cyan-300 hover:text-cyan-200 border border-cyan-500/40 hover:border-cyan-400 rounded-lg text-xs font-mono font-bold flex items-center gap-2 transition-all shadow-[0_0_10px_rgba(6,182,212,0.15)]"
        >
          {isAr ? <ArrowRight className="w-4 h-4 text-cyan-400" /> : <ArrowLeft className="w-4 h-4 text-cyan-400" />}
          <span>{isAr ? 'العودة لقائمة الأهداف' : 'Targets Directory'}</span>
        </button>

        <div className="h-6 w-[1px] bg-slate-800 hidden sm:block"></div>

        {/* Current Active Target Pill & Selector */}
        <div className="flex items-center gap-2.5 bg-slate-950/90 border border-slate-800 px-3 py-1.5 rounded-lg">
          <div className="w-7 h-7 rounded bg-cyan-500/20 border border-cyan-500/50 flex items-center justify-center text-cyan-400 font-mono font-bold text-xs">
            {activeTarget.codeName.slice(0, 2)}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white font-mono">
                {isAr ? activeTarget.fullNameAr : activeTarget.fullNameEn}
              </span>
              <span className="text-[10px] text-cyan-400 font-mono font-bold">
                [{activeTarget.codeName}]
              </span>
              <span className={`px-1.5 py-0.2 text-[8px] font-mono rounded border ${getRiskStyle(activeTarget.riskLevel)}`}>
                {activeTarget.riskLevel}
              </span>
            </div>
            <div className="text-[10px] text-slate-400 font-mono flex items-center gap-2">
              <span>{isAr ? activeTarget.occupationAr : activeTarget.occupationEn}</span>
              <span>•</span>
              <span className="text-emerald-400 flex items-center gap-1">
                <Smartphone className="w-3 h-3" />
                {onlineCount}/{targetDevices.length} {isAr ? 'أجهزة نشطة' : 'devices active'}
              </span>
            </div>
          </div>

          {/* Quick Target Switcher Dropdown */}
          <div className="relative ml-2 rtl:ml-0 rtl:mr-2">
            <select
              value={activeTarget.id}
              onChange={(e) => onSwitchTarget(e.target.value)}
              className="bg-slate-900 border border-slate-700 text-slate-200 text-[11px] font-mono rounded px-2 py-1 focus:border-cyan-500 focus:outline-none cursor-pointer"
            >
              {targets.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.codeName} - {isAr ? t.fullNameAr : t.fullNameEn}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Target Module Navigation Sub-Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-1">
        {targetSubTabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono border transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                isActive
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/70 shadow-[0_0_10px_rgba(6,182,212,0.25)] font-bold'
                  : 'bg-slate-900/70 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-200'
              }`}
            >
              <span className={isActive ? 'text-cyan-300' : 'text-slate-400'}>{tab.icon}</span>
              <span>{isAr ? tab.labelAr : tab.labelEn}</span>
            </button>
          );
        })}

        <div className="h-5 w-[1px] bg-slate-800 shrink-0 mx-0.5"></div>

        {/* Quick Identity Fusion Trigger */}
        <button
          onClick={onOpenFusion}
          className="px-2.5 py-1.5 rounded-lg text-xs font-mono border bg-slate-900/60 text-slate-300 border-slate-800 hover:border-cyan-500/40 hover:text-cyan-300 transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0"
        >
          <Layers className="w-3.5 h-3.5 text-cyan-400" />
          <span>{isAr ? 'مطابقة الهوية' : 'Fusion'}</span>
        </button>
      </div>
    </div>
  );
};
