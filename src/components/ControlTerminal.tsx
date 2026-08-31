import React, { useState, useRef, useEffect } from 'react';
import { DeviceInfo, Language } from '../types';
import { Terminal, Play, Trash2, Globe, Shield, RefreshCw, Send } from 'lucide-react';

interface ControlTerminalProps {
  device: DeviceInfo;
  lang: Language;
  onExecuteCommand?: (cmd: string) => void;
}

export const ControlTerminal: React.FC<ControlTerminalProps> = ({ device, lang, onExecuteCommand }) => {
  const isAr = lang === 'ar';
  const [logs, setLogs] = useState<string[]>([
    '> session establish ' + device.name.toLowerCase(),
    '> auth_key verified [AES-256-GCM]',
    '> pulling telemetry sync stream...',
    '> telemetry_link: ESTABLISHED (latency 18ms)',
    '> audit_token: #FED-CRT-2026/8941 verified',
  ]);
  const [inputVal, setInputVal] = useState<string>('');
  const terminalEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const handleCommand = (cmdStr?: string) => {
    const cmd = (cmdStr || inputVal).trim();
    if (!cmd) return;

    const newLogs = [...logs, `> ${cmd}`];

    // Command handling logic
    const lower = cmd.toLowerCase();
    if (lower === 'help') {
      newLogs.push('  AVAILABLE COMMANDS:');
      newLogs.push('  • status      - Check connected node heartbeat & battery');
      newLogs.push('  • diag        - Run full system integrity diagnostics');
      newLogs.push('  • ping        - Test packet latency to active spoke agent');
      newLogs.push('  • geofence    - Query active perimeter violation status');
      newLogs.push('  • wipe_cache  - Clear transient local telemetry caches');
      newLogs.push('  • open_url    - Push diagnostic URL intent to node');
      newLogs.push('  • clear       - Clear terminal window');
    } else if (lower === 'clear') {
      setLogs(['> terminal cleared.', '> enter "help" for options.']);
      setInputVal('');
      return;
    } else if (lower === 'status') {
      newLogs.push(`  NODE: ${device.name} [${device.uuid.slice(0, 10)}...]`);
      newLogs.push(`  STATE: ONLINE | BATTERY: ${device.battery}% | NET: ${device.network}`);
      newLogs.push(`  IP: ${device.ip} | PERMISSIONS: VALIDATED`);
    } else if (lower === 'diag') {
      newLogs.push('  RUNNING INTEGRITY DIAGNOSTIC...');
      newLogs.push('  ✓ CRYPTO_SUITE: AES-256-GCM OK');
      newLogs.push('  ✓ SENSOR_GRID: GPS / MIC / CAM READY');
      newLogs.push('  ✓ BUFFER_HEALTH: 99.8% NOMINAL');
    } else if (lower === 'ping') {
      newLogs.push(`  PING ${device.ip}: 32 bytes time=14.2ms TTL=58`);
      newLogs.push(`  PING ${device.ip}: 32 bytes time=12.9ms TTL=58`);
      newLogs.push('  PACKETS: 2 transmitted, 2 received, 0% packet loss');
    } else if (lower.startsWith('wipe_cache')) {
      newLogs.push('  [OK] Local application telemetry cache purged.');
    } else if (lower.startsWith('open_url')) {
      newLogs.push('  [OK] Intent dispatched to node browser session.');
    } else {
      newLogs.push(`  [OK] Command "${cmd}" queued and executed on ${device.name}.`);
    }

    setLogs(newLogs);
    setInputVal('');
    if (onExecuteCommand) onExecuteCommand(cmd);
  };

  return (
    <div className="bg-[#0f172a] border border-[#1e293b] rounded-lg p-3.5 flex flex-col gap-2.5 shadow-lg">
      <div className="flex justify-between items-center pb-1 border-b border-slate-800">
        <h3 className="text-[10px] text-slate-400 font-bold uppercase tracking-widest font-mono flex items-center gap-1.5">
          <Terminal className="w-3.5 h-3.5 text-cyan-400" />
          {isAr ? 'وحدة التحكم والأوامر' : 'Control Terminal'}
        </h3>
        <span className="text-[8px] font-mono text-emerald-400 bg-emerald-950/50 px-1.5 py-0.5 rounded border border-emerald-500/30">
          NODE: {device.name.replace('DEVICE_', '')}
        </span>
      </div>

      {/* Terminal Viewport */}
      <div className="bg-black rounded p-2.5 h-36 font-mono text-[10px] text-emerald-400 overflow-y-auto flex flex-col border border-slate-800/80 shadow-inner">
        {logs.map((log, i) => (
          <div
            key={i}
            className={
              log.startsWith('>')
                ? 'text-cyan-300 font-semibold'
                : log.includes('[OK]') || log.includes('✓')
                ? 'text-emerald-400'
                : 'text-slate-300'
            }
          >
            {log}
          </div>
        ))}
        <div ref={terminalEndRef} />

        {/* Input line */}
        <div className="mt-auto pt-2 flex items-center gap-1.5 border-t border-slate-900">
          <span className="text-cyan-400 font-bold">&gt;</span>
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCommand()}
            placeholder={isAr ? 'أدخل أمر التشغيل... (جرب help)' : 'CMD... (try "help", "diag", "status")'}
            className="bg-transparent border-none outline-none flex-1 text-emerald-400 font-mono text-[10px] placeholder:text-slate-700"
          />
          <button
            onClick={() => handleCommand()}
            className="p-1 text-cyan-400 hover:text-white transition-colors"
            title="Execute Command"
          >
            <Send className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Quick Action Buttons */}
      <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
        <button
          onClick={() => handleCommand('wipe_cache')}
          className="bg-slate-800/80 hover:bg-slate-700 border border-slate-700 py-1.5 px-2 rounded text-slate-300 transition-colors flex items-center justify-center gap-1"
        >
          <Trash2 className="w-3 h-3 text-red-400" />
          WIPE_CACHE
        </button>
        <button
          onClick={() => handleCommand('diag')}
          className="bg-slate-800/80 hover:bg-cyan-950/60 border border-slate-700 hover:border-cyan-500/40 py-1.5 px-2 rounded text-cyan-300 transition-colors flex items-center justify-center gap-1"
        >
          <RefreshCw className="w-3 h-3 text-cyan-400" />
          DIAG_NODE
        </button>
      </div>
    </div>
  );
};
