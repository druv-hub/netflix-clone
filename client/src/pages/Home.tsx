import { EpisodeModal } from "@/components/EpisodeModal";
import { NetflixHero } from "@/components/NetflixHero";
import { NetflixNavbar } from "@/components/NetflixNavbar";
import { NetflixRow } from "@/components/NetflixRow";
import {
  Episode,
  getActiveProfile,
  getMyList,
  getWatchHistory,
  loadEpisodes,
  loadSeasons,
  SeasonInfo,
  UserProfile,
} from "@/lib/memoryStore";
import { Heart, Sparkles } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link } from "wouter";

interface HomeProps {
  onReplayIntro: () => void;
}

export default function Home({ onReplayIntro }: HomeProps) {
  const [episodes, setEpisodes] = useState<Episode[]>(loadEpisodes());
  const [seasons, setSeasons] = useState<SeasonInfo[]>(loadSeasons());
  const [currentProfile, setCurrentProfile] = useState<UserProfile>(
    getActiveProfile()
  );
  const [selectedEpisode, setSelectedEpisode] = useState<Episode | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchFilter, setSearchFilter] = useState("");

  useEffect(() => {
    setEpisodes(loadEpisodes());
    setSeasons(loadSeasons());
    setCurrentProfile(getActiveProfile());
  }, []);

  const handleOpenModal = (ep?: Episode) => {
    setSelectedEpisode(ep || episodes[0]);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // Watch history & My List
  const watchHistory = getWatchHistory();
  const continueWatchingEpisodes = episodes.filter(
    (e) => (watchHistory[e.id] || 0) > 0
  );

  const myListIds = getMyList();
  const myListEpisodes = episodes.filter((e) => myListIds.includes(e.id));

  // Top 10 memories curated across seasons
  const top10Ids = [100, 101, 201, 301, 400, 501, 601, 700, 704, 804];
  const top10Episodes = top10Ids
    .map((id) => episodes.find((e) => e.id === id))
    .filter(Boolean) as Episode[];

  // Search results
  const filteredEpisodes = searchFilter.trim()
    ? episodes.filter(
        (e) =>
          e.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
          e.description.toLowerCase().includes(searchFilter.toLowerCase()) ||
          (e.location &&
            e.location.toLowerCase().includes(searchFilter.toLowerCase()))
      )
    : null;

  return (
    <div className="min-h-screen bg-[#141414] text-white selection:bg-[#E50914] selection:text-white">
      {/* Netflix Navbar */}
      <NetflixNavbar
        currentProfile={currentProfile}
        onProfileChange={(p) => setCurrentProfile(p)}
        onOpenIntro={onReplayIntro}
        onSearchChange={(q) => setSearchFilter(q)}
      />

      {/* If Search is Active, show Search View */}
      {filteredEpisodes !== null ? (
        <main className="pt-24 sm:pt-32 px-4 sm:px-8 max-w-7xl mx-auto min-h-[70vh]">
          <h1 className="text-2xl font-bold text-white mb-6">
            Search Results for "{searchFilter}" ({filteredEpisodes.length})
          </h1>
          {filteredEpisodes.length === 0 ? (
            <div className="py-20 text-center text-[#808080]">
              <p className="text-lg">No memories found matching your search.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {filteredEpisodes.map((ep) => (
                <div
                  key={ep.id}
                  onClick={() => handleOpenModal(ep)}
                  className="aspect-video rounded bg-[#181818] overflow-hidden cursor-pointer group relative border border-white/10 hover:border-white/40 transition-all hover:scale-105"
                >
                  <img
                    src={ep.thumbnailUrl}
                    alt={ep.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent p-2.5 flex flex-col justify-end">
                    <p className="text-[10px] font-bold text-[#E50914]">
                      S{ep.seasonNumber}:E{ep.episodeNumber}
                    </p>
                    <p className="text-xs font-bold text-white truncate">
                      {ep.title}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      ) : (
        <main className="relative">
          {/* Netflix Hero Billboard */}
          <NetflixHero
            featuredEpisode={episodes.find((e) => e.seasonNumber === 8) || episodes[0]}
            seasonInfo={seasons.find((s) => s.seasonNumber === 8) || seasons[0]}
            onMoreInfo={() => handleOpenModal(episodes[0])}
          />

          {/* Negative Margin Carousel Stacking to overlap hero bottom smoothly */}
          <div className="relative z-20 -mt-16 sm:-mt-24 md:-mt-32 space-y-2 pb-16">
            {/* 1. Continue Watching (if any progress) */}
            {continueWatchingEpisodes.length > 0 && (
              <NetflixRow
                title={`Continue Watching for ${currentProfile.name}`}
                episodes={continueWatchingEpisodes}
                onSelectEpisode={handleOpenModal}
              />
            )}

            {/* 2. Top 10 Memories Today */}
            <NetflixRow
              rowId="top10"
              title="Top 10 Memories in Our Life Today"
              subtitle="Ranked by pure happiness and butterflies"
              episodes={top10Episodes}
              isTop10={true}
              onSelectEpisode={handleOpenModal}
            />

            {/* 3. My List (Favorites) */}
            {myListEpisodes.length > 0 && (
              <NetflixRow
                rowId="mylist"
                title="My List · Our Absolute Favorites"
                subtitle="Bookmarked memories you can rewatch anytime"
                episodes={myListEpisodes}
                onSelectEpisode={handleOpenModal}
              />
            )}

            {/* 4. All 8 Seasons Rows (1 Season = 1 Month) */}
            {seasons.map((season) => {
              const seasonEps = episodes.filter(
                (e) => e.seasonNumber === season.seasonNumber
              );

              return (
                <NetflixRow
                  key={season.seasonNumber}
                  title={`Season ${season.seasonNumber}: ${season.monthTitle}`}
                  subtitle={season.description}
                  episodes={seasonEps}
                  onSelectEpisode={handleOpenModal}
                />
              );
            })}
          </div>
        </main>
      )}

      {/* Episode Modal */}
      {isModalOpen && (
        <EpisodeModal
          initialEpisode={selectedEpisode}
          onClose={handleCloseModal}
        />
      )}

      {/* Netflix Footer */}
      <footer className="border-t border-white/10 bg-[#111111] py-12 px-4 sm:px-8 text-xs text-[#808080]">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex items-center gap-2 text-sm text-white font-bold">
            <Heart className="w-4 h-4 text-[#E50914] fill-current" />
            <span>Our Story · A Private 8-Season Streaming Love Archive</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <Link href="/" className="hover:underline">
              Home
            </Link>
            <Link href="/show" className="hover:underline">
              All 8 Seasons
            </Link>
            <button onClick={onReplayIntro} className="text-left hover:underline">
              Replay Netflix Intro
            </button>
          </div>

          <p className="pt-4 border-t border-white/5 text-[11px] text-[#666666]">
            Created for the most amazing girl in the universe. (c) 2026 Our Story. All rights reserved to Us.
          </p>
        </div>
      </footer>
    </div>
  );
}
