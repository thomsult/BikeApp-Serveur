import { useTranslation } from "react-i18next";
import { useAllActivities } from "@/lib/api/activity";
import { useAllChallenges } from "@/lib/api/challenge";
import { useAllBikes, useAllComponentBikes } from "@/lib/api/equipments";
import { useMyProfil } from "@/lib/api/profil";
import { useAllTypeActivities } from "@/lib/api/type-activity";
import type { StatsCardProps } from "../ui/stats-card";
import { useTheme } from "@/lib/theme/use-theme";
import { BikeIcon, CalendarIcon, ChartBarIcon, ClockIcon, MapIcon, WrenchIcon, type Map } from "lucide-react";
import type { TypeActivityResource } from "@/client";
import { useMemo } from "react";

interface UseStatsConfigProps {
  weekStats: StatsCardProps[];
  equipmentStats: StatsCardProps[];
  monthStats: StatsCardProps[];
}

export const useStatsConfig = (): UseStatsConfigProps => {
  const { t } = useTranslation();
  const { data: dataChallenges = [] } = useAllChallenges() || [];
  const { data: user } = useMyProfil();
  const { theme } = useTheme();
  const challenges = dataChallenges
    .filter((challenge) => !challenge.isDailyGoal)
    .sort((a, b) => {
      const dateA = new Date(a.createdAt || "").getTime();
      const dateB = new Date(b.createdAt || "").getTime();
      return dateB - dateA;
    });
  // const { data: bikes = [] } = useAllBikes();
  // const { data: equipments = [] } = useAllComponentBikes();
  const { data: activities = [] } = useAllActivities();
  const { data: activitiesTypes = [] } = useAllTypeActivities();
  const info = useMemo(() => {

    if (!activities || !activitiesTypes) {
      return {
        totalBikes: 0,
        totalAccessories: 0,
        nextMaintenance: [],
      };
    }

    const nextMaintenance = activities
      .filter(
        (a) => {
          console.log("Activity:", a);
        }
      )
      .map((a) => {
        const daysLeft = Math.ceil(
          (new Date(a.dt_start).getTime() - Date.now()) / (1000 * 60 * 60 * 24),
        );
        return daysLeft > 0 ? daysLeft : 0;
      });

    return {
      totalBikes: 0,
      totalAccessories: 0,
      nextMaintenance: nextMaintenance.sort((a, b) => a - b),
    };
  }, [activities, activitiesTypes]);


  const weekStats: StatsCardProps[] = [
    {
      value: user?.stats.weeklyStats?.distance || 0,
      label: t("common.stats.distance", {
        count: user?.stats.weeklyStats?.distance || 0,
      }),
      Icon: MapIcon,

    },
    {
      value: user?.stats.weeklyStats?.rides || 0,
      label: t("common.stats.rides", {
        count: user?.stats.weeklyStats?.rides || 0,
      }),
      Icon: BikeIcon,

    },
    {
      value: challenges ? challenges.length : 0,
      label: t("common.stats.objective", {
        count: challenges ? challenges.length : 0,
      }),
      Icon: ChartBarIcon,

    },
  ];
  const equipmentStats: StatsCardProps[] = [
    {
      value: info.totalBikes,
      label: t("common.stats.bikes", {
        count: info.totalBikes,
      }),
      Icon: BikeIcon,

    },
    {
      value: info.totalAccessories,
      label: t("common.stats.accessories", {
        count: info.totalAccessories,
      }),
      Icon: WrenchIcon,

    },
    {
      value: info.nextMaintenance.length,
      unit: t("common.units.days"),
      label: t("common.stats.maintenances", {
        count: info.nextMaintenance.length,
      }),
      Icon: CalendarIcon,

      isWarning:
        (info.nextMaintenance.length &&
          info.nextMaintenance.some((days) => days <= 7)) ||
        false,
    },
  ];
  const monthStats: StatsCardProps[] = [
    {
      value: user?.stats.monthlyStats?.rides || 0,
      label: t("common.stats.rides", {
        count: user?.stats.monthlyStats?.rides || 0,
      }),
      Icon: BikeIcon,

    },
    {
      value: user?.stats.monthlyStats?.distance || 0,
      label: t("common.stats.distance", {
        count: user?.stats.monthlyStats?.distance || 0,
      }),
      Icon: MapIcon,

    },
    {
      value: user?.stats.monthlyStats?.duration || 0,
      label: `${t("common.units.duration.minutes")}/${t("common.stats.rides_one")}`,
      Icon: ClockIcon,

    },
  ];
  return {
    weekStats,
    equipmentStats,
    monthStats,
  };
};
