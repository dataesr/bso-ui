import { useEffect, useState } from 'react';

const useScroll = () => {
  const [scrollY, setScrollY] = useState(0);
  const [scrollingDown, setScrollingDown] = useState(false);
  const [scrollTop, setScrollTop] = useState(0);

  useEffect(() => {
    const onScroll = (e) => {
      const scrollTopDocument = e.target.documentElement.scrollTop;
      setScrollTop(scrollTopDocument);
      setScrollingDown(scrollTopDocument > scrollTop);
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', onScroll);

    return () => window.removeEventListener('scroll', onScroll);
  }, [scrollY, scrollingDown, scrollTop]);

  return { scrollY, scrollTop, scrollingDown };
};
export default useScroll;
