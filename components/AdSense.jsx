'use client';
import { useEffect, useRef } from 'react';

const CLIENT = 'ca-pub-6608561249557105';

/**
 * Reusable manual AdSense slot. The project currently uses Auto Ads, so a slot
 * is rendered only when a real AdSense data-ad-slot is supplied.
 */
export function AdSenseSlot({ slot, className = '', format = 'auto', responsive = true }) {
  const ref = useRef(null);
  useEffect(() => {
    if (!slot || !ref.current || ref.current.dataset.adsInitialized === 'true') return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      ref.current.dataset.adsInitialized = 'true';
    } catch (error) {
      if (process.env.NODE_ENV !== 'production') console.debug('AdSense slot waiting for Google:', error?.message);
    }
  }, [slot]);
  if (!slot) return null;
  return <ins ref={ref} className={`adsbygoogle ${className}`} style={{ display: 'block' }} data-ad-client={CLIENT} data-ad-slot={slot} data-ad-format={format} data-full-width-responsive={responsive ? 'true' : 'false'} />;
}
