import { YouTubeChannelInfo } from "@/types";

const API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
const BASE_URL = "https://www.googleapis.com/youtube/v3";

export function getYouTubeChannelId(url: string): string | null {
  const patterns = [
    /youtube\.com\/channel\/(UC[\w-]+)/,
    /youtube\.com\/@([\w-]+)/,
    /youtube\.com\/live\/([\w-]{11})/,
    /youtu\.be\/([\w-]{11})/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

export async function getYouTubeChannelInfo(url: string): Promise<YouTubeChannelInfo | null> {
  const identifier = getYouTubeChannelId(url);
  if (!identifier) return null;

  if (!API_KEY || API_KEY === "tu_youtube_api_key") {
    return getMockChannelInfo(identifier, url);
  }

  try {
    const isChannelId = identifier.startsWith("UC");
    const params = isChannelId
      ? `part=snippet&id=${identifier}&key=${API_KEY}`
      : `part=snippet&forHandle=${identifier}&key=${API_KEY}`;

    const response = await fetch(`${BASE_URL}/channels?${params}`);
    if (!response.ok) throw new Error("YouTube API error");

    const data = await response.json();
    if (!data.items?.[0]) return getMockChannelInfo(identifier, url);

    const item = data.items[0];
    return {
      channelId: item.id,
      title: item.snippet.title,
      thumbnailUrl: item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.default?.url || "",
      isLive: false,
    };
  } catch {
    return getMockChannelInfo(identifier, url);
  }
}

export async function checkLiveStatus(channelId: string): Promise<boolean> {
  if (!API_KEY || API_KEY === "tu_youtube_api_key") {
    return true;
  }

  try {
    const response = await fetch(
      `${BASE_URL}/search?part=snippet&channelId=${channelId}&eventType=live&type=video&key=${API_KEY}`
    );
    if (!response.ok) return false;
    const data = await response.json();
    return data.items?.length > 0;
  } catch {
    return true;
  }
}

export function getYouTubeEmbedUrl(url: string): string | null {
  const liveMatch = url.match(/youtube\.com\/live\/([\w-]{11})/);
  if (liveMatch) {
    return `https://www.youtube.com/embed/${liveMatch[1]}?autoplay=1&mute=0`;
  }

  const channelMatch = url.match(/youtube\.com\/@([\w-]+)/);
  if (channelMatch) {
    return `https://www.youtube.com/embed/live_stream?channel=${channelMatch[1]}&autoplay=1`;
  }

  return null;
}

function getMockChannelInfo(identifier: string, url: string): YouTubeChannelInfo {
  return {
    channelId: identifier,
    title: "",
    thumbnailUrl: "",
    isLive: true,
  };
}
