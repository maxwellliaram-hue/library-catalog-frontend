# Library Catalog Frontend

React (Vite) patron-facing app for the library catalog API: browse, filter by genre, debounced search, and book detail pages.

## Demo

> **Add your recording here** (Loom link, or commit a `demo.gif` and embed it):
> `![Demo](./demo.gif)` or `[Watch the demo](https://www.loom.com/share/...)`
>
> Show: browse → filter by genre → search → open a detail page.

## Setup

Prerequisites: Node 18+ and the `library-catalog-service` API running locally (with the Week 4 API additions: `GET /api/books/:id`, `GET /api/genres`, `?search=`/`?genre=`/`?page=` on `GET /api/books`, and CORS).

```bash
npm install
cp .env.example .env     # VITE_API_URL=http://localhost:3000/api
npm run dev              # http://localhost:5173
npm run build            # production build
```

Your API must allow CORS from `http://localhost:5173`.

## API contract used

| Call | Used by |
|------|---------|
| `GET /api/books?search=&genre=&page=&limit=` | `useBooks` / `CatalogPage` |
| `GET /api/books/:id` | `BookDetailPage` |
| `GET /api/genres` | `GenreFilter` |

Books come back as `{ books, total, page, limit }`, a single book as `{ book }`, and genres as `{ genres: [{ name, slug }] }`. The cover is read from `coverImage`. Parsing lives in `src/api.js`.

## Design decisions

- **Genre filtering is server-side** via the API's `?genre=` param. Fetching the whole catalog to filter in the browser would not scale and would break pagination. Genre, search and page all live in the URL query string, so they combine (`?genre=Fantasy&search=dragon`), survive refresh, and work with the back button. Changing search or genre resets to page 1.
- **Search is debounced at 400 ms** (`SearchBar` + `useDebounce`): typing updates local state instantly, but the `?search=` param (and therefore the request) only changes after the user pauses. In-flight requests are aborted when a newer one starts (`AbortController` in `useBooks`), so stale responses never overwrite newer ones.
- **Responsive grid** uses CSS Grid `auto-fill` with `minmax`, so columns reflow smoothly from 2 on phones to 5+ on wide desktops. The detail page stacks on mobile and goes two-column at 800px+.
- **Loading / error / empty states** are handled for the catalog, the genre list and the detail page. Errors offer a retry; the empty state offers "Clear search and filters".
- **Bad ids** on the detail page (404/400 or an empty body) show a "Book not found" screen with a link back to the catalog. Unknown routes show a 404 page.

## Structure

```
src/
  api.js                     fetch helper + response normalizers
  components/ BookCard, GenreFilter, SearchBar, Cover, StateMessage
  hooks/      useBooks, useDebounce
  pages/      CatalogPage, BookDetailPage
```
