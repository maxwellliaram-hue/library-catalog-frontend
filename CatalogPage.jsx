import { useSearchParams } from "react-router-dom";
import BookCard from "../components/BookCard.jsx";
import GenreFilter from "../components/GenreFilter.jsx";
import SearchBar from "../components/SearchBar.jsx";
import { Empty, ErrorMessage, Loading } from "../components/StateMessage.jsx";
import useBooks, { PAGE_SIZE } from "../hooks/useBooks.js";

export default function CatalogPage() {
  // Filter, search and page all live in the URL so they combine and survive refresh/back.
  const [params, setParams] = useSearchParams();
  const search = params.get("search") || "";
  const genre = params.get("genre") || "";
  const page = Math.max(1, parseInt(params.get("page") || "1", 10) || 1);

  const { books, total, status, error, retry } = useBooks({ search, genre, page });

  const update = (changes) => {
    const next = new URLSearchParams(params);
    Object.entries(changes).forEach(([k, v]) => (v ? next.set(k, v) : next.delete(k)));
    if (!("page" in changes)) next.delete("page"); // any filter change resets to page 1
    setParams(next);
  };

  const hasNext = total != null ? page * PAGE_SIZE < total : books.length === PAGE_SIZE;
  const hasFilters = search || genre;

  return (
    <>
      <h1 className="page-title">Find your next read</h1>
      <div className="toolbar">
        <SearchBar value={search} onSearch={(s) => update({ search: s })} />
        <GenreFilter value={genre} onChange={(g) => update({ genre: g })} />
      </div>

      {status === "loading" && <Loading label="Loading books…" />}
      {status === "error" && <ErrorMessage title="Couldn't load books" message={error} onRetry={retry} />}
      {status === "empty" && (
        <Empty
          title="No books found"
          message={hasFilters ? "Nothing matches your current search and filter. Try different words or another genre." : "The catalog is empty right now."}
          action={hasFilters && <button type="button" className="btn" onClick={() => setParams({})}>Clear search and filters</button>}
        />
      )}

      {status === "success" && (
        <>
          <div className="grid">{books.map((b) => <BookCard key={b.id} book={b} />)}</div>
          {(page > 1 || hasNext) && (
            <nav className="pager" aria-label="Pagination">
              <button type="button" className="btn" disabled={page <= 1} onClick={() => update({ page: String(page - 1) })}>Previous</button>
              <span>Page {page}</span>
              <button type="button" className="btn" disabled={!hasNext} onClick={() => update({ page: String(page + 1) })}>Next</button>
            </nav>
          )}
        </>
      )}
    </>
  );
}
