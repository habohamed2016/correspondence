import React, { useState } from 'react';
import {
  Eye,
  Edit2,
  Trash2,
  Flame,
  Paperclip,
  Clock,
  PlusCircle,
  FileSpreadsheet,
  Copy,
  Check,
} from 'lucide-react';
import { Letter } from '../types/letter';
import { formatNetworkName, formatDirectionName, formatStatusName } from '../utils/excel';

interface LetterTableProps {
  letters: Letter[];
  onView: (letter: Letter) => void;
  onEdit: (letter: Letter) => void;
  onDelete: (id: string) => void;
  onToggleEscalate: (letter: Letter) => void;
  onAddClick: () => void;
  onImportClick: () => void;
}

export const LetterTable: React.FC<LetterTableProps> = ({
  letters,
  onView,
  onEdit,
  onDelete,
  onToggleEscalate,
  onAddClick,
  onImportClick,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyRef = (e: React.MouseEvent, refNumber: string, id: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(refNumber);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const renderNetworkBadge = (network: string) => {
    switch (network) {
      case 'TMO':
        return (
          <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-teal-50 text-[#00707b] border border-[#00707b]/25 whitespace-nowrap">
            TMO
          </span>
        );
      case 'INFRA &FM':
      case 'INFRA & FM':
        return (
          <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 whitespace-nowrap">
            INFRA &FM
          </span>
        );
      case 'SYSTEM':
        return (
          <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-cyan-50 text-cyan-800 border border-cyan-200 whitespace-nowrap">
            SYSTEM
          </span>
        );
      case 'MMMP':
        return (
          <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200 whitespace-nowrap">
            MMMP
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-700">
            {network}
          </span>
        );
    }
  };

  const renderDirectionBadge = (dir: string) => {
    return dir === 'IN' ? (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200/80 whitespace-nowrap">
        <span className="w-2 h-2 rounded-full bg-blue-600"></span>
        وارد (In)
      </span>
    ) : (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-orange-50 text-orange-700 border border-orange-200/80 whitespace-nowrap">
        <span className="w-2 h-2 rounded-full bg-orange-500"></span>
        صادر (Out)
      </span>
    );
  };

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'OPEN':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200 whitespace-nowrap">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
            مفتوح / للمتابعة
          </span>
        );
      case 'CLOSED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 whitespace-nowrap">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            مغلق ومكتمل
          </span>
        );
      case 'UNDER_REVIEW':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-800 border border-blue-200 whitespace-nowrap">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
            تحت المراجعة
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded text-xs bg-slate-100 text-slate-700">
            {status}
          </span>
        );
    }
  };

  const renderPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'URGENT':
        return (
          <span className="px-2 py-0.5 rounded-md text-[11px] font-black bg-rose-100 text-rose-800 border border-rose-300 whitespace-nowrap">
            عاجل جداً
          </span>
        );
      case 'HIGH':
        return (
          <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-200 whitespace-nowrap">
            مهم
          </span>
        );
      case 'NORMAL':
      default:
        return (
          <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 text-slate-600 whitespace-nowrap">
            عادي
          </span>
        );
    }
  };

  if (letters.length === 0) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center shadow-xs">
        <div className="w-16 h-16 rounded-2xl bg-teal-50 text-[#00707b] flex items-center justify-center mx-auto mb-4 border border-[#00707b]/20">
          <Clock className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-black text-slate-900 mb-1">
          سجل المراسلات فارغ وجاهز لتسجيل الخطابات
        </h3>
        <p className="text-sm text-slate-500 max-w-md mx-auto mb-6">
          لم يتم العثور على خطابات مطابقة لخيارات البحث أو الفلترة. يمكنك تسجيل خطاب جديد أو استيراد ملف إكسل.
        </p>
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={onAddClick}
            type="button"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#00707b] hover:bg-[#005c66] text-white rounded-xl text-sm font-bold shadow-md shadow-[#00707b]/25 transition-all cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>(Log Letter) إضافة أول خطاب</span>
          </button>
          <button
            onClick={onImportClick}
            type="button"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-bold transition-colors cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>استيراد ملف إكسل</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
      {/* Top action header for table */}
      <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#00707b]"></span>
          <h2 className="text-sm sm:text-base font-black text-slate-900">
            جدول المعاملات والمراسلات المسجلة ({letters.length})
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onImportClick}
            type="button"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-300 hover:bg-white bg-slate-100 text-slate-700 text-xs font-bold transition-colors cursor-pointer shadow-2xs"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
            <span>استيراد إكسل</span>
          </button>
          <button
            onClick={onAddClick}
            type="button"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#00707b] hover:bg-[#005c66] text-white text-xs font-bold transition-all cursor-pointer shadow-sm shadow-[#00707b]/20"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>إضافة خطاب جديد</span>
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table id="letters-main-table" className="w-full text-right text-xs">
          <thead className="bg-slate-50/80 text-slate-500 font-bold border-b border-slate-200 select-none">
            <tr>
              <th className="py-3.5 px-4 text-center w-12">#</th>
              <th className="py-3.5 px-4">رقم المرجع (Ref No)</th>
              <th className="py-3.5 px-4">التاريخ</th>
              <th className="py-3.5 px-4">الشبكة</th>
              <th className="py-3.5 px-4">نوع المراسلة</th>
              <th className="py-3.5 px-4 min-w-[240px]">موضوع الخطاب / البيان</th>
              <th className="py-3.5 px-4 min-w-[140px]">الجهة المرسلة</th>
              <th className="py-3.5 px-4 min-w-[140px]">الجهة المستلمة</th>
              <th className="py-3.5 px-4">الأولوية</th>
              <th className="py-3.5 px-4">الحالة</th>
              <th className="py-3.5 px-4">المتابعة والرد</th>
              <th className="py-3.5 px-4 text-center">إجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {letters.map((letter, idx) => {
              const isOverdue =
                letter.requiresReply &&
                letter.status !== 'CLOSED' &&
                letter.replyDeadline &&
                new Date(letter.replyDeadline) < new Date();

              return (
                <tr
                  key={letter.id}
                  onClick={() => onView(letter)}
                  className={`hover:bg-teal-50/40 transition-colors cursor-pointer group ${
                    letter.isEscalated ? 'bg-red-50/30' : ''
                  }`}
                >
                  <td className="py-3 px-4 text-center text-slate-400 font-mono text-[11px]">
                    {idx + 1}
                  </td>

                  {/* Ref Number with Copy button */}
                  <td className="py-3 px-4 whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono font-bold text-[#00707b] group-hover:underline">
                        {letter.refNumber}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => handleCopyRef(e, letter.refNumber, letter.id)}
                        className="p-1 rounded-md text-slate-300 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                        title="نسخ رقم المرجع"
                      >
                        {copiedId === letter.id ? (
                          <Check className="w-3 h-3 text-emerald-600" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </button>
                    </div>
                  </td>

                  {/* Date */}
                  <td className="py-3 px-4 whitespace-nowrap text-slate-600 font-mono text-[11px]">
                    {letter.date}
                  </td>

                  {/* Network */}
                  <td className="py-3 px-4 whitespace-nowrap">
                    {renderNetworkBadge(letter.network)}
                  </td>

                  {/* Direction */}
                  <td className="py-3 px-4 whitespace-nowrap">
                    {renderDirectionBadge(letter.direction)}
                  </td>

                  {/* Subject */}
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-900 line-clamp-2 leading-relaxed">
                      {letter.subject}
                    </div>
                    {letter.notes && (
                      <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                        {letter.notes}
                      </div>
                    )}
                  </td>

                  {/* Sender */}
                  <td className="py-3 px-4 text-slate-700 font-medium whitespace-nowrap">
                    <div className="max-w-[160px] truncate" title={letter.sender}>
                      {letter.sender || '—'}
                    </div>
                  </td>

                  {/* Recipient */}
                  <td className="py-3 px-4 text-slate-700 font-medium whitespace-nowrap">
                    <div className="max-w-[160px] truncate" title={letter.recipient}>
                      {letter.recipient || '—'}
                    </div>
                  </td>

                  {/* Priority */}
                  <td className="py-3 px-4 whitespace-nowrap">
                    {renderPriorityBadge(letter.priority)}
                  </td>

                  {/* Status */}
                  <td className="py-3 px-4 whitespace-nowrap">
                    {renderStatusBadge(letter.status)}
                  </td>

                  {/* Reply / Escalation tracking */}
                  <td className="py-3 px-4 whitespace-nowrap">
                    {letter.isEscalated && (
                      <div className="inline-flex items-center gap-1 text-[11px] font-black text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200 mb-1">
                        <Flame className="w-3 h-3 fill-rose-600 text-rose-600" />
                        <span>مُصعّدة ⚠️</span>
                      </div>
                    )}
                    {letter.requiresReply ? (
                      letter.status === 'CLOSED' ? (
                        <div className="text-[11px] text-emerald-600 font-bold">
                          تم الرد والإغلاق
                        </div>
                      ) : (
                        <div className="flex flex-col">
                          <span
                            className={`text-[11px] font-bold ${
                              isOverdue ? 'text-red-600' : 'text-slate-600'
                            }`}
                          >
                            موعد الرد: {letter.replyDeadline || 'مفتوح'}
                          </span>
                          {isOverdue && (
                            <span className="text-[10px] font-black text-red-600 animate-pulse">
                              (متأخر عن الموعد!)
                            </span>
                          )}
                        </div>
                      )
                    ) : (
                      <span className="text-slate-400 text-[11px]">للعلم والإحاطة</span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-4 text-center whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                    <div className="inline-flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => onView(letter)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-[#00707b] hover:bg-teal-50 transition-colors"
                        title="عرض التفاصيل"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onEdit(letter)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-amber-600 hover:bg-amber-50 transition-colors"
                        title="تعديل الخطاب"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onToggleEscalate(letter)}
                        className={`p-1.5 rounded-lg transition-colors ${
                          letter.isEscalated
                            ? 'text-rose-600 bg-rose-50'
                            : 'text-slate-400 hover:text-rose-600 hover:bg-rose-50'
                        }`}
                        title={letter.isEscalated ? 'إلغاء التصعيد' : 'تصعيد المعاملة'}
                      >
                        <Flame className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(letter.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        title="حذف من السجل"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
