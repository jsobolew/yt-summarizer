export function validateYouTubeUrl(url: string): boolean {
  if (!url) return false;
  
  // Common YouTube URL patterns
  const patterns = [
    /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/,
    /^(https?:\/\/)?(www\.)?youtube\.com\/watch\?v=[\w-]+(&\S*)?$/,
    /^(https?:\/\/)?(www\.)?youtu\.be\/[\w-]+(\?\S*)?$/
  ];
  
  return patterns.some(pattern => pattern.test(url));
}

export function extractVideoId(url: string): string | null {
  if (!url) return null;
  
  // Extract video ID from YouTube URL
  let match;
  
  // youtu.be/VIDEO_ID
  match = url.match(/(?:youtu\.be\/|youtube\.com\/shorts\/)([^?/]+)/);
  if (match) return match[1];
  
  // youtube.com/watch?v=VIDEO_ID
  match = url.match(/[?&]v=([^?&]+)/);
  if (match) return match[1];
  
  // youtube.com/embed/VIDEO_ID
  match = url.match(/youtube\.com\/embed\/([^?/]+)/);
  if (match) return match[1];
  
  return null;
}