import React, { useState } from 'react';
import { Drug } from '../types';
import {
  ChevronLeft,
  Clock,
  AlertTriangle,
  MessageCircle,
  Video,
  Sparkles,
  BookOpen,
  Trash2,
  Lightbulb,
  ShieldAlert,
  ChevronRight,
  Info,
} from 'lucide-react';
import { ConfirmDeleteDialog } from './ConfirmDeleteDialog';

interface DrugDetailPageProps {
  drug: Drug;
  onBack: () => void;
  onOpenSideEffects: (drug: Drug) => void;
  onOpenSpecialTechniqueVideo: (drug: Drug) => void;
  onOpenAIChat: (drug: Drug) => void;
  onRemoveDrug: (drugId: string) => void;
  seniorMode: boolean;
}

export const DrugDetailPage: React.FC<DrugDetailPageProps> = ({
  drug,
  onBack,
  onOpenSideEffects,
  onOpenSpecialTechniqueVideo,
  onOpenAIChat,
  onRemoveDrug,
  seniorMode,
}) => {
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);

  const handleConfirmDelete = () => {
    setIsConfirmDeleteOpen(false);
    onRemoveDrug(drug.id);
    onBack();
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#f5f5f7] animate-in fade-in slide-in-from-right-4 duration-200">
      {/* Top Navigation Bar with Back Button */}
      <div className="bg-[#ffffff] border-b border-[#e5e5ea] px-3 py-2.5 flex items-center justify-between shrink-0 select-none shadow-2xs">
        <button
          onClick={onBack}
          className="flex items-center gap-1 text-[#007aff] hover:text-[#0051a8] active:opacity-70 transition-all font-semibold py-1 px-1 -ml-1 rounded-xl"
        >
          <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
          <span className={`${seniorMode ? 'text-base font-bold' : 'text-sm'}`}>ยาของฉัน</span>
        </button>

        <h1 className={`font-bold text-[#1d1d1f] tracking-tight truncate px-2 ${
          seniorMode ? 'text-lg' : 'text-sm'
        }`}>
          รายละเอียดข้อมูลยา
        </h1>

        <div className="w-16 flex justify-end">
          <span className="text-[11px] font-bold bg-[#007aff]/10 text-[#007aff] px-2 py-0.5 rounded-full">
            {drug.strength}
          </span>
        </div>
      </div>

      {/* Main Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Drug Banner */}
        <div className="bg-[#ffffff] rounded-3xl border border-[#e5e5ea] p-4 sm:p-5 shadow-xs space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className={`font-black text-[#1d1d1f] tracking-tight ${
              seniorMode ? 'text-2xl sm:text-3xl' : 'text-xl'
            }`}>
              {drug.tradeName}
            </h2>
            <span className="font-bold bg-[#007aff]/15 text-[#007aff] px-2.5 py-0.5 rounded-full text-xs">
              {drug.strength}
            </span>
          </div>

          {drug.isSpecialTechnique && (
            <div className="inline-flex items-center gap-1.5 bg-[#fff4e5] text-[#b25e00] border border-[#ffd599] px-2.5 py-1 rounded-lg text-xs font-bold shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-[#ff9500]" />
              <span>ยาเทคนิคพิเศษ ({drug.specialTechnique?.badge || 'พ่นยา'})</span>
            </div>
          )}

          <div className="text-[#3a3a3c] text-sm leading-relaxed pt-1">
            <div className="font-semibold text-[#1d1d1f]">
              ชื่อสามัญทางยา: <span className="font-normal text-[#48484a]">{drug.genericName}</span>
            </div>
            <div className="text-xs text-[#636366] mt-0.5">
              กลุ่มยา / สรรพคุณ: {drug.category} ({drug.drugGroup})
            </div>
          </div>
        </div>

        {/* 1. คำแนะนำเภสัชกร (Pharmacist Clinical Advice) - PLACED DIRECTLY ABOVE SIDE EFFECTS */}
        <div className="bg-gradient-to-br from-[#effaf3] to-[#e4f7eb] border-2 border-[#34c759]/40 rounded-3xl p-4 sm:p-5 shadow-xs space-y-2">
          <div className="flex items-center gap-2 text-[#1b7a37]">
            <div className="w-8 h-8 rounded-xl bg-[#34c759]/20 flex items-center justify-center shrink-0">
              <Lightbulb className="w-4 h-4 text-[#1b7a37] stroke-[2.5]" />
            </div>
            <div className="min-w-0">
              <h3 className={`font-black tracking-tight leading-snug ${
                seniorMode ? 'text-lg sm:text-xl' : 'text-sm font-bold'
              }`}>
                คำแนะนำสำคัญจากเภสัชกร
              </h3>
              <p className="text-[11px] text-[#2e8a4a]">
                ข้อควรปฏิบัติเฉพาะของยานี้เพื่อความปลอดภัยสูงสุด
              </p>
            </div>
          </div>

          <div className={`p-3 bg-white/80 rounded-2xl border border-[#34c759]/30 text-[#1b4329] font-medium leading-relaxed ${
            seniorMode ? 'text-base sm:text-lg font-semibold' : 'text-xs sm:text-sm'
          }`}>
            {drug.pharmacistAdvice ? (
              drug.pharmacistAdvice
            ) : (
              <span>
                แนะนำให้รับประทานยาอย่างสม่ำเสมอตามเวลาที่กำหนด ดื่มน้ำสะอาดตาม 1 แก้ว และหลีกเลี่ยงการปรับขนาดยาด้วยตนเอง
              </span>
            )}
          </div>
        </div>

        {/* 2. Interactive Action Buttons: Side Effects & Special Video (Immediately below advice) */}
        <div className="space-y-2.5">
          {/* Side Effects Button */}
          <button
            onClick={() => onOpenSideEffects(drug)}
            className="w-full bg-[#ffffff] hover:bg-[#fbfbfd] active:scale-[0.99] border border-[#ff9500]/50 hover:border-[#ff9500] text-[#1d1d1f] rounded-2xl p-3.5 flex items-center justify-between transition-all shadow-xs"
          >
            <div className="flex items-center gap-3 text-left min-w-0">
              <span className="w-9 h-9 rounded-xl bg-[#ff9500]/15 text-[#ff9500] flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </span>
              <div className="min-w-0">
                <div className={`font-bold text-[#1d1d1f] ${seniorMode ? 'text-base' : 'text-sm'}`}>
                  ผลข้างเคียง & ภาพผื่นแพ้ยา
                </div>
                <div className="text-[11px] text-[#8e8e93] truncate">
                  ดูภาพตัวอย่างผื่นแพ้ สัญญาณอันตราย และวิธีดูแลตนเอง
                </div>
              </div>
            </div>
            <div className="flex items-center text-[#007aff] text-xs font-semibold shrink-0 pl-2">
              <span>เปิดดู</span>
              <ChevronRight className="w-4 h-4 ml-0.5" />
            </div>
          </button>

          {/* Special Technique Video Button */}
          {drug.isSpecialTechnique && (
            <button
              onClick={() => onOpenSpecialTechniqueVideo(drug)}
              className="w-full bg-gradient-to-r from-[#007aff] to-[#0051a8] hover:from-[#0071e3] hover:to-[#004793] active:scale-[0.99] text-white rounded-2xl p-3.5 flex items-center justify-between transition-all shadow-sm"
            >
              <div className="flex items-center gap-3 text-left min-w-0">
                <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                  <Video className="w-4 h-4 text-white" />
                </div>
                <div className="min-w-0">
                  <div className={`font-bold text-white ${seniorMode ? 'text-base' : 'text-sm'}`}>
                    คลิปวิดีโอสาธิตวิธีใช้ยาพ่น
                  </div>
                  <div className="text-[11px] text-white/80">
                    คลิปกระชับ 18 วิ 5 ขั้นตอน (กดยา สูดลึก กลั้น 10 วิ)
                  </div>
                </div>
              </div>
              <div className="flex items-center text-white text-xs font-bold shrink-0 pl-2">
                <span>ดูคลิป</span>
                <ChevronRight className="w-4 h-4 ml-0.5" />
              </div>
            </button>
          )}

          {/* AI Pharmacist Chat Shortcut */}
          <button
            onClick={() => onOpenAIChat(drug)}
            className="w-full bg-[#f0f6ff] hover:bg-[#e4efff] active:scale-[0.99] border border-[#007aff]/30 text-[#007aff] rounded-2xl p-3.5 flex items-center justify-between transition-all shadow-2xs"
          >
            <div className="flex items-center gap-3 text-left min-w-0">
              <div className="w-9 h-9 rounded-xl bg-[#007aff]/15 flex items-center justify-center shrink-0">
                <MessageCircle className="w-4 h-4 text-[#007aff]" />
              </div>
              <div className="min-w-0">
                <div className={`font-bold text-[#007aff] ${seniorMode ? 'text-base' : 'text-sm'}`}>
                  ปรึกษาอาการกับ AI เภสัชกร
                </div>
                <div className="text-[11px] text-[#007aff]/80 truncate">
                  สอบถามวิธีทานยา ลืมทานยา อาหารที่ห้ามทานคู่กับยา
                </div>
              </div>
            </div>
            <div className="flex items-center text-[#007aff] text-xs font-semibold shrink-0 pl-2">
              <span>พูดคุย</span>
              <ChevronRight className="w-4 h-4 ml-0.5" />
            </div>
          </button>
        </div>

        {/* Dosage Instructions Box */}
        <div className="bg-[#ffffff] rounded-3xl p-4 sm:p-5 space-y-3 border border-[#e5e5ea] shadow-xs">
          <div className="flex items-center gap-1.5 text-[#007aff] font-bold text-xs">
            <Clock className="w-4 h-4 shrink-0" />
            <span>วิธีและเวลาการรับประทาน:</span>
          </div>

          <p className={`font-black text-[#1d1d1f] leading-snug break-words ${
            seniorMode ? 'text-xl sm:text-2xl' : 'text-base sm:text-lg'
          }`}>
            {drug.instructions}
          </p>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#e5e5ea] text-xs text-[#48484a]">
            <div className="bg-[#f5f5f7] p-2.5 rounded-xl border border-[#e5e5ea]">
              <span className="text-[#8e8e93] block text-[10px]">รูปแบบยา</span>
              <span className="font-bold text-[#1d1d1f]">{drug.route}</span>
            </div>
            <div className="bg-[#f5f5f7] p-2.5 rounded-xl border border-[#e5e5ea]">
              <span className="text-[#8e8e93] block text-[10px]">ความถี่</span>
              <span className="font-bold text-[#1d1d1f]">{drug.frequency}</span>
            </div>
            <div className="bg-[#f5f5f7] p-2.5 rounded-xl border border-[#e5e5ea]">
              <span className="text-[#8e8e93] block text-[10px]">ช่วงเวลา</span>
              <span className="font-bold text-[#1d1d1f]">{drug.timing}</span>
            </div>
            <div className="bg-[#f5f5f7] p-2.5 rounded-xl border border-[#e5e5ea]">
              <span className="text-[#8e8e93] block text-[10px]">สถานะการบดยา</span>
              <span className={`font-bold ${!drug.canCrush ? 'text-[#d70015]' : 'text-[#34c759]'}`}>
                {!drug.canCrush ? 'ห้ามบดหรือเคี้ยว' : 'บดยาได้'}
              </span>
            </div>
          </div>
        </div>

        {/* Clinical Warnings */}
        {drug.warnings && (
          <div
            className={`rounded-3xl border p-4 flex items-start gap-3 shadow-xs ${
              !drug.canCrush
                ? 'bg-[#fff1f0] border-[#ff3b30]/30 text-[#d70015]'
                : 'bg-[#fff9f0] border-[#ff9500]/30 text-[#b25e00]'
            }`}
          >
            <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
            <div className="min-w-0 flex-1">
              <span className={`font-bold block mb-0.5 ${seniorMode ? 'text-base' : 'text-xs'}`}>
                {!drug.canCrush ? 'ข้อห้ามสำคัญ (ห้ามบดยา):' : 'คำเตือนทางการแพทย์:'}
              </span>
              <p className={`leading-relaxed font-medium ${seniorMode ? 'text-sm' : 'text-xs'}`}>
                {drug.warnings}
              </p>
            </div>
          </div>
        )}

        {/* Reference Citation */}
        <div className="flex items-center gap-1.5 text-[#8e8e93] text-[11px] px-2">
          <BookOpen className="w-3.5 h-3.5 text-[#007aff] shrink-0" />
          <span className="truncate">อ้างอิง: {drug.referenceSource}</span>
        </div>

        {/* Delete Medication Section (Hidden Safely Inside, with Clear Prominent Confirmation Dialog) */}
        <div className="pt-4 border-t border-[#e5e5ea] mt-6 mb-8">
          <div className="bg-[#ffffff] rounded-3xl p-4 border border-[#e5e5ea] flex items-center justify-between shadow-xs">
            <div>
              <div className="text-xs font-bold text-[#8e8e93]">
                การจัดการรายการยานี้
              </div>
              <div className="text-[11px] text-[#aeaeaf]">
                ลบยานี้หากแพทย์สั่งหยุดยาแล้ว
              </div>
            </div>

            <button
              onClick={() => setIsConfirmDeleteOpen(true)}
              className="px-3.5 py-2 bg-[#fff1f0] hover:bg-[#ffe5e5] text-[#ff3b30] border border-[#ff3b30]/30 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors active:scale-95 shadow-2xs"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>ลบยานี้ออกจากรายการ</span>
            </button>
          </div>
        </div>
      </div>

      {/* Prominent High-Contrast Delete Confirmation Dialog */}
      <ConfirmDeleteDialog
        isOpen={isConfirmDeleteOpen}
        onClose={() => setIsConfirmDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
        drug={drug}
        seniorMode={seniorMode}
      />
    </div>
  );
};
