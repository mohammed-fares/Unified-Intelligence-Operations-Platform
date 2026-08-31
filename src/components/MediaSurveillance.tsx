import React, { useState, useEffect } from 'react';
import { DeviceInfo, Language } from '../types';
import { Camera, Mic, Volume2, Radio, Sliders, RefreshCw, Eye, Sparkles, AlertCircle } from 'lucide-react';

interface MediaSurveillanceProps {
  device: DeviceInfo;
  lang: Language;
}

export const MediaSurveillance: React.FC<MediaSurveillanceProps> = ({ device, lang }) => {
  const isAr = lang === 'ar';
  const [activeCam, setActiveCam] = useState<'front' | 'rear' | 'integrated'>(device.activeCamera);
  const [isLiveCam, setIsLiveCam] = useState<boolean>(true);
  const [snapshotFlash, setSnapshotFlash] = useState<boolean>(false);
  const [isPushingTalk, setIsPushingTalk] = useState<boolean>(false);
  const [pttMode, setPttMode] = useState<'hold' | 'toggle'>('toggle');
  const [voiceProfile, setVoiceProfile] = useState<'clean' | 'synthetic' | 'morph'>('clean');
  const [audioGain, setAudioGain] = useState<number>(12);
  const [frequencies, setFrequencies] = useState<number[]>([20, 45, 90, 60, 30, 55, 10, 75, 40, 85, 25, 65]);

  // Animated Audio Equalizer Bars
  useEffect(() => {
    const interval = setInterval(() => {
      setFrequencies((prev) =>
        prev.map(() => Math.floor(Math.random() * 85) + 15)
      );
    }, 200);
    return () => clearInterval(interval);
  }, []);

  const triggerSnapshot = () => {
    setSnapshotFlash(true);
    setTimeout(() => setSnapshotFlash(false), 300);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 min-h-[170px]">
      {/* 1. Camera Feed Box */}
      <div className="bg-[#0f172a] border border-[#1e293b] rounded-lg p-2.5 flex flex-col relative shadow-md">
        <div className="flex justify-between items-center text-[9px] text-slate-400 uppercase mb-1.5 font-mono">
          <div className="flex items-center gap-1 text-slate-300">
            <Camera className="w-3 h-3 text-cyan-400" />
            <span>
              {isAr ? 'بث الكاميرا' : 'Cam Feed'}{' '}
              <span className="text-cyan-400">({activeCam.toUpperCase()})</span>
            </span>
          </div>

          {/* Camera Switcher (Front/Rear if available) */}
          {device.cameraAvailable.length > 1 && (
            <div className="flex gap-1">
              <button
                onClick={() => setActiveCam('front')}
                className={`px-1.5 py-0.5 rounded text-[8px] font-mono transition-colors ${
                  activeCam === 'front'
                    ? 'bg-cyan-500/30 text-cyan-300 border border-cyan-500/50'
                    : 'bg-slate-900 text-slate-500'
                }`}
              >
                FRONT
              </button>
              <button
                onClick={() => setActiveCam('rear')}
                className={`px-1.5 py-0.5 rounded text-[8px] font-mono transition-colors ${
                  activeCam === 'rear'
                    ? 'bg-cyan-500/30 text-cyan-300 border border-cyan-500/50'
                    : 'bg-slate-900 text-slate-500'
                }`}
              >
                REAR
              </button>
            </div>
          )}
        </div>

        {/* Video Canvas Container */}
        <div className="flex-1 bg-black rounded flex items-center justify-center overflow-hidden border border-slate-800 relative min-h-[90px]">
          {/* Snapshot flash effect */}
          {snapshotFlash && (
            <div className="absolute inset-0 bg-white z-30 animate-out fade-out duration-300"></div>
          )}

          {/* Simulated Active Video Feed */}
          {isLiveCam ? (
            <div className="relative w-full h-full flex flex-col items-center justify-center p-2 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:12px_12px]">
              {/* Overlay Holographic Grid */}
              <div className="w-12 h-12 border border-cyan-500/40 rounded flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></div>
              </div>
              <div className="mt-1 text-[8px] font-mono text-cyan-400/80 uppercase tracking-wider">
                WEBRTC: 1080P @ 30FPS
              </div>
              <div className="absolute bottom-1.5 left-2 text-[8px] font-mono text-slate-500">
                BITRATE: 2.4 Mb/s
              </div>
            </div>
          ) : (
            <div className="text-[10px] text-slate-600 font-mono flex flex-col items-center gap-1">
              <Eye className="w-4 h-4 text-slate-700" />
              <span>SIGNAL_PAUSED</span>
            </div>
          )}

          {/* Live indicator dots */}
          <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/60 px-1.5 py-0.5 rounded backdrop-blur">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></div>
            <span className="text-[7px] font-mono text-emerald-400">REC</span>
          </div>

          {/* Snapshot Button */}
          <button
            onClick={triggerSnapshot}
            title="Capture Snapshot"
            className="absolute bottom-1.5 right-1.5 p-1 bg-slate-900/80 hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-300 rounded border border-slate-700 transition-colors"
          >
            <Camera className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* 2. Audio Spectrogram Box */}
      <div className="bg-[#0f172a] border border-[#1e293b] rounded-lg p-2.5 flex flex-col shadow-md">
        <div className="flex justify-between items-center text-[9px] text-slate-400 uppercase mb-1.5 font-mono">
          <div className="flex items-center gap-1 text-slate-300">
            <Mic className="w-3 h-3 text-cyan-400" />
            <span>{isAr ? 'التحليل الصوتي والمطياف' : 'Audio Spectrogram'}</span>
          </div>
          <span className="text-[8px] text-emerald-400 font-mono">MIC LIVE</span>
        </div>

        {/* Dynamic Equalizer Bars */}
        <div className="flex-1 flex items-end gap-1 p-2 bg-black/50 rounded border border-slate-800 min-h-[90px]">
          {frequencies.map((h, idx) => (
            <div
              key={idx}
              className="flex-1 bg-gradient-to-t from-cyan-600 via-cyan-400 to-emerald-400 rounded-t transition-all duration-150 shadow-[0_0_4px_rgba(6,182,212,0.3)]"
              style={{ height: `${h}%` }}
            ></div>
          ))}
        </div>

        {/* Audio Meta telemetry */}
        <div className="mt-1.5 flex justify-between items-center text-[8px] font-mono text-cyan-400/90">
          <span>FREQ: 44.1kHz / GAIN: +{audioGain}dB</span>
          <span className="text-slate-400">LANG: AR / EN (DETECTED)</span>
        </div>
      </div>

      {/* 3. Push to Talk & Voice Modulation Box */}
      <div className="bg-cyan-950/20 border border-cyan-500/30 rounded-lg p-2.5 flex flex-col items-center justify-between shadow-md relative overflow-hidden">
        {/* Glow ambient */}
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 to-transparent pointer-events-none"></div>

        <div className="w-full flex justify-between items-center text-[9px] font-mono text-slate-400">
          <span className="text-cyan-300 font-bold">
            {isAr ? 'التحدث المباشر' : 'TWO-WAY AUDIO'}
          </span>
          <select
            value={voiceProfile}
            onChange={(e) => setVoiceProfile(e.target.value as any)}
            className="bg-slate-900 border border-cyan-500/40 text-cyan-300 text-[8px] rounded px-1 py-0.5 outline-none font-mono"
          >
            <option value="clean">Original Clean</option>
            <option value="synthetic">Synthetic Alpha</option>
            <option value="morph">Radio Morph</option>
          </select>
        </div>

        {/* Big Push-To-Talk Button */}
        <div className="my-1 flex flex-col items-center gap-1.5">
          <button
            onMouseDown={() => setIsPushingTalk(true)}
            onMouseUp={() => setIsPushingTalk(false)}
            onClick={() => pttMode === 'toggle' && setIsPushingTalk(!isPushingTalk)}
            className={`w-12 h-12 rounded-full border-2 transition-all flex items-center justify-center relative cursor-pointer ${
              isPushingTalk
                ? 'bg-cyan-500 border-white text-black shadow-[0_0_20px_#06b6d4] scale-105'
                : 'border-cyan-500/60 bg-cyan-950/40 hover:bg-cyan-500/20 text-cyan-300'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-sm transition-transform ${
                isPushingTalk ? 'bg-black animate-pulse' : 'bg-cyan-400'
              }`}
            ></div>
          </button>
          <span
            className={`text-[9px] font-bold font-mono tracking-wider ${
              isPushingTalk ? 'text-white animate-pulse' : 'text-cyan-400'
            }`}
          >
            {isPushingTalk ? (isAr ? 'جاري البث...' : 'TRANSMITTING...') : (isAr ? 'اضغط للتحدث' : 'PUSH TO TALK')}
          </span>
        </div>

        {/* Audio Buffer Progress Bar */}
        <div className="w-full">
          <div className="w-full h-1 bg-slate-800 rounded overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                isPushingTalk ? 'bg-cyan-400 w-full' : 'bg-cyan-500/60 w-2/3'
              }`}
            ></div>
          </div>
          <div className="flex justify-between text-[7px] font-mono text-slate-500 mt-0.5">
            <span>MIC: INTERCOM_ACTIVE</span>
            <span>AES-256</span>
          </div>
        </div>
      </div>
    </div>
  );
};
