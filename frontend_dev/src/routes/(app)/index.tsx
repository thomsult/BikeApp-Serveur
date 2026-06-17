import Challenges from '@/components/home/challenge';
import DailyGoal from '@/components/home/daily-goal';
import { ImageCard } from '@/components/home/image-card';
import RecentRides from '@/components/home/recent-rides';
import StartRideButton from '@/components/home/ride-button';
import UpcomingRides from '@/components/home/rides';
import Suggestions from '@/components/home/suggestions';
import { useStatsConfig } from '@/components/profils/stats-config';
import { StatsList } from '@/components/stats';
import { useAllChallenges } from '@/lib/api/challenge';
import { useMyProfil } from '@/lib/api/profil';
import { createFileRoute } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';

export const Route = createFileRoute('/(app)/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { data: dataChallenges = [] } = useAllChallenges();
  const { data: user } = useMyProfil();
  const { t } = useTranslation();
  const { weekStats } = useStatsConfig();
  const dailyGoal = dataChallenges.find((challenge) => challenge.isDailyGoal);

  if (!user) return null;


  return (
    <div className="flex  flex-col gap-4 max-w-2xl mx-auto ">
      {/* Statistiques de la semaine */}
      {dailyGoal && <DailyGoal dailyGoal={dailyGoal} />}
      <StartRideButton text={t("app.home.rideNow")} />
      <StatsList title={t("app.home.stats.title")} list={weekStats} />
      <Challenges challenges={dataChallenges} />
      <ImageCard />
      <UpcomingRides />
      <RecentRides />

      <Suggestions />
    </div>
  );
}
