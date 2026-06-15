import { describe, it, expect } from 'vitest';
import { getChannelSchedule } from '../epgService';

describe('getChannelSchedule', () => {
  it('returns mock schedule in demo mode', async () => {
    const programs = await getChannelSchedule('tv-publica');
    expect(Array.isArray(programs)).toBe(true);
    expect(programs.length).toBeGreaterThan(0);
  });

  it('each program has title and start/end times', async () => {
    const programs = await getChannelSchedule('tv-publica');
    for (const p of programs) {
      expect(p).toHaveProperty('title');
      expect(p).toHaveProperty('start');
      expect(p).toHaveProperty('end');
    }
  });
});
