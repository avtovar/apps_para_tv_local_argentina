"use client";

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Channel } from '@/types';
import { getChannels } from '@/services/tvService';
import { useAuth } from '@/hooks/useAuth';
import { useDPadNavigation } from '@/hooks/useDPadNavigation';
import { YouTubePlayer } from '@/components/player/YouTubePlayer';
import { VideoPlayer } from '@/components/player/VideoPlayer';
import { getYouTubeEmbedUrl } from '@/services/youtubeService';
import { YouTubeIcon } from '@/components/YouTubeIcon';
import { Tv, Radio } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function ChannelExplorer() {
  const { loading: authLoading } = useAuth();
  const { register, focusedId, focusElement } = useDPadNavigation();
  
  const [channels, setChannels] = useState<Channel[]>([]);
  const [currentChannel, setCurrentChannel] = useState<Channel | null>(null);
  const [loading, setLoading] = useState(true);

  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function init() {
      try {
        const chans = await getChannels();
        setChannels(chans);
        if (chans.length > 0) {
          const firstChan = chans[0];
          setCurrentChannel(firstChan);
          // Small timeout to ensure element is registered
          setTimeout(() => focusElement(`chan-${firstChan.id}`), 100);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, [focusElement]);

  const youtubeEmbedUrl = currentChannel?.youtubeUrl
    ? getYouTubeEmbedUrl(currentChannel.youtubeUrl)
    : null;

  const isHlsStream = !!currentChannel?.streamUrl;

  if (loading || authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-white">
        <div className="animate-pulse flex flex-col items-center">
          <Tv className="w-12 h-12 mb-4 text-blue-500" />
          <p className="text-xl font-medium">Cargando Argentina TV...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-black text-white overflow-hidden">
      {/* Sidebar: Guía de Canales */}
      <aside className="w-72 border-r border-gray-800 bg-gray-950 flex flex-col shrink-0">
        <div className="p-6 flex-1 overflow-y-auto" ref={sidebarRef}>
          <h1 className="text-xl font-bold flex items-center gap-2 mb-8">
            <Tv className="text-blue-500" /> Guía de Canales
          </h1>
          
          <nav className="space-y-2">
            {channels.map((channel) => (
              <button
                key={channel.id}
                ref={(el) => register(`side-chan-${channel.id}`, el, 'sidebar')}
                onClick={() => setCurrentChannel(channel)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all focus:outline-none ring-blue-500 text-left",
                  focusedId === `side-chan-${channel.id}` ? "ring-4 bg-gray-800" : "",
                  currentChannel?.id === channel.id ? "bg-blue-600/20 border border-blue-500/50" : "text-gray-400 hover:bg-gray-900"
                )}
              >
                <div className="relative w-10 h-10 shrink-0 bg-gray-900 rounded-md overflow-hidden border border-gray-800">
                  {channel.logoUrl ? (
                    <Image
                      src={channel.logoUrl}
                      alt={channel.name}
                      fill
                      className="object-contain p-1"
                      unoptimized
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-700">
                      <Tv className="w-5 h-5" />
                    </div>
                  )}
                </div>
                <div className="overflow-hidden">
                  <p className={cn(
                    "font-bold text-sm truncate",
                    currentChannel?.id === channel.id ? "text-white" : ""
                  )}>
                    {channel.name}
                  </p>
                  <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">
                    {channel.category}
                  </p>
                </div>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-4 border-t border-gray-800 bg-gray-900/50">
          <p className="text-xs text-gray-500 text-center">Argentina TV Live v1.0</p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden bg-black">
        {/* Player Section: Ahora ocupa todo el espacio disponible */}
        <section className="flex-1 p-4 lg:p-6 flex flex-col gap-6 items-stretch justify-center overflow-hidden">
          {currentChannel ? (
            <div className="flex-1 flex flex-col gap-4 min-h-0">
              <div 
                className="flex-1 bg-black rounded-2xl shadow-2xl overflow-hidden ring-1 ring-gray-800 focus:outline-none focus:ring-4 focus:ring-blue-500 relative"
                tabIndex={0}
                ref={(el) => register('player-container', el, 'player')}
              >
                {isHlsStream ? (
                  <VideoPlayer src={currentChannel.streamUrl!} />
                ) : youtubeEmbedUrl ? (
                  <YouTubePlayer embedUrl={youtubeEmbedUrl} />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <p className="text-gray-500 font-medium">Stream no disponible</p>
                  </div>
                )}
              </div>
              
              {/* Info Bar debajo del reproductor */}
              <div className="flex items-center justify-between px-2 shrink-0">
                <div className="flex items-center gap-4">
                  <h2 className="text-2xl font-bold truncate">{currentChannel.name}</h2>
                  {isHlsStream ? (
                    <span className="inline-flex items-center gap-1.5 text-[10px] text-blue-400 font-bold px-2 py-1 bg-blue-500/10 border border-blue-500/20 rounded-md uppercase tracking-wider">
                      <Radio className="w-3 h-3" />
                      Directo
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-[10px] text-red-400 font-bold px-2 py-1 bg-red-500/10 border border-red-500/20 rounded-md uppercase tracking-wider">
                      <YouTubeIcon className="w-3 h-3" />
                      YouTube
                    </span>
                  )}
                </div>
                <p className="text-blue-500 font-bold text-sm">{currentChannel.category}</p>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-gray-950 rounded-2xl border border-dashed border-gray-800 m-4">
              <div className="text-center">
                <Tv className="w-16 h-16 text-gray-800 mx-auto mb-4" />
                <p className="text-gray-500 font-medium">Selecciona un canal de la guía lateral</p>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
