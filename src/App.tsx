import React, { useState, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { Letter, FilterState } from './types/letter';
import {
  loadLettersFromStorage,
  saveLettersToStorage,
  upsertLetter,
  deleteLetterFromList,
  sanitizeLetters,
  STORAGE_KEY,
  PASSCODE_STORAGE_KEY,
  AUTH_SESSION_KEY,
  DEFAULT_PASSCODE,
} from './data/initialLetters';
import { Header } from './components/Header';
import { StatCards } from './components/StatCards';
import { FilterBar } from './components/FilterBar';
import { LetterTable } from './components/LetterTable';
import { AddEditLetterModal } from './components/AddEditLetterModal';
import { LetterDetailModal } from './components/LetterDetailModal';
import { AnalyticsModal } from './components/AnalyticsModal';
import { PdfReportModal } from './components/PdfReportModal';
import { ExcelImportModal } from './components/ExcelImportModal';
import { ShareModal } from './components/ShareModal';
import { PasscodeGateModal, ChangePasscodeModal } from './components/SecurityModals';
import { exportLettersToExcel } from './utils/excel';

export default function App() {
  // Passcode & Auth state
  const [passcode, setPasscode] = useState<string>(() => {
    return localStorage.getItem(PASSCODE_STORAGE_KEY) || DEFAULT_PASSCODE;
  });
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem(AUTH_SESSION_KEY) === 'true';
  });
  const [isSecurityModalOpen, setIsSecurityModalOpen] = useState(false);

  // Main data state
  const [letters, setLetters] = useState<Letter[]>(() => loadLettersFromStorage());

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingLetter, setEditingLetter] = useState<Letter | null>(null);
  const [detailLetter, setDetailLetter] = useState<Letter | null>(null);
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);

  // Language & sync timestamp
  const [currentLang, setCurrentLang] = useState<'ar' | 'en'>('ar');
  const [lastSyncTime, setLastSyncTime] = useState<string>(() => {
    const d = new Date();
    return `${d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })} ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  });

  // Filter state
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    quickTab: 'TOTAL',
    network: 'ALL',
    direction: 'ALL',
    status: 'ALL',
    requiresReply: 'ALL',
    isEscalated: 'ALL',
    priority: 'ALL',
  });

  // Toast notifications
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Auth actions
  const handleAuthenticated = () => {
    sessionStorage.setItem(AUTH_SESSION_KEY, 'true');
    setIsAuthenticated(true);
  };

  const handleLock = () => {
    sessionStorage.removeItem(AUTH_SESSION_KEY);
    setIsAuthenticated(false);
    showToast('تم قفل النظام بنجاح.');
  };

  const handleUpdatePasscode = (newPass: string) => {
    localStorage.setItem(PASSCODE_STORAGE_KEY, newPass);
    setPasscode(newPass);
    showToast('تم حفظ وتحديث الرقم السري بنجاح.');
  };

  // Sync refresh
  const handleManualRefresh = () => {
    const refreshed = loadLettersFromStorage();
    setLetters(refreshed);
    const d = new Date();
    setLastSyncTime(
      `${d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })} ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
    );
    showToast('تم تحديث ومزامنة البيانات بنجاح.');
  };

  // Save letter
  const handleSaveLetter = (letterToSave: Letter) => {
    const isNew = !letters.some((l) => l.id === letterToSave.id);
    const updatedList = upsertLetter(letterToSave, letters);
    setLetters(updatedList);
    setIsAddModalOpen(false);
    setEditingLetter(null);

    if (detailLetter && detailLetter.id === letterToSave.id) {
      setDetailLetter(letterToSave);
    }

    if (isNew) {
      try {
        confetti({ particleCount: 40, spread: 60, origin: { y: 0.8 } });
      } catch {}
      showToast(`تم تسجيل الخطاب بنجاح برقم المرجع: ${letterToSave.refNumber}`);
    } else {
      showToast(`تم تحديث بيانات الخطاب: ${letterToSave.refNumber}`);
    }
  };

  // Delete letter
  const handleDeleteLetter = (id: string) => {
    const target = letters.find((l) => l.id === id);
    const ref = target ? target.refNumber : 'الخطاب';
    if (window.confirm(`هل أنت متأكد من حذف ${ref} من السجل نهائياً؟`)) {
      const updatedList = deleteLetterFromList(id, letters);
      setLetters(updatedList);
      if (detailLetter && detailLetter.id === id) {
        setDetailLetter(null);
      }
      showToast('تم حذف الخطاب من السجل بنجاح.');
    }
  };

  // Toggle Escalate
  const handleToggleEscalate = (letter: Letter) => {
    const newEscalated = !letter.isEscalated;
    const updated: Letter = {
      ...letter,
      isEscalated: newEscalated,
      escalationReason: newEscalated
        ? letter.escalationReason || 'تم تصعيد المعاملة للمتابعة الإدارية العاجلة'
        : '',
      updatedAt: new Date().toISOString(),
    };
    const updatedList = upsertLetter(updated, letters);
    setLetters(updatedList);
    if (detailLetter && detailLetter.id === letter.id) {
      setDetailLetter(updated);
    }
    showToast(
      newEscalated
        ? `تم تصعيد المعاملة: ${letter.refNumber} للمتابعة العاجلة ⚠️`
        : `تم إلغاء تصعيد المعاملة: ${letter.refNumber}`
    );
  };

  // Import letters
  const handleImport = (imported: Letter[], mode: 'merge' | 'replace') => {
    let combined: Letter[];
    if (mode === 'replace') {
      combined = sanitizeLetters(imported);
    } else {
      const map = new Map<string, Letter>();
      letters.forEach((l) => map.set(l.refNumber.trim().toLowerCase(), l));
      imported.forEach((l) => map.set(l.refNumber.trim().toLowerCase(), l));
      combined = sanitizeLetters(Array.from(map.values()));
    }
    const saved = saveLettersToStorage(combined);
    setLetters(saved);
    showToast(`تم استيراد ${imported.length} خطاب بنجاح.`);
  };

  // Export Excel
  const handleExportExcel = () => {
    exportLettersToExcel(filteredLetters);
    showToast('تم تصدير ملف الإكسل بنجاح.');
  };

  // Print
  const handlePrint = () => {
    window.print();
  };

  // Reset Filters
  const handleResetFilters = () => {
    setFilters({
      searchQuery: '',
      quickTab: 'TOTAL',
      network: 'ALL',
      direction: 'ALL',
      status: 'ALL',
      requiresReply: 'ALL',
      isEscalated: 'ALL',
      priority: 'ALL',
    });
  };

  // Filtered letters computation
  const filteredLetters = useMemo(() => {
    return letters.filter((l) => {
      // Quick Tab
      if (filters.quickTab === 'IN' && l.direction !== 'IN') return false;
      if (filters.quickTab === 'OUT' && l.direction !== 'OUT') return false;
      if (filters.quickTab === 'OPEN' && l.status !== 'OPEN' && l.status !== 'UNDER_REVIEW') return false;
      if (filters.quickTab === 'CLOSED' && l.status !== 'CLOSED') return false;
      if (filters.quickTab === 'NEED_REPLY' && !(l.requiresReply && l.status !== 'CLOSED')) return false;
      if (filters.quickTab === 'ESCALATED' && !l.isEscalated) return false;

      // Select filters
      if (filters.network !== 'ALL' && l.network !== filters.network) return false;
      if (filters.direction !== 'ALL' && l.direction !== filters.direction) return false;
      if (filters.status !== 'ALL' && l.status !== filters.status) return false;
      if (filters.priority !== 'ALL' && l.priority !== filters.priority) return false;
      if (filters.requiresReply === 'YES' && !l.requiresReply) return false;
      if (filters.requiresReply === 'NO' && l.requiresReply) return false;
      if (filters.isEscalated === 'YES' && !l.isEscalated) return false;
      if (filters.isEscalated === 'NO' && l.isEscalated) return false;

      // Search Query
      if (filters.searchQuery.trim()) {
        const query = filters.searchQuery.toLowerCase().trim();
        const mRef = l.refNumber.toLowerCase().includes(query);
        const mSub = l.subject.toLowerCase().includes(query);
        const mSend = (l.sender || '').toLowerCase().includes(query);
        const mRec = (l.recipient || '').toLowerCase().includes(query);
        const mNotes = (l.notes || '').toLowerCase().includes(query);
        const mEsc = (l.escalationReason || '').toLowerCase().includes(query);
        const mDate = (l.date || '').includes(query);

        if (!mRef && !mSub && !mSend && !mRec && !mNotes && !mEsc && !mDate) {
          return false;
        }
      }

      return true;
    });
  }, [letters, filters]);

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 pb-16">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 px-5 py-3 bg-slate-900 text-white rounded-2xl text-xs sm:text-sm font-bold shadow-2xl border border-slate-700 animate-in fade-in slide-in-from-bottom-4 duration-200">
          {toastMessage}
        </div>
      )}

      {/* Header */}
      <Header
        onAddClick={() => {
          setEditingLetter(null);
          setIsAddModalOpen(true);
        }}
        onAnalyticsClick={() => setIsAnalyticsOpen(true)}
        onReportClick={(lang) => {
          if (lang === 'en' || lang === 'ar') setCurrentLang(lang);
          setIsReportOpen(true);
          showToast(
            lang === 'en'
              ? 'Opening executive official PDF report...'
              : 'جاري فتح وتصدير التقرير الرسمي بصيغة PDF...'
          );
        }}
        onShareClick={() => setIsShareOpen(true)}
        onExportClick={handleExportExcel}
        onPrintClick={handlePrint}
        lastSyncTime={lastSyncTime}
        onManualRefresh={handleManualRefresh}
        currentLang={currentLang}
        onLangChange={(lang) => setCurrentLang(lang)}
        onChangePasswordClick={() => setIsSecurityModalOpen(true)}
        onLockClick={handleLock}
      />

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {/* Stat Cards */}
        <StatCards
          letters={letters}
          activeTab={filters.quickTab}
          onSelectTab={(tab) => setFilters((prev) => ({ ...prev, quickTab: tab }))}
        />

        {/* Filter Bar */}
        <FilterBar
          filters={filters}
          onFilterChange={setFilters}
          onResetFilters={handleResetFilters}
          totalCount={letters.length}
          filteredCount={filteredLetters.length}
        />

        {/* Letters Table */}
        <LetterTable
          letters={filteredLetters}
          onView={(letter) => setDetailLetter(letter)}
          onEdit={(letter) => {
            setEditingLetter(letter);
            setIsAddModalOpen(true);
          }}
          onDelete={(id) => handleDeleteLetter(id)}
          onToggleEscalate={handleToggleEscalate}
          onAddClick={() => {
            setEditingLetter(null);
            setIsAddModalOpen(true);
          }}
          onImportClick={() => setIsImportOpen(true)}
        />
      </main>

      {/* Add / Edit Letter Modal */}
      <AddEditLetterModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingLetter(null);
        }}
        onSave={handleSaveLetter}
        initialData={editingLetter}
      />

      {/* Letter Detail Modal */}
      <LetterDetailModal
        letter={detailLetter}
        onClose={() => setDetailLetter(null)}
        onEdit={(letter) => {
          setDetailLetter(null);
          setEditingLetter(letter);
          setIsAddModalOpen(true);
        }}
        onDelete={(id) => {
          setDetailLetter(null);
          handleDeleteLetter(id);
        }}
        onToggleEscalate={handleToggleEscalate}
      />

      {/* Analytics Modal */}
      <AnalyticsModal
        isOpen={isAnalyticsOpen}
        onClose={() => setIsAnalyticsOpen(false)}
        letters={letters}
      />

      {/* PDF Report Modal */}
      <PdfReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        letters={letters}
        initialLang={currentLang}
      />

      {/* Excel Import Modal */}
      <ExcelImportModal
        isOpen={isImportOpen}
        onClose={() => setIsImportOpen(false)}
        onImport={handleImport}
        existingLetters={letters}
      />

      {/* Share Modal */}
      <ShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
      />

      {/* Security Settings Modal */}
      <ChangePasscodeModal
        isOpen={isSecurityModalOpen}
        onClose={() => setIsSecurityModalOpen(false)}
        currentLang={currentLang}
        currentPasscode={passcode}
        onUpdatePasscode={handleUpdatePasscode}
        showToast={showToast}
      />

      {/* Lock Screen / Passcode Gate */}
      {!isAuthenticated && (
        <PasscodeGateModal
          currentLang={currentLang}
          savedPasscode={passcode}
          onAuthenticated={handleAuthenticated}
        />
      )}
    </div>
  );
}
