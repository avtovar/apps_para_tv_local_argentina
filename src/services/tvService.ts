import { Channel, Province } from "@/types";
import sampleData from "../../skills/argentina-tv-manager/assets/sample_data.json";

const TDT_CHANNELS_URL = "https://www.tdtchannels.com/lists/tv.json";
const ALPLOX_CHANNELS_URL = "https://raw.githubusercontent.com/Alplox/json-teles/refs/heads/main/canales.json";

export async function getProvinces(): Promise<Province[]> {
  return sampleData.provinces as Province[];
}

export async function getChannels(provinceId?: string): Promise<Channel[]> {
  const localChannels = sampleData.channels as Channel[];
  let externalChannels: Channel[] = [];
  
  try {
    const [tdtRes, alploxRes] = await Promise.allSettled([
      fetch(TDT_CHANNELS_URL).then(r => r.json()),
      fetch(ALPLOX_CHANNELS_URL).then(r => r.json())
    ]);

    // Process TDTChannels
    if (tdtRes.status === 'fulfilled' && tdtRes.value && tdtRes.value.countries) {
      const argentinaAmbit = tdtRes.value.countries.find((c: any) => c.name === "Argentina");
      if (argentinaAmbit && argentinaAmbit.ambits) {
        argentinaAmbit.ambits.forEach((ambit: any) => {
          if (ambit.channels) {
            ambit.channels.forEach((chan: any) => {
              externalChannels.push({
                id: `tdt-${chan.name.toLowerCase().replace(/\s+/g, '-')}`,
                provinceId: "buenos-aires",
                name: chan.name,
                streamUrl: chan.options[0]?.url || "",
                logoUrl: chan.logo,
                category: "General",
                isFta: true
              });
            });
          }
        });
      }
    }

    // Process Alplox with robust check
    if (alploxRes.status === 'fulfilled' && alploxRes.value) {
      const alploxData = alploxRes.value;
      // Handle cases where data might be an object with a key or a direct array
      const channelsArray = Array.isArray(alploxData) 
        ? alploxData 
        : (alploxData.canales || alploxData.channels || []);

      if (Array.isArray(channelsArray)) {
        const arChannels = channelsArray.filter((c: any) => c && (c.pais === "Argentina" || c.country === "Argentina"));
        arChannels.forEach((chan: any) => {
          externalChannels.push({
            id: `alplox-${(chan.nombre || chan.name || 'unknown').toLowerCase().replace(/\s+/g, '-')}`,
            provinceId: "buenos-aires",
            name: chan.nombre || chan.name,
            streamUrl: chan.url,
            logoUrl: chan.logo,
            category: chan.categoria || chan.category || "General",
            isFta: true
          });
        });
      }
    }

    const allChannels = [...localChannels, ...externalChannels];
    
    if (provinceId) {
      return allChannels.filter(c => c.provinceId === provinceId);
    }
    return allChannels;
  } catch (error) {
    console.error("Error aggregating channels:", error);
    return localChannels; // Fallback to local data if everything fails
  }
}
