
import { useState, useEffect, useRef } from 'react';

export const useReveal = () => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Lower threshold for mobile to ensure animations trigger as soon as they enter viewport
    const threshold = typeof window !== 'undefined' && window.innerWidth < 768 ? 0.05 : 0.1;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { 
        threshold,
        rootMargin: '0px 0px -50px 0px' // Offset to trigger slightly before coming into view
      }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return { ref, className: `reveal-on-scroll ${isVisible ? 'visible' : ''}` };
};
