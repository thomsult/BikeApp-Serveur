import { useTranslation } from "react-i18next";


import { withForm } from "./form/context";

const TitleComponent = withForm({
  props: {
    name: "",
  },
  render: function Render({ name }) {

    const { t } = useTranslation();
    return (
      <div className="mb-2 flex-1">
        <h1
          className="text-xl font-medium"

        >
          {t(`app.profil.${name}.title`)}
        </  h1>

        <p
          className="mt-1 text-sm font-medium"
        >
          {t(`app.profil.${name}.description`)}
        </p>
      </div>
    );
  },
});

export default TitleComponent;
