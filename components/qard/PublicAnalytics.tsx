"use client";

import { useEffect } from "react";

type EventType = "profile_view" | "link_click" | "contact_download";

function track(slug: string, eventType: EventType, socialLinkId?: string) {
  const body = JSON.stringify({ slug, eventType, socialLinkId });
  if (navigator.sendBeacon) {
    navigator.sendBeacon(
      "/api/analytics",
      new Blob([body], { type: "application/json" }),
    );
    return;
  }
  void fetch("/api/analytics", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body,
    keepalive: true,
  });
}

export function PublicAnalytics({ slug }: { slug: string }) {
  useEffect(() => {
    track(slug, "profile_view");
    const click = (event: MouseEvent) => {
      const anchor = (event.target as HTMLElement).closest<HTMLAnchorElement>(
        "a",
      );
      if (!anchor) return;
      const linkId = anchor.dataset.qardLinkId;
      if (linkId) track(slug, "link_click", linkId);
      if (anchor.dataset.qardContact === "true")
        track(slug, "contact_download");
    };
    document.addEventListener("click", click);
    return () => document.removeEventListener("click", click);
  }, [slug]);

  return null;
}
