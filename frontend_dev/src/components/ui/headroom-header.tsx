import { useEffect, useState } from "react";

interface HeadroomHeaderProps {
  children: React.ReactNode;
  height?: number;
  threshold?: number;
  className?: string;
  id?: string;
  ariaLabel?: string;
}

export const HeadroomHeader = ({
  height = 80,
  threshold = height * 0.4,
  className = "",
  children,
  id,
  ariaLabel = "En-tête principal",
}: HeadroomHeaderProps) => {

  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    let lastScrollY = window.scrollY;
    let accumulatedDelta = 0;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const delta = currentScrollY - lastScrollY;

      // Toujours visible près du haut
      if (currentScrollY < threshold) {
        setIsVisible(true);
        accumulatedDelta = 0;
      } else {
        accumulatedDelta += delta;

        // cacher après avoir descendu de threshold px
        if (accumulatedDelta > threshold) {
          setIsVisible(false);
          accumulatedDelta = 0;
        }

        // montrer après avoir remonté de threshold px
        if (accumulatedDelta < -threshold) {
          setIsVisible(true);
          accumulatedDelta = 0;
        }
      }

      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, [threshold]);
  return (
    <header
      id={id}
      aria-label={ariaLabel}
      role="banner"
      style={{
        height: `${height}px`,
        transform: isVisible ? "translateY(0)" : "translateY(-100%)",
      }}
      className={`sticky transition-transform motion-reduce:transition-none duration-300 top-0 z-50 ${className}`}
    >{children}
    </header>
  )
};