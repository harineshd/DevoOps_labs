import React, { useState, useEffect, useRef } from 'react';
import { Search, Bell, ChevronDown, Check, Plus, HelpCircle, User, Settings, LogOut } from 'lucide-react';

export default function Navbar({
  activeTab,
  setActiveTab,
  searchQuery,
  setSearchQuery,
  watchlistCount,
  currentProfile,
  setCurrentProfile
}) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const searchInputRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'tv-shows', label: 'TV Shows' },
    { id: 'movies', label: 'Movies' },
    { id: 'new-popular', label: 'New & Popular' },
    { id: 'watchlist', label: `My List ${watchlistCount > 0 ? `(${watchlistCount})` : ''}` },
    { id: 'languages', label: 'Browse by Languages' }
  ];

  const notifications = [
    {
      id: 1,
      title: 'New Arrival',
      desc: 'Cyberpunk: Neo Tokyo 2099 is now streaming in 4K Ultra HD.',
      time: '1h ago',
      img: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=150&auto=format&fit=crop'
    },
    {
      id: 2,
      title: 'Top 10 in India Today',
      desc: 'Interstellar Horizon jumped to #1 this week.',
      time: '4h ago',
      img: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=150&auto=format&fit=crop'
    },
    {
      id: 3,
      title: 'Coming Friday',
      desc: 'Blade of the Ronin: Season 2 trailer released.',
      time: '1d ago',
      img: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=150&auto=format&fit=crop'
    }
  ];

  const profiles = [
    { id: 'alex', name: 'Alex', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop', color: '#E50914' },
    { id: 'children', name: 'Children', avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&auto=format&fit=crop', color: '#0071EB' },
    { id: 'guest', name: 'Guest', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&auto=format&fit=crop', color: '#F5A623' }
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-500 px-4 md:px-12 py-3 flex items-center justify-between ${
        isScrolled
          ? 'bg-[#141414] shadow-2xl border-b border-zinc-900/60'
          : 'bg-gradient-to-b from-black/90 via-black/50 to-transparent'
      }`}
    >
      {/* Left side: Logo & Navigation */}
      <div className="flex items-center space-x-4 lg:space-x-8">
        {/* Netflix Logo */}
        <div
          onClick={() => { setActiveTab('home'); setSearchQuery(''); }}
          className="cursor-pointer flex items-center group select-none mr-2"
        >
          <span className="font-bebas text-3xl md:text-4xl tracking-wider text-[#E50914] hover:opacity-90 transition-opacity">
            NETFLIX
          </span>
        </div>

        {/* Primary Desktop Nav Links */}
        <nav className="hidden md:flex items-center space-x-4 lg:space-x-6 text-[13px] font-normal">
          {navLinks.map(link => (
            <button
              key={link.id}
              onClick={() => { setActiveTab(link.id); setSearchQuery(''); }}
              className={`transition-colors duration-200 hover:text-zinc-300 ${
                activeTab === link.id && !searchQuery
                  ? 'text-white font-bold'
                  : 'text-zinc-300/80 font-normal'
              }`}
            >
              {link.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Right side: Search, Children, Notifications, Profile */}
      <div className="flex items-center space-x-4 md:space-x-6 text-white text-sm">
        {/* Expandable Search Bar */}
        <div className={`relative flex items-center transition-all duration-300 ${
          searchOpen ? 'bg-black/90 border border-white/70 px-2.5 py-1 rounded' : ''
        }`}>
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="text-white hover:text-zinc-300 focus:outline-none"
            title="Search"
          >
            <Search className="w-5 h-5" />
          </button>
          {searchOpen && (
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Titles, people, genres"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent text-white text-xs md:text-sm pl-2 w-36 md:w-56 focus:outline-none placeholder-zinc-400"
            />
          )}
        </div>

        {/* Children shortcut */}
        <button
          onClick={() => { setActiveTab('Anime & Animation'); setSearchQuery(''); }}
          className="hidden sm:inline text-xs font-medium hover:text-zinc-300 transition-colors"
        >
          Children
        </button>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => { setShowNotifications(!showNotifications); setShowProfileMenu(false); }}
            className="text-white hover:text-zinc-300 relative focus:outline-none pt-1"
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute -top-0.5 -right-1 bg-[#E50914] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
              3
            </span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-3 w-80 bg-[#141414]/95 border border-zinc-700/80 rounded shadow-2xl backdrop-blur-md overflow-hidden z-50">
              <div className="p-3 border-b border-zinc-800 text-xs font-bold text-zinc-300">
                Recent Notifications
              </div>
              <div className="divide-y divide-zinc-800/80 max-h-72 overflow-y-auto">
                {notifications.map(n => (
                  <div key={n.id} className="p-3 flex items-start space-x-3 hover:bg-zinc-800/60 cursor-pointer transition-colors">
                    <img src={n.img} alt="" className="w-16 h-10 object-cover rounded flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-white">{n.title}</p>
                      <p className="text-[11px] text-zinc-400 line-clamp-2 leading-tight mt-0.5">{n.desc}</p>
                      <span className="text-[9px] text-zinc-500 mt-1 block">{n.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Avatar & Dropdown */}
        <div className="relative">
          <div
            onClick={() => { setShowProfileMenu(!showProfileMenu); setShowNotifications(false); }}
            className="flex items-center space-x-1.5 cursor-pointer group"
          >
            <div className="w-8 h-8 rounded overflow-hidden border border-transparent group-hover:border-white transition-colors bg-[#E50914] flex items-center justify-center font-bold text-sm">
              <img
                src={currentProfile?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop'}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            <ChevronDown className={`w-3.5 h-3.5 text-white transition-transform duration-200 ${showProfileMenu ? 'rotate-180' : ''}`} />
          </div>

          {showProfileMenu && (
            <div className="absolute right-0 mt-3 w-56 bg-[#141414]/95 border border-zinc-800 rounded shadow-2xl backdrop-blur-md overflow-hidden z-50 text-xs">
              {/* Profile switch list */}
              <div className="p-2 space-y-1 border-b border-zinc-800">
                {profiles.map(p => (
                  <div
                    key={p.id}
                    onClick={() => { setCurrentProfile(p); setShowProfileMenu(false); }}
                    className="flex items-center space-x-3 p-1.5 rounded hover:bg-zinc-800/80 cursor-pointer"
                  >
                    <img src={p.avatar} alt="" className="w-7 h-7 rounded object-cover" />
                    <span className={`flex-1 font-medium ${currentProfile?.id === p.id ? 'text-white font-bold' : 'text-zinc-300'}`}>
                      {p.name}
                    </span>
                    {currentProfile?.id === p.id && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                  </div>
                ))}
              </div>

              {/* Account links */}
              <div className="p-2 space-y-2 border-b border-zinc-800 text-zinc-300">
                <div className="p-1 hover:text-white cursor-pointer flex items-center space-x-2">
                  <User className="w-3.5 h-3.5" />
                  <span>Account</span>
                </div>
                <div className="p-1 hover:text-white cursor-pointer flex items-center space-x-2">
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>Help Centre</span>
                </div>
                <div className="p-1 hover:text-white cursor-pointer flex items-center space-x-2">
                  <Settings className="w-3.5 h-3.5" />
                  <span>Manage Profiles</span>
                </div>
              </div>

              {/* Sign out */}
              <div className="p-2 text-zinc-300 hover:text-white cursor-pointer flex items-center space-x-2">
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign out of Netflix</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
