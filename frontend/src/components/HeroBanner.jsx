import React, { useState } from 'react';
import { Play, Info, Volume2, VolumeX } from 'lucide-react';

export default function HeroBanner({
  movie,
  onPlay,
  onMoreInfo
}) {
  const [isMuted, setIsMuted] = useState(true);

  if (!movie) {
    return (
      <div className="relative h-[65vh] md:h-[82vh] w-full bg-[#181818] animate-pulse flex items-center justify-center">
        <div className="text-zinc-600 font-mono text-sm">Loading Netflix Featured Title...</div>
      </div>
    );
  }

  return (
    <div className="relative h-[70vh] md:h-[85vh] w-full select-none overflow-hidden">
      {/* Background Image with Netflix-style Gradient Vignettes */}
      <div className="absolute inset-0">
        <img
          src={movie.backdrop_url}
          alt={movie.title}
          className="w-full h-full object-cover object-center scale-100 transition-transform duration-1000 ease-out"
        />
        {/* Authentic Multi-directional Vignettes */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-[#141414]/25 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#141414] via-[#141414]/50 to-transparent w-full md:w-3/5"></div>
        <div className="absolute top-0 left-0 right-0 h-28 bg-gradient-to-b from-black/80 to-transparent"></div>
      </div>

      {/* Hero Content */}
      <div className="relative z-10 h-full max-w-7xl mx-auto px-4 md:px-12 flex flex-col justify-end pb-24 md:pb-28">
        <div className="max-w-xl md:max-w-2xl space-y-4">
          
          {/* Netflix N SERIES or Top 10 Badge */}
          <div className="flex items-center space-x-2">
            <span className="font-bebas text-lg tracking-widest text-[#E50914] bg-black/60 px-2 py-0.5 rounded font-bold">
              N FILM
            </span>
            <div className="flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider text-white">
              <span className="bg-[#E50914] text-white px-1.5 py-0.5 rounded text-[10px] font-black">TOP 10</span>
              <span>#1 in Movies Today</span>
            </div>
          </div>

          {/* Title in bold cinematic typography */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-white drop-shadow-2xl leading-none">
            {movie.title}
          </h1>

          {/* Metadata Badges */}
          <div className="flex items-center space-x-3 text-xs md:text-sm font-semibold text-zinc-300">
            <span className="text-emerald-400 font-bold">98% Match</span>
            <span>{movie.release_year}</span>
            <span className="border border-zinc-500/80 px-1.5 py-0.2 rounded text-[11px] font-bold">
              {movie.age_rating || 'U/A 16+'}
            </span>
            <span>{movie.duration}</span>
            <span className="border border-zinc-600 px-1 py-0.2 rounded text-[10px] text-zinc-400">
              Ultra HD 4K
            </span>
            <span className="border border-zinc-600 px-1 py-0.2 rounded text-[10px] text-zinc-400">
              5.1
            </span>
          </div>

          {/* Overview text */}
          <p className="text-zinc-200 text-xs sm:text-sm md:text-base line-clamp-3 leading-relaxed drop-shadow-md font-normal">
            {movie.overview}
          </p>

          {/* Netflix Primary Action Buttons */}
          <div className="flex items-center gap-3 pt-3">
            <button
              onClick={() => onPlay(movie)}
              className="flex items-center space-x-2 bg-white hover:bg-white/80 text-black px-6 sm:px-8 py-2.5 sm:py-3 rounded font-bold text-sm sm:text-base shadow-lg transition-all transform hover:scale-105 active:scale-95"
            >
              <Play className="w-5 h-5 fill-current" />
              <span>Play</span>
            </button>

            <button
              onClick={() => onMoreInfo(movie)}
              className="flex items-center space-x-2 bg-[rgba(109,109,110,0.7)] hover:bg-[rgba(109,109,110,0.4)] text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded font-bold text-sm sm:text-base backdrop-blur-sm transition-all transform hover:scale-105 active:scale-95"
            >
              <Info className="w-5 h-5" />
              <span>More Info</span>
            </button>
          </div>
        </div>
      </div>

      {/* Right Edge: Mute Toggle & Maturity Rating Strip */}
      <div className="absolute right-0 bottom-28 md:bottom-32 z-20 flex items-center space-x-3">
        <button
          onClick={() => setIsMuted(!isMuted)}
          className="w-10 h-10 rounded-full border border-white/60 bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition-colors"
          title={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
        </button>

        <div className="bg-zinc-800/80 border-l-3 border-zinc-400 text-white text-xs font-semibold py-1 px-3.5 pr-8">
          {movie.age_rating || 'U/A 16+'}
        </div>
      </div>
    </div>
  );
}
