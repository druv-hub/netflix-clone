import { NetflixPlayer } from "@/components/NetflixPlayer";
import { Episode, loadEpisodes } from "@/lib/memoryStore";
import { ArrowLeft } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useLocation, useRoute } from "wouter";

export default function Watch() {
  const [, params] = useRoute("/watch/:id");
  const [, setLocation] = useLocation();
  const [episodes, setEpisodes] = useState<Episode[]>(loadEpisodes());

  useEffect(() => {
    setEpisodes(loadEpisodes());
  }, []);

  const episodeId = Number(params?.id);
  const episode =
    episodes.find((e) => e.id === episodeId) || episodes[0];

  if (!episode) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white p-6">
        <h1 className="text-2xl font-bold mb-4">Episode Not Found</h1>
        <button
          onClick={() => setLocation("/")}
          className="flex items-center gap-2 bg-[#E50914] text-white px-5 py-2.5 rounded font-bold hover:bg-[#f40612]"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </button>
      </div>
    );
  }

  return <NetflixPlayer episode={episode} />;
}
