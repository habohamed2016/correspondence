import React from 'react';
import {
  FileText,
  BarChart3,
  Share2,
  FileSpreadsheet,
  Printer,
  RefreshCw,
  Globe,
  KeyRound,
  Lock,
} from 'lucide-react';
import { SarLogo } from './SarLogo';

interface HeaderProps {
  onAddClick: () => void;
  onAnalyticsClick: () => void;
  onReportClick: (lang: string) => void;
  onShareClick: () => void;
  onExportClick: () => void;
  onPrintClick: () => void;
  lastSyncTime: string;
  onManualRefresh: () => void;
  currentLang?: 'ar' | 'en';
  onLangChange?: (lang: 'ar' | 'en') => void;
  onChangePasswordClick?: () => void;
  onLockClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onAnalyticsClick,
  onReportClick,
  onShareClick,
  onExportClick,
  onPrintClick,
  lastSyncTime,
  onManualRefresh,
  currentLang = 'ar',
  onLangChange,
  onChangePasswordClick,
  onLockClick,
}) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-3.5">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Logo & Title */}
          <div className="flex items-center gap-4">
            <div className="p-2 rounded-2xl bg-teal-50/70 border border-[#00707b]/20 shadow-xs">
              <SarLogo variant="teal" layout="horizontal" size="md" />
            </div>
            <div>
              <h1 className="text-lg sm:text-2xl font-black text-slate-900 tracking-tight leading-tight">
                سجل المراسلات والخطابات الرسمية
                <span className="text-[#00707b] font-bold block sm:inline-block sm:mr-2 text-sm sm:text-lg">
                  لقسم الصيانة لقطار الحرمين والمشاعر المقدسة
                </span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">
                Official Correspondence Log - Maintenance Department for HHR &MMMP
              </p>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center gap-2 justify-start sm:justify-end">
            {/* Language Switcher */}
            <div
              id="header-language-switcher"
              className="inline-flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 shadow-2xs"
            >
              <Globe className="w-3.5 h-3.5 text-slate-500 ml-1.5 mr-1" />
              <button
                type="button"
                onClick={() => onLangChange?.('ar')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  currentLang === 'ar'
                    ? 'bg-[#00707b] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="العربية"
              >
                عربي
              </button>
              <button
                type="button"
                onClick={() => onLangChange?.('en')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  currentLang === 'en'
                    ? 'bg-[#00707b] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="English"
              >
                English
              </button>
            </div>

            {/* Sync Timestamp */}
            <div
              onClick={onManualRefresh}
              title="انقر للتحديث الفوري"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 text-slate-600 text-xs font-semibold hover:bg-slate-200 transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5 text-emerald-600" />
              <span>متزامن: {lastSyncTime}</span>
            </div>

            {/* PDF Report Button */}
            <button
              id="btn-weekly-report"
              onClick={() => onReportClick(currentLang)}
              type="button"
              className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-[#00707b] to-[#00525b] hover:from-[#005c66] hover:to-[#00434a] text-white rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer shadow-md shadow-[#00707b]/20 whitespace-nowrap"
            >
              <FileText className="w-4 h-4 text-amber-300" />
              <span>{currentLang === 'en' ? 'Report (PDF)' : 'تقرير (PDF)'}</span>
            </button>

            {/* Analytics Button */}
            <button
              id="btn-analytics"
              onClick={onAnalyticsClick}
              type="button"
              className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 bg-[#00707b]/10 hover:bg-[#00707b]/20 text-[#00707b] border border-[#00707b]/30 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer shadow-2xs whitespace-nowrap"
            >
              <BarChart3 className="w-4 h-4 text-[#00707b]" />
              <span>(Analytics) إحصائيات</span>
            </button>

            {/* Share Button */}
            <button
              id="btn-share"
              onClick={onShareClick}
              type="button"
              className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-xl text-xs sm:text-sm font-bold transition-colors cursor-pointer shadow-2xs whitespace-nowrap"
            >
              <Share2 className="w-4 h-4 text-slate-600" />
              <span>(Share) مشاركة</span>
            </button>

            {/* Export Excel */}
            <button
              id="btn-export-excel"
              onClick={onExportClick}
              type="button"
              className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-xl text-xs sm:text-sm font-bold transition-colors cursor-pointer shadow-2xs whitespace-nowrap"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
              <span>تصدير إكسل</span>
            </button>

            {/* Print Table */}
            <button
              id="btn-print-table"
              onClick={onPrintClick}
              type="button"
              className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-xl text-xs sm:text-sm font-bold transition-colors cursor-pointer shadow-2xs whitespace-nowrap"
            >
              <Printer className="w-4 h-4 text-slate-600" />
              <span>طباعة السجل</span>
            </button>

            {/* Security / Passcode */}
            {onChangePasswordClick && (
              <button
                id="btn-change-password"
                onClick={onChangePasswordClick}
                type="button"
                title={currentLang === 'en' ? 'Change Access Passcode' : 'تغيير الرقم السري للنظام'}
                className="inline-flex items-center justify-center p-2 bg-white hover:bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-300 rounded-xl text-xs transition-colors cursor-pointer shadow-2xs"
              >
                <KeyRound className="w-4 h-4" />
              </button>
            )}

            {/* Lock System */}
            {onLockClick && (
              <button
                id="btn-lock-system"
                onClick={onLockClick}
                type="button"
                title={currentLang === 'en' ? 'Lock System Session' : 'قفل النظام'}
                className="inline-flex items-center justify-center p-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs transition-colors cursor-pointer shadow-2xs"
              >
                <Lock className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
