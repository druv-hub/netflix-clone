import {
  DEFAULT_PROFILES,
  setActiveProfile,
  UserProfile,
} from "@/lib/memoryStore";
import { AlertCircle, Heart, Lock, Plus, Users } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";

interface ProfileSelectorProps {
  onSelect: (profile: UserProfile) => void;
}

export function ProfileSelector({ onSelect }: ProfileSelectorProps) {
  const profile = DEFAULT_PROFILES[0];
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isShaking, setIsShaking] = useState(false);

  const handleChoose = () => {
    setActiveProfile(profile);
    onSelect(profile);
  };

  const handleAddProfileClick = () => {
    setIsShaking(true);
    const msg = "Error (US): Only 'Us' is allowed on this account.";
    setErrorMessage(msg);
    toast.error(msg, {
      description: "Nobody else can be added to our story.",
      duration: 4000,
    });
    setTimeout(() => setIsShaking(false), 600);
  };

  return (
    <div className="min-h-screen bg-[#141414] flex flex-col items-center justify-center px-4 py-12 select-none relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#E50914]/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Main Container */}
      <div className="relative z-10 flex flex-col items-center max-w-4xl w-full text-center">
        {/* Animated Greeting */}
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.25em] text-[#E50914] mb-3">
          <Heart className="w-3.5 h-3.5 fill-current animate-pulse" />
          <span>Our Story · Streaming Exclusively For Us</span>
          <Heart className="w-3.5 h-3.5 fill-current animate-pulse" />
        </div>

        <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight mb-10 sm:mb-14">
          Who's watching?
        </h1>

        {/* Profile Grid */}
        <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 mb-10">
          {/* The Single "Us" Profile */}
          <div
            onClick={handleChoose}
            className="group flex flex-col items-center cursor-pointer transition-all duration-300 transform hover:scale-105"
          >
            {/* Avatar Box */}
            <div
              className={`relative w-28 h-28 sm:w-36 sm:h-36 md:w-44 md:h-44 rounded-2xl bg-gradient-to-br from-[#E50914] via-rose-900 to-black p-1 shadow-2xl flex flex-col items-center justify-center border-2 border-transparent group-hover:border-white group-hover:ring-4 group-hover:ring-white/20 transition-all duration-300`}
            >
              {/* Monogram / Icon Avatar */}
              <div className="flex flex-col items-center justify-center">
                <span className="font-bebas text-5xl sm:text-7xl font-black text-white tracking-wider filter drop-shadow-lg group-hover:scale-110 transition-transform duration-300">
                  US
                </span>
                <div className="flex items-center gap-1 text-[11px] font-bold text-white/80 uppercase tracking-widest mt-1">
                  <Heart className="w-3 h-3 fill-current text-[#E50914]" />
                  <span>Forever</span>
                </div>
              </div>

              {/* Verified Badge */}
              <span className="absolute -top-2.5 -right-2.5 bg-[#E50914] text-white text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full shadow-lg flex items-center gap-1 border border-white/20">
                <Users className="w-3 h-3" /> Only One
              </span>
            </div>

            {/* Profile Name */}
            <span className="mt-4 text-base sm:text-lg font-bold text-[#b3b3b3] group-hover:text-white transition-colors duration-200">
              {profile.name}
            </span>
          </div>

          {/* Add Profile Button (Triggers Error US) */}
          <div
            onClick={handleAddProfileClick}
            className={`group flex flex-col items-center cursor-pointer transition-all duration-300 transform hover:scale-105 ${
              isShaking ? "animate-bounce" : ""
            }`}
          >
            <div className="relative w-28 h-28 sm:w-36 sm:h-36 md:w-44 md:h-44 rounded-2xl bg-transparent border-2 border-dashed border-[#808080]/50 group-hover:border-red-500/80 group-hover:bg-red-950/10 flex flex-col items-center justify-center transition-all duration-300">
              <Plus className="w-10 h-10 sm:w-14 sm:h-14 text-[#808080] group-hover:text-red-400 transition-colors" />
              <div className="flex items-center gap-1 text-[10px] uppercase font-bold text-red-400/80 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Lock className="w-2.5 h-2.5" />
                <span>Locked</span>
              </div>
            </div>
            <span className="mt-4 text-base sm:text-lg font-semibold text-[#808080] group-hover:text-red-400 transition-colors">
              Add Profile
            </span>
          </div>
        </div>

        {/* Error Alert Display on Add Attempt */}
        {errorMessage && (
          <div className="max-w-md w-full mx-auto mb-8 p-3.5 rounded-lg bg-red-950/60 border border-red-500/40 text-red-200 text-xs sm:text-sm font-semibold flex items-center justify-center gap-2.5 shadow-lg animate-fade-in">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Footer Note */}
        <p className="text-xs text-[#666666] tracking-wide">
          Streaming exclusively for the two of us · All 8 Seasons
        </p>
      </div>
    </div>
  );
}
