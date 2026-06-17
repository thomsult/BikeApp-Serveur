import settingsConfig from "./settings-config";
import SettingItem from "./settings-item";
import { useFormContext } from "./sub-components/form/context";
import { useSelector } from "@tanstack/react-store";

export const SettingsProfil = () => {
  const form = useFormContext();
  const formState = useSelector(form.store, (state) => state);
  return <div className="flex flex-col gap-6">
    {Object.entries(settingsConfig).map(([key, section]) => (
      <div key={key} className="mb-8 mx-auto max-w-3xl">
        <h2 className="text-2xl font-bold mb-4">{section.title}</h2>
        <div className="flex flex-col gap-4 mb-2 ">
          {section.items.map((item, index) => {
            return <div key={index}>
              <SettingItem {...item} root={key} form={form} formState={formState} />
            </div>
          })}
        </div>
      </div>
    ))}
  </div>
}