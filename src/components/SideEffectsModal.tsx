import React, { useState } from 'react';
import { Drug } from '../types';
import { X, AlertTriangle, Info, ShieldAlert, ZoomIn } from 'lucide-react';

interface SideEffectsModalProps {
  isOpen: boolean;
  onClose: () => void;
  drug: Drug | null;
  seniorMode: boolean;
}

export const SideEffectsModal: React.FC<SideEffectsModalProps> = ({
  isOpen,
  onClose,
  drug,
  seniorMode,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'urgent' | 'common'>('all');
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);

  if (!isOpen || !drug) return null;

  const sideEffects = drug.sideEffectDetails || [];
  const urgentEffects = sideEffects.filter((se) => se.isUrgent);
  const commonEffects = sideEffects.filter((se) => !se.isUrgent);

  const displayedEffects =
    activeTab === 'urgent'
      ? urgentEffects
      : activeTab === 'common'
      ? commonEffects
      : sideEffects;

  return (
    <div className="absolute inset-0 z-50 bg-black/65 backdrop-blur-xs flex flex-col justify-end animate-in fade-in duration-200 overflow-hidden">
      {/* Modal Sheet Strictly inside Phone Screen */}
      <div className="bg-[#ffffff] w-full h-full flex flex-col overflow-hidden shadow-2xl animate-in slide-in-from-bottom-4 duration-300">
        
        {/* Header */}
        <div className="p-3.5 bg-[#ffffff] border-b border-[#e5e5ea] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-[#ff9500]/15 text-[#ff9500] flex items-center justify-center shrink-0">
              <AlertTriangle className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 flex-wrap">
                <h3 className={`font-bold text-[#1d1d1f] tracking-tight truncate ${
                  seniorMode ? 'text-base' : 'text-sm'
                }`}>
                  ผลข้างเคียงและอาการแพ้
                </h3>
                <span className="text-[10px] font-bold bg-[#007aff]/10 text-[#007aff] px-1.5 py-0.5 rounded-md shrink-0">
                  {drug.tradeName}
                </span>
              </div>
              <p className="text-[10px] text-[#8e8e93] truncate">
                {drug.genericName} {drug.strength}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-[#8e8e93] hover:text-[#1d1d1f] hover:bg-[#f5f5f7] rounded-full transition-colors shrink-0"
            title="ปิด"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Filters */}
        <div className="px-3 pt-2 pb-1.5 border-b border-[#f0f0f2] flex items-center gap-1.5 bg-[#fbfbfd] shrink-0 overflow-x-auto">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-2.5 py-1 rounded-lg font-bold transition-all text-[11px] shrink-0 ${
              activeTab === 'all'
                ? 'bg-[#1d1d1f] text-white shadow-xs'
                : 'bg-[#f0f0f2] text-[#8e8e93] hover:text-[#1d1d1f]'
            }`}
          >
            ทั้งหมด ({sideEffects.length})
          </button>
          <button
            onClick={() => setActiveTab('urgent')}
            className={`px-2.5 py-1 rounded-lg font-bold transition-all text-[11px] shrink-0 flex items-center gap-1 ${
              activeTab === 'urgent'
                ? 'bg-[#d70015] text-white shadow-xs'
                : 'bg-[#fff1f0] text-[#d70015] hover:bg-[#ffe5e5]'
            }`}
          >
            <ShieldAlert className="w-3 h-3" />
            <span>อาการแพ้ที่ต้องระวัง ({urgentEffects.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('common')}
            className={`px-2.5 py-1 rounded-lg font-bold transition-all text-[11px] shrink-0 flex items-center gap-1 ${
              activeTab === 'common'
                ? 'bg-[#007aff] text-white shadow-xs'
                : 'bg-[#f0f6ff] text-[#007aff] hover:bg-[#e1edff]'
            }`}
          >
            <Info className="w-3 h-3" />
            <span>อาการทั่วไป ({commonEffects.length})</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-[#f8f9fc]">
          {/* Important Clinical Notice Header */}
          <div className="p-2.5 rounded-xl bg-[#fff9f0] border border-[#ff9500]/30 flex items-start gap-2">
            <Info className="w-3.5 h-3.5 text-[#ff9500] shrink-0 mt-0.5" />
            <div className="text-[11px] text-[#b25e00] leading-relaxed">
              <span className="font-bold block mb-0.5">ข้อแนะนำจากเภสัชกร:</span>
              <span>
                ผลข้างเคียงมีความหลากหลายตามกลไกยาแต่ละชนิด อาการทั่วไปมักหายเอง แต่หากพบอาการแพ้รุนแรง ปากบวม แน่นหน้าอก ให้หยุดยาทันที
              </span>
            </div>
          </div>

          {/* List of Side Effects Cards */}
          <div className="space-y-2.5">
            {displayedEffects.length === 0 ? (
              <div className="text-center py-8 text-[#8e8e93] text-xs">
                ไม่พบรายการในหมวดนี้
              </div>
            ) : (
              displayedEffects.map((effect) => (
                <div
                  key={effect.id}
                  className={`rounded-2xl border p-3 space-y-2.5 transition-shadow ${
                    effect.isUrgent
                      ? 'bg-[#fffbfb] border-[#ff3b30]/35 shadow-xs'
                      : 'bg-[#ffffff] border-[#e5e5ea] shadow-2xs'
                  }`}
                >
                  {/* Card Title & Severity Badge */}
                  <div className="flex items-start justify-between gap-1.5">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {effect.isUrgent ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-black bg-[#ff3b30] text-white px-2 py-0.5 rounded-md shadow-2xs">
                            <ShieldAlert className="w-2.5 h-2.5" />
                            <span>อาการแพ้รุนแรง</span>
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold bg-[#34c759]/15 text-[#248a3d] px-2 py-0.5 rounded-md">
                            อาการข้างเคียงทั่วไป
                          </span>
                        )}
                        <span className="text-[10px] text-[#8e8e93]">
                          · {effect.frequencyRate}
                        </span>
                      </div>
                      <h4
                        className={`font-black tracking-tight text-[#1d1d1f] mt-1 ${
                          seniorMode ? 'text-base' : 'text-xs'
                        }`}
                      >
                        {effect.name}
                      </h4>
                    </div>
                  </div>

                  {/* Photo Illustration if available */}
                  {effect.imageUrl && (
                    <div className="space-y-1">
                      <div className="relative rounded-xl overflow-hidden border border-[#e5e5ea] bg-black max-h-36 group">
                        <img
                          src={effect.imageUrl}
                          alt={effect.name}
                          className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <button
                          onClick={() => setZoomedImage(effect.imageUrl!)}
                          className="absolute bottom-1.5 right-1.5 bg-black/75 hover:bg-black text-white text-[10px] font-semibold px-2 py-0.5 rounded-md backdrop-blur-xs flex items-center gap-1 transition-colors"
                        >
                          <ZoomIn className="w-2.5 h-2.5" />
                          <span>ดูภาพขยาย</span>
                        </button>
                      </div>
                      <span className="text-[9px] text-[#8e8e93] block">
                        * ภาพตัวอย่างอาการทางคลินิกจริง เพื่อช่วยให้ผู้ป่วยเปรียบเทียบอาการ
                      </span>
                    </div>
                  )}

                  {/* Description */}
                  <p
                    className={`leading-relaxed text-[#48484a] ${
                      seniorMode ? 'text-sm' : 'text-[11px]'
                    }`}
                  >
                    {effect.description}
                  </p>

                  {/* Action / Clinical Recommendation */}
                  <div
                    className={`rounded-xl p-2 leading-relaxed text-[11px] ${
                      effect.isUrgent
                        ? 'bg-[#fff1f0] border border-[#ff3b30]/30 text-[#d70015] font-semibold'
                        : 'bg-[#f5f5f7] text-[#1d1d1f]'
                    }`}
                  >
                    <span className="font-bold block mb-0.5">
                      {effect.isUrgent ? '🚨 ข้อควรปฏิบัติทันที:' : '💡 คำแนะนำวิธีดูแลตนเอง:'}
                    </span>
                    {effect.recommendation}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-2.5 bg-[#ffffff] border-t border-[#e5e5ea] flex items-center justify-between shrink-0">
          <span className="text-[10px] text-[#8e8e93]">
            ข้อมูลจากฐานข้อมูลเภสัชวิทยาคลินิก
          </span>
          <button
            onClick={onClose}
            className="bg-[#007aff] hover:bg-[#0071e3] active:scale-[0.98] text-white font-bold px-3 py-1.5 rounded-xl text-xs transition-colors"
          >
            เข้าใจแล้ว ปิดหน้าต่าง
          </button>
        </div>

      </div>

      {/* Zoomed Image Lightbox strictly contained inside modal */}
      {zoomedImage && (
        <div
          onClick={() => setZoomedImage(null)}
          className="absolute inset-0 z-60 bg-black/90 flex flex-col items-center justify-center p-3 animate-in fade-in duration-150"
        >
          <div className="relative max-w-full max-h-full flex flex-col items-center">
            <img
              src={zoomedImage}
              alt="Zoomed side effect photo"
              className="max-h-[70vh] w-auto rounded-xl object-contain border border-white/20 shadow-2xl"
            />
            <button
              onClick={() => setZoomedImage(null)}
              className="mt-3 bg-white/20 hover:bg-white/30 text-white text-xs px-3 py-1.5 rounded-full backdrop-blur-md font-bold transition-colors"
            >
              แตะที่นี่เพื่อปิดภาพขยาย
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
