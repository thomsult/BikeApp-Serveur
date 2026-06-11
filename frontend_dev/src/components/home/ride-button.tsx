import { Link } from "@tanstack/react-router";

const StartRideButton: React.FC<{
  text?: string;
}> = ({ text = "Démarrer une sortie" }) => {
  return (
    <Link
      to="/ride"
      params={{ id: "new", actions: "start" }}
      className="
      shadow-xl 
          transition-all duration-300
          hover:scale-[1.01] hover:shadow-2xl
          active:scale-[0.99]
          min-h-32
          
      relative h-32 w-full overflow-hidden rounded-2xl flex items-center justify-center group transition-transform active:scale-[0.98]"
    >
      {/* Background image */}
      <img
        src="/assets/images/ic_launcher_background.png"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Overlay dégradé pour lisibilité */}

      {/* Icône décorative droite */}
      <img
        src="/assets/images/ic_launcher_foreground.png"
        className="absolute -top-10 -right-10 size-56 object-contain opacity-15 pointer-events-none"
      />

      {/* Contenu principal */}
      <div className="relative flex flex-col items-center gap-2">
        <img
          src="assets/images/adaptive-icon.png"
          className="w-45 h-45 -mb-15 -mt-10"
        />
        <span className="text-white text-xl font-semibold tracking-wide drop-shadow-sm">
          {text}
        </span>
      </div>
    </Link>
  );
};

export default StartRideButton;