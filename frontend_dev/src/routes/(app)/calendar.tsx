import { ActivityView } from '@/components/activities';
import { useHandleActivity } from '@/components/activities/use-handle-activity';
import Calendar from '@/components/calendar/calendar';
import type { CellDate } from '@/components/calendar/calendar.dt';
import { Legend } from '@/components/calendar/legend';
import { ImageCard } from '@/components/home/image-card';
import { useStatsConfig } from '@/components/profils/stats-config';
import { StatsList } from '@/components/stats';
import { useAllActivities } from '@/lib/api/activity';
import { useAllTypeActivities } from '@/lib/api/type-activity';
import { createFileRoute } from '@tanstack/react-router'
import { isSameDay } from 'date-fns';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export const Route = createFileRoute('/(app)/calendar')({
  component: RouteComponent,
})

function RouteComponent() {
  const { t } = useTranslation();
  const { monthStats } = useStatsConfig();

  const [selectedDate, setSelectedDate] = useState<CellDate>({} as CellDate);
  const [selectedMonth, setSelectedMonth] = useState<Date>(new Date());
  const { data: typeActivities } = useAllTypeActivities();
  const { data: activities } = useAllActivities();
  const { handleNewActivity } = useHandleActivity();

  return <div className='flex  flex-col gap-4 max-w-2xl mx-auto  pb-20' >
    <p className="text-sm text-gray-500 mb-4">{t("app.calendar.description")}</p>
    <StatsList title={t("app.calendar.stats.title")} list={monthStats} />
    <ImageCard />
    <Calendar
      selectedDate={selectedDate}
      setSelectedMonth={(date) => {
        setSelectedMonth(date);
        setSelectedDate({} as CellDate);
      }}
      onDayPress={setSelectedDate}
      onDoubleClick={(dayObj) => {
        handleNewActivity(dayObj.date);
      }}
    >
      {(date: CellDate) => {
        return activities
          ?.filter((activity) =>
            isSameDay(new Date(activity.dt_start), date.date),
          )
          .map((activity) => {
            const info = typeActivities?.find(
              (type) => type.id === activity.type?.id,
            );

            if (!info) return null;
            return (
              <div
                key={info.id}
                style={{ backgroundColor: info.color }}
                className={`absolute bottom-2 size-2 rounded-full`}
              />
            );
          });
      }}
    </Calendar>
    <Legend />
    <ActivityView selectedDate={selectedDate} selectedMonth={selectedMonth} />

  </div>
}
