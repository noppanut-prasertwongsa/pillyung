import React, { useState, useRef } from 'react';
import { Drug } from '../types';
import { INITIAL_DRUG_DATABASE } from '../data/mockDrugs';
import { Camera, X, Upload, Sparkles, Check, AlertTriangle, Scan, RefreshCw } from 'lucide-react';

interface AIScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScanResult: (drug: Drug, customImage?: string) => void;
}

export const AIScannerModal: React.FC<AIScannerModalProps> = ({
  isOpen,
  onClose,
  onScanResult,
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedDrug, setSelectedDrug] = useState<Drug | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Pre-prepared realistic hospital prescription labels
  const sampleLabels = [
    {
      drug: INITIAL_DRUG_DATABASE[0], // Metformin 500mg
      title: 'ฉลากยา รพ.: Metformin 500 mg',
      subtitle: 'ซองยาเบาหวาน · มีคำเตือนห้ามบดยา · ปลอดภัย ไม่แพ้',
      imageUrl: INITIAL_DRUG_DATABASE[0].labelImageUrl || '/images/rx_label_metformin_1790485276098.jpg',
      badge: 'ตัวอย่างที่ 1 (ยาปกติ)',
      badgeColor: 'text-[#0066cc] bg-[#f0f6ff] border-[#0066cc]/30',
      detectedText: [
        'โรงพยาบาลศิริราช (Siriraj Hospital)',
        'Metformin Hydrochloride 500 mg',
        'รับประทานครั้งละ 1 เม็ด วันละ 2 ครั้ง พร้อมอาหาร',
        '⚠️ ข้อห้าม: กลืนทั้งเม็ด ห้ามเคี้ยวหรือบดยา',
      ],
    },
    {
      drug: INITIAL_DRUG_DATABASE[1], // Augmentin 1000mg
      title: 'ฉลากยา รพ.: Augmentin 1000 mg',
      subtitle: 'ซองยาฆ่าเชื้อขอบแดง · กลุ่ม Penicillin · เสี่ยงแพ้ยาข้ามกลุ่ม!',
      imageUrl: INITIAL_DRUG_DATABASE[1].labelImageUrl || '/images/rx_label_augmentin_1790485292090.jpg',
      badge: 'ตัวอย่างที่ 2 (เตือนแพ้ยา)',
      badgeColor: 'text-[#d70015] bg-[#fff1f0] border-[#ff3b30]/30',
      detectedText: [
        'โรงพยาบาลกรุงเทพ (Bangkok Hospital)',
        'Augmentin 1000 mg (Amoxicillin + Clavulanic)',
        'กลุ่มยาปฏิชีวนะ: Penicillins',
        '⚠️ เตือนอันตราย: ตรวจสอบประวัติแพ้ยา Penicillin',
      ],
    },
  ];

  // Handle custom image upload from computer
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setSelectedImage(dataUrl);
      // Auto-detect based on filename or default to Metformin
      const lowerName = file.name.toLowerCase();
      if (lowerName.includes('augmentin') || lowerName.includes('amox') || lowerName.includes('penicillin')) {
        setSelectedDrug(INITIAL_DRUG_DATABASE[1]);
      } else {
        setSelectedDrug(INITIAL_DRUG_DATABASE[0]);
      }
    };
    reader.readAsDataURL(file);
  };

  // Start AI Vision / OCR Analysis
  const handleStartAnalysis = (drug: Drug, imageUrl: string) => {
    setSelectedImage(imageUrl);
    setSelectedDrug(drug);
    setIsAnalyzing(true);
    setAnalysisStep('กำลังตรวจจับกรอบตัวอักษรบนฉลากยา (Text Detection)...');

    setTimeout(() => {
      setAnalysisStep('กำลังอ่านชื่อยาและขนาดยา (OCR Extraction)...');
    }, 600);

    setTimeout(() => {
      setAnalysisStep('กำลังเทียบเคียงกับตำรับยาหลักแห่งชาติและประวัติการแพ้ยา...');
    }, 1200);

    setTimeout(() => {
      setIsAnalyzing(false);
      onScanResult(drug, imageUrl);
    }, 1800);
  };

  const handleResetModal = () => {
    setSelectedImage(null);
    setSelectedDrug(null);
    setIsAnalyzing(false);
    setAnalysisStep('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-[#ffffff] rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl border border-[#e5e5ea] flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#f0f0f2] flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-[#f0f6ff] text-[#0066cc] flex items-center justify-center">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-[#1d1d1f] text-base sm:text-lg">
                AI สแกนฉลากยา & ใบสั่งยา (OCR)
              </h3>
              <p className="text-[11px] text-[#8e8e93]">
                อัปโหลดรูปภาพฉลากยาจริง หรือเลือกตัวอย่างที่เตรียมไว้
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              handleResetModal();
              onClose();
            }}
            className="text-[#8e8e93] hover:text-[#1d1d1f] p-1.5 rounded-full hover:bg-[#f5f5f7] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1">
          {isAnalyzing && selectedImage ? (
            /* ACTIVE SCANNING SCREEN: Displays the actual uploaded/selected image with optical beam */
            <div className="py-4 flex flex-col items-center space-y-4">
              <div className="relative w-full max-w-[340px] aspect-4/3 rounded-2xl overflow-hidden border-2 border-[#0066cc] shadow-md bg-black">
                {/* Real Image Rendered */}
                <img
                  src={selectedImage}
                  alt="Prescription Label"
                  className="w-full h-full object-cover opacity-90"
                  referrerPolicy="no-referrer"
                />

                {/* Animated Laser Scan Line */}
                <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#0066cc] to-transparent shadow-[0_0_15px_#2997ff] animate-bounce"></div>

                {/* Simulated AI OCR Bounding Boxes */}
                <div className="absolute top-4 left-4 right-4 border border-[#30d158] bg-[#30d158]/20 px-2 py-1 rounded text-[10px] text-white font-mono flex items-center justify-between">
                  <span>[OCR 99.4%] Drug Identification</span>
                  <Sparkles className="w-3 h-3 text-[#30d158]" />
                </div>

                <div className="absolute bottom-4 left-4 right-4 border border-[#ffd60a] bg-black/60 backdrop-blur-xs px-2.5 py-1.5 rounded-lg text-[11px] text-white font-mono">
                  <div className="text-[#ffd60a] font-bold">
                    {selectedDrug?.tradeName} {selectedDrug?.strength}
                  </div>
                  <div className="text-[10px] text-gray-200">
                    กลุ่มยา: {selectedDrug?.drugGroup}
                  </div>
                </div>
              </div>

              {/* Progress Text */}
              <div className="text-center space-y-1">
                <div className="text-sm font-bold text-[#0066cc] flex items-center justify-center gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin text-[#0066cc]" />
                  <span>{analysisStep}</span>
                </div>
                <p className="text-xs text-[#8e8e93]">
                  กำลังตรวจสอบความเข้ากันได้ของขนาดยาและการแพ้ยาข้ามกลุ่ม...
                </p>
              </div>
            </div>
          ) : (
            /* IMAGE SELECTION & UPLOAD SCREEN */
            <div className="space-y-4">
              {/* Option A: Upload Custom Prescription Image from PC */}
              <div className="bg-[#f5f5f7] border-2 border-dashed border-[#c7c7cc] hover:border-[#0066cc] rounded-2xl p-4 text-center transition-colors">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="image/*"
                  className="hidden"
                />

                <div className="w-12 h-12 rounded-full bg-white shadow-xs text-[#0066cc] flex items-center justify-center mx-auto mb-2">
                  <Upload className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-[#1d1d1f] text-sm">
                  อัปโหลดรูปภาพฉลากยาของคุณเอง (Upload Image)
                </h4>
                <p className="text-xs text-[#8e8e93] mt-0.5 max-w-xs mx-auto">
                  รองรับไฟล์ภาพ JPG, PNG จากกล้องมือถือหรือไฟล์ที่เตรียมไว้
                </p>

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="mt-3 bg-[#ffffff] hover:bg-[#ebebee] text-[#0066cc] border border-[#0066cc]/30 font-semibold px-4 py-2 rounded-xl text-xs transition-all shadow-2xs active:scale-95"
                >
                  เลือกไฟล์ภาพจากคอมพิวเตอร์ / มือถือ
                </button>
              </div>

              {/* If user uploaded their own image, show preview and map button */}
              {selectedImage && !isAnalyzing && (
                <div className="p-4 bg-[#f0f6ff] border border-[#0066cc]/30 rounded-2xl space-y-3 animate-in fade-in">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[#0066cc]">✓ ภาพที่คุณอัปโหลดพร้อมวิเคราะห์:</span>
                    <button
                      onClick={() => setSelectedImage(null)}
                      className="text-[#8e8e93] hover:text-[#d70015]"
                    >
                      เปลี่ยนรูป
                    </button>
                  </div>

                  <div className="relative aspect-4/3 max-h-[160px] rounded-xl overflow-hidden border border-[#0066cc]/40 bg-black">
                    <img
                      src={selectedImage}
                      alt="Uploaded preview"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Let user pick which medicine to simulate for this image */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold text-[#48484a] block">
                      เลือกให้ AI วิเคราะห์ภาพนี้เป็นยาตัวไหน:
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => handleStartAnalysis(INITIAL_DRUG_DATABASE[0], selectedImage)}
                        className="p-2.5 rounded-xl border border-[#0066cc] bg-white text-left hover:bg-[#e4efff] transition-all text-xs font-semibold text-[#0066cc]"
                      >
                        1. Metformin 500 mg (ยาปกติ ไม่แพ้)
                      </button>

                      <button
                        type="button"
                        onClick={() => handleStartAnalysis(INITIAL_DRUG_DATABASE[1], selectedImage)}
                        className="p-2.5 rounded-xl border border-[#ff3b30] bg-[#fff1f0] text-left hover:bg-[#ffe5e3] transition-all text-xs font-semibold text-[#d70015]"
                      >
                        2. Augmentin 1000 mg (ทดสอบแพ้ยา)
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Divider */}
              <div className="relative flex py-1 items-center">
                <div className="flex-grow border-t border-[#e5e5ea]"></div>
                <span className="flex-shrink mx-3 text-xs text-[#8e8e93] font-medium">
                  หรือเลือกภาพฉลากยาที่ระบบเตรียมไว้ (คลิกเดียวเริ่มสแกน)
                </span>
                <div className="flex-grow border-t border-[#e5e5ea]"></div>
              </div>

              {/* Option B: Pre-prepared Realistic Hospital Prescription Bags */}
              <div className="space-y-3">
                {sampleLabels.map((sample, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleStartAnalysis(sample.drug, sample.imageUrl)}
                    className="p-3.5 rounded-2xl border border-[#e5e5ea] hover:border-[#0066cc] bg-white hover:bg-[#fafafc] transition-all cursor-pointer flex gap-3.5 items-center group active:scale-[0.98] shadow-2xs"
                  >
                    {/* Realistic Label Image Thumbnail */}
                    <div className="w-24 h-20 rounded-xl overflow-hidden bg-[#f5f5f7] border border-[#e5e5ea] shrink-0 relative group-hover:shadow-sm">
                      <img
                        src={sample.imageUrl}
                        alt={sample.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors flex items-center justify-center">
                        <Scan className="w-4 h-4 text-white drop-shadow-md opacity-80 group-hover:opacity-100" />
                      </div>
                    </div>

                    {/* Text Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${sample.badgeColor}`}>
                          {sample.badge}
                        </span>
                      </div>
                      <h4 className="font-bold text-[#1d1d1f] text-sm truncate">
                        {sample.title}
                      </h4>
                      <p className="text-xs text-[#8e8e93] line-clamp-1 mt-0.5">
                        {sample.subtitle}
                      </p>

                      <div className="mt-1.5 flex items-center gap-1 text-[11px] text-[#0066cc] font-semibold group-hover:underline">
                        <span>กดเพื่อสแกนรูปภาพนี้ทันที</span>
                        <Check className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-[#f5f5f7] border-t border-[#e5e5ea] flex items-center justify-between">
          <span className="text-[11px] text-[#8e8e93]">
            เทคโนโลยี AI Vision OCR จำลองมาตรฐานโรงพยาบาล
          </span>
          <button
            onClick={() => {
              handleResetModal();
              onClose();
            }}
            className="px-4 py-2 text-xs font-semibold text-[#48484a] hover:text-[#1d1d1f] rounded-xl hover:bg-[#e5e5ea] transition-colors"
          >
            ยกเลิก
          </button>
        </div>
      </div>
    </div>
  );
};
