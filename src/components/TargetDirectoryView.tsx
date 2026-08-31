import React, { useState } from 'react';
import { TargetProfile, DeviceInfo, Language, TabType } from '../types';
import {
  Users,
  Search,
  ShieldAlert,
  ShieldCheck,
  Smartphone,
  Laptop,
  Tablet,
  Activity,
  Layers,
  ChevronRight,
  ExternalLink,
  Plus,
  Filter,
  Grid,
  List,
  Crosshair,
  Sparkles,
  MapPin,
  Clock,
  Radio,
  Eye,
  AlertTriangle,
  Fingerprint,
  Cpu,
  ArrowRight,
  ArrowLeft,
  X,
  CheckCircle2,
} from 'lucide-react';

interface TargetDirectoryViewProps {
  targets: TargetProfile[];
  devices: DeviceInfo[];
  lang: Language;
  onSelectTargetAndNavigate: (targetId: string, targetTab?: TabType) => void;
  onOpenFusionModal: (target: TargetProfile) => void;
  onOpenDevicesModal: (target: TargetProfile) => void;
  onAddNewTarget?: (newTarget: TargetProfile) => void;
}

export const TargetDirectoryView: React.FC<TargetDirectoryViewProps> = ({
  targets,
  devices,
  lang,
  onSelectTargetAndNavigate,
  onOpenFusionModal,
  onOpenDevicesModal,
  onAddNewTarget,
}) => {
  const isAr = lang === 'ar';
  const [searchTerm, setSearchTerm] = useState('');
  const [riskFilter, setRiskFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form State for Adding New Target
  const [newCodeName, setNewCodeName] = useState('');
  const [newNameEn, setNewNameEn] = useState('');
  const [newNameAr, setNewNameAr] = useState('');
  const [newNationalityEn, setNewNationalityEn] = useState('');
  const [newNationalityAr, setNewNationalityAr] = useState('');
  const [newOccupationEn, setNewOccupationEn] = useState('');
  const [newOccupationAr, setNewOccupationAr] = useState('');
  const [newRiskLevel, setNewRiskLevel] = useState<'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'>('HIGH');

  // Filter Targets
  const filteredTargets = targets.filter((target) => {
    const matchesSearch =
      target.fullNameEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      target.fullNameAr.includes(searchTerm) ||
      target.codeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      target.id.includes(searchTerm) ||
      target.nationalId.includes(searchTerm) ||
      target.passportId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      target.occupationEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      target.occupationAr.includes(searchTerm);

    const matchesRisk = riskFilter === 'ALL' || target.riskLevel === riskFilter;
    const matchesStatus = statusFilter === 'ALL' || target.status === statusFilter;

    return matchesSearch && matchesRisk && matchesStatus;
  });

  // Calculate high-level stats
  const totalTargets = targets.length;
  const activeMonitored = targets.filter((t) => t.status === 'ACTIVE_MONITORING').length;
  const criticalThreats = targets.filter((t) => t.riskLevel === 'CRITICAL' || t.riskLevel === 'HIGH').length;
  const totalDevices = devices.length;
  const avgFusionScore = (
    targets.reduce((acc, t) => acc + t.fusionScore, 0) / (targets.length || 1)
  ).toFixed(1);

  const getRiskBadge = (level: string) => {
    switch (level) {
      case 'CRITICAL':
        return {
          bg: 'bg-red-500/10 text-red-400 border-red-500/40',
          dot: 'bg-red-500 animate-ping',
          labelEn: 'CRITICAL THREAT',
          labelAr: 'تهديد حرج',
        };
      case 'HIGH':
        return {
          bg: 'bg-amber-500/10 text-amber-400 border-amber-500/40',
          dot: 'bg-amber-500',
          labelEn: 'HIGH RISK',
          labelAr: 'خطورة عالية',
        };
      case 'MEDIUM':
        return {
          bg: 'bg-yellow-500/10 text-yellow-300 border-yellow-500/40',
          dot: 'bg-yellow-400',
          labelEn: 'ELEVATED',
          labelAr: 'متوسط',
        };
      default:
        return {
          bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/40',
          dot: 'bg-emerald-400',
          labelEn: 'ROUTINE',
          labelAr: 'اعتيادي',
        };
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACTIVE_MONITORING':
        return {
          color: 'text-cyan-400 border-cyan-500/30 bg-cyan-950/40',
          labelEn: 'ACTIVE SURVEILLANCE',
          labelAr: 'مراقبة حية نشطة',
        };
      case 'INTERCEPT_STANDBY':
        return {
          color: 'text-purple-400 border-purple-500/30 bg-purple-950/40',
          labelEn: 'INTERCEPT STANDBY',
          labelAr: 'استعداد للاعتراض',
        };
      default:
        return {
          color: 'text-slate-400 border-slate-700 bg-slate-900',
          labelEn: 'STANDBY',
          labelAr: 'في وضع الانتظار',
        };
    }
  };

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'laptop':
        return <Laptop className="w-3.5 h-3.5" />;
      case 'tablet':
        return <Tablet className="w-3.5 h-3.5" />;
      default:
        return <Smartphone className="w-3.5 h-3.5" />;
    }
  };

  const handleCreateTarget = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCodeName || !newNameEn || !newNameAr) return;

    const newTargetObj: TargetProfile = {
      id: `0${Math.floor(100 + Math.random() * 900)}`,
      codeName: newCodeName.toUpperCase(),
      fullNameEn: newNameEn,
      fullNameAr: newNameAr,
      dob: '12/05/1992',
      nationalityEn: newNationalityEn || 'UAE Resident',
      nationalityAr: newNationalityAr || 'مقيم بالإمارات',
      passportId: `P${Math.floor(1000000 + Math.random() * 9000000)}`,
      nationalId: `784-1992-${Math.floor(100000 + Math.random() * 900000)}-1`,
      permanentAddressEn: 'Business Bay, Dubai, UAE',
      permanentAddressAr: 'الخليج التجاري، دبي',
      occupationEn: newOccupationEn || 'Field Operative',
      occupationAr: newOccupationAr || 'مشغل ميداني',
      fusionScore: 92.5,
      riskLevel: newRiskLevel,
      status: 'ACTIVE_MONITORING',
      devicesCount: 1,
      lastSync: 'Live (0s ago)',
      familyNetwork: [
        { relationEn: 'Associate', relationAr: 'جهة اتصال', name: 'Confidential Relay', phone: '+971 50 000 1122' },
      ],
      socialProfiles: [
        { platform: 'Signal', handle: `+97150${Math.floor(1000000 + Math.random() * 9000000)}`, status: 'Monitored' },
      ],
      aiInsights: [
        {
          id: `ins-${Date.now()}`,
          titleEn: 'Newly Registered Profile',
          titleAr: 'ملف مراقبة مسجل حديثاً',
          summaryEn: 'Telemetry channel provisioned. Zero-Trust endpoint handshake pending.',
          summaryAr: 'تم إنشاء قناة الاتصال وجاري استلام حزم القياس عن بعد.',
          confidence: 90,
          severity: 'info',
          timestamp: new Date().toTimeString().split(' ')[0],
        },
      ],
    };

    if (onAddNewTarget) {
      onAddNewTarget(newTargetObj);
    }
    setShowAddModal(false);
    // Reset fields
    setNewCodeName('');
    setNewNameEn('');
    setNewNameAr('');
    setNewNationalityEn('');
    setNewNationalityAr('');
    setNewOccupationEn('');
    setNewOccupationAr('');
  };

  return (
    <div className="flex flex-col gap-5 pb-6">
      {/* Top Banner: Intelligence Directory Overview */}
      <div className="bg-gradient-to-r from-[#0d1527] via-[#090d16] to-[#0d1527] border border-cyan-900/40 rounded-xl p-5 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-600/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5 mb-1.5">
              <div className="p-2 bg-cyan-500/20 border border-cyan-500/50 rounded-lg text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                <Users className="w-5 h-5" />
              </div>
              <h1 className="text-xl font-bold font-mono text-white tracking-wide flex items-center gap-2">
                {isAr ? 'قائمة الأهداف والأشخاص الخاضعين للمراقبة' : 'SUBJECT & TARGET INTELLIGENCE DIRECTORY'}
                <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                  SEC-LEVEL 4
                </span>
              </h1>
            </div>
            <p className="text-xs text-slate-400 font-mono max-w-2xl">
              {isAr
                ? 'السجل المركزي لجميع الأهداف المحددة. انقر على أي هدف للدخول مباشرة إلى ملفه الميداني الشامل، بما في ذلك أجهزته المتصلة، موقعه الجغرافي، وسجل اعتراضاته.'
                : 'Central directory of all designated intelligence subjects. Select any subject to access their unified dossier, real-time connected fleet, live geolocation radar, and media feeds.'}
            </p>
          </div>

          {/* Quick Action Button */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setShowAddModal(true)}
              className="px-3.5 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold font-mono text-xs flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(6,182,212,0.4)]"
            >
              <Plus className="w-4 h-4" />
              <span>{isAr ? 'تسجيل هدف جديد' : 'Register Target'}</span>
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mt-5 pt-4 border-t border-slate-800/80">
          <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-3">
            <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1 flex items-center justify-between">
              <span>{isAr ? 'إجمالي الأهداف' : 'Total Targets'}</span>
              <Users className="w-3.5 h-3.5 text-cyan-400" />
            </div>
            <div className="text-2xl font-bold font-mono text-white">{totalTargets}</div>
            <div className="text-[10px] font-mono text-slate-400 mt-0.5">{isAr ? 'ملفات مسجلة' : 'Active dossiers'}</div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-3">
            <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1 flex items-center justify-between">
              <span>{isAr ? 'مراقبة حية' : 'Live Active'}</span>
              <Activity className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div className="text-2xl font-bold font-mono text-emerald-400">{activeMonitored}</div>
            <div className="text-[10px] font-mono text-slate-400 mt-0.5">{isAr ? 'اتصال مباشر' : 'Real-time telemetry'}</div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-3">
            <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1 flex items-center justify-between">
              <span>{isAr ? 'تهديد مرتفع / حرج' : 'Critical Threats'}</span>
              <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
            </div>
            <div className="text-2xl font-bold font-mono text-red-400">{criticalThreats}</div>
            <div className="text-[10px] font-mono text-slate-400 mt-0.5">{isAr ? 'أولوية قصوى' : 'High intercept priority'}</div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-3">
            <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1 flex items-center justify-between">
              <span>{isAr ? 'الأجهزة المتصلة' : 'Connected Fleet'}</span>
              <Smartphone className="w-3.5 h-3.5 text-purple-400" />
            </div>
            <div className="text-2xl font-bold font-mono text-purple-300">{totalDevices}</div>
            <div className="text-[10px] font-mono text-slate-400 mt-0.5">{isAr ? 'أجهزة وهواتف' : 'Monitored endpoints'}</div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-3 col-span-2 sm:col-span-1">
            <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1 flex items-center justify-between">
              <span>{isAr ? 'متوسط دقة المطابقة' : 'Avg Fusion Score'}</span>
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
            </div>
            <div className="text-2xl font-bold font-mono text-cyan-300">{avgFusionScore}%</div>
            <div className="text-[10px] font-mono text-slate-400 mt-0.5">{isAr ? 'تطابق بيانات القياس' : 'Cross-source accuracy'}</div>
          </div>
        </div>
      </div>

      {/* Control Bar: Search & Filter Toolbar */}
      <div className="bg-[#0f172a] border border-[#1e293b] rounded-xl p-3.5 shadow-lg flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 rtl:left-auto rtl:right-3 top-3 text-slate-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={
              isAr
                ? 'ابحث بالاسم الكامل، الاسم الرمزي، رقم الهوية، جواز السفر، المهنة...'
                : 'Search target name, codename, ID, passport, role...'
            }
            className="w-full bg-slate-950/90 border border-slate-800 rounded-lg pl-9 pr-4 rtl:pl-4 rtl:pr-9 py-2 text-xs text-slate-200 placeholder-slate-500 font-mono focus:outline-none focus:border-cyan-500/70"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 rtl:right-auto rtl:left-3 top-2.5 text-slate-400 hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Threat Level Filter */}
          <div className="flex items-center gap-1 bg-slate-950/80 p-1 rounded-lg border border-slate-800">
            <span className="text-[10px] font-mono text-slate-400 px-1.5 flex items-center gap-1">
              <Filter className="w-3 h-3 text-slate-400" />
              {isAr ? 'الخطورة:' : 'Risk:'}
            </span>
            {(['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'] as const).map((lvl) => (
              <button
                key={lvl}
                onClick={() => setRiskFilter(lvl)}
                className={`px-2 py-1 rounded text-[10px] font-mono transition-all ${
                  riskFilter === lvl
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center bg-slate-950/80 p-1 rounded-lg border border-slate-800">
            <button
              onClick={() => setViewMode('grid')}
              title={isAr ? 'عرض البطاقات' : 'Grid View'}
              className={`p-1.5 rounded transition-all ${
                viewMode === 'grid' ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              title={isAr ? 'عرض الجدول' : 'Table View'}
              className={`p-1.5 rounded transition-all ${
                viewMode === 'table' ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Target Directory Grid or Table */}
      {filteredTargets.length === 0 ? (
        <div className="bg-[#0f172a] border border-[#1e293b] rounded-xl p-12 text-center">
          <Crosshair className="w-12 h-12 text-slate-600 mx-auto mb-3 animate-pulse" />
          <h3 className="text-base font-mono font-bold text-slate-300 mb-1">
            {isAr ? 'لم يتم العثور على أهداف مطابقة' : 'No Matching Targets Found'}
          </h3>
          <p className="text-xs font-mono text-slate-500 max-w-md mx-auto mb-4">
            {isAr
              ? 'جرّب تعديل مصطلحات البحث أو تغيير فلتر مستوى الخطورة للعثور على الهدف المطلوب.'
              : 'Try adjusting your search criteria or resetting filters to locate target profiles.'}
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setRiskFilter('ALL');
              setStatusFilter('ALL');
            }}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 rounded-lg text-xs font-mono"
          >
            {isAr ? 'إعادة ضبط الفلاتر' : 'Reset All Filters'}
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredTargets.map((target) => {
            const risk = getRiskBadge(target.riskLevel);
            const status = getStatusBadge(target.status);
            const targetDevices = devices.filter((d) => d.targetId === target.id);
            const onlineDevicesCount = targetDevices.filter((d) => d.status === 'online').length;

            return (
              <div
                key={target.id}
                className="bg-[#0b101b] border border-[#1e293b] hover:border-cyan-500/60 rounded-xl p-4 flex flex-col justify-between transition-all duration-200 group hover:shadow-[0_0_20px_rgba(6,182,212,0.15)] relative overflow-hidden"
              >
                {/* Threat level top accent line */}
                <div
                  className={`absolute top-0 left-0 right-0 h-1 ${
                    target.riskLevel === 'CRITICAL'
                      ? 'bg-red-500'
                      : target.riskLevel === 'HIGH'
                      ? 'bg-amber-500'
                      : target.riskLevel === 'MEDIUM'
                      ? 'bg-yellow-400'
                      : 'bg-emerald-400'
                  }`}
                ></div>

                {/* Card Header: Codename, ID, Threat Badge */}
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2.5">
                      {/* Avatar / Biometric visual */}
                      <div className="w-12 h-12 rounded-lg bg-slate-900 border border-slate-700 flex items-center justify-center relative overflow-hidden group-hover:border-cyan-500/50 transition-colors">
                        <Fingerprint className="w-6 h-6 text-slate-500 group-hover:text-cyan-400 transition-colors" />
                        <div className="absolute inset-0 bg-cyan-500/5 pointer-events-none"></div>
                        <div className="absolute bottom-0 inset-x-0 h-0.5 bg-cyan-400 animate-pulse"></div>
                      </div>

                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-mono font-bold text-cyan-400">
                            [{target.codeName}]
                          </span>
                          <span className="text-[10px] font-mono text-slate-400">#{target.id}</span>
                        </div>
                        <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors leading-tight">
                          {isAr ? target.fullNameAr : target.fullNameEn}
                        </h3>
                        <p className="text-[11px] text-slate-400 font-mono">
                          {isAr ? target.fullNameEn : target.fullNameAr}
                        </p>
                      </div>
                    </div>

                    {/* Threat Badge */}
                    <div
                      className={`px-2 py-0.5 rounded border text-[9px] font-mono font-bold flex items-center gap-1.5 shrink-0 ${risk.bg}`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${risk.dot}`}></span>
                      <span>{isAr ? risk.labelAr : risk.labelEn}</span>
                    </div>
                  </div>

                  {/* Identification Details Strip */}
                  <div className="bg-slate-950/70 border border-slate-800/80 rounded-lg p-2.5 space-y-1.5 mb-3">
                    <div className="flex items-center justify-between text-[11px] font-mono">
                      <span className="text-slate-400">{isAr ? 'المهنة:' : 'Role:'}</span>
                      <span className="text-slate-200 font-medium truncate max-w-[180px]">
                        {isAr ? target.occupationAr : target.occupationEn}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] font-mono">
                      <span className="text-slate-400">{isAr ? 'الجنسية والإقامة:' : 'Nationality:'}</span>
                      <span className="text-slate-200 truncate max-w-[180px]">
                        {isAr ? target.nationalityAr : target.nationalityEn}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] font-mono">
                      <span className="text-slate-400">{isAr ? 'جواز السفر:' : 'Passport ID:'}</span>
                      <span className="text-cyan-300 font-mono">{target.passportId}</span>
                    </div>
                  </div>

                  {/* Connected Devices Fleet & Biometric Score */}
                  <div className="space-y-2 mb-3">
                    <div className="flex items-center justify-between text-[11px] font-mono">
                      <span className="text-slate-400 flex items-center gap-1">
                        <Smartphone className="w-3.5 h-3.5 text-purple-400" />
                        {isAr ? 'الأسطول المربوط:' : 'Linked Fleet:'}
                      </span>
                      <span className="text-slate-300 font-bold">
                        {targetDevices.length > 0 ? (
                          <span className="text-emerald-400">
                            {onlineDevicesCount}/{targetDevices.length} {isAr ? 'أجهزة متصلة' : 'online'}
                          </span>
                        ) : (
                          <span className="text-slate-400">{target.devicesCount} {isAr ? 'أجهزة' : 'devices'}</span>
                        )}
                      </span>
                    </div>

                    {/* Devices list pill chips */}
                    <div className="flex flex-wrap gap-1.5">
                      {targetDevices.length > 0 ? (
                        targetDevices.map((dev) => (
                          <div
                            key={dev.id}
                            className={`px-2 py-1 rounded text-[10px] font-mono border flex items-center gap-1.5 ${
                              dev.status === 'online'
                                ? 'bg-slate-900 border-emerald-500/40 text-emerald-300'
                                : 'bg-slate-950 border-slate-800 text-slate-400'
                            }`}
                          >
                            {getDeviceIcon(dev.type)}
                            <span className="truncate max-w-[100px]">{dev.name}</span>
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                dev.status === 'online' ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'
                              }`}
                            ></span>
                          </div>
                        ))
                      ) : (
                        <div className="text-[10px] font-mono text-slate-400 italic">
                          {isAr ? 'جاري استرداد قائمة الأجهزة...' : 'Provisioning sensor relays...'}
                        </div>
                      )}
                    </div>

                    {/* Fusion Score Progress */}
                    <div className="mt-2">
                      <div className="flex items-center justify-between text-[10px] font-mono mb-1">
                        <span className="text-slate-400">{isAr ? 'دقة مطابقة الهوية:' : 'Fusion Match:'}</span>
                        <span className="text-cyan-300 font-bold">{target.fusionScore}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
                          style={{ width: `${target.fusionScore}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Recent AI Anomaly alert if any */}
                    {target.aiInsights && target.aiInsights.length > 0 && (
                      <div className="p-2 bg-amber-500/10 border border-amber-500/30 rounded-lg text-[10px] font-mono text-amber-300 flex items-start gap-1.5 mt-2">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                        <span className="line-clamp-1">
                          {isAr ? target.aiInsights[0].titleAr : target.aiInsights[0].titleEn}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Primary Action Button: Enter Target Dossier & Fleet */}
                <div className="pt-3 border-t border-slate-800/80 flex items-center gap-2">
                  <button
                    onClick={() => onSelectTargetAndNavigate(target.id, 'operations')}
                    className="flex-1 py-2.5 px-3 bg-cyan-500/20 hover:bg-cyan-500 text-cyan-300 hover:text-slate-950 border border-cyan-500/50 hover:border-cyan-400 rounded-lg text-xs font-mono font-bold transition-all flex items-center justify-center gap-2 shadow-[0_0_10px_rgba(6,182,212,0.15)] group-hover:shadow-[0_0_15px_rgba(6,182,212,0.3)]"
                  >
                    <span>{isAr ? 'دخول ملف وبيانات وأجهزة الهدف' : 'Access Target Dossier & Fleet'}</span>
                    {isAr ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                  </button>

                  <button
                    onClick={() => onOpenFusionModal(target)}
                    title={isAr ? 'مطابقة الهوية' : 'Identity Fusion'}
                    className="p-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-cyan-400 rounded-lg transition-colors"
                  >
                    <Layers className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Tactical Table View */
        <div className="bg-[#0b101b] border border-[#1e293b] rounded-xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left rtl:text-right text-xs font-mono">
              <thead className="bg-slate-950 border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-3 px-4">{isAr ? 'الاسم الرمزي والهدف' : 'Subject & Codename'}</th>
                  <th className="py-3 px-4">{isAr ? 'مستوى الخطورة' : 'Risk Level'}</th>
                  <th className="py-3 px-4">{isAr ? 'الحالة' : 'Status'}</th>
                  <th className="py-3 px-4">{isAr ? 'الأجهزة المتصلة' : 'Fleet Devices'}</th>
                  <th className="py-3 px-4">{isAr ? 'دقة المطابقة' : 'Fusion Match'}</th>
                  <th className="py-3 px-4">{isAr ? 'المهنة والجنسية' : 'Occupation / Resident'}</th>
                  <th className="py-3 px-4 text-center">{isAr ? 'الإجراء العملياتي' : 'Action'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {filteredTargets.map((target) => {
                  const risk = getRiskBadge(target.riskLevel);
                  const status = getStatusBadge(target.status);
                  const targetDevices = devices.filter((d) => d.targetId === target.id);

                  return (
                    <tr
                      key={target.id}
                      className="hover:bg-slate-900/60 transition-colors cursor-pointer group"
                      onClick={() => onSelectTargetAndNavigate(target.id, 'operations')}
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded bg-slate-900 border border-slate-700 flex items-center justify-center font-bold text-cyan-400 text-xs">
                            {target.codeName.slice(0, 2)}
                          </div>
                          <div>
                            <div className="font-bold text-white group-hover:text-cyan-300">
                              {isAr ? target.fullNameAr : target.fullNameEn}
                            </div>
                            <div className="text-[10px] text-cyan-400 font-mono">
                              [{target.codeName}] #{target.id}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded border text-[9px] font-mono font-bold inline-flex items-center gap-1.5 ${risk.bg}`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${risk.dot}`}></span>
                          <span>{isAr ? risk.labelAr : risk.labelEn}</span>
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded border text-[9px] font-mono ${status.color}`}>
                          {isAr ? status.labelAr : status.labelEn}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5 text-slate-300">
                          <Smartphone className="w-3.5 h-3.5 text-purple-400" />
                          <span>{targetDevices.length} {isAr ? 'أجهزة' : 'devices'}</span>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="w-24">
                          <div className="text-[10px] text-cyan-300 font-bold mb-0.5">{target.fusionScore}%</div>
                          <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-cyan-400 rounded-full"
                              style={{ width: `${target.fusionScore}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4 text-slate-300">
                        <div>{isAr ? target.occupationAr : target.occupationEn}</div>
                        <div className="text-[10px] text-slate-400">
                          {isAr ? target.nationalityAr : target.nationalityEn}
                        </div>
                      </td>

                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectTargetAndNavigate(target.id, 'operations');
                          }}
                          className="px-3 py-1.5 bg-cyan-500/20 hover:bg-cyan-500 text-cyan-300 hover:text-slate-950 border border-cyan-500/50 rounded text-[11px] font-mono font-bold transition-all inline-flex items-center gap-1"
                        >
                          <span>{isAr ? 'عرض الملف' : 'View'}</span>
                          {isAr ? <ArrowLeft className="w-3 h-3" /> : <ArrowRight className="w-3 h-3" />}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal: Register New Intelligence Target */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#0f172a] border border-cyan-500/40 rounded-xl max-w-lg w-full p-5 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-cyan-500/20 rounded border border-cyan-500/40 text-cyan-400">
                  <Plus className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-mono font-bold text-white uppercase">
                  {isAr ? 'تسجيل هدف استخباراتي جديد' : 'Register New Target Profile'}
                </h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-200 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateTarget} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-mono text-slate-400 mb-1 uppercase">
                    {isAr ? 'الاسم الرمزي (Codename):' : 'Codename:'}
                  </label>
                  <input
                    type="text"
                    required
                    value={newCodeName}
                    onChange={(e) => setNewCodeName(e.target.value)}
                    placeholder="e.g. FALCON-22"
                    className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-cyan-300 font-mono focus:border-cyan-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono text-slate-400 mb-1 uppercase">
                    {isAr ? 'مستوى الخطورة:' : 'Risk Level:'}
                  </label>
                  <select
                    value={newRiskLevel}
                    onChange={(e) => setNewRiskLevel(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-200 font-mono focus:border-cyan-500 focus:outline-none"
                  >
                    <option value="CRITICAL">CRITICAL</option>
                    <option value="HIGH">HIGH</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="LOW">LOW</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-mono text-slate-400 mb-1 uppercase">
                    {isAr ? 'الاسم الكامل (بالإنجليزية):' : 'Full Name (English):'}
                  </label>
                  <input
                    type="text"
                    required
                    value={newNameEn}
                    onChange={(e) => setNewNameEn(e.target.value)}
                    placeholder="e.g. Salim Al-Jabri"
                    className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-200 font-mono focus:border-cyan-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono text-slate-400 mb-1 uppercase">
                    {isAr ? 'الاسم الكامل (بالعربية):' : 'Full Name (Arabic):'}
                  </label>
                  <input
                    type="text"
                    required
                    value={newNameAr}
                    onChange={(e) => setNewNameAr(e.target.value)}
                    placeholder="مثال: سالم الجابري"
                    className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-200 font-mono focus:border-cyan-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-mono text-slate-400 mb-1 uppercase">
                    {isAr ? 'المهنة:' : 'Occupation:'}
                  </label>
                  <input
                    type="text"
                    value={newOccupationEn}
                    onChange={(e) => setNewOccupationEn(e.target.value)}
                    placeholder="e.g. Systems Engineer"
                    className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-200 font-mono focus:border-cyan-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono text-slate-400 mb-1 uppercase">
                    {isAr ? 'الجنسية والإقامة:' : 'Nationality / Residency:'}
                  </label>
                  <input
                    type="text"
                    value={newNationalityEn}
                    onChange={(e) => setNewNationalityEn(e.target.value)}
                    placeholder="e.g. Emirati / Resident"
                    className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-200 font-mono focus:border-cyan-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs font-mono"
                >
                  {isAr ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded text-xs font-mono flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{isAr ? 'تأكيد التسجيل وتفعيل المراقبة' : 'Confirm & Deploy'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
