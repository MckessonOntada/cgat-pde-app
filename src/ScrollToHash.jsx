import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToHash = () => {
  const { hash } = useLocation();

  useEffect(() => {
    if (!hash) return;

    const id = hash.slice(1);
    let rafId;

    const scrollWhenReady = () => {
      const el = document.getElementById(id);

      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        rafId = requestAnimationFrame(scrollWhenReady);
      }
    };

    scrollWhenReady();

    return () => cancelAnimationFrame(rafId);
  }, [hash]);

  return null;
};

export default ScrollToHash;
