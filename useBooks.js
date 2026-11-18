import { useEffect, useState } from "react";
import { apiGet, normalizeList } from "../api.js";

export const PAGE_SIZE = 12;

/**
 * Fetches GET /books with the current filters.
 * Returns { books, total, status, error, retry } where
 * status is "loading" | "error" | "empty" | "success".
 */
export default function useBooks({ search, genre, page }) {
  const [state, setState] = useState({ books: [], total: null, status: "loading", error: "" });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setState((s) => ({ ...s, status: "loading", error: "" }));

    apiGet("/books", { search, genre, page, limit: PAGE_SIZE }, controller.signal)
      .then((payload) => {
        const { items, total } = normalizeList(payload);
        setState({ books: items, total, status: items.length ? "success" : "empty", error: "" });
      })
      .catch((err) => {
        if (err.name === "AbortError") return; // superseded by a newer request
        setState({ books: [], total: null, status: "error", error: err.message });
      });

    return () => controller.abort();
  }, [search, genre, page, attempt]);

  return { ...state, retry: () => setAttempt((n) => n + 1) };
}
