import { describe, it, expect } from 'vitest';
import { getChannels, getProvinces, getFallbackStreamUrls } from '../tvService';

describe('getProvinces', () => {
  it('returns an array of provinces', async () => {
    const provinces = await getProvinces();
    expect(Array.isArray(provinces)).toBe(true);
    expect(provinces.length).toBeGreaterThan(0);
  });

  it('each province has id and name', async () => {
    const provinces = await getProvinces();
    for (const p of provinces) {
      expect(p).toHaveProperty('id');
      expect(p).toHaveProperty('name');
    }
  });
});

describe('getChannels', () => {
  it('returns all channels when no provinceId', async () => {
    const channels = await getChannels();
    expect(Array.isArray(channels)).toBe(true);
    expect(channels.length).toBeGreaterThan(0);
  });

  it('each channel has required fields', async () => {
    const channels = await getChannels();
    for (const c of channels) {
      expect(c).toHaveProperty('id');
      expect(c).toHaveProperty('name');
      expect(c).toHaveProperty('provinceId');
      expect(c).toHaveProperty('category');
    }
  });

  it('filters channels by provinceId', async () => {
    const channels = await getChannels();
    if (channels.length > 0) {
      const provinceId = channels[0].provinceId;
      const filtered = await getChannels(provinceId);
      expect(filtered.every(c => c.provinceId === provinceId)).toBe(true);
    }
  });
});

describe('getFallbackStreamUrls', () => {
  it('returns array for known channel', () => {
    const urls = getFallbackStreamUrls('tv-publica');
    expect(Array.isArray(urls)).toBe(true);
    expect(urls.length).toBeGreaterThan(0);
  });

  it('returns empty array for unknown channel', () => {
    const urls = getFallbackStreamUrls('non-existent');
    expect(urls).toEqual([]);
  });
});
