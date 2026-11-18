import { useState } from "react";

export default function Cover({ src, title, className = "" }) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) {
    return (
      <div className={`cover cover--placeholder ${className}`} role="img" aria-label={`No cover for ${title}`}>
        <span>{title}</span>
      </div>
    );
  }
  return (
    <img className={`cover ${className}`} src={src} alt={`Cover of ${title}`} loading="lazy" onError={() => setFailed(true)} />
  );
}
