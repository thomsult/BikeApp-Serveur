import { Card } from "@/components/ui/card";
import { Calendar, PlusCircle } from "lucide-react";

export const EmptyEquipmentMaintenanceCard = ({
  handleClick,
  text,
}: {
  handleClick: () => void;
  text?: string;
}) => {

  return (
    <button onClick={handleClick} className="w-full text-left">
      <Card
        style={{
          height: 90,
        }}
        className="relative flex flex-row items-center justify-center overflow-hidden border-dashed bg-card"
      >
        <PlusCircle
          className="text-primary"
          size={30}

        />
        <p
          className="ml-3 text-center font-semibold text-primary"
        >
          {text}
        </p>
        <div className="absolute -bottom-4 -right-4" style={{ opacity: 0.05 }}>
          <Calendar className="text-primary" size={80} />
        </div>
      </Card>
    </button>
  );
};