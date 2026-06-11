
import { Pen, PenOff } from "lucide-react";
import { Card } from "../ui/card";
import { cn } from "@/lib/utils";
import { ActivityIndicator } from "../ui/activity-indicator";
import { useDrawingRoute } from "@/lib/map/use-drawing-route";


export const EditModeButton = () => {
  const {
    toggleEditMode,
    isEditMode: editMode,
    isReadOnly,
  } = useDrawingRoute();
  const loading = false;
  const error = null;
  const isDisabled = !!error || loading;
  return <Card
    title={editMode ? "Exit Edit Mode" : "Enter Edit Mode"}

    className={
      cn(
        "p-4 flex items-center justify-center rounded-lg flex-col",
        "hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors",
        "cursor-pointer",
        editMode ? "text-primary" : "text-gray-500",
        isDisabled || isReadOnly ? "opacity-50 pointer-events-none hover:bg-none " : ""
      )
    }
    onClick={isReadOnly ? () => { } : toggleEditMode}
  >
    {!loading ? !isReadOnly ? <Pen
      className={
        cn(
          "transition-colors",
          editMode ? "text-primary" : "text-gray-500",
          isDisabled ? "opacity-50 pointer-events-none hover:bg-none " : ""
        )
      }

      size={28}
    /> : <PenOff /> : <ActivityIndicator size="lg" />}
  </Card>;
};
