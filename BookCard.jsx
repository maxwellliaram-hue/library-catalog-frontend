import { Link } from "react-router-dom";
import Cover from "./Cover.jsx";
import { coverOf, genreName } from "../api.js";

export default function BookCard({ book }) {
  return (
    <Link to={`/books/${book.id}`} className="card">
      <Cover src={coverOf(book)} title={book.title} />
      <div className="card-body">
        <h3 className="card-title">{book.title}</h3>
        <p className="card-author">{book.author}</p>
        {book.genre && <span className="pill">{genreName(book.genre)}</span>}
      </div>
    </Link>
  );
}
