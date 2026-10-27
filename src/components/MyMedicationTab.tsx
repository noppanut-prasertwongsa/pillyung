import React, { useState } from 'react';
import { Drug, ScheduledDose } from '../types';
import { Plus, BookOpen, ChevronRight, Sparkles, Pill, History } from 'lucide-react';
import { DrugDetailPage } from './DrugDetailPage';
import { AddDrugActionSheet } from './AddDrugActionSheet';
import { ManualAddDrugModal } from './ManualAddDrugModal';
import { MedicationHistoryView } from './MedicationHistoryView';

interface MyMedicationTabProps {
  drugs: Drug[];
  liveScheduledDoses?: ScheduledDose[];
  onOpenScanner: () => void;
  onAddDrug: (drug: Drug) => void;
  onOpenAIChat: (drug: Drug) => void;
  onOpenSideEffects: (drug: Drug) => void;
  onOpenSpecialTechniqueVideo: (drug: Drug) => void;
  onRemoveDrug: (drugId: string) => void;
  seniorMode: boolean;
  activeSubTab?: 'drugs' | 'history';
  onSubTabChange?: (tab: 'drugs' | 'history') => void;
}

export const MyMedicationTab: React.FC<MyMedicationTabProps> = ({
  drugs,
  liveScheduledDoses,
  onOpenScanner,
  onAddDrug,
  onOpenAIChat,
  onOpenSideEffects,
  onOpenSpecialTechniqueVideo,
  onRemoveDrug,
  seniorMode,
  activeSubTab,
  onSubTabChange,
}) => {
  // Navigation inside My Medication: 'drugs' (active medications) vs 'history' (30-day adherence calendar & list)
  const [internalSubTab, setInternalSubTab] = useState<'drugs' | 'history'>('drugs');
  const subTab = activeSubTab !== undefined ? activeSubTab : internalSubTab;
  const setSubTab = (val: 'drugs' | 'history') => {
    if (onSubTabChange) onSubTabChange(val);
    setInternalSubTab(val);
  };

  // If user selected a drug, switch to Full-Page Detail View (Native Push Navigation feel)
  const [activeDetailDrug, setActiveDetailDrug] = useState<Drug | null>(null);

  // Add Drug Modal / Action Sheet States
  const [isActionSheetOpen, setIsActionSheetOpen] = useState(false);
  const [isManualAddOpen, setIsManualAddOpen] = useState(false);

  // If viewing drug details, render full page view
  if (activeDetailDrug) {
    return (
      <DrugDetailPage
        drug={activeDetailDrug}
        onBack={() => setActiveDetailDrug(null)}
        onOpenSideEffects={onOpenSideEffects}
        onOpenSpecialTechniqueVideo={onOpenSpecialTechniqueVideo}
        onOpenAIChat={onOpenAIChat}
        onRemoveDrug={(id) => {
          onRemoveDrug(id);
          setActiveDetailDrug(null);
        }}
        seniorMode={seniorMode}
      />
    );
  }

  return (
    <div className={`p-4 space-y-3.5 w-full ${seniorMode ? 'text-lg' : 'text-base'}`}>
      {/* Top Segmented Control: My Medications vs 30-Day Adherence History */}
      <div className="bg-[#e5e5ea]/80 p-1 rounded-2xl flex items-center gap-1 w-full shrink-0 shadow-2xs">
        <button
          onClick={() => setSubTab('drugs')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            subTab === 'drugs'
              ? 'bg-white text-[#1d1d1f] shadow-xs'
              : 'text-[#6e6e73] hover:text-[#1d1d1f]'
          }`}
        >
          <Pill className="w-4 h-4 text-[#007aff]" />
          <span>ยาประจำตัว ({drugs.length})</span>
        </button>

        <button
          onClick={() => setSubTab('history')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            subTab === 'history'
              ? 'bg-white text-[#1d1d1f] shadow-xs'
              : 'text-[#6e6e73] hover:text-[#1d1d1f]'
          }`}
        >
          <History className="w-4 h-4 text-[#007aff]" />
          <span>ประวัติ 30 วัน</span>
        </button>
      </div>

      {/* Render History View if selected */}
      {subTab === 'history' ? (
        <MedicationHistoryView
          liveScheduledDoses={liveScheduledDoses}
          seniorMode={seniorMode}
        />
      ) : (
        <>
      {/* Primary Action Hero Banner with "+ เพิ่มรายการยา" */}
      <div className={`bg-[#ffffff] rounded-3xl border border-[#e5e5ea] shadow-xs w-full ${
        seniorMode ? 'p-5 sm:p-6' : 'p-4 sm:p-5'
      }`}>
        <div className="space-y-3 w-full">
          <div>
            <h2 className={`${
              seniorMode ? 'text-2xl sm:text-3xl' : 'text-xl'
            } font-black text-[#1d1d1f] tracking-tight leading-snug w-full`}>
              ยาประจำตัวของฉัน
            </h2>
            <p className={`text-[#8e8e93] mt-0.5 leading-relaxed ${
              seniorMode ? 'text-sm sm:text-base' : 'text-xs'
            }`}>
              แตะที่รายการยาเพื่อดูวิธีใช้ คำแนะนำเภสัชกร หรือคลิปสาธิต
            </p>
          </div>

          {/* Prominent "เพิ่มรายการยา" button */}
          <button
            onClick={() => setIsActionSheetOpen(true)}
            className={`w-full inline-flex items-center justify-center gap-2.5 bg-[#007aff] hover:bg-[#0071e3] active:scale-[0.98] text-white rounded-2xl font-bold transition-all shadow-sm ${
              seniorMode ? 'py-4 text-base sm:text-lg' : 'py-3.5 text-sm sm:text-base'
            }`}
          >
            <Plus className={`${seniorMode ? 'w-6 h-6' : 'w-5 h-5'} stroke-[3] shrink-0`} />
            <span>เพิ่มรายการยา</span>
          </button>
        </div>
      </div>

      {/* Drugs List: Concise Cards matching screenshot preview */}
      <div className="space-y-2.5 w-full">
        {drugs.length === 0 ? (
          <div className="text-center py-12 px-4 bg-white rounded-3xl border border-[#e5e5ea]">
            <div className="w-12 h-12 rounded-full bg-[#f5f5f7] flex items-center justify-center mx-auto text-[#8e8e93] mb-3">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-[#1d1d1f] text-base">ยังไม่มีรายการยาในระบบ</h3>
            <p className="text-xs text-[#8e8e93] mt-1 max-w-xs mx-auto">
              กดปุ่ม <strong className="text-[#007aff]">เพิ่มรายการยา</strong> ด้านบน เพื่อสแกนภาพฉลากยาด้วย AI หรือคีย์ข้อมูลยาด้วยตนเอง
            </p>
          </div>
        ) : (
          drugs.map((drug) => (
            <div
              key={drug.id}
              role="button"
              tabIndex={0}
              onClick={() => setActiveDetailDrug(drug)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setActiveDetailDrug(drug);
                }
              }}
              className={`bg-[#ffffff] rounded-2xl border border-[#e5e5ea] hover:border-[#b4d5fe] hover:shadow-xs active:bg-[#f9fafc] active:scale-[0.99] transition-all cursor-pointer p-4 group select-none ${
                seniorMode ? 'p-4 sm:p-5' : 'p-3.5 sm:p-4'
              }`}
            >
              <div className="flex items-center justify-between gap-2.5 w-full">
                {/* Left content: Trade Name + Strength Pill + Special Badge + Subtitle */}
                <div className="min-w-0 flex-1">
                  {/* Top Line: Name and Strength Pill */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className={`font-black text-[#1d1d1f] tracking-tight leading-snug break-words ${
                      seniorMode ? 'text-xl sm:text-2xl' : 'text-base sm:text-lg'
                    }`}>
                      {drug.tradeName}
                    </h3>
                    <span className={`font-bold bg-[#007aff]/10 text-[#007aff] rounded-full shrink-0 ${
                      seniorMode ? 'text-xs sm:text-sm px-2.5 py-0.5' : 'text-xs px-2.5 py-0.5'
                    }`}>
                      {drug.strength}
                    </span>
                  </div>

                  {/* Special Technique Tag (if present) */}
                  {drug.isSpecialTechnique && (
                    <div className="mt-1.5 mb-1 inline-flex items-center gap-1 bg-[#fff4e5] text-[#b25e00] border border-[#ffd599]/70 px-2 py-0.5 rounded-md text-[11px] font-bold shadow-2xs">
                      <Sparkles className="w-3 h-3 text-[#ff9500] shrink-0" />
                      <span>ยาเทคนิคพิเศษ</span>
                    </div>
                  )}

                  {/* Subtitle: Generic name · Indication / Category */}
                  <div className={`text-[#6e6e73] leading-snug break-words mt-1 ${
                    seniorMode ? 'text-sm font-medium' : 'text-xs sm:text-[13px]'
                  }`}>
                    <span>{drug.genericName}</span>
                    <span className="mx-1 text-[#c7c7cc]">·</span>
                    <span>{drug.category}</span>
                  </div>
                </div>

                {/* Right Arrow Navigation Indicator (Delete button is safely inside Detail Page) */}
                <div className="shrink-0 flex items-center justify-center pl-1 text-[#c7c7cc] group-hover:text-[#007aff] group-hover:translate-x-0.5 transition-all">
                  <ChevronRight className={`${seniorMode ? 'w-5 h-5' : 'w-4 h-4'}`} />
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      </>
      )}

      {/* Add Drug Action Sheet: Choose between AI Scan vs Manual Entry */}
      <AddDrugActionSheet
        isOpen={isActionSheetOpen}
        onClose={() => setIsActionSheetOpen(false)}
        onSelectScanAI={() => onOpenScanner()}
        onSelectManualInput={() => setIsManualAddOpen(true)}
        seniorMode={seniorMode}
      />

      {/* Manual Add Drug Modal */}
      <ManualAddDrugModal
        isOpen={isManualAddOpen}
        onClose={() => setIsManualAddOpen(false)}
        onAddDrug={(newDrug) => onAddDrug(newDrug)}
        seniorMode={seniorMode}
      />
    </div>
  );
};
