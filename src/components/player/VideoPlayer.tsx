"use client";

import React, { useEffect, useRef } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';

interface VideoPlayerProps {
  src: string;
  poster?: string;
  autoplay?: boolean;
  controls?: boolean;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ src, poster, autoplay = true, controls = true }) => {
  const videoRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<any>(null);

  useEffect(() => {
    // Make sure Video.js player is only initialized once
    if (!playerRef.current) {
      const videoElement = document.createElement("video-js");
      videoElement.classList.add('vjs-big-play-centered');
      videoRef.current?.appendChild(videoElement);

      const player = playerRef.current = videojs(videoElement, {
        autoplay,
        controls,
        responsive: true,
        fluid: true,
        poster,
        sources: [{
          src,
          type: 'application/x-mpegURL'
        }]
      }, () => {
        console.log('player is ready');
      });
    } else {
      const player = playerRef.current;
      player.autoplay(autoplay);
      player.src({ src, type: 'application/x-mpegURL' });
    }
  }, [src, videoRef]);

  // Dispose the player on unmount
  useEffect(() => {
    const player = playerRef.current;
    return () => {
      if (player && !player.isDisposed()) {
        player.dispose();
        playerRef.current = null;
      }
    };
  }, [playerRef]);

  return (
    <div data-vjs-player className="w-full aspect-video rounded-lg overflow-hidden border-2 border-transparent focus-within:border-blue-500">
      <div ref={videoRef} />
    </div>
  );
};
