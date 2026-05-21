# Firestore Schema: Argentina TV

## Collection: `provinces`
- `id` (string): Slug (e.g., "buenos-aires").
- `name` (string): Full name (e.g., "Buenos Aires").
- `logoUrl` (string): URL to the province shield or logo.

## Collection: `channels`
- `id` (string): Unique slug (e.g., "tv-publica").
- `provinceId` (string): Reference to the province ID.
- `name` (string): Channel name.
- `streamUrl` (string): M3U8 stream URL.
- `logoUrl` (string): Channel logo.
- `category` (string): "News", "General", "Sports", etc.
- `isFta` (boolean): True if Free To Air.

## Collection: `metrics`
- `userId` (string): User identifier.
- `channelId` (string): Viewed channel.
- `timestamp` (serverTimestamp).
- `duration` (number): Minutes viewed.
