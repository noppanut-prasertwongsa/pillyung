import React from 'react';
import { Drug, UserProfile } from '../types';
import { ShieldAlert, AlertTriangle, PhoneCall, XCircle } from 'lucide-react';

interface AllergyAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  detectedDrug: Drug | null;
  userProfile: UserProfile;
}

export const AllergyAlertModal: React.FC<AllergyAlertModalProps> = ({
  isOpen,
  onClose,
  detectedDrug,
  userProfile,
}) => {
  if (!isOpen || !detectedDrug) return null;

  return (
    <div className="absolute inset-0 z-50 bg-black/70 backdrop-blur-xs flex flex-col justify-center p-3 animate-in fade-in duration-200 overflow-hidden">
      <div className="bg-[#ffffff] rounded-3xl w-full max-h-[92%] flex flex-col overflow-hidden shadow-2xl border-t-8 border-[#ff3b30] animate-in zoom-in-95 duration-200">
        {/* Urgent Warning Header */}
        <div className="p-4 text-center space-y-2 shrink-0">
          <div className="w-12 h-12 rounded-full bg-[#fff1f0] border-2 border-[#ff3b30]/30 text-[#d70015] flex items-center justify-center mx-auto animate-pulse">
            <ShieldAlert className="w-6 h-6 stroke-[2.5]" />
          </div>

          <h2 className="text-lg font-bold text-[#d70015] tracking-tight">
            คำเตือน: ตรวจพบความเสี่ยงแพ้ยา!
          </h2>
          <p className="text-[11px] text-[#8e8e93] font-medium">
            AI Drug Allergy & Cross-Reactivity Engine
          </p>
        </div>

        {/* Clinical Detail Box */}
        <div className="px-4 pb-4 space-y-3 overflow-y-auto flex-1">
          <div className="bg-[#fff1f0] border border-[#ff3b30]/30 rounded-2xl p-3 text-xs text-[#1d1d1f] space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold text-[#d70015]">
              <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
              <span>ตรวจพบการแพ้ยาข้ามกลุ่ม (Cross-Allergy)</span>
            </div>

            <p className="leading-relaxed text-[#1d1d1f]">
              ยา <span className="font-bold underline text-[#d70015]">{detectedDrug.tradeName} ({detectedDrug.genericName})</span> อยู่ในกลุ่มยา <span className="font-bold text-[#d70015]">{detectedDrug.drugGroup}</span>
            </p>

            <div className="p-2 bg-white rounded-xl border border-[#ff3b30]/20 text-[11px]">
              <span className="text-[#8e8e93] block mb-0.5">ประวัติการแพ้ยาของผู้ใช้ ({userProfile.name}):</span>
              <span className="font-bold text-[#d70015]">{userProfile.allergies.join(', ')}</span>
              {userProfile.allergySymptoms && (
                <span className="text-[#48484a] block mt-0.5">อาการ: {userProfile.allergySymptoms}</span>
              )}
            </div>

            <p className="text-[11px] font-semibold text-[#d70015] pt-0.5">
              ⛔ ห้ามรับประทานยานี้โดยเด็ดขาด! อาจก่อให้เกิดภาวะภูมิแพ้รุนแรง (Anaphylaxis)
            </p>
          </div>

          {/* Clinical Advice */}
          <div className="text-[11px] text-[#48484a] bg-[#f5f5f7] rounded-xl p-3 space-y-1">
            <div className="font-semibold text-[#1d1d1f] flex items-center gap-1">
              <PhoneCall className="w-3 h-3 text-[#0066cc]" />
              <span>แนวทางปฏิบัติที่แนะนำ:</span>
            </div>
            <ul className="list-disc list-inside space-y-0.5 text-[#48484a]">
              <li>ปฏิเสธการรับประทานยาตัวนี้ทันที</li>
              <li>นำซองยาไปแจ้งแพทย์หรือเภสัชกรเพื่อเปลี่ยนกลุ่มยาที่ปลอดภัย</li>
              <li>แจ้งประวัติการแพ้ Penicillin ทุกครั้งที่รับการรักษา</li>
            </ul>
          </div>

          {/* Action Button */}
          <button
            onClick={onClose}
            className="w-full bg-[#d70015] hover:bg-[#b00010] active:scale-[0.98] text-white font-medium py-3 px-4 rounded-xl flex items-center justify-center gap-2 text-xs shadow-sm transition-all"
          >
            <XCircle className="w-4 h-4" />
            <span>รับทราบและยกเลิกรายการยานี้ทันที</span>
          </button>
        </div>
      </div>
    </div>
  );
};
