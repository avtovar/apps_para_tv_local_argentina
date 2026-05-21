import { Program } from "@/types";

const API_KEY = process.env.NEXT_PUBLIC_TVPLAN_API_KEY;
const BASE_URL = "https://tv-plan.org/api/v1";

export async function getChannelSchedule(channelId: string): Promise<Program[]> {
  if (!API_KEY || API_KEY === "tu_api_key_aqui") {
    // Return mock data for Demo Mode
    return getMockSchedule(channelId);
  }

  try {
    const response = await fetch(`${BASE_URL}/schedule?api_key=${API_KEY}&channel=${channelId}&country=AR`);
    if (!response.ok) throw new Error("Failed to fetch EPG");
    const data = await response.json();
    return data.programs; // Adjust based on real API response structure
  } catch (error) {
    console.error("EPG Fetch Error:", error);
    return getMockSchedule(channelId);
  }
}

function getMockSchedule(channelId: string): Program[] {
  const now = new Date();
  const hour = now.getHours();
  
  return [
    {
      title: `Noticiero de las ${hour}:00`,
      start: new Date(now.setMinutes(0)).toISOString(),
      end: new Date(now.setMinutes(60)).toISOString(),
      description: "Las noticias más importantes de Argentina y el mundo.",
      category: "Noticias"
    },
    {
      title: "Magazine de la Tarde",
      start: new Date(now.setMinutes(60)).toISOString(),
      end: new Date(now.setMinutes(120)).toISOString(),
      description: "Entrevistas, cocina y entretenimiento.",
      category: "Entretenimiento"
    }
  ];
}
