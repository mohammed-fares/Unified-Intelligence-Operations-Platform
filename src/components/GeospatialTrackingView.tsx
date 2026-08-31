import React, { useState } from 'react';
import { DeviceInfo, TargetProfile, Language } from '../types';
import {
  MapPin,
  Compass,
  Navigation,
  Layers,
  Radio,
  Crosshair,
  ShieldAlert,
  Clock,
  Gauge,
  Sliders,
  Sparkles,
} from 'lucide-react';

interface GeospatialTrackingViewProps {
  activeTarget: TargetProfile;
  devices: DeviceInfo[];
  lang: Language;
}

export const GeospatialTrackingView: React.FC<GeospatialTrackingViewProps> = ({
  activeTarget,
  devices,
  lang,
}) => {
  const isAr = lang === 'ar';
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>(devices[0]?.id || 'dev-01');
  const [geofenceRadius, setGeofenceRadius] = useState<number>(500);
  const [mapMode, setMapMode] = useState<'radar' | 'satellite' | 'street'>('radar');

  const selectedDevice = devices.find((d) => d.id === selectedDeviceId) || devices[0];

  const breadcrumbs = [
    { time: '14:48:10', lat: 25.1857, lng: 55.2728, speed: '0 km/h', zone: 'Business Bay Tower 4' },
    { time: '14:18:05', lat: 25.1840, lng: 55.2710, speed: '42 km/h', zone: 'Al Khail Road (Breach)' },
    { time: '13:50:22', lat: 25.1780, lng: 55.2650, speed: '28 km/h', zone: 'Downtown Sector 2' },
    { time: '13:10:00', lat: 25.1857, lng: 55.2728, speed: '0 km/h', zone: 'Office HQ / Zone A' },
  ];

  return (
    <div className="flex-1 flex flex-col gap-4">
      {/* Top Banner */}
      <div className="bg-[#0f172a] border border-[#1e293b] rounded-lg p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-cyan-500/20 rounded border border-cyan-500/50 text-cyan-400">
            <Compass className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-white font-mono font-bold text-base flex items-center gap-2">
              {isAr ? 'التتبع الجغرافي والجيومكاني (GEOINT)' : 'Geospatial Intelligence & Geofence Tracker'}
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono">
                GPS CEP ACCURACY &lt; 3.2m
              </span>
            </h2>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              {isAr
                ? 'رصد متجهات الحركة في الوقت الفعلي، سجل المسارات، والإنذار المبكر لاختراق النطاقات'
                : 'Real-time GPS coordinates, velocity vectors, breadcrumbs & boundary perimeter alerts'}
            </p>
          </div>
        </div>

        {/* Map Mode Buttons */}
        <div className="flex items-center gap-2">
          <div className="flex bg-slate-950 p-1 rounded border border-slate-800 text-xs font-mono">
            <button
              onClick={() => setMapMode('radar')}
              className={`px-2.5 py-1 rounded transition-colors ${
                mapMode === 'radar'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              RADAR HUD
            </button>
            <button
              onClick={() => setMapMode('satellite')}
              className={`px-2.5 py-1 rounded transition-colors ${
                mapMode === 'satellite'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              SATELLITE
            </button>
            <button
              onClick={() => setMapMode('street')}
              className={`px-2.5 py-1 rounded transition-colors ${
                mapMode === 'street'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              VECTOR
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Radar Canvas + Breadcrumb Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1">
        {/* Left Radar Map Stage (col-span-8) */}
        <div className="lg:col-span-8 bg-[#0f172a] border border-[#1e293b] rounded-lg p-4 flex flex-col justify-between shadow-lg relative overflow-hidden min-h-[460px]">
          {/* Radar Circles & Sweep Simulation */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
            <div className="w-[420px] h-[420px] rounded-full border border-cyan-500/20 flex items-center justify-center relative">
              <div className="w-[300px] h-[300px] rounded-full border border-cyan-500/30 flex items-center justify-center">
                <div className="w-[180px] h-[180px] rounded-full border border-cyan-500/40 flex items-center justify-center">
                  <div className="w-[60px] h-[60px] rounded-full border border-cyan-500/60 bg-cyan-950/40"></div>
                </div>
              </div>
              {/* Radar Sweep Line */}
              <div
                className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-cyan-500/10 to-cyan-400/30 animate-spin"
                style={{ animationDuration: '6s' }}
              ></div>
            </div>
          </div>

          {/* Top HUD Stats Overlay */}
          <div className="relative z-10 flex justify-between items-start">
            <div className="bg-slate-950/90 border border-slate-800 p-2.5 rounded-lg font-mono text-xs text-slate-300 backdrop-blur-md">
              <div className="text-cyan-400 font-bold flex items-center gap-1.5 mb-1">
                <Crosshair className="w-3.5 h-3.5" />
                <span>FIX: {selectedDevice.coords.lat}° N, {selectedDevice.coords.lng}° E</span>
              </div>
              <div className="text-[10px] text-slate-400">
                ALTITUDE: {selectedDevice.coords.altitude}m | VELOCITY: {selectedDevice.coords.speed} km/h
              </div>
            </div>

            {/* Target device pills */}
            <div className="flex gap-1.5">
              {devices.map((d) => (
                <button
                  key={d.id}
                  onClick={() => setSelectedDeviceId(d.id)}
                  className={`px-2.5 py-1 rounded text-xs font-mono border transition-colors ${
                    selectedDeviceId === d.id
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/60'
                      : 'bg-slate-950/80 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {d.name}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Center Beacon */}
          <div className="relative z-10 flex flex-col items-center justify-center my-auto">
            <div className="p-3 rounded-full bg-cyan-500/20 border border-cyan-400/60 shadow-[0_0_30px_rgba(6,182,212,0.6)] animate-pulse flex items-center justify-center">
              <MapPin className="w-6 h-6 text-cyan-300" />
            </div>
            <div className="mt-2 bg-slate-950/90 px-3 py-1 rounded border border-cyan-500/40 text-xs font-mono text-cyan-300 shadow-md">
              {activeTarget.codeName} - {selectedDevice.name}
            </div>
          </div>

          {/* Bottom Geofence Slider HUD */}
          <div className="relative z-10 bg-slate-950/90 border border-slate-800 p-2.5 rounded-lg flex flex-col sm:flex-row items-center justify-between gap-2 font-mono text-xs backdrop-blur-md">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              <span className="text-slate-300">{isAr ? 'نطاق السياج الجغرافي:' : 'GEOFENCE PERIMETER:'}</span>
              <span className="text-amber-300 font-bold">{geofenceRadius}m</span>
            </div>
            <input
              type="range"
              min="100"
              max="2000"
              step="50"
              value={geofenceRadius}
              onChange={(e) => setGeofenceRadius(Number(e.target.value))}
              className="w-48 accent-cyan-400 cursor-pointer"
            />
          </div>
        </div>

        {/* Right Breadcrumb Trail (col-span-4) */}
        <div className="lg:col-span-4 bg-[#0f172a] border border-[#1e293b] rounded-lg p-4 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-800">
              <span className="text-xs font-mono font-bold text-white uppercase flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                {isAr ? 'سجل المسار الزمني (Breadcrumbs)' : 'SPATIO-TEMPORAL TRAIL'}
              </span>
              <span className="text-[10px] font-mono text-cyan-400">4 FIXES</span>
            </div>

            <div className="space-y-2.5 font-mono text-xs">
              {breadcrumbs.map((crumb, i) => (
                <div
                  key={i}
                  className="bg-slate-950 p-2.5 rounded border border-slate-800/80 hover:border-cyan-500/40 transition-colors"
                >
                  <div className="flex justify-between items-center text-[10px] mb-1">
                    <span className="text-cyan-400 font-bold">{crumb.time}</span>
                    <span className="text-slate-500">{crumb.speed}</span>
                  </div>
                  <div className="text-slate-200 font-semibold truncate">{crumb.zone}</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">
                    LAT: {crumb.lat} | LNG: {crumb.lng}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 text-[10px] font-mono text-slate-500 flex justify-between items-center">
            <span>SATELLITES: 11 ACQUIRED</span>
            <span className="text-emerald-400">GLONASS + GPS</span>
          </div>
        </div>
      </div>
    </div>
  );
};
