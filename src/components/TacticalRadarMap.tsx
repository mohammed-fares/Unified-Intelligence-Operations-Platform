import React, { useState, useEffect } from 'react';
import { DeviceInfo, Language } from '../types';
import { Crosshair, Navigation, ShieldCheck, MapPin, ZoomIn, ZoomOut, Layers, AlertTriangle, RefreshCw } from 'lucide-react';

interface TacticalRadarMapProps {
  devices: DeviceInfo[];
  lang: Language;
  activeDeviceId: string;
  onSelectDevice: (id: string) => void;
}

export const TacticalRadarMap: React.FC<TacticalRadarMapProps> = ({
  devices,
  lang,
  activeDeviceId,
  onSelectDevice,
}) => {
  const isAr = lang === 'ar';
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [showGeofence, setShowGeofence] = useState<boolean>(true);
  const [showTrack, setShowTrack] = useState<boolean>(true);
  const [gpsDrift, setGpsDrift] = useState<{ lat: number; lon: number }>({ lat: 15.5007, lon: 32.5599 });
  const [targetOffset, setTargetOffset] = useState<{ x: number; y: number }>({ x: 60, y: 48 });

  // Minor realistic GPS drift simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setGpsDrift((prev) => ({
        lat: Number((prev.lat + (Math.random() - 0.5) * 0.0002).toFixed(4)),
        lon: Number((prev.lon + (Math.random() - 0.5) * 0.0002).toFixed(4)),
      }));
      setTargetOffset((prev) => ({
        x: Math.min(80, Math.max(30, prev.x + (Math.random() - 0.5) * 1.5)),
        y: Math.min(75, Math.max(25, prev.y + (Math.random() - 0.5) * 1.5)),
      }));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex-1 min-h-[300px] bg-[#0f172a] border border-[#1e293b] rounded-lg relative overflow-hidden flex flex-col shadow-xl">
      {/* Background Radar Grid Pattern */}
      <div className="absolute inset-0 bg-radar-grid opacity-25 pointer-events-none"></div>

      {/* Top HUD Controls */}
      <div className="absolute top-3 left-3 right-3 z-20 flex justify-between items-center pointer-events-auto">
        <div className="flex items-center gap-2">
          {/* GPS Live Pill */}
          <div className="bg-black/80 backdrop-blur-md border border-cyan-500/40 px-3 py-1 rounded-full text-[10px] text-white flex items-center gap-2 shadow-[0_0_10px_rgba(6,182,212,0.3)]">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
            <span className="font-mono font-bold text-cyan-300">GEOINT: GPS LIVE</span>
            <span className="text-slate-400 text-[9px] font-mono">(5-10m)</span>
          </div>

          {/* Layer Toggles */}
          <button
            onClick={() => setShowGeofence(!showGeofence)}
            className={`px-2 py-1 rounded text-[9px] font-mono border transition-colors ${
              showGeofence
                ? 'bg-emerald-950/50 border-emerald-500/50 text-emerald-300'
                : 'bg-slate-900/80 border-slate-800 text-slate-500'
            }`}
          >
            {isAr ? 'السياج الجغرافي' : 'GEOFENCE'}
          </button>
          <button
            onClick={() => setShowTrack(!showTrack)}
            className={`px-2 py-1 rounded text-[9px] font-mono border transition-colors hidden sm:block ${
              showTrack
                ? 'bg-cyan-950/50 border-cyan-500/50 text-cyan-300'
                : 'bg-slate-900/80 border-slate-800 text-slate-500'
            }`}
          >
            {isAr ? 'مسار الحركة' : 'TRACK PLAYBACK'}
          </button>
        </div>

        {/* Zoom and Center Controls */}
        <div className="flex items-center gap-1 bg-black/70 backdrop-blur p-1 rounded border border-slate-800">
          <button
            onClick={() => setZoomLevel((prev) => Math.min(2, prev + 0.2))}
            className="p-1 text-slate-400 hover:text-cyan-300 hover:bg-slate-800 rounded transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setZoomLevel((prev) => Math.max(0.6, prev - 0.2))}
            className="p-1 text-slate-400 hover:text-cyan-300 hover:bg-slate-800 rounded transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => {
              setZoomLevel(1);
              setTargetOffset({ x: 60, y: 48 });
            }}
            className="p-1 text-slate-400 hover:text-cyan-300 hover:bg-slate-800 rounded transition-colors"
            title="Reset Origin"
          >
            <Crosshair className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Radar Coordinate HUD Elements */}
      <div className="relative flex-1 flex items-center justify-center overflow-hidden">
        {/* Concentric Radar Circles with Rotating Sweep Line */}
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none transition-transform duration-300"
          style={{ transform: `scale(${zoomLevel})` }}
        >
          {/* Radar Circles */}
          <div className="w-[420px] h-[420px] border border-cyan-500/20 rounded-full flex items-center justify-center relative">
            <div className="w-[300px] h-[300px] border border-cyan-500/20 rounded-full flex items-center justify-center">
              <div className="w-[180px] h-[180px] border border-cyan-500/30 rounded-full flex items-center justify-center">
                <div className="w-[70px] h-[70px] border border-cyan-500/40 rounded-full"></div>
              </div>
            </div>

            {/* Crosshairs */}
            <div className="absolute w-full h-[1px] bg-cyan-500/20"></div>
            <div className="absolute h-full w-[1px] bg-cyan-500/20"></div>

            {/* Animated Radar Sweep Cone */}
            <div className="absolute inset-0 rounded-full animate-radar-sweep opacity-40 bg-[conic-gradient(from_0deg,transparent_0deg,transparent_270deg,rgba(6,182,212,0.25)_360deg)]"></div>
          </div>

          {/* Geofence Perimeter Polygon Simulation */}
          {showGeofence && (
            <div className="absolute top-[28%] left-[22%] w-[260px] h-[180px] border-2 border-dashed border-emerald-500/50 bg-emerald-500/5 rounded-2xl flex items-start justify-end p-2 pointer-events-none">
              <span className="text-[8px] font-mono text-emerald-400 bg-black/60 px-1.5 py-0.5 rounded border border-emerald-500/30">
                SAFE ZONE: HQ PERIMETER
              </span>
            </div>
          )}

          {/* Track History Line */}
          {showTrack && (
            <svg className="absolute inset-0 w-full h-full pointer-events-none stroke-cyan-500/40 fill-none">
              <polyline
                points="120,240 180,210 240,230 310,180 390,160 460,190"
                strokeWidth="2"
                strokeDasharray="4 4"
              />
              <circle cx="120" cy="240" r="3" fill="#06b6d4" />
              <circle cx="240" cy="230" r="3" fill="#06b6d4" />
              <circle cx="390" cy="160" r="3" fill="#06b6d4" />
            </svg>
          )}

          {/* Secondary Device Markers (MacBook & Tablet) */}
          <div
            onClick={() => onSelectDevice('dev-02')}
            className="absolute top-[35%] left-[32%] cursor-pointer group pointer-events-auto"
          >
            <div className="w-2.5 h-2.5 bg-emerald-400 rounded-full shadow-[0_0_8px_#10b981] border border-white"></div>
            <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-slate-900/90 border border-emerald-500/40 px-1.5 py-0.5 rounded text-[8px] whitespace-nowrap text-emerald-300 font-mono opacity-80 group-hover:opacity-100">
              MACBOOK_M3 (WiFi 6)
            </div>
          </div>

          <div
            onClick={() => onSelectDevice('dev-03')}
            className="absolute top-[68%] left-[72%] cursor-pointer group pointer-events-auto"
          >
            <div className="w-2.5 h-2.5 bg-amber-400 rounded-full shadow-[0_0_8px_#f59e0b] border border-white"></div>
            <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-slate-900/90 border border-amber-500/40 px-1.5 py-0.5 rounded text-[8px] whitespace-nowrap text-amber-300 font-mono opacity-80 group-hover:opacity-100">
              GALAXY_TAB (Cellular)
            </div>
          </div>

          {/* Primary Tracked Target Device */}
          <div
            style={{
              top: `${targetOffset.y}%`,
              left: `${targetOffset.x}%`,
            }}
            onClick={() => onSelectDevice('dev-01')}
            className="absolute -translate-x-1/2 -translate-y-1/2 group cursor-crosshair z-10 pointer-events-auto"
          >
            {/* Pulsing Beacon Target */}
            <div className="relative flex items-center justify-center">
              <div className="w-8 h-8 rounded-full bg-cyan-500/20 absolute animate-ping"></div>
              <div className="w-4 h-4 bg-cyan-400 rounded-full shadow-[0_0_20px_#06b6d4] border-2 border-white"></div>
            </div>

            {/* Target Label HUD */}
            <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-cyan-950/90 border border-cyan-500/70 px-2.5 py-1 rounded text-[10px] whitespace-nowrap text-white font-mono shadow-lg flex items-center gap-1.5 backdrop-blur-md">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
              <span>DEVICE_ANDROID_X9 (4.5m Precision)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Telemetry Bar */}
      <div className="absolute bottom-3 left-3 right-3 z-20 flex justify-between items-end pointer-events-none">
        {/* Device Quick Switcher */}
        <div className="flex gap-1.5 pointer-events-auto bg-black/70 backdrop-blur p-1 rounded border border-slate-800">
          {devices.map((d) => (
            <button
              key={d.id}
              onClick={() => onSelectDevice(d.id)}
              className={`px-2 py-1 rounded text-[9px] font-mono transition-colors flex items-center gap-1 ${
                activeDeviceId === d.id
                  ? 'bg-cyan-500/30 text-cyan-300 border border-cyan-500/60 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  d.status === 'online' ? 'bg-emerald-400' : 'bg-amber-400'
                }`}
              ></span>
              {d.name.replace('DEVICE_', '')}
            </button>
          ))}
        </div>

        {/* Live Coordinate Readout */}
        <div className="text-[10px] font-mono text-cyan-400/90 text-right leading-tight bg-black/80 backdrop-blur px-2.5 py-1 rounded border border-cyan-500/30 shadow-md">
          <div>LAT: {gpsDrift.lat}° N</div>
          <div>LON: {gpsDrift.lon}° E</div>
          <div className="text-slate-400 text-[8px]">ALT: 380m | CELL TOWER: TR-092</div>
        </div>
      </div>
    </div>
  );
};
