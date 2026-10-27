import React from 'react';
import { Drug } from '../types';
import { AlertTriangle, Trash2, X } from 'lucide-react';

interface ConfirmDeleteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  drug: Drug | null;
  seniorMode: boolean;
}

export const ConfirmDeleteDialog: React.FC<ConfirmDeleteDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  drug,
  seniorMode,
}) => {
  if (!isOpen || !drug) return null;

  return (
    <div
      role="alertdialog"
      aria-modal="true"
      className="absolute inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200 select-none"
    >
      <div className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl border border-red-100 p-5 sm:p-6 text-center animate-in zoom-in-95 duration-200">
        {/* Warning Icon Badge */}
        <div className="w-16 h-16 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-3 shadow-inner">
          <Trash2 className="w-8 h-8 stroke-[2.2]" />
        </div>

        {/* Title */}
        <h3 className={`font-black text-[#1d1d1f] tracking-tight mb-2 ${
          seniorMode ? 'text-2xl' : 'text-xl'
        }`}>
          ยืนยันการลบรายการยา?
        </h3>

        {/* Drug Info Card Preview */}
        <div className="bg-[#f5f5f7] border border-[#e5e5ea] rounded-2xl p-3 my-3 text-left">
          <div className="font-bold text-[#1d1d1f] text-base flex items-center justify-between">
            <span>{drug.tradeName}</span>
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-bold">
              {drug.strength}
            </span>
          </div>
          <div className="text-xs text-[#8e8e93] mt-0.5">
            {drug.genericName}
          </div>
        </div>

        {/* Warning Explanatory Text */}
        <p className={`text-[#d70015] bg-red-50 p-2.5 rounded-xl border border-red-200/60 leading-relaxed text-xs mb-5 font-medium ${
          seniorMode ? 'text-sm' : 'text-xs'
        }`}>
          ⚠️ ข้อมูลยานี้และตารางเวลาแจ้งเตือนการทานยาทั้งหมดที่เกี่ยวข้องจะถูกนำออกจากเครื่องอย่างถาวร
        </p>

        {/* Action Buttons */}
        <div className="space-y-2">
          {/* Confirm Delete Button */}
          <button
            onClick={onConfirm}
            className={`w-full bg-[#ff3b30] hover:bg-[#d70015] active:scale-[0.98] text-white font-bold rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 ${
              seniorMode ? 'py-4 text-base' : 'py-3 text-sm'
            }`}
          >
            <Trash2 className="w-4 h-4 stroke-[2.5]" />
            <span>ยืนยันลบยานี้ออกจากระบบ</span>
          </button>

          {/* Cancel Button */}
          <button
            onClick={onClose}
            className={`w-full bg-[#f2f2f7] hover:bg-[#e5e5ea] active:scale-[0.98] text-[#1d1d1f] font-bold rounded-2xl transition-all ${
              seniorMode ? 'py-3.5 text-sm' : 'py-2.5 text-xs'
            }`}
          >
            ยกเลิก / เก็บยานี้ไว้
          </button>
        </div>
      </div>
    </div>
  );
};
