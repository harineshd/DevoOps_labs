import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Play, Pause, Volume2, VolumeX, RotateCcw, RotateCw, Maximize, MessageSquare, Gauge } from 'lucide-react';

export default function VideoPlayerModal({
  movie,
  onClose
}) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [showControls, setShowControls] = useState(true);
  const videoRef = useRef(null);
  const controlsTimeoutRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = () => {
      setShowControls(true);
      clearTimeout(controlsTimeoutRef.current);
      controlsTimeoutRef.current = setTimeout(() => {
        if (isPlaying) setShowControls(false);
      }, 3500);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearTimeout(controlsTimeoutRef.current);
    };
  }, [isPlaying]);

  if (!movie) return null;

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleVolumeChange = (e) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (videoRef.current) {
      videoRef.current.volume = val;
      setIsMuted(val === 0);
    }
  };

  const skipTime = (seconds) => {
    if (videoRef.current) {
      videoRef.current.currentTime += seconds;
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      setDuration(videoRef.current.duration || 0);
    }
  };

  const handleSeek = (e) => {
    const seekTime = parseFloat(e.target.value);
    setCurrentTime(seekTime);
    if (videoRef.current) {
      videoRef.current.currentTime = seekTime;
    }
  };

  const handleSpeedChange = () => {
    const speeds = [0.75, 1, 1.25, 1.5];
    const nextIdx = (speeds.indexOf(playbackSpeed) + 1) % speeds.length;
    const newSpeed = speeds[nextIdx];
    setPlaybackSpeed(newSpeed);
    if (videoRef.current) {
      videoRef.current.playbackRate = newSpeed;
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  const formatTime = (secs) => {
    if (isNaN(secs)) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-black flex items-center justify-center select-none overflow-hidden">
      {/* Video Element */}
      <video
        ref={videoRef}
        src={movie.trailer_url || "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"}
        autoPlay
        loop
        className="w-full h-full object-contain"
        onTimeUpdate={handleTimeUpdate}
        onClick={togglePlay}
      />

      {/* Top Header: Back to Browse */}
      <div className={`absolute top-0 left-0 right-0 p-6 flex items-center space-x-4 transition-opacity duration-300 bg-gradient-to-b from-black/80 to-transparent ${
        showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}>
        <button
          onClick={onClose}
          className="p-2 text-white hover:text-zinc-300 rounded-full hover:bg-white/10 transition-colors flex items-center space-x-2"
        >
          <ArrowLeft className="w-6 h-6" />
          <span className="text-sm font-semibold hidden sm:inline">Back to Browse</span>
        </button>
        <span className="text-lg font-bold text-white drop-shadow ml-2">{movie.title}</span>
      </div>

      {/* Bottom Controls Bar */}
      <div className={`absolute bottom-0 left-0 right-0 p-6 transition-opacity duration-300 bg-gradient-to-t from-black/90 via-black/50 to-transparent ${
        showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}>
        {/* Netflix Progress Slider */}
        <div className="relative mb-4 flex items-center group/scrub">
          <input
            type="range"
            min="0"
            max={duration || 100}
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-1 bg-zinc-600 rounded-lg appearance-none cursor-pointer accent-[#E50914] hover:h-2 transition-all"
          />
        </div>

        {/* Bottom Control Buttons */}
        <div className="flex items-center justify-between text-white">
          <div className="flex items-center space-x-4 sm:space-x-6">
            {/* Play / Pause */}
            <button onClick={togglePlay} className="hover:text-zinc-300 focus:outline-none">
              {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current" />}
            </button>

            {/* Skip 10s backward */}
            <button onClick={() => skipTime(-10)} className="hover:text-zinc-300 focus:outline-none" title="Rewind 10s">
              <RotateCcw className="w-5 h-5" />
            </button>

            {/* Skip 10s forward */}
            <button onClick={() => skipTime(10)} className="hover:text-zinc-300 focus:outline-none" title="Forward 10s">
              <RotateCw className="w-5 h-5" />
            </button>

            {/* Volume & Slider */}
            <div className="flex items-center space-x-2 group/vol">
              <button onClick={toggleMute} className="hover:text-zinc-300 focus:outline-none">
                {isMuted || volume === 0 ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-16 sm:w-20 h-1 bg-zinc-600 rounded appearance-none cursor-pointer accent-white"
              />
            </div>

            {/* Time Stamp */}
            <span className="text-xs text-zinc-300 font-mono">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          <div className="flex items-center space-x-4 sm:space-x-6 text-sm">
            {/* Playback speed toggle */}
            <button onClick={handleSpeedChange} className="hover:text-zinc-300 font-bold text-xs border border-zinc-500 px-1.5 py-0.5 rounded">
              {playbackSpeed}x
            </button>

            {/* Subtitles & Audio */}
            <button className="hover:text-zinc-300" title="Audio & Subtitles">
              <MessageSquare className="w-5 h-5" />
            </button>

            {/* Fullscreen */}
            <button onClick={toggleFullscreen} className="hover:text-zinc-300" title="Full Screen">
              <Maximize className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
