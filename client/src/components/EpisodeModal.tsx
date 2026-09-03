import {
  Episode,
  getMyList,
  loadEpisodes,
  loadSeasons,
  SeasonInfo,
  toggleMyList,
} from "@/lib/memoryStore";
import {
  Check,
  ChevronDown,
  Clock,
  Heart,
  MapPin,
  Play,
  Plus,
  Sparkles,
  X,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { useLocation } from "wouter";

interface EpisodeModalProps {
  initialEpisode?: Episode | null;
  onClose: () => void;
}

export function EpisodeModal({ initialEpisode, onClose }: EpisodeModalProps) {
  const [, setLocation] = useLocation();
  const [allEpisodes, setAllEpisodes] = useState<Episode[]>(loadEpisodes());
  const [allSeasons, setAllSeasons] = useState<SeasonInfo[]>(loadSeasons());
  const [selectedSeasonNum, setSelectedSeasonNum] = useState<number>(
    initialEpisode?.seasonNumber || 1
  );
  const [myListIds, setMyListIds] = useState<number[]>(getMyList());

  useEffect(() => {
    if (initialEpisode) {
      setSelectedSeasonNum(initialEpisode.seasonNumber);
    }
  }, [initialEpisode]);

  const currentSeason =
    allSeasons.find((s) => s.seasonNumber === selectedSeasonNum) ||
    allSeasons[0];

  const seasonEpisodes = allEpisodes
    .filter((ep) => ep.seasonNumber === selectedSeasonNum)
    .sort((a, b) => a.episodeNumber - b.episodeNumber);

  const activeEp = initialEpisode || seasonEpisodes[0] || allEpisodes[0];

  const handleToggleMyList = () => {
    if (!activeEp) return;
    toggleMyList(activeEp.id);
    setMyListIds(getMyList());
  };

  const isInList = activeEp ? myListIds.includes(activeEp.id) : false;

  return (
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto"
      onClick={onClose}
    >
      {/* Modal Card */}
      <div
        className="relative w-full max-w-4xl bg-[#181818] text-white rounded-none sm:rounded-xl shadow-2xl overflow-hidden my-auto border border-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-50 w-9 h-9 rounded-full bg-[#181818]/80 hover:bg-white text-white hover:text-black flex items-center justify-center transition-colors border border-white/20 shadow-lg"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Top Billboard */}
        <div className="relative aspect-video sm:aspect-[21/9] w-full overflow-hidden bg-black">
          <img
            src={activeEp?.thumbnailUrl || currentSeason?.coverImage}
            alt={activeEp?.title}
            className="w-full h-full object-cover"
          />

          {/* Vignette Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#181818] via-transparent to-black/60" />

          {/* Billboard Overlay Controls */}
          <div className="absolute bottom-6 left-6 right-6 flex flex-col justify-end">
            <div className="flex items-center gap-2 text-xs uppercase font-extrabold tracking-widest text-[#E50914] mb-1">
              <Sparkles className="w-3.5 h-3.5 fill-current" />
              <span>
                Season {currentSeason?.seasonNumber} · {currentSeason?.releaseYear}
              </span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight drop-shadow-md">
              {activeEp?.title || currentSeason?.theme}
            </h2>

            <div className="mt-4 flex items-center gap-3">
              <button
                onClick={() => setLocation(`/watch/${activeEp?.id || 101}`)}
                className="flex items-center gap-2 px-6 py-2.5 rounded bg-white text-black font-extrabold text-sm hover:bg-white/90 active:scale-95 transition-all shadow-lg"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Play Video</span>
              </button>

              <button
                onClick={handleToggleMyList}
                className={`w-10 h-10 rounded-full border flex items-center justify-center transition-colors ${
                  isInList
                    ? "border-[#E50914] bg-[#E50914] text-white"
                    : "border-white/40 text-white hover:border-white"
                }`}
                title={isInList ? "In My List" : "Add to My List"}
              >
                {isInList ? <Check className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
              </button>

              <button
                onClick={() => toast.success("Saved to favorites")}
                className="w-10 h-10 rounded-full border border-white/40 text-white hover:border-[#E50914] hover:text-[#E50914] flex items-center justify-center transition-colors"
                title="Like"
              >
                <Heart className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Modal Content Body */}
        <div className="p-6 sm:p-8 space-y-8">
          {/* Metadata Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-3">
              <div className="flex items-center gap-3 text-xs sm:text-sm font-semibold">
                <span className="text-[#46d369] font-black">99% Match</span>
                <span className="text-white/60">2026</span>
                <span className="border border-white/40 px-1 rounded text-[10px]">
                  8 SEASONS
                </span>
                <span className="border border-white/40 px-1 rounded text-[10px]">
                  HD
                </span>
              </div>

              <p className="text-sm sm:text-base text-white/80 leading-relaxed font-normal">
                {currentSeason?.description}
              </p>

              {activeEp?.loveNote && (
                <div className="p-3.5 rounded-lg bg-[#E50914]/10 border border-[#E50914]/30 text-xs sm:text-sm text-white/90 flex items-start gap-2.5">
                  <Heart className="w-4 h-4 text-[#E50914] shrink-0 mt-0.5 fill-current" />
                  <div>
                    <span className="font-bold text-[#E50914] mr-1">Love Note:</span>
                    <span>"{activeEp.loveNote}"</span>
                  </div>
                </div>
              )}
            </div>

            {/* About / Cast Info */}
            <div className="text-xs space-y-2 text-white/60 border-t md:border-t-0 md:border-l border-white/10 pt-4 md:pt-0 md:pl-6">
              <p>
                <span className="text-[#808080]">Starring:</span>{" "}
                <span className="text-white font-semibold">Dhruv & Partner</span>
              </p>
              <p>
                <span className="text-[#808080]">Genres:</span>{" "}
                <span className="text-white">Romance, Comedy, Soulmates</span>
              </p>
              <p>
                <span className="text-[#808080]">Mood:</span>{" "}
                <span className="text-white">Heartfelt, Emotional, Forever</span>
              </p>
              <p>
                <span className="text-[#808080]">Duration:</span>{" "}
                <span className="text-white font-semibold">8 Months & Growing</span>
              </p>
            </div>
          </div>

          {/* Episode List Section */}
          <div>
            {/* Section Header & Season Dropdown */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
              <h3 className="text-xl font-extrabold text-white tracking-tight">
                Episodes
              </h3>

              {/* Season Selector Dropdown */}
              <div className="relative">
                <select
                  value={selectedSeasonNum}
                  onChange={(e) => setSelectedSeasonNum(Number(e.target.value))}
                  className="appearance-none bg-[#242424] hover:bg-[#303030] text-white text-xs sm:text-sm font-bold py-2 pl-4 pr-9 rounded border border-white/20 outline-none cursor-pointer"
                >
                  {allSeasons.map((season) => (
                    <option key={season.seasonNumber} value={season.seasonNumber}>
                      Season {season.seasonNumber} ({season.monthTitle})
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-white/70 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Episodes Table */}
            <div className="divide-y divide-white/5">
              {seasonEpisodes.map((ep) => (
                <div
                  key={ep.id}
                  onClick={() => setLocation(`/watch/${ep.id}`)}
                  className="group flex flex-col sm:flex-row items-start sm:items-center gap-4 py-4 px-3 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
                >
                  {/* Episode Number */}
                  <span className="text-base sm:text-lg font-bold text-white/40 group-hover:text-white w-6 text-center shrink-0">
                    {ep.episodeNumber}
                  </span>

                  {/* Thumbnail with Play Hover */}
                  <div className="relative w-full sm:w-36 aspect-video rounded overflow-hidden bg-black/40 shrink-0 border border-white/10 group-hover:border-white/40">
                    <img
                      src={ep.thumbnailUrl}
                      alt={ep.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center shadow-lg">
                        <Play className="w-4 h-4 fill-current ml-0.5" />
                      </div>
                    </div>
                  </div>

                  {/* Title & Description */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-sm font-bold text-white group-hover:text-[#E50914] transition-colors truncate">
                        {ep.title}
                      </h4>
                      <span className="text-xs text-white/50 shrink-0 font-medium">
                        {ep.durationMinutes}m
                      </span>
                    </div>

                    <p className="text-xs text-white/70 mt-1 line-clamp-2 leading-relaxed">
                      {ep.description}
                    </p>

                    {ep.location && (
                      <div className="flex items-center gap-1 text-[11px] text-[#808080] mt-1.5">
                        <MapPin className="w-3 h-3 text-[#E50914]" />
                        <span>{ep.location}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
