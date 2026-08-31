import React, { useState } from 'react';
import { IntelFeedItem, Language } from '../types';
import { Radio, MessageSquare, MapPin, Key, Phone, Filter, Search, ShieldAlert, Sparkles } from 'lucide-react';

interface IntelFeedProps {
  items: IntelFeedItem[];
  lang: Language;
  onSelectItem?: (item: IntelFeedItem) => void;
}

export const IntelFeed: React.FC<IntelFeedProps> = ({ items, lang, onSelectItem }) => {
  const [filterType, setFilterType] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const isAr = lang === 'ar';

  const filteredItems = items.filter((item) => {
    const matchesFilter = filterType === 'ALL' || item.type === filterType;
    const matchesSearch =
      item.contentEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.contentAr.includes(searchQuery) ||
      item.titleEn.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getBorderColor = (type: string, severity: string) => {
    if (severity === 'critical') return 'border-amber-500 bg-amber-950/20';
    if (type === 'SMS') return 'border-cyan-500 bg-cyan-950/15';
    if (type === 'GEO_FENCE') return 'border-emerald-500 bg-emerald-950/15';
    if (type === 'KEYLOG') return 'border-amber-500 bg-amber-950/15';
    if (type === 'CALL') return 'border-blue-500 bg-blue-950/15';
    return 'border-purple-500 bg-purple-950/15';
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'SMS':
        return <MessageSquare className="w-3 h-3 text-cyan-400" />;
      case 'GEO_FENCE':
        return <MapPin className="w-3 h-3 text-emerald-400" />;
      case 'KEYLOG':
        return <Key className="w-3 h-3 text-amber-400" />;
      case 'CALL':
        return <Phone className="w-3 h-3 text-blue-400" />;
      default:
        return <Radio className="w-3 h-3 text-purple-400" />;
    }
  };

  return (
    <div className="flex-1 bg-[#0f172a]/70 border border-[#1e293b] rounded-lg p-3 overflow-hidden flex flex-col shadow-lg backdrop-blur-sm">
      {/* Feed Header & Filters */}
      <div className="flex justify-between items-center mb-2 pb-1.5 border-b border-slate-800">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></div>
          <h3 className="text-[10px] text-cyan-400 font-bold uppercase tracking-widest font-mono">
            {isAr ? 'تغذية البيانات المستخرجة' : 'Extracted Intel Feed'}
          </h3>
        </div>
        <span className="text-[9px] font-mono text-slate-500">LIVE AUTO-SYNC</span>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-1 mb-2 overflow-x-auto pb-1 text-[9px] font-mono">
        {['ALL', 'SMS', 'GEO_FENCE', 'KEYLOG', 'CALL'].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterType(cat)}
            className={`px-1.5 py-0.5 rounded transition-colors whitespace-nowrap ${
              filterType === cat
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
                : 'text-slate-500 hover:text-slate-300 bg-slate-900/60'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Scrollable Feed List */}
      <div className="space-y-2.5 overflow-y-auto pr-1 flex-1 max-h-[290px]">
        {filteredItems.length === 0 ? (
          <div className="text-center py-6 text-[10px] text-slate-600 font-mono">
            NO TELEMETRY MATCHES FILTER
          </div>
        ) : (
          filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => onSelectItem && onSelectItem(item)}
              className={`p-2 rounded border-l-2 ${getBorderColor(
                item.type,
                item.severity
              )} hover:bg-slate-800/50 transition-all cursor-pointer group shadow-sm`}
            >
              <div className="flex justify-between items-center text-[9px] text-slate-500 mb-1 font-mono">
                <span className="flex items-center gap-1 font-semibold text-slate-400">
                  {getIcon(item.type)}
                  {item.titleEn}
                </span>
                <span className="text-cyan-400/80">{item.timestamp}</span>
              </div>
              <p className="text-slate-200 text-[11px] font-arabic leading-relaxed">
                {isAr ? item.contentAr : item.contentEn}
              </p>
              <div className="mt-1 flex items-center justify-between text-[8px] text-slate-500 font-mono">
                <span>SRC: {item.deviceId.toUpperCase()}</span>
                <span className="text-slate-400 uppercase">[{item.tag}]</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
