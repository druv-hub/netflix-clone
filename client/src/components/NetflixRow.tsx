import {
  Episode,
  getMyList,
  getWatchHistory,
  toggleMyList,
} from "@/lib/memoryStore";
import {
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Heart,
  Play,
  Plus,
} from "lucide-react";
import React, { useRef, useState } from "react";
import { toast } from "sonner";
import { useLocation } from "wouter";

interface NetflixRowProps {
  title: string;
  subtitle?: string;
  episodes: Episode[];
  isTop10?: boolean;
  onSelectEpisode: (ep: Episode) => void;
  rowId?: string;
}

export function NetflixRow({
  title,
  subtitle,
  episodes,
  isTop10 = false,
  onSelectEpisode,
  rowId,
}: NetflixRowProps) {
  const [, setLocation] = useLocation();
  const rowRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const [myListIds, setMyListIds] = useState<number[]>(getMyList());
  const watchHistory = getWatchHistory();

  const handleScroll = (direction: "left" | "right") => {
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;
      const scrollAmount = clientWidth * 0.75;
      const newScroll =
        direction === "left" ? scrollLeft - scrollAmount : scrollLeft + scrollAmount;
      rowRef.current.scrollTo({ left: newScroll, behavior: "smooth" });
    }
  };

  const onScrollCheck = () => {
    if (rowRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = rowRef.current;
      setShowLeftArrow(scrollLeft > 20);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 20);
    }
  };

  const handleToggleMyList = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    toggleMyList(id);
    setMyListIds(getMyList());
  };

  if (!episodes || episodes.length === 0) return null;

  return (
    <div id={rowId} className="relative mb-8 sm:mb-12 px-4 sm:px-8 select-none group/row">
      {/* Row Header */}
      <div className="mb-3 flex items-baseline justify-between">
        <div>
          <h2 className="text-lg sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <span>{title}</span>
            <span className="hidden group-hover/row:inline-flex items-center text-xs font-semibold text-[#54b9c5] transition-all duration-300">
              Explore All <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </h2>
          {subtitle && (
            <p className="text-xs sm:text-sm text-[#808080] mt-0.5">{subtitle}</p>
          )}
        </div>
      </div>

      {/* Row Content & Slider */}
      <div className="relative">
        {/* Left Slider Arrow */}
        {showLeftArrow && (
          <button
            onClick={() => handleScroll("left")}
            className="absolute left-0 top-0 bottom-0 z-30 w-10 sm:w-12 bg-black/60 hover:bg-black/80 backdrop-blur-sm text-white flex items-center justify-center opacity-0 group-hover/row:opacity-100 transition-opacity rounded-r"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>
        )}

        {/* Scrollable Container */}
        <div
          ref={rowRef}
          onScroll={onScrollCheck}
          className="flex items-center gap-3 sm:gap-4 overflow-x-auto no-scrollbar scroll-smooth py-4 -my-4 px-1"
        >
          {episodes.map((ep, idx) => {
            const isInList = myListIds.includes(ep.id);
            const progress = watchHistory[ep.id] || 0;

            if (isTop10) {
              return (
                <div
                  key={ep.id}
                  onClick={() => onSelectEpisode(ep)}
                  className="relative shrink-0 flex items-end cursor-pointer group/card transition-transform duration-300 hover:scale-105"
                >
                  {/* Giant 3D Outlined Netflix Number */}
                  <span className="top10-number -mr-6 sm:-mr-8 z-10 pointer-events-none">
                    {idx + 1}
                  </span>

                  {/* Top 10 Poster Card */}
                  <div className="relative w-32 sm:w-44 aspect-[2/3] rounded-md overflow-hidden bg-[#181818] shadow-lg border border-white/10 group-hover/card:border-white/40 transition-all">
                    <img
                      src={ep.thumbnailUrl}
                      alt={ep.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-80" />
                    <div className="absolute bottom-2 left-2 right-2">
                      <p className="text-[10px] font-bold text-[#E50914] uppercase">
                        S{ep.seasonNumber} · E{ep.episodeNumber}
                      </p>
                      <p className="text-xs font-bold text-white truncate">
                        {ep.title}
                      </p>
                    </div>
                  </div>
                </div>
              );
            }

            return (
              <div
                key={ep.id}
                onClick={() => onSelectEpisode(ep)}
                className="relative shrink-0 w-52 sm:w-64 md:w-72 aspect-video rounded-md overflow-hidden bg-[#181818] shadow-lg cursor-pointer group/card transition-all duration-300 hover:scale-105 hover:z-20 border border-white/5 hover:border-white/30"
              >
                {/* Thumbnail Image */}
                <img
                  src={ep.thumbnailUrl}
                  alt={ep.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover/card:scale-105"
                  loading="lazy"
                />

                {/* Gradient Shading */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-80 group-hover/card:opacity-95 transition-opacity" />

                {/* Progress Bar for Watch History */}
                {progress > 0 && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
                    <div
                      className="h-full bg-[#E50914]"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                )}

                {/* Play Button Overlay on Hover */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/card:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setLocation(`/watch/${ep.id}`);
                    }}
                    className="w-11 h-11 rounded-full bg-white text-black flex items-center justify-center shadow-2xl transform scale-90 group-hover/card:scale-100 transition-transform hover:bg-white/90"
                    title="Play Video"
                  >
                    <Play className="w-5 h-5 fill-current ml-0.5" />
                  </button>
                </div>

                {/* Card Bottom Meta */}
                <div className="absolute bottom-2 left-2.5 right-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-extrabold uppercase text-[#E50914] tracking-wider">
                      S{ep.seasonNumber}:E{ep.episodeNumber}
                    </span>
                    <span className="text-[10px] font-medium text-white/70">
                      {ep.durationMinutes}m
                    </span>
                  </div>

                  <h3 className="text-xs sm:text-sm font-bold text-white truncate mt-0.5">
                    {ep.title}
                  </h3>

                  {/* Card Expanded Quick Action Icons */}
                  <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-white/10 opacity-0 group-hover/card:opacity-100 transition-opacity">
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={(e) => handleToggleMyList(e, ep.id)}
                        className={`w-6 h-6 rounded-full border flex items-center justify-center transition-colors ${
                          isInList
                            ? "border-[#E50914] bg-[#E50914] text-white"
                            : "border-white/40 text-white hover:border-white"
                        }`}
                        title={isInList ? "In My List" : "Add to My List"}
                      >
                        {isInList ? <Check className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toast.success("Loved this memory");
                        }}
                        className="w-6 h-6 rounded-full border border-white/40 text-white hover:border-[#E50914] hover:text-[#E50914] flex items-center justify-center transition-colors"
                        title="Love This"
                      >
                        <Heart className="w-3 h-3" />
                      </button>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectEpisode(ep);
                      }}
                      className="w-6 h-6 rounded-full border border-white/40 text-white hover:border-white flex items-center justify-center transition-colors"
                      title="More Info"
                    >
                      <ChevronDown className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Slider Arrow */}
        {showRightArrow && (
          <button
            onClick={() => handleScroll("right")}
            className="absolute right-0 top-0 bottom-0 z-30 w-10 sm:w-12 bg-black/60 hover:bg-black/80 backdrop-blur-sm text-white flex items-center justify-center opacity-0 group-hover/row:opacity-100 transition-opacity rounded-l"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-8 h-8" />
          </button>
        )}
      </div>
    </div>
  );
}
