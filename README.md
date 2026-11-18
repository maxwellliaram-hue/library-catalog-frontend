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

## Week 5: reading list, auth and booking

- **Reading list persistence: `localStorage`**, not backend sync. The API has no reading-list endpoint, the list is a per-browser convenience that doesn't need to follow the patron between devices, and it works for logged-out visitors too. `ReadingListContext` (Context + `useReducer`) loads from `localStorage` on startup and writes back on every change, with try/catch for corrupted JSON or blocked storage. Only a small snapshot of each book (id, title, author, genre, cover) is stored. Trade-off: the list doesn't sync across devices; a backend sync would be the next step if that matters.
- **Auth uses the API's httpOnly cookie.** Every request sends `credentials: "include"`, and the API must allow the frontend origin with CORS `credentials: true`. `AuthContext` calls `GET /api/users/profile` on load to restore the session, and `login`/`register`/`logout` update state immediately, so protected routes unlock without a page reload. The API's register endpoint doesn't log the user in, so the app logs in right after a successful registration.
- **Errors are shown in the forms:** wrong password (401), duplicate username/email (409), validation messages and network failures.
- **`ProtectedRoute`** guards `/booking` at the route level (typing the URL while logged out redirects to `/login`, remembering the destination so login sends you back). While the session check is running it shows a loading state instead of flashing the login page.
- **Booking form** keeps space, date, start and end time in local state, validates them (end after start) and shows the captured values. There's no API call yet. The space list is a placeholder until a spaces endpoint exists.

## Structure

```
src/
  api.js                     fetch helpers (cookie credentials) + normalizers
  context/    AuthContext, ReadingListContext
  components/ BookCard, BookingForm, GenreFilter, ProtectedRoute, ReadingListButton, SearchBar, Cover, StateMessage
  hooks/      useBooks, useDebounce, useReadingList
  pages/      CatalogPage, BookDetailPage, LoginPage, RegisterPage, ReadingListPage, BookingPage
```
