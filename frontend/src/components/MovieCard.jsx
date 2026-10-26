import React, { useState } from 'react';
import { Play, Plus, Check, ThumbsUp, ChevronDown } from 'lucide-react';

export default function MovieCard({
  movie,
  onPlay,
  onToggleWatchlist,
  onMoreInfo
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [liked, setLiked] = useState(false);

  return (
    <div
      className="relative flex-none w-[170px] sm:w-[210px] md:w-[250px] cursor-pointer group select-none transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Base Card */}
      <div 
        onClick={() => onMoreInfo(movie)}
        className="relative aspect-[16/9] w-full rounded overflow-hidden bg-zinc-800 transition-all duration-300 transform group-hover:scale-105 group-hover:shadow-2xl group-hover:z-20 border border-zinc-800 group-hover:border-zinc-600"
      >
        <img
          src={movie.backdrop_url || movie.poster_url}
          alt={movie.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />

        {/* Small Netflix N badge */}
        <div className="absolute top-1.5 left-1.5 w-3.5 h-3.5 bg-[#E50914] rounded-xs flex items-center justify-center font-black text-[9px] text-white">
          N
        </div>

        {/* Top Right Badges */}
        {movie.badge && (
          <div className="absolute top-1.5 right-1.5">
            <span className="bg-[#E50914]/90 backdrop-blur-xs text-[9px] font-bold text-white px-1.5 py-0.5 rounded shadow">
              {movie.badge}
            </span>
          </div>
        )}

        {/* Title gradient overlay at bottom */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent flex items-end p-2">
          <span className="text-white font-bold text-xs truncate drop-shadow">
            {movie.title}
          </span>
        </div>
      </div>

      {/* Hover Card Drawer (Pops up below card like true Netflix) */}
      {isHovered && (
        <div 
          onClick={(e) => { e.stopPropagation(); onMoreInfo(movie); }}
          className="absolute -bottom-16 left-0 right-0 z-30 bg-[#181818] p-3 rounded-b shadow-2xl border-x border-b border-zinc-700/80 animate-netflix-modal"
        >
          {/* Action Icons Row */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-1.5">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onPlay(movie);
                }}
                className="p-1.5 bg-white hover:bg-zinc-200 text-black rounded-full transition-transform hover:scale-110"
                title="Play"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleWatchlist(movie.id);
                }}
                className={`p-1.5 rounded-full border transition-transform hover:scale-110 ${
                  movie.is_in_watchlist
                    ? 'bg-emerald-950 border-emerald-500 text-emerald-400'
                    : 'bg-zinc-800 border-zinc-600 text-zinc-300 hover:border-white'
                }`}
                title={movie.is_in_watchlist ? 'Remove from My List' : 'Add to My List'}
              >
                {movie.is_in_watchlist ? (
                  <Check className="w-3.5 h-3.5" />
                ) : (
                  <Plus className="w-3.5 h-3.5" />
                )}
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setLiked(!liked);
                }}
                className={`p-1.5 rounded-full border transition-transform hover:scale-110 ${
                  liked
                    ? 'bg-[#E50914]/20 border-[#E50914] text-[#E50914]'
                    : 'bg-zinc-800 border-zinc-600 text-zinc-300 hover:border-white'
                }`}
                title="I like this"
              >
                <ThumbsUp className="w-3.5 h-3.5" />
              </button>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onMoreInfo(movie);
              }}
              className="p-1.5 rounded-full border border-zinc-600 hover:border-white text-zinc-300 transition-colors"
              title="More Info"
            >
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Quick Details */}
          <div className="flex items-center space-x-2 text-[10px] text-zinc-300">
            <span className="text-emerald-400 font-bold">{Math.round((movie.rating || 9) * 10)}% Match</span>
            <span className="border border-zinc-600 px-1 py-0.2 rounded text-[9px]">{movie.age_rating || '16+'}</span>
            <span>{movie.duration || '2h'}</span>
            <span className="border border-zinc-600 px-1 py-0.2 rounded text-[9px] text-zinc-400">HD</span>
          </div>

          {/* Genre Tags */}
          <div className="text-[10px] text-zinc-400 mt-1 truncate">
            {movie.genre || movie.category || 'Action • Sci-Fi'}
          </div>
        </div>
      )}
    </div>
  );
}
