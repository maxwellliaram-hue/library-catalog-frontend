import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Cover from "../components/Cover.jsx";
import { ErrorMessage, Loading } from "../components/StateMessage.jsx";
import { apiGet, coverOf, genreName } from "../api.js";

export default function BookDetailPage() {
  const { id } = useParams();
  const [state, setState] = useState({ status: "loading", book: null, error: "" });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setState({ status: "loading", book: null, error: "" });
    apiGet(`/books/${encodeURIComponent(id)}`, {}, controller.signal)
      .then((data) => {
        const book = data?.book ?? data?.data ?? data;
        if (!book || typeof book !== "object" || Array.isArray(book) || !book.title) {
          setState({ status: "notfound", book: null, error: "" });
        } else {
          setState({ status: "success", book, error: "" });
        }
      })
      .catch((err) => {
        if (err.name === "AbortError") return;
        setState({ status: err.status === 404 || err.status === 400 ? "notfound" : "error", book: null, error: err.message });
      });
    return () => controller.abort();
  }, [id, attempt]);

  if (state.status === "loading") return <Loading label="Loading book…" />;
  if (state.status === "notfound")
    return (
      <div className="state" role="alert">
        <h2>Book not found</h2>
        <p>We couldn't find a book with that ID. It may have been removed.</p>
        <Link to="/" className="btn">Browse the catalog</Link>
      </div>
    );
  if (state.status === "error")
    return <ErrorMessage title="Couldn't load this book" message={state.error} onRetry={() => setAttempt((n) => n + 1)} />;

  const b = state.book;
  const details = [
    ["Author", b.author],
    ["Genre", genreName(b.genre)],
    ["Year", b.year ?? b.publishedYear ?? b.published_year],
    ["ISBN", b.isbn],
    ["Availability", b.availableCopies === undefined ? null : `${b.availableCopies} of ${b.totalCopies} copies available`],
  ].filter(([, v]) => v !== undefined && v !== null && v !== "");

  return (
    <article className="detail">
      <div className="detail-top"><Link to="/" className="back">← Back to catalog</Link></div>
      <Cover src={coverOf(b)} title={b.title} className="detail-cover" />
      <div>
        <h1 className="detail-title">{b.title}</h1>
        <dl className="facts">
          {details.map(([k, v]) => (
            <div key={k}><dt>{k}</dt><dd>{v}</dd></div>
          ))}
        </dl>
        {(b.description || b.summary) && <p className="desc">{b.description || b.summary}</p>}
      </div>
    </article>
  );
}
