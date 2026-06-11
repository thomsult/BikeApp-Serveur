import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { useHover } from "usehooks-ts";

type ImageData = {
  url: string;
  credit: string;
  hash: string;
  credit_url: string;
};

const COLLAPSED_HEIGHT = 200;
const EXPANDED_HEIGHT = 500;

export const ImageCard = () => {
  const [imageData, setImageData] = useState<ImageData | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const { data, isPending, error } = useQuery({
    queryKey: ["welcome-bg"],
    queryFn: async () => {
      const res = await axios.get<ImageData[]>(
        `${import.meta.env.VITE_PUBLIC_BASE_URL}/assets/images/welcome-bg`,
      );
      return res.data;
    },
  });

  useEffect(() => {
    if (!data?.length) return;
    setImageData(data[Math.floor(Math.random() * data.length)]);
  }, [data]);
  const toggleZoom = useCallback(() => setIsExpanded((prev) => !prev), []);
  const hoverRef = useRef<HTMLDivElement>(null);
  const isHover = useHover(hoverRef);
  const containerStyle = useMemo(() => ({ height: isHover ? EXPANDED_HEIGHT : COLLAPSED_HEIGHT }), [isHover]);
  const imageStyle = useMemo(() => ({ width: "100%", height: "100%", objectFit: "cover" }), []);

  const handleOpenCredit = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (imageData?.credit_url) window.open(imageData.credit_url, "_blank", "noopener,noreferrer");
  }, [imageData]);
  return (
    <div
      className=" cursor-pointer transition-all duration-500 "
      ref={hoverRef}
      style={containerStyle}
    // onClick={toggleZoom}
    >
      {isPending && (
        <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
          Loading...
        </div>
      )}
      {error && (
        <div className="flex h-full items-center justify-center text-sm text-destructive">
          Error loading image
        </div>
      )}

      {imageData && (
        <Card className=" relative h-full overflow-hidden object-cover py-0">
          <img
            key={imageData.hash}
            src={imageData.url}
            alt={imageData.credit}
            style={imageStyle}

          />
          <Button
            variant="ghost"

            size="sm"
            className="absolute bottom-2 right-2 hover:underline-offset-0 text-white"
            onClick={handleOpenCredit}
          >
            {imageData.credit}

          </Button>
        </Card>
      )}
    </div>
  );
};