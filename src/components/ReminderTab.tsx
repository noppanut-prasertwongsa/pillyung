import React, { useState } from 'react';
import { ScheduledDose } from '../types';
import {
  Check,
  Clock,
  Sun,
  Sunset,
  Moon,
  Sparkles,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Bell,
  Sunrise,
} from 'lucide-react';
import {
  MedFeedbackSurveyModal,
  SurveyAnswerRecord,
} from './MedFeedbackSurveyModal';
import { Button } from './ui/Button';

interface ReminderTabProps {
  schedule: ScheduledDose[];
  onToggleTaken: (doseId: string) => void;
  seniorMode: boolean;
  onOpenAlarmDemo?: () => void;
  onSurveyAnswer?: (answer: SurveyAnswerRecord) => void;
}

export const ReminderTab: React.FC<ReminderTabProps> = ({
  schedule,
  onToggleTaken,
  seniorMode,
  onOpenAlarmDemo,
  onSurveyAnswer,
}) => {
  // Survey popup state: questionnaire before marking dose as taken
  const [surveyDose, setSurveyDose] = useState<ScheduledDose | null>(null);

  // Accordion collapsed/expanded state for meals
  // Default: Expand all meals that have active medications
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    morning: true,
    noon: true,
    evening: true,
    bedtime: true,
  });

  const toggleSection = (mealKey: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [mealKey]: !prev[mealKey],
    }));
  };

  const totalDoses = schedule.length;
  const takenCount = schedule.filter((d) => d.taken).length;
  const percentage = totalDoses > 0 ? Math.round((takenCount / totalDoses) * 100) : 0;

  // Intercept "กดบันทึกการกินยา" to roll questionnaire
  const handleRecordDoseClick = (dose: ScheduledDose) => {
    // If dose is already taken, allow untoggling directly without survey
    if (dose.taken) {
      onToggleTaken(dose.id);
      return;
    }

    // 1-in-3 chance (approx 33.3%) to popup the questionnaire
    const shouldTriggerSurvey = Math.random() < 0.4;

    if (shouldTriggerSurvey) {
      setSurveyDose(dose);
    } else {
      onToggleTaken(dose.id);
    }
  };

  // Called when user completes the 3-question survey and confirms
  const handleConfirmSurvey = (doseId: string, answer: SurveyAnswerRecord) => {
    setSurveyDose(null);
    onSurveyAnswer?.(answer);
    onToggleTaken(doseId);
  };

  const handleCloseSurvey = () => {
    setSurveyDose(null);
  };


  // Group by meal
  const morningDoses = schedule.filter((d) => d.meal === 'morning');
  const noonDoses = schedule.filter((d) => d.meal === 'noon');
  const eveningDoses = schedule.filter((d) => d.meal === 'evening');
  const bedtimeDoses = schedule.filter((d) => d.meal === 'bedtime');

  const renderMealGroup = (
    mealKey: 'morning' | 'noon' | 'evening' | 'bedtime',
    title: string,
    timeLabel: string,
    icon: React.ReactNode,
    doses: ScheduledDose[]
  ) => {
    if (doses.length === 0) return null;

    const isExpanded = !!expandedSections[mealKey];
    const takenInGroup = doses.filter((d) => d.taken).length;
    const isAllTaken = takenInGroup === doses.length && doses.length > 0;
    const sectionId = `schedule-section-${mealKey}`;
    const headerId = `schedule-header-${mealKey}`;

    return (
      <div className="w-full bg-[#ffffff] rounded-3xl border border-[#e5e7eb] shadow-xs overflow-hidden transition-all">
        {/* Collapsible Accordion Header */}
        <button
          id={headerId}
          type="button"
          aria-expanded={isExpanded}
          aria-controls={sectionId}
          onClick={() => toggleSection(mealKey)}
          className={`w-full p-4 sm:p-5 flex items-center justify-between gap-3 text-left transition-colors cursor-pointer select-none ${
            isExpanded ? 'bg-[#f8fafc] border-b border-[#e5e7eb]' : 'hover:bg-[#f8fafc]'
          }`}
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className={`p-2 rounded-2xl shrink-0 flex items-center justify-center ${
              isAllTaken ? 'bg-[#dcfce7] text-[#16a34a]' : 'bg-[#e8f1fa] text-[#0066cc]'
            }`}>
              {icon}
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className={`font-black text-[#111827] tracking-tight ${
                    seniorMode ? 'text-xl sm:text-2xl' : 'text-base sm:text-lg'
                  }`}
                >
                  {title}
                </span>

                <span
                  className={`font-bold px-2.5 py-0.5 rounded-full text-xs ${
                    isAllTaken
                      ? 'bg-[#dcfce7] text-[#16a34a]'
                      : 'bg-[#f1f5f9] text-[#475569]'
                  }`}
                >
                  ทานแล้ว {takenInGroup}/{doses.length} รายการ
                </span>
              </div>

              <span className={`text-xs text-[#6b7280] block mt-0.5 ${seniorMode ? 'text-sm' : ''}`}>
                {timeLabel}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs text-[#6b7280] hidden sm:inline font-medium">
              {isExpanded ? 'ย่อเนื้อหา' : 'ขยายดูยา'}
            </span>
            <div className="w-8 h-8 rounded-full bg-white border border-[#e5e7eb] flex items-center justify-center text-[#4b5563]">
              {isExpanded ? (
                <ChevronUp className="w-4 h-4 stroke-[2.5]" />
              ) : (
                <ChevronDown className="w-4 h-4 stroke-[2.5]" />
              )}
            </div>
          </div>
        </button>

        {/* Collapsible Content Area */}
        {isExpanded && (
          <div
            id={sectionId}
            role="region"
            aria-labelledby={headerId}
            className="p-4 sm:p-5 space-y-3.5 bg-white animate-in fade-in duration-150"
          >
            {doses.map((dose) => {
              // Extract mg strength if present (e.g., '5 mg', '500 mg', 'มก.')
              const mgMatch = dose.drugName.match(/(\d+(?:\.\d+)?\s*(?:mg|มก\.))/i);
              const mgTag = mgMatch ? mgMatch[1] : null;
              const cleanDrugName = mgMatch ? dose.drugName.replace(mgMatch[0], '').trim() : dose.drugName;

              return (
                <div
                  key={dose.id}
                  className={`rounded-2xl border transition-all w-full p-4 ${
                    dose.taken
                      ? 'bg-[#f0fdf4] border-[#86efac] text-[#111827]'
                      : 'bg-[#ffffff] border-[#e5e7eb] shadow-2xs hover:border-[#b8d5f2]'
                  }`}
                >
                  <div className="flex flex-col space-y-3 w-full">
                    {/* Row 1: Drug Name & mg Tag (like in MyMedicationTab) & Dose Badge */}
                    <div className="flex items-start justify-between gap-3 w-full">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4
                            className={`font-black tracking-tight leading-snug break-words ${
                              seniorMode ? 'text-xl sm:text-2xl' : 'text-base sm:text-lg'
                            } ${dose.taken ? 'line-through text-[#6b7280]' : 'text-[#111827]'}`}
                          >
                            {cleanDrugName}
                          </h4>
                          {mgTag && (
                            <span
                              className={`font-bold bg-[#0066cc]/10 text-[#0066cc] rounded-full shrink-0 ${
                                seniorMode ? 'text-xs sm:text-sm px-2.5 py-0.5' : 'text-xs px-2.5 py-0.5'
                              }`}
                            >
                              {mgTag}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Dosage Badge (e.g. 1 เม็ด / 2 สูด) */}
                      <div className="shrink-0">
                        <span
                          className={`font-bold tracking-tight inline-flex items-center justify-center rounded-xl ${
                            seniorMode
                              ? 'text-base sm:text-lg bg-[#f1f5f9] text-[#1f2937] border border-[#e2e8f0] px-3 py-1'
                              : 'text-xs text-[#4b5563] font-bold bg-[#f1f5f9] px-2.5 py-1'
                          }`}
                        >
                          {dose.dose}
                        </span>
                      </div>
                    </div>

                  {/* Row 2: Instructions */}
                  <div
                    className={`rounded-xl leading-relaxed ${
                      seniorMode
                        ? 'bg-[#f8fafc] p-3 text-base font-medium text-[#1f2937]'
                        : 'text-xs text-[#4b5563]'
                    }`}
                  >
                    <p className="break-words">{dose.instructions}</p>
                  </div>

                  {dose.taken && dose.takenAt && (
                    <div className="text-[#16a34a] font-bold flex items-center gap-1.5 text-xs">
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span>บันทึกแล้วเมื่อ {dose.takenAt}</span>
                    </div>
                  )}

                  {/* Row 3: Action Toggle Button */}
                  <Button
                    type="button"
                    variant={dose.taken ? 'secondary' : 'primary'}
                    size={seniorMode ? 'lg' : 'md'}
                    fullWidth
                    seniorMode={seniorMode}
                    onClick={() => handleRecordDoseClick(dose)}
                    leftIcon={
                      dose.taken ? (
                        <Check className="w-5 h-5 stroke-[3]" />
                      ) : (
                        <Clock className="w-5 h-5" />
                      )
                    }
                    className={dose.taken ? '!bg-[#dcfce7] !text-[#16a34a] !border-[#86efac]' : ''}
                  >
                    {dose.taken ? 'ทานแล้วเรียบร้อย' : 'กดบันทึกการกินยา'}
                  </Button>
                </div>
              </div>
            );
          })}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`p-4 space-y-4 w-full ${seniorMode ? 'senior-mode-active' : ''}`}>
      {/* Simulated 17:30 iOS Alarm Card (Placed above Compliance Card as requested) */}
      {onOpenAlarmDemo && (
        <div className="w-full bg-gradient-to-r from-[#eff6ff] via-[#f4f9ff] to-[#f0fdf4] border-2 border-[#0066cc]/25 hover:border-[#0066cc] rounded-2xl p-4 shadow-xs transition-all flex items-center justify-between gap-3 text-left">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-11 h-11 rounded-2xl bg-[#0066cc] text-white flex items-center justify-center shadow-md shadow-blue-500/20 shrink-0">
              <Bell className="w-5 h-5 text-white animate-bounce" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className={`font-black text-[#111827] leading-snug ${seniorMode ? 'text-lg sm:text-xl' : 'text-sm sm:text-base'}`}>
                  จำลองเวลา 17:30 น. (แจ้งเตือนมื้อเย็น)
                </span>
                <span className="text-[10px] bg-[#dbeafe] text-[#0066cc] border border-[#bfdbfe] px-2 py-0.5 rounded-full font-bold">
                  ระบบเตือนอัตโนมัติ
                </span>
              </div>
              <p className={`text-[#4b5563] mt-0.5 leading-snug line-clamp-1 ${seniorMode ? 'text-sm' : 'text-xs'}`}>
                แตะเพื่อทดสอบหน้าต่างแจ้งเตือนเต็มจอ พร้อมเสียงเตือนและแถบเลื่อนยืนยัน
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onOpenAlarmDemo}
            className="bg-[#0066cc] hover:bg-[#0052a3] text-white px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 shadow-xs flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer"
          >
            <span>ทดสอบ</span>
          </button>
        </div>
      )}

      {/* Progress & Compliance Tracker Card (ความสม่ำเสมอการทานยาวันนี้) */}
      <div
        className={`bg-[#ffffff] rounded-3xl border border-[#e5e7eb] shadow-xs w-full ${
          seniorMode ? 'p-5 sm:p-6' : 'p-4 sm:p-5'
        }`}
      >
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0 flex-1">
            <span
              className={`font-bold text-[#0066cc] uppercase tracking-wider flex items-center gap-1.5 ${
                seniorMode ? 'text-sm' : 'text-xs'
              }`}
            >
              <Sparkles className="w-4 h-4 shrink-0 text-[#0066cc]" />
              <span>ความสม่ำเสมอการทานยาวันนี้</span>
            </span>

            <h2
              className={`${
                seniorMode ? 'text-2xl sm:text-3xl' : 'text-xl'
              } font-black text-[#111827] tracking-tight mt-1 leading-snug break-words`}
            >
              ทานแล้ว {takenCount} จาก {totalDoses} รายการ
            </h2>

            <p className={`text-[#6b7280] mt-1 leading-relaxed ${seniorMode ? 'text-base' : 'text-xs'}`}>
              {percentage === 100
                ? 'ยอดเยี่ยมมาก วันนี้ท่านรับประทานยาครบทุกมื้อแล้ว'
                : 'รับประทานยาตรงเวลาช่วยควบคุมโรคและส่งเสริมสุขภาพอย่างต่อเนื่อง'}
            </p>
          </div>

          {/* Radial Progress Counter */}
          <div
            className={`rounded-full bg-[#f8fafc] border-4 border-[#0066cc] flex items-center justify-center font-black text-[#0066cc] shrink-0 ${
              seniorMode ? 'w-16 h-16 text-lg sm:text-xl' : 'w-14 h-14 text-sm'
            }`}
          >
            {percentage}%
          </div>
        </div>

        {/* Progress Bar */}
        <div
          className={`w-full bg-[#e5e7eb] rounded-full mt-4 overflow-hidden ${
            seniorMode ? 'h-3.5' : 'h-2.5'
          }`}
        >
          <div
            className={`bg-[#0066cc] rounded-full transition-all duration-500 ease-out ${
              seniorMode ? 'h-3.5' : 'h-2.5'
            }`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>


      {/* Collapsible Medication Schedule Sections */}
      <div className="space-y-3.5 w-full">
        {renderMealGroup(
          'morning',
          'มื้อเช้า',
          '08:00 น. หลังอาหารเช้า',
          <Sunrise className="w-5 h-5" />,
          morningDoses
        )}

        {renderMealGroup(
          'noon',
          'มื้อกลางวัน',
          '12:00 น. หลังอาหารกลางวัน',
          <Sun className="w-5 h-5" />,
          noonDoses
        )}

        {renderMealGroup(
          'evening',
          'มื้อเย็น',
          '18:00 น. หลังอาหารเย็น',
          <Sunset className="w-5 h-5" />,
          eveningDoses
        )}

        {renderMealGroup(
          'bedtime',
          'ก่อนนอน',
          '21:00 น. ก่อนเข้านอน',
          <Moon className="w-5 h-5" />,
          bedtimeDoses
        )}

        {totalDoses === 0 && (
          <div className="text-center py-12 bg-white rounded-3xl border border-[#e5e7eb] text-[#6b7280]">
            ไม่มีรายการยาที่ต้องรับประทานในวันนี้
          </div>
        )}
      </div>

      {/* Deterministic Feedback Questionnaire Modal */}
      <MedFeedbackSurveyModal
        isOpen={surveyDose !== null}
        dose={surveyDose}
        seniorMode={seniorMode}
        onClose={handleCloseSurvey}
        onConfirmAnswer={handleConfirmSurvey}
      />
    </div>
  );
};
