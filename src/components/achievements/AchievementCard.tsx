import {
  CircleDot,
  Compass,
  Fingerprint,
  KeyRound,
  Orbit,
  Radio,
  Sparkles,
  Waypoints,
} from "lucide-react";
import type { Achievement } from "../../types";
import { rarityLabels } from "../../design-system/tokens";

const iconMap = {
  signal: Radio,
  fragment: Fingerprint,
  compass: Compass,
  orbit: Orbit,
  map: Waypoints,
  key: KeyRound,
  pulse: CircleDot,
  core: Sparkles,
  conductor: Radio,
} as const;

interface AchievementCardProps {
  achievement: Achievement;
  unlocked: boolean;
  unlockedAt?: string;
  compact?: boolean;
}

export function AchievementCard({
  achievement,
  unlocked,
  unlockedAt,
  compact = false,
}: AchievementCardProps) {
  const Icon = iconMap[achievement.icon as keyof typeof iconMap] ?? Fingerprint;
  return (
    <article
      className={`achievement-card rarity-${achievement.rarity}${unlocked ? " is-unlocked" : " is-locked"}${compact ? " is-compact" : ""}`}
      aria-label={`${achievement.name}, ${unlocked ? "unlocked" : "locked"}`}
    >
      <div className="relic-shell" aria-hidden="true">
        <Icon />
        <span />
      </div>
      <div className="achievement-copy">
        <span className="rarity-label">{rarityLabels[achievement.rarity]} relic</span>
        <h3>{unlocked ? achievement.name : "Encrypted specimen"}</h3>
        <p>{achievement.description}</p>
        {unlocked && achievement.discoveryText && (
          <blockquote>{achievement.discoveryText}</blockquote>
        )}
        {unlockedAt && (
          <time dateTime={unlockedAt}>
            Recovered {new Date(unlockedAt).toLocaleDateString()}
          </time>
        )}
      </div>
    </article>
  );
}
