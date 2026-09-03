import {
  Episode,
  loadEpisodes,
  resolveVideoUrl,
  saveWatchProgress,
} from "@/lib/memoryStore";
import {
  ArrowLeft,
  FastForward,
  Heart,
  List,
  Maximize,
  Minimize,
  Pause,
  Play,
  RotateCcw,
  RotateCw,
  SkipForward,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "wouter";

interface NetflixPlayerProps {
  episode: Episode;
}

export function NetflixPlayer({ episode }: NetflixPlayerProps) {
  const [, setLocation] = useLocation();
  const [allEpisodes, setAllEpisodes] = useState<Episode[]>(loadEpisodes());
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [showLoveNotes, setShowLoveNotes] = useState(true);
  const [showEpisodeDrawer, setShowEpisodeDrawer] = useState(false);

  const hideControlsTimer = useRef<NodeJS.Timeout | null>(null);

  // Find next episode in queue
  const currentIndex = allEpisodes.findIndex((e) => e.id === episode.id);
  const nextEpisode =
    currentIndex >= 0 && currentIndex < allEpisodes.length - 1
      ? allEpisodes[currentIndex + 1]
      : null;

  const handleMouseMove = () => {
    setShowControls(true);
    if (hideControlsTimer.current) clearTimeout(hideControlsTimer.current);
    hideControlsTimer.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
        setShowEpisodeDrawer(false);
      }
    }, 3500);
  };

  useEffect(() => {
    setAllEpisodes(loadEpisodes());
  }, [episode.id]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    setCurrentTime(videoRef.current.currentTime);
    const dur = videoRef.current.duration || 1;
    setDuration(dur);

    // Save progress to watch history every few seconds
    const percent = Math.round((videoRef.current.currentTime / dur) * 100);
    saveWatchProgress(episode.id, percent);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = Number(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const skipTime = (seconds: number) => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = Math.max(
      0,
      Math.min(duration, videoRef.current.currentTime + seconds)
    );
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setVolume(val);
    if (videoRef.current) {
      videoRef.current.volume = val;
      videoRef.current.muted = val === 0;
      setIsMuted(val === 0);
    }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(console.error);
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(console.error);
      setIsFullscreen(false);
    }
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs)) return "00:00";
    const minutes = Math.floor(secs / 60);
    const seconds = Math.floor(secs % 60);
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  const playEpisode = (epId: number) => {
    setLocation(`/watch/${epId}`);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative w-screen h-screen bg-black overflow-hidden select-none cursor-default"
    >
      {/* HTML5 Video Element */}
      <video
        ref={videoRef}
        src={resolveVideoUrl(episode.videoUrl)}
        poster={episode.thumbnailUrl}
        autoPlay
        playsInline
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleTimeUpdate}
        onEnded={() => nextEpisode && playEpisode(nextEpisode.id)}
        onClick={togglePlay}
        className="w-full h-full object-contain cursor-pointer"
      />

      {/* Love Note Overlay (Netflix Subtitle / Floating Sweet Message) */}
      {showLoveNotes && episode.loveNote && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 max-w-lg w-11/12 pointer-events-none z-30 animate-fade-in">
          <div className="bg-black/65 backdrop-blur-md border border-[#E50914]/40 rounded-full px-5 py-2.5 shadow-2xl flex items-center justify-center gap-2 text-white text-xs sm:text-sm font-medium">
            <Heart className="w-4 h-4 text-[#E50914] fill-current animate-pulse shrink-0" />
            <span className="italic text-center text-white/95">"{episode.loveNote}"</span>
          </div>
        </div>
      )}

      {/* Top Header Bar (Back Button + Title) */}
      <div
        className={`absolute top-0 left-0 right-0 p-6 sm:p-8 bg-gradient-to-b from-black/90 via-black/40 to-transparent flex items-center justify-between z-40 transition-opacity duration-300 ${
          showControls ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <button
          onClick={() => setLocation("/show")}
          className="flex items-center gap-3 text-white hover:text-[#E50914] transition-colors font-bold text-sm sm:text-base group"
        >
          <ArrowLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
          <span>Exit to Episodes</span>
        </button>

        <div className="text-right">
          <p className="text-xs uppercase tracking-widest text-[#E50914] font-extrabold">
            Season {episode.seasonNumber} · Episode {episode.episodeNumber}
          </p>
          <h1 className="text-sm sm:text-lg font-bold text-white truncate max-w-md">
            {episode.title}
          </h1>
        </div>
      </div>

      {/* Episode Drawer Modal */}
      {showEpisodeDrawer && (
        <div
          className="absolute right-0 top-0 bottom-0 w-80 sm:w-96 bg-[#141414]/95 border-l border-white/10 z-50 p-6 overflow-y-auto backdrop-blur-xl shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <h3 className="font-extrabold text-white text-base">
              Season {episode.seasonNumber} Episodes
            </h3>
            <button
              onClick={() => setShowEpisodeDrawer(false)}
              className="text-white/60 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="divide-y divide-white/5 mt-2">
            {allEpisodes
              .filter((e) => e.seasonNumber === episode.seasonNumber)
              .map((ep) => (
                <div
                  key={ep.id}
                  onClick={() => {
                    playEpisode(ep.id);
                    setShowEpisodeDrawer(false);
                  }}
                  className={`py-3 flex items-center gap-3 cursor-pointer hover:bg-white/5 rounded px-2 transition-colors ${
                    ep.id === episode.id ? "bg-white/10" : ""
                  }`}
                >
                  <span className="text-xs font-bold text-white/50 w-4">
                    {ep.episodeNumber}
                  </span>
                  <div className="w-16 aspect-video rounded overflow-hidden bg-black shrink-0">
                    <img
                      src={ep.thumbnailUrl}
                      alt={ep.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-white truncate">
                      {ep.title}
                    </p>
                    <p className="text-[10px] text-white/50">{ep.durationMinutes}m</p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Bottom Control Bar */}
      <div
        className={`absolute bottom-0 left-0 right-0 p-6 sm:p-8 bg-gradient-to-t from-black/95 via-black/60 to-transparent z-40 transition-opacity duration-300 ${
          showControls ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Scrubber Timeline */}
        <div className="flex items-center gap-3 mb-4">
          <input
            type="range"
            min={0}
            max={duration || 100}
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-1.5 bg-white/30 rounded-lg appearance-none cursor-pointer accent-[#E50914] hover:h-2.5 transition-all"
          />
        </div>

        {/* Action Controls Row */}
        <div className="flex items-center justify-between text-white">
          {/* Left Actions */}
          <div className="flex items-center gap-4 sm:gap-6">
            {/* Play / Pause */}
            <button
              onClick={togglePlay}
              className="hover:text-[#E50914] transition-colors p-1"
              title={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? (
                <Pause className="w-7 h-7 fill-current" />
              ) : (
                <Play className="w-7 h-7 fill-current" />
              )}
            </button>

            {/* Rewind 10s */}
            <button
              onClick={() => skipTime(-10)}
              className="hover:text-white/80 transition-colors p-1 flex items-center justify-center relative"
              title="Rewind 10 seconds"
            >
              <RotateCcw className="w-6 h-6" />
              <span className="absolute text-[8px] font-bold">10</span>
            </button>

            {/* Fast Forward 10s */}
            <button
              onClick={() => skipTime(10)}
              className="hover:text-white/80 transition-colors p-1 flex items-center justify-center relative"
              title="Forward 10 seconds"
            >
              <RotateCw className="w-6 h-6" />
              <span className="absolute text-[8px] font-bold">10</span>
            </button>

            {/* Volume Control */}
            <div className="flex items-center gap-2 group/vol">
              <button
                onClick={toggleMute}
                className="hover:text-[#E50914] transition-colors p-1"
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="w-6 h-6" />
                ) : (
                  <Volume2 className="w-6 h-6" />
                )}
              </button>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-16 sm:w-24 h-1 bg-white/30 rounded appearance-none cursor-pointer accent-white"
              />
            </div>

            {/* Time Indicator */}
            <span className="text-xs sm:text-sm font-semibold text-white/80">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-4 sm:gap-6">
            {/* Next Episode Button */}
            {nextEpisode && (
              <button
                onClick={() => playEpisode(nextEpisode.id)}
                className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-white/90 hover:text-white hover:bg-white/10 px-3 py-1.5 rounded transition-colors"
                title="Next Episode"
              >
                <span>Next</span>
                <SkipForward className="w-4 h-4 fill-current" />
              </button>
            )}

            {/* Episode List Drawer Button */}
            <button
              onClick={() => setShowEpisodeDrawer(!showEpisodeDrawer)}
              className="hover:text-[#E50914] transition-colors p-1"
              title="Episodes List"
            >
              <List className="w-6 h-6" />
            </button>

            {/* Love Notes Toggle */}
            <button
              onClick={() => setShowLoveNotes(!showLoveNotes)}
              className={`p-1 transition-colors ${
                showLoveNotes ? "text-[#E50914]" : "text-white/40 hover:text-white"
              }`}
              title="Toggle Love Notes"
            >
              <Heart className="w-6 h-6 fill-current" />
            </button>

            {/* Fullscreen Toggle */}
            <button
              onClick={toggleFullscreen}
              className="hover:text-white/80 transition-colors p-1"
              title="Fullscreen"
            >
              {isFullscreen ? (
                <Minimize className="w-6 h-6" />
              ) : (
                <Maximize className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
