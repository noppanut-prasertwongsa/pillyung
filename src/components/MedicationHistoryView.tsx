import React, { useState, useMemo, useEffect } from 'react';
import { DayAdherenceRecord, ScheduledDose } from '../types';
import { generate30DayAdherenceHistory, calculateAdherenceMetrics } from '../data/mockAdherenceHistory';
import {
  Calendar as CalendarIcon,
  ListFilter,
  CheckCircle2,
  XCircle,
  Clock,
  TrendingUp,
  AlertCircle,
  Share2,
  ChevronLeft,
  ChevronRight,
  Check,
  Flame,
} from 'lucide-react';
import { Button } from './ui/Button';

interface MedicationHistoryViewProps {
  liveScheduledDoses?: ScheduledDose[];
  seniorMode: boolean;
}

const FIXED_LIST_PAGE_SIZE = 3;

export const MedicationHistoryView: React.FC<MedicationHistoryViewProps> = ({
  liveScheduledDoses,
  seniorMode,
}) => {
  // View mode: 'calendar' | 'list'
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');

  // List view filter: 'all' | 'complete' | 'missed'
  const [listFilter, setListFilter] = useState<'all' | 'complete' | 'missed'>('all');

  // Pagination states (fixed at 3 items per page)
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = FIXED_LIST_PAGE_SIZE;

  // Selected day for calendar view
  const historyData = useMemo(
    () => generate30DayAdherenceHistory(liveScheduledDoses),
    [liveScheduledDoses]
  );

  const [selectedDayString, setSelectedDayString] = useState<string>(
    () => historyData[0]?.dateString || ''
  );

  const [showShareToast, setShowShareToast] = useState(false);

  const metrics = useMemo(
    () => calculateAdherenceMetrics(historyData),
    [historyData]
  );

  const selectedDayRecord = useMemo(
    () => historyData.find((d) => d.dateString === selectedDayString) || historyData[0],
    [historyData, selectedDayString]
  );

  // Filtered days for List View
  const filteredListDays = useMemo(() => {
    if (listFilter === 'complete') {
      return historyData.filter((d) => d.status === 'complete');
    }
    if (listFilter === 'missed') {
      return historyData.filter((d) => d.status !== 'complete');
    }
    return historyData;
  }, [historyData, listFilter]);

  // Reset to page 1 whenever list filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [listFilter]);

  // Total pages calculation
  const totalRecords = filteredListDays.length;
  const totalPages = Math.max(1, Math.ceil(totalRecords / pageSize));

  // Ensure current page stays within valid boundaries
  const validCurrentPage = Math.min(Math.max(1, currentPage), totalPages);

  // Paginated records
  const paginatedListDays = useMemo(() => {
    const startIndex = (validCurrentPage - 1) * pageSize;
    return filteredListDays.slice(startIndex, startIndex + pageSize);
  }, [filteredListDays, validCurrentPage, pageSize]);

  const startIndexDisplay = totalRecords > 0 ? (validCurrentPage - 1) * pageSize + 1 : 0;
  const endIndexDisplay = Math.min(validCurrentPage * pageSize, totalRecords);

  const handleShareReport = () => {
    setShowShareToast(true);
    setTimeout(() => {
      setShowShareToast(false);
    }, 2800);
  };

  return (
    <div className={`space-y-4 w-full ${seniorMode ? 'senior-mode-active' : ''}`}>
      {/* Toast Notification */}
      {showShareToast && (
        <div className="fixed top-14 left-1/2 -translate-x-1/2 z-50 bg-[#111827] text-white px-4 py-2.5 rounded-full shadow-xl flex items-center gap-2 text-xs font-semibold animate-in fade-in slide-in-from-top-4 duration-200">
          <Check className="w-4 h-4 text-[#16a34a]" />
          <span>คัดลอกรายงานสรุป 30 วันสำหรับส่งแพทย์หรือลูกหลานแล้ว</span>
        </div>
      )}

      {/* 1. Header Overview & Consistency Score Card */}
      <div
        className={`bg-gradient-to-br from-[#ffffff] to-[#f0f7ff] rounded-3xl border border-[#b8d5f2] shadow-xs ${
          seniorMode ? 'p-5 sm:p-6' : 'p-4 sm:p-5'
        }`}
      >
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="min-w-0 flex-1">
            <div className="inline-flex items-center gap-1.5 bg-[#e8f1fa] text-[#0066cc] px-2.5 py-0.5 rounded-full text-xs font-bold mb-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>ความสม่ำเสมอ 30 วัน</span>
            </div>
            <h2
              className={`font-black text-[#111827] tracking-tight leading-snug ${
                seniorMode ? 'text-xl sm:text-2xl' : 'text-base sm:text-lg'
              }`}
            >
              ประวัติความสม่ำเสมอการทานยา
            </h2>
            <p className={`text-[#6b7280] mt-0.5 leading-relaxed ${seniorMode ? 'text-sm' : 'text-xs'}`}>
              ติดตามประวัติย้อนหลัง 30 วันเพื่อความต่อเนื่องในการรักษา
            </p>
          </div>

          {/* Adherence Rate Badge (Clean square card layout that never overlaps) */}
          <div className="shrink-0 flex flex-col items-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#0066cc] to-[#16a34a] p-0.5 shadow-xs">
              <div className="w-full h-full bg-white rounded-[14px] flex flex-col items-center justify-center p-1">
                <span className="text-base sm:text-lg font-black tracking-tight text-[#0066cc] leading-none">
                  {metrics.overallPercentage}%
                </span>
                <span className="text-[10px] font-bold text-[#64748b] leading-tight mt-0.5">
                  สม่ำเสมอ
                </span>
              </div>
            </div>
            <span className="mt-1 text-[10px] font-bold text-[#16a34a] bg-[#dcfce7] px-2 py-0.5 rounded-full border border-[#86efac] whitespace-nowrap">
              เกณฑ์ดีเยี่ยม
            </span>
          </div>
        </div>

        {/* 3 Metric Summary Boxes */}
        <div className="grid grid-cols-3 gap-2 pt-1">
          <div className="bg-white rounded-2xl px-2 py-2.5 text-center border border-[#e5e7eb] shadow-2xs min-w-0">
            <span className="text-[11px] text-[#6b7280] block font-medium truncate w-full">ทานตรงเวลา</span>
            <span
              className={`font-black text-[#16a34a] mt-0.5 block truncate w-full ${
                seniorMode ? 'text-base sm:text-lg' : 'text-sm sm:text-base'
              }`}
            >
              {metrics.takenDoses}/{metrics.totalDoses}
            </span>
            <span className="text-[10px] text-[#6b7280] block truncate w-full">มื้อที่รับประทาน</span>
          </div>

          <div className="bg-white rounded-2xl px-2 py-2.5 text-center border border-[#e5e5ea] shadow-2xs min-w-0">
            <span className="text-[11px] text-[#6b7280] block font-medium truncate w-full flex items-center justify-center gap-0.5">
              <Flame className="w-3.5 h-3.5 text-[#d97706] shrink-0" /> ต่อเนื่อง
            </span>
            <span
              className={`font-black text-[#d97706] mt-0.5 block truncate w-full ${
                seniorMode ? 'text-base sm:text-lg' : 'text-sm sm:text-base'
              }`}
            >
              {metrics.currentStreak} วัน
            </span>
            <span className="text-[10px] text-[#6b7280] block truncate w-full">สถิติต่อเนื่อง</span>
          </div>

          <div className="bg-white rounded-2xl px-2 py-2.5 text-center border border-[#e5e5ea] shadow-2xs min-w-0">
            <span className="text-[11px] text-[#6b7280] block font-medium truncate w-full">มื้อที่ลืมทาน</span>
            <span
              className={`font-black text-[#dc2626] mt-0.5 block truncate w-full ${
                seniorMode ? 'text-base sm:text-lg' : 'text-sm sm:text-base'
              }`}
            >
              {metrics.missedDoses} มื้อ
            </span>
            <span className="text-[10px] text-[#6b7280] block truncate w-full">ในรอบ 30 วัน</span>
          </div>
        </div>
      </div>

      {/* 2. View Mode Selector (Calendar vs List) */}
      <div className="flex items-center justify-between gap-2 pt-0.5">
        <div className="bg-[#f1f5f9] p-1 rounded-2xl flex items-center gap-1 flex-1">
          <button
            type="button"
            onClick={() => setViewMode('calendar')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              viewMode === 'calendar'
                ? 'bg-white text-[#111827] shadow-xs'
                : 'text-[#64748b] hover:text-[#111827]'
            }`}
          >
            <CalendarIcon className="w-4 h-4 text-[#0066cc]" />
            <span>มุมมองปฏิทิน</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode('list')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              viewMode === 'list'
                ? 'bg-white text-[#111827] shadow-xs'
                : 'text-[#64748b] hover:text-[#111827]'
            }`}
          >
            <ListFilter className="w-4 h-4 text-[#0066cc]" />
            <span>มุมมองรายการ</span>
          </button>
        </div>

        <button
          type="button"
          onClick={handleShareReport}
          title="แชร์รายงานสรุปประวัติการทานยา"
          aria-label="แชร์รายงานสรุปประวัติการทานยา"
          className="p-2.5 bg-white hover:bg-[#e8f1fa] text-[#0066cc] border border-[#e5e7eb] rounded-2xl transition-colors shadow-2xs shrink-0 cursor-pointer"
        >
          <Share2 className="w-4 h-4" />
        </button>
      </div>

      {/* 3. CALENDAR VIEW */}
      {viewMode === 'calendar' && (
        <div className="space-y-3.5 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-3.5 sm:p-5 border border-[#e5e7eb] shadow-xs space-y-3">
            {/* Calendar Month & Legend */}
            <div className="flex items-center justify-between flex-wrap gap-2 pb-2.5 border-b border-[#f1f5f9]">
              <span className="font-bold text-[#111827] text-sm sm:text-base">
                30 วันล่าสุด (ตุลาคม 2569)
              </span>

              {/* Status Legend */}
              <div className="flex items-center gap-2.5 sm:gap-3 text-xs font-medium text-[#64748b] flex-wrap">
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#16a34a]" />
                  <span>ครบ 100%</span>
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#d97706]" />
                  <span>บางส่วน</span>
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#dc2626]" />
                  <span>ขาดมื้อ</span>
                </span>
              </div>
            </div>

            {/* 7-Days Header with explicit py and text constraints */}
            <div className="grid grid-cols-7 gap-1 sm:gap-1.5 text-center text-xs font-bold text-[#6b7280] py-1 select-none">
              {['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส'].map((day, idx) => (
                <div key={idx} className="calendar-header-cell py-1 text-center font-bold text-xs text-[#4b5563]">
                  {day}
                </div>
              ))}
            </div>

            {/* 30-Day Grid with explicit padding and spacing between each day */}
            <div className="grid grid-cols-7 gap-1.5 sm:gap-2 px-0.5 py-1">
              {[...historyData].reverse().map((day) => {
                const isSelected = day.dateString === selectedDayString;

                let badgeColor = 'bg-[#f0fdf4] text-[#16a34a] border-[#86efac]';
                if (day.status === 'partial') {
                  badgeColor = 'bg-[#fffbeb] text-[#b45309] border-[#fde68a]';
                } else if (day.status === 'missed') {
                  badgeColor = 'bg-[#fef2f2] text-[#dc2626] border-[#fecaca]';
                }

                return (
                  <button
                    key={day.dateString}
                    type="button"
                    onClick={() => setSelectedDayString(day.dateString)}
                    className={`calendar-day-btn min-h-[48px] sm:min-h-[52px] w-full rounded-xl sm:rounded-2xl flex flex-col items-center justify-between px-1 py-1.5 border transition-all text-center relative cursor-pointer ${
                      isSelected
                        ? 'ring-2 ring-[#0066cc] shadow-sm font-black'
                        : 'hover:border-[#0066cc]/50'
                    } ${badgeColor}`}
                  >
                    <span className="w-full text-center text-xs font-black leading-none block select-none">
                      {day.dayNumber}
                    </span>

                    <div className="w-full flex justify-center items-center pt-1 pb-0.5">
                      {day.status === 'complete' ? (
                        <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#16a34a] stroke-[2.2]" />
                      ) : day.status === 'partial' ? (
                        <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-[#d97706]" />
                      ) : (
                        <XCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#dc2626] stroke-[2.2]" />
                      )}
                    </div>

                    {day.isToday && (
                      <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-[#0066cc]" />
                    )}
                  </button>
                );
              })}
            </div>

            <p className="text-xs text-[#6b7280] text-center pt-1.5">
              แตะที่วันที่บนปฏิทินเพื่อดูรายละเอียดมื้อยาของวันนั้น
            </p>
          </div>

          {/* Selected Day Detail Card */}
          {selectedDayRecord && (
            <div
              className={`bg-white rounded-3xl p-4 sm:p-5 border border-[#e5e7eb] shadow-xs space-y-3 ${
                seniorMode ? 'p-5 sm:p-6' : 'p-4 sm:p-5'
              }`}
            >
              <div className="flex items-center justify-between gap-3 border-b border-[#f1f5f9] pb-2.5">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 text-xs text-[#6b7280]">
                    <Clock className="w-3.5 h-3.5 text-[#0066cc] shrink-0" />
                    <span>วัน{selectedDayRecord.dayOfWeek}</span>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap mt-0.5">
                    <h3
                      className={`font-bold text-[#111827] tracking-tight whitespace-nowrap ${
                        seniorMode ? 'text-lg sm:text-xl' : 'text-base'
                      }`}
                    >
                      {selectedDayRecord.displayDate}
                    </h3>
                    {selectedDayRecord.isToday && (
                      <span className="text-[11px] font-bold text-[#0066cc] bg-[#e8f1fa] px-2 py-0.5 rounded-md whitespace-nowrap shrink-0">
                        วันนี้
                      </span>
                    )}
                  </div>
                </div>

                <div className="shrink-0 text-right">
                  <span
                    className={`inline-flex items-center justify-center whitespace-nowrap font-black px-2.5 py-1 rounded-xl text-xs ${
                      selectedDayRecord.status === 'complete'
                        ? 'bg-[#dcfce7] text-[#16a34a] border border-[#86efac]'
                        : selectedDayRecord.status === 'partial'
                        ? 'bg-[#fef3c7] text-[#b45309] border border-[#fde68a]'
                        : 'bg-[#fee2e2] text-[#dc2626] border border-[#fecaca]'
                    }`}
                  >
                    {selectedDayRecord.status === 'complete'
                      ? `ทานครบ ${selectedDayRecord.takenDoses}/${selectedDayRecord.totalDoses} มื้อ`
                      : `ทาน ${selectedDayRecord.takenDoses}/${selectedDayRecord.totalDoses} มื้อ`}
                  </span>
                </div>
              </div>

              {/* Doses breakdown for selected day */}
              <div className="space-y-2 pt-0.5">
                {selectedDayRecord.doses.map((dose) => (
                  <div
                    key={dose.id}
                    className={`p-3 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                      dose.status === 'taken'
                        ? 'bg-[#f0fdf4] border-[#86efac] text-[#111827]'
                        : 'bg-[#fef2f2] border-[#fecaca] text-[#111827]'
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[10px] font-bold text-[#6b7280] bg-white border border-[#e5e7eb] px-2 py-0.5 rounded-md">
                          {dose.scheduledTime}
                        </span>
                        <h4 className={`font-bold truncate ${seniorMode ? 'text-base' : 'text-xs sm:text-sm'}`}>
                          {dose.drugName}
                        </h4>
                      </div>
                      <p className="text-xs text-[#4b5563] mt-0.5 pl-0.5">
                        ขนาด: {dose.dose} · {dose.note}
                      </p>
                    </div>

                    <div className="shrink-0 text-right">
                      {dose.status === 'taken' ? (
                        <div className="flex items-center gap-1 text-[#16a34a] font-bold text-xs bg-white px-2.5 py-1 rounded-xl border border-[#86efac] shadow-2xs">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#16a34a]" />
                          <span>{dose.takenAt || 'ทานแล้ว'}</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-[#dc2626] font-bold text-xs bg-white px-2.5 py-1 rounded-xl border border-[#fecaca] shadow-2xs">
                          <XCircle className="w-3.5 h-3.5 text-[#dc2626]" />
                          <span>ลืมทาน</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 4. LIST VIEW WITH PAGINATION */}
      {viewMode === 'list' && (
        <div className="space-y-3 animate-in fade-in duration-200">
          {/* Sub-filters for List View */}
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
              <button
                type="button"
                onClick={() => setListFilter('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all whitespace-nowrap cursor-pointer ${
                  listFilter === 'all'
                    ? 'bg-[#0066cc] text-white border-[#0066cc] font-bold shadow-xs'
                    : 'bg-white text-[#4b5563] border-[#e5e7eb] hover:bg-[#f8fafc]'
                }`}
              >
                ทั้งหมด ({historyData.length} วัน)
              </button>
              <button
                type="button"
                onClick={() => setListFilter('complete')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all whitespace-nowrap flex items-center gap-1 cursor-pointer ${
                  listFilter === 'complete'
                    ? 'bg-[#16a34a] text-white border-[#16a34a] font-bold shadow-xs'
                    : 'bg-white text-[#16a34a] border-[#86efac] hover:bg-[#f0fdf4]'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>ทานครบ 100% ({historyData.filter((d) => d.status === 'complete').length})</span>
              </button>
              <button
                type="button"
                onClick={() => setListFilter('missed')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all whitespace-nowrap flex items-center gap-1 cursor-pointer ${
                  listFilter === 'missed'
                    ? 'bg-[#dc2626] text-white border-[#dc2626] font-bold shadow-xs'
                    : 'bg-white text-[#dc2626] border-[#fecaca] hover:bg-[#fef2f2]'
                }`}
              >
                <AlertCircle className="w-3.5 h-3.5" />
                <span>มีมื้อที่ลืมทาน ({historyData.filter((d) => d.status !== 'complete').length})</span>
              </button>
            </div>

            <span className="text-xs text-[#6b7280]">
              หน้าละ 3 วัน
            </span>
          </div>

          {/* List Cards */}
          <div className="space-y-2.5">
            {paginatedListDays.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 border border-[#e5e7eb] text-center text-[#6b7280]">
                ไม่พบข้อมูลบันทึกในหมวดนี้
              </div>
            ) : (
              paginatedListDays.map((day) => (
                <div
                  key={day.dateString}
                  className={`bg-white rounded-2xl p-4 border transition-all shadow-xs space-y-2.5 ${
                    day.isToday ? 'border-[#0066cc] ring-1 ring-[#0066cc]/30' : 'border-[#e5e7eb]'
                  }`}
                >
                  {/* Date Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs ${
                          day.status === 'complete'
                            ? 'bg-[#dcfce7] text-[#16a34a]'
                            : day.status === 'partial'
                            ? 'bg-[#fef3c7] text-[#b45309]'
                            : 'bg-[#fee2e2] text-[#dc2626]'
                        }`}
                      >
                        {day.dayNumber}
                      </div>
                      <div>
                        <h3 className={`font-bold text-[#111827] ${seniorMode ? 'text-lg' : 'text-sm'}`}>
                          {day.displayDate}
                        </h3>
                        <span className="text-xs text-[#6b7280]">
                          วัน{day.dayOfWeek} {day.isToday && '• วันนี้'}
                        </span>
                      </div>
                    </div>

                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-xl ${
                        day.status === 'complete'
                          ? 'bg-[#dcfce7] text-[#16a34a] border border-[#86efac]'
                          : 'bg-[#fee2e2] text-[#dc2626] border border-[#fecaca]'
                      }`}
                    >
                      {day.status === 'complete'
                        ? 'ทานครบทุกมื้อ'
                        : `ลืมทาน ${day.missedDoses} มื้อ`}
                    </span>
                  </div>

                  {/* Doses List inside Date */}
                  <div className="space-y-1.5 pt-1 border-t border-[#f1f5f9]">
                    {day.doses.map((dose) => (
                      <div
                        key={dose.id}
                        className="flex items-center justify-between text-xs py-1 px-1.5 rounded-lg hover:bg-[#f8fafc]"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="text-[10px] text-[#6b7280] w-12 shrink-0">
                            {dose.scheduledTime}
                          </span>
                          <span className={`font-medium truncate ${seniorMode ? 'text-sm' : 'text-xs'}`}>
                            {dose.drugName} ({dose.dose})
                          </span>
                        </div>

                        <div className="shrink-0 pl-2">
                          {dose.status === 'taken' ? (
                            <span className="text-[#16a34a] text-xs font-semibold flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5 text-[#16a34a]" />
                              <span>ทานแล้ว {dose.takenAt}</span>
                            </span>
                          ) : (
                            <span className="text-[#dc2626] text-xs font-semibold flex items-center gap-1">
                              <XCircle className="w-3.5 h-3.5 text-[#dc2626]" />
                              <span>ลืมทาน</span>
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pagination Navigation Bar */}
          {totalRecords > 0 && (
            <div className="bg-white rounded-2xl p-3 border border-[#e5e7eb] flex flex-col sm:flex-row items-center justify-between gap-3 shadow-2xs">
              <span className="text-xs text-[#6b7280]">
                แสดง {startIndexDisplay}-{endIndexDisplay} จากทั้งหมด {totalRecords} วัน
              </span>

              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={validCurrentPage <= 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  leftIcon={<ChevronLeft className="w-4 h-4" />}
                >
                  ย้อนกลับ
                </Button>

                <span className={`text-xs font-bold text-[#111827] px-2 ${seniorMode ? 'text-sm' : ''}`}>
                  หน้า {validCurrentPage} จาก {totalPages}
                </span>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={validCurrentPage >= totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  rightIcon={<ChevronRight className="w-4 h-4" />}
                >
                  ถัดไป
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 5. Clinical Pharmacist Insight Card */}
      <div className="bg-[#ffffff] rounded-3xl p-4 sm:p-5 border border-[#e5e7eb] space-y-2 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-bold text-[#0066cc] uppercase tracking-wider">
          <TrendingUp className="w-4 h-4 text-[#0066cc]" />
          <span>บทวิเคราะห์ความสม่ำเสมอจากเภสัชกร</span>
        </div>
        <p className={`text-[#374151] leading-relaxed ${seniorMode ? 'text-base' : 'text-xs'}`}>
          อัตราการรับประทานยา <strong>{metrics.overallPercentage}%</strong> ในช่วง 30 วันที่ผ่านมา ถือว่าอยู่ในเกณฑ์ดีเยี่ยม (ความต่อเนื่อง &gt; 80%) ช่วยให้ระดับความดันโลหิตและน้ำตาลในเลือดคงที่อย่างมีนัยสำคัญ สถิติระบุว่ามื้อที่ลืมทานส่วนใหญ่เป็นมื้อเย็น แนะนำให้เปิดการแจ้งเตือนเสียง <strong>17:30 น.</strong> สม่ำเสมอครับ
        </p>
      </div>
    </div>
  );
};
