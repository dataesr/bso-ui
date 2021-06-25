import { useEffect, useRef, useState } from 'react';

function useIntersectionObserver(ref, options = {}, forward = true) {
  const [element, setElement] = useState(null);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const observer = useRef(null);

  const cleanOb = () => {
    if (observer.current) {
      observer.current.disconnect();
    }
  };

  useEffect(() => {
    setElement(ref.current);
  }, [ref]);

  useEffect(() => {
    if (!element) return;
    cleanOb();

    const ob = new IntersectionObserver(
      ([entry]) => {
        const isElementIntersecting = entry.isIntersecting;
        if (!forward) {
          setIsIntersecting(isElementIntersecting);
        } else if (forward && !isIntersecting && isElementIntersecting) {
          setIsIntersecting(isElementIntersecting);
          cleanOb();
        }
      },
      { ...options },
    );

    ob.observe(element);

    // TODO check need return
    // return () => {
    cleanOb();
    // };
  }, [element, options, isIntersecting, setIsIntersecting, forward]);

  return isIntersecting;
}

export default useIntersectionObserver;
