// "use client";

// import { useEffect, useRef, useState } from "react";

// type LazyLoadSectionProps = {
//   children: (isVisible: boolean) => React.ReactNode;
//   /** Intersection-Observer threshold (0–1) */
//   threshold?: number;
//   /** Root-margin for earlier / later trigger */
//   rootMargin?: string;
//   /** Called only once, the first time section becomes visible */
//   onVisibleOnce?: () => void;
// };

// export default function LazyLoadSection({
//   children,
//   threshold = 0.1,
//   rootMargin = "0px",
//   onVisibleOnce,
// }: LazyLoadSectionProps) {
//   const ref = useRef<HTMLDivElement | null>(null);
//   const [isVisible, setIsVisible] = useState(false);
//   const [hasTriggered, setHasTriggered] = useState(false); // ⬅️ Internal hasFetched

//   useEffect(() => {
//     const observer = new IntersectionObserver(
//       ([entry]) => {
//         if (entry.isIntersecting) {
//           setIsVisible(true);

//           if (!hasTriggered) {
//             onVisibleOnce?.();       // ✅ Trigger only once
//             setHasTriggered(true);   // ✅ Lock further calls
//           }

//           observer.disconnect();
//         }
//       },
//       { threshold, rootMargin }
//     );

//     if (ref.current) observer.observe(ref.current);
//     return () => observer.disconnect();
//   }, [threshold, rootMargin, onVisibleOnce, hasTriggered]);

//   return <div ref={ref}>{children(isVisible)}</div>;
// }
"use client";

import { useEffect, useRef, useState } from "react";

type LazyLoadSectionProps = {
  children: React.ReactNode | ((isVisible: boolean) => React.ReactNode);
  /** Intersection-Observer threshold (0–1) */
  threshold?: number;
  /** Root-margin for earlier / later trigger */
  rootMargin?: string;
  /** Called only once, the first time section becomes visible */
  onVisibleOnce?: () => void;
};

export default function LazyLoadSection({
  children,
  threshold = 0.1,
  rootMargin = "0px",
  onVisibleOnce,
}: LazyLoadSectionProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);

          if (!hasTriggered) {
            onVisibleOnce?.();
            setHasTriggered(true);
          }

          observer.disconnect();
        }
      },
      { threshold, rootMargin }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold, rootMargin, onVisibleOnce, hasTriggered]);

  return (
    <div ref={ref}>
      {typeof children === "function" ? children(isVisible) : children}
    </div>
  );
}
