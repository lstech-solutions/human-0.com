import React, { useEffect, useRef } from 'react';

interface VideoBackgroundProps {
  videoSrc: string;
  className?: string;
  style?: React.CSSProperties;
  zIndex?: number;
  pointerEvents?: 'none' | 'auto';
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  playsInline?: boolean;
}

const VideoBackground: React.FC<VideoBackgroundProps> = ({
  videoSrc,
  className = '',
  style = {},
  zIndex = 1,
  pointerEvents = 'none',
  autoPlay = true,
  muted = true,
  loop = true,
  playsInline = true
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Ensure video plays automatically
    const handleClick = () => {
      video.play().catch(console.error);
      document.removeEventListener('click', handleClick);
    };

    const playVideo = async () => {
      try {
        if (video.paused) {
          await video.play();
        }
      } catch (error) {
        console.log('Video autoplay prevented:', error);
        // Add click handler for user interaction fallback
        document.addEventListener('click', handleClick);
      }
    };

    // Set up video properties
    video.muted = muted;
    video.loop = loop;
    video.playsInline = playsInline;
    video.autoPlay = autoPlay;

    // Try to play the video
    playVideo();

    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, [autoPlay, muted, loop, playsInline]);

  const defaultStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    zIndex,
    pointerEvents,
    ...style
  };

  return (
    <video
      ref={videoRef}
      className={className}
      style={defaultStyle}
      src={videoSrc}
      autoPlay={autoPlay}
      muted={muted}
      loop={loop}
      playsInline={playsInline}
    />
  );
};

export default VideoBackground;
