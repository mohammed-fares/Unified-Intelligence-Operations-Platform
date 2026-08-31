import React from 'react';
import { TargetProfile, Language } from '../types';
import { X, Layers, CheckCircle2, AlertTriangle, Sparkles, Shield, Database, Smartphone, ArrowRightLeft } from 'lucide-react';

interface IdentityFusionModalProps {
  target: TargetProfile;
  lang: Language;
  onClose: () => void;
}

export const IdentityFusionModal: React.FC<IdentityFusionModalProps> = ({ target, lang, onClose }) => {
  const isAr = lang === 'ar';

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#0f172a] border border-cyan-500/40 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-[0_0_40px_rgba(6,182,212,0.2)]">
        {/* Modal Header */}
        <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-[#050608]/80">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-cyan-500/20 rounded border border-cyan-500/50 text-cyan-400">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-white font-bold text-base font-mono flex items-center gap-2">
                {isAr ? 'لوحة الربط والمطابقة الذكية' : 'Identity Fusion Dashboard'}
                <span className="text-xs px-2 py-0.5 bg-emerald-500/20 text-emerald-300 rounded border border-emerald-500/30">
                  95.8% MATCH
                </span>
              </h2>
              <p className="text-xs text-slate-400 font-mono">
                TARGET_ID: {target.id} | CODE: {target.codeName}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: Comparison Matrix */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Fusion AI Score Banner */}
          <div className="p-3 bg-cyan-950/40 border border-cyan-500/30 rounded-lg flex flex-col sm:flex-row justify-between items-center gap-3">
            <div className="flex items-center gap-2 text-cyan-300 text-xs font-mono">
              <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>
                {isAr
                  ? '🔗 مطابقة الذكاء الاصطناعي: ٩٥.٨٪ توافق بين الكيانات المستخرجة وسجلات الهوية الرسمية'
                  : '🔗 AI Correlation: 95.8% confidence match between extracted telemetry & ground truth'}
              </span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs text-emerald-400 font-bold bg-emerald-950/80 px-2.5 py-1 rounded border border-emerald-500/40 font-mono">
                BIO_CORRELATED
              </span>
            </div>
          </div>

          {/* Side by Side Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Left: Ground Truth Profile */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-4 flex flex-col gap-3 shadow-inner">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div className="flex items-center gap-2 text-slate-200 font-semibold font-mono text-sm">
                  <Database className="w-4 h-4 text-blue-400" />
                  <span>{isAr ? 'الهوية الحقيقية (Ground Truth)' : 'Verified Identity (Ground Truth)'}</span>
                </div>
                <span className="text-[10px] text-blue-400 bg-blue-950/60 px-1.5 py-0.5 rounded border border-blue-500/30 font-mono">
                  MANUAL / OFFICIAL
                </span>
              </div>

              <div className="space-y-2.5 text-xs text-slate-300">
                <div className="bg-slate-950/60 p-2 rounded border border-slate-800/80">
                  <span className="text-slate-500 block text-[10px] font-mono">
                    {isAr ? 'الاسم الكامل' : 'FULL NAME'}
                  </span>
                  <div className="font-semibold text-white">
                    {target.fullNameEn} / {target.fullNameAr}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-slate-950/60 p-2 rounded border border-slate-800/80">
                    <span className="text-slate-500 block text-[10px] font-mono">
                      {isAr ? 'تاريخ الميلاد' : 'DOB'}
                    </span>
                    <div className="text-slate-200 font-mono">{target.dob}</div>
                  </div>
                  <div className="bg-slate-950/60 p-2 rounded border border-slate-800/80">
                    <span className="text-slate-500 block text-[10px] font-mono">
                      {isAr ? 'الجنسية' : 'NATIONALITY'}
                    </span>
                    <div className="text-slate-200">{target.nationalityEn}</div>
                  </div>
                </div>

                <div className="bg-slate-950/60 p-2 rounded border border-slate-800/80">
                  <span className="text-slate-500 block text-[10px] font-mono">
                    {isAr ? 'شبكة العائلة (الأقارب)' : 'FAMILY NETWORK'}
                  </span>
                  <ul className="space-y-1 mt-1 text-[11px]">
                    {target.familyNetwork.map((f, i) => (
                      <li key={i} className="flex justify-between text-slate-300 font-arabic">
                        <span>
                          • {f.name} ({isAr ? f.relationAr : f.relationEn})
                        </span>
                        <span className="text-slate-500 font-mono text-[10px]">{f.phone}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Right: Device-Extracted Intelligence */}
            <div className="bg-slate-900/80 border border-cyan-500/30 rounded-lg p-4 flex flex-col gap-3 shadow-inner">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div className="flex items-center gap-2 text-cyan-300 font-semibold font-mono text-sm">
                  <Smartphone className="w-4 h-4 text-cyan-400" />
                  <span>
                    {isAr ? 'البيانات المستخرجة (AI Extraction)' : 'Extracted Intelligence (AI Multi-Device)'}
                  </span>
                </div>
                <span className="text-[10px] text-cyan-400 bg-cyan-950/60 px-1.5 py-0.5 rounded border border-cyan-500/30 font-mono">
                  AUTOMATED SYNC
                </span>
              </div>

              <div className="space-y-2.5 text-xs text-slate-300">
                <div className="bg-slate-950/60 p-2 rounded border border-slate-800/80 flex justify-between items-center">
                  <div>
                    <span className="text-slate-500 block text-[10px] font-mono">
                      {isAr ? 'الاسم في جهات الاتصال' : 'DEVICE CONTACT TAG'}
                    </span>
                    <div className="font-semibold text-cyan-200">"Ahmed Kh." / "أحمد خ."</div>
                  </div>
                  <span className="text-[9px] text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-500/30 font-mono">
                    ✓ MATCH
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-slate-950/60 p-2 rounded border border-slate-800/80">
                    <span className="text-slate-500 block text-[10px] font-mono">
                      {isAr ? 'التقويم / عيد الميلاد' : 'CALENDAR EVENT'}
                    </span>
                    <div className="text-cyan-200 font-mono">"Birthday" (15 March)</div>
                  </div>
                  <div className="bg-slate-950/60 p-2 rounded border border-slate-800/80">
                    <span className="text-slate-500 block text-[10px] font-mono">
                      {isAr ? 'مستندات المعرض' : 'GALLERY OCR'}
                    </span>
                    <div className="text-cyan-200 font-mono">Passport scan [99% match]</div>
                  </div>
                </div>

                <div className="bg-slate-950/60 p-2 rounded border border-slate-800/80">
                  <span className="text-slate-500 block text-[10px] font-mono">
                    {isAr ? 'مطابقة الاتصالات المتكررة' : 'FREQUENT COMMS EXTRACTED'}
                  </span>
                  <ul className="space-y-1 mt-1 text-[11px] text-cyan-300 font-arabic">
                    <li>• جهة اتصال "خالد" - ٤٢ مكالمة مسجلة (مطابقة الوالد)</li>
                    <li>• جهة اتصال "سارة" - تبادل رسائل يومي (مطابقة الوالدة)</li>
                    <li>• حساب تيليجرام "@akhalid_secure" مربوط بالجهاز الأساسي</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Anomaly & Risk Warning Card */}
          <div className="p-3 bg-amber-950/30 border border-amber-500/40 rounded-lg flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
            <p className="text-xs text-amber-200 font-mono">
              {isAr
                ? '⚠️ تنبيه تدقيق: تم رصد استخدام اسم مستعار ثانوي "AK-Logistics" في محادثة مشفرة بتاريخ أمس.'
                : '⚠️ Audit Notice: Secondary alias "AK-Logistics" identified in encrypted comms endpoint.'}
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-3 border-t border-slate-800 bg-[#050608]/80 flex justify-between items-center text-xs font-mono">
          <span className="text-slate-500">CORRELATION_ALGO: FUSION_NEURAL_V4</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-black font-bold rounded transition-colors"
          >
            {isAr ? 'إغلاق النافذة' : 'Close Dashboard'}
          </button>
        </div>
      </div>
    </div>
  );
};
