import { useRef, useState } from 'react';

interface SecureVideoPlayerProps {
  src: string;
  title?: string;
  className?: string;
}

export function SecureVideoPlayer({ src, title, className = '' }: SecureVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Prevent right-click context menu
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    return false;
  };

  // Prevent keyboard shortcuts for download
  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Block common download shortcuts
    if ((e.ctrlKey || e.metaKey) && (e.key === 's' || e.key === 'S')) {
      e.preventDefault();
      return false;
    }
  };

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

  return (
    <div 
      className={`relative bg-gray-900 rounded-lg overflow-hidden ${className}`}
      onContextMenu={handleContextMenu}
    >
      <video
        ref={videoRef}
        src={src}
        title={title}
        className="w-full aspect-video"
        controls
        controlsList="nodownload noremoteplayback"
        disablePictureInPicture
        disableRemotePlayback
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onKeyDown={handleKeyDown}
        onContextMenu={handleContextMenu}
        playsInline
      />
      
      {/* Overlay to prevent easy access */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{ 
          background: 'transparent',
          zIndex: 1 
        }}
      />
    </div>
  );
}
