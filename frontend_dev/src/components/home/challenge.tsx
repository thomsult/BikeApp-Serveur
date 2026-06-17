import type { Challenge } from "@/lib/api/challenge/challenge";
import { useTheme } from "@/lib/theme/use-theme";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import TitlesSection from "../ui/titles-section";
import { ChallengeCard, CreateChallengeCard, EmptyState } from "./challenge/challenge-card";
import { ChallengeModal } from "./challenge/challenge-modal";
import useHandleDeepLink from "@/lib/hooks/use-handle-deep-link";
import type { ChallengeResource } from "@/client";


const MAX_CHALLENGES = 3;

const Challenges: React.FC<{ challenges: ChallengeResource[] }> = ({ challenges }) => {
  const { t } = useTranslation();
  const [showModal, setShowModal] = useState<ChallengeResource | null>(null);
  const { navigate, resetNavigate } = useHandleDeepLink<ChallengeResource>({
    originalPath: "",
    path: "challenge-modal",
    show: (showParams) => {
      if (showParams["challenge-modal"] === "new") {
        showParams["challenge-modal"] = undefined;
        setShowModal({
          ...showParams,
        } as ChallengeResource);
      } else {
        setShowModal(
          (challenges?.find(
            (challenge) => challenge.id === showParams["challenge-modal"],
          ) ??
            null) ||
          null,
        );
      }
      console.info("Showing challenge modal with params:", showParams);
    },
    hide: () => {
      setShowModal(null);
    },
  });
  // const theme = useTheme();
  const [showAll, setShowAll] = useState(false);

  const filteredChallenges = challenges
    .filter((challenge) => !challenge.isDailyGoal)
    .sort((a, b) => {
      const dateA = new Date(a.createdAt || "").getTime();
      const dateB = new Date(b.createdAt || "").getTime();
      return dateB - dateA;
    });
  const displayedChallenges = showAll
    ? filteredChallenges
    : filteredChallenges.slice(0, MAX_CHALLENGES);

  return (<>
    <div className="mb-3 flex-row items-center justify-between">
      <TitlesSection title={t("app.home.challenges.title")} />
      {filteredChallenges.length > MAX_CHALLENGES && (
        <button onClick={() => setShowAll((v) => !v)}>
          <span
            className="text-sm font-bold text-primary"
          >
            {showAll ? t("common.showLess") : t("common.showMore") + ` (${filteredChallenges.length - MAX_CHALLENGES})`}
          </span>
        </button>
      )}


      {
        filteredChallenges.length === 0 && (
          <EmptyState onPress={() => {
            setShowModal({} as ChallengeResource);
          }} />
        )
      }
      {displayedChallenges.length > 0 && <div className="flex flex-col gap-2  overflow-x-scroll scroll-auto px-1">
        <div className="flex w-fit gap-4 py-1 "

        >
          {displayedChallenges.map((challenge) => (
            <ChallengeCard
              key={challenge.id}
              challenge={challenge}
              onPress={() => {
                setShowModal(challenge);
              }}
            />
          ))}
          {filteredChallenges.length > 0 && <CreateChallengeCard
            onPress={() => {
              setShowModal({} as ChallengeResource);
            }}
          />}
        </div>
      </div>}

    </div>
    {showModal && <ChallengeModal
      showModal={showModal}
      hideModal={() => {
        resetNavigate();
      }}
    />}
  </>
  );
};

export default Challenges;
