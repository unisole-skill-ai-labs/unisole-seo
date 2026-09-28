import { useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useLayoutEffect(() => {
    // Disable smooth scroll on documentElement during route transition so it snaps cleanly to top
    const root = document.documentElement;
    const originalBehavior = root.style.scrollBehavior;
    root.style.scrollBehavior = 'auto';

    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant' as ScrollBehavior,
    });

    const timer = setTimeout(() => {
      root.style.scrollBehavior = originalBehavior;
    }, 50);

    return () => {
      clearTimeout(timer);
      root.style.scrollBehavior = originalBehavior;
    };
  }, [pathname]);

  return null;
}

