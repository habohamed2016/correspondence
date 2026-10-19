import React, { useState } from 'react';
import {
  Lock,
  KeyRound,
  Eye,
  EyeOff,
  ShieldCheck,
  AlertCircle,
  X,
  Loader2,
} from 'lucide-react';
import { SarLogo } from './SarLogo';

interface PasscodeGateModalProps {
  currentLang?: 'ar' | 'en';
  savedPasscode: string;
  onAuthenticated: () => void;
}

export const PasscodeGateModal: React.FC<PasscodeGateModalProps> = ({
  currentLang = 'ar',
  savedPasscode,
  onAuthenticated,
}) => {
  const [inputCode, setInputCode] = useState('');
  const [hasError, setHasError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const isEn = currentLang === 'en';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCode.trim()) return;

    setIsVerifying(true);
    setTimeout(() => {
      if (inputCode === savedPasscode) {
        setHasError(false);
        onAuthenticated();
      } else {
        setHasError(true);
        setIsVerifying(false);
      }
    }, 200);
  };

  return (
    <div
      dir={isEn ? 'ltr' : 'rtl'}
      className="fixed inset-0 z-50 bg-slate-900/95 backdrop-blur-md flex items-center justify-center p-4"
    >
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Banner */}
        <div className="bg-gradient-to-r from-[#00707b] to-[#004e56] p-6 text-white text-center relative">
          <div className="flex justify-center mb-3">
            <div className="bg-white/10 backdrop-blur-xs p-2.5 rounded-2xl border border-white/20">
              <SarLogo variant="white" layout="horizontal" size="md" />
            </div>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-xs font-semibold backdrop-blur-xs mb-2">
            <Lock className="w-3.5 h-3.5 text-amber-300" />
            <span>{isEn ? 'Protected System Access' : 'منظومة محمية برمز سري'}</span>
          </div>
          <h2 className="text-lg sm:text-xl font-black leading-snug">
            {isEn
              ? 'Official Correspondence Log - Maintenance Department for HHR &MMMP'
              : 'سجل المراسلات والخطابات الرسمية لقسم الصيانة لقطار الحرمين والمشاعر المقدسة'}
          </h2>
          <p className="text-xs text-teal-100/90 mt-1">
            {isEn
              ? 'Please enter the access passcode to view or manage correspondence records'
              : 'يرجى إدخال الرقم السري المعتمد للوصول إلى السجل وإدارته (الافتراضي: 1234)'}
          </p>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">
              {isEn ? 'Access Passcode / PIN' : 'الرقم السري للدخول'}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <KeyRound className="w-4 h-4 text-slate-400" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={inputCode}
                onChange={(e) => {
                  setInputCode(e.target.value);
                  if (hasError) setHasError(false);
                }}
                autoFocus
                placeholder={isEn ? 'Enter passcode (Default: 1234)...' : 'أدخل الرقم السري (الافتراضي: 1234)...'}
                className={`w-full pl-10 pr-11 py-3 text-center text-lg font-mono font-bold tracking-wider rounded-xl border bg-slate-50 focus:bg-white transition-all outline-none ${
                  hasError
                    ? 'border-rose-400 focus:ring-3 focus:ring-rose-200 text-rose-900 bg-rose-50/50'
                    : 'border-slate-300 focus:border-[#00707b] focus:ring-3 focus:ring-[#00707b]/20 text-slate-900'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                title={showPassword ? (isEn ? 'Hide' : 'إخفاء') : isEn ? 'Show' : 'إظهار'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {hasError && (
              <div className="flex items-center gap-1.5 text-xs text-rose-600 font-bold mt-2 animate-in fade-in">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>
                  {isEn
                    ? 'Incorrect passcode. Please try again (Default: 1234).'
                    : 'الرقم السري غير صحيح، يرجى المحاولة مرة أخرى (الافتراضي: 1234).'}
                </span>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={isVerifying || !inputCode.trim()}
            className="w-full py-3 px-4 bg-[#00707b] hover:bg-[#005c66] active:bg-[#004e56] text-white rounded-xl text-sm font-black transition-all shadow-md shadow-[#00707b]/25 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isVerifying ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>{isEn ? 'Verifying...' : 'جاري التحقق...'}</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>{isEn ? 'Unlock System' : 'فتح النظام'}</span>
              </>
            )}
          </button>

          <div className="pt-2 border-t border-slate-100 text-center">
            <p className="text-[11px] text-slate-400 leading-relaxed">
              {isEn
                ? 'Only authorized personnel can access the correspondence log. You can change this passcode at any time from the top toolbar after login.'
                : 'يقتصر الدخول على المفوضين رسمياً. يمكنك تعديل الرقم السري متى أردت من الشريط العلوي بعد الدخول.'}
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

interface ChangePasscodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLang?: 'ar' | 'en';
  currentPasscode: string;
  onUpdatePasscode: (newPass: string) => void;
  showToast: (msg: string) => void;
}

export const ChangePasscodeModal: React.FC<ChangePasscodeModalProps> = ({
  isOpen,
  onClose,
  currentLang = 'ar',
  currentPasscode,
  onUpdatePasscode,
  showToast,
}) => {
  const [oldPass, setOldPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const isEn = currentLang === 'en';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (oldPass !== currentPasscode) {
      setErrorMessage(isEn ? 'The current passcode is incorrect.' : 'الرقم السري الحالي غير صحيح.');
      return;
    }
    if (!newPass.trim()) {
      setErrorMessage(isEn ? 'Please enter a valid new passcode.' : 'يرجى إدخال رقم سري جديد.');
      return;
    }
    if (newPass.length < 3) {
      setErrorMessage(
        isEn ? 'Passcode should be at least 3 characters.' : 'يجب ألا يقل الرقم السري عن 3 خانات.'
      );
      return;
    }
    if (newPass !== confirmPass) {
      setErrorMessage(isEn ? 'New passcodes do not match.' : 'الرقم السري الجديد غير متطابق.');
      return;
    }

    onUpdatePasscode(newPass);
    showToast(isEn ? 'Passcode updated successfully!' : 'تم تحديث الرقم السري بنجاح!');
    setOldPass('');
    setNewPass('');
    setConfirmPass('');
    onClose();
  };

  return (
    <div
      dir={isEn ? 'ltr' : 'rtl'}
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
    >
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-teal-500/20 text-[#00a2b0] border border-teal-500/30">
              <KeyRound className="w-5 h-5 text-teal-400" />
            </div>
            <div>
              <h3 className="text-base font-black">
                {isEn ? 'Security Settings' : 'إعدادات الأمان والرقم السري'}
              </h3>
              <p className="text-xs text-slate-400">
                {isEn ? 'Change access passcode' : 'تعديل الرقم السري لحماية السجل'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {isEn ? 'Current Passcode' : 'الرقم السري الحالي'}
            </label>
            <input
              type="password"
              required
              value={oldPass}
              onChange={(e) => setOldPass(e.target.value)}
              placeholder="••••"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-mono focus:outline-none focus:border-[#00707b]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {isEn ? 'New Passcode' : 'الرقم السري الجديد'}
            </label>
            <input
              type="password"
              required
              value={newPass}
              onChange={(e) => setNewPass(e.target.value)}
              placeholder="••••"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-mono focus:outline-none focus:border-[#00707b]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {isEn ? 'Confirm New Passcode' : 'تأكيد الرقم السري الجديد'}
            </label>
            <input
              type="password"
              required
              value={confirmPass}
              onChange={(e) => setConfirmPass(e.target.value)}
              placeholder="••••"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-mono focus:outline-none focus:border-[#00707b]"
            />
          </div>

          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-bold flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 text-slate-700 hover:bg-slate-100 rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              {isEn ? 'Cancel' : 'إلغاء'}
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#00707b] hover:bg-[#005c66] text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-[#00707b]/25 cursor-pointer"
            >
              {isEn ? 'Save Passcode' : 'حفظ التحديث'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
