import * as XLSX from 'xlsx';
import { Letter } from '../types/letter';

export function formatNetworkName(net: string): string {
  switch (net) {
    case 'TMO':
      return 'TMO';
    case 'INFRA &FM':
    case 'INFRA & FM':
      return 'INFRA &FM';
    case 'SYSTEM':
      return 'SYSTEM';
    case 'MMMP':
      return 'MMMP';
    default:
      return net;
  }
}

export function formatDirectionName(dir: string): string {
  return dir === 'IN' ? 'وارد (In-Coming)' : 'صادر (Out-Going)';
}

export function formatStatusName(status: string): string {
  switch (status) {
    case 'OPEN':
      return 'مفتوح / جاري المتابعة';
    case 'CLOSED':
      return 'مغلق ومكتمل';
    case 'UNDER_REVIEW':
      return 'تحت المراجعة والدراسة';
    default:
      return status;
  }
}

export function exportLettersToExcel(letters: Letter[]): void {
  const data = letters.map((l, index) => ({
    'م': index + 1,
    'رقم المرجع (REF)': l.refNumber,
    'التاريخ': l.date,
    'الشبكة': formatNetworkName(l.network),
    'نوع المراسلة': formatDirectionName(l.direction),
    'موضوع الخطاب': l.subject,
    'الجهة المرسلة': l.sender,
    'الجهة المستلمة': l.recipient,
    'الحالة': formatStatusName(l.status),
    'مطلوب رد؟': l.requiresReply ? 'نعم' : 'لا',
    'الموعد النهائي للرد': l.replyDeadline || '—',
    'تصعيد': l.isEscalated ? 'مُصعَّدة ⚠️' : 'عادي',
    'سبب التصعيد': l.escalationReason || '—',
    'الأولوية': l.priority === 'URGENT' ? 'عاجل جداً' : l.priority === 'HIGH' ? 'مهم' : 'عادي',
    'الملاحظات': l.notes || '—',
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);
  worksheet['!cols'] = [
    { wch: 5 },
    { wch: 22 },
    { wch: 14 },
    { wch: 20 },
    { wch: 18 },
    { wch: 45 },
    { wch: 28 },
    { wch: 28 },
    { wch: 22 },
    { wch: 12 },
    { wch: 16 },
    { wch: 14 },
    { wch: 30 },
    { wch: 12 },
    { wch: 40 },
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'سجل الخطابات');
  const filename = `SAR_Letters_Register_${new Date().toISOString().split('T')[0]}.xlsx`;
  XLSX.writeFile(workbook, filename);
}

export function downloadExcelTemplate(): void {
  const sample = [
    {
      'رقم المرجع': 'SAR-CR-2026-9901',
      'التاريخ': '2026-09-08',
      'الشبكة (TMO / INFRA &FM / SYSTEM / MMMP)': 'TMO',
      'النوع (وارد / صادر)': 'وارد',
      'موضوع الخطاب': 'مثال: طلب تقرير الفحص الفني لأنظمة الإشارات',
      'الجهة المرسلة': 'إدارة التشغيل والصيانة',
      'الجهة المستلمة': 'إدارة المشاريع',
      'الحالة (مفتوح / مغلق / تحت المراجعة)': 'مفتوح',
      'مطلوب رد (نعم / لا)': 'نعم',
      'موعد الرد (YYYY-MM-DD)': '2026-09-20',
      'الملاحظات': 'ملاحظة توضيحية اختيارية',
    },
  ];

  const worksheet = XLSX.utils.json_to_sheet(sample);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'نموذج استيراد الخطابات');
  XLSX.writeFile(workbook, 'SAR_Letters_Import_Template.xlsx');
}
