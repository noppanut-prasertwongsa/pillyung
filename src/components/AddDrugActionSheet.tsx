import React from 'react';
import { Camera, Edit3, X, Sparkles, ChevronRight } from 'lucide-react';

interface AddDrugActionSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectScanAI: () => void;
  onSelectManualInput: () => void;
  seniorMode: boolean;
}

export const AddDrugActionSheet: React.FC<AddDrugActionSheetProps> = ({
  isOpen,
  onClose,
  onSelectScanAI,
  onSelectManualInput,
  seniorMode,
}) => {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="absolute inset-0 z-50 bg-black/60 backdrop-blur-xs flex flex-col justify-end animate-in fade-in duration-200 overflow-hidden"
    >
      <div className="bg-[#ffffff] w-full rounded-t-3xl flex flex-col overflow-hidden shadow-2xl animate-in slide-in-from-bottom-4 duration-300">
        {/* Grabber indicator & Header */}
        <div className="pt-2.5 pb-2 px-4 bg-[#ffffff] border-b border-[#e5e5ea] flex flex-col items-center shrink-0">
          <div className="w-10 h-1 bg-[#d1d1d6] rounded-full mb-2" />
          <div className="w-full flex items-center justify-between">
            <h3 className={`font-bold text-[#1d1d1f] ${seniorMode ? 'text-lg' : 'text-base'}`}>
              เลือกวิธีเพิ่มรายการยา
            </h3>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-[#8e8e93] hover:text-[#1d1d1f] hover:bg-[#f2f2f7] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Action Options */}
        <div className="p-4 space-y-3">
          {/* Option 1: AI Scan */}
          <button
            onClick={() => {
              onClose();
              onSelectScanAI();
            }}
            className="w-full bg-[#f0f6ff] hover:bg-[#e4efff] border border-[#007aff]/30 active:scale-[0.99] rounded-2xl p-4 flex items-center justify-between text-left transition-all shadow-2xs group"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-12 h-12 rounded-2xl bg-[#007aff] text-white flex items-center justify-center shrink-0 shadow-sm">
                <Camera className="w-6 h-6" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className={`font-bold text-[#1d1d1f] ${seniorMode ? 'text-base' : 'text-sm'}`}>
                    สแกนฉลากยาด้วย AI
                  </span>
                  <span className="bg-[#007aff]/15 text-[#007aff] text-[10px] font-black px-1.5 py-0.5 rounded-md flex items-center gap-0.5">
                    <Sparkles className="w-2.5 h-2.5" />
                    <span>แนะนำ</span>
                  </span>
                </div>
                <p className="text-xs text-[#636366] mt-0.5 leading-snug">
                  เลือกภาพถ่ายซองยาจากคลังภาพ แล้วให้ AI ดึงข้อมูลและตรวจสอบการแพ้ยาให้อัตโนมัติ
                </p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-[#8e8e93] group-hover:text-[#007aff] group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
          </button>

          {/* Option 2: Manual Input */}
          <button
            onClick={() => {
              onClose();
              onSelectManualInput();
            }}
            className="w-full bg-[#ffffff] hover:bg-[#f9fafc] border border-[#d1d1d6] hover:border-[#007aff] active:scale-[0.99] rounded-2xl p-4 flex items-center justify-between text-left transition-all shadow-2xs group"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-12 h-12 rounded-2xl bg-[#34c759] text-white flex items-center justify-center shrink-0 shadow-sm">
                <Edit3 className="w-6 h-6" />
              </div>
              <div className="min-w-0">
                <span className={`font-bold text-[#1d1d1f] block ${seniorMode ? 'text-base' : 'text-sm'}`}>
                  คีย์รายการยาด้วยตนเอง
                </span>
                <p className="text-xs text-[#636366] mt-0.5 leading-snug">
                  ค้นหาจากฐานข้อมูลยามาตรฐาน (เช่น Ciprofloxacin, Norvasc) หรือพิมพ์ข้อมูลยาเอง
                </p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-[#8e8e93] group-hover:text-[#007aff] group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
          </button>
        </div>

        {/* Cancel Button */}
        <div className="p-3 bg-[#ffffff] border-t border-[#e5e5ea] shrink-0">
          <button
            onClick={onClose}
            className="w-full bg-[#f2f2f7] hover:bg-[#e5e5ea] text-[#1d1d1f] font-bold py-2.5 rounded-xl text-sm transition-colors"
          >
            ยกเลิก
          </button>
        </div>
      </div>
    </div>
  );
};
