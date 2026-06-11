import { SettingHeaderProfil } from '@/components/profils/settings-header-profil';
import { SettingsProfil } from '@/components/profils/settings-profil';
import { FormProvider } from '@/components/profils/sub-components/form/context';
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(app)/profile')({
  component: RouteComponent,
})

function RouteComponent() {
  return <FormProvider>
    <SettingHeaderProfil />
    <SettingsProfil />
  </FormProvider>

}
