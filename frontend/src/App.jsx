import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HeroBanner from './components/HeroBanner';
import TopTenRow from './components/TopTenRow';
import MovieRow from './components/MovieRow';
import MovieCard from './components/MovieCard';
import MoreInfoModal from './components/MoreInfoModal';
import VideoPlayerModal from './components/VideoPlayerModal';
import Footer from './components/Footer';
import { Film, Search } from 'lucide-react';

export default function App() {
  const [movies, setMovies] = useState([]);
  const [featuredMovie, setFeaturedMovie] = useState(null);
  const [categories, setCategories] = useState([]);
  const [watchlist, setWatchlist] = useState([]);
  const [activeTab, setActiveTab] = useState('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [showMoreInfoModal, setShowMoreInfoModal] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [loading, setLoading] = useState(true);

  // Default User Profile
  const [currentProfile, setCurrentProfile] = useState({
    id: 'alex',
    name: 'Alex',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop'
  });

  // Fetch initial movie & watchlist data
  const fetchData = async () => {
    try {
      const [moviesRes, featuredRes, catRes, watchRes] = await Promise.all([
        fetch('/api/movies'),
        fetch('/api/movies/featured'),
        fetch('/api/categories'),
        fetch('/api/watchlist')
      ]);

      if (moviesRes.ok) {
        const moviesData = await moviesRes.json();
        setMovies(moviesData);
      }
      if (featuredRes.ok) {
        const featData = await featuredRes.json();
        setFeaturedMovie(featData);
      }
      if (catRes.ok) {
        const catData = await catRes.json();
        setCategories(catData);
      }
      if (watchRes.ok) {
        const watchData = await watchRes.json();
        setWatchlist(watchData);
      }
    } catch (err) {
      console.warn('Backend loading or connecting...', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Toggle My List / Watchlist
  const handleToggleWatchlist = async (movieId) => {
    try {
      const res = await fetch('/api/watchlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ movieId })
      });
      if (res.ok) {
        const [mRes, wRes] = await Promise.all([
          fetch('/api/movies'),
          fetch('/api/watchlist')
        ]);
        if (mRes.ok) setMovies(await mRes.json());
        if (wRes.ok) setWatchlist(await wRes.json());

        if (selectedMovie && selectedMovie.id === movieId) {
          setSelectedMovie(prev => ({ ...prev, is_in_watchlist: !prev.is_in_watchlist }));
        }
        if (featuredMovie && featuredMovie.id === movieId) {
          setFeaturedMovie(prev => ({ ...prev, is_in_watchlist: !prev.is_in_watchlist }));
        }
      }
    } catch (err) {
      console.error('Failed to toggle watchlist:', err);
    }
  };

  // Open Full Cinema Video Player
  const handlePlayMovie = (movie) => {
    setSelectedMovie(movie);
    setShowMoreInfoModal(false);
    setShowVideoModal(true);
  };

  // Open Netflix More Info Modal
  const handleMoreInfo = (movie) => {
    setSelectedMovie(movie);
    setShowMoreInfoModal(true);
  };

  // Filtered movies based on search or tab
  const getFilteredMovies = () => {
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      return movies.filter(m => 
        m.title?.toLowerCase().includes(q) ||
        m.genre?.toLowerCase().includes(q) ||
        m.overview?.toLowerCase().includes(q) ||
        m.category?.toLowerCase().includes(q)
      );
    }

    if (activeTab === 'watchlist') {
      return watchlist;
    }

    if (activeTab === 'tv-shows') {
      return movies.filter(m => m.category === 'Netflix Originals' || m.genre?.includes('Drama') || m.genre?.includes('Action'));
    }

    if (activeTab === 'movies') {
      return movies.filter(m => m.category !== 'Netflix Originals');
    }

    if (activeTab === 'new-popular') {
      return movies.filter(m => m.category === 'Trending Now' || m.release_year >= 2025);
    }

    return movies;
  };

  const filteredMovies = getFilteredMovies();

  return (
    <div className="min-h-screen bg-[#141414] text-white flex flex-col selection:bg-[#E50914] selection:text-white">
      {/* Netflix Top Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        watchlistCount={watchlist.length}
        currentProfile={currentProfile}
        setCurrentProfile={setCurrentProfile}
      />

      {/* Main Content */}
      <main className="flex-1 pb-20">
        {/* Search Results Grid View */}
        {searchQuery.trim() !== '' ? (
          <div className="pt-24 px-4 md:px-12 max-w-7xl mx-auto space-y-6">
            <h1 className="text-xl sm:text-2xl font-bold flex items-center space-x-2 text-zinc-300">
              <Search className="w-5 h-5 text-[#E50914]" />
              <span>Explore titles related to: <span className="text-white">"{searchQuery}"</span> ({filteredMovies.length})</span>
            </h1>

            {filteredMovies.length === 0 ? (
              <div className="py-24 text-center text-zinc-500 text-sm">
                Your search did not have any matches. Try searching with a different actor, title, or genre.
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
                {filteredMovies.map(movie => (
                  <MovieCard
                    key={movie.id}
                    movie={movie}
                    onPlay={handlePlayMovie}
                    onToggleWatchlist={handleToggleWatchlist}
                    onMoreInfo={handleMoreInfo}
                  />
                ))}
              </div>
            )}
          </div>
        ) : activeTab === 'watchlist' ? (
          /* My List View */
          <div className="pt-24 px-4 md:px-12 max-w-7xl mx-auto space-y-6">
            <h1 className="text-2xl sm:text-3xl font-bold">My List</h1>

            {watchlist.length === 0 ? (
              <div className="py-24 text-center space-y-4">
                <Film className="w-12 h-12 text-zinc-600 mx-auto" />
                <p className="text-zinc-400 text-base">You haven't added any titles to your list yet.</p>
                <button
                  onClick={() => setActiveTab('home')}
                  className="px-6 py-2.5 bg-[#E50914] text-white font-semibold rounded hover:bg-[#b81d24] transition-colors"
                >
                  Explore Titles
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
                {watchlist.map(movie => (
                  <MovieCard
                    key={movie.id}
                    movie={movie}
                    onPlay={handlePlayMovie}
                    onToggleWatchlist={handleToggleWatchlist}
                    onMoreInfo={handleMoreInfo}
                  />
                ))}
              </div>
            )}
          </div>
        ) : activeTab !== 'home' ? (
          /* Filtered Tab View (TV Shows, Movies, New & Popular) */
          <div className="pt-24 px-4 md:px-12 max-w-7xl mx-auto space-y-6">
            <h1 className="text-2xl sm:text-3xl font-bold capitalize">
              {activeTab.replace('-', ' ')}
            </h1>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
              {filteredMovies.map(movie => (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                  onPlay={handlePlayMovie}
                  onToggleWatchlist={handleToggleWatchlist}
                  onMoreInfo={handleMoreInfo}
                />
              ))}
            </div>
          </div>
        ) : (
          /* Default Netflix Home View */
          <>
            {/* Cinematic Hero Billboard */}
            <HeroBanner
              movie={featuredMovie || movies[0]}
              onPlay={handlePlayMovie}
              onMoreInfo={handleMoreInfo}
            />

            {/* Movie Rows */}
            <div className="-mt-14 md:-mt-20 relative z-20 space-y-2">
              {/* Iconic Top 10 in India Today with Giant Stylized Numbers */}
              <TopTenRow
                title="Top 10 Movies in India Today"
                movies={movies}
                onPlay={handlePlayMovie}
                onMoreInfo={handleMoreInfo}
              />

              {/* Category Rails */}
              {categories.map(category => (
                <MovieRow
                  key={category}
                  title={category}
                  movies={movies.filter(m => m.category === category)}
                  onPlay={handlePlayMovie}
                  onToggleWatchlist={handleToggleWatchlist}
                  onMoreInfo={handleMoreInfo}
                />
              ))}
            </div>
          </>
        )}
      </main>

      {/* Netflix More Info Modal */}
      {showMoreInfoModal && (
        <MoreInfoModal
          movie={selectedMovie}
          allMovies={movies}
          onClose={() => setShowMoreInfoModal(false)}
          onPlay={handlePlayMovie}
          onToggleWatchlist={handleToggleWatchlist}
        />
      )}

      {/* Netflix Fullscreen Video Player */}
      {showVideoModal && (
        <VideoPlayerModal
          movie={selectedMovie}
          onClose={() => setShowVideoModal(false)}
        />
      )}

      {/* Authentic Netflix Footer */}
      <Footer />
    </div>
  );
}
