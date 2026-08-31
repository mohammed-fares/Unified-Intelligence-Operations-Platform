import React, { useState } from 'react';
import { DeviceInfo, TargetProfile, VaultFile, Language } from '../types';
import { mockVaultFiles } from '../data/mockData';
import {
  Folder,
  File,
  FileText,
  FileCode,
  FileAudio,
  Image,
  Database,
  Download,
  Upload,
  ShieldCheck,
  RefreshCw,
  Search,
  Lock,
  CheckCircle2,
  Eye,
  X,
  Smartphone,
  HardDrive,
  Trash2,
} from 'lucide-react';

interface FileManagerViewProps {
  activeTarget: TargetProfile;
  devices: DeviceInfo[];
  lang: Language;
}

export const FileManagerView: React.FC<FileManagerViewProps> = ({
  activeTarget,
  devices,
  lang,
}) => {
  const isAr = lang === 'ar';
  const [files, setFiles] = useState<VaultFile[]>(mockVaultFiles);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>(devices[0]?.id || 'dev-01');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedFileForPreview, setSelectedFileForPreview] = useState<VaultFile | null>(null);
  const [isPulling, setIsPulling] = useState<boolean>(false);
  const [pushPath, setPushPath] = useState<string>('/sdcard/Download/payload_config.bin');

  const filteredFiles = files.filter(
    (f) =>
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.path.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'doc':
        return <FileText className="w-4 h-4 text-blue-400" />;
      case 'image':
        return <Image className="w-4 h-4 text-emerald-400" />;
      case 'audio':
        return <FileAudio className="w-4 h-4 text-purple-400" />;
      case 'db':
        return <Database className="w-4 h-4 text-amber-400" />;
      case 'code':
        return <FileCode className="w-4 h-4 text-cyan-400" />;
      default:
        return <File className="w-4 h-4 text-slate-400" />;
    }
  };

  const handleSimulatePull = () => {
    setIsPulling(true);
    setTimeout(() => {
      const newFile: VaultFile = {
        id: `file-${Date.now()}`,
        deviceId: selectedDeviceId,
        targetId: activeTarget.id,
        name: `intercept_dump_${new Date().getHours()}${new Date().getMinutes()}.sqlite`,
        path: `/data/data/com.target.app/databases/cache_${Date.now()}.db`,
        size: '2.1 MB',
        type: 'db',
        encryption: 'AES-256-GCM',
        sha256: 'a901841029384019283401928340192834019283401928340192834019283401',
        uploadedAt: new Date().toLocaleTimeString(),
        status: 'synced',
        previewContent: '[SQLITE3_VAULT: Cache dump retrieved successfully over TLS 1.3]',
      };
      setFiles((prev) => [newFile, ...prev]);
      setIsPulling(false);
    }, 1500);
  };

  return (
    <div className="flex-1 flex flex-col gap-4">
      {/* Header Banner */}
      <div className="bg-[#0f172a] border border-[#1e293b] rounded-lg p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-cyan-500/20 rounded border border-cyan-500/50 text-cyan-400">
            <HardDrive className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-white font-mono font-bold text-base flex items-center gap-2">
              {isAr ? 'مستودع الملفات والوسائط المشفرة (Vault)' : 'Encrypted File Vault & Remote FS Manager'}
              <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-mono">
                AES-256-GCM ENCRYPTED
              </span>
            </h2>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              {isAr
                ? 'استعراض، سحب، ودفع الملفات عن بُعد مع التحقق من البصمة الرقمية SHA-256'
                : 'Remote file pull, push deployment & SHA-256 integrity seal for target endpoints'}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Target Device Selector */}
          <select
            value={selectedDeviceId}
            onChange={(e) => setSelectedDeviceId(e.target.value)}
            className="bg-slate-950 border border-slate-700 text-cyan-300 text-xs font-mono rounded px-2.5 py-1.5 focus:outline-none"
          >
            {devices.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name} ({d.type})
              </option>
            ))}
          </select>

          <button
            onClick={handleSimulatePull}
            disabled={isPulling}
            className="px-3 py-1.5 rounded text-xs font-mono border bg-cyan-600 hover:bg-cyan-500 text-black font-bold transition-colors flex items-center gap-1.5 disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isPulling ? 'animate-spin' : ''}`} />
            <span>{isPulling ? (isAr ? 'جاري السحب...' : 'PULLING...') : (isAr ? 'سحب ملفات جديدة' : 'Pull Remote Files')}</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Explorer & Upload Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1">
        {/* Left Column (col-span-8): File Explorer Table */}
        <div className="lg:col-span-8 bg-[#0f172a] border border-[#1e293b] rounded-lg p-4 flex flex-col justify-between shadow-lg">
          <div>
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Folder className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-mono font-bold text-white uppercase">
                  {isAr ? 'الملفات المستخرجة' : 'EXTRACTED VAULT REPOSITORY'} ({files.length})
                </span>
              </div>

              {/* Search Bar */}
              <div className="relative w-48 sm:w-64">
                <Search className="w-3.5 h-3.5 absolute left-2.5 rtl:left-auto rtl:right-2.5 top-2 text-slate-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={isAr ? 'بحث في الملفات...' : 'Filter files...'}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-7 rtl:px-7 py-1 text-xs text-slate-200 placeholder-slate-500 font-mono focus:outline-none focus:border-cyan-500/60"
                />
              </div>
            </div>

            {/* Files List Table */}
            <div className="overflow-x-auto rounded border border-slate-800 max-h-[460px]">
              <table className="w-full text-left rtl:text-right border-collapse text-xs font-mono">
                <thead>
                  <tr className="bg-slate-950 text-slate-400 border-b border-slate-800 uppercase text-[10px]">
                    <th className="p-2.5">{isAr ? 'الملف' : 'File Name'}</th>
                    <th className="p-2.5">{isAr ? 'المسار عن بعد' : 'Remote Path'}</th>
                    <th className="p-2.5">{isAr ? 'الحجم' : 'Size'}</th>
                    <th className="p-2.5">{isAr ? 'التشفير' : 'Encryption'}</th>
                    <th className="p-2.5">{isAr ? 'إجراءات' : 'Actions'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 bg-slate-900/40 text-slate-300">
                  {filteredFiles.map((file) => (
                    <tr key={file.id} className="hover:bg-slate-800/50 transition-colors">
                      <td className="p-2.5 font-bold text-white flex items-center gap-2">
                        {getFileIcon(file.type)}
                        <span className="truncate max-w-[160px]">{file.name}</span>
                      </td>
                      <td className="p-2.5 text-slate-400 text-[11px] truncate max-w-[200px]">
                        {file.path}
                      </td>
                      <td className="p-2.5 text-cyan-300 font-bold">{file.size}</td>
                      <td className="p-2.5">
                        <span className="bg-cyan-950/80 text-cyan-300 border border-cyan-500/40 px-1.5 py-0.5 rounded text-[9px] font-bold flex items-center gap-1 w-fit">
                          <Lock className="w-2.5 h-2.5 text-cyan-400" />
                          {file.encryption}
                        </span>
                      </td>
                      <td className="p-2.5">
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => setSelectedFileForPreview(file)}
                            className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-slate-700 hover:border-cyan-500/50"
                            title={isAr ? 'معاينة' : 'Inspect'}
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => alert(`Downloading decrypted payload: ${file.name}`)}
                            className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-slate-700 hover:border-emerald-500/50"
                            title={isAr ? 'تحميل' : 'Download'}
                          >
                            <Download className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-3 pt-2 border-t border-slate-800 flex justify-between items-center text-[10px] font-mono text-slate-500">
            <span>STORAGE USAGE: 29.8 MB / 500 GB</span>
            <span className="text-emerald-400 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> FIPS-140 COMPLIANT
            </span>
          </div>
        </div>

        {/* Right Column (col-span-4): Push File To Device & Integrity Check */}
        <div className="lg:col-span-4 space-y-4">
          {/* Push File Card */}
          <div className="bg-[#0f172a] border border-[#1e293b] rounded-lg p-4 shadow-lg">
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-800">
              <h3 className="text-xs font-mono font-bold text-white uppercase flex items-center gap-1.5">
                <Upload className="w-4 h-4 text-cyan-400" />
                {isAr ? 'دفع ملف إلى الجهاز (Push File)' : 'Push File to Device'}
              </h3>
              <span className="text-[10px] font-mono text-cyan-400">CHUNKS (64KB)</span>
            </div>

            <div className="space-y-3 text-xs font-mono">
              <div>
                <label className="text-[10px] text-slate-500 block mb-1">
                  {isAr ? 'مسار الوجهة على جهاز الهدف' : 'DESTINATION PATH ON ENDPOINT'}
                </label>
                <input
                  type="text"
                  value={pushPath}
                  onChange={(e) => setPushPath(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-cyan-200 focus:outline-none focus:border-cyan-500/60"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-500 block mb-1">
                  {isAr ? 'حمولة الملف المشفرة' : 'PAYLOAD FILE BLOB'}
                </label>
                <div className="border border-dashed border-slate-700 bg-slate-950/60 rounded p-4 text-center cursor-pointer hover:border-cyan-500/60 transition-colors">
                  <Upload className="w-6 h-6 text-slate-500 mx-auto mb-1.5" />
                  <span className="text-[11px] text-slate-400 block">
                    {isAr ? 'انقر أو اسحب ملفاً هنا للدفع' : 'Click or drop file payload here'}
                  </span>
                </div>
              </div>

              <button
                onClick={() => alert(isAr ? 'تم بدء نقل الملف عبر القناة المشفرة' : 'Encrypted file push initiated')}
                className="w-full py-2 bg-slate-800 hover:bg-cyan-950 border border-slate-700 hover:border-cyan-500/60 text-cyan-300 font-bold rounded transition-colors"
              >
                {isAr ? 'إرسال ودفع الملف' : 'Execute Secure File Push'}
              </button>
            </div>
          </div>

          {/* Integrity Seal Info Card */}
          <div className="bg-[#0f172a] border border-[#1e293b] rounded-lg p-4 shadow-lg">
            <h3 className="text-xs font-mono font-bold text-white uppercase flex items-center gap-1.5 pb-2 mb-2 border-b border-slate-800">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              {isAr ? 'سلسلة الحيازة والأمان' : 'Chain of Custody Sealing'}
            </h3>
            <p className="text-[11px] font-mono text-slate-400 leading-relaxed">
              {isAr
                ? 'جميع الملفات تُختم بـ SHA-256 تلقائياً عند الاستخراج لضمان سلامة الأدلة القانونية وعدم العبث بها.'
                : 'Every extracted object is cryptographically sealed with SHA-256 and stored in an immutable encrypted storage container.'}
            </p>
          </div>
        </div>
      </div>

      {/* File Preview Modal */}
      {selectedFileForPreview && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0f172a] border border-cyan-500/40 rounded-xl max-w-2xl w-full p-5 shadow-2xl">
            <div className="flex justify-between items-center pb-3 border-b border-slate-800 mb-4">
              <div className="flex items-center gap-2">
                {getFileIcon(selectedFileForPreview.type)}
                <h3 className="text-sm font-mono font-bold text-white">
                  {selectedFileForPreview.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedFileForPreview(null)}
                className="p-1 rounded bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="bg-slate-950 p-2.5 rounded border border-slate-800">
                <span className="text-[10px] text-slate-500 block">SHA-256 HASH CHECKSUM</span>
                <span className="text-emerald-400 break-all text-[11px]">
                  {selectedFileForPreview.sha256}
                </span>
              </div>

              <div className="bg-slate-950 p-3 rounded border border-slate-800">
                <span className="text-[10px] text-slate-500 block mb-1">DECRYPTED BUFFER PREVIEW</span>
                <pre className="text-cyan-300 text-xs whitespace-pre-wrap">
                  {selectedFileForPreview.previewContent || '[BINARY BUFFER DATA - 0x00FF889A...]'}
                </pre>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setSelectedFileForPreview(null)}
                className="px-4 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-black font-bold rounded text-xs font-mono"
              >
                {isAr ? 'إغلاق' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
