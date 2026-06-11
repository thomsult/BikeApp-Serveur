import { Link } from "@tanstack/react-router";
import { AvatarFallback, AvatarImage, Avatar as AvatarBase } from "./ui/avatar";

export const Avatar = ({ fallback = "JD", image, className }: { fallback?: string; image?: string; className?: string }) => {
  return (<Link to="/profile" className={`${className}`}>
    <AvatarBase size="lg">
      <AvatarImage src={image} />
      <AvatarFallback>
        {fallback}
      </AvatarFallback>
    </AvatarBase>

  </Link >)
};