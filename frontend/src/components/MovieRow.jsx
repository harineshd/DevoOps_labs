import React, { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import MovieCard from './MovieCard';

export default function MovieRow({
  title,
  movies = [],
  onPlay,
  onToggleWatchlist,
  onMoreInfo
}) {
  const rowRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const handleScroll = (direction) => {
    if (rowRef.current) {
      const { scrollLeft, clientWidth, scrollWidth } = rowRef.current;
      const scrollAmount = clientWidth * 0.75;
      const newScrollLeft = direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount;
      
      rowRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });

      setTimeout(() => {
        if (rowRef.current) {
          setShowLeftArrow(rowRef.current.scrollLeft > 20);
          setShowRightArrow(rowRef.current.scrollLeft + rowRef.current.clientWidth < rowRef.current.scrollWidth - 20);
        }
      }, 350);
    }
  };

  if (!movies || movies.length === 0) return null;

  return (
    <div className="relative py-4 md:py-6 px-4 md:px-12 group/row">
      {/* Category Title */}
      <h2 className="text-lg md:text-xl font-bold text-zinc-100 hover:text-white transition-colors cursor-pointer inline-flex items-center space-x-2 mb-3">
        <span>{title}</span>
        <span className="text-xs font-semibold text-emerald-400 opacity-0 group-hover/row:opacity-100 transition-opacity">
          Explore All ›
        </span>
      </h2>

      {/* Row Container */}
      <div className="relative">
        {/* Left Arrow Button */}
        {showLeftArrow && (
          <button
            onClick={() => handleScroll('left')}
            className="absolute left-0 top-0 bottom-0 z-30 bg-black/70 hover:bg-black/90 text-white w-10 flex items-center justify-center transition-opacity rounded-r-md backdrop-blur-xs opacity-0 group-hover/row:opacity-100"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}

        {/* Scrollable Movies List */}
        <div
          ref={rowRef}
          className="flex items-center space-x-3 overflow-x-auto no-scrollbar scroll-smooth py-2 px-1"
        >
          {movies.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              onPlay={onPlay}
              onToggleWatchlist={onToggleWatchlist}
              onMoreInfo={onMoreInfo}
            />
          ))}
        </div>

        {/* Right Arrow Button */}
        {showRightArrow && (
          <button
            onClick={() => handleScroll('right')}
            className="absolute right-0 top-0 bottom-0 z-30 bg-black/70 hover:bg-black/90 text-white w-10 flex items-center justify-center transition-opacity rounded-l-md backdrop-blur-xs opacity-0 group-hover/row:opacity-100"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        )}
      </div>
    </div>
  );
}
