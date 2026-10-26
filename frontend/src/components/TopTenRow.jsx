import React, { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function TopTenRow({
  title = "Top 10 Movies in India Today",
  movies = [],
  onPlay,
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
    <div className="relative py-4 md:py-6 px-4 md:px-12 group/row select-none">
      <h2 className="text-lg md:text-2xl font-bold text-white mb-3">
        {title}
      </h2>

      <div className="relative">
        {showLeftArrow && (
          <button
            onClick={() => handleScroll('left')}
            className="absolute left-0 top-0 bottom-0 z-30 bg-black/70 hover:bg-black/90 text-white w-12 flex items-center justify-center transition-opacity rounded-r-md backdrop-blur-xs opacity-0 group-hover/row:opacity-100"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>
        )}

        <div
          ref={rowRef}
          className="flex items-center space-x-2 md:space-x-4 overflow-x-auto no-scrollbar scroll-smooth py-4 px-1"
        >
          {movies.slice(0, 10).map((movie, index) => (
            <div
              key={movie.id}
              onClick={() => onMoreInfo(movie)}
              className="relative flex-none flex items-center cursor-pointer group transition-transform duration-300 hover:scale-105"
            >
              {/* Giant Rank Number */}
              <span className="netflix-rank-number -mr-4 sm:-mr-8 z-0">
                {index + 1}
              </span>

              {/* Poster Card */}
              <div className="relative z-10 w-[110px] sm:w-[140px] md:w-[170px] aspect-[2/3] rounded-md overflow-hidden bg-zinc-800 shadow-xl border border-zinc-800/80 group-hover:border-zinc-500">
                <img
                  src={movie.poster_url || movie.backdrop_url}
                  alt={movie.title}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                {/* Netflix N Logo Badge on top left of poster */}
                <div className="absolute top-1.5 left-1.5 w-4 h-4 bg-[#E50914] rounded-xs flex items-center justify-center font-black text-[10px] text-white">
                  N
                </div>
              </div>
            </div>
          ))}
        </div>

        {showRightArrow && (
          <button
            onClick={() => handleScroll('right')}
            className="absolute right-0 top-0 bottom-0 z-30 bg-black/70 hover:bg-black/90 text-white w-12 flex items-center justify-center transition-opacity rounded-l-md backdrop-blur-xs opacity-0 group-hover/row:opacity-100"
          >
            <ChevronRight className="w-8 h-8" />
          </button>
        )}
      </div>
    </div>
  );
}
