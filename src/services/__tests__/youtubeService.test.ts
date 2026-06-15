import { describe, it, expect } from 'vitest';
import { getYouTubeChannelId, getYouTubeEmbedUrl } from '../youtubeService';

describe('getYouTubeChannelId', () => {
  it('extracts channel ID from /channel/ URL', () => {
    expect(getYouTubeChannelId('https://youtube.com/channel/UCabc123')).toBe('UCabc123');
  });

  it('extracts handle from /@ URL', () => {
    expect(getYouTubeChannelId('https://youtube.com/@tvpublica')).toBe('tvpublica');
  });

  it('extracts video ID from /live/ URL', () => {
    expect(getYouTubeChannelId('https://youtube.com/live/ABCdef12345')).toBe('ABCdef12345');
  });

  it('extracts video ID from youtu.be URL', () => {
    expect(getYouTubeChannelId('https://youtu.be/ABCdef12345')).toBe('ABCdef12345');
  });

  it('returns null for invalid URL', () => {
    expect(getYouTubeChannelId('https://example.com')).toBeNull();
  });

  it('returns null for empty string', () => {
    expect(getYouTubeChannelId('')).toBeNull();
  });
});

describe('getYouTubeEmbedUrl', () => {
  it('returns embed URL for /live/ URL', () => {
    expect(getYouTubeEmbedUrl('https://youtube.com/live/ABCdef12345')).toBe(
      'https://www.youtube.com/embed/ABCdef12345?autoplay=1&mute=0'
    );
  });

  it('returns embed URL for @ handle URL', () => {
    expect(getYouTubeEmbedUrl('https://youtube.com/@tvpublica')).toBe(
      'https://www.youtube.com/embed/live_stream?channel=tvpublica&autoplay=1'
    );
  });

  it('returns null for unknown URL pattern', () => {
    expect(getYouTubeEmbedUrl('https://youtube.com/channel/UCabc')).toBeNull();
  });
});
