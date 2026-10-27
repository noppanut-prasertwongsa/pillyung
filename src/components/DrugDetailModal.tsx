import React, { useState } from 'react';
import { Drug } from '../types';
import {
  X,
  Clock,
  AlertTriangle,
  MessageCircle,
  Video,
  Sparkles,
  BookOpen,
  Trash2,
  AlertCircle,
  ChevronRight,
  ShieldAlert,
  CheckCircle2,
  FileText,
} from 'lucide-react';

interface DrugDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  drug: Drug | null;
  onOpenSideEffects: (drug: Drug) => void;
  onOpenSpecialTechniqueVideo: (drug: Drug) => void;
  onOpenAIChat: (drug: Drug) => void;
  onRemoveDrug: (drugId: string) => void;
  seniorMode: boolean;
}

export const DrugDetailModal: React.FC<DrugDetailModalProps> = ({
  isOpen,
  onClose,
  drug,
  onOpenSideEffects,
  onOpenSpecialTechniqueVideo,
  onOpenAIChat,
  onRemoveDrug,
  seniorMode,
}) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (!isOpen || !drug) return null;

  const handleClose = () => {
    setShowDeleteConfirm(false);
    onClose();
  };

  const handleConfirmDelete = () => {
    onRemoveDrug(drug.id);
    handleClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="absolute inset-0 z-50 bg-black/65 backdrop-blur-xs flex flex-col justify-end animate-in fade-in duration-200 overflow-hidden"
    >
      {/* Modal Sheet Container inside Phone Frame */}
      <div className="bg-[#ffffff] w-full max-h-[95%] rounded-t-3xl flex flex-col overflow-hidden shadow-2xl animate-in slide-in-from-bottom-6 duration-300">
        {/* Grabber indicator & Top Bar */}
        <div className="pt-2.5 pb-2 px-4 bg-[#ffffff] border-b border-[#e5e5ea] flex flex-col items-center shrink-0">
          <div className="w-10 h-1 bg-[#d1d1d6] rounded-full mb-2" />
          <div className="w-full flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#007aff]" />
              <h3 className={`font-bold text-[#1d1d1f] ${seniorMode ? 'text-lg' : 'text-base'}`}>
                รายละเอียดข้อมูลยา
              </h3>
            </div>
            <button
              onClick={handleClose}
              className="p-1.5 rounded-full text-[#8e8e93] hover:text-[#1d1d1f] hover:bg-[#f2f2f7] transition-colors"
              aria-label="ปิดหน้าต่าง"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Drug Title Card (Header) */}
          <div className="bg-gradient-to-br from-[#f8f9fc] to-[#edf3ff] p-4 rounded-2xl border border-[#dce6fa] space-y-2">
            <div className="flex items-start justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className={`font-black text-[#1d1d1f] tracking-tight ${seniorMode ? 'text-2xl sm:text-3xl' : 'text-xl'}`}>
                  {drug.tradeName}
                </h2>
                <span className="font-bold bg-[#007aff]/15 text-[#007aff] px-2.5 py-0.5 rounded-full text-xs">
                  {drug.strength}
                </span>
              </div>
            </div>

            {drug.isSpecialTechnique && (
              <div className="inline-flex items-center gap-1.5 bg-[#fff4e5] text-[#b25e00] border border-[#ffd599] px-2.5 py-1 rounded-lg text-xs font-bold shadow-2xs">
                <Sparkles className="w-3.5 h-3.5 text-[#ff9500]" />
                <span>ยาเทคนิคพิเศษ ({drug.specialTechnique?.badge || 'พ่นยา'})</span>
              </div>
            )}

            <div className="text-[#3a3a3c] text-sm leading-relaxed pt-1">
              <div className="font-semibold text-[#1d1d1f]">
                ชื่อสามัญ: <span className="font-normal text-[#48484a]">{drug.genericName}</span>
              </div>
              <div className="text-xs text-[#636366] mt-0.5">
                กลุ่มยา / สรรพคุณ: {drug.category} ({drug.drugGroup})
              </div>
            </div>
          </div>

          {/* Interactive Action Buttons */}
          <div className="space-y-2">
            {/* 1. Side Effects & Allergy Photos */}
            <button
              onClick={() => {
                onOpenSideEffects(drug);
              }}
              className="w-full bg-[#ffffff] hover:bg-[#fbfbfd] active:scale-[0.99] border border-[#ff9500]/50 hover:border-[#ff9500] text-[#1d1d1f] rounded-2xl p-3 flex items-center justify-between transition-all shadow-xs"
            >
              <div className="flex items-center gap-2.5 text-left min-w-0">
                <span className="w-8 h-8 rounded-xl bg-[#ff9500]/15 text-[#ff9500] flex items-center justify-center text-sm shrink-0 font-bold">
                  ⚠️
                </span>
                <div className="min-w-0">
                  <div className="font-bold text-sm text-[#1d1d1f]">
                    ผลข้างเคียง & ภาพผื่นแพ้ยา
                  </div>
                  <div className="text-[11px] text-[#8e8e93] truncate">
                    ดูภาพตัวอย่างผื่นแพ้และวิธีดูแลตนเองเบื้องต้น
                  </div>
                </div>
              </div>
              <div className="flex items-center text-[#007aff] text-xs font-semibold shrink-0 pl-2">
                <span>เปิดดู</span>
                <ChevronRight className="w-4 h-4 ml-0.5" />
              </div>
            </button>

            {/* 2. Special Technique Video (Only if applicable) */}
            {drug.isSpecialTechnique && (
              <button
                onClick={() => {
                  onOpenSpecialTechniqueVideo(drug);
                }}
                className="w-full bg-gradient-to-r from-[#007aff] to-[#0051a8] hover:from-[#0071e3] hover:to-[#004793] active:scale-[0.99] text-white rounded-2xl p-3 flex items-center justify-between transition-all shadow-sm"
              >
                <div className="flex items-center gap-2.5 text-left min-w-0">
                  <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                    <Video className="w-4 h-4 text-white" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-bold text-sm text-white">
                      🎥 คลิปวิดีโอสาธิตวิธีใช้ยาพ่น
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

            {/* 3. AI Pharmacist Consultation */}
            <button
              onClick={() => {
                onOpenAIChat(drug);
              }}
              className="w-full bg-[#f0f6ff] hover:bg-[#e4efff] active:scale-[0.99] border border-[#007aff]/30 text-[#007aff] rounded-2xl p-3 flex items-center justify-between transition-all shadow-2xs"
            >
              <div className="flex items-center gap-2.5 text-left min-w-0">
                <div className="w-8 h-8 rounded-xl bg-[#007aff]/15 flex items-center justify-center shrink-0">
                  <MessageCircle className="w-4 h-4 text-[#007aff]" />
                </div>
                <div className="min-w-0">
                  <div className="font-bold text-sm text-[#007aff]">
                    ปรึกษาอาการกับ AI เภสัชกร
                  </div>
                  <div className="text-[11px] text-[#007aff]/80 truncate">
                    สอบถามวิธีทานยา ลืมทานยา หรือสงสัยอาการผิดปกติ
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
          <div className="bg-[#f5f5f7] rounded-2xl p-3.5 space-y-2.5 border border-[#e5e5ea]">
            <div className="flex items-center gap-1.5 text-[#007aff] font-bold text-xs">
              <Clock className="w-4 h-4 shrink-0" />
              <span>วิธีและเวลาการรับประทาน:</span>
            </div>

            <p className={`font-black text-[#1d1d1f] leading-snug break-words ${seniorMode ? 'text-lg sm:text-xl' : 'text-sm'}`}>
              {drug.instructions}
            </p>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#e5e5ea] text-xs text-[#48484a]">
              <div className="bg-white p-2 rounded-xl border border-[#e5e5ea]">
                <span className="text-[#8e8e93] block text-[10px]">รูปแบบ</span>
                <span className="font-bold text-[#1d1d1f]">{drug.route}</span>
              </div>
              <div className="bg-white p-2 rounded-xl border border-[#e5e5ea]">
                <span className="text-[#8e8e93] block text-[10px]">ความถี่</span>
                <span className="font-bold text-[#1d1d1f]">{drug.frequency}</span>
              </div>
              <div className="bg-white p-2 rounded-xl border border-[#e5e5ea]">
                <span className="text-[#8e8e93] block text-[10px]">ช่วงเวลา</span>
                <span className="font-bold text-[#1d1d1f]">{drug.timing}</span>
              </div>
              <div className="bg-white p-2 rounded-xl border border-[#e5e5ea]">
                <span className="text-[#8e8e93] block text-[10px]">สถานะการบดยา</span>
                <span className={`font-bold ${!drug.canCrush ? 'text-[#d70015]' : 'text-[#34c759]'}`}>
                  {!drug.canCrush ? 'ห้ามบดหรือเคี้ยว' : 'บดยาได้'}
                </span>
              </div>
            </div>
          </div>

          {/* Medical Warnings & Crush Precautions */}
          {drug.warnings && (
            <div
              className={`rounded-2xl border p-3 flex items-start gap-2.5 ${
                !drug.canCrush
                  ? 'bg-[#fff1f0] border-[#ff3b30]/30 text-[#d70015]'
                  : 'bg-[#fff9f0] border-[#ff9500]/30 text-[#b25e00]'
              }`}
            >
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <div className="min-w-0 flex-1">
                <span className="font-bold block text-xs mb-0.5">
                  {!drug.canCrush ? '⚠️ ข้อห้ามสำคัญ (ห้ามบดยา):' : 'คำเตือนทางการแพทย์:'}
                </span>
                <p className="text-xs leading-relaxed font-medium">
                  {drug.warnings}
                </p>
              </div>
            </div>
          )}

          {/* Reference Source */}
          <div className="flex items-center gap-1.5 text-[#8e8e93] text-[11px] px-1">
            <BookOpen className="w-3.5 h-3.5 text-[#007aff] shrink-0" />
            <span className="truncate">อ้างอิง: {drug.referenceSource}</span>
          </div>

          {/* Hidden Safe Delete Section (Danger Zone) */}
          {/* User feedback: "อยากให้ปุ่มลบ ซ่อนไว้ข้างใน ไม่ใช่หากดได้ง่ายๆอะ" */}
          <div className="pt-3 border-t border-[#e5e5ea] mt-4">
            {!showDeleteConfirm ? (
              <div className="bg-[#fafafa] rounded-2xl p-3 border border-[#e5e5ea] flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-[#8e8e93]">
                    การจัดการรายการยานี้
                  </div>
                  <div className="text-[11px] text-[#aeaeaf]">
                    ลบยานี้หากแพทย์สั่งหยุดยาแล้ว
                  </div>
                </div>

                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="px-3 py-1.5 bg-[#ffffff] hover:bg-[#fff1f0] text-[#ff3b30] border border-[#ff3b30]/30 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors active:scale-95"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>ลบยานี้</span>
                </button>
              </div>
            ) : (
              <div className="bg-[#fff1f0] border border-[#ff3b30]/40 rounded-2xl p-3.5 space-y-2.5 animate-in fade-in duration-150">
                <div className="flex items-start gap-2 text-[#d70015]">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <div className="text-xs leading-snug">
                    <strong className="block font-bold">ยืนยันการลบยาหรือไม่?</strong>
                    คุณต้องการลบ <strong>{drug.tradeName}</strong> ออกจากรายการยาของฉันใช่หรือไม่? (การแจ้งเตือนตารางเวลารับประทานยานี้จะถูกนำออกด้วย)
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-1">
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="px-3 py-1.5 bg-white border border-[#d1d1d6] hover:bg-[#f2f2f7] text-[#1d1d1f] text-xs font-semibold rounded-xl transition-colors"
                  >
                    ยกเลิก
                  </button>
                  <button
                    onClick={handleConfirmDelete}
                    className="px-3.5 py-1.5 bg-[#ff3b30] hover:bg-[#d70015] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors shadow-2xs"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>ยืนยันลบยา</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Done Button */}
        <div className="p-3 bg-[#ffffff] border-t border-[#e5e5ea] shrink-0">
          <button
            onClick={handleClose}
            className="w-full bg-[#f2f2f7] hover:bg-[#e5e5ea] text-[#1d1d1f] font-bold py-2.5 rounded-xl text-sm transition-colors"
          >
            ปิดหน้าต่าง
          </button>
        </div>
      </div>
    </div>
  );
};
