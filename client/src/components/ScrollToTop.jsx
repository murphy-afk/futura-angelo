import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

// Returns the viewport to the top whenever the visitor moves to another page,
// so a route that opens below the fold never starts mid scroll. A direct load
// is left alone: the browser already restores or starts the position, and a
// deep link with a hash must still reach its anchor. Only the pathname is
// watched, so the skip link to #contenuto keeps working.

export default function ScrollToTop() {
  const location = useLocation();
  const firstRender = useRef(true);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return undefined;
    }

    window.scrollTo(0, 0);
    return undefined;
  }, [location.pathname]);

  return null;
}
