import { Channel, Province } from "@/types";
import sampleData from "../../skills/argentina-tv-manager/assets/sample_data.json";

const TDT_CHANNELS_URL = "https://www.tdtchannels.com/lists/tv.json";
const ALPLOX_CHANNELS_URL = "https://raw.githubusercontent.com/Alplox/json-teles/refs/heads/main/canales.json";

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
  return sampleData.provinces as Province[];
}

export async function getChannels(provinceId?: string): Promise<Channel[]> {
  const localChannels = sampleData.channels as Channel[];
  let externalChannels: Channel[] = [];
  
  try {
    const [tdtRes, alploxRes] = await Promise.allSettled([
      fetch(TDT_CHANNELS_URL, { signal: AbortSignal.timeout(5000) }).then(r => r.json()),
      fetch(ALPLOX_CHANNELS_URL, { signal: AbortSignal.timeout(5000) }).then(r => r.json())
    ]);

    // Process TDTChannels
    if (tdtRes.status === 'fulfilled' && tdtRes.value && tdtRes.value.countries) {
      try {
        const argentinaAmbit = tdtRes.value.countries.find((c: any) => c.name === "Argentina");
        if (argentinaAmbit && argentinaAmbit.ambits) {
          argentinaAmbit.ambits.forEach((ambit: any) => {
            if (ambit.channels) {
              ambit.channels.forEach((chan: any) => {
                if (chan.name && chan.options?.[0]?.url) {
                  externalChannels.push({
                    id: `tdt-${chan.name.toLowerCase().replace(/\s+/g, '-')}`,
                    provinceId: "buenos-aires",
                    name: chan.name,
                    streamUrl: chan.options[0].url,
                    logoUrl: chan.logo,
                    category: "General",
                    isFta: true
                  });
                }
              });
            }
          });
        }
      } catch (err) {
        console.warn("Error processing TDTChannels:", err);
      }
    }

    // Process Alplox with robust check
    if (alploxRes.status === 'fulfilled' && alploxRes.value) {
      try {
        const alploxData = alploxRes.value;
        const channelsArray = Array.isArray(alploxData) 
          ? alploxData 
          : (alploxData.canales || alploxData.channels || []);

        if (Array.isArray(channelsArray)) {
          const arChannels = channelsArray.filter((c: any) => 
            c && (c.pais === "Argentina" || c.country === "Argentina") && c.url
          );
          arChannels.forEach((chan: any) => {
            const channelName = chan.nombre || chan.name || 'unknown';
            externalChannels.push({
              id: `alplox-${channelName.toLowerCase().replace(/\s+/g, '-')}`,
              provinceId: "buenos-aires",
              name: channelName,
              streamUrl: chan.url,
              logoUrl: chan.logo,
              category: chan.categoria || chan.category || "General",
              isFta: true
            });
          });
        }
      } catch (err) {
        console.warn("Error processing Alplox data:", err);
      }
    }

    // Combine local and external channels, removing duplicates
    const channelMap = new Map<string, Channel>();
    
    // Add local channels first (they have priority)
    localChannels.forEach(ch => {
      channelMap.set(ch.id, ch);
    });
    
    // Add external channels only if they don't already exist
    externalChannels.forEach(ch => {
      if (!channelMap.has(ch.id)) {
        channelMap.set(ch.id, ch);
      }
    });

    let allChannels = Array.from(channelMap.values());
    
    if (provinceId) {
      return allChannels.filter(c => c.provinceId === provinceId);
    }
    return allChannels;
  } catch (error) {
    console.error("Error aggregating channels:", error);
    return localChannels;
  }
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
