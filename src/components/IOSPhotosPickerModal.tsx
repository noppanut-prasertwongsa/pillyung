import React, { useState, useRef } from 'react';
import { Drug } from '../types';
import { INITIAL_DRUG_DATABASE } from '../data/mockDrugs';
import { RefreshCw, Camera, AlertTriangle, CheckCircle2, ArrowLeft, Edit3, Search, Image as ImageIcon } from 'lucide-react';

interface IOSPhotosPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScanResult: (drug: Drug, customImage?: string) => void;
}

interface PhotoItem {
  id: string;
  drug?: Drug;
  imageUrl: string;
  isBlurry?: boolean;
}

export const IOSPhotosPickerModal: React.FC<IOSPhotosPickerModalProps> = ({
  isOpen,
  onClose,
  onScanResult,
}) => {
  const [selectedPhotoId, setSelectedPhotoId] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [ocrStep, setOcrStep] = useState<string>('');
  
  // Verification Step state (Human-in-the-loop verification before saving)
  const [verificationDrug, setVerificationDrug] = useState<Drug | null>(null);
  const [verificationImage, setVerificationImage] = useState<string | undefined>(undefined);

  // Blurry error alert state
  const [blurryError, setBlurryError] = useState<boolean>(false);

  // Manual search mode state
  const [showManualSearch, setShowManualSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Authentic iOS Gallery Photos (Pure thumbnails, no labels or annotations)
  const [galleryPhotos, setGalleryPhotos] = useState<PhotoItem[]>([
    {
      id: 'photo-1',
      drug: INITIAL_DRUG_DATABASE[0], // Metformin 500mg
      imageUrl: '/images/rx_label_metformin_1790485276098.jpg',
    },
    {
      id: 'photo-inhaler',
      drug: INITIAL_DRUG_DATABASE[1], // Ventolin Evohaler (Special Technique Inhaler)
      imageUrl: '/images/rx_inhaler_label_1790576676925.jpg',
    },
    {
      id: 'photo-2',
      drug: INITIAL_DRUG_DATABASE[2], // Augmentin 1000mg (triggers allergy check)
      imageUrl: '/images/rx_label_augmentin_1790485292090.jpg',
    },
    {
      id: 'photo-3',
      drug: INITIAL_DRUG_DATABASE[3], // Norvasc 5mg
      imageUrl: '/images/rx_label_norvasc_somchai_1790578848938.jpg',
    },
    {
      id: 'photo-4',
      drug: INITIAL_DRUG_DATABASE[0], // Hospital prescription slip
      imageUrl: '/images/rx_slip_paper_1790485763134.jpg',
    },
    {
      id: 'photo-blurry',
      isBlurry: true, // Blurry photo to demonstrate OCR quality check
      imageUrl: '/images/rx_label_blurry_1790486674869.jpg',
    },
  ]);

  if (!isOpen) return null;

  // Handle selecting a photo from the camera roll
  const handleSelectPhoto = (photo: PhotoItem) => {
    setSelectedPhotoId(photo.id);
    setBlurryError(false);

    // If blurry photo is tapped -> AI Quality Control triggers rejection
    if (photo.isBlurry) {
      setIsScanning(true);
      setOcrStep('กำลังตรวจสอบความคมชัดของภาพ...');
      setTimeout(() => {
        setIsScanning(false);
        setBlurryError(true);
        setSelectedPhotoId(null);
      }, 900);
      return;
    }

    if (!photo.drug) return;

    // Simulate OCR Scanning then move to Human-in-the-loop Verification
    setIsScanning(true);
    setOcrStep('กำลังสแกนฉลากยาด้วย AI Vision (OCR)...');

    setTimeout(() => {
      setOcrStep(`ตรวจพบ: ${photo.drug?.tradeName} ${photo.drug?.strength}`);
    }, 600);

    setTimeout(() => {
      setOcrStep('ตรวจสอบฐานข้อมูลตำรับยาและการแพ้ยา...');
    }, 1100);

    setTimeout(() => {
      setIsScanning(false);
      setVerificationDrug(photo.drug!);
      setVerificationImage(photo.imageUrl);
      setSelectedPhotoId(null);
    }, 1500);
  };

  // Confirm verification and finish
  const handleConfirmVerification = () => {
    if (verificationDrug) {
      onScanResult(verificationDrug, verificationImage);
      handleResetModal();
    }
  };

  // Custom upload from user's local computer
  const handleCustomUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      const lower = file.name.toLowerCase();
      const matchedDrug =
        lower.includes('augmentin') || lower.includes('amox') || lower.includes('penicillin')
          ? INITIAL_DRUG_DATABASE[1]
          : INITIAL_DRUG_DATABASE[0];

      const newPhoto: PhotoItem = {
        id: `custom-${Date.now()}`,
        drug: matchedDrug,
        imageUrl: dataUrl,
      };

      setGalleryPhotos((prev) => [newPhoto, ...prev]);
      handleSelectPhoto(newPhoto);
    };
    reader.readAsDataURL(file);
  };

  const handleResetModal = () => {
    setVerificationDrug(null);
    setVerificationImage(undefined);
    setIsScanning(false);
    setBlurryError(false);
    setSelectedPhotoId(null);
    setShowManualSearch(false);
    setSearchQuery('');
  };

  const filteredDrugs = INITIAL_DRUG_DATABASE.filter(
    (d) =>
      d.tradeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.genericName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="absolute inset-0 z-50 bg-black/60 backdrop-blur-xs flex flex-col justify-end animate-in fade-in duration-200">
      {/* iOS Modal Sheet Container */}
      <div className="bg-[#ffffff] rounded-t-[36px] w-full max-h-[92%] flex flex-col overflow-hidden shadow-2xl border-t border-[#e5e5ea] animate-in slide-in-from-bottom-8 duration-300">
        
        {/* iOS Grabber */}
        <div className="w-9 h-1 bg-[#d1d1d6] rounded-full mx-auto mt-2.5 mb-1 shrink-0" />

        {/* Authentic iOS Photos Header */}
        <div className="px-4 py-2.5 flex items-center justify-between border-b border-[#f0f0f2] bg-[#ffffff] shrink-0">
          <button
            onClick={() => {
              if (verificationDrug) {
                setVerificationDrug(null);
              } else if (showManualSearch) {
                setShowManualSearch(false);
              } else {
                handleResetModal();
                onClose();
              }
            }}
            className="text-[15px] text-[#007aff] font-normal hover:opacity-75 transition-opacity flex items-center gap-1"
          >
            {verificationDrug || showManualSearch ? (
              <>
                <ArrowLeft className="w-4 h-4" />
                <span>ย้อนกลับ</span>
              </>
            ) : (
              <span>ยกเลิก</span>
            )}
          </button>

          <div className="text-center">
            <span className="font-semibold text-base text-[#1d1d1f] tracking-tight block">
              {verificationDrug
                ? 'ตรวจสอบข้อมูลยา'
                : showManualSearch
                ? 'ค้นหาชื่อยา'
                : 'ล่าสุด (Recents)'}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {!verificationDrug && !showManualSearch && (
              <>
                <button
                  onClick={() => setShowManualSearch(true)}
                  className="p-1.5 text-[#007aff] hover:bg-[#f0f6ff] rounded-full transition-colors"
                  title="ค้นหา / พิมพ์ชื่อยา"
                >
                  <Search className="w-4 h-4 stroke-[2.2]" />
                </button>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="p-1.5 text-[#007aff] hover:bg-[#f0f6ff] rounded-full transition-colors"
                  title="เลือกภาพจากคอมพิวเตอร์"
                >
                  <ImageIcon className="w-4 h-4 stroke-[2.2]" />
                </button>
              </>
            )}
            {verificationDrug && <div className="w-10"></div>}
            {showManualSearch && <div className="w-10"></div>}
          </div>
        </div>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleCustomUpload}
          accept="image/*"
          className="hidden"
        />

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto bg-[#ffffff]">
          {/* STATE 1: BLURRY PHOTO DETECTION ERROR */}
          {blurryError && (
            <div className="py-7 px-5 text-center space-y-4 animate-in fade-in">
              <div className="w-16 h-16 rounded-full bg-[#fff9f0] border-2 border-[#ff9500] text-[#b25e00] flex items-center justify-center mx-auto shadow-xs">
                <AlertTriangle className="w-8 h-8 stroke-[2.2]" />
              </div>
              <div className="space-y-1.5">
                <h4 className="text-lg font-bold text-[#1d1d1f]">
                  ภาพถ่ายไม่ชัดเจน หรือมีแสงสะท้อน
                </h4>
                <p className="text-xs text-[#8e8e93] max-w-xs mx-auto leading-relaxed">
                  ระบบ AI ตรวจพบว่าตัวอักษรบนฉลากยาเบลอ เพื่อความปลอดภัยสูงสุด กรุณาถ่ายใหม่อีกครั้ง หรือเลือกใช้ระบบพิมพ์ชื่อยาแทน
                </p>
              </div>

              <div className="pt-2 flex flex-col gap-2 max-w-xs mx-auto">
                <button
                  onClick={() => setBlurryError(false)}
                  className="w-full bg-[#007aff] active:scale-[0.98] text-white font-semibold py-3 px-4 rounded-xl text-sm transition-all"
                >
                  เลือกภาพใหม่อีกครั้ง
                </button>
                <button
                  onClick={() => {
                    setBlurryError(false);
                    setShowManualSearch(true);
                  }}
                  className="w-full bg-[#f5f5f7] active:scale-[0.98] text-[#1d1d1f] font-semibold py-2.5 px-4 rounded-xl text-xs hover:bg-[#ebebee] transition-all"
                >
                  เปลี่ยนเป็นพิมพ์ชื่อยาแทน
                </button>
              </div>
            </div>
          )}

          {/* STATE 2: ACTIVE SCANNING ANIMATION */}
          {isScanning && !blurryError && (
            <div className="py-10 px-4 flex flex-col items-center justify-center space-y-4 text-center">
              <div className="relative w-44 h-44 rounded-2xl overflow-hidden border-2 border-[#007aff] shadow-lg bg-black">
                <div className="absolute inset-0 bg-[#007aff]/15"></div>
                <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#2997ff] to-transparent shadow-[0_0_15px_#2997ff] animate-bounce"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Camera className="w-10 h-10 text-white/60 animate-pulse" />
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-sm font-semibold text-[#007aff] flex items-center justify-center gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin text-[#007aff]" />
                  <span>{ocrStep}</span>
                </div>
              </div>
            </div>
          )}

          {/* STATE 3: VERIFICATION STEP (Human-in-the-loop review) */}
          {verificationDrug && !isScanning && (
            <div className="p-4 space-y-3.5 animate-in fade-in">
              <div className="p-3 bg-[#f0f6ff] border border-[#007aff]/30 rounded-2xl text-xs text-[#007aff] flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block">AI สกัดข้อมูลฉลากยาสำเร็จ</span>
                  <span>โปรดตรวจสอบข้อมูลให้ตรงกับซองยาก่อนกดยืนยันบันทึก</span>
                </div>
              </div>

              {/* Scanned Image Preview & Extracted Details Card */}
              <div className="border border-[#e5e5ea] rounded-2xl p-4 bg-[#ffffff] space-y-3 shadow-xs">
                {verificationImage && (
                  <div className="h-32 w-full rounded-xl overflow-hidden bg-black border border-[#e5e5ea]">
                    <img
                      src={verificationImage}
                      alt="Scanned Label"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between pb-2 border-b border-[#f0f0f2]">
                    <span className="text-[#8e8e93]">ชื่อยาที่สแกนได้:</span>
                    <span className="font-bold text-[#1d1d1f] text-sm">
                      {verificationDrug.tradeName} ({verificationDrug.genericName})
                    </span>
                  </div>

                  <div className="flex items-center justify-between pb-2 border-b border-[#f0f0f2]">
                    <span className="text-[#8e8e93]">ขนาดยา / ความแรง:</span>
                    <span className="font-bold text-[#007aff] text-sm">{verificationDrug.strength}</span>
                  </div>

                  <div className="pb-2 border-b border-[#f0f0f2]">
                    <span className="text-[#8e8e93] block mb-1">วิธีรับประทาน:</span>
                    <span className="font-semibold text-[#1d1d1f]">{verificationDrug.instructions}</span>
                  </div>

                  {verificationDrug.warnings && (
                    <div className="p-2.5 bg-[#fff1f0] border border-[#ff3b30]/30 rounded-xl text-[#d70015]">
                      <span className="font-bold block">⚠️ ข้อควรระวัง / ข้อห้ามบดยา:</span>
                      <span className="text-[11px] mt-0.5 block">{verificationDrug.warnings}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* AI Disclaimer */}
              <div className="p-3 bg-[#fff9f0] border border-[#ff9500]/30 rounded-2xl text-[11px] text-[#b25e00] flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  <strong>คำเตือน:</strong> หากข้อมูลที่ AI อ่านได้ไม่ตรงกับซองยา หรือไม่มั่นใจ ให้ปรึกษาแพทย์หรือเภสัชกรก่อนรับประทานเสมอ
                </p>
              </div>

              {/* Action Confirmation Buttons */}
              <div className="space-y-2 pt-1 pb-4">
                <button
                  onClick={handleConfirmVerification}
                  className="w-full bg-[#007aff] active:scale-[0.98] text-white font-bold py-3.5 px-4 rounded-full text-sm shadow-sm transition-all"
                >
                  ✓ ข้อมูลถูกต้อง บันทึกยานี้เข้าสู่ระบบ
                </button>

                <button
                  onClick={() => setVerificationDrug(null)}
                  className="w-full bg-[#f5f5f7] active:scale-[0.98] text-[#48484a] font-medium py-2.5 px-4 rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>ข้อมูลไม่ตรง เลือกภาพใหม่หรือพิมพ์เอง</span>
                </button>
              </div>
            </div>
          )}

          {/* STATE 4A: PURE IPHONE PHOTO GALLERY (No annotations, clean 3-col camera roll) */}
          {!verificationDrug && !isScanning && !blurryError && !showManualSearch && (
            <div className="w-full">
              {/* Seamless 3-column iOS grid */}
              <div className="grid grid-cols-3 gap-[1.5px] bg-[#e5e5ea]">
                {galleryPhotos.map((photo) => {
                  const isSelected = selectedPhotoId === photo.id;

                  return (
                    <div
                      key={photo.id}
                      onClick={() => handleSelectPhoto(photo)}
                      className={`relative aspect-square overflow-hidden cursor-pointer active:opacity-70 transition-opacity bg-black ${
                        isSelected ? 'ring-3 ring-[#007aff] scale-[0.97]' : ''
                      }`}
                    >
                      <img
                        src={photo.imageUrl}
                        alt="Photo"
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  );
                })}
              </div>

              {/* iOS Footer photo count like in Apple Photos */}
              <div className="py-6 text-center text-[#8e8e93] text-xs">
                <span>{galleryPhotos.length} รูปภาพ</span>
              </div>
            </div>
          )}

          {/* STATE 4B: MANUAL DRUG SEARCH MODE */}
          {!verificationDrug && !isScanning && !blurryError && showManualSearch && (
            <div className="p-4 space-y-3">
              <div className="relative">
                <Search className="w-4 h-4 text-[#8e8e93] absolute left-3 top-3" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="พิมพ์ชื่อยา เช่น Metformin, Augmentin..."
                  autoFocus
                  className="w-full bg-[#f5f5f7] border border-[#e5e5ea] rounded-xl pl-9 pr-4 py-2.5 text-xs text-[#1d1d1f] focus:outline-none focus:border-[#007aff] focus:bg-white"
                />
              </div>

              <div className="space-y-2">
                {filteredDrugs.map((drug) => (
                  <div
                    key={drug.id}
                    onClick={() => {
                      setVerificationDrug(drug);
                      setVerificationImage(drug.labelImageUrl);
                      setShowManualSearch(false);
                    }}
                    className="p-3 rounded-2xl border border-[#e5e5ea] hover:border-[#007aff] hover:bg-[#f0f6ff] transition-all cursor-pointer flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-bold text-[#1d1d1f]">
                        {drug.tradeName} {drug.strength}
                      </div>
                      <div className="text-[#8e8e93] text-[11px] mt-0.5">
                        {drug.genericName} · {drug.category}
                      </div>
                    </div>
                    <span className="text-[#007aff] font-semibold text-[11px]">เลือก</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
