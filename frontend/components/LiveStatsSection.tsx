import StatCard from "./statCard";

type StatsResponse = {
  github: null | {
    username: string;
    followers: number;
    publicRepos: number;
    profileUrl: string;
  };
  youtube: null | {
    channelId: string;
    title: string;
    subscribers: number;
    videoCount: number;
    viewCount: number;
    channelUrl?: string;
  };
  fetchedAt: { github: string | null; youtube: string | null };
};

type Props = {
  stats: StatsResponse | null;
};

export default function LiveStatsSection({ stats }: Props) {
  const github = stats?.github ?? null;
  const youtube = stats?.youtube ?? null;

  const youtubeLink =
    youtube?.channelUrl ||
    (youtube?.channelId
      ? `https://www.youtube.com/channel/${youtube.channelId}`
      : undefined);

  return (
    <section className="space-y-5">
      <h2 className="text-xl font-semibold text-white">Live Stats</h2>

      <div className="grid gap-6 md:grid-cols-2">
        <StatCard
          title="GitHub"
          subtitle={github?.username ? `@${github.username}` : "Not available"}
          link={github?.profileUrl}
          items={[
            { label: "Projects", value: github?.publicRepos ?? 0 },
            { label: "Followers", value: github?.followers ?? 0 },
            { label: "Status", value: github ? "Live" : "N/A" },
          ]}
        />

        <StatCard
          title="YouTube"
          subtitle={youtube?.title || "Not available"}
          link={youtubeLink}
          items={[
            { label: "Subscribers", value: youtube?.subscribers ?? 0 },
            { label: "Videos", value: youtube?.videoCount ?? 0 },
            { label: "Views", value: youtube?.viewCount ?? 0 },
          ]}
        />
      </div>
    </section>
  );
}