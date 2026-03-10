const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

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
    return { raw: text || null };
  }
}

export async function getAdminCv(): Promise<CvItem | null> {
  let res: Response;

  try {
    res = await fetch(`${API_BASE}/api/cv/admin`, {
      credentials: "include",
      cache: "no-store",
    });
  } catch (error: any) {
    throw new Error(error?.message || "Network error while loading CV");
  }

  const data = await parseJsonSafe(res);

  if (res.status === 401) {
    throw new Error("UNAUTHORIZED");
  }

  if (!res.ok) {
    throw new Error(
      data?.message || data?.raw || `Failed to load CV (HTTP ${res.status})`
    );
  }

  return data;
}

export async function uploadCv(file: File) {
  const formData = new FormData();
  formData.append("cv", file);

  let res: Response;

  try {
    res = await fetch(`${API_BASE}/api/cv/admin`, {
      method: "POST",
      credentials: "include",
      body: formData,
    });
  } catch (error: any) {
    throw new Error(error?.message || "Network error while uploading CV");
  }

  const data = await parseJsonSafe(res);

  if (res.status === 401) {
    throw new Error("UNAUTHORIZED");
  }

  if (!res.ok) {
    throw new Error(
      data?.message || data?.raw || `Failed to upload CV (HTTP ${res.status})`
    );
  }

  return data;
}

export async function updateCv(id: string, file: File) {
  const formData = new FormData();
  formData.append("cv", file);

  let res: Response;

  try {
    res = await fetch(`${API_BASE}/api/cv/admin/${id}`, {
      method: "PUT",
      credentials: "include",
      body: formData,
    });
  } catch (error: any) {
    throw new Error(error?.message || "Network error while updating CV");
  }

  const data = await parseJsonSafe(res);

  if (res.status === 401) {
    throw new Error("UNAUTHORIZED");
  }

  if (!res.ok) {
    throw new Error(
      data?.message || data?.raw || `Failed to update CV (HTTP ${res.status})`
    );
  }

  return data;
}

export async function deleteCv(id: string) {
  let res: Response;

  try {
    res = await fetch(`${API_BASE}/api/cv/admin/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
  } catch (error: any) {
    throw new Error(error?.message || "Network error while deleting CV");
  }

  const data = await parseJsonSafe(res);

  if (res.status === 401) {
    throw new Error("UNAUTHORIZED");
  }

  if (!res.ok) {
    throw new Error(
      data?.message || data?.raw || `Failed to delete CV (HTTP ${res.status})`
    );
  }

  return data;
}

export function getPublicCvViewUrl() {
  return `${API_BASE}/api/cv/public/view`;
}

export function getPublicCvDownloadUrl() {
  return `${API_BASE}/api/cv/public/download`;
}