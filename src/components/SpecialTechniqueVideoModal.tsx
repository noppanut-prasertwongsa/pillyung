import React, { useState, useEffect, useRef } from 'react';
import { Drug } from '../types';
import { X, Play, Pause, RotateCcw, Droplets, Sparkles, AlertCircle } from 'lucide-react';

interface SpecialTechniqueVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  drug: Drug | null;
  seniorMode: boolean;
}

export const SpecialTechniqueVideoModal: React.FC<SpecialTechniqueVideoModalProps> = ({
  isOpen,
  onClose,
  drug,
  seniorMode,
}) => {
  const technique = drug?.specialTechnique;
  const totalDuration = technique?.duration || 18;

  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(2); // 1x, 2x, 4x (default 2x for fast demo)
  const lastUpdateRef = useRef<number>(Date.now());

  // Reset or initialize on open
  useEffect(() => {
    if (isOpen) {
      setCurrentTime(0);
      setIsPlaying(true);
      lastUpdateRef.current = Date.now();
    } else {
      setIsPlaying(false);
    }
  }, [isOpen]);

  // Video playback loop timer (40ms smooth tick)
  useEffect(() => {
    if (!isOpen || !isPlaying) return;

    lastUpdateRef.current = Date.now();

    const interval = setInterval(() => {
      const now = Date.now();
      const delta = (now - lastUpdateRef.current) / 1000;
      lastUpdateRef.current = now;

      setCurrentTime((prev) => {
        const next = prev + delta * playbackSpeed;
        if (next >= totalDuration) {
          return 0; // Seamless loop for demonstration
        }
        return next;
      });
    }, 40);

    return () => clearInterval(interval);
  }, [isOpen, isPlaying, playbackSpeed, totalDuration]);

  if (!isOpen || !drug || !technique) return null;

  // Determine current active step based on currentTime (18s total)
  let currentStepIndex = 0;
  if (currentTime < 3) currentStepIndex = 0;
  else if (currentTime < 6) currentStepIndex = 1;
  else if (currentTime < 10) currentStepIndex = 2;
  else if (currentTime < 15) currentStepIndex = 3;
  else currentStepIndex = 4;

  const currentStep = technique.steps[currentStepIndex] || technique.steps[0];
  const progressPercent = Math.min(100, (currentTime / totalDuration) * 100);

  // Jump to specific step
  const handleJumpToStep = (index: number) => {
    const timeOffsets = [0, 3.1, 6.1, 10.1, 15.1];
    setCurrentTime(timeOffsets[index] || 0);
    setIsPlaying(true);
  };

  const formatSeconds = (sec: number) => {
    const s = Math.floor(sec);
    return `0:${s < 10 ? '0' : ''}${s}`;
  };

  // Step 3 Dynamic Calculation (Pressing Canister with Fingers & Inhaling)
  // Step 3 is 6.0s to 10.0s
  const step3Time = Math.max(0, Math.min(4, currentTime - 6));
  // Actuation starts at 0.5s into step 3 (currentTime ~6.5s)
  const isPressing = step3Time >= 0.5 && step3Time <= 3.2;
  const pressDepth = isPressing ? 8 : 0; // 8px downward movement of canister and fingers
  const inhaleRatio = Math.max(0, Math.min(1, (step3Time - 0.5) / 2.8)); // 0% to 100% deep inhalation

  // Step 4 Countdown (10.0s to 15.0s)
  const breathHoldCountdown = Math.max(1, Math.min(10, Math.ceil(15 - currentTime)));

  // Step 0 Shake vertical oscillation
  const shakeOffset = isPlaying ? Math.sin(currentTime * 20) * 7 : 0;

  return (
    <div className="absolute inset-0 z-50 bg-black/70 backdrop-blur-xs flex flex-col justify-end animate-in fade-in duration-200 overflow-hidden">
      {/* Modal Container strictly bounded inside the phone screen */}
      <div className="bg-[#ffffff] w-full h-full flex flex-col overflow-hidden shadow-2xl animate-in slide-in-from-bottom-4 duration-300">
        
        {/* iOS Native Modal Header */}
        <div className="px-4 py-2.5 bg-[#ffffff] border-b border-[#e5e5ea] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <span className="w-7 h-7 rounded-lg bg-[#007aff]/15 text-[#007aff] flex items-center justify-center text-xs font-bold shrink-0">
              🎥
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="font-bold text-[10px] bg-[#007aff] text-white px-2 py-0.5 rounded-md">
                  {technique.badge}
                </span>
                <span className="font-bold text-xs text-[#1d1d1f] truncate">
                  {drug.tradeName}
                </span>
              </div>
              <h3 className="font-bold text-xs text-[#1d1d1f] tracking-tight truncate">
                {technique.title}
              </h3>
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

        {/* Video Canvas / Vector Animation Area (Strictly sized inside phone screen) */}
        <div className="relative bg-[#090b10] text-white flex flex-col items-center justify-center overflow-hidden shrink-0 select-none border-b border-black/40">
          
          {/* Main Visual Animation Frame */}
          <div className="relative w-full h-[225px] flex items-center justify-center overflow-hidden bg-gradient-to-b from-[#0f172a] via-[#090d16] to-[#040608]">
            
            {/* Ambient Background Grid */}
            <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-25 pointer-events-none" />
            
            {/* Top Badges */}
            <div className="absolute top-2.5 left-3 z-20 flex items-center gap-1.5">
              <span className="text-[9px] bg-red-600/90 text-white font-black px-2 py-0.5 rounded-full flex items-center gap-1 uppercase tracking-wider shadow-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
                ANIMATION DEMO
              </span>
              <span className="text-[9px] bg-white/20 backdrop-blur-md text-white px-1.5 py-0.5 rounded-full font-bold">
                {playbackSpeed}x SPEED
              </span>
            </div>

            <div className="absolute top-2.5 right-3 z-20">
              <span className="text-[10px] font-mono text-cyan-300 bg-black/60 px-2 py-0.5 rounded-md border border-cyan-500/30">
                {formatSeconds(currentTime)} / {formatSeconds(totalDuration)}
              </span>
            </div>

            {/* ========================================================================= */}
            {/* === STEP 1 ANIMATION: Hand Shaking Inhaler Up & Down (0:00 - 0:03) === */}
            {/* ========================================================================= */}
            {currentStepIndex === 0 && (
              <div className="relative z-10 flex flex-col items-center justify-center w-full h-full animate-in fade-in duration-200">
                <div className="relative flex items-center justify-center my-0.5">
                  {/* Up/Down Motion arrows */}
                  <div className="absolute -left-10 flex flex-col items-center text-cyan-400 font-bold animate-bounce text-xs">
                    <span>▲</span>
                    <span className="text-[9px]">เขย่า</span>
                    <span>▼</span>
                  </div>
                  <div className="absolute -right-10 flex flex-col items-center text-cyan-400 font-bold animate-bounce text-xs">
                    <span>▲</span>
                    <span className="text-[9px]">เขย่า</span>
                    <span>▼</span>
                  </div>

                  {/* Vector: Hand holding MDI Inhaler vertically */}
                  <svg
                    width="140"
                    height="125"
                    viewBox="0 0 140 125"
                    fill="none"
                    style={{
                      transform: `translateY(${shakeOffset}px)`,
                      transition: 'transform 0.05s ease-out',
                    }}
                    className="drop-shadow-[0_0_15px_rgba(0,122,255,0.35)]"
                  >
                    {/* Metal Canister Top */}
                    <rect x="52" y="10" width="36" height="40" rx="5" fill="#94a3b8" stroke="#e2e8f0" strokeWidth="2" />
                    <rect x="55" y="14" width="30" height="5" rx="2" fill="#64748b" />
                    {/* Canister Label */}
                    <rect x="56" y="24" width="28" height="20" rx="2" fill="#ffffff" />
                    <rect x="60" y="28" width="20" height="3" fill="#0284c7" />
                    <rect x="60" y="34" width="14" height="2" fill="#64748b" />

                    {/* Plastic L-shaped Actuator Body */}
                    <path
                      d="M48 45 C48 40 52 38 56 38 L84 38 C88 38 92 40 92 45 L92 88 C92 94 88 98 82 98 L48 98 Z"
                      fill="#0284c7"
                      stroke="#38bdf8"
                      strokeWidth="2"
                    />
                    {/* Mouthpiece protrusion */}
                    <path
                      d="M48 70 L30 72 C28 73 26 75 26 78 L26 92 C26 95 28 97 30 98 L48 98 Z"
                      fill="#0369a1"
                      stroke="#38bdf8"
                      strokeWidth="2"
                    />
                    {/* Mouthpiece orifice */}
                    <ellipse cx="28" cy="85" rx="3" ry="8" fill="#082f49" stroke="#38bdf8" strokeWidth="1.5" />

                    {/* Realistic Hand Holding Inhaler */}
                    {/* Thumb supporting underneath base */}
                    <path
                      d="M50 106 C50 99 56 97 64 97 L78 97 C86 97 90 102 90 108 C90 114 84 116 75 116 L60 116 C54 116 50 112 50 106 Z"
                      fill="#fbcfe8"
                      stroke="#f472b6"
                      strokeWidth="1.8"
                    />
                    {/* Thumbnail */}
                    <ellipse cx="68" cy="108" rx="6" ry="4" fill="#ffffff" fillOpacity="0.6" stroke="#f472b6" strokeWidth="1" />

                    {/* Index & Middle Fingers grasping front */}
                    <path
                      d="M86 52 C94 52 98 56 98 62 C98 68 93 70 86 70 Z"
                      fill="#fbcfe8"
                      stroke="#f472b6"
                      strokeWidth="1.8"
                    />
                    <path
                      d="M86 72 C94 72 98 76 98 82 C98 88 93 90 86 90 Z"
                      fill="#fbcfe8"
                      stroke="#f472b6"
                      strokeWidth="1.8"
                    />

                    {/* Vibration motion speed trails */}
                    <line x1="44" y1="20" x2="44" y2="40" stroke="#38bdf8" strokeWidth="2" strokeDasharray="3 3" opacity="0.8" />
                    <line x1="96" y1="20" x2="96" y2="40" stroke="#38bdf8" strokeWidth="2" strokeDasharray="3 3" opacity="0.8" />
                  </svg>
                </div>

                {/* Subtitle Card */}
                <div className="mt-0.5 text-center px-4 bg-black/60 py-1 rounded-lg backdrop-blur-xs border border-white/10 max-w-[280px]">
                  <span className="text-[10px] text-cyan-300 font-bold uppercase tracking-wider block">
                    ขั้นตอน 1/5: เขย่ากระบอกยา
                  </span>
                  <p className="text-xs text-white font-bold leading-tight">
                    ถือกระบอกสูบตั้งตรง เขย่าขึ้น-ลง 4-5 ครั้ง ให้ตัวยาเข้ากัน
                  </p>
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* === STEP 2 ANIMATION: Realistic Profile Exhaling Fully (0:03 - 0:06) === */}
            {/* ========================================================================= */}
            {currentStepIndex === 1 && (
              <div className="relative z-10 flex flex-col items-center justify-center w-full h-full animate-in fade-in duration-200">
                <div className="relative flex items-center justify-center h-30 w-72">
                  <svg width="220" height="120" viewBox="0 0 220 120" fill="none">
                    {/* Realistic Anatomical Face Profile (Facing Left) */}
                    {/* Forehead -> Nose -> Upper Lip -> Open Mouth -> Lower Lip -> Chin -> Neck */}
                    <path
                      d="M175 10 C160 10 148 15 142 28 C140 32 136 40 128 46 C124 49 118 52 114 55 C120 57 122 59 120 63 C116 66 110 67 106 69 L112 73 C115 76 116 79 112 82 C108 85 106 88 108 92 C110 96 114 99 116 102 C120 108 126 112 132 116 C140 120 150 120 160 120"
                      stroke="#e2e8f0"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />

                    {/* Open Oral Cavity & Throat */}
                    <path
                      d="M110 69 C120 70 126 73 130 78 C134 83 135 90 135 100 L135 120"
                      stroke="#38bdf8"
                      strokeWidth="2"
                      strokeDasharray="4 3"
                    />

                    {/* Soft glowing lung field deflating */}
                    <ellipse cx="155" cy="108" rx="18" ry="12" fill="#0284c7" fillOpacity="0.25" stroke="#38bdf8" strokeWidth="1.5" />

                    {/* Exhaled Air Stream Waves billowing out from mouth */}
                    <g transform="translate(10, 0)">
                      <path
                        d="M95 72 C75 70 60 65 35 68"
                        stroke="#38bdf8"
                        strokeWidth="3"
                        strokeLinecap="round"
                        className="animate-pulse"
                      />
                      <path
                        d="M98 75 C78 78 55 82 25 80"
                        stroke="#06b6d4"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        className="animate-pulse delay-75"
                      />
                      <path
                        d="M92 78 C76 84 50 88 20 86"
                        stroke="#67e8f9"
                        strokeWidth="2"
                        strokeLinecap="round"
                        className="animate-pulse delay-150"
                      />

                      {/* Air bubbles/particles drifting out */}
                      <circle cx="30" cy="68" r="3" fill="#a5f3fc" className="animate-ping" />
                      <circle cx="45" cy="78" r="2.5" fill="#a5f3fc" />
                      <circle cx="65" cy="73" r="2" fill="#a5f3fc" />
                    </g>
                  </svg>
                </div>

                {/* Subtitle Card */}
                <div className="mt-0.5 text-center px-4 bg-black/60 py-1 rounded-lg backdrop-blur-xs border border-white/10 max-w-[280px]">
                  <span className="text-[10px] text-cyan-300 font-bold uppercase tracking-wider block">
                    ขั้นตอน 2/5: หายใจออกให้สุด
                  </span>
                  <p className="text-xs text-white font-bold leading-tight">
                    ผ่อนลมหายใจออกทางปากให้สุดอย่างช้าๆ เพื่อเตรียมพื้นที่ในปอด
                  </p>
                </div>
              </div>
            )}

            {/* ========================================================================================= */}
            {/* === STEP 3 ANIMATION: Precise Lip Seal + FINGERS PRESSING Canister + Inhale (0:06-0:10) === */}
            {/* ========================================================================================= */}
            {currentStepIndex === 2 && (
              <div className="relative z-10 flex flex-col items-center justify-center w-full h-full animate-in fade-in duration-200">
                <div className="relative flex items-center justify-center h-32 w-80">
                  <svg width="270" height="125" viewBox="0 0 270 125" fill="none">
                    
                    {/* Realistic Anatomical Face Profile (Right side, facing Left towards inhaler) */}
                    {/* Forehead -> Nose bridge -> Nose tip -> Upper Lip wrapping mouthpiece -> Lower Lip sealing -> Chin */}
                    <path
                      d="M210 10 C198 10 188 15 182 28 C180 32 176 40 168 46 C164 49 158 52 154 55 C160 57 162 59 160 63 C156 66 150 67 146 69"
                      stroke="#cbd5e1"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />

                    {/* UPPER LIP firmly resting ON TOP of inhaler mouthpiece */}
                    <path
                      d="M146 69 C138 68 132 67 126 67 L126 71 C132 72 140 73 146 73"
                      fill="#fbcfe8"
                      stroke="#f472b6"
                      strokeWidth="1.5"
                    />

                    {/* LOWER LIP firmly wrapping UNDERNEATH inhaler mouthpiece */}
                    <path
                      d="M148 83 C140 83 132 82 126 82 L126 86 C132 86 142 88 148 88"
                      fill="#fbcfe8"
                      stroke="#f472b6"
                      strokeWidth="1.5"
                    />

                    {/* Chin -> Jawline -> Neck */}
                    <path
                      d="M148 88 C152 92 154 96 156 100 C160 106 166 112 172 116 C180 120 190 120 200 120"
                      stroke="#cbd5e1"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />

                    {/* Internal Airway / Trachea & Bronchial Tree */}
                    <path
                      d="M142 76 C155 76 162 82 165 92 L165 110"
                      stroke="#38bdf8"
                      strokeWidth="3"
                      strokeDasharray="4 3"
                    />
                    {/* Left and Right Main Bronchi */}
                    <path d="M165 110 L155 122" stroke="#38bdf8" strokeWidth="2.5" />
                    <path d="M165 110 L178 122" stroke="#38bdf8" strokeWidth="2.5" />

                    {/* Lungs field expanding with golden/cyan mist particles */}
                    <ellipse cx="152" cy="115" rx="14" ry="9" fill="#f59e0b" fillOpacity="0.3" stroke="#fbbf24" strokeWidth="1.5" />
                    <ellipse cx="180" cy="115" rx="14" ry="9" fill="#f59e0b" fillOpacity="0.3" stroke="#fbbf24" strokeWidth="1.5" />

                    {/* ================= INHALER & HAND / FINGERS ================= */}
                    {/* Mouthpiece inserted between lips */}
                    <rect x="110" y="69" width="22" height="15" rx="3" fill="#0369a1" stroke="#38bdf8" strokeWidth="1.5" />

                    {/* Plastic Actuator Body */}
                    <path
                      d="M74 46 C74 42 78 40 82 40 L110 40 C114 40 118 42 118 46 L118 90 C118 95 114 98 108 98 L74 98 Z"
                      fill="#0284c7"
                      stroke="#38bdf8"
                      strokeWidth="2"
                    />

                    {/* Canister with downward press animation (moves down by pressDepth px) */}
                    <g style={{ transform: `translateY(${pressDepth}px)`, transition: 'transform 0.15s ease-out' }}>
                      <rect x="78" y="14" width="32" height="34" rx="4" fill="#cbd5e1" stroke="#ffffff" strokeWidth="2" />
                      <rect x="80" y="18" width="28" height="5" rx="1.5" fill="#64748b" />
                      <rect x="82" y="26" width="24" height="18" rx="2" fill="#ffffff" />
                      <rect x="85" y="29" width="18" height="2.5" fill="#0284c7" />

                      {/* --- FINGERS ON TOP OF CANISTER PRESSING DOWN --- */}
                      {/* Index Finger pad pressing on canister top */}
                      <path
                        d="M72 10 C72 6 78 4 88 4 L102 4 C110 4 114 7 114 12 C114 17 108 19 98 19 L82 19 C76 19 72 15 72 10 Z"
                        fill="#fbcfe8"
                        stroke="#f472b6"
                        strokeWidth="1.8"
                      />
                      {/* Middle Finger behind index finger */}
                      <path
                        d="M80 0 C86 0 94 0 100 2 C106 4 110 8 108 12"
                        stroke="#f472b6"
                        strokeWidth="1.5"
                      />
                      {/* Fingernail of Index Finger */}
                      <ellipse cx="94" cy="8" rx="6" ry="3" fill="#ffffff" fillOpacity="0.7" stroke="#f472b6" strokeWidth="1" />
                    </g>

                    {/* --- THUMB UNDERNEATH SUPPORTING BASE --- */}
                    <path
                      d="M74 105 C74 98 80 96 90 96 L104 96 C112 96 116 100 116 106 C116 112 110 114 100 114 L84 114 C78 114 74 110 74 105 Z"
                      fill="#fbcfe8"
                      stroke="#f472b6"
                      strokeWidth="1.8"
                    />
                    {/* Thumbnail */}
                    <ellipse cx="94" cy="106" rx="6" ry="3.5" fill="#ffffff" fillOpacity="0.7" stroke="#f472b6" strokeWidth="1" />

                    {/* ACTUATION CLICK FLASH (When finger presses down) */}
                    {isPressing && (
                      <g transform="translate(94, 6)">
                        <circle cx="0" cy="0" r="10" fill="#f59e0b" className="animate-ping opacity-80" />
                        <circle cx="0" cy="0" r="7" fill="#fbbf24" />
                        <text x="0" y="2.5" fontSize="6.5" fill="#000" fontWeight="900" textAnchor="middle">กด!</text>
                      </g>
                    )}

                    {/* AEROSOL MIST PLUME: Spraying out of nozzle directly into mouth & airway */}
                    {isPressing && (
                      <g>
                        {/* Micro-droplet spray stream curving down trachea */}
                        <path
                          d="M125 76 Q145 76 155 86 T165 110"
                          stroke="#fbbf24"
                          strokeWidth="3.5"
                          strokeDasharray="4 3"
                          className="animate-pulse"
                        />
                        {/* Glowing mist particles */}
                        <circle cx="132" cy="76" r="2.5" fill="#fef08a" className="animate-ping" />
                        <circle cx="145" cy="78" r="2.5" fill="#fef08a" />
                        <circle cx="156" cy="90" r="2" fill="#fef08a" />
                        <circle cx="165" cy="104" r="2.5" fill="#fef08a" />
                        <circle cx="152" cy="116" r="2" fill="#fef08a" />
                        <circle cx="178" cy="116" r="2" fill="#fef08a" />
                      </g>
                    )}
                  </svg>

                  {/* Inhale gauge bar (Smoothly fills from 0 to 100%) */}
                  <div className="flex flex-col items-center gap-1 ml-1 bg-black/65 p-1.5 rounded-lg border border-amber-500/40 shrink-0">
                    <span className="text-[8px] font-bold text-amber-300">สูดเข้าลึกๆ</span>
                    <div className="w-2.5 h-16 bg-gray-800 rounded-full overflow-hidden p-0.5 flex flex-col justify-end">
                      <div
                        className="w-full bg-gradient-to-t from-amber-500 via-yellow-400 to-emerald-400 rounded-full transition-all duration-150"
                        style={{ height: `${Math.round(inhaleRatio * 100)}%` }}
                      />
                    </div>
                    <span className="text-[8px] font-mono text-emerald-300">{Math.round(inhaleRatio * 100)}%</span>
                  </div>
                </div>

                {/* Subtitle Card */}
                <div className="mt-0.5 text-center px-3 bg-black/60 py-1 rounded-lg backdrop-blur-xs border border-amber-500/40 max-w-[310px]">
                  <span className="text-[10px] text-amber-300 font-bold uppercase tracking-wider block">
                    ขั้นตอน 3/5: นิ้วชี้กดยา 1 ครั้ง + สูดลมหายใจช้าๆ ลึกๆ
                  </span>
                  <p className="text-xs text-white font-bold leading-tight">
                    อมกระบอกสูบให้ริมฝีปากแนบสนิท นิ้วชี้กดยาพร้อมเริ่มสูดลมเข้าลึกๆ ให้ยาลงถึงปอด
                  </p>
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* === STEP 4 ANIMATION: Remove Inhaler + Hold Breath 10s (0:10 - 0:15) === */}
            {/* ========================================================================= */}
            {currentStepIndex === 3 && (
              <div className="relative z-10 flex flex-col items-center justify-center w-full h-full animate-in fade-in duration-200">
                <div className="relative flex items-center justify-center gap-4 h-30">
                  {/* Face with lips firmly closed & drug particles settling in bronchial tree */}
                  <svg width="110" height="110" viewBox="0 0 110 110" fill="none">
                    {/* Face profile facing left with closed lips */}
                    <path
                      d="M75 10 C62 10 52 15 46 28 C44 32 40 40 32 46 C28 49 22 52 18 55 C24 57 26 59 24 63 C20 66 18 69 22 72 C26 75 28 80 26 84 C24 88 22 92 24 96 C26 100 30 104 36 108"
                      stroke="#cbd5e1"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />

                    {/* Trachea & Lungs */}
                    <path d="M42 74 C46 80 48 90 48 100" stroke="#38bdf8" strokeWidth="2.5" strokeDasharray="3 3" />
                    {/* Lungs with settled particles */}
                    <ellipse cx="48" cy="95" rx="16" ry="12" fill="#10b981" fillOpacity="0.25" stroke="#34d399" strokeWidth="1.5" />
                    
                    {/* Settled golden medication particles */}
                    <circle cx="42" cy="92" r="2.5" fill="#34d399" className="animate-pulse" />
                    <circle cx="48" cy="98" r="2" fill="#34d399" />
                    <circle cx="54" cy="94" r="2.5" fill="#34d399" className="animate-pulse delay-100" />
                    <circle cx="45" cy="100" r="1.8" fill="#34d399" />
                  </svg>

                  {/* Circular Animated Countdown Ring */}
                  <div className="relative w-20 h-20 flex items-center justify-center">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                      <path
                        className="text-gray-700"
                        strokeWidth="3.5"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <path
                        className="text-emerald-400 transition-all duration-300"
                        strokeDasharray={`${(breathHoldCountdown / 10) * 100}, 100`}
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                    </svg>
                    <div className="absolute flex flex-col items-center justify-center">
                      <span className="text-2xl font-black text-emerald-400 font-mono leading-none">
                        {breathHoldCountdown}
                      </span>
                      <span className="text-[8px] font-bold text-gray-300 uppercase tracking-tighter mt-0.5">
                        วินาที
                      </span>
                    </div>
                  </div>
                </div>

                {/* Subtitle Card */}
                <div className="mt-0.5 text-center px-4 bg-black/60 py-1 rounded-lg backdrop-blur-xs border border-emerald-500/40 max-w-[290px]">
                  <span className="text-[10px] text-emerald-300 font-bold uppercase tracking-wider block">
                    ขั้นตอน 4/5: กลั้นหายใจ 10 วินาที
                  </span>
                  <p className="text-xs text-white font-bold leading-tight">
                    เอาหลอดยาออกจากปาก ปิดปากสนิท กลั้นหายใจ 10 วินาทีให้ยาตกตะกอนในหลอดลม
                  </p>
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* === STEP 5 ANIMATION: Rinse Mouth & Gargle with Water (0:15 - 0:18) === */}
            {/* ========================================================================= */}
            {currentStepIndex === 4 && (
              <div className="relative z-10 flex flex-col items-center justify-center w-full h-full animate-in fade-in duration-200">
                <div className="relative flex items-center justify-center gap-3 h-30">
                  {/* Clean Water Glass tilted & water pouring into mouth */}
                  <svg width="90" height="95" viewBox="0 0 90 95" fill="none" className="shrink-0">
                    {/* Water Cup tilted */}
                    <g transform="rotate(-25 45 45)">
                      <path d="M28 20 L62 20 L56 68 C56 72 52 75 45 75 C38 75 34 72 34 68 Z" fill="#38bdf8" fillOpacity="0.3" stroke="#60a5fa" strokeWidth="2.5" />
                      <ellipse cx="45" cy="20" rx="17" ry="5" fill="#93c5fd" />
                    </g>
                    {/* Water droplets stream */}
                    <circle cx="62" cy="45" r="2.5" fill="#38bdf8" className="animate-bounce" />
                    <circle cx="70" cy="54" r="3" fill="#60a5fa" className="animate-bounce delay-75" />
                    <circle cx="76" cy="64" r="2.5" fill="#93c5fd" className="animate-bounce delay-150" />
                  </svg>

                  {/* Mouth Gargling & Checkmark Badge */}
                  <div className="flex flex-col items-center justify-center bg-blue-950/70 p-2.5 rounded-2xl border border-blue-400/40">
                    <Droplets className="w-8 h-8 text-blue-400 animate-pulse mb-1" />
                    <span className="text-[10px] font-bold text-blue-300">บ้วนปากและกลั้วคอ</span>
                    <span className="text-[9px] text-emerald-400 font-bold mt-0.5 flex items-center gap-1">
                      <span>✓</span> ป้องกันเชื้อรา & เสียงแหบ
                    </span>
                  </div>
                </div>

                {/* Subtitle Card */}
                <div className="mt-0.5 text-center px-4 bg-black/60 py-1 rounded-lg backdrop-blur-xs border border-blue-500/40 max-w-[290px]">
                  <span className="text-[10px] text-blue-300 font-bold uppercase tracking-wider block">
                    ขั้นตอน 5/5: บ้วนปากด้วยน้ำสะอาด
                  </span>
                  <p className="text-xs text-white font-bold leading-tight">
                    ปิดฝาครอบกระบอกยา บ้วนปากและกลั้วคอด้วยน้ำสะอาดแล้วบ้วนทิ้ง
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Video Scrubber & Playback Controls Bar */}
          <div className="w-full px-3 py-2 bg-[#090b10] border-t border-white/10 flex flex-col gap-1.5">
            {/* Scrubber slider */}
            <div className="w-full flex items-center gap-2">
              <span className="text-[10px] font-mono text-gray-400 w-7 text-right">
                {formatSeconds(currentTime)}
              </span>
              <div
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const clickX = e.clientX - rect.left;
                  const ratio = Math.max(0, Math.min(1, clickX / rect.width));
                  setCurrentTime(ratio * totalDuration);
                }}
                className="flex-1 h-2 bg-white/20 rounded-full overflow-hidden cursor-pointer relative"
              >
                <div
                  className="h-full bg-gradient-to-r from-[#007aff] via-[#38bdf8] to-[#34c759] rounded-full transition-all duration-75"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <span className="text-[10px] font-mono text-gray-400 w-7">
                {formatSeconds(totalDuration)}
              </span>
            </div>

            {/* Playback Controls Row */}
            <div className="flex items-center justify-between">
              {/* Left: Play/Pause & Replay */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="p-1 px-2 rounded-lg bg-white/15 hover:bg-white/25 text-white transition-colors flex items-center gap-1 text-[11px] font-bold"
                >
                  {isPlaying ? (
                    <>
                      <Pause className="w-3 h-3 fill-white" />
                      <span>หยุด</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3 h-3 fill-white" />
                      <span>เล่น</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => {
                    setCurrentTime(0);
                    setIsPlaying(true);
                  }}
                  className="p-1 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
                  title="เริ่มใหม่"
                >
                  <RotateCcw className="w-3 h-3" />
                </button>
              </div>

              {/* Center: Step Indicator */}
              <div className="text-center">
                <span className="text-[10px] font-bold text-gray-300">
                  ขั้นตอนที่ <strong className="text-white text-xs">{currentStep.stepNumber}</strong> / 5
                </span>
              </div>

              {/* Right: Speed Toggle Buttons (1x, 2x, 4x) */}
              <div className="flex items-center gap-1 bg-white/10 rounded-lg p-0.5">
                {[1, 2, 4].map((spd) => (
                  <button
                    key={spd}
                    onClick={() => setPlaybackSpeed(spd)}
                    className={`px-1.5 py-0.5 rounded text-[9px] font-black transition-colors ${
                      playbackSpeed === spd
                        ? 'bg-[#007aff] text-white shadow-xs'
                        : 'text-gray-300 hover:text-white'
                    }`}
                  >
                    {spd}x
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Step-by-Step Interactive Timeline List below Video */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-[#f8f9fc]">
          <div className="flex items-center justify-between pb-0.5">
            <span className="text-[11px] font-bold text-[#1d1d1f] flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#007aff]" />
              <span>แตะเพื่อเลือกดูขั้นตอน:</span>
            </span>
            <span className="text-[10px] text-[#8e8e93]">
              อนิเมชันสาธิต MDI Inhaler
            </span>
          </div>

          <div className="space-y-1.5">
            {technique.steps.map((st, idx) => {
              const isActive = idx === currentStepIndex;

              return (
                <div
                  key={st.stepNumber}
                  onClick={() => handleJumpToStep(idx)}
                  className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#f0f6ff] border-[#007aff] shadow-xs ring-1 ring-[#007aff]/30'
                      : 'bg-white border-[#e5e5ea] hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <span
                      className={`w-5 h-5 rounded-full font-black text-[10px] flex items-center justify-center shrink-0 mt-0.5 ${
                        isActive
                          ? 'bg-[#007aff] text-white'
                          : 'bg-[#f5f5f7] text-[#8e8e93]'
                      }`}
                    >
                      {st.stepNumber}
                    </span>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1 flex-wrap">
                        <h5
                          className={`font-bold tracking-tight text-xs ${
                            isActive ? 'text-[#007aff]' : 'text-[#1d1d1f]'
                          }`}
                        >
                          {st.title}
                        </h5>
                        <span className="text-[9px] text-[#8e8e93] font-mono">
                          {st.timestamp}
                        </span>
                      </div>

                      <p className={`text-[#48484a] mt-0.5 leading-relaxed ${seniorMode ? 'text-xs' : 'text-[11px]'}`}>
                        {st.instruction}
                      </p>

                      {st.keyTip && (
                        <div className="mt-1 text-[9px] font-medium text-[#b25e00] bg-[#fff9f0] p-1.5 rounded-lg border border-[#ff9500]/20 flex items-start gap-1">
                          <AlertCircle className="w-3 h-3 shrink-0 mt-0.5 text-[#ff9500]" />
                          <span><strong>เคล็ดลับ:</strong> {st.keyTip}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-2.5 bg-[#ffffff] border-t border-[#e5e5ea] flex items-center justify-between shrink-0">
          <span className="text-[10px] text-[#8e8e93] truncate mr-2">
            อ้างอิง: สมาคมสภาองค์กรโรคหืดแห่งประเทศไทย
          </span>
          <button
            onClick={onClose}
            className="bg-[#007aff] hover:bg-[#0071e3] active:scale-[0.98] text-white font-bold px-3 py-1.5 rounded-xl text-xs transition-colors shrink-0"
          >
            เข้าใจแล้ว ปิดคลิป
          </button>
        </div>

      </div>
    </div>
  );
};
