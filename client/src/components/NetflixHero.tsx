import { Episode, SeasonInfo } from "@/lib/memoryStore";
import {
  Info,
  Play,
  RotateCcw,
  Sparkles,
  Volume2,
  VolumeX,
} from "lucide-react";
import React, { useState } from "react";
import { useLocation } from "wouter";

interface NetflixHeroProps {
  featuredEpisode?: Episode;
  seasonInfo?: SeasonInfo;
  onMoreInfo: () => void;
}

export function NetflixHero({
  featuredEpisode,
  seasonInfo,
  onMoreInfo,
}: NetflixHeroProps) {
  const [, setLocation] = useLocation();
  const [isMuted, setIsMuted] = useState(true);

  const heroImage =
    seasonInfo?.coverImage ||
    featuredEpisode?.thumbnailUrl ||
    "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=1600&q=85";

  const handlePlay = () => {
    if (featuredEpisode) {
      setLocation(`/watch/${featuredEpisode.id}`);
    } else {
      setLocation(`/watch/101`);
    }
  };

  return (
    <section className="relative w-full h-[75vh] sm:h-[85vh] lg:h-[92vh] overflow-hidden select-none">
      {/* Hero Background Poster / Video Preview */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Our Story Hero"
          className="w-full h-full object-cover object-center transform scale-105 transition-transform duration-1000 ease-out"
        />

        {/* Cinematic Netflix Shadow Overlays */}
        {/* Left-to-right vignette for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent w-full md:w-3/4" />
        {/* Bottom fade into Netflix pure black */}
        <div className="absolute inset-0 netflix-bottom-fade" />
        {/* Top subtle fade */}
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/80 to-transparent" />
      </div>

      {/* Hero Content Area */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 h-full flex flex-col justify-end pb-24 sm:pb-32 lg:pb-36">
        <div className="max-w-2xl">
          {/* Netflix Series Tag */}
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[#E50914] font-black text-xl tracking-tighter">N</span>
            <span className="text-xs uppercase tracking-[0.3em] font-extrabold text-white/90">
              ORIGINAL SERIES
            </span>
          </div>

          {/* Arched Big Title */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black font-bebas tracking-wide uppercase text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)] leading-none">
            OUR STORY
          </h1>

          {/* Romantic Subtitle / Season Badge */}
          <div className="mt-2 flex items-center gap-2 text-sm sm:text-base font-bold text-[#E50914]">
            <Sparkles className="w-4 h-4 fill-current" />
            <span>8 Seasons · 8 Months of Pure Love</span>
          </div>

          {/* Netflix Meta Badges */}
          <div className="mt-4 flex flex-wrap items-center gap-3 text-xs sm:text-sm font-semibold text-white/90">
            <span className="text-[#46d369] font-black">99% Match</span>
            <span className="border border-white/40 px-1.5 py-0.5 rounded text-[11px] text-white/80">
              8 SEASONS
            </span>
            <span className="border border-white/40 px-1.5 py-0.5 rounded text-[10px] font-black text-white/80">
              ULTRA HD 4K
            </span>
            <span className="text-white/70">Romance · Comedy · Real Life</span>
          </div>

          {/* Synopsis */}
          <p className="mt-4 text-sm sm:text-base text-white/85 line-clamp-3 sm:line-clamp-4 leading-relaxed drop-shadow-md max-w-xl font-normal">
            {seasonInfo?.description ||
              "Eight chapters. A living archive of every date, road trip, late night laugh, and quiet moment that transformed two strangers into each other's entire world."}
          </p>

          {/* Netflix Hero Action Buttons */}
          <div className="mt-6 sm:mt-8 flex items-center gap-3 sm:gap-4">
            {/* Play Button (White with Black Text) */}
            <button
              onClick={handlePlay}
              className="flex items-center justify-center gap-2.5 px-6 sm:px-8 py-2.5 sm:py-3.5 rounded bg-white text-black font-extrabold text-sm sm:text-base hover:bg-white/85 active:scale-95 transition-all shadow-xl"
            >
              <Play className="w-5 h-5 fill-current" />
              <span>Play S1:E1</span>
            </button>

            {/* More Info Button (Translucent Grey) */}
            <button
              onClick={onMoreInfo}
              className="flex items-center justify-center gap-2.5 px-5 sm:px-7 py-2.5 sm:py-3.5 rounded bg-[#6d6d6e]/70 hover:bg-[#6d6d6e]/50 backdrop-blur-md text-white font-bold text-sm sm:text-base active:scale-95 transition-all shadow-xl"
            >
              <Info className="w-5 h-5" />
              <span>More Info</span>
            </button>
          </div>
        </div>
      </div>

      {/* Right Edge: Age Rating Badge & Audio Toggle */}
      <div className="absolute right-0 bottom-24 sm:bottom-32 lg:bottom-36 flex items-center gap-3 z-20">
        <button
          onClick={() => setIsMuted(!isMuted)}
          className="w-10 h-10 rounded-full border border-white/40 bg-black/40 backdrop-blur-md flex items-center justify-center text-white hover:border-white transition-colors"
          title={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5 text-[#E50914]" />}
        </button>

        <div className="bg-[#333333]/80 border-l-4 border-[#E50914] text-white text-xs sm:text-sm font-bold px-3 py-1.5 pr-6 backdrop-blur-md">
          18+ LOVE
        </div>
      </div>
    </section>
  );
}
