import React, { useEffect, useState } from 'react';
import { Pill } from 'lucide-react';

interface SplashScreenProps {
  onFinish?: () => void;
  duration?: number;
  inline?: boolean;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({
  onFinish,
  duration = 1800,
  inline = false,
}) => {
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    const fadeTimer = setTimeout(() => {
      setIsFadingOut(true);
    }, Math.max(duration - 500, 300));

    const finishTimer = setTimeout(() => {
      if (onFinish) onFinish();
    }, duration);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(finishTimer);
    };
  }, [duration, onFinish]);

  return (
    <div
      id="splash-screen"
      className={`${
        inline ? 'absolute' : 'fixed'
      } inset-0 z-50 flex flex-col items-center justify-center bg-white transition-opacity duration-500 select-none ${
        isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="flex flex-col items-center animate-pulse">
        {/* Pillyung Official Logo */}
        <img
          src="/images/Pillyung_logo.png"
          alt="pillyung MedSafe"
          className="w-24 h-24 object-contain mb-3 drop-shadow-md rounded-2xl"
          onError={(e) => {
            // Fallback if image path fails
            e.currentTarget.style.display = 'none';
            const fallback = document.getElementById('splash-emoji-fallback');
            if (fallback) fallback.style.display = 'flex';
          }}
        />
        <div
          id="splash-emoji-fallback"
          className="w-20 h-20 bg-[#0066cc] rounded-2xl hidden items-center justify-center text-white shadow-lg mb-4"
        >
          <Pill className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-xl font-bold text-[#1d1d1f]">pillyung</h1>
        <p className="text-sm text-[#8e8e93] mt-1">ระบบดูแลการใช้ยาอัจฉริยะสำหรับผู้สูงอายุ</p>
      </div>
      {/* Loading Spinner */}
      <div className="mt-8 w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
};