import { useTranslation } from "react-i18next";


const SettingItem = ({
  Composant,
  disabled,
  ...rest
}: {
  Composant?: any;
  disabled?: boolean;
  [key: string]: any;
}) => {
  const ViewComposant = rest.url ? 'a' : rest.button ? 'div' : "div";
  const { t } = useTranslation();

  return (
    <ViewComposant
      href={rest.url}
      className={`flex items-center max-w-2xl justify-between w-full rounded-md  transition-colors ${disabled ? "cursor-not-allowed opacity-50" : "hover:opacity-90"} ${rest.disabledLabel ? "" : "p-4 bg-card"}`}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        if (rest.url) {
          window.open(rest.url, "_blank");
        } else if (rest.button) {
          rest.button();
        }
      }}

    >
      {!rest.disabledLabel && (
        <label htmlFor={rest.name} className="flex flex-col flex-1 p-2 rounded-md cursor-pointer">
          <h3
            className="text-base font-medium text-left"

          >
            {t(`app.profil.${rest.root}.${rest.name}.title`)} {disabled && `(désactivé)`}
          </h3>

          <p
            className="mt-1 text-xs font-medium text-left text-gray-500"

          >
            {String(
              t(`app.profil.${rest.root}.${rest.name}.description`, {
                ...rest,
              }),
            )}
          </p>
          {rest.extraKey && <div className="mt-2 text-xs font-medium text-left text-gray-500">
            {rest.extraKey.map((line: string, index: number) => (
              <span key={index}>{line}<br /></span>
            ))}
          </div>}
        </label>
      )}
      {Composant && <Composant {...rest} />}
    </ViewComposant>
  );
};

export default SettingItem;
