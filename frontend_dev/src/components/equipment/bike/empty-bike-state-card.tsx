import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PlusCircle } from "lucide-react";


interface EmptyStateCardProps {
  icon: React.ComponentType<any>;
  title: string;
  description: string;
  buttonText?: string;
  onClick?: () => void;
}

export const EmptyStateCard = ({
  icon: Icon,
  title,
  description,
  buttonText,
  onClick,
}: EmptyStateCardProps) => {

  return (
    <button
      onClick={onClick}
      disabled={!onClick}
      className="w-full"
    >
      <Card
        className="bg-card overflow-hidden relative flex flex-col items-center justify-center p-6"
      >

        <Icon size={240} className="text-primary absolute opacity-5 -bottom-10 -right-10" />
        {/* Contenu */}
        <div className="flex flex-col  z-10 my-2 items-center">
          {/* Icône principale */}
          <div
            className="mb-4 size-16 items-center justify-center rounded-full bg-primary/20 flex"

          >
            <Icon size={32} className="text-primary" />
          </div>

          {/* Titre */}
          <p
            className="mb-2 text-center text-base font-bold"

          >
            {title}
          </p>

          {/* Description */}
          <p
            className="mb-4 px-2 text-center text-sm text-muted"

          >
            {description}
          </p>

          {/* Bouton optionnel */}
          {buttonText && onClick && (
            <div

              className="w-full gap-2.5 flex-row items-center justify-center rounded-lg border border-primary/50 p-3 flex"

            >

              <PlusCircle className="text-primary size-4" />
              <p
                className="font-semibold text-primary">
                {buttonText}
              </p>
            </div>
          )}
        </div>
      </Card>
    </button>
  );
};
