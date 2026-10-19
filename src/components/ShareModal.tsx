import React, { useState } from 'react';
import { X, Copy, Check, Share2, Mail, MessageSquare } from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  appUrl?: string;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  appUrl,
}) => {
  const [copied, setCopied] = useState(false);
  const currentUrl = appUrl || window.location.href;

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsApp = () => {
    const text = encodeURIComponent(
      `سجل المراسلات والخطابات الرسمية لقسم الصيانة لقطار الحرمين والمشاعر المقدسة - SAR:\n${currentUrl}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const handleEmail = () => {
    const subject = encodeURIComponent(
      'سجل المراسلات والخطابات الرسمية لقسم الصيانة لقطار الحرمين والمشاعر المقدسة - SAR'
    );
    const body = encodeURIComponent(
      `رابط الوصول إلى نظام سجل المراسلات والخطابات الرسمية لقسم الصيانة لقطار الحرمين والمشاعر المقدسة:\n${currentUrl}`
    );
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div
        className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150 my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 rounded-t-3xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#00707b]/10 text-[#00707b] flex items-center justify-center font-bold">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 leading-tight">
                مشاركة رابط سجل المراسلات
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Share Centralized Correspondence Register
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

        {/* Content */}
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              رابط السجل المباشر:
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={currentUrl}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono text-slate-700 focus:outline-none"
                dir="ltr"
              />
              <button
                onClick={handleCopy}
                type="button"
                className="inline-flex items-center gap-1 px-4 py-2 bg-[#00707b] hover:bg-[#005c66] text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-xs shrink-0"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'تم النسخ' : 'نسخ'}</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              onClick={handleWhatsApp}
              type="button"
              className="flex items-center justify-center gap-2 p-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-2xl text-xs font-bold transition-colors cursor-pointer"
            >
              <MessageSquare className="w-4 h-4 text-emerald-600" />
              <span>واتساب (WhatsApp)</span>
            </button>
            <button
              onClick={handleEmail}
              type="button"
              className="flex items-center justify-center gap-2 p-3 bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 rounded-2xl text-xs font-bold transition-colors cursor-pointer"
            >
              <Mail className="w-4 h-4 text-blue-600" />
              <span>البريد الإلكتروني</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
