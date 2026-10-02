'use client';

import Script from 'next/script';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useRef } from 'react';

declare global {
  interface Window {
    snaptr?: (command: string, event: string, data?: Record<string, unknown>) => void;
  }
}

export default function SnapchatPixel() {
  const pathname = usePathname();
  const lastPath = useRef<string | null>(null);
  const trackPageView = useCallback(() => {
    if (!pathname || !window.snaptr || lastPath.current === pathname) return;
    window.snaptr('track', 'PAGE_VIEW');
    lastPath.current = pathname;
  }, [pathname]);

  useEffect(() => {
    trackPageView();
  }, [trackPageView]);

  return (
    <Script
      id="snapchat-pixel"
      strategy="afterInteractive"
      onReady={trackPageView}
      dangerouslySetInnerHTML={{
        __html: `(function(e,t,n){if(e.snaptr)return;var a=e.snaptr=function(){a.handleRequest?a.handleRequest.apply(a,arguments):a.queue.push(arguments)};a.queue=[];var s='script',r=t.createElement(s);r.async=!0;r.src=n;var u=t.getElementsByTagName(s)[0];u.parentNode.insertBefore(r,u);})(window,document,'https://sc-static.net/scevent.min.js');snaptr('init','b1332f62-8968-4e0d-a4a1-767e4b121ed3',{});`,
      }}
    />
  );
}
