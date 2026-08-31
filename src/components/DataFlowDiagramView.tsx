import React, { useState } from 'react';
import { DFDNode, Language } from '../types';
import { dfdNodes } from '../data/mockData';
import {
  Layers,
  ArrowRight,
  Database,
  Cpu,
  User,
  ShieldCheck,
  Download,
  Info,
  Play,
  Pause,
  Filter,
  CheckCircle2,
  Workflow,
  Radio,
} from 'lucide-react';

interface DataFlowDiagramViewProps {
  lang: Language;
}

export const DataFlowDiagramView: React.FC<DataFlowDiagramViewProps> = ({ lang }) => {
  const isAr = lang === 'ar';
  const [selectedNodeId, setSelectedNodeId] = useState<string>('P0');
  const [filterType, setFilterType] = useState<'all' | 'entity' | 'process' | 'store'>('all');
  const [isSimulating, setIsSimulating] = useState<boolean>(true);
  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);

  const selectedNode = dfdNodes.find((n) => n.id === selectedNodeId) || dfdNodes[0];

  const filteredNodes = dfdNodes.filter((node) => {
    if (filterType === 'all') return true;
    return node.type === filterType;
  });

  const handleExportDFD = () => {
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  const getNodeColor = (type: string, isSelected: boolean) => {
    if (isSelected) {
      return 'border-cyan-400 bg-cyan-950/60 shadow-[0_0_20px_rgba(6,182,212,0.4)] text-cyan-200';
    }
    switch (type) {
      case 'entity':
        return 'border-purple-500/40 bg-purple-950/30 hover:border-purple-400 text-purple-200';
      case 'process':
        return 'border-cyan-500/40 bg-slate-900/80 hover:border-cyan-400 text-slate-200';
      case 'store':
        return 'border-amber-500/40 bg-amber-950/30 hover:border-amber-400 text-amber-200';
      default:
        return 'border-slate-800 bg-slate-900 text-slate-300';
    }
  };

  const getNodeIcon = (type: string) => {
    switch (type) {
      case 'entity':
        return <User className="w-4 h-4 text-purple-400" />;
      case 'process':
        return <Cpu className="w-4 h-4 text-cyan-400" />;
      case 'store':
        return <Database className="w-4 h-4 text-amber-400" />;
      default:
        return <Workflow className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="flex-1 flex flex-col gap-4">
      {/* Top Banner & Control Strip */}
      <div className="bg-[#0f172a] border border-[#1e293b] rounded-lg p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-cyan-500/20 rounded border border-cyan-500/50 text-cyan-400">
            <Workflow className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-white font-mono font-bold text-base flex items-center gap-2">
              {isAr ? '١. مخطط تدفق البيانات (Data Flow Diagram)' : '1. Data Flow Diagram (DFD Architecture)'}
              <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-mono">
                P0 - P10 | D1 - D5
              </span>
            </h2>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              {isAr
                ? 'تدفق البيانات التكتيكية بين الكيانات الخارجية، العمليات المركزية، ومستودعات التخزين المشفرة'
                : 'Interactive data streaming topology between external endpoints, ingestion pipelines & secure vaults'}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Simulation Toggle */}
          <button
            onClick={() => setIsSimulating(!isSimulating)}
            className={`px-3 py-1.5 rounded text-xs font-mono border flex items-center gap-1.5 transition-colors ${
              isSimulating
                ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300'
                : 'bg-slate-900 border-slate-700 text-slate-400'
            }`}
          >
            {isSimulating ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isSimulating ? (isAr ? 'محاكاة نشطة' : 'SIMULATION ACTIVE') : (isAr ? 'إيقاف' : 'PAUSED')}</span>
          </button>

          {/* Export DFD */}
          <button
            onClick={handleExportDFD}
            className="px-3 py-1.5 rounded text-xs font-mono border bg-slate-900 hover:bg-slate-800 border-slate-700 hover:border-cyan-500/50 text-slate-200 transition-colors flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>{downloadSuccess ? (isAr ? 'تم التصدير ✓' : 'EXPORTED ✓') : (isAr ? 'تحميل المخطط' : 'Export DFD (SVG/JSON)')}</span>
          </button>
        </div>
      </div>

      {/* Filter Ribbon */}
      <div className="flex items-center justify-between bg-[#0f172a] border border-[#1e293b] rounded-lg px-4 py-2 text-xs font-mono">
        <div className="flex items-center gap-2 overflow-x-auto">
          <span className="text-slate-500 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> {isAr ? 'تصفية:' : 'FILTER:'}
          </span>
          <button
            onClick={() => setFilterType('all')}
            className={`px-2.5 py-1 rounded transition-colors ${
              filterType === 'all'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {isAr ? 'الكل (18 عقدة)' : 'ALL (18 Nodes)'}
          </button>
          <button
            onClick={() => setFilterType('entity')}
            className={`px-2.5 py-1 rounded transition-colors ${
              filterType === 'entity'
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {isAr ? 'الكيانات الخارجية (E1-E3)' : 'External Entities (E1-E3)'}
          </button>
          <button
            onClick={() => setFilterType('process')}
            className={`px-2.5 py-1 rounded transition-colors ${
              filterType === 'process'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {isAr ? 'العمليات الداخلية (P0-P10)' : 'Internal Processes (P0-P10)'}
          </button>
          <button
            onClick={() => setFilterType('store')}
            className={`px-2.5 py-1 rounded transition-colors ${
              filterType === 'store'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {isAr ? 'مخازن البيانات (D1-D5)' : 'Data Stores (D1-D5)'}
          </button>
        </div>

        <div className="hidden lg:flex items-center gap-3 text-[11px] text-slate-400">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-500/80"></span>
            {isAr ? 'كيان خارجي' : 'External Entity'}
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
            {isAr ? 'عملية معالجة' : 'Process'}
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
            {isAr ? 'مخزن بيانات' : 'Data Store'}
          </span>
        </div>
      </div>

      {/* Main DFD Grid + Node Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1">
        {/* Visual Interactive Diagram Stage (col-span-8) */}
        <div className="lg:col-span-8 bg-[#0f172a] border border-[#1e293b] rounded-lg p-4 flex flex-col shadow-lg relative overflow-hidden">
          {/* Background Circuit/Scanline Pattern */}
          <div
            className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(circle, #06b6d4 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }}
          ></div>

          {/* DFD Stage Header */}
          <div className="flex justify-between items-center mb-3 pb-2 border-b border-slate-800 relative z-10">
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${isSimulating ? 'bg-emerald-400 animate-ping' : 'bg-slate-600'}`}></span>
              {isAr ? 'مصفوفة المسارات التفاعلية' : 'INTERACTIVE FLOW MATRIX'}
            </span>
            <span className="text-[10px] font-mono text-cyan-400">
              {isAr ? 'انقر على أي عقدة لاستعراض التدفق' : 'Click any node to inspect telemetry pipeline'}
            </span>
          </div>

          {/* Categorized Visual Flow Layout */}
          <div className="space-y-5 overflow-y-auto max-h-[580px] p-2 relative z-10">
            {/* ROW 1: External Entities */}
            {(filterType === 'all' || filterType === 'entity') && (
              <div>
                <div className="text-[10px] font-mono font-bold text-purple-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5" />
                  {isAr ? 'الكيانات الخارجية (External Entities)' : 'External Entities (Layer 1)'}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {dfdNodes
                    .filter((n) => n.type === 'entity')
                    .map((node) => {
                      const isSelected = node.id === selectedNodeId;
                      return (
                        <div
                          key={node.id}
                          onClick={() => setSelectedNodeId(node.id)}
                          className={`p-3 rounded-lg border cursor-pointer transition-all ${getNodeColor(
                            node.type,
                            isSelected
                          )}`}
                        >
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-xs font-mono font-bold bg-purple-950/80 px-1.5 py-0.5 rounded border border-purple-500/40 text-purple-300">
                              {node.code}
                            </span>
                            <span className="text-[9px] font-mono text-slate-400">{node.protocol}</span>
                          </div>
                          <h4 className="text-xs font-bold text-white mt-1">
                            {isAr ? node.titleAr : node.titleEn}
                          </h4>
                          <p className="text-[10px] text-slate-400 mt-1 line-clamp-2">
                            {isAr ? node.descriptionAr : node.descriptionEn}
                          </p>
                        </div>
                      );
                    })}
                </div>
              </div>
            )}

            {/* Simulated Animated Stream Flow Separator */}
            {isSimulating && (
              <div className="flex items-center justify-center gap-2 py-1 text-[10px] font-mono text-cyan-400/80">
                <span className="animate-pulse">▼ TLS 1.3 SECURE ENCRYPTED INGESTION PIPELINE ▼</span>
              </div>
            )}

            {/* ROW 2: Core Internal Processes (P0 - P10) */}
            {(filterType === 'all' || filterType === 'process') && (
              <div>
                <div className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5" />
                  {isAr ? 'العمليات والمعالجة الداخلية (P0 - P10)' : 'Internal Processes & Analytics (Layer 2)'}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2.5">
                  {dfdNodes
                    .filter((n) => n.type === 'process')
                    .map((node) => {
                      const isSelected = node.id === selectedNodeId;
                      return (
                        <div
                          key={node.id}
                          onClick={() => setSelectedNodeId(node.id)}
                          className={`p-2.5 rounded-lg border cursor-pointer transition-all ${getNodeColor(
                            node.type,
                            isSelected
                          )}`}
                        >
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-[11px] font-mono font-bold text-cyan-300 bg-cyan-950/70 px-1.5 py-0.5 rounded border border-cyan-500/40">
                              {node.code}
                            </span>
                            <span className="text-[9px] font-mono text-slate-500 truncate max-w-[80px]">
                              {node.protocol || 'CORE'}
                            </span>
                          </div>
                          <h4 className="text-[11px] font-bold text-slate-100 mt-1 line-clamp-1">
                            {isAr ? node.titleAr : node.titleEn}
                          </h4>
                          <p className="text-[9px] text-slate-400 mt-0.5 line-clamp-2">
                            {isAr ? node.descriptionAr : node.descriptionEn}
                          </p>
                        </div>
                      );
                    })}
                </div>
              </div>
            )}

            {/* ROW 3: Data Stores (D1 - D5) */}
            {(filterType === 'all' || filterType === 'store') && (
              <div>
                <div className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5" />
                  {isAr ? 'مستودعات وقواعد البيانات (D1 - D5 Data Stores)' : 'Encrypted Data Stores (Layer 3)'}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-2.5">
                  {dfdNodes
                    .filter((n) => n.type === 'store')
                    .map((node) => {
                      const isSelected = node.id === selectedNodeId;
                      return (
                        <div
                          key={node.id}
                          onClick={() => setSelectedNodeId(node.id)}
                          className={`p-2.5 rounded-lg border cursor-pointer transition-all ${getNodeColor(
                            node.type,
                            isSelected
                          )}`}
                        >
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-[11px] font-mono font-bold text-amber-300 bg-amber-950/70 px-1.5 py-0.5 rounded border border-amber-500/40">
                              {node.code}
                            </span>
                            <Database className="w-3 h-3 text-amber-400" />
                          </div>
                          <h4 className="text-[11px] font-bold text-slate-100 mt-1 line-clamp-1">
                            {isAr ? node.titleAr : node.titleEn}
                          </h4>
                          <p className="text-[9px] text-slate-400 mt-0.5 line-clamp-2">
                            {isAr ? node.descriptionAr : node.descriptionEn}
                          </p>
                        </div>
                      );
                    })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Node Telemetry Inspector (col-span-4) */}
        <div className="lg:col-span-4 bg-[#0f172a] border border-cyan-500/40 rounded-lg p-4 flex flex-col justify-between shadow-xl">
          <div>
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-cyan-500/20 rounded border border-cyan-500/40 text-cyan-400">
                  {getNodeIcon(selectedNode.type)}
                </div>
                <div>
                  <h3 className="text-sm font-mono font-bold text-white">
                    {isAr ? selectedNode.titleAr : selectedNode.titleEn}
                  </h3>
                  <span className="text-[10px] font-mono text-cyan-400 uppercase">
                    TYPE: {selectedNode.type.toUpperCase()} | CODE: {selectedNode.code}
                  </span>
                </div>
              </div>
            </div>

            {/* Description Card */}
            <div className="space-y-3 text-xs">
              <div className="bg-slate-950/80 p-2.5 rounded border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase font-mono block mb-1">
                  {isAr ? 'الوظيفة والتوصيف العملياتي' : 'OPERATIONAL FUNCTION'}
                </span>
                <p className="text-slate-300 font-mono text-[11px] leading-relaxed">
                  {isAr ? selectedNode.descriptionAr : selectedNode.descriptionEn}
                </p>
              </div>

              {/* Data Payload & Schema Stream */}
              <div className="bg-slate-950/80 p-2.5 rounded border border-slate-800">
                <span className="text-[10px] text-cyan-400 uppercase font-mono block mb-1">
                  {isAr ? 'حمولة البيانات المتدفقة' : 'DATA PAYLOAD / SCHEMAS'}
                </span>
                <p className="text-slate-200 font-mono text-[11px] bg-slate-900 p-1.5 rounded border border-slate-800/80">
                  {isAr ? selectedNode.dataPayloadAr : selectedNode.dataPayloadEn}
                </p>
              </div>

              {/* Communication Protocol / Transport */}
              {selectedNode.protocol && (
                <div className="bg-slate-950/80 p-2.5 rounded border border-slate-800">
                  <span className="text-[10px] text-slate-500 uppercase font-mono block mb-1">
                    {isAr ? 'بروتوكول النقل والأمان' : 'PROTOCOL / CIPHER'}
                  </span>
                  <div className="flex items-center gap-1.5 text-emerald-300 font-mono text-[11px]">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{selectedNode.protocol}</span>
                  </div>
                </div>
              )}

              {/* Connected Topology Nodes */}
              <div className="bg-slate-950/80 p-2.5 rounded border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase font-mono block mb-1.5">
                  {isAr ? 'العقد المرتبطة تدفقياً' : 'INTERCONNECTED NODES'}
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedNode.connectedTo.map((targetId) => {
                    const targetNode = dfdNodes.find((n) => n.id === targetId);
                    return (
                      <button
                        key={targetId}
                        onClick={() => setSelectedNodeId(targetId)}
                        className="px-2 py-1 bg-slate-900 hover:bg-cyan-950 border border-slate-700 hover:border-cyan-500/50 rounded text-[10px] font-mono text-cyan-300 transition-colors flex items-center gap-1"
                      >
                        <ArrowRight className="w-2.5 h-2.5 text-cyan-400 rtl:rotate-180" />
                        <span>{targetId} ({targetNode ? (isAr ? targetNode.titleAr.split(' ')[1] || targetNode.code : targetNode.code) : targetId})</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Footer Note */}
          <div className="mt-4 pt-3 border-t border-slate-800 flex justify-between items-center text-[10px] font-mono text-slate-500">
            <span>DFD SPEC: IEEE-STD-1016</span>
            <span className="text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> VERIFIED
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
