"use client";

import React from 'react';

interface YouTubePlayerProps {
  embedUrl: string;
}

export const YouTubePlayer: React.FC<YouTubePlayerProps> = ({ embedUrl }) => {
  return (
    <div className="w-full aspect-video rounded-lg overflow-hidden border-2 border-transparent focus-within:border-red-500">
      <iframe
        src={embedUrl}
        className="w-full h-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        sandbox="allow-same-origin allow-scripts allow-presentation"
      />
    </div>
  );
};
