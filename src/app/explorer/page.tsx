"use client";

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Province, Channel, Program } from '@/types';
import { getProvinces, getChannels } from '@/services/tvService';
import { getChannelSchedule } from '@/services/epgService';
import { useAuth } from '@/hooks/useAuth';
import { useDPadNavigation } from '@/hooks/useDPadNavigation';
import { YouTubePlayer } from '@/components/player/YouTubePlayer';
import { VideoPlayer } from '@/components/player/VideoPlayer';
import { getYouTubeEmbedUrl } from '@/services/youtubeService';
import { YouTubeIcon } from '@/components/YouTubeIcon';
import { Tv, MapPin, ChevronRight, Play, LogOut, Radio } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function ChannelExplorer() {
  const { loading: authLoading, logout } = useAuth();
  const { register, focusedId, setFocusedId } = useDPadNavigation();
  
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [schedule, setSchedule] = useState<Program[]>([]);
  const [selectedProvince, setSelectedProvince] = useState<string | null>(null);
  const [currentChannel, setCurrentChannel] = useState<Channel | null>(null);
  const [loading, setLoading] = useState(true);

  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function init() {
      try {
        const provs = await getProvinces();
        setProvinces(provs);
        const chans = await getChannels();
        setChannels(chans);
        if (chans.length > 0) {
          const firstChan = chans[0];
          setCurrentChannel(firstChan);
          setFocusedId(`chan-${firstChan.id}`);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, [setFocusedId]);

  useEffect(() => {
    async function fetchSchedule() {
      if (currentChannel) {
        const data = await getChannelSchedule(currentChannel.id);
        setSchedule(data);
      }
    }
    fetchSchedule();
  }, [currentChannel]);

  const filteredChannels = selectedProvince 
    ? channels.filter(c => c.provinceId === selectedProvince)
    : channels;

  const currentProgram = schedule[0];
  const nextProgram = schedule[1];

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
      {/* Sidebar: Provincias */}
      <aside className="w-64 border-r border-gray-800 bg-gray-950 flex flex-col shrink-0">
        <div className="p-6 flex-1 overflow-y-auto" ref={sidebarRef}>
          <h1 className="text-xl font-bold flex items-center gap-2 mb-8">
            <Tv className="text-blue-500" /> Argentina TV
          </h1>
          
          <nav className="space-y-2">
            <button
              ref={(el) => register('prov-all', el)}
              onClick={() => setSelectedProvince(null)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all focus:outline-none ring-blue-500",
                focusedId === 'prov-all' ? "ring-4 bg-gray-800" : "",
                !selectedProvince ? "bg-blue-600 text-white" : "text-gray-400 hover:bg-gray-900"
              )}
            >
              <MapPin className="w-4 h-4" />
              <span>Todas</span>
            </button>
            
            {provinces.map((prov) => (
              <button
                key={prov.id}
                ref={(el) => register(`prov-${prov.id}`, el)}
                onClick={() => setSelectedProvince(prov.id)}
                className={cn(
                  "w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all focus:outline-none ring-blue-500",
                  focusedId === `prov-${prov.id}` ? "ring-4 bg-gray-800" : "",
                  selectedProvince === prov.id ? "bg-blue-600 text-white" : "text-gray-400 hover:bg-gray-900"
                )}
              >
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4" />
                  <span>{prov.name}</span>
                </div>
                <ChevronRight className="w-4 h-4 opacity-50" />
              </button>
            ))}
          </nav>
        </div>

        <div className="p-4 border-t border-gray-800 bg-gray-900/50">
          <button
            ref={(el) => register('btn-logout', el)}
            onClick={() => logout()}
            className={cn(
              "w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-colors focus:outline-none ring-red-500",
              focusedId === 'btn-logout' ? "ring-4 bg-red-500/20" : ""
            )}
          >
            <LogOut className="w-4 h-4" />
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Player Section */}
        <section className="bg-gray-900 p-4 lg:p-8 flex flex-col lg:flex-row gap-8 items-start justify-center shrink-0">
          {currentChannel ? (
            <>
              <div className="w-full lg:w-2/3 flex flex-col gap-2">
                <div className="aspect-video bg-black rounded-xl shadow-2xl overflow-hidden ring-1 ring-gray-800">
                  {isHlsStream ? (
                    <VideoPlayer src={currentChannel.streamUrl!} />
                  ) : youtubeEmbedUrl ? (
                    <YouTubePlayer embedUrl={youtubeEmbedUrl} />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <p className="text-gray-500">Stream no disponible</p>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {isHlsStream ? (
                    <span className="inline-flex items-center gap-1 text-xs text-blue-400 font-semibold px-3 py-1.5 bg-gray-800 rounded-lg">
                      <Radio className="w-3.5 h-3.5" />
                      Stream Directo
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs text-red-400 font-semibold px-3 py-1.5 bg-gray-800 rounded-lg">
                      <YouTubeIcon className="w-3.5 h-3.5" />
                      Vía YouTube
                    </span>
                  )}
                </div>
              </div>
              
              <div className="w-full lg:w-1/3 flex flex-col gap-4">
                <div className="p-6 bg-gray-950 rounded-xl border border-gray-800 h-full">
                  <h2 className="text-2xl font-bold mb-1 truncate">{currentChannel.name}</h2>
                  <p className="text-blue-500 font-medium mb-4">{currentChannel.category}</p>
                  
                  {currentProgram && (
                    <div className="mb-4 p-4 bg-blue-600/10 border border-blue-500/30 rounded-lg">
                      <div className="flex items-center gap-2 text-blue-400 text-xs font-bold uppercase mb-2">
                        <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
                        En Vivo
                      </div>
                      <h3 className="text-lg font-bold line-clamp-1">{currentProgram.title}</h3>
                      <p className="text-gray-400 text-sm mt-1 line-clamp-2">{currentProgram.description}</p>
                    </div>
                  )}

                  {nextProgram && (
                    <div className="opacity-60">
                      <h4 className="text-gray-500 text-xs font-bold uppercase mb-2">Siguiente</h4>
                      <h5 className="font-semibold text-sm truncate">{nextProgram.title}</h5>
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="w-full h-64 bg-gray-950 flex items-center justify-center rounded-xl border border-dashed border-gray-700">
              <p className="text-gray-500">Selecciona un canal</p>
            </div>
          )}
        </section>

        {/* Channel Grid */}
        <section className="flex-1 overflow-y-auto p-6 bg-black">
          <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
            {selectedProvince ? provinces.find(p => p.id === selectedProvince)?.name : "Todos los Canales"}
            <span className="text-xs font-normal text-gray-500 bg-gray-900 px-2 py-1 rounded">
              {filteredChannels.length} canales
            </span>
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4 pb-20">
            {filteredChannels.map((channel) => (
              <button
                key={channel.id}
                ref={(el) => register(`chan-${channel.id}`, el)}
                onClick={() => setCurrentChannel(channel)}
                className={cn(
                  "group relative aspect-square bg-gray-900 rounded-lg overflow-hidden border-2 transition-all focus:outline-none hover:scale-105",
                  focusedId === `chan-${channel.id}` ? "ring-4 ring-blue-500 border-blue-500 scale-110 z-10" : "border-transparent",
                  currentChannel?.id === channel.id ? "bg-blue-900/30" : ""
                )}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-10" />
                
                {channel.logoUrl ? (
                  <Image
                    src={channel.logoUrl}
                    alt={channel.name}
                    fill
                    sizes="(max-width: 1024px) 50vw, 16vw"
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-5xl opacity-20">
                    <Tv />
                  </div>
                )}
                
                <div className="absolute top-2 right-2 z-20">
                  {channel.streamUrl ? (
                    <Radio className="w-4 h-4 text-blue-500 drop-shadow-lg" />
                  ) : (
                    <YouTubeIcon className="w-4 h-4 text-red-500 drop-shadow-lg" />
                  )}
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-3 z-20 text-left">
                  <p className="font-bold text-sm truncate leading-tight">{channel.name}</p>
                  <p className="text-xs text-gray-300 truncate">{channel.category}</p>
                </div>

                <div className={cn(
                  "absolute inset-0 flex items-center justify-center z-30 transition-all",
                  focusedId === `chan-${channel.id}` ? "opacity-100" : "opacity-0"
                )}>
                  <div className="bg-blue-600 rounded-full p-3 shadow-lg scale-110">
                    <Play className="w-6 h-6 fill-current" />
                  </div>
                </div>
              </button>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
