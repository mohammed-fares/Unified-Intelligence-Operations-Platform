import React from 'react';
import { DeviceInfo, Language } from '../types';
import { X, Smartphone, Laptop, Tablet, Battery, Wifi, Shield, Radio, Check, Key } from 'lucide-react';

interface DeviceFleetModalProps {
  devices: DeviceInfo[];
  lang: Language;
  onClose: () => void;
  activeDeviceId: string;
  onSelectDevice: (id: string) => void;
}

export const DeviceFleetModal: React.FC<DeviceFleetModalProps> = ({
  devices,
  lang,
  onClose,
  activeDeviceId,
  onSelectDevice,
}) => {
  const isAr = lang === 'ar';

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'laptop':
        return <Laptop className="w-5 h-5 text-cyan-400" />;
      case 'tablet':
        return <Tablet className="w-5 h-5 text-amber-400" />;
      default:
        return <Smartphone className="w-5 h-5 text-emerald-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#0f172a] border border-[#1e293b] rounded-xl max-w-3xl w-full max-h-[85vh] overflow-hidden flex flex-col shadow-[0_0_40px_rgba(6,182,212,0.2)]">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-[#050608]/80">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-cyan-500/20 rounded border border-cyan-500/50 text-cyan-400">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-white font-bold text-base font-mono">
                {isAr ? 'أسطول الأجهزة المرتبطة بالهدف' : 'Target-Centric Device Fleet'}
              </h2>
              <p className="text-xs text-slate-400 font-mono">
                {isAr ? 'مفهوم الجهاز كهوية فرعية (Device-as-Sub-Identity)' : 'Multi-Spoke Telemetry Hub'}
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

        {/* List of Registered Devices */}
        <div className="p-6 overflow-y-auto space-y-4">
          {devices.map((device) => {
            const isSelected = device.id === activeDeviceId;
            return (
              <div
                key={device.id}
                onClick={() => {
                  onSelectDevice(device.id);
                }}
                className={`p-4 rounded-lg border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-slate-900 border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                    : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded bg-slate-800 border border-slate-700">
                      {getDeviceIcon(device.type)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-white font-mono font-bold text-sm">
                          {device.name}
                        </span>
                        {isSelected && (
                          <span className="text-[9px] bg-cyan-500/20 text-cyan-300 px-1.5 py-0.5 rounded border border-cyan-500/40 font-mono">
                            ACTIVE STREAM
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono">
                        UUID: {device.uuid}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-xs font-mono">
                    <div className="flex items-center gap-1 text-slate-300">
                      <Battery className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{device.battery}%</span>
                    </div>
                    <div className="flex items-center gap-1 text-slate-300">
                      <Wifi className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{device.signalStrength}%</span>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] ${
                        device.status === 'online'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30'
                          : 'bg-amber-950 text-amber-300 border border-amber-500/30'
                      }`}
                    >
                      {device.status.toUpperCase()}
                    </span>
                  </div>
                </div>

                {/* Device Metadata & Permissions */}
                <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px] font-mono">
                  <div className="bg-slate-900/60 p-2 rounded border border-slate-800">
                    <span className="text-slate-500 block">NETWORK</span>
                    <span className="text-slate-300 truncate block">{device.network}</span>
                  </div>
                  <div className="bg-slate-900/60 p-2 rounded border border-slate-800">
                    <span className="text-slate-500 block">IP ADDRESS</span>
                    <span className="text-cyan-300">{device.ip}</span>
                  </div>
                  <div className="bg-slate-900/60 p-2 rounded border border-slate-800">
                    <span className="text-slate-500 block">LAST SEEN</span>
                    <span className="text-slate-300">{device.lastSeen}</span>
                  </div>
                  <div className="bg-slate-900/60 p-2 rounded border border-slate-800">
                    <span className="text-slate-500 block">CAMERAS</span>
                    <span className="text-emerald-400 uppercase">
                      {device.cameraAvailable.join(' + ')}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-800 bg-[#050608]/80 flex justify-between items-center text-xs font-mono">
          <span className="text-slate-500">AUTONOMOUS SPOKE DAEMON v2.4</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-black font-bold rounded transition-colors"
          >
            {isAr ? 'إغلاق' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
