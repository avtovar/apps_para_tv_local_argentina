export interface Province {
  id: string;
  name: string;
  logoUrl?: string;
}

export interface Program {
  title: string;
  start: string; // ISO String
  end: string;   // ISO String
  description?: string;
  category?: string;
}

export interface EPGData {
  channelId: string;
  programs: Program[];
}

export interface Channel {
  id: string;
  provinceId: string;
  name: string;
  streamUrl: string;
  logoUrl?: string;
  category: string;
  isFta: boolean;
  currentProgram?: Program;
}

export interface UserMetric {
  userId: string;
  channelId: string;
  timestamp: any;
  duration: number;
}
