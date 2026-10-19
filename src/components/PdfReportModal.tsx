import React, { useState, useRef } from 'react';
import {
  X,
  Printer,
  Download,
  Globe,
  FileText,
  Flame,
  CheckCircle2,
  Clock,
  AlertTriangle,
} from 'lucide-react';
import { Letter } from '../types/letter';
import { SarLogo } from './SarLogo';
import { formatNetworkName, formatDirectionName, formatStatusName } from '../utils/excel';

interface PdfReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  letters: Letter[];
  autoDownloadOnOpen?: boolean;
  initialLang?: 'ar' | 'en';
}

export const PdfReportModal: React.FC<PdfReportModalProps> = ({
  isOpen,
  onClose,
  letters,
  initialLang = 'ar',
}) => {
  const [reportLang, setReportLang] = useState<'ar' | 'en'>(initialLang);
  const printRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const isEn = reportLang === 'en';
  const now = new Date();

  const formattedDateAr = now.toLocaleDateString('ar-SA', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const formattedDateEn = now.toLocaleDateString('en-GB', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const total = letters.length;
  const inCount = letters.filter((l) => l.direction === 'IN').length;
  const outCount = letters.filter((l) => l.direction === 'OUT').length;
  const openCount = letters.filter((l) => l.status === 'OPEN' || l.status === 'UNDER_REVIEW').length;
  const closedCount = letters.filter((l) => l.status === 'CLOSED').length;
  const needReply = letters.filter((l) => l.requiresReply && l.status !== 'CLOSED').length;
  const escalated = letters.filter((l) => l.isEscalated);

  const pendingLetters = letters.filter((l) => l.requiresReply && l.status !== 'CLOSED');
  const displayLetters = pendingLetters.length > 0 ? pendingLetters.slice(0, 8) : letters.slice(0, 8);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 print:p-0 print:bg-white print:static">
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col border border-slate-200 overflow-hidden print:shadow-none print:border-none print:max-h-none print:w-full">
        {/* Top toolbar */}
        <div className="p-4 sm:px-6 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 print:hidden shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-teal-500/20 text-[#00a2b0] flex items-center justify-center">
              <FileText className="w-5 h-5 text-teal-400" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-black">
                {isEn ? 'Official Executive Correspondence Report' : 'تقرير المراسلات الرسمي (Executive PDF)'}
              </h2>
              <p className="text-[11px] text-slate-400">
                {isEn ? 'Formatted for A4 printing and PDF export' : 'مجهز للطباعة والتصدير بصيغة A4 الرسمية'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Lang switcher */}
            <div className="inline-flex items-center bg-slate-800 p-1 rounded-xl border border-slate-700">
              <button
                type="button"
                onClick={() => setReportLang('ar')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  reportLang === 'ar' ? 'bg-[#00707b] text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                عربي
              </button>
              <button
                type="button"
                onClick={() => setReportLang('en')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  reportLang === 'en' ? 'bg-[#00707b] text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                English
              </button>
            </div>

            <button
              onClick={handlePrint}
              type="button"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-[#00707b] to-[#005c66] hover:from-[#005c66] hover:to-[#004e56] text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-[#00707b]/30 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>{isEn ? 'Print / Save PDF' : 'طباعة / حفظ كـ PDF'}</span>
            </button>

            <button
              onClick={onClose}
              type="button"
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Report Printable Sheet */}
        <div className="overflow-y-auto p-4 sm:p-8 print:p-0 flex-1 bg-slate-100/60 print:bg-white">
          <div
            id="weekly-pdf-report-sheet"
            ref={printRef}
            dir={isEn ? 'ltr' : 'rtl'}
            className="bg-white p-6 sm:p-10 rounded-2xl shadow-sm border border-slate-200 mx-auto max-w-3xl text-slate-900 print:shadow-none print:border-none print:p-6"
          >
            {/* Header letterhead */}
            <div className="flex items-start justify-between border-b-2 border-[#00707b] pb-6 mb-6">
              <div className="flex items-center gap-3">
                <SarLogo variant="teal" layout="horizontal" size="lg" />
              </div>

              <div className="text-right">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  {isEn ? 'Kingdom of Saudi Arabia' : 'المملكة العربية السعودية'}
                </div>
                <div className="text-sm font-black text-[#00707b]">
                  {isEn ? 'Saudi Arabia Railways (SAR)' : 'الخطوط الحديدية السعودية'}
                </div>
                <div className="text-[11px] font-mono text-slate-400 mt-1">
                  {isEn ? formattedDateEn : formattedDateAr}
                </div>
              </div>
            </div>

            {/* Title */}
            <div className="text-center mb-6">
              <h1 className="text-lg sm:text-2xl font-black text-slate-900 tracking-tight leading-snug">
                {isEn
                  ? 'Official Correspondence Log - Maintenance Department for HHR &MMMP'
                  : 'التقرير التنفيذي لسجل المراسلات والخطابات الرسمية لقسم الصيانة لقطار الحرمين والمشاعر المقدسة'}
              </h1>
              <p className="text-xs text-slate-500 mt-1 font-medium">
                {isEn
                  ? 'Centralized Executive Report for In-Coming & Out-Going Letters'
                  : 'بيان موحد بمتابعة المعاملات الصادرة والواردة لقسم الصيانة لقطار الحرمين الشريفين وقطار المشاعر المقدسة'}
              </p>
            </div>

            {/* KPI Summary Grid */}
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-6 text-center">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="text-[10px] text-slate-500 font-bold">{isEn ? 'Total' : 'الإجمالي'}</div>
                <div className="text-lg font-black font-mono text-slate-900">{total}</div>
              </div>
              <div className="p-3 bg-blue-50 rounded-xl border border-blue-200">
                <div className="text-[10px] text-blue-700 font-bold">{isEn ? 'In-Coming' : 'الوارد'}</div>
                <div className="text-lg font-black font-mono text-blue-900">{inCount}</div>
              </div>
              <div className="p-3 bg-orange-50 rounded-xl border border-orange-200">
                <div className="text-[10px] text-orange-700 font-bold">{isEn ? 'Out-Going' : 'الصادر'}</div>
                <div className="text-lg font-black font-mono text-orange-900">{outCount}</div>
              </div>
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200">
                <div className="text-[10px] text-amber-700 font-bold">{isEn ? 'In-Progress' : 'قيد الإجراء'}</div>
                <div className="text-lg font-black font-mono text-amber-900">{openCount}</div>
              </div>
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                <div className="text-[10px] text-emerald-700 font-bold">{isEn ? 'Closed' : 'مكتمل'}</div>
                <div className="text-lg font-black font-mono text-emerald-900">{closedCount}</div>
              </div>
              <div className="p-3 bg-rose-50 rounded-xl border border-rose-200">
                <div className="text-[10px] text-rose-700 font-bold">{isEn ? 'Escalated' : 'مُصعّدة'}</div>
                <div className="text-lg font-black font-mono text-rose-900">{escalated.length}</div>
              </div>
            </div>

            {/* Key / Urgent Correspondence Table */}
            <div className="mb-6">
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider mb-2.5 flex items-center justify-between">
                <span>
                  {isEn
                    ? 'Key Action-Required & Recent Letters'
                    : 'أبرز الخطابات المعلقة للمتابعة والمعاملات الحديثة'}
                </span>
                <span className="text-[10px] font-normal text-slate-500 font-mono">
                  {displayLetters.length} {isEn ? 'records' : 'معاملات'}
                </span>
              </h3>

              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full text-xs text-right">
                  <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                    <tr>
                      <th className="py-2 px-3 text-center w-8">#</th>
                      <th className="py-2 px-3">{isEn ? 'Ref Number' : 'رقم المرجع'}</th>
                      <th className="py-2 px-3">{isEn ? 'Date' : 'التاريخ'}</th>
                      <th className="py-2 px-3">{isEn ? 'Network' : 'الشبكة'}</th>
                      <th className="py-2 px-3">{isEn ? 'Direction' : 'النوع'}</th>
                      <th className="py-2 px-3">{isEn ? 'Subject' : 'الموضوع'}</th>
                      <th className="py-2 px-3">{isEn ? 'Status' : 'الحالة'}</th>
                      <th className="py-2 px-3">{isEn ? 'Deadline' : 'موعد الرد'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {displayLetters.map((l, i) => (
                      <tr key={l.id} className={l.isEscalated ? 'bg-rose-50/40' : ''}>
                        <td className="py-2 px-3 text-center text-slate-400 font-mono text-[10px]">
                          {i + 1}
                        </td>
                        <td className="py-2 px-3 font-mono font-bold text-[#00707b] text-[11px] whitespace-nowrap">
                          {l.refNumber}
                        </td>
                        <td className="py-2 px-3 font-mono text-slate-600 text-[10px] whitespace-nowrap">
                          {l.date}
                        </td>
                        <td className="py-2 px-3 font-bold text-slate-700 whitespace-nowrap">
                          {l.network}
                        </td>
                        <td className="py-2 px-3 whitespace-nowrap">
                          {isEn ? (l.direction === 'IN' ? 'In-Coming' : 'Out-Going') : formatDirectionName(l.direction)}
                        </td>
                        <td className="py-2 px-3 text-slate-900 font-medium line-clamp-1 max-w-[200px]">
                          {l.subject}
                        </td>
                        <td className="py-2 px-3 whitespace-nowrap font-bold text-[11px]">
                          {isEn ? l.status : formatStatusName(l.status)}
                        </td>
                        <td className="py-2 px-3 font-mono text-slate-600 text-[10px] whitespace-nowrap">
                          {l.requiresReply ? l.replyDeadline || '—' : (isEn ? 'N/A' : 'للعلم')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Official Certification & Signature Box */}
            <div className="pt-6 border-t-2 border-slate-200 flex items-end justify-between text-xs">
              <div>
                <div className="font-bold text-slate-700">
                  {isEn ? 'Prepared by: Correspondence Log System' : 'جهة الإصدار: نظام سجل المراسلات والخطابات'}
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  {isEn ? 'System verified & digitally audited' : 'مستخرج إلكترونياً ومعتمد رسمياً'}
                </div>
              </div>

              <div className="text-center p-3 border border-dashed border-[#00707b]/40 rounded-xl bg-teal-50/30">
                <div className="text-[10px] font-bold text-[#00707b] uppercase tracking-wider">
                  {isEn ? 'Digital Verification' : 'ختم الاعتماد الرقمي'}
                </div>
                <div className="text-xs font-mono font-black text-slate-800 mt-1">
                  SAR-OFFICIAL-2026
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-8 pt-3 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 font-mono">
              <span>
                {isEn
                  ? 'SAR Official Correspondence Portal - Saudi Arabia Railways'
                  : 'سجل المراسلات الرسمي - الخطوط الحديدية السعودية SAR'}
              </span>
              <span>
                {isEn ? `Generated: ${formattedDateEn}` : `تاريخ الاستخراج: ${formattedDateAr}`}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
