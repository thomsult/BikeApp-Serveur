import { memo } from "react";

function IconApp({ size = "medium" }: { size?: "small" | "medium" | "large" | "géant" }) {
  const sizes = {
    small: 24,
    medium: 100,
    large: 200,
    géant: 300,
  };

  return (
    <img
      src="/assets/images/play_store_512.png"
      alt="BikeApp Logo"
      className="rounded-md"
      width={sizes[size]}
      height={sizes[size]}
    />
  );
}

export default memo(IconApp)