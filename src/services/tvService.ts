import { Channel, Province } from "@/types";
import sampleData from "../../skills/argentina-tv-manager/assets/sample_data.json";

type SampleData = {
  provinces: Province[];
  channels: Channel[];
};

// Fallback streams con YouTube embeds como opción principal
const FALLBACK_STREAMS: Record<string, string[]> = {
  "tv-publica": [
    "https://manifest.googlevideo.com/api/manifest/hls_variant/Mnxjc1RkVEFVUkxybUI4d0dmN0pzVmpKVDAwTT0vL3czLnlvdXR1YmUuY29tL3Jh=",
    "https://www.youtube.com/watch?v=5qap5aO4i9A"
  ],
  "a24": [
    "https://manifest.googlevideo.com/api/manifest/hls_variant/Mnxjc1RkVEFVUkxybUI4d0dmN0pzVmpKVDAwTT0vL3czLnlvdXR1YmUuY29tL3Jh=",
    "https://www.youtube.com/live/ArKbAx1K-2U"
  ],
  "c5n": [
    "https://manifest.googlevideo.com/api/manifest/hls_variant/Mnxjc1RkVEFVUkxybUI4d0dmN0pzVmpKVDAwTT0vL3czLnlvdXR1YmUuY29tL3Jh=",
    "https://www.youtube.com/live/VWhQ6xspnSc"
  ]
};

export async function getProvinces(): Promise<Province[]> {
  return (sampleData as SampleData).provinces;
}

export async function getChannels(provinceId?: string): Promise<Channel[]> {
  const localChannels = (sampleData as SampleData).channels;
  
  if (provinceId) {
    return localChannels.filter(c => c.provinceId === provinceId);
  }
  return localChannels;
}

/**
 * Get fallback stream URLs for a channel (in priority order)
 * Returns array of alternative streams to try
 */
export function getFallbackStreamUrls(channelId: string): string[] {
  return FALLBACK_STREAMS[channelId] || [];
}


