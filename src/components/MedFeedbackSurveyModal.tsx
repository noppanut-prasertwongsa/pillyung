import React, { useState, useEffect } from 'react';
import { ScheduledDose } from '../types';
import {
  Pill,
  Wind,
  CheckCircle2,
  X,
  AlertCircle,
  Sparkles,
  ShieldCheck,
  Check,
  HeartPulse,
  ThumbsUp,
  Clock,
  HelpCircle,
} from 'lucide-react';
import { Button } from './ui/Button';

export interface SurveyAnswerRecord {
  doseId: string;
  drugName: string;
  question: string;
  selectedChoice: string;
  answeredAt: string;
  symptomAnswer?: string;
  convenienceAnswer?: string;
  adherenceAnswer?: string;
}

export interface QuestionDefinition {
  id: string;
  title: string;
  description: string;
  category: 'symptoms' | 'convenience' | 'adherence';
  normalIndex: number;
  options: {
    label: string;
    isNormal?: boolean;
    isWarning?: boolean;
  }[];
}

export const DETERMINISTIC_SURVEY_QUESTIONS: QuestionDefinition[] = [
  {
    id: 'q1-symptoms',
    title: '1. อาการหลังรับประทานยา',
    description: 'ท่านพบอาการผิดปกติหรือผลข้างเคียงใดๆ หรือไม่',
    category: 'symptoms',
    normalIndex: 0,
    options: [
      { label: 'ปกติ ไม่มีอาการผิดปกติใดๆ', isNormal: true },
      { label: 'มีอาการคลื่นไส้ แน่นท้อง หรือวิงเวียนเล็กน้อย', isWarning: false },
      { label: 'มีผื่นคัน ปากบวม หรืออาการผิดปกติรุนแรง', isWarning: true },
    ],
  },
  {
    id: 'q2-convenience',
    title: '2. ความสะดวกในการใช้ยา',
    description: 'ท่านมีอุปสรรคหรือความยากลำบากในการรับประทาน/ใช้ยาหรือไม่',
    category: 'convenience',
    normalIndex: 0,
    options: [
      { label: 'สะดวกดี ไม่มีปัญหาในการใช้ยา', isNormal: true },
      { label: 'เม็ดยาใหญ่ กลืนค่อนข้างยาก / ยามีรสขม', isWarning: false },
      { label: 'แกะหรือเปิดบรรจุภัณฑ์ลำบาก / อุปกรณ์ใช้ยาก', isWarning: false },
    ],
  },
  {
    id: 'q3-adherence',
    title: '3. การใช้ยาตามแผนการรักษา',
    description: 'ท่านได้รับประทานยาตรงเวลาตามคำแนะนำของแพทย์/เภสัชกรหรือไม่',
    category: 'adherence',
    normalIndex: 0,
    options: [
      { label: 'รับประทานตรงเวลาตามแผนครบถ้วน', isNormal: true },
      { label: 'รับประทานช้ากว่าเวลาปกติเล็กน้อย', isWarning: false },
      { label: 'ลืมรับประทานยาในมื้อก่อนหน้า', isWarning: true },
    ],
  },
];

// Helper to check if drug is inhaler/spray vs pill
export const isDrugInhalerOrSpray = (drugName: string, drugId?: string): boolean => {
  const name = drugName.toLowerCase();
  return (
    name.includes('ventolin') ||
    name.includes('evohaler') ||
    name.includes('พ่น') ||
    name.includes('สูด') ||
    name.includes('inhaler') ||
    name.includes('spray') ||
    drugId === 'DRUG-006'
  );
};

interface MedFeedbackSurveyModalProps {
  isOpen: boolean;
  dose: ScheduledDose | null;
  seniorMode?: boolean;
  onClose: () => void;
  onConfirmAnswer: (doseId: string, answer: SurveyAnswerRecord) => void;
}

export const MedFeedbackSurveyModal: React.FC<MedFeedbackSurveyModalProps> = ({
  isOpen,
  dose,
  seniorMode = false,
  onClose,
  onConfirmAnswer,
}) => {
  // Answers for the 3 questions: indexes 0, 1, or 2
  const [symptomIndex, setSymptomIndex] = useState<number | null>(null);
  const [convenienceIndex, setConvenienceIndex] = useState<number | null>(null);
  const [adherenceIndex, setAdherenceIndex] = useState<number | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Reset when opened with a new dose
  useEffect(() => {
    if (isOpen && dose) {
      setSymptomIndex(null);
      setConvenienceIndex(null);
      setAdherenceIndex(null);
      setIsSubmitting(false);
      setValidationError(null);
    }
  }, [isOpen, dose]);

  if (!isOpen || !dose) return null;

  const isInhaler = isDrugInhalerOrSpray(dose.drugName, dose.drugId);

  // Shortcut: "วันนี้ใช้ยาปกติ"
  const handleApplyNormalShortcut = () => {
    setSymptomIndex(0); // "ปกติ ไม่มีอาการผิดปกติใดๆ"
    setConvenienceIndex(0); // "สะดวกดี ไม่มีปัญหาในการใช้ยา"
    setAdherenceIndex(0); // "รับประทานตรงเวลาตามแผนครบถ้วน"
    setValidationError(null);
  };

  const isAllAnswered =
    symptomIndex !== null && convenienceIndex !== null && adherenceIndex !== null;

  const handleSubmit = () => {
    if (!isAllAnswered) {
      setValidationError('กรุณาตอบคำถามให้ครบทั้ง 3 ข้อก่อนยืนยันการบันทึกยา');
      return;
    }

    setIsSubmitting(true);

    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(
      now.getMinutes()
    ).padStart(2, '0')} น.`;

    const q1 = DETERMINISTIC_SURVEY_QUESTIONS[0].options[symptomIndex].label;
    const q2 = DETERMINISTIC_SURVEY_QUESTIONS[1].options[convenienceIndex].label;
    const q3 = DETERMINISTIC_SURVEY_QUESTIONS[2].options[adherenceIndex].label;

    const answerRecord: SurveyAnswerRecord = {
      doseId: dose.id,
      drugName: dose.drugName,
      question: 'แบบประเมินการใช้ยา 3 ด้าน (อาการ, ความสะดวก, ความสม่ำเสมอ)',
      selectedChoice: `${q1.split(' ')[0]} / ${q2.split(' ')[0]} / ${q3.split(' ')[0]}`,
      answeredAt: timeStr,
      symptomAnswer: q1,
      convenienceAnswer: q2,
      adherenceAnswer: q3,
    };

    setTimeout(() => {
      onConfirmAnswer(dose.id, answerRecord);
      setIsSubmitting(false);
    }, 200);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="survey-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div
        className={`relative w-full max-w-lg bg-[#ffffff] rounded-3xl shadow-2xl border border-[#e5e7eb] overflow-hidden flex flex-col max-h-[94vh] ${
          seniorMode ? 'senior-mode-active' : ''
        }`}
      >
        {/* Header Bar */}
        <div className="bg-[#0066cc] text-white p-4 sm:p-5 shrink-0">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0">
                {isInhaler ? (
                  <Wind className="w-5 h-5 text-white" />
                ) : (
                  <Pill className="w-5 h-5 text-white" />
                )}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[11px] font-bold tracking-wide uppercase px-2.5 py-0.5 rounded-full bg-white/20 text-white">
                    {isInhaler ? 'ยาสูดพ่นทางปาก' : 'ยารับประทานชนิดเม็ด'}
                  </span>
                  <span className="text-[11px] text-white/80 font-medium">
                    แบบประเมินสุขภาพประจำวัน
                  </span>
                </div>
                <h2
                  id="survey-modal-title"
                  className={`font-black tracking-tight text-white mt-1 leading-snug break-words ${
                    seniorMode ? 'text-xl sm:text-2xl' : 'text-lg sm:text-xl'
                  }`}
                >
                  แบบประเมินการใช้ยา: {dose.drugName}
                </h2>
              </div>
            </div>

            {/* Close button */}
            <button
              type="button"
              onClick={onClose}
              title="ปิดและยกเลิก (ยังไม่บันทึกการกินยา)"
              aria-label="ปิดหน้าต่าง"
              className="p-2 rounded-xl bg-white/15 hover:bg-white/25 text-white transition-colors shrink-0 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="mt-2.5 text-xs text-white/90 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 shrink-0 text-cyan-200" />
            <span>โปรดตอบแบบประเมิน 3 ข้อ หรือกดทางลัดหากทานยาได้ตามปกติ</span>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5">
          {/* Prominent Shortcut Banner: "วันนี้ใช้ยาปกติ" */}
          <div className="bg-[#f0f7ff] border-2 border-[#0066cc] rounded-2xl p-4 shadow-sm">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs font-bold text-[#0066cc] uppercase tracking-wider flex items-center gap-1.5 mb-1">
                  <ThumbsUp className="w-4 h-4" />
                  <span>ทางลัดบันทึกด่วน</span>
                </span>
                <p className={`font-bold text-[#111827] leading-snug ${seniorMode ? 'text-lg' : 'text-sm'}`}>
                  หากวันนี้รับประทานยาได้ตามปกติ ไม่มีอาการผิดปกติ
                </p>
                <p className="text-xs text-[#6b7280] mt-0.5">
                  แตะปุ่มนี้เพื่อกรอกคำตอบปกติให้ทั้ง 3 ข้อ โดยท่านยังสามารถแก้ไขได้ก่อนยืนยัน
                </p>
              </div>

              <Button
                type="button"
                variant="primary"
                size={seniorMode ? 'md' : 'sm'}
                onClick={handleApplyNormalShortcut}
                leftIcon={<Check className="w-4 h-4 stroke-[3]" />}
                className="shrink-0 whitespace-nowrap shadow-md"
              >
                วันนี้ใช้ยาปกติ
              </Button>
            </div>
          </div>

          {/* Validation alert if user tries to submit without completing */}
          {validationError && (
            <div className="bg-[#fff1f2] border border-[#f43f5e]/40 rounded-xl p-3 flex items-start gap-2.5 text-xs text-[#be123c]">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-[#e11d48]" />
              <p className="font-semibold leading-relaxed">{validationError}</p>
            </div>
          )}

          {/* Question 1: อาการหลังรับประทานยา */}
          <div className="space-y-2.5 bg-[#ffffff] border border-[#e5e7eb] rounded-2xl p-4 shadow-2xs">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#e8f1fa] text-[#0066cc] flex items-center justify-center font-bold text-xs shrink-0">
                1
              </div>
              <div>
                <h3 className={`font-black text-[#111827] leading-tight ${seniorMode ? 'text-lg' : 'text-sm sm:text-base'}`}>
                  อาการหลังรับประทานยา
                </h3>
                <p className="text-xs text-[#6b7280]">
                  ท่านพบอาการผิดปกติหรือผลข้างเคียงใดๆ หรือไม่
                </p>
              </div>
            </div>

            <div className="space-y-2 pt-1">
              {DETERMINISTIC_SURVEY_QUESTIONS[0].options.map((opt, idx) => {
                const isSelected = symptomIndex === idx;
                return (
                  <button
                    key={`q1-opt-${idx}`}
                    type="button"
                    onClick={() => {
                      setSymptomIndex(idx);
                      setValidationError(null);
                    }}
                    className={`w-full text-left rounded-xl border-2 transition-all p-3 flex items-center justify-between gap-3 cursor-pointer ${
                      isSelected
                        ? opt.isWarning
                          ? 'bg-[#fff1f2] border-[#e11d48] text-[#9f1239]'
                          : 'bg-[#e8f1fa] border-[#0066cc] text-[#0066cc] shadow-xs'
                        : 'bg-[#ffffff] border-[#e5e7eb] hover:border-[#9ca3af] text-[#1f2937]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${
                          isSelected
                            ? opt.isWarning
                              ? 'border-[#e11d48] bg-[#e11d48] text-white'
                              : 'border-[#0066cc] bg-[#0066cc] text-white'
                            : 'border-[#d1d5db] bg-white'
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </span>
                      <span className={`font-semibold leading-snug break-words ${seniorMode ? 'text-base' : 'text-xs sm:text-sm'}`}>
                        {opt.label}
                      </span>
                    </div>

                    {opt.isWarning && isSelected && (
                      <span className="text-[10px] bg-[#e11d48] text-white px-2 py-0.5 rounded-full font-bold shrink-0">
                        ควรปรึกษาแพทย์
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Question 2: ความสะดวกในการใช้ยา */}
          <div className="space-y-2.5 bg-[#ffffff] border border-[#e5e7eb] rounded-2xl p-4 shadow-2xs">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#e8f1fa] text-[#0066cc] flex items-center justify-center font-bold text-xs shrink-0">
                2
              </div>
              <div>
                <h3 className={`font-black text-[#111827] leading-tight ${seniorMode ? 'text-lg' : 'text-sm sm:text-base'}`}>
                  ความสะดวกในการใช้ยา
                </h3>
                <p className="text-xs text-[#6b7280]">
                  ท่านมีอุปสรรคหรือความยากลำบากในการรับประทาน/ใช้ยาหรือไม่
                </p>
              </div>
            </div>

            <div className="space-y-2 pt-1">
              {DETERMINISTIC_SURVEY_QUESTIONS[1].options.map((opt, idx) => {
                const isSelected = convenienceIndex === idx;
                return (
                  <button
                    key={`q2-opt-${idx}`}
                    type="button"
                    onClick={() => {
                      setConvenienceIndex(idx);
                      setValidationError(null);
                    }}
                    className={`w-full text-left rounded-xl border-2 transition-all p-3 flex items-center justify-between gap-3 cursor-pointer ${
                      isSelected
                        ? 'bg-[#e8f1fa] border-[#0066cc] text-[#0066cc] shadow-xs'
                        : 'bg-[#ffffff] border-[#e5e7eb] hover:border-[#9ca3af] text-[#1f2937]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${
                          isSelected
                            ? 'border-[#0066cc] bg-[#0066cc] text-white'
                            : 'border-[#d1d5db] bg-white'
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </span>
                      <span className={`font-semibold leading-snug break-words ${seniorMode ? 'text-base' : 'text-xs sm:text-sm'}`}>
                        {opt.label}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Question 3: การใช้ยาตามแผน */}
          <div className="space-y-2.5 bg-[#ffffff] border border-[#e5e7eb] rounded-2xl p-4 shadow-2xs">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#e8f1fa] text-[#0066cc] flex items-center justify-center font-bold text-xs shrink-0">
                3
              </div>
              <div>
                <h3 className={`font-black text-[#111827] leading-tight ${seniorMode ? 'text-lg' : 'text-sm sm:text-base'}`}>
                  การใช้ยาตามแผนการรักษา
                </h3>
                <p className="text-xs text-[#6b7280]">
                  ท่านได้รับประทานยาตรงเวลาตามคำแนะนำของแพทย์/เภสัชกรหรือไม่
                </p>
              </div>
            </div>

            <div className="space-y-2 pt-1">
              {DETERMINISTIC_SURVEY_QUESTIONS[2].options.map((opt, idx) => {
                const isSelected = adherenceIndex === idx;
                return (
                  <button
                    key={`q3-opt-${idx}`}
                    type="button"
                    onClick={() => {
                      setAdherenceIndex(idx);
                      setValidationError(null);
                    }}
                    className={`w-full text-left rounded-xl border-2 transition-all p-3 flex items-center justify-between gap-3 cursor-pointer ${
                      isSelected
                        ? opt.isWarning
                          ? 'bg-[#fff7ed] border-[#ea580c] text-[#c2410c]'
                          : 'bg-[#e8f1fa] border-[#0066cc] text-[#0066cc] shadow-xs'
                        : 'bg-[#ffffff] border-[#e5e7eb] hover:border-[#9ca3af] text-[#1f2937]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${
                          isSelected
                            ? opt.isWarning
                              ? 'border-[#ea580c] bg-[#ea580c] text-white'
                              : 'border-[#0066cc] bg-[#0066cc] text-white'
                            : 'border-[#d1d5db] bg-white'
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </span>
                      <span className={`font-semibold leading-snug break-words ${seniorMode ? 'text-base' : 'text-xs sm:text-sm'}`}>
                        {opt.label}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Safety rule reminder */}
          <div className="bg-[#fefce8] border border-[#facc15]/60 rounded-xl p-3 flex items-start gap-2.5 text-xs text-[#854d0e]">
            <AlertCircle className="w-4 h-4 shrink-0 text-[#ca8a04] mt-0.5" />
            <p className="leading-relaxed">
              <strong>ข้อปฏิบัติ:</strong> เมื่อตอบคำถามครบทั้ง 3 ข้อและกดยืนยัน ระบบจะบันทึกสถานะ{' '}
              <span className="font-bold text-[#16a34a]">"ทานแล้วเรียบร้อย"</span> และนำข้อมูลไปวิเคราะห์ความปลอดภัยในการใช้ยา
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 bg-[#f8fafc] border-t border-[#e5e7eb] flex flex-col sm:flex-row items-center gap-2.5 shrink-0">
          <Button
            type="button"
            variant="outline"
            size={seniorMode ? 'lg' : 'md'}
            onClick={onClose}
            className="w-full sm:w-1/3 text-xs sm:text-sm"
          >
            ยกเลิก (ยังไม่บันทึก)
          </Button>

          <Button
            type="button"
            variant="primary"
            size={seniorMode ? 'lg' : 'md'}
            disabled={!isAllAnswered || isSubmitting}
            onClick={handleSubmit}
            leftIcon={<CheckCircle2 className="w-5 h-5" />}
            className="w-full sm:w-2/3"
          >
            {isAllAnswered
              ? 'บันทึกคำตอบ & ยืนยันการทานยา'
              : 'โปรดตอบให้ครบทั้ง 3 ข้อก่อนยืนยัน'}
          </Button>
        </div>
      </div>
    </div>
  );
};
