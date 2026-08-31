import React from 'react';
import { Language } from '../types';
import { ShieldCheck, Lock, Activity, FileCheck } from 'lucide-react';

interface FooterProps {
  lang: Language;
}

export const Footer: React.FC<FooterProps> = ({ lang }) => {
  const isAr = lang === 'ar';

  return (
    <footer className="mt-4 flex flex-col sm:flex-row justify-between items-center bg-[#0f172a]/90 border border-[#1e293b] rounded-lg px-4 py-2.5 text-[10px] font-mono gap-2 shadow-md">
      {/* Left: Sensor & Encryption Status */}
      <div className="flex flex-wrap items-center gap-4">
        <span className="text-slate-400 flex items-center gap-1.5">
          <Activity className="w-3.5 h-3.5 text-emerald-400" />
          <span>{isAr ? 'المستشعرات:' : 'SENSORS:'}</span>
          <span className="text-emerald-400 uppercase font-bold">Connected (3/3)</span>
        </span>

        <span className="text-slate-400 flex items-center gap-1.5">
          <Lock className="w-3.5 h-3.5 text-cyan-400" />
          <span>{isAr ? 'التشفير:' : 'ENCRYPTION:'}</span>
          <span className="text-cyan-400 font-bold">AES-256-GCM ENABLED</span>
        </span>
      </div>

      {/* Right: Audit ID and Buffer Bar */}
      <div className="flex items-center gap-4 text-slate-400">
        <div className="flex items-center gap-1.5">
          <FileCheck className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-slate-500">{isAr ? 'معرف التدقيق:' : 'AUDIT ID:'}</span>
          <span className="text-slate-300 font-semibold">9022-X-INTELLIGENCE</span>
        </div>

        {/* Buffer Health Meter */}
        <div className="flex items-center gap-1.5">
          <span className="text-[9px] text-slate-500 hidden md:inline">BUFFER:</span>
          <div className="w-20 h-2 bg-slate-800 rounded-full overflow-hidden flex items-center p-0.5 border border-slate-700">
            <div className="w-3/4 h-full bg-cyan-500 rounded-full animate-pulse shadow-[0_0_6px_#06b6d4]"></div>
          </div>
        </div>
      </div>
    </footer>
  );
};
