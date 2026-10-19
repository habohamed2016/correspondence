import React from 'react';
import {
  X,
  BarChart3,
  Printer,
  TrendingUp,
  Inbox,
  Send,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Flame,
} from 'lucide-react';
import { Letter } from '../types/letter';
import { formatNetworkName } from '../utils/excel';

interface AnalyticsModalProps {
  isOpen: boolean;
  onClose: () => void;
  letters: Letter[];
}

export const AnalyticsModal: React.FC<AnalyticsModalProps> = ({
  isOpen,
  onClose,
  letters,
}) => {
  if (!isOpen) return null;

  const total = letters.length;
  const inCount = letters.filter((l) => l.direction === 'IN').length;
  const outCount = letters.filter((l) => l.direction === 'OUT').length;
  const openCount = letters.filter((l) => l.status === 'OPEN').length;
  const reviewCount = letters.filter((l) => l.status === 'UNDER_REVIEW').length;
  const closedCount = letters.filter((l) => l.status === 'CLOSED').length;
  const tmoCount = letters.filter((l) => l.network === 'TMO').length;
  const infraCount = letters.filter((l) => l.network === 'INFRA &FM').length;
  const sysCount = letters.filter((l) => l.network === 'SYSTEM').length;
  const mmmpCount = letters.filter((l) => l.network === 'MMMP').length;
  const needReply = letters.filter((l) => l.requiresReply).length;
  const replyPending = letters.filter((l) => l.requiresReply && l.status !== 'CLOSED').length;
  const escalatedCount = letters.filter((l) => l.isEscalated).length;

  const urgentCount = letters.filter((l) => l.priority === 'URGENT').length;
  const highCount = letters.filter((l) => l.priority === 'HIGH').length;
  const normalCount = letters.filter((l) => l.priority === 'NORMAL').length;

  const completionRate = total > 0 ? Math.round((closedCount / total) * 100) : 0;
  const inRate = total > 0 ? Math.round((inCount / total) * 100) : 0;
  const outRate = total > 0 ? Math.round((outCount / total) * 100) : 0;

  const networks = [
    { name: 'قطاع التشغيل والصيانة (TMO)', code: 'TMO', count: tmoCount, color: 'bg-teal-600' },
    { name: 'البنية التحتية والمرافق (INFRA &FM)', code: 'INFRA &FM', count: infraCount, color: 'bg-indigo-600' },
    { name: 'الأنظمة والإشارات (SYSTEM)', code: 'SYSTEM', count: sysCount, color: 'bg-cyan-600' },
    { name: 'قطار المشاعر المقدسة (MMMP)', code: 'MMMP', count: mmmpCount, color: 'bg-amber-600' },
  ];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-150">
      <div
        className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#00707b]/10 text-[#00707b] flex items-center justify-center font-bold">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 leading-tight">
                لوحة الإحصائيات الشاملة والرسوم البيانية
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Comprehensive Analytics, KPI Indicators & Visual Charts
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              type="button"
              className="px-3.5 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold inline-flex items-center gap-1.5 transition-colors cursor-pointer no-print shadow-2xs"
              title="طباعة التقرير والإحصائيات"
            >
              <Printer className="w-4 h-4" />
              <span>طباعة الإحصائيات</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Analytics Body */}
        <div id="statistics-visual-charts-section" className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200">
              <div className="text-xs font-bold text-teal-800">إجمالي المعاملات</div>
              <div className="text-2xl font-black font-mono text-teal-900 mt-1">{total}</div>
              <div className="text-[11px] text-teal-700 mt-0.5">معاملة موثقة بالسجل</div>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
              <div className="text-xs font-bold text-emerald-800">نسبة الإغلاق والإنجاز</div>
              <div className="text-2xl font-black font-mono text-emerald-900 mt-1">{completionRate}%</div>
              <div className="text-[11px] text-emerald-700 mt-0.5">{closedCount} معاملة مغلقة</div>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200">
              <div className="text-xs font-bold text-amber-800">معاملات تتطلب رداً</div>
              <div className="text-2xl font-black font-mono text-amber-900 mt-1">{replyPending}</div>
              <div className="text-[11px] text-amber-700 mt-0.5">معلقة بانتظار الرد</div>
            </div>

            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200">
              <div className="text-xs font-bold text-rose-800">معاملات مُصعّدة</div>
              <div className="text-2xl font-black font-mono text-rose-900 mt-1">{escalatedCount}</div>
              <div className="text-[11px] text-rose-700 mt-0.5">تحتاج متابعة عاجلة</div>
            </div>
          </div>

          {/* Network Distribution Bar Chart */}
          <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200">
            <h3 className="text-sm font-black text-slate-900 mb-3 flex items-center justify-between">
              <span>توزيع المراسلات حسب شبكة السكك الحديدية (Networks):</span>
              <span className="text-xs text-slate-500 font-normal">إجمالي: {total}</span>
            </h3>
            <div className="space-y-3">
              {networks.map((net) => {
                const pct = total > 0 ? Math.round((net.count / total) * 100) : 0;
                return (
                  <div key={net.code}>
                    <div className="flex items-center justify-between text-xs font-bold mb-1">
                      <span className="text-slate-800">{net.name}</span>
                      <span className="font-mono text-slate-600">
                        {net.count} خطاب ({pct}%)
                      </span>
                    </div>
                    <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${net.color} rounded-full transition-all duration-500`}
                        style={{ width: `${pct}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Direction & Status Progress */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Direction */}
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200">
              <h3 className="text-sm font-black text-slate-900 mb-3">
                توزيع المراسلات: الوارد والصادر
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between text-xs font-bold mb-1">
                    <span className="text-blue-800 flex items-center gap-1.5">
                      <Inbox className="w-4 h-4 text-blue-600" />
                      الخطابات الواردة (In-Coming)
                    </span>
                    <span className="font-mono text-blue-900">{inCount} ({inRate}%)</span>
                  </div>
                  <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-600 rounded-full" style={{ width: `${inRate}%` }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs font-bold mb-1">
                    <span className="text-orange-800 flex items-center gap-1.5">
                      <Send className="w-4 h-4 text-orange-600" />
                      الخطابات الصادرة (Out-Going)
                    </span>
                    <span className="font-mono text-orange-900">{outCount} ({outRate}%)</span>
                  </div>
                  <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-orange-500 rounded-full" style={{ width: `${outRate}%` }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Status Breakdown */}
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200">
              <h3 className="text-sm font-black text-slate-900 mb-3">
                موقف إنجاز المعاملات (Status)
              </h3>
              <div className="space-y-3 text-xs font-bold">
                <div className="flex items-center justify-between p-2.5 bg-emerald-50 rounded-xl text-emerald-900 border border-emerald-200">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    مغلق ومكتمل نهائياً
                  </span>
                  <span className="font-mono text-sm">{closedCount}</span>
                </div>

                <div className="flex items-center justify-between p-2.5 bg-blue-50 rounded-xl text-blue-900 border border-blue-200">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-blue-600" />
                    تحت الدراسة والمراجعة
                  </span>
                  <span className="font-mono text-sm">{reviewCount}</span>
                </div>

                <div className="flex items-center justify-between p-2.5 bg-amber-50 rounded-xl text-amber-900 border border-amber-200">
                  <span className="flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    مفتوح / جاري المتابعة
                  </span>
                  <span className="font-mono text-sm">{openCount}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Priority Distribution */}
          <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200">
            <h3 className="text-sm font-black text-slate-900 mb-3">
              مستويات الأولوية والأهمية للمراسلات:
            </h3>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl">
                <div className="text-xs font-bold text-rose-800">عاجل جداً (Urgent)</div>
                <div className="text-xl font-black font-mono text-rose-900 mt-1">{urgentCount}</div>
              </div>
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl">
                <div className="text-xs font-bold text-amber-800">مهم (High)</div>
                <div className="text-xl font-black font-mono text-amber-900 mt-1">{highCount}</div>
              </div>
              <div className="p-3 bg-slate-100 border border-slate-200 rounded-xl">
                <div className="text-xs font-bold text-slate-700">عادي (Normal)</div>
                <div className="text-xl font-black font-mono text-slate-800 mt-1">{normalCount}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            إغلاق النافذة
          </button>
        </div>
      </div>
    </div>
  );
};
