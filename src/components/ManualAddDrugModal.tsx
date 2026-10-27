import React, { useState } from 'react';
import { Drug } from '../types';
import { INITIAL_DRUG_DATABASE } from '../data/mockDrugs';
import { X, Search, Plus, Check, AlertTriangle, Pill, Clock, Sparkles, CheckCircle2, Info } from 'lucide-react';

interface ManualAddDrugModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddDrug: (drug: Drug) => void;
  seniorMode: boolean;
}

export const ManualAddDrugModal: React.FC<ManualAddDrugModalProps> = ({
  isOpen,
  onClose,
  onAddDrug,
  seniorMode,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<Drug | null>(null);

  // Form Fields
  const [tradeName, setTradeName] = useState('');
  const [genericName, setGenericName] = useState('');
  const [strength, setStrength] = useState('');
  const [category, setCategory] = useState('');
  const [timing, setTiming] = useState('หลังอาหาร');
  const [instructions, setInstructions] = useState('');
  const [warnings, setWarnings] = useState('');
  const [pharmacistAdvice, setPharmacistAdvice] = useState('');
  const [canCrush, setCanCrush] = useState(true);
  const [isPRN, setIsPRN] = useState(false);
  const [selectedMeals, setSelectedMeals] = useState<('morning' | 'noon' | 'evening' | 'bedtime')[]>([
    'morning',
  ]);

  if (!isOpen) return null;

  // Filter templates from database
  const filteredTemplates = INITIAL_DRUG_DATABASE.filter(
    (d) =>
      d.tradeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.genericName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectTemplate = (template: Drug) => {
    setSelectedTemplate(template);
    setTradeName(template.tradeName);
    setGenericName(template.genericName);
    setStrength(template.strength);
    setCategory(template.category);
    setTiming(template.timing || 'หลังอาหาร');
    setInstructions(template.instructions);
    setWarnings(template.warnings || '');
    setPharmacistAdvice(template.pharmacistAdvice || '');
    setCanCrush(template.canCrush);
    
    // Check if drug is PRN (e.g. Paracetamol or empty schedule)
    if (!template.scheduleMeal || template.scheduleMeal.length === 0) {
      setIsPRN(true);
      setSelectedMeals([]);
    } else {
      setIsPRN(false);
      setSelectedMeals(template.scheduleMeal);
    }
  };

  const handleToggleMeal = (meal: 'morning' | 'noon' | 'evening' | 'bedtime') => {
    setIsPRN(false);
    if (selectedMeals.includes(meal)) {
      const nextMeals = selectedMeals.filter((m) => m !== meal);
      setSelectedMeals(nextMeals);
      if (nextMeals.length === 0) {
        setIsPRN(true);
      }
    } else {
      setSelectedMeals([...selectedMeals, meal]);
    }
  };

  const handleTogglePRN = () => {
    if (!isPRN) {
      setIsPRN(true);
      setSelectedMeals([]);
      setTiming('เมื่อมีอาการปวดหรือมีไข้ (PRN)');
      if (!instructions) {
        setInstructions('รับประทานครั้งละ 1 เม็ด ทุก 4-6 ชั่วโมง เมื่อมีอาการ');
      }
    } else {
      setIsPRN(false);
      setSelectedMeals(['morning']);
      setTiming('หลังอาหารเช้า');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tradeName.trim()) return;

    const mealsToSave = isPRN ? [] : selectedMeals;
    const timingToSave = isPRN
      ? timing || 'เมื่อมีอาการปวด หรือตามแพทย์สั่ง (PRN)'
      : timing || 'หลังอาหาร';

    const newDrug: Drug = selectedTemplate
      ? {
          ...selectedTemplate,
          id: `DRUG-MANUAL-${Date.now()}`,
          tradeName: tradeName.trim(),
          genericName: genericName.trim() || tradeName.trim(),
          strength: strength.trim() || 'ตามแพทย์สั่ง',
          category: category.trim() || 'ยารักษาโรคประจำตัว',
          timing: timingToSave,
          instructions: instructions.trim() || (isPRN ? 'รับประทานเมื่อมีอาการ' : 'รับประทานตามคำแนะนำของแพทย์'),
          warnings: warnings.trim(),
          pharmacistAdvice: pharmacistAdvice.trim(),
          canCrush,
          scheduleMeal: mealsToSave,
        }
      : {
          id: `DRUG-MANUAL-${Date.now()}`,
          tradeName: tradeName.trim(),
          genericName: genericName.trim() || tradeName.trim(),
          strength: strength.trim() || 'ตามแพทย์สั่ง',
          category: category.trim() || 'ยารักษาโรคประจำตัว',
          drugGroup: isPRN ? 'ยาบรรเทาอาการตามความจำเป็น' : 'ยาสามัญประจำตัว',
          route: 'รับประทาน',
          frequency: isPRN ? 'เมื่อมีอาการ (PRN)' : 'วันละ 1-2 ครั้ง',
          timing: timingToSave,
          instructions: instructions.trim() || (isPRN ? 'รับประทานเมื่อมีอาการ' : 'รับประทานตามคำแนะนำของแพทย์'),
          canCrush,
          warnings: warnings.trim(),
          pharmacistAdvice: pharmacistAdvice.trim(),
          commonSideEffects: 'อาจมีอาการคลื่นไส้หรือแน่นท้อง หากมีอาการแพ้ควรหยุดยาและพบแพทย์',
          crossAllergies: [],
          referenceSource: 'บันทึกด้วยตนเอง (Manual Record)',
          scheduleMeal: mealsToSave,
          iconType: 'tablet',
          isSpecialTechnique: false,
        };

    onAddDrug(newDrug);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="absolute inset-0 z-50 bg-black/65 backdrop-blur-xs flex flex-col justify-end animate-in fade-in duration-200 overflow-hidden"
    >
      <div className="bg-[#ffffff] w-full max-h-[95%] rounded-t-3xl flex flex-col overflow-hidden shadow-2xl animate-in slide-in-from-bottom-6 duration-300">
        {/* Header */}
        <div className="pt-2.5 pb-2 px-4 bg-[#ffffff] border-b border-[#e5e5ea] flex flex-col items-center shrink-0">
          <div className="w-10 h-1 bg-[#d1d1d6] rounded-full mb-2" />
          <div className="w-full flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#007aff]" />
              <h3 className={`font-bold text-[#1d1d1f] ${seniorMode ? 'text-lg' : 'text-base'}`}>
                คีย์รายการยาด้วยตนเอง
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-[#8e8e93] hover:text-[#1d1d1f] hover:bg-[#f2f2f7] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Quick Search Autocomplete from Standard Drug Database */}
          <div className="bg-[#f0f6ff] border border-[#007aff]/20 rounded-2xl p-3.5 space-y-2.5">
            <div className="flex items-center gap-1.5 text-[#007aff] font-bold text-xs">
              <Search className="w-4 h-4" />
              <span>ค้นหาและเลือกจากฐานข้อมูลยามาตรฐาน:</span>
            </div>

            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="พิมพ์ชื่อยา เช่น Ciprobay, Norvasc, Tylenol, Metformin..."
                className="w-full bg-white border border-[#d1d1d6] rounded-xl px-3.5 py-2.5 text-xs text-[#1d1d1f] placeholder:text-[#8e8e93] focus:outline-hidden focus:border-[#007aff]"
              />
            </div>

            {/* Quick Suggestions Chips */}
            <div className="flex items-center gap-1.5 flex-wrap pt-1">
              <span className="text-[11px] text-[#8e8e93]">ยายอดนิยม:</span>
              {INITIAL_DRUG_DATABASE.slice(0, 6).map((d) => (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => handleSelectTemplate(d)}
                  className={`text-[11px] px-2.5 py-1 rounded-full border transition-all ${
                    selectedTemplate?.id === d.id
                      ? 'bg-[#007aff] text-white border-[#007aff] font-bold'
                      : 'bg-white text-[#1d1d1f] border-[#d1d1d6] hover:border-[#007aff]'
                  }`}
                >
                  {d.tradeName} ({d.strength})
                </button>
              ))}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* Trade & Generic Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#1d1d1f] mb-1">
                  ชื่อการค้า / ชื่อบนซองยา *
                </label>
                <input
                  type="text"
                  required
                  value={tradeName}
                  onChange={(e) => setTradeName(e.target.value)}
                  placeholder="เช่น Ciprobay, Norvasc, Glucophage, Tylenol"
                  className="w-full bg-[#f9fafb] border border-[#d1d1d6] rounded-xl px-3 py-2 text-xs sm:text-sm text-[#1d1d1f] focus:outline-hidden focus:border-[#007aff]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1d1d1f] mb-1">
                  ชื่อสามัญทางยา (Generic Name)
                </label>
                <input
                  type="text"
                  value={genericName}
                  onChange={(e) => setGenericName(e.target.value)}
                  placeholder="เช่น Ciprofloxacin, Paracetamol, Amlodipine"
                  className="w-full bg-[#f9fafb] border border-[#d1d1d6] rounded-xl px-3 py-2 text-xs sm:text-sm text-[#1d1d1f] focus:outline-hidden focus:border-[#007aff]"
                />
              </div>
            </div>

            {/* Strength & Category */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#1d1d1f] mb-1">
                  ขนาดความแรง (Strength) *
                </label>
                <input
                  type="text"
                  required
                  value={strength}
                  onChange={(e) => setStrength(e.target.value)}
                  placeholder="เช่น 500 mg, 5 mg, 100 mcg"
                  className="w-full bg-[#f9fafb] border border-[#d1d1d6] rounded-xl px-3 py-2 text-xs sm:text-sm text-[#1d1d1f] focus:outline-hidden focus:border-[#007aff]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1d1d1f] mb-1">
                  กลุ่มยา / สรรพคุณ
                </label>
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="เช่น ยาฆ่าเชื้อแบคทีเรีย, ยาแก้ปวดลดไข้, ยาลดความดัน"
                  className="w-full bg-[#f9fafb] border border-[#d1d1d6] rounded-xl px-3 py-2 text-xs sm:text-sm text-[#1d1d1f] focus:outline-hidden focus:border-[#007aff]"
                />
              </div>
            </div>

            {/* Instructions */}
            <div>
              <label className="block text-xs font-bold text-[#1d1d1f] mb-1">
                วิธีและเวลาการรับประทาน *
              </label>
              <textarea
                rows={2}
                required
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                placeholder="เช่น รับประทานครั้งละ 1 เม็ด ทุก 4-6 ชั่วโมง เมื่อมีอาการปวด หรือ หลังอาหารเช้า-เย็น"
                className="w-full bg-[#f9fafb] border border-[#d1d1d6] rounded-xl px-3 py-2 text-xs sm:text-sm text-[#1d1d1f] focus:outline-hidden focus:border-[#007aff]"
              />
            </div>

            {/* Pharmacist Advice (Requested by user) */}
            <div>
              <label className="block text-xs font-bold text-[#007aff] mb-1 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-[#007aff]" />
                <span>คำแนะนำพิเศษจากเภสัชกร (เช่น ยา Ciprofloxacin ไม่ควรกินพร้อมนม)</span>
              </label>
              <textarea
                rows={2}
                value={pharmacistAdvice}
                onChange={(e) => setPharmacistAdvice(e.target.value)}
                placeholder="เช่น ไม่ควรรับประทานพร้อมนมหรือยาลดกรด เพราะจะลดการดูดซึมยา..."
                className="w-full bg-[#f0f6ff]/40 border border-[#007aff]/30 rounded-xl px-3 py-2 text-xs sm:text-sm text-[#1d1d1f] focus:outline-hidden focus:border-[#007aff]"
              />
            </div>

            {/* Meal Times Selection with PRN Support */}
            <div className="bg-[#f8f9fa] border border-[#e5e5ea] rounded-2xl p-3.5 space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-[#1d1d1f]">
                  มื้อเวลาแจ้งเตือนทานยา:
                </label>
                <span className="text-[11px] text-[#8e8e93]">
                  {isPRN || selectedMeals.length === 0 ? 'ทานเมื่อมีอาการ (PRN)' : `เลือก ${selectedMeals.length} มื้อ`}
                </span>
              </div>

              {/* PRN / As Needed Quick Button */}
              <button
                type="button"
                onClick={handleTogglePRN}
                className={`w-full py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-between border transition-all ${
                  isPRN || selectedMeals.length === 0
                    ? 'bg-[#ff9500]/15 text-[#b25e00] border-[#ff9500]/50 shadow-2xs'
                    : 'bg-white text-[#48484a] border-[#d1d1d6] hover:bg-[#f2f2f7]'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <Pill className="w-3.5 h-3.5 text-[#ff9500]" />
                  <span>ทานเฉพาะเมื่อมีอาการ / เมื่อปวด (PRN ไม่กำหนดมื้อประจำ)</span>
                </div>
                {(isPRN || selectedMeals.length === 0) && (
                  <CheckCircle2 className="w-4 h-4 text-[#ff9500] shrink-0" />
                )}
              </button>

              {/* Individual Meals Checkboxes */}
              <div>
                <span className="text-[11px] text-[#8e8e93] block mb-1">
                  หรือเลือกมื้อประจำที่ต้องทาน:
                </span>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { key: 'morning', label: 'เช้า' },
                    { key: 'noon', label: 'กลางวัน' },
                    { key: 'evening', label: 'เย็น' },
                    { key: 'bedtime', label: 'ก่อนนอน' },
                  ].map((item) => {
                    const isChecked = selectedMeals.includes(item.key as any);
                    return (
                      <button
                        key={item.key}
                        type="button"
                        onClick={() => handleToggleMeal(item.key as any)}
                        className={`py-2 px-1 rounded-xl text-xs font-semibold border transition-all text-center ${
                          isChecked
                            ? 'bg-[#007aff] text-white border-[#007aff] shadow-2xs font-bold'
                            : 'bg-white text-[#48484a] border-[#d1d1d6] hover:bg-[#f2f2f7]'
                        }`}
                      >
                        {item.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {(isPRN || selectedMeals.length === 0) && (
                <div className="flex items-start gap-1.5 text-[11px] text-[#8e8e93] bg-white p-2 rounded-xl border border-[#e5e5ea]">
                  <Info className="w-3.5 h-3.5 text-[#007aff] shrink-0 mt-0.5" />
                  <span>
                    ยานี้จะถูกบันทึกเป็นยาสำหรับรับประทานเมื่อมีอาการ (ไม่สร้างการแจ้งเตือนมื้ออาหารประจำวัน)
                  </span>
                </div>
              )}
            </div>

            {/* Can Crush Toggle */}
            <div className="bg-[#f5f5f7] p-3 rounded-xl border border-[#e5e5ea] flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-[#1d1d1f] block">
                  สถานะการบดยา / เคี้ยวเม็ดยา
                </span>
                <span className="text-[11px] text-[#8e8e93]">
                  {canCrush ? 'บดหรือแบ่งเม็ดยาได้' : 'ห้ามบดหรือเคี้ยวเม็ดยาเด็ดขาด'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setCanCrush(!canCrush)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  canCrush
                    ? 'bg-[#34c759]/15 text-[#248a3d] border border-[#34c759]/30'
                    : 'bg-[#ff3b30]/15 text-[#d70015] border border-[#ff3b30]/30'
                }`}
              >
                {canCrush ? 'บดยาได้' : 'ห้ามบดยา'}
              </button>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full bg-[#007aff] hover:bg-[#0071e3] active:scale-[0.98] text-white font-bold py-3.5 rounded-2xl text-sm flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>บันทึกและเพิ่มเข้าตารางยา</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
