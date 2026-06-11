import { Channel, Province } from "@/types";
import sampleData from "../../skills/argentina-tv-manager/assets/sample_data.json";

type SampleData = {
  provinces: Province[];
  channels: Channel[];
};

interface TdtChannelOption {
  url?: string;
}

interface TdtChannel {
  name?: string;
  logo?: string;
  options?: TdtChannelOption[];
}

interface TdtAmbit {
  channels?: TdtChannel[];
}

interface TdtCountry {
  name?: string;
  ambits?: TdtAmbit[];
}

interface TdtResponse {
  countries?: TdtCountry[];
}

interface AlploxChannel {
  pais?: string;
  country?: string;
  url?: string;
  nombre?: string;
  name?: string;
  logo?: string;
  categoria?: string;
  category?: string;
}

type AlploxResponse = AlploxChannel[] | {
  canales?: AlploxChannel[];
  channels?: AlploxChannel[];
};

const TDT_CHANNELS_URL = "https://www.tdtchannels.com/lists/tv.json";
const ALPLOX_CHANNELS_URL = "https://raw.githubusercontent.com/Alplox/json-teles/refs/heads/main/canales.json";
const IPTVO_AR_URL = "https://iptv-org.github.io/iptv/countries/ar.m3u";
const MARCOFBB_URL = "https://raw.githubusercontent.com/marcofbb/argentina-iptv/master/argentina.m3u8";

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

/**
 * Basic M3U Parser
 */
function parseM3U(content: string, sourceId: string): Channel[] {
  const channels: Channel[] = [];
  const lines = content.split("\n");
  let currentChannel: Partial<Channel> = {};

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.startsWith("#EXTINF:")) {
      // Extract info: tvg-id, tvg-logo, group-title, name
      const nameMatch = line.match(/,(.+)$/);
      const logoMatch = line.match(/tvg-logo="([^"]+)"/);
      const groupMatch = line.match(/group-title="([^"]+)"/);
      
      const name = nameMatch ? nameMatch[1].trim() : "Unknown Channel";
      currentChannel = {
        id: `${sourceId}-${name.toLowerCase().replace(/\s+/g, '-')}`,
        name: name,
        logoUrl: logoMatch ? logoMatch[1] : undefined,
        category: groupMatch ? groupMatch[1] : "General",
        provinceId: "buenos-aires", // Default
        isFta: true
      };
    } else if (line.startsWith("http")) {
      currentChannel.streamUrl = line;
      if (currentChannel.name) {
        channels.push(currentChannel as Channel);
      }
      currentChannel = {};
    }
  }
  return channels;
}

export async function getProvinces(): Promise<Province[]> {
  return (sampleData as SampleData).provinces;
}

export async function getChannels(provinceId?: string): Promise<Channel[]> {
  const localChannels = (sampleData as SampleData).channels;
  
  // En este modo simplificado, solo devolvemos los canales locales (YouTube)
  // que el usuario ha solicitado específicamente.
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

/**
 * Get first fallback stream URL
 */
export function getFallbackStreamUrl(channelId: string): string | null {
  const urls = getFallbackStreamUrls(channelId);
  return urls.length > 0 ? urls[0] : null;
}
