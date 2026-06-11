import type { AnyActivityT } from "@/lib/api/activity/activity";
import { useRouter } from "@tanstack/react-router";
import { format } from "date-fns";

export const useHandleNewRides = () => {
  const router = useRouter();


  const handleNewRide = async (activity: AnyActivityT) => {

    router.navigate({
      to: "/ride",
      search: {
        id: activity.id,
      },
    });

  };

  return { handleNewRide };


}