import React from 'react';
import {
  FileText,
  Inbox,
  Send,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Flame,
} from 'lucide-react';
import { Letter, FilterState } from '../types/letter';

interface StatCardsProps {
  letters: Letter[];
  activeTab: FilterState['quickTab'];
  onSelectTab: (tab: FilterState['quickTab']) => void;
}

export const StatCards: React.FC<StatCardsProps> = ({
  letters,
  activeTab,
  onSelectTab,
}) => {
  const total = letters.length;
  const inCount = letters.filter((l) => l.direction === 'IN').length;
  const outCount = letters.filter((l) => l.direction === 'OUT').length;
  const openCount = letters.filter((l) => l.status === 'OPEN' || l.status === 'UNDER_REVIEW').length;
  const closedCount = letters.filter((l) => l.status === 'CLOSED').length;
  const needReplyCount = letters.filter((l) => l.requiresReply && l.status !== 'CLOSED').length;
  const escalatedCount = letters.filter((l) => l.isEscalated).length;

  const inPct = total > 0 ? Math.round((inCount / total) * 100) : 0;
  const outPct = total > 0 ? Math.round((outCount / total) * 100) : 0;

  const cards: Array<{
    id: FilterState['quickTab'];
    title: string;
    subTitle: string;
    count: number;
    meta: string;
    icon: React.ComponentType<{ className?: string }>;
    color: string;
    activeBorder: string;
    inactiveBorder: string;
    iconBg: string;
  }> = [
    {
      id: 'TOTAL',
      title: 'إجمالي الخطابات',
      subTitle: 'Total Letters',
      count: total,
      meta: 'كافة المعاملات بالسجل',
      icon: FileText,
      color: 'text-slate-700',
      activeBorder: 'border-slate-800 bg-slate-900 text-white shadow-md',
      inactiveBorder: 'border-slate-200 bg-white hover:border-slate-400 text-slate-800',
      iconBg: 'bg-slate-100 text-slate-700',
    },
    {
      id: 'IN',
      title: 'الخطابات الواردة',
      subTitle: 'In-Coming',
      count: inCount,
      meta: `${inPct}% من إجمالي السجل`,
      icon: Inbox,
      color: 'text-blue-700',
      activeBorder: 'border-blue-700 bg-blue-900 text-white shadow-md',
      inactiveBorder: 'border-blue-100 bg-white hover:border-blue-300 text-slate-800',
      iconBg: 'bg-blue-50 text-blue-700',
    },
    {
      id: 'OUT',
      title: 'الخطابات الصادرة',
      subTitle: 'Out-Going',
      count: outCount,
      meta: `${outPct}% من إجمالي السجل`,
      icon: Send,
      color: 'text-orange-700',
      activeBorder: 'border-orange-600 bg-orange-950 text-white shadow-md',
      inactiveBorder: 'border-orange-100 bg-white hover:border-orange-300 text-slate-800',
      iconBg: 'bg-orange-50 text-orange-700',
    },
    {
      id: 'OPEN',
      title: 'قيد المتابعة / مفتوح',
      subTitle: 'Open / In-Progress',
      count: openCount,
      meta: 'تحتاج إجراء أو مراجعة',
      icon: Clock,
      color: 'text-amber-700',
      activeBorder: 'border-amber-700 bg-amber-950 text-white shadow-md',
      inactiveBorder: 'border-amber-100 bg-white hover:border-amber-300 text-slate-800',
      iconBg: 'bg-amber-50 text-amber-700',
    },
    {
      id: 'CLOSED',
      title: 'مغلقة ومكتملة',
      subTitle: 'Closed / Completed',
      count: closedCount,
      meta: 'تم الرد والإغلاق النهائي',
      icon: CheckCircle2,
      color: 'text-emerald-700',
      activeBorder: 'border-emerald-700 bg-emerald-950 text-white shadow-md',
      inactiveBorder: 'border-emerald-100 bg-white hover:border-emerald-300 text-slate-800',
      iconBg: 'bg-emerald-50 text-emerald-700',
    },
    {
      id: 'NEED_REPLY',
      title: 'تتطلب رداً رسمياً',
      subTitle: 'Action Required',
      count: needReplyCount,
      meta: 'بانتظار خطاب الرد',
      icon: AlertTriangle,
      color: 'text-rose-700',
      activeBorder: 'border-rose-700 bg-rose-950 text-white shadow-md',
      inactiveBorder: 'border-rose-100 bg-white hover:border-rose-300 text-slate-800',
      iconBg: 'bg-rose-50 text-rose-700',
    },
    {
      id: 'ESCALATED',
      title: 'معاملات مُصعّدة',
      subTitle: 'Escalated Items',
      count: escalatedCount,
      meta: 'تحتاج تدخلاً عاجلاً',
      icon: Flame,
      color: 'text-red-600',
      activeBorder: 'border-red-600 bg-red-950 text-white shadow-md',
      inactiveBorder: 'border-red-200 bg-red-50/40 hover:border-red-300 text-slate-800',
      iconBg: 'bg-red-100 text-red-600',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3 mb-6">
      {cards.map((card) => {
        const Icon = card.icon;
        const isActive = activeTab === card.id;

        return (
          <button
            key={card.id}
            type="button"
            onClick={() => onSelectTab(card.id)}
            className={`text-right p-3.5 rounded-2xl border transition-all duration-150 cursor-pointer text-start flex flex-col justify-between ${
              isActive ? card.activeBorder : card.inactiveBorder
            }`}
          >
            <div className="flex items-center justify-between gap-1 w-full mb-2">
              <div
                className={`p-1.5 rounded-xl transition-colors ${
                  isActive ? 'bg-white/20 text-white' : card.iconBg
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>
              <span className="text-2xl font-black font-mono tracking-tight">{card.count}</span>
            </div>

            <div>
              <div className="text-xs font-black leading-tight line-clamp-1">{card.title}</div>
              <div
                className={`text-[10px] font-medium leading-tight ${
                  isActive ? 'text-white/80' : 'text-slate-400'
                }`}
              >
                {card.subTitle}
              </div>
            </div>

            <div
              className={`text-[9.5px] font-medium mt-1.5 pt-1.5 border-t border-current/10 ${
                isActive ? 'text-white/70' : 'text-slate-400'
              }`}
            >
              {card.meta}
            </div>
          </button>
        );
      })}
    </div>
  );
};
