import React from 'react';
import { Camera, Image as ImageIcon, MoreHorizontal } from 'lucide-react';

interface IOSActionSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPhotoLibrary: () => void;
  onSelectTakePhoto: () => void;
  onSelectBrowse: () => void;
}

export const IOSActionSheet: React.FC<IOSActionSheetProps> = ({
  isOpen,
  onClose,
  onSelectPhotoLibrary,
  onSelectTakePhoto,
  onSelectBrowse,
}) => {
  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 z-50 bg-black/40 backdrop-blur-xs flex flex-col justify-end p-2.5 animate-in fade-in duration-200">
      <div className="w-full max-w-[390px] mx-auto space-y-2 animate-in slide-in-from-bottom-6 duration-200">
        {/* Main Options Group Card (iOS Style) */}
        <div className="bg-white/90 dark:bg-[#252525]/90 backdrop-blur-xl rounded-2xl overflow-hidden divide-y divide-[#c6c6c8]/40 shadow-xl border border-white/20">
          {/* Take Photo or Video */}
          <button
            onClick={onSelectTakePhoto}
            className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-black/5 active:bg-black/10 transition-colors text-left"
          >
            <span className="text-[17px] text-[#007aff] font-normal tracking-tight">
              Take Photo or Video
            </span>
            <Camera className="w-5 h-5 text-[#007aff] stroke-[1.8]" />
          </button>

          {/* Photo Library */}
          <button
            onClick={onSelectPhotoLibrary}
            className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-black/5 active:bg-black/10 transition-colors text-left"
          >
            <span className="text-[17px] text-[#007aff] font-normal tracking-tight">
              Photo Library
            </span>
            <div className="relative w-5 h-5 flex items-center justify-center text-[#007aff]">
              <ImageIcon className="w-5 h-5 stroke-[1.8]" />
            </div>
          </button>

          {/* Browse */}
          <button
            onClick={onSelectBrowse}
            className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-black/5 active:bg-black/10 transition-colors text-left"
          >
            <span className="text-[17px] text-[#007aff] font-normal tracking-tight">
              Browse
            </span>
            <MoreHorizontal className="w-5 h-5 text-[#007aff] stroke-[1.8]" />
          </button>
        </div>

        {/* Cancel Button Card (iOS Style) */}
        <div className="bg-white/90 dark:bg-[#252525]/90 backdrop-blur-xl rounded-2xl overflow-hidden shadow-xl border border-white/20">
          <button
            onClick={onClose}
            className="w-full py-3.5 text-center text-[17px] font-semibold text-[#007aff] hover:bg-black/5 active:bg-black/10 transition-colors tracking-tight"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
