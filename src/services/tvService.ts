import { Channel, Province } from "@/types";
import sampleData from "../../skills/argentina-tv-manager/assets/sample_data.json";

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
  return sampleData.provinces as Province[];
}

export async function getChannels(provinceId?: string): Promise<Channel[]> {
  const localChannels = sampleData.channels as Channel[];
  let externalChannels: Channel[] = [];
  
  try {
    const [tdtRes, alploxRes, iptvRes, marcoRes] = await Promise.allSettled([
      fetch(TDT_CHANNELS_URL, { signal: AbortSignal.timeout(5000) }).then(r => r.json()),
      fetch(ALPLOX_CHANNELS_URL, { signal: AbortSignal.timeout(5000) }).then(r => r.json()),
      fetch(IPTVO_AR_URL, { signal: AbortSignal.timeout(5000) }).then(r => r.text()),
      fetch(MARCOFBB_URL, { signal: AbortSignal.timeout(5000) }).then(r => r.text())
    ]);

    // Process TDTChannels
    if (tdtRes.status === 'fulfilled' && tdtRes.value && tdtRes.value.countries) {
      // ... (keeping existing TDT logic)
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

    // Process Alplox
    if (alploxRes.status === 'fulfilled' && alploxRes.value) {
      // ... (keeping existing Alplox logic)
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

    // Process M3U Sources
    if (iptvRes.status === 'fulfilled') {
      externalChannels.push(...parseM3U(iptvRes.value, "iptv-org"));
    }
    if (marcoRes.status === 'fulfilled') {
      externalChannels.push(...parseM3U(marcoRes.value, "marcofbb"));
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
