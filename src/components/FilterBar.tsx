import React from 'react';
import { Search, X, RotateCcw } from 'lucide-react';
import { FilterState } from '../types/letter';

interface FilterBarProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  onResetFilters: () => void;
  totalCount: number;
  filteredCount: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onFilterChange,
  onResetFilters,
  totalCount,
  filteredCount,
}) => {
  const isFiltered =
    filters.searchQuery !== '' ||
    filters.network !== 'ALL' ||
    filters.direction !== 'ALL' ||
    filters.status !== 'ALL' ||
    filters.requiresReply !== 'ALL' ||
    filters.isEscalated !== 'ALL' ||
    filters.priority !== 'ALL' ||
    filters.quickTab !== 'TOTAL';

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4 mb-6 shadow-xs">
      <div className="flex flex-col lg:flex-row lg:items-center gap-3">
        {/* Search input */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            id="input-search-letters"
            type="text"
            value={filters.searchQuery}
            onChange={(e) => onFilterChange({ ...filters, searchQuery: e.target.value })}
            placeholder="بحث برقم المرجع، الموضوع، الجهة المرسلة، المستلم، الملاحظات..."
            className="w-full pr-10 pl-9 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#00707b]/20 focus:border-[#00707b] transition-all"
          />
          {filters.searchQuery && (
            <button
              onClick={() => onFilterChange({ ...filters, searchQuery: '' })}
              className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filters Selectors */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Network */}
          <div className="flex items-center gap-1.5">
            <label htmlFor="select-network" className="text-xs font-bold text-slate-500 whitespace-nowrap">
              الشبكة:
            </label>
            <select
              id="select-network"
              value={filters.network}
              onChange={(e) => onFilterChange({ ...filters, network: e.target.value })}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:border-[#00707b]"
            >
              <option value="ALL">جميع الشبكات (All)</option>
              <option value="TMO">TMO</option>
              <option value="INFRA &FM">INFRA &FM</option>
              <option value="SYSTEM">SYSTEM</option>
              <option value="MMMP">MMMP</option>
            </select>
          </div>

          {/* Direction */}
          <div className="flex items-center gap-1.5">
            <label htmlFor="select-direction" className="text-xs font-bold text-slate-500 whitespace-nowrap">
              النوع:
            </label>
            <select
              id="select-direction"
              value={filters.direction}
              onChange={(e) => onFilterChange({ ...filters, direction: e.target.value })}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:border-[#00707b]"
            >
              <option value="ALL">الكل (All)</option>
              <option value="IN">وارد (In-Coming)</option>
              <option value="OUT">صادر (Out-Going)</option>
            </select>
          </div>

          {/* Status */}
          <div className="flex items-center gap-1.5">
            <label htmlFor="select-status" className="text-xs font-bold text-slate-500 whitespace-nowrap">
              الحالة:
            </label>
            <select
              id="select-status"
              value={filters.status}
              onChange={(e) => onFilterChange({ ...filters, status: e.target.value })}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:border-[#00707b]"
            >
              <option value="ALL">جميع الحالات</option>
              <option value="OPEN">مفتوح / جاري المتابعة</option>
              <option value="UNDER_REVIEW">تحت الدراسة والمراجعة</option>
              <option value="CLOSED">مغلق ومكتمل</option>
            </select>
          </div>

          {/* Priority */}
          <div className="flex items-center gap-1.5">
            <label htmlFor="select-priority" className="text-xs font-bold text-slate-500 whitespace-nowrap">
              الأولوية:
            </label>
            <select
              id="select-priority"
              value={filters.priority}
              onChange={(e) => onFilterChange({ ...filters, priority: e.target.value })}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:border-[#00707b]"
            >
              <option value="ALL">الكل</option>
              <option value="NORMAL">عادي</option>
              <option value="HIGH">مهم</option>
              <option value="URGENT">عاجل جداً</option>
            </select>
          </div>

          {/* Reset Filters */}
          {isFiltered && (
            <button
              onClick={onResetFilters}
              type="button"
              className="inline-flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 transition-colors cursor-pointer"
              title="إعادة ضبط الفلاتر"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>إعادة ضبط</span>
            </button>
          )}

          {/* Result Count Badge */}
          <div className="text-xs font-medium text-slate-500 px-2 py-1 bg-slate-100 rounded-lg">
            عرض <span className="font-bold text-[#00707b]">{filteredCount}</span> من أصل{' '}
            <span className="font-bold text-slate-700">{totalCount}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
