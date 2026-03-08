const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

export type CvItem = {
  _id: string;
  filename: string;
  contentType: string;
  size: number;
  uploadedAt: string;
  viewUrl: string;
  downloadUrl: string;
};

async function parseJsonSafe(res: Response) {
  const text = await res.text();
  try {
    return text ? JSON.parse(text) : null;
  } catch {
    return null;
  }
}

export async function getPublicCv(): Promise<CvItem | null> {
  const res = await fetch(`${API_BASE}/api/cv/public`, {
    cache: "no-store",
  });

  if (res.status === 404) return null;

  if (!res.ok) {
    const data = await parseJsonSafe(res);
    throw new Error(data?.message || "Failed to load CV");
  }

  return res.json();
}

export function getPublicCvViewUrl() {
  return `${API_BASE}/api/cv/public/view`;
}

export function getPublicCvDownloadUrl() {
  return `${API_BASE}/api/cv/public/download`;
}