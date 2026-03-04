import { PlatformStats } from "../models/PlatformStats";

function ghHeaders() {
  const token = process.env.GITHUB_TOKEN;

  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };

  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

export async function syncGitHubStats() {
  const username = process.env.GITHUB_USERNAME;
  if (!username) throw new Error("Missing GITHUB_USERNAME");

  const userRes = await fetch(`https://api.github.com/users/${username}`, {
    headers: ghHeaders(),
  });

  if (!userRes.ok) {
    throw new Error(`GitHub user fetch failed: ${await userRes.text()}`);
  }

  const user = await userRes.json();

  const data = {
    username: String(user.login || username),
    followers: Number(user.followers || 0),
    publicRepos: Number(user.public_repos || 0), // projects count
    profileUrl: String(user.html_url || `https://github.com/${username}`),
  };

  await PlatformStats.create({
    platform: "github",
    data,
    fetchedAt: new Date(),
  });

  return data;
}

export async function syncYouTubeStats() {
  const apiKey = process.env.YOUTUBE_API_KEY;
  const channelId = process.env.YOUTUBE_CHANNEL_ID;

  if (!apiKey) throw new Error("Missing YOUTUBE_API_KEY");
  if (!channelId) throw new Error("Missing YOUTUBE_CHANNEL_ID");

  const url =
    `https://www.googleapis.com/youtube/v3/channels` +
    `?part=statistics,snippet&id=${channelId}&key=${apiKey}`;

  const ytRes = await fetch(url);

  if (!ytRes.ok) {
    throw new Error(`YouTube fetch failed: ${await ytRes.text()}`);
  }

  const json = await ytRes.json();
  const item = json?.items?.[0];

  if (!item) throw new Error("YouTube channel not found (check channel id)");

  const stats = item.statistics || {};

  const data = {
    channelId: String(channelId),
    title: String(item.snippet?.title || "YouTube"),
    subscribers: Number(stats.subscriberCount || 0),
    videoCount: Number(stats.videoCount || 0),
    viewCount: Number(stats.viewCount || 0), // ✅ total channel views
  };

  await PlatformStats.create({
    platform: "youtube",
    data,
    fetchedAt: new Date(),
  });

  return data;
}

export async function syncAllPlatformStats() {
  const [github, youtube] = await Promise.all([syncGitHubStats(), syncYouTubeStats()]);
  return { github, youtube };
}