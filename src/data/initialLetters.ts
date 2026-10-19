import { Letter, LetterNetwork } from '../types/letter';

export const INITIAL_LETTERS: Letter[] = [
  {
    id: 'sar-001',
    refNumber: 'SAR-CR-2026-0412',
    date: '2026-08-28',
    network: 'TMO',
    direction: 'IN',
    category: 'LETTER',
    sender: 'الهيئة العامة للنقل (TGA)',
    recipient: 'الإدارة العامة للمشاريع والتشغيل',
    subject: 'اعتماد الخطة التشغيلية لقطارات الشحن لقطاع الشمال لعام 2026/2027',
    status: 'CLOSED',
    requiresReply: false,
    notes: 'تم استلام الاعتماد وتعميمه على إدارات التشغيل الميداني.',
    attachmentsCount: 2,
    priority: 'HIGH',
    createdAt: '2026-08-28T09:30:00Z',
    updatedAt: '2026-08-29T14:15:00Z'
  },
  {
    id: 'sar-002',
    refNumber: 'HHR-ENG-2026-1089',
    date: '2026-08-30',
    network: 'INFRA &FM',
    direction: 'OUT',
    category: 'LETTER',
    sender: 'إدارة هندسة السكة والأنظمة - HHR',
    recipient: 'تحالف الشعلة (Al Shoula Consortium)',
    subject: 'جدول الصيانة الوقائية لمنظومة الإشارات والاتصالات بمحطة مكة المكرمة',
    status: 'OPEN',
    requiresReply: true,
    replyDeadline: '2026-09-12',
    isEscalated: true,
    escalationReason: 'تأخر رد المقاول على جدول الصيانة وتأثيره المحتمل على العمليات التشغيلية',
    notes: 'بانتظار رد المقاول وتزويدنا بجدول الإغلاقات المعتمد.',
    attachmentsCount: 1,
    priority: 'URGENT',
    createdAt: '2026-08-30T11:00:00Z',
    updatedAt: '2026-08-30T11:00:00Z'
  },
  {
    id: 'sar-003',
    refNumber: 'MMMP-ENG-2026-0054',
    date: '2026-09-01',
    network: 'MMMP',
    direction: 'IN',
    category: 'LETTER',
    sender: 'الاستشاري الهندسي العام (دار الهندسة)',
    recipient: 'مدير مشروع قطار المشاعر المقدسة',
    subject: 'اعتماد التصاميم النهائية لتطوير بوابات الحشود بمحطة منى 3',
    status: 'UNDER_REVIEW',
    requiresReply: true,
    replyDeadline: '2026-09-15',
    notes: 'جاري مراجعة المخططات الهندسية مع فريق السلامة وإدارة الحشود.',
    attachmentsCount: 4,
    priority: 'HIGH',
    createdAt: '2026-09-01T08:15:00Z',
    updatedAt: '2026-09-01T08:15:00Z'
  },
  {
    id: 'sar-004',
    refNumber: 'SAR-GEN-2026-0891',
    date: '2026-09-02',
    network: 'INFRA &FM',
    direction: 'OUT',
    category: 'LETTER',
    sender: 'الإدارة التنفيذية للسلامة والبيئة',
    recipient: 'شركة معادن للذهب ومعادن الأساس',
    subject: 'محضر التنسيق الدوري لخط نقل خام الفوسفات من حزم الجلاميد إلى رأس الخير',
    status: 'OPEN',
    requiresReply: false,
    notes: 'تم إرسال النسخة الموقعة رقمياً عبر نظام المراسلات الإلكتروني.',
    attachmentsCount: 1,
    priority: 'NORMAL',
    createdAt: '2026-09-02T10:00:00Z',
    updatedAt: '2026-09-02T10:00:00Z'
  },
  {
    id: 'sar-005',
    refNumber: 'SAR-SAF-2026-0155',
    date: '2026-09-02',
    network: 'SYSTEM',
    direction: 'IN',
    category: 'LETTER',
    sender: 'شركة سيمنز للنقل (Siemens Mobility)',
    recipient: 'إدارة هندسة الإشارات والتحكم المركزي',
    subject: 'تقرير الفحص الدوري لنظام الحماية الأوتوماتيكية للقطارات (ETCS Level 2)',
    status: 'CLOSED',
    requiresReply: false,
    notes: 'تم التحقق من سلامة أجهزة الإرسال والاستقبال على طول مسار قطار الشمال.',
    attachmentsCount: 3,
    priority: 'HIGH',
    createdAt: '2026-09-02T11:20:00Z',
    updatedAt: '2026-09-02T11:20:00Z'
  },
  {
    id: 'sar-006',
    refNumber: 'HHR-OPS-2026-0342',
    date: '2026-09-03',
    network: 'TMO',
    direction: 'OUT',
    category: 'LETTER',
    sender: 'إدارة تشغيل قطار الحرمين السريع',
    recipient: 'الهيئة العامة للطيران المدني (GACA)',
    subject: 'جدول الرحلات الإضافية لعطلة نهاية الأسبوع بين محطتي مطار الملك عبد العزيز والمدينة المنورة',
    status: 'OPEN',
    requiresReply: false,
    notes: 'تم التنسيق مع إدارة المحطات ومراكز التحكم التشغيلي.',
    attachmentsCount: 2,
    priority: 'NORMAL',
    createdAt: '2026-09-03T09:00:00Z',
    updatedAt: '2026-09-03T09:00:00Z'
  },
  {
    id: 'sar-007',
    refNumber: 'MMMP-MNT-2026-0088',
    date: '2026-09-04',
    network: 'MMMP',
    direction: 'OUT',
    category: 'LETTER',
    sender: 'إدارة الصيانة الكهروميكانيكية',
    recipient: 'الشركة السعودية للكهرباء (SEC)',
    subject: 'طلب عروض أسعار لتحديث أنظمة التكييف والتهوية بمحطة عرفات 1',
    status: 'OPEN',
    requiresReply: true,
    replyDeadline: '2026-09-20',
    notes: 'تم إرسال وثائق المنافسة للشركات المؤهلة لاعتماد جدول التوريد.',
    attachmentsCount: 5,
    priority: 'HIGH',
    createdAt: '2026-09-04T08:30:00Z',
    updatedAt: '2026-09-04T08:30:00Z'
  },
  {
    id: 'sar-008',
    refNumber: 'SAR-PRO-2026-0521',
    date: '2026-09-05',
    network: 'INFRA &FM',
    direction: 'OUT',
    category: 'LETTER',
    sender: 'الإدارة العامة لسلاسل الإمداد والعقود',
    recipient: 'شركة إلكترو-موتيف ديزل (EMD / Progress Rail)',
    subject: 'تأكيد أمر الشراء لتوريد قطع غيار قاطرات الشحن الثقيل لمشروع قطار التعدين',
    status: 'OPEN',
    requiresReply: true,
    replyDeadline: '2026-09-18',
    notes: 'تم إرفاق جداول الكميات والمواصفات الفنية المعتمدة للشحنة الأولى.',
    attachmentsCount: 3,
    priority: 'HIGH',
    createdAt: '2026-09-05T09:15:00Z',
    updatedAt: '2026-09-05T09:15:00Z'
  },
  {
    id: 'sar-009',
    refNumber: 'SAR-HR-2026-0219',
    date: '2026-09-06',
    network: 'TMO',
    direction: 'IN',
    category: 'LETTER',
    sender: 'المعهد السعودي التقني للخطوط الحديدية (سرب - SRP)',
    recipient: 'الإدارة التنفيذية للموارد البشرية وتطوير الكفاءات',
    subject: 'التقرير الختامي لبرنامج تأهيل وتدريب الدفعة السادسة لقائدي قطارات الركاب والشحن',
    status: 'CLOSED',
    requiresReply: false,
    notes: 'تم اجتياز جميع المتدربين لاختبارات المحاكاة وساعات القيادة الميدانية بنجاح.',
    attachmentsCount: 2,
    priority: 'NORMAL',
    createdAt: '2026-09-06T10:45:00Z',
    updatedAt: '2026-09-06T14:20:00Z'
  },
  {
    id: 'sar-010',
    refNumber: 'HHR-SAF-2026-0417',
    date: '2026-09-07',
    network: 'SYSTEM',
    direction: 'OUT',
    category: 'LETTER',
    sender: 'الإدارة العامة للسلامة والأمن الصناعي - HHR',
    recipient: 'المديرية العامة للدفاع المدني بمنطقة مكة المكرمة',
    subject: 'تحديث خطة الطوارئ والإخلاء المشتركة لمسار ومحطات قطار الحرمين السريع لعام 2026',
    status: 'UNDER_REVIEW',
    requiresReply: true,
    replyDeadline: '2026-09-22',
    notes: 'تم إرسال مسودة الخطة المحدثة لتحديد موعد ورشة العمل والتمرين الميداني الفرضي.',
    attachmentsCount: 4,
    priority: 'URGENT',
    createdAt: '2026-09-07T08:00:00Z',
    updatedAt: '2026-09-07T08:00:00Z'
  }
];

export const STORAGE_KEY = 'SAR_CORRESPONDENCE_LETTERS_V5';
export const PASSCODE_STORAGE_KEY = 'sar_letters_passcode';
export const AUTH_SESSION_KEY = 'sar_letters_auth_session';
export const DEFAULT_PASSCODE = '1234';

export function normalizeNetwork(net: string): LetterNetwork {
  if (net === 'TMO' || net === 'SYSTEM' || net === 'MMMP') return net;
  if (net === 'INFRA &FM' || net === 'INFRA & FM' || net === 'HHR') return 'INFRA &FM';
  return 'TMO';
}

export function sanitizeLetters(letters: Letter[]): Letter[] {
  const seenIds = new Set<string>();
  const seenRefs = new Set<string>();
  const sanitized: Letter[] = [];

  for (const item of letters) {
    if (!item || !item.id) continue;
    const id = String(item.id).trim();
    const ref = (item.refNumber || '').trim().toLowerCase();

    if (!seenIds.has(id) && (!ref || !seenRefs.has(ref))) {
      seenIds.add(id);
      if (ref) seenRefs.add(ref);
      sanitized.push({
        ...item,
        id,
        refNumber: item.refNumber || `SAR-REF-${id}`,
        network: normalizeNetwork(item.network),
        direction: item.direction || 'IN',
        status: (item.status === ('PENDING_REPLY' as any) ? 'OPEN' : item.status) || 'OPEN',
        requiresReply: !!item.requiresReply,
        isEscalated: !!item.isEscalated,
        escalationReason: item.escalationReason || '',
        notes: item.notes || '',
        sender: item.sender || '',
        recipient: item.recipient || '',
        subject: item.subject || '',
        priority: item.priority || 'NORMAL'
      });
    }
  }

  return sanitized.sort((a, b) => (b.date || '').localeCompare(a.date || ''));
}

export function loadLettersFromStorage(): Letter[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length >= 1) {
        return sanitizeLetters(parsed);
      }
    }
  } catch (err) {
    console.error('Failed to load letters from storage:', err);
  }

  const initial = sanitizeLetters(INITIAL_LETTERS);
  saveLettersToStorage(initial);
  return initial;
}

export function saveLettersToStorage(letters: Letter[]): Letter[] {
  const sanitized = sanitizeLetters(letters);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sanitized));
  } catch (err) {
    console.error('Failed to persist letters to storage:', err);
  }
  return sanitized;
}

export function upsertLetter(letter: Letter, currentLetters: Letter[]): Letter[] {
  const id = letter.id || `sar-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const updated: Letter = {
    ...letter,
    id,
    updatedAt: new Date().toISOString()
  };

  const index = currentLetters.findIndex((l) => l.id === id);
  let result: Letter[];

  if (index >= 0) {
    result = [...currentLetters];
    result[index] = updated;
  } else {
    // Check if same refNumber exists
    const existingRefIdx = currentLetters.findIndex(
      (l) =>
        l.refNumber.trim().toLowerCase() === updated.refNumber.trim().toLowerCase() &&
        l.date === updated.date &&
        l.subject === updated.subject
    );
    if (existingRefIdx >= 0) {
      result = [...currentLetters];
      result[existingRefIdx] = { ...updated, id: currentLetters[existingRefIdx].id };
    } else {
      result = [updated, ...currentLetters];
    }
  }

  return saveLettersToStorage(result);
}

export function deleteLetterFromList(id: string, currentLetters: Letter[]): Letter[] {
  const filtered = currentLetters.filter((l) => l.id !== id);
  return saveLettersToStorage(filtered);
}
