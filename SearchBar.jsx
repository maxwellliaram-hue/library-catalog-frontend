import { useEffect, useRef, useState } from "react";
import useDebounce from "../hooks/useDebounce.js";

const DELAY = 400; // ms

export default function SearchBar({ value, onSearch }) {
  const [text, setText] = useState(value);
  const debounced = useDebounce(text, DELAY);
  const latestValue = useRef(value);
  latestValue.current = value;

  // Push the debounced text up only after the user pauses typing.
  useEffect(() => {
    const trimmed = debounced.trim();
    if (trimmed !== latestValue.current) onSearch(trimmed);
  }, [debounced]); // eslint-disable-line react-hooks/exhaustive-deps

  // Keep the box in sync if the URL changes externally (e.g. "Clear filters", back button).
  useEffect(() => {
    if (value !== text.trim()) setText(value);
  }, [value]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="search">
      <label htmlFor="search" className="sr-only">Search by title or author</label>
      <input
        id="search"
        type="search"
        placeholder="Search by title or author"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
    </div>
  );
}
