import React, { useState } from 'react';
import { X, Play, Plus, Check, ThumbsUp, Volume2, VolumeX } from 'lucide-react';

export default function MoreInfoModal({
  movie,
  allMovies = [],
  onClose,
  onPlay,
  onToggleWatchlist
}) {
  const [isMuted, setIsMuted] = useState(true);
  const [liked, setLiked] = useState(false);

  if (!movie) return null;

  // Find similar titles for "More Like This"
  const similarMovies = allMovies
    .filter(m => m.id !== movie.id && (m.category === movie.category || m.genre === movie.genre))
    .slice(0, 6);

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-4xl bg-[#181818] rounded-xl overflow-hidden shadow-2xl border border-zinc-700/60 my-auto animate-netflix-modal"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-40 p-2 bg-[#181818]/80 hover:bg-[#181818] text-white rounded-full transition-colors border border-white/20"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Hero Video / Image Header */}
        <div className="relative aspect-video w-full bg-black">
          <img
            src={movie.backdrop_url || movie.poster_url}
            alt={movie.title}
            className="w-full h-full object-cover"
          />
          {/* Authentic Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#181818] via-transparent to-transparent"></div>

          {/* Title & Action controls anchored at bottom of preview */}
          <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
            <div className="space-y-3">
              <h2 className="text-2xl sm:text-4xl font-black text-white drop-shadow-lg">
                {movie.title}
              </h2>

              <div className="flex items-center space-x-3">
                <button
                  onClick={() => onPlay(movie)}
                  className="flex items-center space-x-2 bg-white hover:bg-white/80 text-black px-6 py-2 rounded font-bold text-sm shadow-lg transition-transform hover:scale-105"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>Play</span>
                </button>

                <button
                  onClick={() => onToggleWatchlist(movie.id)}
                  className="p-2 rounded-full border border-white/60 bg-black/40 hover:bg-black/60 text-white transition-transform hover:scale-110"
                  title={movie.is_in_watchlist ? 'Remove from My List' : 'Add to My List'}
                >
                  {movie.is_in_watchlist ? (
                    <Check className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Plus className="w-4 h-4" />
                  )}
                </button>

                <button
                  onClick={() => setLiked(!liked)}
                  className={`p-2 rounded-full border border-white/60 bg-black/40 hover:bg-black/60 text-white transition-transform hover:scale-110 ${
                    liked ? 'text-[#E50914] border-[#E50914]' : ''
                  }`}
                  title="I like this"
                >
                  <ThumbsUp className="w-4 h-4" />
                </button>
              </div>
            </div>

            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-2 rounded-full border border-white/60 bg-black/40 hover:bg-black/60 text-white"
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Modal Body: Two-Column Layout */}
        <div className="p-6 md:p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
            {/* Left 2 Columns: Description & Badges */}
            <div className="md:col-span-2 space-y-4">
              <div className="flex items-center space-x-3 text-xs sm:text-sm font-semibold">
                <span className="text-emerald-400 font-bold">{Math.round((movie.rating || 9) * 10)}% Match</span>
                <span className="text-zinc-400">{movie.release_year}</span>
                <span className="border border-zinc-500/80 px-1.5 py-0.2 rounded text-[11px]">
                  {movie.age_rating || 'U/A 16+'}
                </span>
                <span className="text-zinc-400">{movie.duration}</span>
                <span className="border border-zinc-600 px-1 py-0.2 rounded text-[10px] text-zinc-400">
                  Ultra HD 4K
                </span>
                <span className="border border-zinc-600 px-1 py-0.2 rounded text-[10px] text-zinc-400">
                  5.1
                </span>
              </div>

              {movie.tagline && (
                <p className="text-zinc-300 italic font-medium">"{movie.tagline}"</p>
              )}

              <p className="text-zinc-200 leading-relaxed text-sm">
                {movie.overview}
              </p>
            </div>

            {/* Right 1 Column: Metadata */}
            <div className="space-y-3 text-xs text-zinc-400 border-t md:border-t-0 md:border-l border-zinc-800 pt-4 md:pt-0 md:pl-6">
              <div>
                <span className="text-zinc-500">Cast: </span>
                <span className="text-zinc-300">Ryan Reynolds, Scarlett Johansson, Idris Elba</span>
              </div>
              <div>
                <span className="text-zinc-500">Genres: </span>
                <span className="text-zinc-300">{movie.genre || movie.category}</span>
              </div>
              <div>
                <span className="text-zinc-500">This movie is: </span>
                <span className="text-zinc-300">Suspenseful, Mind-Bending, Visually Striking</span>
              </div>
              <div>
                <span className="text-zinc-500">Maturity Rating: </span>
                <span className="border border-zinc-600 px-1 py-0.2 rounded text-[10px] text-zinc-300 mr-1.5">
                  {movie.age_rating || '16+'}
                </span>
                <span className="text-zinc-400">Recommended for ages 16 and up.</span>
              </div>
            </div>
          </div>

          {/* "More Like This" Section */}
          {similarMovies.length > 0 && (
            <div className="space-y-4 pt-4 border-t border-zinc-800">
              <h3 className="text-lg font-bold text-white">More Like This</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-4">
                {similarMovies.map(item => (
                  <div 
                    key={item.id}
                    onClick={() => onPlay(item)}
                    className="bg-[#2f2f2f] rounded overflow-hidden cursor-pointer group hover:bg-[#383838] transition-colors"
                  >
                    <div className="relative aspect-video w-full bg-zinc-800">
                      <img src={item.backdrop_url || item.poster_url} alt="" className="w-full h-full object-cover" />
                      <div className="absolute top-2 right-2 text-xs bg-black/60 px-1.5 py-0.5 rounded text-zinc-300">
                        {item.duration}
                      </div>
                    </div>
                    <div className="p-3 space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-emerald-400 font-bold">{Math.round((item.rating || 9) * 10)}% Match</span>
                        <span className="border border-zinc-600 px-1 py-0.2 rounded text-[10px]">{item.age_rating}</span>
                      </div>
                      <h4 className="font-bold text-white truncate">{item.title}</h4>
                      <p className="text-zinc-400 text-[11px] line-clamp-3 leading-snug">{item.overview}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* "About" Section */}
          <div className="pt-4 border-t border-zinc-800 text-xs text-zinc-400 space-y-2">
            <h3 className="text-base font-bold text-white mb-2">About {movie.title}</h3>
            <p><span className="text-zinc-500">Director: </span>Christopher Nolan, Denis Villeneuve</p>
            <p><span className="text-zinc-500">Cast: </span>Ryan Reynolds, Scarlett Johansson, Idris Elba, Cillian Murphy</p>
            <p><span className="text-zinc-500">Writer: </span>Jonathan Nolan</p>
            <p><span className="text-zinc-500">Maturity Rating: </span>{movie.age_rating || 'U/A 16+'} • Violence, mature themes</p>
          </div>
        </div>
      </div>
    </div>
  );
}
