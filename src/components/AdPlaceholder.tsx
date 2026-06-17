import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

interface Props {
  id?: string;
  slot?: string; // ad unit slot ID — optional; omit to use auto-ads
}

export default function AdPlaceholder({ id, slot }: Props) {
  const pushed = useRef(false);

  useEffect(() => {
    if (pushed.current) return;
    pushed.current = true;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // AdSense not loaded (dev mode)
    }
  }, []);

  return (
    <div id={id} className="w-full overflow-hidden">
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-5115666613619890"
        {...(slot ? { 'data-ad-slot': slot } : { 'data-ad-format': 'auto', 'data-full-width-responsive': 'true' })}
      />
    </div>
  );
}
