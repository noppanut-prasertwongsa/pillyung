import React from 'react';
import { X, Phone, AlertCircle, Building2, ExternalLink, ShieldAlert, HeartPulse } from 'lucide-react';
import { Button } from './ui/Button';

interface ContactRealPharmacistModalProps {
  isOpen: boolean;
  onClose: () => void;
  seniorMode?: boolean;
}

export const ContactRealPharmacistModal: React.FC<ContactRealPharmacistModalProps> = ({
  isOpen,
  onClose,
  seniorMode = false,
}) => {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="contact-pharmacist-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200 select-none"
    >
      <div className="bg-[#ffffff] rounded-3xl w-full max-w-md overflow-hidden shadow-2xl border border-[#e5e7eb] flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#e5e7eb] flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#e8f1fa] text-[#0066cc] flex items-center justify-center shrink-0">
              <Phone className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h3
                id="contact-pharmacist-title"
                className={`font-black text-[#111827] tracking-tight ${
                  seniorMode ? 'text-xl' : 'text-base sm:text-lg'
                }`}
              >
                ติดต่อเภสัชกรตัวจริง
              </h3>
              <p className="text-xs text-[#6b7280]">
                ช่องทางติดต่อบุคลากรทางการแพทย์จริง
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-[#6b7280] hover:text-[#111827] hover:bg-[#f1f5f9] transition-colors cursor-pointer"
            aria-label="ปิดหน้าต่าง"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4">
          {/* Important Notice */}
          <div className="bg-[#eff6ff] border border-[#bfdbfe] rounded-2xl p-3.5 text-xs text-[#1e40af] leading-relaxed">
            <div className="flex items-center gap-1.5 font-bold mb-1">
              <ShieldAlert className="w-4 h-4 text-[#2563eb] shrink-0" />
              <span>ความปลอดภัยของผู้ป่วยเป็นสิ่งสำคัญสูงสุด</span>
            </div>
            <p>
              AI ทำหน้าที่ให้ข้อมูลตำรับยาเบื้องต้นเท่านั้น หากมีข้อสงสัยเรื่องการปรับขนาดยา การแพ้ยา หรืออันตรกิริยาที่ซับซ้อน ควรปรึกษาเภสัชกรหรือแพทย์ผู้รักษาโดยตรง
            </p>
          </div>

          {/* Contact Channels List */}
          <div className="space-y-2.5">
            {/* Channel 1: Hospital Pharmacy (Configurable Entry) */}
            <div className="p-4 rounded-2xl border border-[#e5e7eb] bg-[#f8fafc] space-y-2">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[#0066cc] shrink-0" />
                <span className="font-bold text-xs sm:text-sm text-[#111827]">
                  ห้องยา / โรงพยาบาลตามสิทธิการรักษาของท่าน
                </span>
              </div>
              <p className="text-xs text-[#6b7280] leading-relaxed">
                ติดต่อห้องยาที่จ่ายยาให้ท่านโดยตรง (ตรวจสอบหมายเลขโทรศัพท์ได้จากหน้าซองยาหรือใบนัดแพทย์)
              </p>
              <div className="p-2.5 bg-white rounded-xl border border-[#e5e7eb] text-xs text-[#374151] flex items-center justify-between">
                <span>เบอร์ห้องยาประจำตัว:</span>
                <span className="font-bold text-[#0066cc]">(ตั้งค่าตามซองยาของท่าน)</span>
              </div>
            </div>

            {/* Channel 2: NHSO 1330 (National Health Security Office) */}
            <div className="p-4 rounded-2xl border border-[#e5e7eb] bg-[#ffffff] space-y-2 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs sm:text-sm text-[#111827]">
                  สายด่วน สปสช. (สอบถามสิทธิและยา)
                </span>
                <span className="text-xs bg-[#e8f1fa] text-[#0066cc] font-bold px-2.5 py-0.5 rounded-full">
                  โทรฟรี 24 ชม.
                </span>
              </div>
              <p className="text-xs text-[#6b7280]">
                ศูนย์บริการข้อมูลหลักประกันสุขภาพแห่งชาติ ให้คำแนะนำเรื่องสิทธิยาและการรักษา
              </p>
              <a
                href="tel:1330"
                className="w-full inline-flex items-center justify-center gap-2 bg-[#0066cc] hover:bg-[#0052a3] text-white text-xs font-bold py-2.5 px-4 rounded-xl transition-colors cursor-pointer"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>โทร 1330</span>
              </a>
            </div>

            {/* Channel 3: Emergency 1669 */}
            <div className="p-4 rounded-2xl border border-[#fecaca] bg-[#fef2f2] space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs sm:text-sm text-[#dc2626] flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-[#dc2626]" />
                  <span>สายด่วนการแพทย์ฉุกเฉิน (กรณีแพ้ยารุนแรง)</span>
                </span>
                <span className="text-xs bg-[#dc2626] text-white font-bold px-2 py-0.5 rounded-full">
                  โทร 1669
                </span>
              </div>
              <p className="text-xs text-[#991b1b]">
                หากมีอาการปากบวม แน่นหน้าอก หายใจไม่ออก หรือหมดสติ โทรเรียกรถพยาบาลฉุกเฉินทันที
              </p>
              <a
                href="tel:1669"
                className="w-full inline-flex items-center justify-center gap-2 bg-[#dc2626] hover:bg-[#b91c1c] text-white text-xs font-bold py-2.5 px-4 rounded-xl transition-colors cursor-pointer"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>โทร 1669 เรียกรถพยาบาล</span>
              </a>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#f8fafc] border-t border-[#e5e7eb] flex justify-end shrink-0">
          <Button
            type="button"
            variant="outline"
            size="md"
            onClick={onClose}
            className="w-full"
          >
            ปิดหน้าต่าง
          </Button>
        </div>
      </div>
    </div>
  );
};
