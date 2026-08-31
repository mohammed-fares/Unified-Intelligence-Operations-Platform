import React, { useState } from 'react';
import { DeviceInfo, DeviceCommandRecord, TargetProfile, Language } from '../types';
import { mockCommandRecords } from '../data/mockData';
import {
  Terminal,
  Send,
  Play,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Smartphone,
  Camera,
  Mic,
  MapPin,
  FileText,
  Radio,
  Cpu,
  Key,
  AlertTriangle,
} from 'lucide-react';

interface CommandConsoleViewProps {
  activeTarget: TargetProfile;
  devices: DeviceInfo[];
  lang: Language;
}

export const CommandConsoleView: React.FC<CommandConsoleViewProps> = ({
  activeTarget,
  devices,
  lang,
}) => {
  const isAr = lang === 'ar';
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>(devices[0]?.id || 'dev-01');
  const [commandCode, setCommandCode] = useState<string>('SNAP_FRONT_CAM');
  const [customParams, setCustomParams] = useState<string>('--res=1080p --silent=true');
  const [commandsLog, setCommandsLog] = useState<DeviceCommandRecord[]>(mockCommandRecords);
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [terminalOutput, setTerminalOutput] = useState<string>(
    'COMMAND CONSOLE INITIALIZED: TLS 1.3 SIGNED CHANNEL READY.\nOPERATOR SIGNATURE: OP-SEC-4190 [VERIFIED]'
  );

  const presets = [
    { code: 'SNAP_FRONT_CAM', labelEn: 'Snapshot Front Camera', labelAr: 'التقاط صورة (كاميرا أمامية)', params: '--res=1080p --silent=true' },
    { code: 'SNAP_REAR_CAM', labelEn: 'Snapshot Rear Camera', labelAr: 'التقاط صورة (كاميرا خلفية)', params: '--res=4k --flash=off' },
    { code: 'START_MIC_RECORD', labelEn: 'Audio Stream (Mic)', labelAr: 'تسجيل ميكروفون مباشر', params: '--duration=180s --rate=48000' },
    { code: 'GET_LOCATIONS', labelEn: 'High Precision GPS Ping', labelAr: 'تحديث الموقع الجغرافي الدقيق', params: '--gps=high_accuracy --timeout=5s' },
    { code: 'DUMP_SMS_STORE', labelEn: 'Extract SMS & Chat DB', labelAr: 'استخراج الرسائل والمحادثات', params: '--limit=100 --cipher=AES-GCM' },
    { code: 'GET_KEYSTROKES', labelEn: 'Dump Keystroke Ring Buffer', labelAr: 'استخراج مخزن ضربات المفاتيح', params: '--hours=4 --filter=keywords' },
    { code: 'INSPECT_ENCLAVE', labelEn: 'Memory Enclave Health Check', labelAr: 'فحص سلامة الذاكرة المعزولة', params: '--detailed=true' },
  ];

  const handleExecute = (e: React.FormEvent) => {
    e.preventDefault();
    setIsExecuting(true);

    const activeDev = devices.find((d) => d.id === selectedDeviceId) || devices[0];
    const newCmdId = `CMD-${Math.floor(1000 + Math.random() * 9000)}`;

    setTerminalOutput((prev) => `${prev}\n> [${new Date().toLocaleTimeString()}] DISPATCHING ${commandCode} TO ${activeDev.name}...`);

    setTimeout(() => {
      const execTime = Math.floor(120 + Math.random() * 300);
      const newRecord: DeviceCommandRecord = {
        id: newCmdId,
        timestamp: new Date().toLocaleTimeString(),
        deviceId: activeDev.id,
        targetId: activeTarget.id,
        operatorId: 'OP-SEC-4190',
        command: commandCode,
        parameters: customParams,
        status: 'COMPLETED',
        executionTimeMs: execTime,
        output: `ACK_SUCCESS: Payload executed in ${execTime}ms on ${activeDev.name}. Enclave verified.`,
        signature: `RSA-PSS-SHA256: 0x${Math.random().toString(16).substring(2, 10)}...`,
      };

      setCommandsLog((prev) => [newRecord, ...prev]);
      setTerminalOutput(
        (prev) =>
          `${prev}\n< [${new Date().toLocaleTimeString()}] ${newCmdId} [SUCCESS in ${execTime}ms] -> ${newRecord.output}`
      );
      setIsExecuting(false);
    }, 1000);
  };

  return (
    <div className="flex-1 flex flex-col gap-4">
      {/* Banner */}
      <div className="bg-[#0f172a] border border-[#1e293b] rounded-lg p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-cyan-500/20 rounded border border-cyan-500/50 text-cyan-400">
            <Terminal className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-white font-mono font-bold text-base flex items-center gap-2">
              {isAr ? 'مركز الأوامر والتحكم (C2 Command Console)' : 'Command & Control (C2) Execution Console'}
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono">
                RSA-PSS SIGNED
              </span>
            </h2>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              {isAr
                ? 'إرسال أوامر تشغيلية موقعة رقمياً للأجهزة المستهدفة مع توثيق زمني غير قابل للإنكار'
                : 'Cryptographically signed binary instruction dispatcher & execution log for remote agents'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-cyan-400 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            OPERATOR: OP-SEC-4190 (WARRANT_ACTIVE)
          </span>
        </div>
      </div>

      {/* Main Grid: Command Form + Interactive Terminal */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1">
        {/* Left Column (col-span-5): Command Dispatcher Form & Presets */}
        <div className="lg:col-span-5 bg-[#0f172a] border border-[#1e293b] rounded-lg p-4 flex flex-col justify-between shadow-lg">
          <form onSubmit={handleExecute} className="space-y-4">
            <div className="pb-2 border-b border-slate-800 flex justify-between items-center">
              <span className="text-xs font-mono font-bold text-white uppercase flex items-center gap-1.5">
                <Send className="w-3.5 h-3.5 text-cyan-400" />
                {isAr ? 'إصدار أمر جديد' : 'DISPATCH NEW INSTRUCTION'}
              </span>
              <span className="text-[10px] font-mono text-slate-400">NON-REPUDIATION</span>
            </div>

            {/* Target Device */}
            <div>
              <label className="text-[10px] text-slate-500 uppercase font-mono block mb-1">
                {isAr ? 'الجهاز المستهدف' : 'TARGET ENDPOINT DEVICE'}
              </label>
              <select
                value={selectedDeviceId}
                onChange={(e) => setSelectedDeviceId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 text-cyan-300 text-xs font-mono rounded p-2 focus:outline-none focus:border-cyan-500/60"
              >
                {devices.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name} ({d.network}) - IP: {d.ip}
                  </option>
                ))}
              </select>
            </div>

            {/* Canned Presets */}
            <div>
              <label className="text-[10px] text-slate-500 uppercase font-mono block mb-1.5">
                {isAr ? 'قوالب الأوامر الشائعة' : 'OPERATIONAL PRESETS'}
              </label>
              <div className="grid grid-cols-2 gap-1.5 max-h-36 overflow-y-auto pr-1">
                {presets.map((p) => (
                  <button
                    key={p.code}
                    type="button"
                    onClick={() => {
                      setCommandCode(p.code);
                      setCustomParams(p.params);
                    }}
                    className={`p-2 rounded text-[10px] font-mono border text-left rtl:text-right transition-colors ${
                      commandCode === p.code
                        ? 'bg-cyan-950/80 border-cyan-500/60 text-cyan-200 font-bold'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <div className="truncate text-white">{isAr ? p.labelAr : p.labelEn}</div>
                    <div className="text-[9px] text-cyan-400 truncate">{p.code}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Command Code & Parameters */}
            <div className="space-y-2">
              <div>
                <label className="text-[10px] text-slate-500 uppercase font-mono block mb-1">
                  {isAr ? 'كود الأمر' : 'COMMAND IDENTIFIER'}
                </label>
                <input
                  type="text"
                  value={commandCode}
                  onChange={(e) => setCommandCode(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs font-mono text-cyan-300 focus:outline-none focus:border-cyan-500/60"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-500 uppercase font-mono block mb-1">
                  {isAr ? 'معاملات التنفيذ' : 'EXECUTION FLAGS & ARGS'}
                </label>
                <input
                  type="text"
                  value={customParams}
                  onChange={(e) => setCustomParams(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs font-mono text-slate-300 focus:outline-none focus:border-cyan-500/60"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isExecuting}
              className="w-full py-2.5 bg-cyan-600 hover:bg-cyan-500 text-black font-mono font-bold rounded text-xs transition-colors flex items-center justify-center gap-2 disabled:opacity-50 shadow-[0_0_15px_rgba(6,182,212,0.3)]"
            >
              <Send className={`w-3.5 h-3.5 ${isExecuting ? 'animate-bounce' : ''}`} />
              <span>{isExecuting ? (isAr ? 'جاري التنفيذ والتوقيع...' : 'SIGNING & DISPATCHING...') : (isAr ? 'إرسال وتنفيذ الأمر' : 'Sign & Execute Command')}</span>
            </button>
          </form>

          <div className="mt-3 pt-2 border-t border-slate-800 flex justify-between items-center text-[10px] font-mono text-slate-500">
            <span>CIPHER: RSA-4096-PSS</span>
            <span className="text-emerald-400">0 PENDING RETRIES</span>
          </div>
        </div>

        {/* Right Column (col-span-7): Live Terminal Feed & Execution History */}
        <div className="lg:col-span-7 space-y-4">
          {/* Live CLI Terminal Box */}
          <div className="bg-[#0f172a] border border-[#1e293b] rounded-lg p-4 shadow-lg">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
              <span className="text-xs font-mono font-bold text-cyan-400 uppercase flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5" />
                {isAr ? 'مخرج الطرفية المباشر' : 'LIVE C2 OUTPUT STREAM'}
              </span>
              <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                STREAM_ACTIVE
              </span>
            </div>
            <div className="bg-slate-950 p-3 rounded border border-slate-800 h-44 overflow-y-auto font-mono text-xs text-emerald-400 whitespace-pre-wrap leading-relaxed shadow-inner">
              {terminalOutput}
            </div>
          </div>

          {/* Execution History Table */}
          <div className="bg-[#0f172a] border border-[#1e293b] rounded-lg p-4 shadow-lg">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
              <span className="text-xs font-mono font-bold text-white uppercase flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                {isAr ? 'سجل الأوامر المنفذة' : 'EXECUTION AUDIT LOG'} ({commandsLog.length})
              </span>
              <span className="text-[10px] font-mono text-slate-400">NTP VERIFIED</span>
            </div>

            <div className="overflow-x-auto rounded border border-slate-800 max-h-48">
              <table className="w-full text-left rtl:text-right border-collapse text-xs font-mono">
                <thead>
                  <tr className="bg-slate-950 text-slate-400 border-b border-slate-800 uppercase text-[10px]">
                    <th className="p-2">{isAr ? 'المعرف' : 'ID'}</th>
                    <th className="p-2">{isAr ? 'الأمر' : 'Command'}</th>
                    <th className="p-2">{isAr ? 'الجهاز' : 'Device'}</th>
                    <th className="p-2">{isAr ? 'الزمن' : 'Latency'}</th>
                    <th className="p-2">{isAr ? 'الحالة' : 'Status'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 bg-slate-900/40 text-slate-300">
                  {commandsLog.map((cmd) => (
                    <tr key={cmd.id} className="hover:bg-slate-800/50">
                      <td className="p-2 text-cyan-400 font-bold">{cmd.id}</td>
                      <td className="p-2 text-white font-bold">{cmd.command}</td>
                      <td className="p-2 text-slate-400">{cmd.deviceId}</td>
                      <td className="p-2 text-cyan-300">{cmd.executionTimeMs}ms</td>
                      <td className="p-2">
                        <span className="bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 px-1.5 py-0.5 rounded text-[9px] font-bold">
                          {cmd.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
