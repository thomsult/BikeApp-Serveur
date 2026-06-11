import { BikeView } from '@/components/equipment/bike-view';
import { EquipmentAccessoriesView } from '@/components/equipment/equipment-accessories-view';
import { EquipmentMaintenanceView } from '@/components/equipment/equipment-maintenance-view';
import { useStatsConfig } from '@/components/profils/stats-config';
import { StatsList } from '@/components/stats'
import { createFileRoute } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next';

export const Route = createFileRoute('/(app)/equipment')({
  component: RouteComponent,
})

function RouteComponent() {
  const { t } = useTranslation();
  const { equipmentStats } = useStatsConfig();
  return <div className='flex  flex-col gap-4 max-w-2xl mx-auto pb-20'>
    <p className="text-sm text-gray-500 mb-4">{t("app.equipment.description")}</p>
    <StatsList title={t("app.equipment.stats.title")} list={equipmentStats} />
    <BikeView />
    <EquipmentMaintenanceView />
    <EquipmentAccessoriesView />
  </div>
}
