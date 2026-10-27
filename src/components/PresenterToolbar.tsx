import React from 'react';
import {
  RotateCcw,
  Smartphone,
  Monitor,
  Type,
  FileText,
  AlertTriangle,
  Scan,
  MessageSquare,
  BookOpen,
  Video,
  Bell,
  History,
  Clock,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';

interface PresenterToolbarProps {
  isMobileFrame: boolean;
  setIsMobileFrame: (val: boolean) => void;
  seniorMode: boolean;
  setSeniorMode: (val: boolean) => void;
  onResetDemo: () => void;
  onShowSplash?: () => void;
  onQuickScanSafe: () => void;
  onQuickScanAllergy: () => void;
  onQuickSpecialTechnique: () => void;
  onOpenAIChat: () => void;
  onOpenScript: () => void;
  onOpenGuide: () => void;
  onTriggerMedAlarm?: () => void;
  onOpenHistory?: () => void;
  onOpenReminder?: () => void;
}

export const PresenterToolbar: React.FC<PresenterToolbarProps> = ({
  isMobileFrame,
  setIsMobileFrame,
  seniorMode,
  setSeniorMode,
  onResetDemo,
  onShowSplash,
  onQuickScanSafe,
  onQuickScanAllergy,
  onQuickSpecialTechnique,
  onOpenAIChat,
  onOpenScript,
  onOpenGuide,
  onTriggerMedAlarm,
  onOpenHistory,
  onOpenReminder,
}) => {
  return (
    <aside aria-label="แถบเครื่องมือสาธิตสำหรับผู้นำเสนอ" className="w-full bg-[#111827] text-white border-b border-[#374151] px-3 py-2 text-xs select-none">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        {/* Left: Branding & Status */}
        <div className="flex items-center gap-2">
          <span className="font-bold tracking-tight text-white flex items-center gap-1.5">
            <span className="inline-block w-2 h-2 rounded-full bg-[#16a34a] animate-pulse"></span>
            pillyung MedSafe
          </span>
          {seniorMode && (
            <span className="bg-[#0066cc] text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              <span>โหมดตัวหนังสือใหญ่</span>
            </span>
          )}
        </div>

        {/* Center: Quick Demo Trigger Shortcuts without emojis */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[#9ca3af] text-[11px] mr-1 hidden md:inline">ทางลัดสาธิต:</span>

          {onShowSplash && (
            <button
              type="button"
              onClick={onShowSplash}
              title="ดูหน้าโหลดโลโก้ MedSafe"
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#1e293b] hover:bg-[#334155] text-[#38bdf8] text-[11px] border border-[#38bdf8]/30 transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#38bdf8]" />
              <span>0. โหลดหน้าแรก</span>
            </button>
          )}

          <button
            type="button"
            onClick={onQuickScanSafe}
            title="จำลองสแกนยาปกติ (Glucophage)"
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#1f2937] hover:bg-[#374151] text-white text-[11px] transition-colors cursor-pointer"
          >
            <Scan className="w-3.5 h-3.5 text-[#38bdf8]" />
            <span>1. สแกนยา Glucophage</span>
          </button>

          <button
            type="button"
            onClick={onQuickScanAllergy}
            title="จำลองสแกนยาแพ้ (Augmentin ข้ามกลุ่ม Penicillin)"
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#450a0a] hover:bg-[#7f1d1d] text-[#fca5a5] text-[11px] border border-[#f87171]/30 transition-colors cursor-pointer"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-[#f87171]" />
            <span>2. เตือนแพ้ยา Augmentin</span>
          </button>

          <button
            type="button"
            onClick={onQuickSpecialTechnique}
            title="เปิดคลิปสาธิตยาพ่นเทคนิคพิเศษ MDI"
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#0c4a6e] hover:bg-[#0369a1] text-[#7dd3fc] text-[11px] border border-[#38bdf8]/30 transition-colors cursor-pointer"
          >
            <Video className="w-3.5 h-3.5 text-[#38bdf8]" />
            <span>3. คลิปยาพ่นเทคนิคพิเศษ</span>
          </button>

          <button
            type="button"
            onClick={onOpenAIChat}
            title="เปิดผู้ช่วย AI ด้านยา"
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#1f2937] hover:bg-[#374151] text-white text-[11px] transition-colors cursor-pointer"
          >
            <MessageSquare className="w-3.5 h-3.5 text-[#4ade80]" />
            <span>4. ปรึกษาผลข้างเคียง AI</span>
          </button>

          {onTriggerMedAlarm && (
            <button
              type="button"
              onClick={onTriggerMedAlarm}
              title="จำลองเวลา 17:30 น. แจ้งเตือนยาเย็น 18:00 น. แบบเต็มจอพร้อมเสียงเตือน"
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#312e81] hover:bg-[#4338ca] text-[#c7d2fe] text-[11px] border border-[#818cf8]/30 transition-colors cursor-pointer"
            >
              <Bell className="w-3.5 h-3.5 text-[#c7d2fe]" />
              <span>5. เตือนยา 17:30</span>
            </button>
          )}

          {onOpenHistory && (
            <button
              type="button"
              onClick={onOpenHistory}
              title="เปิดดูประวัติการทานยา 30 วันย้อนหลังพร้อมระบบแบ่งหน้า"
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#064e3b] hover:bg-[#047857] text-[#6ee7b7] text-[11px] border border-[#34d399]/30 transition-colors cursor-pointer"
            >
              <History className="w-3.5 h-3.5 text-[#34d399]" />
              <span>6. ประวัติยา 30 วัน</span>
            </button>
          )}

          {onOpenReminder && (
            <button
              type="button"
              onClick={onOpenReminder}
              title="เปิดหน้าเตือนฉันที เพื่อทดลองบันทึกยาและตอบแบบประเมิน 3 ข้อ"
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#1e293b] hover:bg-[#334155] text-[#38bdf8] text-[11px] border border-[#38bdf8]/30 transition-colors cursor-pointer"
            >
              <Clock className="w-3.5 h-3.5 text-[#38bdf8]" />
              <span>7. ตารางยา & แบบประเมิน</span>
            </button>
          )}
        </div>

        {/* Right: Controls & Viewport Modes */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setSeniorMode(!seniorMode)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              seniorMode
                ? 'bg-[#0066cc] text-white shadow-xs'
                : 'bg-[#374151] text-[#e5e7eb] hover:bg-[#4b5563]'
            }`}
            title="ปรับขนาดตัวอักษรใหญ่พิเศษสำหรับผู้สูงอายุ"
          >
            <Type className="w-4 h-4" />
            <span>{seniorMode ? 'ฟอนต์ผู้สูงวัย: เปิดอยู่' : 'ฟอนต์ผู้สูงวัย: ปิด'}</span>
          </button>

          <button
            type="button"
            onClick={() => setIsMobileFrame(!isMobileFrame)}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#374151] hover:bg-[#4b5563] text-white text-xs font-semibold transition-colors cursor-pointer"
            title={isMobileFrame ? 'สลับเป็นโหมดขยายเต็มหน้าจอ' : 'สลับเป็นกรอบมือถือจำลอง'}
          >
            {isMobileFrame ? (
              <>
                <Monitor className="w-4 h-4 text-[#38bdf8]" />
                <span className="hidden sm:inline">เต็มจอ</span>
              </>
            ) : (
              <>
                <Smartphone className="w-4 h-4 text-[#38bdf8]" />
                <span className="hidden sm:inline">กรอบมือถือ</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={onOpenGuide}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#374151] hover:bg-[#4b5563] text-[#4ade80] text-xs font-semibold transition-colors cursor-pointer"
            title="เปิดดูวิดีโอสอนการใช้งาน"
          >
            <BookOpen className="w-4 h-4" />
            <span className="hidden sm:inline">วิดีโอ</span>
          </button>

          <button
            type="button"
            onClick={onOpenScript}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#374151] hover:bg-[#4b5563] text-[#facc15] text-xs font-semibold transition-colors cursor-pointer"
            title="ดูสคริปต์คลิปสาธิต"
          >
            <FileText className="w-4 h-4" />
            <span className="hidden sm:inline">สคริปต์</span>
          </button>

          <button
            type="button"
            onClick={onResetDemo}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#374151] hover:bg-[#7f1d1d] text-[#fca5a5] text-xs font-semibold transition-colors cursor-pointer"
            title="รีเซ็ตข้อมูลทั้งหมด"
          >
            <RotateCcw className="w-4 h-4" />
            <span className="hidden md:inline">รีเซ็ต</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
