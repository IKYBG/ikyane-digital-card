'use client';

import { useEffect, useRef } from 'react';

type EventType = 'profile_view' | 'link_click' | 'contact_download';

function track(slug: string, eventType: EventType, socialLinkId?: string) {
  const source =
    new URLSearchParams(window.location.search).get('via') === 'qr'
      ? 'qr'
      : undefined;
  const body = JSON.stringify({ slug, eventType, socialLinkId, source });
  if (navigator.sendBeacon) {
    const sent = navigator.sendBeacon(
      '/api/analytics',
      new Blob([body], { type: 'application/json' }),
    );
    if (sent) return;
  }
  void fetch('/api/analytics', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body,
    keepalive: true,
  }).catch(() => undefined);
}

export function PublicAnalytics({ slug }: { slug: string }) {
  const viewed = useRef('');
  useEffect(() => {
    if (viewed.current !== slug) {
      track(slug, 'profile_view');
      viewed.current = slug;
    }
    const click = (event: MouseEvent) => {
      const anchor = (event.target as HTMLElement).closest<HTMLAnchorElement>(
        'a',
      );
      if (!anchor) return;
      const linkId = anchor.dataset.qardLinkId;
      if (linkId || anchor.dataset.qardAction === 'true')
        track(slug, 'link_click', linkId);
      if (anchor.dataset.qardContact === 'true')
        track(slug, 'contact_download');
    };
    document.addEventListener('click', click);
    return () => document.removeEventListener('click', click);
  }, [slug]);

  return null;
}
