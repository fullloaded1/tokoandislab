/* Hallmark · component: ArticleLikeButton · genre: modern-minimal · 8-state-ui: pass */
"use client";

import { useState, useEffect, useCallback } from "react";
import { Heart } from "lucide-react";

const STORAGE_KEY = "liked_articles";

function getLikedSlugs(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function setLikedSlugs(slugs: string[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(slugs));
  } catch {
    // localStorage might be full or disabled
  }
}

interface ArticleLikeButtonProps {
  slug: string;
  initialLikeCount: number;
}

export default function ArticleLikeButton({
  slug,
  initialLikeCount,
}: ArticleLikeButtonProps) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    const slugs = getLikedSlugs();
    setLiked(slugs.includes(slug));
  }, [slug]);

  const handleToggle = useCallback(async () => {
    const wasLiked = liked;
    const newLiked = !wasLiked;

    // Optimistic update
    setLiked(newLiked);
    setLikeCount((c) => (newLiked ? c + 1 : Math.max(0, c - 1)));
    setAnimating(true);
    setTimeout(() => setAnimating(false), 600);

    // Update localStorage
    const slugs = getLikedSlugs();
    if (newLiked) {
      setLikedSlugs([...slugs, slug]);
    } else {
      setLikedSlugs(slugs.filter((s) => s !== slug));
    }

    // Sync with API
    try {
      const res = await fetch(`/api/articles/${slug}/like`, {
        method: newLiked ? "POST" : "DELETE",
      });
      if (res.ok) {
        const data = await res.json();
        setLikeCount(data.likeCount);
      }
    } catch {
      // Revert on error
      setLiked(wasLiked);
      setLikeCount((c) => (wasLiked ? c + 1 : Math.max(0, c - 1)));
      const revertSlugs = getLikedSlugs();
      if (wasLiked) {
        setLikedSlugs([...revertSlugs, slug]);
      } else {
        setLikedSlugs(revertSlugs.filter((s) => s !== slug));
      }
    }
  }, [liked, slug]);

  return (
    <button
      onClick={handleToggle}
      className={`
        group/like inline-flex items-center gap-2 rounded-2xl px-5 py-2.5
        text-sm font-bold transition-all duration-200 ease-[var(--ease-out)]
        focus-visible:outline-2 focus-visible:outline-[var(--color-focus)] active:scale-[0.98]
        ${
          liked
            ? "bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 shadow-sm"
            : "bg-slate-50 text-slate-500 border border-slate-200 hover:bg-slate-100 hover:text-slate-700"
        }
      `}
      aria-label={liked ? "Unlike artikel ini" : "Like artikel ini"}
      id="article-like-btn"
    >
      <Heart
        className={`
          h-4 w-4 transition-all duration-300
          ${liked ? "fill-red-500 text-red-500" : "fill-none text-slate-400 group-hover/like:text-red-400"}
          ${animating ? "scale-125" : "scale-100"}
        `}
      />
      <span>{likeCount}</span>
    </button>
  );
}
