export const runtime = "nodejs";

type Repo = {
  fork: boolean;
  archived: boolean;
  size: number;
  languages_url: string;
};

type LanguagesResponse = Record<string, number>;

type OutItem = {
  lang: string;
  bytes: number;
  pct: number;
};

function chunk<T>(arr: T[], size: number) {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

async function gh<T>(url: string): Promise<T> {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };

  // Token required for /user/repos (private + public)
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  const res = await fetch(url, {
    headers,
    next: { revalidate: 60 * 60 }, // cache 1 hour
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GitHub API error ${res.status}: ${text}`);
  }

  return (await res.json()) as T;
}

export async function GET(): Promise<Response> {
  try {
    const user = process.env.GITHUB_USER;
    const token = process.env.GITHUB_TOKEN;

    if (!user) {
      return Response.json({ error: "Missing GITHUB_USER" }, { status: 500 });
    }
    if (!token) {
      return Response.json(
        { error: "Missing GITHUB_TOKEN (required for private repos)" },
        { status: 500 }
      );
    }

    // 1) Fetch ALL repos for the authenticated user (public + private)
    const perPage = 100;
    let page = 1;
    const repos: Repo[] = [];

    while (true) {
      const batch = await gh<Repo[]>(
        `https://api.github.com/user/repos?per_page=${perPage}&page=${page}&sort=updated&visibility=all&affiliation=owner,collaborator,organization_member`
      );

      repos.push(...batch);
      if (batch.length < perPage) break;

      page += 1;
      if (page > 10) break; // safety (max 1000 repos)
    }

    // 2) filter forks/archived/empty
    const filtered = repos.filter((r) => !r.fork && !r.archived && r.size > 0);

    // 3) sum languages across repos
    const totals: Record<string, number> = {};

    // concurrency batch size (avoid hammering GitHub)
    const BATCH = 10;
    const repoBatches = chunk(filtered, BATCH);

    for (const repoGroup of repoBatches) {
      const results = await Promise.allSettled(
        repoGroup.map((r) => gh<LanguagesResponse>(r.languages_url))
      );

      for (const r of results) {
        if (r.status !== "fulfilled") continue;
        const langs = r.value;

        for (const [lang, bytes] of Object.entries(langs)) {
          totals[lang] = (totals[lang] || 0) + (Number(bytes) || 0);
        }
      }
    }

    // 4) percentages
    const totalBytes = Object.values(totals).reduce((a, b) => a + b, 0);

    const items: OutItem[] = Object.entries(totals)
      .map(([lang, bytes]) => ({
        lang,
        bytes,
        pct: totalBytes ? (bytes / totalBytes) * 100 : 0,
      }))
      .sort((a, b) => b.pct - a.pct);

    return Response.json({ user, totalBytes, items });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return Response.json({ error: msg }, { status: 500 });
  }
}