import { useEffect, useState } from "react";
import { apiGet, genreName } from "../api.js";

export default function GenreFilter({ value, onChange }) {
  const [genres, setGenres] = useState([]);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    const controller = new AbortController();
    apiGet("/genres", {}, controller.signal)
      .then((data) => {
        const list = Array.isArray(data) ? data : data?.data ?? data?.genres ?? [];
        setGenres(list.map(genreName).filter(Boolean));
        setStatus("ready");
      })
      .catch((err) => err.name !== "AbortError" && setStatus("error"));
    return () => controller.abort();
  }, []);

  if (status === "loading") return <p className="muted" aria-live="polite">Loading genres…</p>;
  if (status === "error") return <p className="inline-error" role="alert">Couldn't load genres. You can still search.</p>;
  if (!genres.length) return <p className="muted">No genres available.</p>;

  return (
    <div className="pills" role="group" aria-label="Filter by genre">
      <button type="button" className={`pill-btn ${!value ? "active" : ""}`} aria-pressed={!value} onClick={() => onChange("")}>
        All
      </button>
      {genres.map((g) => (
        <button key={g} type="button" className={`pill-btn ${value === g ? "active" : ""}`} aria-pressed={value === g} onClick={() => onChange(g)}>
          {g}
        </button>
      ))}
    </div>
  );
}
