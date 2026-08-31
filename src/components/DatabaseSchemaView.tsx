import React, { useState } from 'react';
import { SchemaTable, Language } from '../types';
import { schemaTables } from '../data/mockData';
import {
  Database,
  Table as TableIcon,
  Key,
  Link,
  Search,
  Code2,
  Download,
  Copy,
  Check,
  Layers,
  FileSpreadsheet,
  ShieldAlert,
  Hash,
} from 'lucide-react';

interface DatabaseSchemaViewProps {
  lang: Language;
}

export const DatabaseSchemaView: React.FC<DatabaseSchemaViewProps> = ({ lang }) => {
  const isAr = lang === 'ar';
  const [selectedTableId, setSelectedTableId] = useState<string>('t-01');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeSubTab, setActiveSubTab] = useState<'columns' | 'sample' | 'ddl'>('columns');
  const [copiedSql, setCopiedSql] = useState<boolean>(false);

  const selectedTable = schemaTables.find((t) => t.id === selectedTableId) || schemaTables[0];

  const filteredTables = schemaTables.filter(
    (t) =>
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.functionEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.functionAr.includes(searchQuery)
  );

  // Generate SQL DDL for the selected table
  const generateSqlDdl = (table: SchemaTable) => {
    let sql = `-- Table: public.${table.name}\n-- Description: ${table.functionEn}\n`;
    sql += `CREATE TABLE public.${table.name} (\n`;
    const colDefs = table.columns.map((col) => {
      let line = `    ${col.name.padEnd(24)} ${col.type.padEnd(20)}`;
      if (col.isPrimary) line += ' PRIMARY KEY';
      if (!col.nullable && !col.isPrimary) line += ' NOT NULL';
      if (col.isForeign && col.references) line += ` REFERENCES public.${col.references}`;
      return line;
    });
    sql += colDefs.join(',\n');
    sql += '\n);\n\n-- Indexes & Comments\n';
    sql += `COMMENT ON TABLE public.${table.name} IS '${table.functionEn} (${table.functionAr})';\n`;
    return sql;
  };

  const generateAllSqlDdl = () => {
    return schemaTables.map((t) => generateSqlDdl(t)).join('\n');
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(generateSqlDdl(selectedTable));
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  return (
    <div className="flex-1 flex flex-col gap-4">
      {/* Top Banner */}
      <div className="bg-[#0f172a] border border-[#1e293b] rounded-lg p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-cyan-500/20 rounded border border-cyan-500/50 text-cyan-400">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-white font-mono font-bold text-base flex items-center gap-2">
              {isAr ? '٢. نموذج ومخطط قاعدة البيانات (Database Schema)' : '2. Relational Database Schema (ERD & DDL)'}
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono">
                14 TABLES NORMALIZED (3NF)
              </span>
            </h2>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              {isAr
                ? '١٤ جدولاً رئيسياً مترابطاً يغطي الهويات، الأجهزة، المواقع، الوسائط، ضربات المفاتيح، المشغلين وسجلات التدقيق'
                : 'Complete relational schema covering targets, devices, breadcrumbs, media vaults, logs & RBAC'}
            </p>
          </div>
        </div>

        {/* Global DDL Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              const blob = new Blob([generateAllSqlDdl()], { type: 'text/plain' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'schema_ddl_full_14_tables.sql';
              a.click();
            }}
            className="px-3 py-1.5 rounded text-xs font-mono border bg-slate-900 hover:bg-slate-800 border-slate-700 hover:border-cyan-500/50 text-slate-200 transition-colors flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>{isAr ? 'تحميل مخطط قاعدة البيانات (SQL)' : 'Download Full SQL DDL'}</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Left Tables List + Right Table Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1">
        {/* Left Column: 14 Tables Directory (col-span-4) */}
        <div className="lg:col-span-4 bg-[#0f172a] border border-[#1e293b] rounded-lg p-3.5 flex flex-col shadow-lg">
          <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-slate-800">
            <span className="text-xs font-mono font-bold text-white uppercase flex items-center gap-1.5">
              <TableIcon className="w-3.5 h-3.5 text-cyan-400" />
              {isAr ? 'الجداول المترابطة (١٤)' : 'Database Tables (14)'}
            </span>
            <span className="text-[10px] font-mono text-cyan-400">POSTGRESQL / AES-GCM</span>
          </div>

          {/* Search Table */}
          <div className="relative mb-3">
            <Search className="w-3.5 h-3.5 absolute left-2.5 rtl:left-auto rtl:right-2.5 top-2.5 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isAr ? 'بحث في الجداول...' : 'Filter tables...'}
              className="w-full bg-slate-950/80 border border-slate-800 rounded px-8 rtl:px-8 py-1.5 text-xs text-slate-200 placeholder-slate-500 font-mono focus:outline-none focus:border-cyan-500/60"
            />
          </div>

          {/* Table Items */}
          <div className="space-y-1.5 overflow-y-auto max-h-[560px] pr-1">
            {filteredTables.map((table) => {
              const isSelected = table.id === selectedTableId;
              return (
                <div
                  key={table.id}
                  onClick={() => setSelectedTableId(table.id)}
                  className={`p-2.5 rounded-lg border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-slate-900 border-cyan-500/80 shadow-[0_0_12px_rgba(6,182,212,0.25)]'
                      : 'bg-slate-950/50 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/40'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-xs text-white flex items-center gap-1.5">
                      <TableIcon className="w-3.5 h-3.5 text-cyan-400" />
                      {table.name}
                    </span>
                    <span className="text-[9px] font-mono text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">
                      {table.columns.length} {isAr ? 'حقول' : 'cols'}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1 line-clamp-1">
                    {isAr ? table.functionAr : table.functionEn}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Table Inspector & Columns (col-span-8) */}
        <div className="lg:col-span-8 bg-[#0f172a] border border-[#1e293b] rounded-lg p-4 flex flex-col justify-between shadow-lg">
          <div>
            {/* Table Header Details */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 mb-3 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2.5">
                  <h3 className="text-base font-mono font-bold text-white flex items-center gap-2">
                    <span className="text-cyan-400">table:</span> public.{selectedTable.name}
                  </h3>
                  <span className="text-[10px] font-mono bg-cyan-950/80 text-cyan-300 px-2 py-0.5 rounded border border-cyan-500/40">
                    {selectedTable.recordCount} {isAr ? 'سجلات نموذجية' : 'RECORDS'}
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-0.5">
                  {isAr ? selectedTable.functionAr : selectedTable.functionEn}
                </p>
              </div>

              {/* Sub-Tabs Selector */}
              <div className="flex gap-1 bg-slate-950 p-1 rounded border border-slate-800 text-xs font-mono">
                <button
                  onClick={() => setActiveSubTab('columns')}
                  className={`px-2.5 py-1 rounded transition-colors ${
                    activeSubTab === 'columns'
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {isAr ? 'الحقول والأنواع' : 'Schema Columns'}
                </button>
                <button
                  onClick={() => setActiveSubTab('sample')}
                  className={`px-2.5 py-1 rounded transition-colors ${
                    activeSubTab === 'sample'
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {isAr ? 'بيانات العينة' : 'Sample Data'}
                </button>
                <button
                  onClick={() => setActiveSubTab('ddl')}
                  className={`px-2.5 py-1 rounded transition-colors ${
                    activeSubTab === 'ddl'
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {isAr ? 'كود SQL DDL' : 'SQL DDL'}
                </button>
              </div>
            </div>

            {/* Relationships Banner */}
            <div className="p-2.5 bg-slate-950/80 border border-slate-800 rounded-lg mb-4 flex items-center gap-2 text-xs font-mono">
              <Link className="w-4 h-4 text-cyan-400 shrink-0" />
              <span className="text-slate-400">{isAr ? 'العلاقات والارتباطات:' : 'RELATIONSHIPS:'}</span>
              <span className="text-cyan-300">
                {isAr ? selectedTable.relationshipsAr : selectedTable.relationshipsEn}
              </span>
            </div>

            {/* Sub-Tab 1: Columns Table */}
            {activeSubTab === 'columns' && (
              <div className="overflow-x-auto max-h-[420px] rounded border border-slate-800">
                <table className="w-full text-left rtl:text-right border-collapse text-xs font-mono">
                  <thead>
                    <tr className="bg-slate-950/90 text-slate-400 border-b border-slate-800 uppercase text-[10px]">
                      <th className="p-2.5">{isAr ? 'اسم الحقل' : 'Column Name'}</th>
                      <th className="p-2.5">{isAr ? 'النوع' : 'Data Type'}</th>
                      <th className="p-2.5">{isAr ? 'المفتاح' : 'Key'}</th>
                      <th className="p-2.5">{isAr ? 'القابلية للعدم' : 'Nullable'}</th>
                      <th className="p-2.5">{isAr ? 'الوصف العملياتي' : 'Description'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80 bg-slate-900/40 text-slate-300">
                    {selectedTable.columns.map((col, idx) => (
                      <tr key={idx} className="hover:bg-slate-800/50 transition-colors">
                        <td className="p-2.5 font-bold text-white flex items-center gap-1.5">
                          {col.isPrimary && <Key className="w-3 h-3 text-amber-400" />}
                          {col.isForeign && <Link className="w-3 h-3 text-cyan-400" />}
                          <span>{col.name}</span>
                        </td>
                        <td className="p-2.5 text-cyan-300">{col.type}</td>
                        <td className="p-2.5">
                          {col.isPrimary && (
                            <span className="bg-amber-950/80 text-amber-400 border border-amber-500/40 px-1.5 py-0.5 rounded text-[9px] font-bold">
                              PK
                            </span>
                          )}
                          {col.isForeign && (
                            <span className="bg-cyan-950/80 text-cyan-300 border border-cyan-500/40 px-1.5 py-0.5 rounded text-[9px] font-bold">
                              FK → {col.references}
                            </span>
                          )}
                          {!col.isPrimary && !col.isForeign && <span className="text-slate-600">-</span>}
                        </td>
                        <td className="p-2.5">
                          {col.nullable ? (
                            <span className="text-slate-400">YES</span>
                          ) : (
                            <span className="text-emerald-400 font-bold">NO (REQUIRED)</span>
                          )}
                        </td>
                        <td className="p-2.5 text-slate-400">
                          {isAr ? col.descriptionAr : col.descriptionEn}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Sub-Tab 2: Sample Data JSON */}
            {activeSubTab === 'sample' && (
              <div className="bg-slate-950 rounded border border-slate-800 p-3 overflow-x-auto max-h-[420px]">
                <pre className="text-xs font-mono text-cyan-300">
                  {JSON.stringify(selectedTable.sampleData, null, 2)}
                </pre>
              </div>
            )}

            {/* Sub-Tab 3: SQL DDL Code */}
            {activeSubTab === 'ddl' && (
              <div className="relative">
                <div className="absolute top-2 right-2 rtl:right-auto rtl:left-2 z-10">
                  <button
                    onClick={handleCopySql}
                    className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 rounded text-xs font-mono flex items-center gap-1.5 transition-colors"
                  >
                    {copiedSql ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-cyan-400" />}
                    <span>{copiedSql ? (isAr ? 'تم النسخ' : 'Copied!') : (isAr ? 'نسخ DDL' : 'Copy DDL')}</span>
                  </button>
                </div>
                <div className="bg-slate-950 rounded border border-slate-800 p-3 overflow-x-auto max-h-[420px]">
                  <pre className="text-xs font-mono text-emerald-400 whitespace-pre-wrap">
                    {generateSqlDdl(selectedTable)}
                  </pre>
                </div>
              </div>
            )}
          </div>

          {/* Footer Metadata */}
          <div className="mt-4 pt-3 border-t border-slate-800 flex justify-between items-center text-[10px] font-mono text-slate-500">
            <span>ENGINE: POSTGRESQL 16 / ANSI SQL-99</span>
            <span className="text-cyan-400">TABLE_ID: {selectedTable.id}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
