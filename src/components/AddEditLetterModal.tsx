import React, { useState, useEffect } from 'react';
import {
  X,
  PlusCircle,
  Edit2,
  FileText,
  Calendar,
  Building,
  AlertCircle,
  Flame,
} from 'lucide-react';
import { Letter, LetterNetwork, LetterDirection, LetterStatus, LetterPriority } from '../types/letter';

interface AddEditLetterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (letter: Letter) => void;
  initialData: Letter | null;
}

export const AddEditLetterModal: React.FC<AddEditLetterModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
}) => {
  const [refNumber, setRefNumber] = useState('');
  const [date, setDate] = useState('');
  const [network, setNetwork] = useState<LetterNetwork>('TMO');
  const [direction, setDirection] = useState<LetterDirection>('IN');
  const [subject, setSubject] = useState('');
  const [sender, setSender] = useState('');
  const [recipient, setRecipient] = useState('');
  const [status, setStatus] = useState<LetterStatus>('OPEN');
  const [requiresReply, setRequiresReply] = useState(false);
  const [replyDeadline, setReplyDeadline] = useState('');
  const [priority, setPriority] = useState<LetterPriority>('NORMAL');
  const [isEscalated, setIsEscalated] = useState(false);
  const [escalationReason, setEscalationReason] = useState('');
  const [notes, setNotes] = useState('');
  const [attachmentsCount, setAttachmentsCount] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const generateAutoRef = (net: string, dir: LetterDirection): string => {
    const year = new Date().getFullYear();
    const rand = Math.floor(1000 + Math.random() * 9000);
    const code = dir === 'IN' ? 'IN' : 'CR';
    const cleanNet = net.replace(/[^A-Za-z0-9]/g, '');
    return `${cleanNet || 'SAR'}-${code}-${year}-${rand}`;
  };

  useEffect(() => {
    if (isOpen) {
      setIsSubmitting(false);
      if (initialData) {
        setRefNumber(initialData.refNumber || '');
        setDate(initialData.date || new Date().toISOString().split('T')[0]);
        setNetwork(initialData.network || 'TMO');
        setDirection(initialData.direction || 'IN');
        setSubject(initialData.subject || '');
        setSender(initialData.sender || '');
        setRecipient(initialData.recipient || '');
        setStatus(initialData.status || 'OPEN');
        setRequiresReply(!!initialData.requiresReply);
        setReplyDeadline(initialData.replyDeadline || '');
        setPriority(initialData.priority || 'NORMAL');
        setIsEscalated(!!initialData.isEscalated);
        setEscalationReason(initialData.escalationReason || '');
        setNotes(initialData.notes || '');
        setAttachmentsCount(initialData.attachmentsCount || 0);
      } else {
        const today = new Date().toISOString().split('T')[0];
        setDate(today);
        setNetwork('TMO');
        setDirection('IN');
        setRefNumber(generateAutoRef('TMO', 'IN'));
        setSubject('');
        setSender('');
        setRecipient('الإدارة العامة للمشاريع والتشغيل');
        setStatus('OPEN');
        setRequiresReply(false);
        setReplyDeadline('');
        setPriority('NORMAL');
        setIsEscalated(false);
        setEscalationReason('');
        setNotes('');
        setAttachmentsCount(1);
      }
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!refNumber.trim() || !subject.trim() || !date) {
      alert('يرجى ملء كافة الحقول الأساسية المطلوبة (رقم المرجع، الموضوع، والتاريخ).');
      return;
    }

    setIsSubmitting(true);

    const updatedLetter: Letter = {
      id: initialData ? initialData.id : `sar-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      refNumber: refNumber.trim(),
      date,
      network,
      direction,
      subject: subject.trim(),
      sender: sender.trim(),
      recipient: recipient.trim(),
      status,
      requiresReply,
      replyDeadline: requiresReply ? replyDeadline : '',
      priority,
      isEscalated,
      escalationReason: isEscalated ? escalationReason.trim() : '',
      notes: notes.trim(),
      attachmentsCount: Number(attachmentsCount) || 0,
      updatedAt: new Date().toISOString(),
      createdAt: initialData?.createdAt || new Date().toISOString(),
    };

    onSave(updatedLetter);
  };

  const senderSuggestions = [
    'الهيئة العامة للنقل (TGA)',
    'تحالف الشعلة (Al Shoula Consortium)',
    'الاستشاري الهندسي العام (دار الهندسة)',
    'شركة سيمنز للنقل (Siemens Mobility)',
    'شركة معادن للذهب ومعادن الأساس',
    'الشركة السعودية للكهرباء (SEC)',
    'المديرية العامة للدفاع المدني',
    'المعهد السعودي التقني للخطوط الحديدية (سرب)',
    'إدارة تشغيل قطار الحرمين السريع',
    'إدارة هندسة السكة والأنظمة - HHR',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div
        className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200 my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 rounded-t-3xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#00707b]/10 text-[#00707b] flex items-center justify-center font-bold">
              {initialData ? <Edit2 className="w-5 h-5" /> : <PlusCircle className="w-5 h-5" />}
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 leading-tight">
                {initialData ? 'تعديل بيانات الخطاب بالسجل' : 'إضافة وتسجيل خطاب جديد في السجل'}
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                {initialData ? 'تحديث السجلات الرسمية' : 'تسجيل وتوثيق المراسلات الصادرة والواردة'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1">
          {/* Ref Number & Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                رقم المرجع الرسمي (Ref Number) <span className="text-rose-500">*</span>
              </label>
              <div className="flex items-center gap-1.5">
                <input
                  type="text"
                  required
                  value={refNumber}
                  onChange={(e) => setRefNumber(e.target.value)}
                  placeholder="SAR-CR-2026-XXXX"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-mono font-bold focus:bg-white focus:outline-none focus:border-[#00707b]"
                  dir="ltr"
                />
                <button
                  type="button"
                  onClick={() => setRefNumber(generateAutoRef(network, direction))}
                  className="px-2.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer transition-colors"
                  title="توليد رقم مرجعي تلقائي"
                >
                  توليد
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                تاريخ الخطاب <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-mono focus:bg-white focus:outline-none focus:border-[#00707b]"
                />
              </div>
            </div>
          </div>

          {/* Network & Direction */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                الشبكة التابعة
              </label>
              <select
                value={network}
                onChange={(e) => {
                  const newNet = e.target.value as LetterNetwork;
                  setNetwork(newNet);
                  if (!initialData) setRefNumber(generateAutoRef(newNet, direction));
                }}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-bold focus:bg-white focus:outline-none focus:border-[#00707b]"
              >
                <option value="TMO">قطاع التشغيل والصيانة (TMO)</option>
                <option value="INFRA &FM">البنية التحتية والمرافق (INFRA &FM)</option>
                <option value="SYSTEM">الأنظمة والإشارات والتحكم (SYSTEM)</option>
                <option value="MMMP">قطار المشاعر المقدسة (MMMP)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                نوع المراسلة (Direction)
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setDirection('IN');
                    if (!initialData) setRefNumber(generateAutoRef(network, 'IN'));
                  }}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    direction === 'IN'
                      ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-100'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-current"></span>
                  <span>وارد (In-Coming)</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setDirection('OUT');
                    if (!initialData) setRefNumber(generateAutoRef(network, 'OUT'));
                  }}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    direction === 'OUT'
                      ? 'bg-orange-600 text-white border-orange-600 shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-100'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-current"></span>
                  <span>صادر (Out-Going)</span>
                </button>
              </div>
            </div>
          </div>

          {/* Subject */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              موضوع الخطاب / البيان الرسمي <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="مثال: اعتماد الخطة التشغيلية لقطارات الشحن لعام 2026/2027"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-bold focus:bg-white focus:outline-none focus:border-[#00707b]"
            />
          </div>

          {/* Sender & Recipient */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                الجهة المرسلة (من)
              </label>
              <input
                type="text"
                value={sender}
                onChange={(e) => setSender(e.target.value)}
                placeholder="اسم الجهة أو الإدارة المرسلة"
                list="senders-list"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-medium focus:bg-white focus:outline-none focus:border-[#00707b]"
              />
              <datalist id="senders-list">
                {senderSuggestions.map((s) => (
                  <option key={s} value={s} />
                ))}
              </datalist>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                الجهة المستلمة (إلى)
              </label>
              <input
                type="text"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="اسم الإدارة أو الجهة المستلمة"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-medium focus:bg-white focus:outline-none focus:border-[#00707b]"
              />
            </div>
          </div>

          {/* Status & Priority */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                حالة المعاملة
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as LetterStatus)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-bold focus:bg-white focus:outline-none focus:border-[#00707b]"
              >
                <option value="OPEN">مفتوح / جاري المتابعة والإجراء</option>
                <option value="UNDER_REVIEW">تحت الدراسة والمراجعة الفنية</option>
                <option value="CLOSED">مغلق ومكتمل نهائياً</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                درجة الأهمية / الأولوية
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as LetterPriority)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-bold focus:bg-white focus:outline-none focus:border-[#00707b]"
              >
                <option value="NORMAL">عادي (Normal)</option>
                <option value="HIGH">مهم (High Priority)</option>
                <option value="URGENT">عاجل جداً (Urgent / Immediate)</option>
              </select>
            </div>
          </div>

          {/* Reply Tracking Box */}
          <div className="p-4 bg-amber-50/60 rounded-2xl border border-amber-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={requiresReply}
                  onChange={(e) => setRequiresReply(e.target.checked)}
                  className="w-4 h-4 text-[#00707b] rounded border-slate-300 focus:ring-[#00707b]"
                />
                <span className="text-xs font-bold text-slate-800">
                  هل يتطلب الخطاب رداً رسمياً؟ (Action / Reply Required)
                </span>
              </label>
            </div>

            {requiresReply && (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  الموعد النهائي للرد (Reply Deadline)
                </label>
                <input
                  type="date"
                  value={replyDeadline}
                  onChange={(e) => setReplyDeadline(e.target.value)}
                  className="w-full px-3.5 py-2 bg-white border border-amber-300 rounded-xl text-xs sm:text-sm font-mono focus:outline-none focus:border-[#00707b]"
                />
              </div>
            )}
          </div>

          {/* Escalation Box */}
          <div className="p-4 bg-red-50/50 rounded-2xl border border-red-200 space-y-3">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isEscalated}
                  onChange={(e) => setIsEscalated(e.target.checked)}
                  className="w-4 h-4 text-red-600 rounded border-slate-300 focus:ring-red-500"
                />
                <span className="text-xs font-bold text-red-800 flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 fill-red-600 text-red-600" />
                  تصعيد المعاملة للمتابعة العاجلة (Escalate)
                </span>
              </label>
            </div>

            {isEscalated && (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  سبب وتفاصيل التصعيد
                </label>
                <input
                  type="text"
                  value={escalationReason}
                  onChange={(e) => setEscalationReason(e.target.value)}
                  placeholder="مثال: تأخر رد المقاول وتأثيره على الجدول الزمني للمشروع"
                  className="w-full px-3.5 py-2 bg-white border border-red-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-red-500"
                />
              </div>
            )}
          </div>

          {/* Notes & Summary */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              ملاحظات وملخص المعاملة (Notes)
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="تفاصيل إضافية، الإجراءات المتخذة، أرقام الإحالات السابقة..."
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm focus:bg-white focus:outline-none focus:border-[#00707b]"
            ></textarea>
          </div>

          {/* Attachments count */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              عدد المرفقات الرسمية (Attachments)
            </label>
            <input
              type="number"
              min={0}
              max={50}
              value={attachmentsCount}
              onChange={(e) => setAttachmentsCount(parseInt(e.target.value) || 0)}
              className="w-32 px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-mono focus:bg-white focus:outline-none focus:border-[#00707b]"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs sm:text-sm font-bold transition-colors cursor-pointer"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-[#00707b] hover:bg-[#005c66] text-white rounded-xl text-xs sm:text-sm font-black transition-all shadow-md shadow-[#00707b]/25 cursor-pointer disabled:opacity-50"
            >
              {initialData ? 'حفظ التعديلات' : 'تسجيل الخطاب في السجل'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
