import { playNetflixTadum } from "@/lib/sound";
import { Sparkles, Volume2 } from "lucide-react";
import React, { useEffect, useState } from "react";

interface NetflixIntroProps {
  onComplete: () => void;
}

export function NetflixIntro({ onComplete }: NetflixIntroProps) {
  const [audioPlayed, setAudioPlayed] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  const triggerAudio = () => {
    if (!audioPlayed) {
      playNetflixTadum();
      setAudioPlayed(true);
    }
  };

  useEffect(() => {
    // Attempt auto-play sound on first user gesture or timer
    const soundTimer = setTimeout(() => {
      triggerAudio();
    }, 400);

    const fadeTimer = setTimeout(() => {
      setFadeOut(true);
    }, 2800);

    const completeTimer = setTimeout(() => {
      onComplete();
    }, 3400);

    return () => {
      clearTimeout(soundTimer);
      clearTimeout(fadeTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div
      onClick={triggerAudio}
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black transition-opacity duration-700 select-none cursor-pointer ${
        fadeOut ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      {/* Background Cinematic Atmosphere */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(229,9,20,0.18)_0%,rgba(0,0,0,0.95)_70%,#000000_100%)] pointer-events-none" />

      {/* Center Netflix Iconic "N" and Ribbon Glow Animation */}
      <div className="relative z-10 flex flex-col items-center animate-netflix-zoom">
        {/* Glowing N Symbol */}
        <div className="relative">
          <svg
            className="w-36 h-56 sm:w-48 sm:h-72 drop-shadow-[0_0_35px_rgba(229,9,20,0.9)]"
            viewBox="0 0 111 200"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Left Vertical Ribbon */}
            <path
              d="M0 0H33.3V200H0V0Z"
              fill="#B81D24"
              className="drop-shadow-lg"
            />
            {/* Right Vertical Ribbon */}
            <path
              d="M77.7 0H111V200H77.7V0Z"
              fill="#B81D24"
              className="drop-shadow-lg"
            />
            {/* Center Diagonal Dynamic Ribbon with Gradient */}
            <path
              d="M0 0L77.7 200H111L33.3 0H0Z"
              fill="url(#netflix-gradient)"
              className="drop-shadow-[0_0_20px_#E50914]"
            />
            <defs>
              <linearGradient
                id="netflix-gradient"
                x1="0"
                y1="0"
                x2="111"
                y2="200"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#E50914" />
                <stop offset="0.5" stopColor="#FF1E27" />
                <stop offset="1" stopColor="#990000" />
              </linearGradient>
            </defs>
          </svg>

          {/* Core Spotlight Bloom */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#E50914] rounded-full blur-[100px] opacity-40 pointer-events-none" />
        </div>

        {/* Romantic Sub-title Ribbon */}
        <div className="mt-8 flex items-center gap-2 text-xs uppercase tracking-[0.35em] text-white/70 font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-[#E50914] animate-pulse" />
          <span>Our Story Presents</span>
          <Sparkles className="w-3.5 h-3.5 text-[#E50914] animate-pulse" />
        </div>
      </div>

      {/* Sound Hint / Skip Button */}
      <div className="absolute bottom-10 flex items-center gap-6 z-20">
        {!audioPlayed && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              triggerAudio();
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-semibold text-white/90 backdrop-blur-md transition-all active:scale-95"
          >
            <Volume2 className="w-4 h-4 text-[#E50914]" />
            <span>Click for Sound</span>
          </button>
        )}

        <button
          onClick={(e) => {
            e.stopPropagation();
            onComplete();
          }}
          className="text-xs uppercase tracking-widest text-white/50 hover:text-white px-3 py-1.5 transition-colors border border-transparent hover:border-white/20 rounded"
        >
          Skip Intro →
        </button>
      </div>
    </div>
  );
}
