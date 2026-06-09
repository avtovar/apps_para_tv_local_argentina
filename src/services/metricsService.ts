export async function trackChannelView(userId: string | undefined, channelId: string, provinceId: string) {
  console.log(`[DEMO MODE] Tracking view: User ${userId || 'Guest'}, Channel ${channelId}, Province ${provinceId}`);
  // Skip actual Firebase calls in demo mode
  return Promise.resolve();
}
