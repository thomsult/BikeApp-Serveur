import { Button } from "@/components/ui/button";
import { ChevronRightIcon } from "lucide-react";


const LinksComponent = ({
  url,
  button,
}: {
  url?: string;
  button?: () => void;
}) => {
  const handlePress = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (url) {
      window.open(url, "_blank");
    } else if (button) {
      button();
    } else {
      return alert("No URL or button action provided");
    }
  };
  return (
    <Button variant="tertiary" size="icon" className="cursor-pointer" onClick={handlePress}>
      <ChevronRightIcon size={14} />
    </Button>
  );
};

export default LinksComponent;
