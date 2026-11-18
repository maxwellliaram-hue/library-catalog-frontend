const BASE = (import.meta.env.VITE_API_URL || "http://localhost:3000/api").replace(/\/$/, "");

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

export async function apiGet(path, params = {}, signal) {
  const url = new URL(BASE + path);
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") url.searchParams.set(k, v);
  });
  let res;
  try {
    res = await fetch(url, { signal });
  } catch (err) {
    if (err.name === "AbortError") throw err;
    throw new ApiError("Could not reach the server. Check your connection and try again.", 0);
  }
  if (!res.ok) throw new ApiError(`The server responded with an error (${res.status}).`, res.status);
  return res.json();
}

// The API shape may vary: accept a bare array or { data | items | books, total }.
export function normalizeList(payload) {
  if (Array.isArray(payload)) return { items: payload, total: null };
  const items = payload?.data ?? payload?.items ?? payload?.books ?? [];
  return { items, total: payload?.total ?? payload?.count ?? null };
}

export const coverOf = (b) => b?.coverUrl ?? b?.cover_url ?? b?.cover ?? b?.coverImage ?? b?.image ?? "";
export const genreName = (g) => (typeof g === "string" ? g : g?.name ?? g?.genre ?? "");
