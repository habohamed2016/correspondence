import React, { useState } from 'react';
import {
  X,
  Copy,
  Check,
  Edit2,
  Trash2,
  Flame,
  Printer,
  Calendar,
  Building,
  AlertTriangle,
  Paperclip,
  CheckCircle2,
  Clock,
  FileCheck,
} from 'lucide-react';
import { Letter } from '../types/letter';
import { formatNetworkName, formatDirectionName, formatStatusName } from '../utils/excel';

interface LetterDetailModalProps {
  letter: Letter | null;
  onClose: () => void;
  onEdit: (letter: Letter) => void;
  onDelete: (id: string) => void;
  onToggleEscalate: (letter: Letter) => void;
}

export const LetterDetailModal: React.FC<LetterDetailModalProps> = ({
  letter,
  onClose,
  onEdit,
  onDelete,
  onToggleEscalate,
}) => {
  const [copied, setCopied] = useState(false);

  if (!letter) return null;

  const handleCopySummary = () => {
    const text = `سجل المراسلات والخطابات الرسمية لقسم الصيانة لقطار الحرمين والمشاعر المقدسة - SAR
رقم المرجع: ${letter.refNumber}
التاريخ: ${letter.date}
الشبكة: ${formatNetworkName(letter.network)}
نوع المعاملة: ${formatDirectionName(letter.direction)}
الموضوع: ${letter.subject}
الجهة المرسلة: ${letter.sender}
الجهة المستلمة: ${letter.recipient}
الحالة: ${formatStatusName(letter.status)}
الأولوية: ${letter.priority}
مطلوب رد: ${letter.requiresReply ? `نعم (الموعد: ${letter.replyDeadline || 'غير محدد'})` : 'لا'}
${letter.isEscalated ? `التصعيد: مُصعَّدة ⚠️ (${letter.escalationReason})` : ''}
الملاحظات: ${letter.notes || 'لا يوجد'}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const isOverdue =
    letter.requiresReply &&
    letter.status !== 'CLOSED' &&
    letter.replyDeadline &&
    new Date(letter.replyDeadline) < new Date();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div
        className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150 my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 rounded-t-3xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#00707b] text-white flex items-center justify-center font-bold shadow-xs">
              <FileCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-[#00707b] bg-[#00707b]/10 px-2 py-0.5 rounded-md">
                  {letter.refNumber}
                </span>
                {letter.isEscalated && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-black text-rose-700 bg-rose-100 px-2 py-0.5 rounded-md">
                    <Flame className="w-3 h-3 fill-rose-600 text-rose-600" />
                    مُصعّدة
                  </span>
                )}
              </div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 mt-1 leading-tight">
                بطاقة تفاصيل المعاملة والخطاب
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* Key Badges Bar */}
          <div className="flex flex-wrap items-center gap-2 p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
            <span className="font-bold px-2.5 py-1 rounded-lg bg-teal-100 text-[#00707b]">
              الشبكة: {formatNetworkName(letter.network)}
            </span>
            <span
              className={`font-bold px-2.5 py-1 rounded-lg ${
                letter.direction === 'IN'
                  ? 'bg-blue-100 text-blue-800 border border-blue-200'
                  : 'bg-orange-100 text-orange-800 border border-orange-200'
              }`}
            >
              {formatDirectionName(letter.direction)}
            </span>
            <span
              className={`font-bold px-2.5 py-1 rounded-lg ${
                letter.status === 'CLOSED'
                  ? 'bg-emerald-100 text-emerald-800'
                  : letter.status === 'UNDER_REVIEW'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-amber-100 text-amber-900'
              }`}
            >
              {formatStatusName(letter.status)}
            </span>
            <span
              className={`font-bold px-2.5 py-1 rounded-lg ${
                letter.priority === 'URGENT'
                  ? 'bg-rose-100 text-rose-800'
                  : letter.priority === 'HIGH'
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-slate-200 text-slate-700'
              }`}
            >
              الأولوية:{' '}
              {letter.priority === 'URGENT'
                ? 'عاجل جداً'
                : letter.priority === 'HIGH'
                ? 'مهم'
                : 'عادي'}
            </span>
          </div>

          {/* Subject */}
          <div className="p-4 bg-teal-50/50 rounded-2xl border border-[#00707b]/20">
            <div className="text-xs font-bold text-[#00707b] mb-1">موضوع المعاملة والخطاب:</div>
            <div className="text-base font-black text-slate-900 leading-relaxed">
              {letter.subject}
            </div>
          </div>

          {/* Parties & Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <div className="text-xs font-bold text-slate-500 mb-1">الجهة المرسلة (من):</div>
              <div className="text-sm font-black text-slate-900">{letter.sender || '—'}</div>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <div className="text-xs font-bold text-slate-500 mb-1">الجهة المستلمة (إلى):</div>
              <div className="text-sm font-black text-slate-900">{letter.recipient || '—'}</div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <div className="text-xs font-bold text-slate-500 mb-1">تاريخ الخطاب:</div>
              <div className="text-sm font-mono font-bold text-slate-900">{letter.date}</div>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <div className="text-xs font-bold text-slate-500 mb-1">المرفقات المسجلة:</div>
              <div className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <Paperclip className="w-4 h-4 text-slate-500" />
                <span>{letter.attachmentsCount || 0} وثائق مرفقة</span>
              </div>
            </div>
          </div>

          {/* Action / Reply Deadline status */}
          <div
            className={`p-4 rounded-2xl border ${
              letter.requiresReply
                ? isOverdue
                  ? 'bg-rose-50 border-rose-200'
                  : 'bg-amber-50 border-amber-200'
                : 'bg-slate-50 border-slate-200'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <div className="text-xs font-bold text-slate-700">موقف المتابعة والرد الرسمي:</div>
              {letter.requiresReply ? (
                letter.status === 'CLOSED' ? (
                  <span className="text-xs font-black text-emerald-700 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    تم الرد رسمياً وإغلاق المعاملة
                  </span>
                ) : isOverdue ? (
                  <span className="text-xs font-black text-rose-700 flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    تجاوزت الموعد النهائي المحدد!
                  </span>
                ) : (
                  <span className="text-xs font-bold text-amber-800">
                    بانتظار خطاب الرد الرسمي
                  </span>
                )
              ) : (
                <span className="text-xs text-slate-500">معاملة للعلم والإحاطة (لا تتطلب رداً)</span>
              )}
            </div>

            {letter.requiresReply && (
              <div className="text-xs text-slate-700 font-mono mt-1">
                الموعد النهائي المعتمد للرد:{' '}
                <span className="font-bold">{letter.replyDeadline || 'غير محدد'}</span>
              </div>
            )}
          </div>

          {/* Escalation alert */}
          {letter.isEscalated && (
            <div className="p-4 bg-red-50 rounded-2xl border border-red-300">
              <div className="flex items-center gap-1.5 text-xs font-black text-red-700 mb-1">
                <Flame className="w-4 h-4 fill-red-600 text-red-600" />
                <span>معاملة مُصعّدة رسمياً للمتابعة العاجلة</span>
              </div>
              <p className="text-xs text-red-800 font-medium">
                {letter.escalationReason || 'تم تصعيد هذه المعاملة للمتابعة الإدارية العاجلة.'}
              </p>
            </div>
          )}

          {/* Notes */}
          {letter.notes && (
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <div className="text-xs font-bold text-slate-500 mb-1">ملاحظات وإفادات:</div>
              <p className="text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-wrap">
                {letter.notes}
              </p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 rounded-b-3xl flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleCopySummary}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'تم النسخ' : 'نسخ الملخص'}</span>
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>طباعة</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onToggleEscalate(letter)}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                letter.isEscalated
                  ? 'bg-rose-100 hover:bg-rose-200 text-rose-800 border border-rose-300'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              <Flame className="w-4 h-4 text-rose-600" />
              <span>{letter.isEscalated ? 'إلغاء التصعيد' : 'تصعيد المعاملة'}</span>
            </button>

            <button
              type="button"
              onClick={() => onEdit(letter)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 text-xs font-bold transition-colors cursor-pointer"
            >
              <Edit2 className="w-4 h-4" />
              <span>تعديل</span>
            </button>

            <button
              type="button"
              onClick={() => onDelete(letter.id)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold transition-colors cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
              <span>حذف</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
