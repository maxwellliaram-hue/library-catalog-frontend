import { Link, Route, Routes } from "react-router-dom";
import CatalogPage from "./pages/CatalogPage.jsx";
import BookDetailPage from "./pages/BookDetailPage.jsx";

export default function App() {
  return (
    <>
      <header className="site-header">
        <Link to="/" className="brand">Library Catalog</Link>
      </header>
      <main className="container">
        <Routes>
          <Route path="/" element={<CatalogPage />} />
          <Route path="/books/:id" element={<BookDetailPage />} />
          <Route
            path="*"
            element={
              <div className="state" role="alert">
                <h2>Page not found</h2>
                <Link to="/">Back to the catalog</Link>
              </div>
            }
          />
        </Routes>
      </main>
    </>
  );
}
