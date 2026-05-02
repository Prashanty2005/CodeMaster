import { useState, useRef, useEffect, useCallback } from 'react';
import { Pause, Play, AlertCircle } from 'lucide-react';
import axiosClient from '../utils/axiosClient';

const Editorial = ({ problemId, secureUrl, thumbnailUrl, duration }) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [editorialData, setEditorialData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // We rely entirely on props (secureUrl, thumbnailUrl, duration)
    // because the backend does not have an /editorial endpoint yet.
    setLoading(false);
  }, [secureUrl, problemId]);

  const formatTime = useCallback((seconds) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }, []);

  const togglePlayPause = useCallback(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(prev => !prev);
    }
  }, [isPlaying]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    
    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
    };
    
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('play', onPlay);
    video.addEventListener('pause', onPause);
    
    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('play', onPlay);
      video.removeEventListener('pause', onPause);
    };
  }, [editorialData, secureUrl]);

  if (loading) {
    return (
      <div className="w-full max-w-4xl mx-auto space-y-6">
        <div className="w-full aspect-video bg-[#0f1117] animate-pulse rounded-xl border border-[#2a2e3a]"></div>
        <div className="space-y-4 p-4">
          <div className="h-6 bg-[#0f1117] animate-pulse rounded w-1/3"></div>
          <div className="h-4 bg-[#0f1117] animate-pulse rounded w-full"></div>
          <div className="h-4 bg-[#0f1117] animate-pulse rounded w-full"></div>
          <div className="h-4 bg-[#0f1117] animate-pulse rounded w-5/6"></div>
        </div>
      </div>
    );
  }

  if (error && problemId) {
    return (
      <div className="w-full max-w-4xl mx-auto p-6 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400">
        <AlertCircle size={20} />
        <span className="font-medium">{error}</span>
      </div>
    );
  }

  const finalSecureUrl = editorialData?.secureUrl || secureUrl;
  const finalThumbnailUrl = editorialData?.thumbnailUrl || thumbnailUrl;
  const finalDuration = editorialData?.duration || duration || videoRef.current?.duration || 0;
  const hasContent = editorialData?.content || editorialData?.markdown || editorialData?.explanation;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      {finalSecureUrl && (
        <div 
          className="relative w-full rounded-xl overflow-hidden shadow-2xl border border-[#2a2e3a] bg-[#0f1117] group"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          <video
            ref={videoRef}
            src={finalSecureUrl}
            poster={finalThumbnailUrl}
            onClick={togglePlayPause}
            className="w-full aspect-video object-contain bg-black cursor-pointer"
          />
          
          <div 
            className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-4 transition-all duration-300 ease-in-out ${
              isHovering || !isPlaying ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
            }`}
          >
            <div className="flex items-center gap-4">
              <button
                onClick={togglePlayPause}
                className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-600 hover:bg-blue-500 text-white transition-transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              >
                {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-1" />}
              </button>
              
              <div className="flex items-center flex-1 gap-3">
                <span className="text-white text-xs font-medium font-mono min-w-[40px] text-center">
                  {formatTime(currentTime)}
                </span>
                
                <input
                  type="range"
                  min="0"
                  max={finalDuration}
                  value={currentTime}
                  onChange={(e) => {
                    if (videoRef.current) {
                      videoRef.current.currentTime = Number(e.target.value);
                      setCurrentTime(Number(e.target.value));
                    }
                  }}
                  className="flex-1 h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500 hover:accent-blue-400"
                />
                
                <span className="text-white text-xs font-medium font-mono min-w-[40px] text-center">
                  {formatTime(finalDuration)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {hasContent && (
        <div className="bg-[#0f1117] p-6 md:p-8 rounded-xl border border-[#2a2e3a] shadow-lg">
          <div 
            className="prose prose-invert prose-blue max-w-none prose-pre:bg-[#1a1e2a] prose-pre:border prose-pre:border-[#2a2e3a] prose-code:text-blue-300 prose-headings:text-gray-100 prose-p:text-gray-300 prose-a:text-blue-400 hover:prose-a:text-blue-300"
            dangerouslySetInnerHTML={{ __html: editorialData.content || editorialData.markdown || editorialData.explanation }}
          />
        </div>
      )}
    </div>
  );
};

export default Editorial;