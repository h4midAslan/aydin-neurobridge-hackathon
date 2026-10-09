export type UsageProfile = {
  social_media_gb: number;
  tiktok_gb: number;
  instagram_gb: number;
  video_streaming_gb: number;
  youtube_gb: number;
  netflix_gb: number;
  communication_gb: number;
  whatsapp_gb: number;
  collaboration_gb: number;
  teams_gb: number;
  ai_apps_gb: number;
  chatgpt_gb: number;
  claude_gb: number;
  gemini_gb: number;
  gaming_gb: number;
};

export function demoUsageProfile(): UsageProfile {
  return {
    social_media_gb: 2.1,
    tiktok_gb: 0.9,
    instagram_gb: 0.8,
    video_streaming_gb: 3.4,
    youtube_gb: 2.0,
    netflix_gb: 1.1,
    communication_gb: 1.6,
    whatsapp_gb: 1.4,
    collaboration_gb: 1.2,
    teams_gb: 0.9,
    ai_apps_gb: 16.5,
    chatgpt_gb: 7.8,
    claude_gb: 6.2,
    gemini_gb: 1.9,
    gaming_gb: 0.4,
  };
}
