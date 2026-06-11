import { StatsCard, type StatsCardProps } from "./ui/stats-card";
import TitlesSection from "./ui/titles-section";

export const StatsList = ({
  title,
  list,
}: {
  title: string;
  list: StatsCardProps[];
}) => {
  return (
    <section className="mb-6  ">
      <TitlesSection title={title} />
      <div className="flex flex-row flex-wrap gap-2">
        {list.map((stat, index) => (
          <StatsCard
            key={index}
            {...stat}
            isEmpty={
              !stat.value ||
              stat.value === 0 ||
              Number.isFinite(Number(stat.value)) === false ||
              stat.value === "N/A" ||
              stat.value === null
            }
          />
        ))}
      </div>
    </section>
  );
};
