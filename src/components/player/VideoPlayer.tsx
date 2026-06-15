"use client";

import React, { useEffect, useRef, useState } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import { AlertCircle, Play } from 'lucide-react';
import { logger } from '@/lib/logger';

type VideoJsPlayer = ReturnType<typeof videojs>;

interface VideoPlayerProps {
  src: string;
  poster?: string;
  autoplay?: boolean;
  controls?: boolean;
  onError?: () => void;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ src, poster, autoplay = true, controls = true, onError }) => {
  const videoRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<VideoJsPlayer | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasPlayed, setHasPlayed] = useState(false);
  const errorCountRef = useRef(0);

  useEffect(() => {
    let cancelled = false;

    void Promise.resolve().then(() => {
      if (cancelled) {
        return;
      }

      setError(null);
      setIsLoading(true);
      setHasPlayed(false);
      errorCountRef.current = 0;
    });

    // Make sure Video.js player is only initialized once
    if (!playerRef.current) {
      const videoElement = document.createElement("video-js");
      videoElement.classList.add('vjs-big-play-centered');
      videoRef.current?.appendChild(videoElement);

      const player = playerRef.current = videojs(videoElement, {
        autoplay: false,
        controls,
        responsive: true,
        fluid: true,
        poster,
        inactivityTimeout: 3000,
        playbackRates: [0.5, 1, 1.5, 2],
        controlBar: {
          skipButtons: {
            forward: 10,
            backward: 10
          }
        },
        html5: {
          hls: {
            overrideNative: true,
            enableLowInitialPlaylist: true,
            smoothQualityChange: true,
            forceSyncInterval: 0,
            lowInitialPlaylistSize: 3,
            bandwidth: 3000000
          },
          nativeControlsForTouch: true
        },
        sources: [{
          src,
          type: 'application/x-mpegURL'
        }]
      }, () => {
        logger.log('player is ready for', src);
      });

      // Track loadstart
      player.on('loadstart', () => {
        setIsLoading(true);
        setError(null);
      });

      // Handle canplay - stream is ready
      player.on('canplay', () => {
        setIsLoading(false);
        setError(null);
        if (autoplay && playerRef.current) {
          void Promise.resolve(playerRef.current.play()).catch((playError: unknown) => logger.log('Autoplay prevented:', playError));
        }
      });

      // Handle play
      player.on('play', () => {
        setError(null);
        setIsLoading(false);
        setHasPlayed(true);
      });

      // Handle duration change
      player.on('durationchange', () => {
        if (!hasPlayed && autoplay && playerRef.current) {
          void Promise.resolve(playerRef.current.play()).catch((playError: unknown) => logger.log('Play prevented:', playError));
        }
      });

      // Robust error handling
      player.on('error', () => {
        errorCountRef.current++;
        const errorCode = player.error();
        if (errorCode) {
          logger.error(`Video.js Error (${errorCountRef.current}):`, errorCode.code, errorCode.message);
          
          // First error? Show message and trigger fallback
          if (errorCountRef.current === 1) {
            setIsLoading(false);
            setError('No se pudo cargar el stream. Usando fuente alternativa...');
            onError?.();
          } else {
            // Repeated errors
            setError('El stream no está disponible en este momento');
            setIsLoading(false);
          }
        }
      });

      player.on('timeupdate', () => {
        setIsLoading(false);
      });

    } else {
      const player = playerRef.current;
      player.src({ src, type: 'application/x-mpegURL' });
    }

    return () => {
      cancelled = true;

      // Cleanup when src changes
      if (playerRef.current) {
        errorCountRef.current = 0;
      }
    };
  }, [src, autoplay, hasPlayed, controls, poster, onError]);

  // Dispose the player on unmount
  useEffect(() => {
    return () => {
      const player = playerRef.current;
      if (player && !player.isDisposed()) {
        player.dispose();
        playerRef.current = null;
      }
    };
  }, []);

  const handleManualPlay = () => {
    if (playerRef.current) {
      void Promise.resolve(playerRef.current.play()).catch((playError: unknown) => logger.log('Play prevented:', playError));
    }
  };

  return (
    <div className="w-full aspect-video rounded-lg overflow-hidden border-2 border-transparent focus-within:border-blue-500 relative bg-black">
      {error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 z-50">
          <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
          <p className="text-white text-center px-4 text-sm font-medium">{error}</p>
          {!isLoading && (
            <button
              onClick={handleManualPlay}
              className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white text-sm font-semibold flex items-center gap-2 transition-colors"
            >
              <Play className="w-4 h-4 fill-current" />
              Reintentar
            </button>
          )}
        </div>
      )}
      {isLoading && !hasPlayed && !error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 z-40">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-3"></div>
          <p className="text-gray-300 text-sm">Conectando...</p>
        </div>
      )}
      <div data-vjs-player className="w-full h-full">
        <div ref={videoRef} className="w-full h-full" />
      </div>
    </div>
  );
};
