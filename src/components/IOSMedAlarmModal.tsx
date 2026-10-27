import React, { useState, useEffect, useRef } from 'react';
import { ScheduledDose, Drug } from '../types';
import { Bell, Volume2, VolumeX, Pill, ChevronRight, CheckCircle2, Clock } from 'lucide-react';
import {
  AlarmSoundType,
  startLoopingAlarmSound,
  stopLoopingAlarmSound,
} from '../utils/audioAlert';

interface IOSMedAlarmModalProps {
  isOpen: boolean;
  onClose: () => void;
  scheduledDoses: ScheduledDose[];
  activeDrugs: Drug[];
  seniorMode: boolean;
  onMarkEveningTaken?: () => void;
  soundType?: AlarmSoundType;
  onSoundTypeChange?: (sound: AlarmSoundType) => void;
}

export const IOSMedAlarmModal: React.FC<IOSMedAlarmModalProps> = ({
  isOpen,
  onClose,
  scheduledDoses,
  seniorMode,
  onMarkEveningTaken,
  soundType = 'nene',
}) => {
  const [dragProgress, setDragProgress] = useState(0); // 0 to 1
  const [isDragging, setIsDragging] = useState(false);
  const [isDismissing, setIsDismissing] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [maxSlideWidth, setMaxSlideWidth] = useState(260);

  const sliderTrackRef = useRef<HTMLDivElement>(null);
  const isPointerDownRef = useRef<boolean>(false);
  const dragProgressRef = useRef<number>(0);

  // Measure slider dimensions for responsive sliding
  const measureTrack = () => {
    if (sliderTrackRef.current) {
      const trackWidth = sliderTrackRef.current.clientWidth;
      const knobSize = 52;
      const padding = 12; // 6px left + 6px right
      setMaxSlideWidth(Math.max(trackWidth - knobSize - padding, 100));
    }
  };

  useEffect(() => {
    measureTrack();
    window.addEventListener('resize', measureTrack);
    return () => window.removeEventListener('resize', measureTrack);
  }, [isOpen]);

  // Toggle Mute
  const handleToggleMute = () => {
    if (!isMuted) {
      stopLoopingAlarmSound();
      setIsMuted(true);
    } else {
      setIsMuted(false);
      startLoopingAlarmSound(soundType, 4200);
    }
  };

  // Keep alarm audio playback running when modal opens
  useEffect(() => {
    if (isOpen && !isMuted) {
      dragProgressRef.current = 0;
      setDragProgress(0);
      setIsDismissing(false);
      // Play loop sound
      startLoopingAlarmSound(soundType, 4200);
    } else {
      stopLoopingAlarmSound();
    }
    return () => {
      stopLoopingAlarmSound();
    };
  }, [isOpen, isMuted, soundType]);

  // Filter evening / 18:00 doses
  const eveningDoses = scheduledDoses.filter(
    (d) => d.meal === 'evening' || d.time.includes('18:00') || d.time.includes('18.00')
  );

  // Default Glucophage 500 mg so screen is never blank
  const displayDoses =
    eveningDoses.length > 0
      ? eveningDoses
      : [
          {
            id: 'fallback-evening-1',
            drugId: 'DRUG-001',
            drugName: 'Glucophage 500 mg',
            dose: '1 เม็ด',
            meal: 'evening' as const,
            time: '18:00 น.',
            instructions: '',
            taken: false,
          },
        ];

  // Match with clean name
  const enrichedEveningDrugs = displayDoses.map((dose) => {
    const isMetforminOrGlucophage =
      dose.drugName.toLowerCase().includes('metformin') ||
      dose.drugName.toLowerCase().includes('glucophage') ||
      dose.drugId === 'DRUG-001';

    const cleanDrugName = isMetforminOrGlucophage
      ? dose.drugName.replace(/metformin/gi, 'Glucophage') || 'Glucophage 500 mg'
      : dose.drugName;

    return {
      dose: {
        ...dose,
        drugName: cleanDrugName.includes('Glucophage') ? cleanDrugName : 'Glucophage 500 mg',
      },
    };
  });

  const completeDismiss = () => {
    if (isDismissing) return;
    setIsDismissing(true);
    dragProgressRef.current = 1;
    setDragProgress(1);
    stopLoopingAlarmSound();
    if (onMarkEveningTaken) {
      onMarkEveningTaken();
    }
    setTimeout(() => {
      onClose();
    }, 350);
  };

  // Slider Drag Mechanics: Calculate progress based on clientX relative to the track's left side
  const updateProgressFromClientX = (clientX: number) => {
    if (!sliderTrackRef.current || isDismissing) return;
    const rect = sliderTrackRef.current.getBoundingClientRect();
    const knobWidth = 52;
    const padding = 6;
    const maxSlide = rect.width - knobWidth - padding * 2;
    if (maxSlide <= 0) return;

    const currentOffset = clientX - (rect.left + padding + knobWidth / 2);
    const progress = Math.min(Math.max(currentOffset / maxSlide, 0), 1);

    dragProgressRef.current = progress;
    setDragProgress(progress);

    if (progress >= 0.88) {
      completeDismiss();
    }
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isDismissing) return;
    isPointerDownRef.current = true;
    setIsDragging(true);
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // Ignore fallback
    }
    updateProgressFromClientX(e.clientX);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isPointerDownRef.current || isDismissing) return;
    updateProgressFromClientX(e.clientX);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isPointerDownRef.current) return;
    isPointerDownRef.current = false;
    setIsDragging(false);
    try {
      if (e.currentTarget.hasPointerCapture(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId);
      }
    } catch {
      // Ignore fallback
    }

    if (dragProgressRef.current >= 0.75) {
      completeDismiss();
    } else {
      // Spring back to start
      dragProgressRef.current = 0;
      setDragProgress(0);
    }
  };

  const handlePointerCancel = () => {
    isPointerDownRef.current = false;
    setIsDragging(false);
    dragProgressRef.current = 0;
    setDragProgress(0);
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="การแจ้งเตือนเวลารับประทานยา iOS 17:30"
      className="absolute inset-0 z-50 bg-[#000000]/98 backdrop-blur-3xl text-white flex flex-col justify-between overflow-hidden select-none animate-in fade-in duration-300"
    >
      {/* Top Subtle iOS Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-44 bg-blue-600/15 blur-[100px] pointer-events-none rounded-full" />

      {/* Screen Header Bar: iOS Status Bar + Sound Toggle */}
      <div className="pt-3 px-5 pb-2 flex items-center justify-between text-white/70 text-xs shrink-0 z-10">
        <div className="flex items-center gap-1.5 font-medium text-white/80">
          <Clock className="w-3.5 h-3.5 text-blue-400" />
          <span>การแจ้งเตือนยาตามเวลา (iOS MedAlert)</span>
        </div>

        {/* Audio Sound Toggle */}
        <button
          onClick={handleToggleMute}
          className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white/80 transition-colors flex items-center gap-1.5 text-[11px]"
          title={isMuted ? 'เปิดเสียงเตือน' : 'ปิดเสียงเตือน'}
        >
          {isMuted ? (
            <VolumeX className="w-3.5 h-3.5 text-rose-400" />
          ) : (
            <Volume2 className="w-3.5 h-3.5 text-blue-400" />
          )}
          <span>{isMuted ? 'ปิดเสียง' : 'เปิดเสียง'}</span>
        </button>
      </div>

      {/* Middle Content: Big Clock + Medicine Cards */}
      <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col items-center justify-center space-y-4 z-10">
        {/* Pulsing Alarm Icon & Ripple Effect */}
        <div className="relative flex items-center justify-center">
          <div className="absolute w-20 h-20 rounded-full bg-blue-500/20 animate-ping duration-1000" />
          <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
            <Bell className="w-8 h-8 text-white animate-bounce" />
          </div>
        </div>

        {/* Huge iOS Alarm Clock Display: 17:30 */}
        <div className="text-center space-y-1">
          <div className="text-xs uppercase tracking-widest text-blue-400 font-semibold flex items-center justify-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
            <span>วันนี้ • เตือนล่วงหน้า 30 นาที</span>
          </div>
          <h1 className="text-6xl sm:text-7xl font-extralight tracking-tighter text-white font-sans">
            17:30
          </h1>
          <p className={`${seniorMode ? 'text-xl' : 'text-base'} font-bold text-white tracking-tight`}>
            ใกล้ถึงเวลารับประทานยา (มื้อเย็น 18:00 น.)
          </p>
          <p className="text-xs text-white/70 max-w-xs mx-auto">
            กรุณาเตรียมยาและน้ำดื่มให้พร้อมสำหรับมื้อเย็นนี้
          </p>
        </div>

        {/* Rectangular Boxed Drug Cards for 18:00 */}
        <div className="w-full space-y-3 max-w-sm pt-1">
          {enrichedEveningDrugs.map(({ dose }) => (
            <div
              key={dose.id}
              className="w-full rounded-3xl border border-white/20 bg-white/10 backdrop-blur-xl p-5 shadow-2xl transition-all space-y-4"
            >
              {/* Badge: Meal Time */}
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 bg-blue-500/20 text-blue-300 border border-blue-400/30 text-xs font-bold px-3 py-1 rounded-xl">
                  <Pill className="w-3.5 h-3.5 text-blue-300" />
                  <span>มื้อเย็น 18:00 น.</span>
                </span>
                <span className="text-xs text-white/60 font-semibold">
                  ต้องทานตอนนี้
                </span>
              </div>

              {/* Extra Large Drug Name */}
              <div className="text-center py-1">
                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-snug break-words">
                  {dose.drugName}
                </h2>
              </div>

              {/* Extra Large Dosage Box */}
              <div className="border border-emerald-400/80 bg-emerald-500/20 rounded-2xl py-3 px-4 text-center shadow-lg">
                <span className="text-xs text-emerald-200/90 font-bold block mb-0.5">
                  จำนวนที่ต้องรับประทาน
                </span>
                <span className="text-3xl sm:text-4xl font-black text-emerald-300 tracking-tight block">
                  {dose.dose}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom iOS Slide to Dismiss Section */}
      <div className="p-4 pb-6 shrink-0 flex flex-col items-center space-y-3 z-10">
        {/* Helper subtitle */}
        <p className="text-[11px] text-white/60 text-center tracking-tight">
          เลื่อนแถบด้านล่างจากซ้ายไปขวา เพื่อรับทราบและหยุดเสียงเตือน
        </p>

        {/* Authentic iOS Slide to Stop / Dismiss Track */}
        <div
          ref={sliderTrackRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerCancel}
          className="relative w-full max-w-sm h-16 rounded-full bg-white/12 border border-white/20 shadow-2xl backdrop-blur-xl touch-none select-none overflow-hidden flex items-center cursor-pointer"
        >
          {/* Filled progress track background from left to right */}
          <div
            className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-blue-600/40 to-emerald-500/60 pointer-events-none rounded-full"
            style={{
              width: `${Math.max(dragProgress * 100, 0)}%`,
              transition: isDragging ? 'none' : 'width 250ms cubic-bezier(0.2, 0.8, 0.2, 1)',
            }}
          />

          {/* Shimmering Centered Hint Text */}
          <div
            className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 pl-8 pr-4"
            style={{ opacity: Math.max(1 - dragProgress * 2, 0) }}
          >
            <span className="text-xs sm:text-sm font-semibold tracking-wide text-white/90 flex items-center gap-1.5 drop-shadow-sm">
              <span>เลื่อนเพื่อปิดการแจ้งเตือน</span>
              <ChevronRight className="w-4 h-4 text-white/70 animate-pulse" />
            </span>
          </div>

          {/* Draggable Circular Knob firmly docked on the left, slides to the right */}
          <div
            role="slider"
            aria-label="เลื่อนจากซ้ายไปขวาเพื่อปิดการแจ้งเตือนยา"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(dragProgress * 100)}
            tabIndex={0}
            style={{
              transform: `translateX(${dragProgress * maxSlideWidth}px)`,
              transition: isDragging ? 'none' : 'transform 250ms cubic-bezier(0.2, 0.8, 0.2, 1)',
            }}
            className={`absolute left-1.5 top-1.5 bottom-1.5 w-[52px] h-[52px] rounded-full bg-white shadow-[0_4px_16px_rgba(0,0,0,0.5)] flex items-center justify-center z-20 transition-shadow ${
              isDragging ? 'shadow-blue-500/40 scale-102' : ''
            }`}
          >
            {dragProgress >= 0.75 || isDismissing ? (
              <CheckCircle2 className="w-7 h-7 text-emerald-600 animate-spin" />
            ) : (
              <ChevronRight className="w-7 h-7 text-slate-800 stroke-[2.5]" />
            )}
          </div>
        </div>

        {/* Quick Tap Fallback */}
        <button
          onClick={completeDismiss}
          className="text-[11px] text-white/50 hover:text-white underline decoration-white/30 transition-colors pt-0.5"
        >
          หรือ แตะที่นี่เพื่อปิดการแจ้งเตือนและหยุดเสียงทันที
        </button>
      </div>
    </div>
  );
};
