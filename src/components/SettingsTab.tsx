import React, { useState } from 'react';
import { UserProfile, SurveyAnswerRecord } from '../types';
import { User, ShieldAlert, Sliders, Volume2, BookOpen, RotateCcw, Activity, Bell, Megaphone, Stethoscope, ClipboardCheck, Trash2, CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react';

import { AlarmSoundType, playSingleAlarmSound } from '../utils/audioAlert';

interface SettingsTabProps {
  userProfile: UserProfile;
  seniorMode: boolean;
  setSeniorMode: (val: boolean) => void;
  highContrast: boolean;
  setHighContrast: (val: boolean) => void;
  soundAlerts: boolean;
  setSoundAlerts: (val: boolean) => void;
  alarmSoundType?: AlarmSoundType;
  setAlarmSoundType?: (sound: AlarmSoundType) => void;
  surveyLogs?: SurveyAnswerRecord[];
  onClearSurveyLogs?: () => void;
  onEditProfile: () => void;
  onResetAll: () => void;
  onOpenGuide: () => void;
}

export const SettingsTab: React.FC<SettingsTabProps> = ({
  userProfile,
  seniorMode,
  setSeniorMode,
  highContrast,
  setHighContrast,
  soundAlerts,
  setSoundAlerts,
  alarmSoundType = 'nene',
  setAlarmSoundType,
  surveyLogs = [],
  onClearSurveyLogs,
  onEditProfile,
  onResetAll,
  onOpenGuide,
}) => {
  const [surveyPage, setSurveyPage] = useState<number>(1);

  const heightM = userProfile.height / 100;
  const bmi = heightM > 0 ? (userProfile.weight / (heightM * heightM)).toFixed(1) : '-';

  const genderLabel =
    userProfile.gender === 'male'
      ? 'ชาย'
      : userProfile.gender === 'female'
      ? 'หญิง'
      : 'ไม่ระบุ';

  return (
    <div className={`p-4 sm:p-5 space-y-4 ${seniorMode ? 'text-lg' : 'text-base'}`}>
      {/* User Profile Card */}
      <div className={`bg-[#ffffff] rounded-3xl border border-[#e5e5ea] space-y-4 shadow-xs ${seniorMode ? 'p-6' : 'p-5'}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className={`rounded-full bg-[#f5f5f7] border border-[#e5e5ea] flex items-center justify-center text-[#0066cc] ${
              seniorMode ? 'w-16 h-16' : 'w-12 h-12'
            }`}>
              <User className={seniorMode ? 'w-8 h-8' : 'w-6 h-6'} />
            </div>
            <div>
              <h3 className={`${seniorMode ? 'text-2xl sm:text-3xl font-bold' : 'text-lg font-semibold'} text-[#1d1d1f]`}>
                {userProfile.name}
              </h3>
              <p className={`text-[#8e8e93] ${seniorMode ? 'text-base' : 'text-xs'}`}>
                อายุ {userProfile.age} ปี · เพศ {genderLabel}
              </p>
            </div>
          </div>

          <button
            onClick={onEditProfile}
            className={`text-[#0066cc] font-semibold hover:underline rounded-xl bg-[#f0f6ff] transition-colors ${
              seniorMode ? 'px-4 py-2 text-base' : 'px-3 py-1.5 text-xs'
            }`}
          >
            แก้ไขข้อมูล
          </button>
        </div>

        {/* BMI Row (Above Weight & Height) */}
        <div className="bg-[#f0f6ff] rounded-2xl p-3 border border-[#0066cc]/20 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#0066cc]/15 text-[#0066cc] flex items-center justify-center shrink-0">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <span className={`font-bold text-[#0066cc] block ${seniorMode ? 'text-base' : 'text-xs sm:text-sm'}`}>
                ดัชนีมวลกาย (BMI)
              </span>
              <span className="text-[11px] text-[#4b5563] block">
                คำนวณตามเกณฑ์สุขภาพมาตรฐาน
              </span>
            </div>
          </div>
          <div className="text-right shrink-0">
            <span className={`font-black text-[#0066cc] ${seniorMode ? 'text-2xl' : 'text-xl'}`}>
              {bmi}
            </span>
            <span className="text-xs text-[#6b7280] ml-1 font-medium">kg/m²</span>
          </div>
        </div>

        {/* Physical Stats Grid (Weight & Height below BMI) */}
        <div className="grid grid-cols-2 gap-2.5 pt-0.5">
          <div className="bg-[#f5f5f7] rounded-2xl p-3 text-center border border-[#e5e5ea]">
            <span className="text-[11px] text-[#8e8e93] block">น้ำหนัก</span>
            <span className={`font-bold text-[#1d1d1f] ${seniorMode ? 'text-xl' : 'text-sm'}`}>
              {userProfile.weight} กก.
            </span>
          </div>

          <div className="bg-[#f5f5f7] rounded-2xl p-3 text-center border border-[#e5e5ea]">
            <span className="text-[11px] text-[#8e8e93] block">ส่วนสูง</span>
            <span className={`font-bold text-[#1d1d1f] ${seniorMode ? 'text-xl' : 'text-sm'}`}>
              {userProfile.height} ซม.
            </span>
          </div>
        </div>

        {/* Allergy Summary Badge */}
        {userProfile.hasAllergy && userProfile.allergies.length > 0 ? (
          <div className="bg-[#fff1f0] border border-[#ff3b30]/30 rounded-2xl p-4 space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#d70015]">
              <ShieldAlert className="w-4 h-4" />
              <span>ประวัติการแพ้ยาที่บันทึกไว้ในระบบ:</span>
            </div>
            <div className={`font-bold text-[#1d1d1f] pl-5 ${seniorMode ? 'text-xl' : 'text-sm'}`}>
              {userProfile.allergies.join(', ')}
            </div>
            {userProfile.allergySymptoms && (
              <div className={`text-[#8e8e93] pl-5 ${seniorMode ? 'text-base' : 'text-xs'}`}>
                อาการ: {userProfile.allergySymptoms}
              </div>
            )}
          </div>
        ) : (
          <div className="bg-[#f2f9f4] border border-[#34c759]/30 rounded-2xl p-3.5 text-xs text-[#248a3d] font-semibold flex items-center gap-2">
            <span>✓ ไม่มีประวัติแพ้ยา (No Known Drug Allergy)</span>
          </div>
        )}
      </div>

      {/* Senior Accessibility Controls (Apple Style Toggles) */}
      <div className={`bg-[#ffffff] rounded-3xl border border-[#e5e5ea] space-y-4 shadow-xs ${seniorMode ? 'p-6' : 'p-5'}`}>
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#0066cc]">
          <Sliders className="w-4 h-4 text-[#0066cc]" />
          <span>การตั้งค่าสำหรับผู้สูงอายุ</span>
        </div>

        {/* Senior Mode Toggle */}
        <div className="flex items-center justify-between py-3 border-b border-[#f0f0f2]">
          <div className="space-y-1 pr-4 min-w-0 flex-1">
            <label
              htmlFor="settings-senior-toggle"
              className={`font-bold text-[#1d1d1f] cursor-pointer block leading-snug ${
                seniorMode ? 'text-xl sm:text-2xl text-[#0066cc]' : 'text-base'
              }`}
            >
              โหมดตัวหนังสือขนาดใหญ่พิเศษ
            </label>
            <p className={`text-[#6e6e73] leading-relaxed ${seniorMode ? 'text-base' : 'text-xs'}`}>
              ขยายขนาดตัวอักษรให้อ่านง่าย ชัดเจน สบายตาสำหรับผู้สูงอายุ
            </p>
          </div>
          <button
            id="settings-senior-toggle"
            role="switch"
            aria-checked={seniorMode}
            aria-label="โหมดตัวหนังสือขนาดใหญ่พิเศษ"
            onClick={() => setSeniorMode(!seniorMode)}
            className={`w-14 h-8 rounded-full transition-colors relative shrink-0 ${
              seniorMode ? 'bg-[#34c759]' : 'bg-[#e5e5ea]'
            }`}
          >
            <div
              className={`w-7 h-7 rounded-full bg-white shadow-md absolute top-0.5 transition-transform ${
                seniorMode ? 'translate-x-6' : 'translate-x-0.5'
              }`}
            />
          </button>
        </div>

        {/* High Contrast Toggle */}
        <div className="flex items-center justify-between py-3 border-b border-[#f0f0f2]">
          <div className="space-y-1 pr-4 min-w-0 flex-1">
            <label
              htmlFor="settings-contrast-toggle"
              className={`font-bold text-[#1d1d1f] cursor-pointer block leading-snug ${
                seniorMode ? 'text-xl' : 'text-base'
              }`}
            >
              โหมดสีคอนทราสต์สูง
            </label>
            <p className={`text-[#6e6e73] leading-relaxed ${seniorMode ? 'text-base' : 'text-xs'}`}>
              เพิ่มความคมชัดของข้อความและเส้นแบ่ง เพื่อการมองเห็นที่ชัดเจนขึ้น
            </p>
          </div>
          <button
            id="settings-contrast-toggle"
            role="switch"
            aria-checked={highContrast}
            aria-label="โหมดสีคอนทราสต์สูง"
            onClick={() => setHighContrast(!highContrast)}
            className={`w-14 h-8 rounded-full transition-colors relative shrink-0 ${
              highContrast ? 'bg-[#34c759]' : 'bg-[#e5e5ea]'
            }`}
          >
            <div
              className={`w-7 h-7 rounded-full bg-white shadow-md absolute top-0.5 transition-transform ${
                highContrast ? 'translate-x-6' : 'translate-x-0.5'
              }`}
            />
          </button>
        </div>

        {/* Sound Feedback Toggle & Tone Picker */}
        <div className="py-3 space-y-3">
          <div className="flex items-center justify-between">
            <div className="space-y-1 pr-4 min-w-0 flex-1">
              <label
                htmlFor="settings-sound-toggle"
                className={`font-bold text-[#1d1d1f] cursor-pointer block leading-snug ${
                  seniorMode ? 'text-xl' : 'text-base'
                }`}
              >
                เสียงเตือนการทานยา
              </label>
              <p className={`text-[#6e6e73] leading-relaxed ${seniorMode ? 'text-base' : 'text-xs'}`}>
                ส่งสัญญาณเสียงแจ้งเตือนเมื่อถึงเวลาตามตารางการใช้ยา
              </p>
            </div>
            <button
              id="settings-sound-toggle"
              role="switch"
              aria-checked={soundAlerts}
              aria-label="เสียงเตือนการทานยา"
              onClick={() => setSoundAlerts(!soundAlerts)}
              className={`w-14 h-8 rounded-full transition-colors relative shrink-0 ${
                soundAlerts ? 'bg-[#34c759]' : 'bg-[#e5e5ea]'
              }`}
            >
              <div
                className={`w-7 h-7 rounded-full bg-white shadow-md absolute top-0.5 transition-transform ${
                  soundAlerts ? 'translate-x-6' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>

          {/* Sound Tone Selection & Test */}
          {soundAlerts && (
            <div className="pt-2 border-t border-[#f2f2f7] space-y-2.5">
              <div className="flex items-center justify-between">
                <span className={`font-semibold text-[#1d1d1f] ${seniorMode ? 'text-base' : 'text-xs'}`}>
                  รูปแบบเสียงแจ้งเตือน:
                </span>
                <button
                  type="button"
                  onClick={() => playSingleAlarmSound(alarmSoundType)}
                  className="px-2.5 py-1 bg-[#f0f6ff] hover:bg-[#e0effe] text-[#0066cc] font-bold text-xs rounded-full flex items-center gap-1 border border-[#0066cc]/20 transition-all active:scale-95"
                  title="ทดสอบฟังเสียงที่เลือก"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>ทดสอบฟังเสียง</span>
                </button>
              </div>

              {/* Sound Options List */}
              <div className="grid grid-cols-1 gap-1.5">
                <button
                  type="button"
                  onClick={() => setAlarmSoundType && setAlarmSoundType('nene')}
                  className={`w-full text-left p-2.5 rounded-xl border flex items-center justify-between transition-all ${
                    alarmSoundType === 'nene'
                      ? 'bg-[#eff6ff] border-[#007aff] shadow-xs'
                      : 'bg-[#fafafa] border-[#e5e5ea] hover:bg-[#f5f5f7]'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-[#007aff]/15 text-[#007aff] flex items-center justify-center shrink-0">
                      <Megaphone className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <span className={`block font-bold truncate ${alarmSoundType === 'nene' ? 'text-[#007aff]' : 'text-[#1d1d1f]'} ${seniorMode ? 'text-base' : 'text-xs'}`}>
                        เสียงเตือนทรงพลังความดังสูง (แนะนำ • เสียงดังชัดเจนพิเศษ)
                      </span>
                      <span className="text-[11px] text-[#8e8e93] block truncate">
                        สัญญาณเตือนและเสียงพากย์กระตุ้นทานยาชัดเจน เหมาะกับผู้สูงวัย ไม่พลาดเวลา
                      </span>
                    </div>
                  </div>
                  {alarmSoundType === 'nene' && (
                    <span className="text-xs bg-[#007aff] text-white font-bold px-2 py-0.5 rounded-full shrink-0 ml-2">
                      ใช้งาน
                    </span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setAlarmSoundType && setAlarmSoundType('doctor')}
                  className={`w-full text-left p-2.5 rounded-xl border flex items-center justify-between transition-all ${
                    alarmSoundType === 'doctor'
                      ? 'bg-[#eff6ff] border-[#3b82f6] shadow-xs'
                      : 'bg-[#fafafa] border-[#e5e5ea] hover:bg-[#f5f5f7]'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-[#3b82f6]/15 text-[#1d4ed8] flex items-center justify-center shrink-0">
                      <Stethoscope className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <span className={`block font-bold truncate ${alarmSoundType === 'doctor' ? 'text-[#1d4ed8]' : 'text-[#1d1d1f]'} ${seniorMode ? 'text-base' : 'text-xs'}`}>
                        เสียงคุณหมอประกาศเตือน
                      </span>
                      <span className="text-[11px] text-[#8e8e93] block truncate">
                        "ได้เวลารับประทานยาตามเวลาแล้วค่ะ กรุณาทานยาด้วยนะคะ"
                      </span>
                    </div>
                  </div>
                  {alarmSoundType === 'doctor' && (
                    <span className="text-xs bg-[#3b82f6] text-white font-bold px-2 py-0.5 rounded-full shrink-0 ml-2">
                      ใช้งาน
                    </span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setAlarmSoundType && setAlarmSoundType('radar')}
                  className={`w-full text-left p-2.5 rounded-xl border flex items-center justify-between transition-all ${
                    alarmSoundType === 'radar'
                      ? 'bg-[#ecfdf5] border-[#10b981] shadow-xs'
                      : 'bg-[#fafafa] border-[#e5e5ea] hover:bg-[#f5f5f7]'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-[#10b981]/15 text-[#047857] flex items-center justify-center shrink-0">
                      <Bell className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <span className={`block font-bold truncate ${alarmSoundType === 'radar' ? 'text-[#047857]' : 'text-[#1d1d1f]'} ${seniorMode ? 'text-base' : 'text-xs'}`}>
                        เสียงกระดิ่ง iOS Radar มาตรฐาน
                      </span>
                      <span className="text-[11px] text-[#8e8e93] block truncate">
                        เสียงมาริมบา 3 จังหวะนุ่มนวลแบบดั้งเดิมของ iPhone
                      </span>
                    </div>
                  </div>
                  {alarmSoundType === 'radar' && (
                    <span className="text-xs bg-[#10b981] text-white font-bold px-2 py-0.5 rounded-full shrink-0 ml-2">
                      ใช้งาน
                    </span>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Medication Adherence Survey Logs Card */}
      {(() => {
        const SURVEY_PAGE_SIZE = 5;
        const totalSurveyPages = Math.max(1, Math.ceil(surveyLogs.length / SURVEY_PAGE_SIZE));
        const validSurveyPage = Math.min(Math.max(1, surveyPage), totalSurveyPages);
        const paginatedLogs = surveyLogs.slice(
          (validSurveyPage - 1) * SURVEY_PAGE_SIZE,
          validSurveyPage * SURVEY_PAGE_SIZE
        );

        return (
          <div className={`bg-[#ffffff] rounded-3xl border border-[#e5e5ea] space-y-3.5 shadow-xs ${seniorMode ? 'p-6' : 'p-5'}`}>
            {/* Header: Full width for title without squished button */}
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#0066cc]/10 text-[#0066cc] flex items-center justify-center shrink-0">
                <ClipboardCheck className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <h4 className={`font-bold text-[#1d1d1f] tracking-tight ${seniorMode ? 'text-xl' : 'text-base'}`}>
                  ประวัติการตอบแบบประเมินการใช้ยา
                </h4>
                <p className={`text-[#8e8e93] leading-relaxed ${seniorMode ? 'text-sm' : 'text-xs'}`}>
                  บันทึกการประเมินอาการ ความสะดวก และการทานยาตามแผน
                </p>
              </div>
            </div>

            {surveyLogs.length === 0 ? (
              <div className="bg-[#f8fafc] rounded-2xl p-4 text-center border border-[#e5e7eb] text-xs text-[#64748b]">
                ยังไม่มีประวัติการประเมิน (ระบบจะบันทึกอัตโนมัติเมื่อกดบันทึกการกินยาในหน้าเตือนฉันที)
              </div>
            ) : (
              <div className="space-y-2.5">
                {paginatedLogs.map((log, idx) => (
                  <div
                    key={log.id || `log-${idx}`}
                    className="bg-[#f8fafc] hover:bg-[#f1f5f9] rounded-2xl p-3 border border-[#e5e7eb] transition-all text-xs space-y-2"
                  >
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-1.5 font-bold text-[#111827] truncate min-w-0">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#16a34a] shrink-0" />
                        <span className="truncate">{log.drugName}</span>
                      </div>
                      <span className="text-[11px] text-[#6b7280] shrink-0 bg-white px-2 py-0.5 rounded-md border border-[#e5e7eb]">
                        {log.dateStr ? `${log.dateStr} ` : ''}{log.answeredAt}
                      </span>
                    </div>

                    {/* Small text with bold labels */}
                    <div className="space-y-1 pt-1.5 border-t border-[#e2e8f0] text-[11px] sm:text-xs text-[#4b5563] leading-relaxed">
                      <div>
                        <strong className="font-bold text-[#111827]">อาการ: </strong>
                        <span>{log.symptomAnswer || 'ปกติ'}</span>
                      </div>
                      <div>
                        <strong className="font-bold text-[#111827]">ความสะดวก: </strong>
                        <span>{log.convenienceAnswer || 'สะดวกดี'}</span>
                      </div>
                      <div>
                        <strong className="font-bold text-[#111827]">การทาน: </strong>
                        <span>{log.adherenceAnswer || 'ตรงเวลา'}</span>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Bottom Bar: Pagination controls (if > 5) & Clear History Button */}
                <div className="pt-2 border-t border-[#f1f5f9] flex flex-col sm:flex-row items-center justify-between gap-2.5">
                  {totalSurveyPages > 1 ? (
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setSurveyPage((p) => Math.max(1, p - 1))}
                        disabled={validSurveyPage <= 1}
                        className="px-2.5 py-1 text-xs font-semibold rounded-lg border border-[#e5e7eb] bg-white text-[#4b5563] disabled:opacity-40 hover:bg-[#f8fafc] flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <ChevronLeft className="w-3.5 h-3.5" />
                        <span>ก่อนหน้า</span>
                      </button>
                      <span className="text-xs text-[#6b7280]">
                        หน้า {validSurveyPage} จาก {totalSurveyPages} ({surveyLogs.length} รายการ)
                      </span>
                      <button
                        type="button"
                        onClick={() => setSurveyPage((p) => Math.min(totalSurveyPages, p + 1))}
                        disabled={validSurveyPage >= totalSurveyPages}
                        className="px-2.5 py-1 text-xs font-semibold rounded-lg border border-[#e5e7eb] bg-white text-[#4b5563] disabled:opacity-40 hover:bg-[#f8fafc] flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <span>ถัดไป</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <span className="text-xs text-[#8e8e93]">
                      ทั้งหมด {surveyLogs.length} รายการ
                    </span>
                  )}

                  {onClearSurveyLogs && (
                    <button
                      type="button"
                      onClick={onClearSurveyLogs}
                      className="text-[#dc2626] hover:text-[#b91c1c] text-xs font-semibold flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#fecaca] bg-white hover:bg-[#fef2f2] transition-colors cursor-pointer ml-auto"
                      title="ล้างประวัติการประเมิน"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>ล้างประวัติ</span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        );
      })()}

      {/* User Guide & Video Tutorial Card */}
      <div className={`bg-[#ffffff] rounded-3xl p-5 border border-[#e5e5ea] flex items-center justify-between gap-3 shadow-xs ${
        seniorMode ? 'p-6' : 'p-5'
      }`}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#f0f6ff] text-[#0066cc] flex items-center justify-center shrink-0">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h4 className={`font-bold text-[#1d1d1f] ${seniorMode ? 'text-xl' : 'text-sm'}`}>
              วิดีโอสอนการใช้งาน
            </h4>
          </div>
        </div>

        <button
          onClick={onOpenGuide}
          className={`bg-[#0066cc] text-white font-bold rounded-xl hover:bg-[#0071e3] transition-colors shrink-0 ${
            seniorMode ? 'px-4 py-2.5 text-base' : 'px-3.5 py-2 text-xs'
          }`}
        >
          เปิดดูวิดีโอ
        </button>
      </div>

      {/* Trust & Medical Bibliography */}
      <div className="bg-[#ffffff] rounded-3xl p-5 border border-[#e5e5ea] space-y-2 text-xs text-[#8e8e93]">
        <div className="flex items-center gap-1.5 font-semibold text-[#1d1d1f]">
          <BookOpen className="w-3.5 h-3.5 text-[#0066cc]" />
          <span>มาตรฐานและแหล่งข้อมูลอ้างอิงทางการแพทย์:</span>
        </div>
        <p className="leading-relaxed">
          • ฐานข้อมูลยามาตรฐานระดับสากล: Lexidrug, MIMS Thailand, PubMed<br />
          • คู่มือการใช้ยาอย่างสมเหตุผลตามบัญชียาหลักแห่งชาติ (Thai NLEM)<br />
          • สมาคมความดันโลหิตสูงแห่งประเทศไทย & สมาคมสภาองค์กรโรคหืดแห่งประเทศไทย (TAC)
        </p>
      </div>

      {/* Reset Demo */}
      <div className="pt-2">
        <button
          onClick={onResetAll}
          className="w-full py-3.5 px-4 rounded-2xl border border-[#ff3b30]/30 text-[#d70015] hover:bg-[#fff1f0] text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          <span>รีเซ็ตข้อมูลและเริ่มการสาธิตใหม่ (Reset Demo)</span>
        </button>
      </div>
    </div>
  );
};
