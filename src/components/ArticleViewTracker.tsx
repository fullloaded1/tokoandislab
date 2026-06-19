"use client";

import { useEffect, useRef } from "react";

/**
 * Fires a single POST to /api/articles/{slug}/view on mount.
 * Renders nothing — purely a side-effect component.
 */
export default function ArticleViewTracker({ slug }: { slug: string }) {
  const hasFired = useRef(false);

  useEffect(() => {
    if (hasFired.current) return;
    hasFired.current = true;

    fetch(`/api/articles/${slug}/view`, { method: "POST" }).catch(() => {
      // silently ignore – view tracking is best-effort
    });
  }, [slug]);

  return null;
}
