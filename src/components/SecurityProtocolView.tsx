import React, { useState } from 'react';
import { AuditLog, Language } from '../types';
import { mockAuditLogs } from '../data/mockData';
import {
  Shield,
  Lock,
  Key,
  ShieldCheck,
  Server,
  FileCheck,
  AlertTriangle,
  Radio,
  Cpu,
  CheckCircle2,
  Terminal,
  Clock,
  Eye,
  Layers,
} from 'lucide-react';

interface SecurityProtocolViewProps {
  lang: Language;
}

export const SecurityProtocolView: React.FC<SecurityProtocolViewProps> = ({ lang }) => {
  const isAr = lang === 'ar';
  const [selectedAuditLog, setSelectedAuditLog] = useState<AuditLog>(mockAuditLogs[0]);

  return (
    <div className="flex-1 flex flex-col gap-4">
      {/* Top Banner */}
      <div className="bg-[#0f172a] border border-[#1e293b] rounded-lg p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-cyan-500/20 rounded border border-cyan-500/50 text-cyan-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-white font-mono font-bold text-base flex items-center gap-2">
              {isAr ? '٣. بروتوكول الأمان والتشفير (Security Protocol)' : '3. Zero-Trust Security & Cryptographic Protocol'}
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono">
                MIL-SPEC AES-256-GCM / TLS 1.3
              </span>
            </h2>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              {isAr
                ? 'الهيكلية الأمنية، مصفوفة التشفير، المصادقة الثنائية، أمان الوكيل، وسجل التدقيق غير القابل للتعديل'
                : 'Connection architecture, cryptographic layers, RBAC matrix, agent hardening & immutable audit trail'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3 py-1 bg-slate-900 border border-slate-800 rounded text-xs font-mono text-cyan-400 flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span>CERT_PINNING: ENFORCED</span>
          </div>
        </div>
      </div>

      {/* Grid of Security Modules */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Column (col-span-6): Connection Architecture & Encryption Matrix */}
        <div className="lg:col-span-6 space-y-4">
          {/* 3.1 Connection Architecture Card */}
          <div className="bg-[#0f172a] border border-[#1e293b] rounded-lg p-4 shadow-lg">
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-800">
              <h3 className="text-xs font-mono font-bold text-white uppercase flex items-center gap-1.5">
                <Server className="w-4 h-4 text-cyan-400" />
                {isAr ? '٣.١ هيكلية الاتصال (Connection Architecture)' : '3.1 Connection Architecture'}
              </h3>
              <span className="text-[10px] font-mono text-slate-400">TLS 1.3 MUTUAL AUTH</span>
            </div>

            {/* Visual ASCII / UI Topology Diagram */}
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 font-mono text-xs text-cyan-300 overflow-x-auto">
              <pre className="text-center text-[11px] leading-snug">
{`┌──────────────┐          TLS 1.3 + Cert Pinning          ┌──────────────┐
│  Agent       │ ◄──────────────────────────────────────► │  Gateway     │
│  (Device)    │          Binary WebSocket / MQTT         │  (API GW)    │
└──────────────┘                                          └──────┬───────┘
                                                                 │
                                                          ┌──────┴───────┐
                                                          │  Auth Layer  │
                                                          │  (JWT/OAuth) │
                                                          └──────┬───────┘
                                                                 │
                                                          ┌──────┴───────┐
                                                          │  Services    │
                                                          │  (Vault/AI)  │
                                                          └──────────────┘`}
              </pre>
            </div>
          </div>

          {/* 3.2 Encryption Matrix Card */}
          <div className="bg-[#0f172a] border border-[#1e293b] rounded-lg p-4 shadow-lg">
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-800">
              <h3 className="text-xs font-mono font-bold text-white uppercase flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-amber-400" />
                {isAr ? '٣.٢ مصفوفة التشفير (Encryption Matrix)' : '3.2 Cryptographic Suite'}
              </h3>
              <span className="text-[10px] font-mono text-emerald-400">FIPS 140-3 READY</span>
            </div>

            <div className="overflow-x-auto rounded border border-slate-800">
              <table className="w-full text-left rtl:text-right border-collapse text-xs font-mono">
                <thead>
                  <tr className="bg-slate-950 text-slate-400 border-b border-slate-800 uppercase text-[10px]">
                    <th className="p-2.5">{isAr ? 'الطبقة' : 'Layer'}</th>
                    <th className="p-2.5">{isAr ? 'التقنية والبروتوكول' : 'Cipher / Tech'}</th>
                    <th className="p-2.5">{isAr ? 'الوصف العملياتي' : 'Operational Scope'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 bg-slate-900/50 text-slate-300">
                  <tr>
                    <td className="p-2.5 font-bold text-white">{isAr ? 'نقل البيانات' : 'In Transit'}</td>
                    <td className="p-2.5 text-cyan-300">TLS 1.3 + Cert Pinning</td>
                    <td className="p-2.5 text-slate-400">{isAr ? 'تشفير شامل end-to-end بين الوكيل والبوابة' : 'End-to-end socket tunnel'}</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold text-white">{isAr ? 'البيانات في السكون' : 'At Rest'}</td>
                    <td className="p-2.5 text-emerald-400">AES-256-GCM</td>
                    <td className="p-2.5 text-slate-400">{isAr ? 'تشفير الملفات والسجلات في قاعدة البيانات' : 'Encrypted vault & database tables'}</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold text-white">{isAr ? 'أثناء المعالجة' : 'In Processing'}</td>
                    <td className="p-2.5 text-purple-400">AES-256 (Memory Enclave)</td>
                    <td className="p-2.5 text-slate-400">{isAr ? 'تشفير الذاكرة المؤقتة للمفاتيح الحساسة' : 'Ephemeral ring buffer in RAM'}</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold text-white">{isAr ? 'كلمات المرور' : 'Passwords'}</td>
                    <td className="p-2.5 text-amber-400">Argon2id (m=64MB, t=4)</td>
                    <td className="p-2.5 text-slate-400">{isAr ? 'تجزئة قوية لكلمات مرور المشغلين' : 'Salted memory-hard credentials hash'}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column (col-span-6): Auth & Authorization + Agent Hardening */}
        <div className="lg:col-span-6 space-y-4">
          {/* 3.3 Authentication & Authorization */}
          <div className="bg-[#0f172a] border border-[#1e293b] rounded-lg p-4 shadow-lg">
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-800">
              <h3 className="text-xs font-mono font-bold text-white uppercase flex items-center gap-1.5">
                <Key className="w-4 h-4 text-cyan-400" />
                {isAr ? '٣.٣ المصادقة والتفويض (Auth & RBAC)' : '3.3 Authentication & RBAC'}
              </h3>
              <span className="text-[10px] font-mono text-cyan-400">RS256 JWT (15 MIN)</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
              <div className="bg-slate-950 p-3 rounded border border-slate-800">
                <span className="text-[10px] text-cyan-400 font-bold uppercase block mb-1">
                  {isAr ? 'رموز JWT قصيرة الأجل' : 'JWT TOKENS (RS256)'}
                </span>
                <p className="text-slate-400 text-[11px]">
                  {isAr
                    ? 'رموز مميزة موقعة رقمياً بمفتاح خاص مع صلاحية قصيرة (١٥ دقيقة) تمنع إعادة الاستخدام.'
                    : 'Asymmetric signed tokens with 15-minute validity preventing replay attacks.'}
                </p>
              </div>

              <div className="bg-slate-950 p-3 rounded border border-slate-800">
                <span className="text-[10px] text-cyan-400 font-bold uppercase block mb-1">
                  {isAr ? 'كوكيز التجديد الآمنة' : 'REFRESH TOKENS'}
                </span>
                <p className="text-slate-400 text-[11px]">
                  {isAr
                    ? 'رموز تجديد مخزنة داخل كوكيز HttpOnly Secure لا يمكن قراءتها من JavaScript.'
                    : 'Stored in HttpOnly SameSite=Strict cookies inaccessible to client scripts.'}
                </p>
              </div>

              <div className="bg-slate-950 p-3 rounded border border-slate-800 sm:col-span-2">
                <span className="text-[10px] text-emerald-400 font-bold uppercase block mb-1">
                  {isAr ? 'التحكم بالوصول المبني على الدور (RBAC)' : 'ROLE-BASED ACCESS CONTROL (RBAC)'}
                </span>
                <div className="flex flex-wrap gap-2 text-[11px] mt-1.5">
                  <span className="px-2 py-0.5 bg-slate-900 border border-slate-700 rounded text-slate-300">
                    OPERATOR (Read Telemetry, GPS)
                  </span>
                  <span className="px-2 py-0.5 bg-slate-900 border border-slate-700 rounded text-slate-300">
                    ANALYST (AI Modeling, Reports)
                  </span>
                  <span className="px-2 py-0.5 bg-cyan-950 border border-cyan-500/40 rounded text-cyan-300 font-bold">
                    COMMANDER (Live Mic, Cam, Files)
                  </span>
                  <span className="px-2 py-0.5 bg-red-950 border border-red-500/40 rounded text-red-300 font-bold">
                    ADMIN (Key Management, Audit)
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 3.4 Agent Security & Hardening */}
          <div className="bg-[#0f172a] border border-[#1e293b] rounded-lg p-4 shadow-lg">
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-800">
              <h3 className="text-xs font-mono font-bold text-white uppercase flex items-center gap-1.5">
                <Cpu className="w-4 h-4 text-purple-400" />
                {isAr ? '٣.٤ أمان وتحصين الوكيل (Agent Security)' : '3.4 Endpoint Agent Hardening'}
              </h3>
              <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> ACTIVE_ARMOR
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2.5 text-xs font-mono">
              <div className="bg-slate-950 p-2.5 rounded border border-slate-800">
                <span className="text-[10px] text-emerald-400 font-bold block mb-1">
                  1. CODE SIGNING
                </span>
                <p className="text-slate-400 text-[10px]">
                  {isAr ? 'الوكيل موقع رقمياً ويتحقق من التوقيع عند الإقلاع' : 'Cryptographically signed binary'}
                </p>
              </div>

              <div className="bg-slate-950 p-2.5 rounded border border-slate-800">
                <span className="text-[10px] text-emerald-400 font-bold block mb-1">
                  2. ANTI-TAMPERING
                </span>
                <p className="text-slate-400 text-[10px]">
                  {isAr ? 'كشف أي تعديل على الملفات وإيقاف التشغيل فوراً' : 'Memory integrity check & self-destruct'}
                </p>
              </div>

              <div className="bg-slate-950 p-2.5 rounded border border-slate-800">
                <span className="text-[10px] text-emerald-400 font-bold block mb-1">
                  3. ROOT/JAILBREAK DETECTION
                </span>
                <p className="text-slate-400 text-[10px]">
                  {isAr ? 'كشف فك الحماية ورفع تنبيه أمني عالي الخطورة' : 'Hardware security enclave verification'}
                </p>
              </div>

              <div className="bg-slate-950 p-2.5 rounded border border-slate-800">
                <span className="text-[10px] text-emerald-400 font-bold block mb-1">
                  4. CODE OBFUSCATION
                </span>
                <p className="text-slate-400 text-[10px]">
                  {isAr ? 'تشويش الكود لمنع الهندسة العكسية والتحليل' : 'Control flow flattening & symbol strip'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3.5 & 3.6 Bottom Split: Immutable Audit Trail & Binary WebSocket Protocol */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* 3.5 Audit Trail (col-span-8) */}
        <div className="lg:col-span-8 bg-[#0f172a] border border-[#1e293b] rounded-lg p-4 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-800">
              <h3 className="text-xs font-mono font-bold text-white uppercase flex items-center gap-1.5">
                <FileCheck className="w-4 h-4 text-cyan-400" />
                {isAr ? '٣.٥ سجل التدقيق غير القابل للتعديل (Audit Trail)' : '3.5 Tamper-Evident Immutable Audit Trail'}
              </h3>
              <span className="text-[10px] font-mono text-cyan-400">NTP SYNCHRONIZED UTC</span>
            </div>

            <div className="overflow-x-auto rounded border border-slate-800 max-h-[220px]">
              <table className="w-full text-left rtl:text-right border-collapse text-xs font-mono">
                <thead>
                  <tr className="bg-slate-950 text-slate-400 border-b border-slate-800 uppercase text-[10px]">
                    <th className="p-2">{isAr ? 'المعرف' : 'Log ID'}</th>
                    <th className="p-2">{isAr ? 'المشغل' : 'Operator'}</th>
                    <th className="p-2">{isAr ? 'الإجراء' : 'Action'}</th>
                    <th className="p-2">{isAr ? 'الجهاز/الهدف' : 'Target / Dev'}</th>
                    <th className="p-2">{isAr ? 'الإذن القضائي' : 'Warrant Ref'}</th>
                    <th className="p-2">{isAr ? 'النتيجة' : 'Status'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 bg-slate-900/50 text-slate-300">
                  {mockAuditLogs.map((log) => (
                    <tr
                      key={log.id}
                      onClick={() => setSelectedAuditLog(log)}
                      className={`cursor-pointer hover:bg-slate-800/60 transition-colors ${
                        selectedAuditLog.id === log.id ? 'bg-cyan-950/40 text-cyan-200' : ''
                      }`}
                    >
                      <td className="p-2 font-bold text-cyan-400">{log.id}</td>
                      <td className="p-2 text-slate-300">{log.operatorId}</td>
                      <td className="p-2 font-bold">{log.action}</td>
                      <td className="p-2 text-slate-400">{log.targetDeviceId}</td>
                      <td className="p-2 text-[10px] text-amber-300">{log.legalWarrantRef}</td>
                      <td className="p-2">
                        <span className="bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 px-1.5 py-0.5 rounded text-[9px] font-bold">
                          {log.result}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-3 p-2 bg-slate-950 rounded border border-slate-800 flex items-center justify-between text-[11px] font-mono">
            <span className="text-slate-400">
              {isAr ? 'تفاصيل السجل المحدد:' : 'LOG DETAILS:'}{' '}
              <span className="text-cyan-300">
                {isAr ? selectedAuditLog.detailsAr || selectedAuditLog.action : selectedAuditLog.detailsEn || selectedAuditLog.action}
              </span>
            </span>
            <span className="text-slate-500 text-[10px]">{selectedAuditLog.timestamp}</span>
          </div>
        </div>

        {/* 3.6 Binary Communication Protocol Card (col-span-4) */}
        <div className="lg:col-span-4 bg-[#0f172a] border border-[#1e293b] rounded-lg p-4 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-800">
              <h3 className="text-xs font-mono font-bold text-white uppercase flex items-center gap-1.5">
                <Radio className="w-4 h-4 text-emerald-400" />
                {isAr ? '٣.٦ بروتوكول الاتصال الثنائي (WebSocket)' : '3.6 Binary Comms Protocol'}
              </h3>
              <span className="text-[10px] font-mono text-emerald-400">30S HEARTBEAT</span>
            </div>

            <div className="space-y-2 text-xs font-mono">
              <div className="bg-slate-950 p-2.5 rounded border border-slate-800">
                <span className="text-[10px] text-slate-500 block">BINARY PAYLOAD</span>
                <span className="text-cyan-300 font-bold">Protobuf Compressed Binary Frame</span>
              </div>
              <div className="bg-slate-950 p-2.5 rounded border border-slate-800">
                <span className="text-[10px] text-slate-500 block">RECONNECT STRATEGY</span>
                <span className="text-slate-200">Exponential Backoff (1s → 2s → 4s → 30s)</span>
              </div>
              <div className="bg-slate-950 p-2.5 rounded border border-slate-800">
                <span className="text-[10px] text-slate-500 block">MESSAGE RELIABILITY</span>
                <span className="text-emerald-400 font-bold">Mandatory ACK + Ring Buffer Replay</span>
              </div>
            </div>
          </div>

          <div className="mt-3 pt-2 border-t border-slate-800 text-[10px] font-mono text-slate-500 flex justify-between items-center">
            <span>SOCKET STATUS: ESTABLISHED</span>
            <span className="text-emerald-400 font-bold">0% PACKET LOSS</span>
          </div>
        </div>
      </div>
    </div>
  );
};
