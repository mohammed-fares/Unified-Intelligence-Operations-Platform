import React, { useState } from 'react';
import { DeviceInfo, TargetProfile, Language } from '../types';
import {
  Smartphone,
  Laptop,
  Tablet,
  Battery,
  Wifi,
  Radio,
  Camera,
  Mic,
  MapPin,
  HardDrive,
  Key,
  ShieldCheck,
  Power,
  RotateCw,
  Sliders,
  Check,
} from 'lucide-react';

interface DeviceFleetViewProps {
  activeTarget: TargetProfile;
  devices: DeviceInfo[];
  lang: Language;
}

export const DeviceFleetView: React.FC<DeviceFleetViewProps> = ({
  activeTarget,
  devices,
  lang,
}) => {
  const isAr = lang === 'ar';
  const [deviceList, setDeviceList] = useState<DeviceInfo[]>(devices);
  const [activeCameraDevice, setActiveCameraDevice] = useState<string>(devices[0]?.id || 'dev-01');

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

  const togglePermission = (devId: string, permKey: keyof DeviceInfo['permissions']) => {
    setDeviceList((prev) =>
      prev.map((d) => {
        if (d.id === devId) {
          return {
            ...d,
            permissions: {
              ...d.permissions,
              [permKey]: !d.permissions[permKey],
            },
          };
        }
        return d;
      })
    );
  };

  return (
    <div className="flex-1 flex flex-col gap-4">
      {/* Top Banner */}
      <div className="bg-[#0f172a] border border-[#1e293b] rounded-lg p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-cyan-500/20 rounded border border-cyan-500/50 text-cyan-400">
            <Smartphone className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-white font-mono font-bold text-base flex items-center gap-2">
              {isAr ? 'أسطول الأجهزة والوكلاء المربوطين (Devices Fleet)' : 'Target Endpoint Fleet & Sub-Identity Hub'}
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono">
                {deviceList.filter((d) => d.status === 'online').length}/{deviceList.length} ONLINE
              </span>
            </h2>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              {isAr
                ? 'إدارة الأجهزة ككيانات وهوية فرعية، تفعيل الكاميرات والميكروفونات وصلاحيات استخراج البيانات'
                : 'Manage device endpoints as sub-identities, sensor relays, and granular permission controls'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-cyan-300 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded">
            TARGET: {activeTarget.codeName} (#{activeTarget.id})
          </span>
        </div>
      </div>

      {/* Grid of Device Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {deviceList.map((dev) => (
          <div
            key={dev.id}
            className="bg-[#0f172a] border border-[#1e293b] rounded-lg p-4 flex flex-col justify-between shadow-lg hover:border-cyan-500/50 transition-all"
          >
            <div>
              {/* Header */}
              <div className="flex justify-between items-start pb-3 border-b border-slate-800 mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded bg-slate-800 border border-slate-700">
                    {getDeviceIcon(dev.type)}
                  </div>
                  <div>
                    <h3 className="font-mono font-bold text-white text-sm">{dev.name}</h3>
                    <span className="text-[10px] text-slate-400 font-mono block">UUID: {dev.uuid.slice(0, 16)}...</span>
                  </div>
                </div>

                <span
                  className={`text-[10px] px-2 py-0.5 rounded border font-mono font-bold ${
                    dev.status === 'online'
                      ? 'bg-emerald-950 text-emerald-300 border-emerald-500/40'
                      : 'bg-amber-950 text-amber-300 border-amber-500/40'
                  }`}
                >
                  {dev.status.toUpperCase()}
                </span>
              </div>

              {/* Telemetry Metrics */}
              <div className="grid grid-cols-2 gap-2 text-xs font-mono mb-3">
                <div className="bg-slate-950 p-2 rounded border border-slate-800 flex items-center justify-between">
                  <span className="text-slate-400 flex items-center gap-1">
                    <Battery className="w-3.5 h-3.5 text-cyan-400" />
                    {isAr ? 'البطارية' : 'BATTERY'}
                  </span>
                  <span className="text-white font-bold">{dev.battery}%</span>
                </div>
                <div className="bg-slate-950 p-2 rounded border border-slate-800 flex items-center justify-between">
                  <span className="text-slate-400 flex items-center gap-1">
                    <Wifi className="w-3.5 h-3.5 text-emerald-400" />
                    {isAr ? 'الإشارة' : 'SIGNAL'}
                  </span>
                  <span className="text-white font-bold">{dev.signalStrength}%</span>
                </div>
              </div>

              {/* Network & IP metadata */}
              <div className="space-y-1 text-[11px] font-mono bg-slate-950 p-2.5 rounded border border-slate-800 text-slate-300 mb-3">
                <div className="flex justify-between">
                  <span className="text-slate-500">IP ADDRESS:</span>
                  <span className="text-cyan-300">{dev.ip}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">NETWORK:</span>
                  <span className="truncate max-w-[140px]">{dev.network}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">HEARTBEAT:</span>
                  <span className="text-emerald-400">{dev.lastSeen}</span>
                </div>
              </div>

              {/* Sensor Capability Switches */}
              <div>
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-2">
                  {isAr ? 'صلاحيات ومستشعرات الوكيل' : 'SENSOR RELAY PERMISSIONS'}
                </span>
                <div className="grid grid-cols-2 gap-1.5 text-[10px] font-mono">
                  <button
                    onClick={() => togglePermission(dev.id, 'camera')}
                    className={`p-1.5 rounded border flex items-center justify-between transition-colors ${
                      dev.permissions.camera
                        ? 'bg-cyan-950/80 border-cyan-500/60 text-cyan-300'
                        : 'bg-slate-950 border-slate-800 text-slate-500'
                    }`}
                  >
                    <span className="flex items-center gap-1">
                      <Camera className="w-3 h-3" /> CAM
                    </span>
                    <span>{dev.permissions.camera ? 'ON' : 'OFF'}</span>
                  </button>

                  <button
                    onClick={() => togglePermission(dev.id, 'audio')}
                    className={`p-1.5 rounded border flex items-center justify-between transition-colors ${
                      dev.permissions.audio
                        ? 'bg-cyan-950/80 border-cyan-500/60 text-cyan-300'
                        : 'bg-slate-950 border-slate-800 text-slate-500'
                    }`}
                  >
                    <span className="flex items-center gap-1">
                      <Mic className="w-3 h-3" /> MIC
                    </span>
                    <span>{dev.permissions.audio ? 'ON' : 'OFF'}</span>
                  </button>

                  <button
                    onClick={() => togglePermission(dev.id, 'location')}
                    className={`p-1.5 rounded border flex items-center justify-between transition-colors ${
                      dev.permissions.location
                        ? 'bg-emerald-950/80 border-emerald-500/60 text-emerald-300'
                        : 'bg-slate-950 border-slate-800 text-slate-500'
                    }`}
                  >
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> GPS
                    </span>
                    <span>{dev.permissions.location ? 'ON' : 'OFF'}</span>
                  </button>

                  <button
                    onClick={() => togglePermission(dev.id, 'files')}
                    className={`p-1.5 rounded border flex items-center justify-between transition-colors ${
                      dev.permissions.files
                        ? 'bg-purple-950/80 border-purple-500/60 text-purple-300'
                        : 'bg-slate-950 border-slate-800 text-slate-500'
                    }`}
                  >
                    <span className="flex items-center gap-1">
                      <HardDrive className="w-3 h-3" /> FILES
                    </span>
                    <span>{dev.permissions.files ? 'ON' : 'OFF'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="mt-4 pt-3 border-t border-slate-800 flex justify-between items-center text-xs font-mono">
              <span className="text-[10px] text-slate-500">C2 ENCLAVE: SECURE</span>
              <button
                onClick={() => alert(`Diagnostics dispatched to ${dev.name}`)}
                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded text-[10px]"
              >
                {isAr ? 'فحص التشخيص' : 'Run Diag'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
