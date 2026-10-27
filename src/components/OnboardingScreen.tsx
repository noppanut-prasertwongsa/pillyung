import React, { useState } from 'react';
import { UserProfile } from '../types';
import { ShieldCheck, AlertCircle, ArrowRight, Check, Activity } from 'lucide-react';

interface OnboardingScreenProps {
  onComplete: (profile: UserProfile) => void;
  seniorMode: boolean;
}

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onComplete, seniorMode }) => {
  const [name, setName] = useState('นายสมชาย ใจดี');
  const [age, setAge] = useState<number>(68);
  const [gender, setGender] = useState<'male' | 'female' | 'other' | 'unspecified'>('male');
  const [weight, setWeight] = useState<number>(65);
  const [height, setHeight] = useState<number>(168);

  // Allergy state: optional, not forced!
  const [hasAllergy, setHasAllergy] = useState<boolean>(true); // default true for convenient demo
  const [allergyInput, setAllergyInput] = useState('Penicillin / Amoxicillin');
  const [allergySymptoms, setAllergySymptoms] = useState('ผื่นลมพิษ แน่นหน้าอกเฉียบพลัน');

  // BMI calculation
  const heightM = height / 100;
  const bmi = heightM > 0 ? (weight / (heightM * heightM)).toFixed(1) : '23.0';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let allergiesList: string[] = [];
    if (hasAllergy && allergyInput.trim()) {
      allergiesList = allergyInput
        .split(/[,/]/)
        .map((item) => item.trim())
        .filter(Boolean);
    }

    onComplete({
      name: name.trim() || 'ผู้ใช้งาน',
      age: Number(age) || 60,
      gender,
      weight: Number(weight) || 60,
      height: Number(height) || 165,
      hasAllergy,
      allergies: allergiesList,
      allergySymptoms: hasAllergy ? allergySymptoms.trim() : '',
    });
  };

  return (
    <div className={`w-full h-full bg-[#ffffff] flex flex-col justify-between overflow-y-auto ${seniorMode ? 'text-lg' : 'text-base'}`}>
      {/* Main Form Fields */}
      <form onSubmit={handleSubmit} className="p-6 space-y-6 flex-1">
        {/* Section A: ข้อมูลพื้นฐาน & ร่างกาย */}
        <div className="space-y-4">
          <div className="pb-1">
            <span className={`font-semibold text-[#1d1d1f] ${seniorMode ? 'text-xl' : 'text-sm sm:text-base'}`}>
              A. ข้อมูลพื้นฐานและสัดส่วนร่างกาย
            </span>
          </div>

          {/* Name */}
          <div>
            <label className={`block font-medium text-[#1d1d1f] mb-1.5 ${seniorMode ? 'text-lg' : 'text-sm'}`}>
              ชื่อ - นามสกุล
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#f5f5f7] border border-[#e5e5ea] rounded-xl px-4 py-3 text-[#1d1d1f] focus:outline-none focus:border-[#0066cc] focus:bg-white transition-all text-base"
              placeholder="ระบุชื่อ-นามสกุล"
              required
            />
          </div>

          {/* Age & Gender Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={`block font-medium text-[#1d1d1f] mb-1.5 ${seniorMode ? 'text-lg' : 'text-sm'}`}>
                อายุ (ปี)
              </label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                min={1}
                max={120}
                className="w-full bg-[#f5f5f7] border border-[#e5e5ea] rounded-xl px-4 py-3 text-[#1d1d1f] focus:outline-none focus:border-[#0066cc] focus:bg-white transition-all text-base"
                required
              />
            </div>

            <div>
              <label className={`block font-medium text-[#1d1d1f] mb-1.5 ${seniorMode ? 'text-lg' : 'text-sm'}`}>
                เพศ
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as any)}
                className="w-full bg-[#f5f5f7] border border-[#e5e5ea] rounded-xl px-4 py-3 text-[#1d1d1f] focus:outline-none focus:border-[#0066cc] focus:bg-white transition-all text-base"
              >
                <option value="male">ชาย</option>
                <option value="female">หญิง</option>
                <option value="other">อื่นๆ</option>
                <option value="unspecified">ไม่ระบุ</option>
              </select>
            </div>
          </div>

          {/* BMI Row - Placed directly ABOVE Weight & Height */}
          <div className="bg-[#f0f6ff] border border-[#0066cc]/25 rounded-2xl p-3.5 flex items-center justify-between shadow-2xs">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-[#0066cc]/15 text-[#0066cc] flex items-center justify-center shrink-0">
                <Activity className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className={`font-bold text-[#0066cc] block leading-snug ${seniorMode ? 'text-base' : 'text-xs sm:text-sm'}`}>
                  ดัชนีมวลกาย (BMI)
                </span>
                <span className="text-[11px] text-[#4b5563] block truncate">
                  คำนวณอัตโนมัติจากน้ำหนักและส่วนสูง
                </span>
              </div>
            </div>

            <div className="text-right shrink-0 pl-2">
              <span className={`font-black text-[#0066cc] ${seniorMode ? 'text-2xl' : 'text-xl'}`}>
                {bmi}
              </span>
              <span className="text-xs text-[#6b7280] ml-1 font-medium">kg/m²</span>
            </div>
          </div>

          {/* Weight & Height Grid (Directly below BMI) */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={`block font-medium text-[#1d1d1f] mb-1.5 ${seniorMode ? 'text-lg' : 'text-sm'}`}>
                น้ำหนัก (กก.)
              </label>
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(Number(e.target.value))}
                min={20}
                max={300}
                step={0.5}
                className="w-full bg-[#f5f5f7] border border-[#e5e5ea] rounded-xl px-4 py-3 text-[#1d1d1f] focus:outline-none focus:border-[#0066cc] focus:bg-white transition-all text-base"
                placeholder="เช่น 65"
                required
              />
            </div>

            <div>
              <label className={`block font-medium text-[#1d1d1f] mb-1.5 ${seniorMode ? 'text-lg' : 'text-sm'}`}>
                ส่วนสูง (ซม.)
              </label>
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(Number(e.target.value))}
                min={50}
                max={250}
                className="w-full bg-[#f5f5f7] border border-[#e5e5ea] rounded-xl px-4 py-3 text-[#1d1d1f] focus:outline-none focus:border-[#0066cc] focus:bg-white transition-all text-base"
                placeholder="เช่น 168"
                required
              />
            </div>
          </div>
        </div>

        {/* Section B: ประวัติการแพ้ยา */}
        <div className="pt-2">
          <div className="flex items-center gap-1.5 mb-2.5">
            <AlertCircle className={`text-[#ff3b30] shrink-0 ${seniorMode ? 'w-5 h-5' : 'w-4 h-4'}`} />
            <span className={`font-semibold text-[#1d1d1f] ${seniorMode ? 'text-xl' : 'text-sm sm:text-base'}`}>
              B. ข้อมูลการแพ้ยา
            </span>
          </div>

          {/* Selector: มี / ไม่มี ประวัติแพ้ยา */}
          <div className="grid grid-cols-2 gap-2 mb-3">
            <button
              type="button"
              onClick={() => setHasAllergy(false)}
              className={`py-3 px-3 rounded-xl border text-xs sm:text-sm font-medium transition-all flex items-center justify-center gap-1.5 ${
                !hasAllergy
                  ? 'bg-[#f2f9f4] border-[#34c759] text-[#248a3d] font-semibold'
                  : 'bg-[#f5f5f7] border-[#e5e5ea] text-[#48484a] hover:bg-[#ebebee]'
              }`}
            >
              {!hasAllergy && <Check className="w-4 h-4" />}
              <span>ไม่มีประวัติแพ้ยา</span>
            </button>

            <button
              type="button"
              onClick={() => setHasAllergy(true)}
              className={`py-3 px-3 rounded-xl border text-xs sm:text-sm font-medium transition-all flex items-center justify-center gap-1.5 ${
                hasAllergy
                  ? 'bg-[#fff1f0] border-[#ff3b30] text-[#d70015] font-semibold'
                  : 'bg-[#f5f5f7] border-[#e5e5ea] text-[#48484a] hover:bg-[#ebebee]'
              }`}
            >
              {hasAllergy && <Check className="w-4 h-4" />}
              <span>มีประวัติแพ้ยา</span>
            </button>
          </div>

          {/* If Has Allergy: Expandable inputs */}
          {hasAllergy ? (
            <div className="bg-[#fff1f0] border border-[#ff3b30]/30 rounded-2xl p-4 space-y-3 animate-in fade-in duration-150">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className={`font-semibold text-[#d70015] ${seniorMode ? 'text-base' : 'text-xs'}`}>
                    ชื่อยาหรือกลุ่มยาที่แพ้:
                  </label>
                  <span className="text-[11px] text-[#8e8e93]">เช่น Penicillin, Sulfa</span>
                </div>
                <input
                  type="text"
                  value={allergyInput}
                  onChange={(e) => setAllergyInput(e.target.value)}
                  className="w-full bg-white border border-[#ff3b30]/40 rounded-xl px-4 py-2.5 text-[#1d1d1f] font-medium focus:outline-none focus:border-[#ff3b30] text-sm"
                  placeholder="ระบุชื่อยา เช่น Penicillin / Amoxicillin"
                />
              </div>

              {/* Quick shortcut chips for Demo convenience */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[11px] text-[#8e8e93]">เลือกด่วนสำหรับ Demo:</span>
                <button
                  type="button"
                  onClick={() => {
                    setAllergyInput('Penicillin / Amoxicillin');
                    setAllergySymptoms('ผื่นลมพิษ แน่นหน้าอกเฉียบพลัน');
                  }}
                  className="text-[11px] bg-white border border-[#ff3b30]/30 text-[#d70015] px-2 py-0.5 rounded-md hover:bg-[#ffe5e3]"
                >
                  + Penicillin / Amoxicillin (แนะนำสำหรับทดสอบ Alert)
                </button>
              </div>

              <div>
                <label className={`block text-[#8e8e93] mb-1 ${seniorMode ? 'text-sm' : 'text-xs'}`}>
                  อาการแพ้ที่เคยพบ (ถ้ามี):
                </label>
                <input
                  type="text"
                  value={allergySymptoms}
                  onChange={(e) => setAllergySymptoms(e.target.value)}
                  className="w-full bg-white border border-[#ff3b30]/20 rounded-xl px-3 py-2 text-[#48484a] text-xs focus:outline-none focus:border-[#ff3b30]"
                  placeholder="เช่น ผื่นลมพิษ แน่นหน้าอก บวมรอบดวงตา"
                />
              </div>
            </div>
          ) : (
            <div className="p-3 bg-[#f2f9f4] border border-[#34c759]/20 rounded-xl text-xs text-[#248a3d] flex items-center gap-2">
              <Check className="w-4 h-4 shrink-0" />
              <span>บันทึกสถานะ: ไม่มีประวัติแพ้ยา (NKDA - No Known Drug Allergy)</span>
            </div>
          )}
        </div>

        {/* Action Button */}
        <div className="pt-2 pb-6">
          <button
            type="submit"
            className="w-full bg-[#0066cc] hover:bg-[#0071e3] active:scale-[0.98] text-white font-medium py-3.5 px-6 rounded-full flex items-center justify-center gap-2 shadow-sm transition-all"
          >
            <ShieldCheck className="w-5 h-5" />
            <span className={seniorMode ? 'text-lg' : 'text-base'}>บันทึกข้อมูลและเข้าสู่ระบบ pillyung</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </button>
        </div>
      </form>
    </div>
  );
};
