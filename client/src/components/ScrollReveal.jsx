import React, { useEffect, useRef, useState } from 'react';

/**
 * ScrollReveal wrapper component that animates its children when they enter the viewport,
 * and resets the animation when they exit the viewport (supporting both scroll-down and scroll-up reveals).
 */
export default function ScrollReveal({ children, direction = 'up', delay = 0, duration = 0.7 }) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
      },
      {
        threshold: 0.05,
        rootMargin: '10px'
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  const getTransform = () => {
    if (inView) return 'translate(0, 0) scale(1)';
    switch (direction) {
      case 'up':    return 'translateY(36px) scale(0.98)';
      case 'down':  return 'translateY(-36px) scale(0.98)';
      case 'left':  return 'translateX(36px) scale(0.98)';
      case 'right': return 'translateX(-36px) scale(0.98)';
      default:      return 'translateY(36px)';
    }
  };

  return (
    <div
      ref={ref}
      style={{
        opacity: inView ? 1 : 0,
        transform: getTransform(),
        transition: `opacity ${duration}s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s, transform ${duration}s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s`,
        width: '100%',
        willChange: 'transform, opacity'
      }}
    >
      {children}
    </div>
  );
}
