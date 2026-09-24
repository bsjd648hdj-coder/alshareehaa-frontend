'use client';

import Script from 'next/script';

export default function SnapchatPixel() {
  return (
    <Script
      id="snapchat-pixel"
      strategy="lazyOnload"
      dangerouslySetInnerHTML={{
        __html: `(function(e,t,n){if(e.snaptr)return;var a=e.snaptr=function(){a.handleRequest?a.handleRequest.apply(a,arguments):a.queue.push(arguments)};a.queue=[];var s='script',r=t.createElement(s);r.async=!0;r.src=n;var u=t.getElementsByTagName(s)[0];u.parentNode.insertBefore(r,u);})(window,document,'https://sc-static.net/scevent.min.js');snaptr('init','3c5a4326-d616-4185-97fa-17ff702018f6',{});snaptr('init','70a03153-424c-47f0-a28e-aac9c6e02227',{});snaptr('track','PAGE_VIEW');`,
      }}
    />
  );
}
