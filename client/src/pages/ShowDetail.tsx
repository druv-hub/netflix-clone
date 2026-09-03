import { NetflixNavbar } from "@/components/NetflixNavbar";
import {
  Episode,
  getActiveProfile,
  loadEpisodes,
  loadSeasons,
  SeasonInfo,
  UserProfile,
} from "@/lib/memoryStore";
import {
  Calendar,
  ChevronDown,
  Heart,
  MapPin,
  Play,
  Sparkles,
  Tv,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";

interface ShowDetailProps {
  onReplayIntro: () => void;
}

export default function ShowDetail({ onReplayIntro }: ShowDetailProps) {
  const [, setLocation] = useLocation();
  const [episodes, setEpisodes] = useState<Episode[]>(loadEpisodes());
  const [seasons, setSeasons] = useState<SeasonInfo[]>(loadSeasons());
  const [selectedSeasonNum, setSelectedSeasonNum] = useState<number>(1);
  const [currentProfile, setCurrentProfile] = useState<UserProfile>(
    getActiveProfile()
  );

  useEffect(() => {
    setEpisodes(loadEpisodes());
    setSeasons(loadSeasons());
    setCurrentProfile(getActiveProfile());
  }, []);

  const currentSeason =
    seasons.find((s) => s.seasonNumber === selectedSeasonNum) || seasons[0];

  const currentSeasonEpisodes = episodes
    .filter((e) => e.seasonNumber === selectedSeasonNum)
    .sort((a, b) => a.episodeNumber - b.episodeNumber);

  return (
    <div className="min-h-screen bg-[#141414] text-white">
      <NetflixNavbar
        currentProfile={currentProfile}
        onProfileChange={(p) => setCurrentProfile(p)}
        onOpenIntro={onReplayIntro}
      />

      <main className="pt-24 sm:pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-8">
        {/* Page Title */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#E50914] mb-2">
            <Tv className="w-4 h-4" />
            <span>Complete 8-Season Series</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black font-bebas tracking-wide uppercase text-white">
            OUR STORY: ALL 8 SEASONS
          </h1>
          <p className="text-sm sm:text-base text-white/70 max-w-2xl mt-2 font-normal">
            Every season corresponds to one month of our journey. Choose a season to explore all its episodes and videos.
          </p>
        </div>

        {/* Horizontal Season Switcher Tabs */}
        <div className="flex items-center gap-2.5 overflow-x-auto no-scrollbar pb-3 border-b border-white/10 mb-8">
          {seasons.map((season) => {
            const isActive = season.seasonNumber === selectedSeasonNum;
            return (
              <button
                key={season.seasonNumber}
                onClick={() => setSelectedSeasonNum(season.seasonNumber)}
                className={`shrink-0 px-4 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all ${
                  isActive
                    ? "bg-[#E50914] text-white shadow-lg shadow-[#E50914]/30 scale-105"
                    : "bg-[#222222] text-white/70 hover:bg-[#333333] hover:text-white"
                }`}
              >
                Season {season.seasonNumber} ({season.releaseYear})
              </button>
            );
          })}
        </div>

        {/* Selected Season Billboard Header */}
        <div className="relative rounded-xl overflow-hidden aspect-[21/9] bg-black border border-white/10 mb-10 shadow-2xl">
          <img
            src={currentSeason?.coverImage}
            alt={currentSeason?.monthTitle}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-black/40 to-transparent p-6 sm:p-10 flex flex-col justify-end">
            <div className="flex items-center gap-2 text-xs uppercase font-extrabold tracking-widest text-[#E50914] mb-1">
              <Sparkles className="w-3.5 h-3.5 fill-current" />
              <span>Season {currentSeason?.seasonNumber} Overview</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              {currentSeason?.monthTitle}
            </h2>

            <p className="text-sm sm:text-base text-white/80 max-w-2xl mt-2 leading-relaxed">
              {currentSeason?.description}
            </p>

            {currentSeasonEpisodes.length > 0 && (
              <div className="mt-4">
                <button
                  onClick={() =>
                    setLocation(`/watch/${currentSeasonEpisodes[0].id}`)
                  }
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded bg-white text-black font-extrabold text-sm hover:bg-white/90 active:scale-95 transition-all shadow-lg"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>Play S{currentSeason?.seasonNumber}:E1</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Episode Catalog for Selected Season */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Season {currentSeason?.seasonNumber} Episodes ({currentSeasonEpisodes.length})
            </h3>
          </div>

          {currentSeasonEpisodes.length === 0 ? (
            <div className="p-12 text-center border border-dashed border-white/20 rounded-xl bg-white/5">
              <p className="text-white/70 font-semibold text-sm">
                No episodes added for Season {currentSeason?.seasonNumber} yet.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentSeasonEpisodes.map((ep) => (
                <div
                  key={ep.id}
                  onClick={() => setLocation(`/watch/${ep.id}`)}
                  className="group flex gap-4 p-3.5 rounded-xl bg-[#181818] border border-white/5 hover:border-white/25 hover:bg-[#202020] transition-all cursor-pointer shadow-lg"
                >
                  {/* Thumbnail with Play Hover */}
                  <div className="relative w-40 sm:w-48 aspect-video rounded-lg overflow-hidden bg-black shrink-0">
                    <img
                      src={ep.thumbnailUrl}
                      alt={ep.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center shadow-2xl">
                        <Play className="w-4 h-4 fill-current ml-0.5" />
                      </div>
                    </div>
                    <span className="absolute bottom-1.5 right-1.5 bg-black/80 px-1.5 py-0.5 rounded text-[10px] font-bold text-white">
                      {ep.durationMinutes}m
                    </span>
                  </div>

                  {/* Metadata */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-extrabold uppercase text-[#E50914] tracking-wider">
                        Episode {ep.episodeNumber}
                      </span>
                      <h4 className="text-sm sm:text-base font-bold text-white group-hover:text-[#E50914] transition-colors truncate mt-0.5">
                        {ep.title}
                      </h4>
                      <p className="text-xs text-white/60 line-clamp-2 mt-1 leading-relaxed">
                        {ep.description}
                      </p>
                    </div>

                    {ep.loveNote && (
                      <div className="flex items-center gap-1.5 text-[11px] text-[#E50914] mt-2 font-medium truncate">
                        <Heart className="w-3 h-3 fill-current shrink-0" />
                        <span className="truncate">"{ep.loveNote}"</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
