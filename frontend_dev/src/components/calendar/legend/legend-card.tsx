import { PlusIcon } from "lucide-react";

const AddCardLegend = ({
  onPress,
  title,
}: {
  onPress?: () => void;
  title: string;
}) => {
  return (
    <button
      onClick={onPress}
      className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-primary/60 bg-primary/10 p-4 transition-colors hover:bg-primary/20"
    >
      <span className="flex rounded-full bg-primary p-1">
        <PlusIcon size={14} className="text-white" />
      </span>
      <span className="text-sm font-semibold text-primary">{title}</span>
    </button>
  );
};

export { AddCardLegend };