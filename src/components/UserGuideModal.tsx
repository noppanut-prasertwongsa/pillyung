import React from 'react';
import { X, Play, BookOpen, Camera, CheckCircle2, Bell, ShieldCheck } from 'lucide-react';

interface UserGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UserGuideModal: React.FC<UserGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-[#ffffff] rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl border border-[#e5e5ea] flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#f0f0f2] flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-[#f0f6ff] text-[#0066cc] flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-[#1d1d1f] text-base sm:text-lg">
                วิดีโอสอนการใช้งาน
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-[#8e8e93] hover:text-[#1d1d1f] p-1.5 rounded-full hover:bg-[#f5f5f7] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs sm:text-sm text-[#1d1d1f]">
          {/* Video Tutorial Preview Card */}
          <div className="rounded-2xl overflow-hidden border border-[#e5e5ea] bg-black text-white relative aspect-16/9 flex items-center justify-center group cursor-pointer shadow-xs">
            <img
              src="/images/rx_slip_paper_1790485763134.jpg"
              alt="Video thumbnail"
              className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 flex flex-col items-center justify-center">
              <div className="w-14 h-14 rounded-full bg-[#0066cc] text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <Play className="w-6 h-6 ml-1 fill-white" />
              </div>
              <span className="text-xs font-bold mt-2 text-white">
                วิดีโอสาธิตการใช้งาน 1 นาที (กดเพื่อเล่น)
              </span>
            </div>
          </div>

          {/* 3 Simple Steps for Seniors */}
          <div className="space-y-3 pt-1">
            <h4 className="font-bold text-[#1d1d1f] text-sm flex items-center gap-1.5">
              <span>3 ขั้นตอนง่ายๆ ในการใช้งาน pillyung:</span>
            </h4>

            {/* Step 1 */}
            <div className="p-3.5 rounded-2xl bg-[#f5f5f7] border border-[#e5e5ea] flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-[#0066cc] text-white font-bold flex items-center justify-center shrink-0 text-sm">
                1
              </div>
              <div>
                <span className="font-bold text-[#1d1d1f] block text-xs sm:text-sm">
                  ถ่ายภาพฉลากยา หรือพิมพ์ชื่อยา
                </span>
                <p className="text-xs text-[#8e8e93] mt-0.5 leading-relaxed">
                  กดปุ่มสแกนยา ถ่ายภาพซองยาในที่สว่าง หรือหากไม่สะดวกถ่ายภาพสามารถพิมพ์ชื่อยาค้นหาได้ทันที
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="p-3.5 rounded-2xl bg-[#f5f5f7] border border-[#e5e5ea] flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-[#0066cc] text-white font-bold flex items-center justify-center shrink-0 text-sm">
                2
              </div>
              <div>
                <span className="font-bold text-[#1d1d1f] block text-xs sm:text-sm">
                  ตรวจสอบความถูกต้องร่วมกับ AI (Human-in-the-loop)
                </span>
                <p className="text-xs text-[#8e8e93] mt-0.5 leading-relaxed">
                  ระบบจะสกัดชื่อยา ขนาดยา และข้อห้ามบดยาขึ้นมาให้ผู้ใช้ตรวจทานอีกครั้ง หากตรงกันจึงกดยืนยัน
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="p-3.5 rounded-2xl bg-[#f5f5f7] border border-[#e5e5ea] flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-[#0066cc] text-white font-bold flex items-center justify-center shrink-0 text-sm">
                3
              </div>
              <div>
                <span className="font-bold text-[#1d1d1f] block text-xs sm:text-sm">
                  รับประทานยาตามเตือน และกดแตะ "ทานแล้ว"
                </span>
                <p className="text-xs text-[#8e8e93] mt-0.5 leading-relaxed">
                  เมื่อถึงเวลา มื้อเช้า กลางวัน เย็น หรือก่อนนอน เพียงกดปุ่ม "กดบันทึกการกินยา" ระบบจะบันทึกให้อัตโนมัติ
                </p>
              </div>
            </div>
          </div>

          {/* Safety Advice */}
          <div className="p-3 bg-[#fff9f0] border border-[#ff9500]/30 rounded-2xl text-[11px] text-[#b25e00] flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5 text-[#b25e00]" />
            <p className="leading-relaxed">
              <strong>คำแนะนำด้านความปลอดภัย:</strong> หากไม่มั่นใจในตัวยา หรือสงสัยว่าเกิดอาการแพ้ เช่น ผื่นคัน หายใจไม่ออก ให้หยุดยาทันทีและรีบไปพบแพทย์หรือโทรสายด่วน 1669
            </p>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={onClose}
              className="bg-[#0066cc] text-white px-5 py-2.5 rounded-full text-xs font-semibold hover:bg-[#0071e3] transition-colors"
            >
              เข้าใจแล้ว ปิดหน้าต่างวิดีโอ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
