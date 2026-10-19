import React, { useState, useRef } from 'react';
import {
  X,
  FileSpreadsheet,
  Upload,
  Download,
  AlertCircle,
  CheckCircle2,
  FileCheck,
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { Letter, LetterNetwork, LetterDirection, LetterStatus } from '../types/letter';
import { downloadExcelTemplate } from '../utils/excel';

interface ExcelImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (letters: Letter[], mode: 'merge' | 'replace') => void;
  existingLetters: Letter[];
}

export const ExcelImportModal: React.FC<ExcelImportModalProps> = ({
  isOpen,
  onClose,
  onImport,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [parsedLetters, setParsedLetters] = useState<Letter[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [importMode, setImportMode] = useState<'merge' | 'replace'>('merge');
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      processFile(selectedFile);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      processFile(droppedFile);
    }
  };

  const processFile = async (f: File) => {
    setErrorMessage(null);
    setFile(f);
    setIsProcessing(true);

    try {
      const buffer = await f.arrayBuffer();
      const workbook = XLSX.read(buffer, { type: 'array' });
      const firstSheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[firstSheetName];
      const rawData: any[] = XLSX.utils.sheet_to_json(sheet);

      if (!rawData || rawData.length === 0) {
        setErrorMessage('الملف فارغ أو لا يحتوي على صفوف بيانات صالحة.');
        setIsProcessing(false);
        return;
      }

      const mapped: Letter[] = rawData.map((row, idx) => {
        const refNumber =
          row['رقم المرجع (REF)'] ||
          row['رقم المرجع'] ||
          row['المرجع'] ||
          row['REF'] ||
          row['RefNumber'] ||
          `SAR-IMP-${Date.now().toString().slice(-4)}-${idx + 1}`;

        const date =
          row['التاريخ'] ||
          row['تاريخ الخطاب'] ||
          row['Date'] ||
          new Date().toISOString().split('T')[0];

        const rawNetwork = (row['الشبكة'] || row['الشبكة التابعة'] || row['Network'] || 'TMO')
          .toString()
          .toUpperCase();
        let net: LetterNetwork = 'TMO';
        if (rawNetwork.includes('INFRA') || rawNetwork.includes('FM')) net = 'INFRA &FM';
        else if (rawNetwork.includes('SYSTEM') || rawNetwork.includes('أنظمة') || rawNetwork.includes('نظام')) net = 'SYSTEM';
        else if (rawNetwork.includes('MMMP') || rawNetwork.includes('مشاعر')) net = 'MMMP';
        else if (rawNetwork.includes('TMO')) net = 'TMO';

        const rawDirection = (row['النوع'] || row['نوع المراسلة'] || row['Direction'] || 'IN')
          .toString()
          .toUpperCase();
        let dir: LetterDirection = 'IN';
        if (rawDirection.includes('OUT') || rawDirection.includes('صادر')) dir = 'OUT';

        const subject = row['موضوع الخطاب'] || row['الموضوع'] || row['Subject'] || 'بدون موضوع';
        const sender = row['الجهة المرسلة'] || row['المرسل'] || row['من'] || row['Sender'] || '';
        const recipient = row['الجهة المستلمة'] || row['المستلم'] || row['إلى'] || row['Recipient'] || '';

        const rawStatus = (row['الحالة'] || row['Status'] || 'OPEN').toString().toUpperCase();
        let status: LetterStatus = 'OPEN';
        if (rawStatus.includes('CLOSED') || rawStatus.includes('مغلق') || rawStatus.includes('منتهي')) {
          status = 'CLOSED';
        } else if (rawStatus.includes('REVIEW') || rawStatus.includes('مراجعة') || rawStatus.includes('دراسة')) {
          status = 'UNDER_REVIEW';
        }

        const rawRequiresReply = (
          row['مطلوب رد؟'] ||
          row['مطلوب رد'] ||
          row['RequiresReply'] ||
          ''
        ).toString().toLowerCase();
        const requiresReply =
          rawRequiresReply.includes('نعم') ||
          rawRequiresReply.includes('yes') ||
          rawRequiresReply === 'true' ||
          rawRequiresReply === '1';

        const replyDeadline = row['الموعد النهائي للرد'] || row['موعد الرد'] || row['ReplyDeadline'] || '';
        const notes = row['الملاحظات'] || row['ملاحظات'] || row['Notes'] || '';

        return {
          id: `sar-imp-${Date.now()}-${idx}-${Math.random().toString(36).substring(2, 6)}`,
          refNumber: String(refNumber).trim(),
          date: String(date).trim(),
          network: net,
          direction: dir,
          subject: String(subject).trim(),
          sender: String(sender).trim(),
          recipient: String(recipient).trim(),
          status,
          requiresReply,
          replyDeadline: String(replyDeadline).trim(),
          notes: String(notes).trim(),
          priority: 'NORMAL',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
      });

      setParsedLetters(mapped);
    } catch (err) {
      console.error('Error reading excel file:', err);
      setErrorMessage('حدث خطأ أثناء قراءة ملف الإكسل. يرجى التأكد من صيغة الملف (.xlsx أو .csv).');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConfirmImport = () => {
    if (parsedLetters.length === 0) return;
    onImport(parsedLetters, importMode);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div
        className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 leading-tight">
                استيراد سجل الخطابات من ملف إكسل
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Import Correspondence Log from Excel (.xlsx, .xls, .csv)
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
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* Download Template Banner */}
          <div className="p-4 bg-emerald-50/70 rounded-2xl border border-emerald-200 flex items-center justify-between gap-3">
            <div>
              <div className="text-xs font-bold text-emerald-900">تحميل النموذج المعتمد للاستيراد:</div>
              <div className="text-[11px] text-emerald-700 mt-0.5">
                يمكنك تحميل ملف إكسل فارغ جاهز بالأعمدة المطابقة للسجل
              </div>
            </div>
            <button
              type="button"
              onClick={downloadExcelTemplate}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shrink-0 shadow-xs"
            >
              <Download className="w-4 h-4" />
              <span>تحميل النموذج</span>
            </button>
          </div>

          {/* Upload Dropzone */}
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-slate-300 hover:border-[#00707b] rounded-2xl p-6 text-center cursor-pointer transition-colors bg-slate-50/50 hover:bg-teal-50/20"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={handleFileChange}
              className="hidden"
            />
            <div className="w-12 h-12 rounded-2xl bg-teal-50 text-[#00707b] flex items-center justify-center mx-auto mb-3 border border-[#00707b]/20">
              <Upload className="w-6 h-6" />
            </div>
            <div className="text-sm font-bold text-slate-800">
              {file ? file.name : 'اسحب ملف الإكسل هنا، أو انقر للاختيار من جهازك'}
            </div>
            <div className="text-xs text-slate-400 mt-1">
              يدعم ملفات .xlsx و .xls و .csv
            </div>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Parsed Preview */}
          {parsedLetters.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                <span className="flex items-center gap-1.5 text-emerald-700">
                  <CheckCircle2 className="w-4 h-4" />
                  تمت قراءة {parsedLetters.length} خطاب بنجاح من الملف
                </span>
              </div>

              {/* Import Mode Radio */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs flex items-center gap-6">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-800">
                  <input
                    type="radio"
                    name="importMode"
                    value="merge"
                    checked={importMode === 'merge'}
                    onChange={() => setImportMode('merge')}
                    className="text-[#00707b] focus:ring-[#00707b]"
                  />
                  <span>دمج وتحديث (دمج الخطابات الجديدة بالسجل الحالي)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-800">
                  <input
                    type="radio"
                    name="importMode"
                    value="replace"
                    checked={importMode === 'replace'}
                    onChange={() => setImportMode('replace')}
                    className="text-[#00707b] focus:ring-[#00707b]"
                  />
                  <span>استبدال كامل (حذف السجل الحالي واستبداله بالملف)</span>
                </label>
              </div>

              {/* Sample preview table */}
              <div className="max-h-48 overflow-y-auto border border-slate-200 rounded-xl">
                <table className="w-full text-xs text-right">
                  <thead className="bg-slate-100 text-slate-600 font-bold sticky top-0">
                    <tr>
                      <th className="p-2">رقم المرجع</th>
                      <th className="p-2">التاريخ</th>
                      <th className="p-2">الشبكة</th>
                      <th className="p-2">النوع</th>
                      <th className="p-2">الموضوع</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {parsedLetters.slice(0, 5).map((l, idx) => (
                      <tr key={idx}>
                        <td className="p-2 font-mono font-bold text-[#00707b]">{l.refNumber}</td>
                        <td className="p-2 font-mono">{l.date}</td>
                        <td className="p-2">{l.network}</td>
                        <td className="p-2">{l.direction === 'IN' ? 'وارد' : 'صادر'}</td>
                        <td className="p-2 truncate max-w-[200px]">{l.subject}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {parsedLetters.length > 5 && (
                <div className="text-[11px] text-slate-400 text-center">
                  + {parsedLetters.length - 5} معاملات أخرى...
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
          >
            إلغاء
          </button>
          <button
            type="button"
            disabled={parsedLetters.length === 0 || isProcessing}
            onClick={handleConfirmImport}
            className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-emerald-700/25 cursor-pointer disabled:opacity-50"
          >
            تأكيد استيراد ({parsedLetters.length}) خطاب
          </button>
        </div>
      </div>
    </div>
  );
};
