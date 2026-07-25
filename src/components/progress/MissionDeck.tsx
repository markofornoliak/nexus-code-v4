import { ArrowRight, Check, Crosshair, Signal, Sparkles } from "lucide-react";
import { Link } from "../../router";
import {
  selectContinueLesson,
  selectDailyMissions,
} from "../../features/progress/progressSelectors";
import { useProgress } from "../../features/progress/ProgressContext";

export function MissionDeck() {
  const { state } = useProgress();
  const missions = selectDailyMissions(state.progress);
  const next = selectContinueLesson(state.progress);
  const completed = missions.filter((mission) => mission.percent >= 100).length;
  const route = next ? `/learn/${next.track.id}/${next.lesson.id}` : "/atlas";

  return (
    <section className="mission-deck section-shell" aria-labelledby="mission-deck-title">
      <header>
        <div>
          <span className="section-number">00 / MISSION CONTROL</span>
          <p className="eyebrow">Daily adaptive protocol</p>
          <h2 id="mission-deck-title">A clear next move, every session.</h2>
        </div>
        <div className="mission-deck-score">
          <Crosshair aria-hidden="true" />
          <strong>
            {completed}
            <span> / {missions.length}</span>
          </strong>
          <small>protocols complete</small>
        </div>
      </header>
      <div className="mission-grid">
        {missions.map((mission, index) => {
          const complete = mission.percent >= 100;
          return (
            <article className={complete ? "is-complete" : ""} key={mission.id}>
              <div>
                <span>0{index + 1}</span>
                {complete ? <Check aria-hidden="true" /> : <Signal aria-hidden="true" />}
              </div>
              <small>{mission.rewardLabel}</small>
              <h3>{mission.title}</h3>
              <p>{mission.description}</p>
              <div
                className="mission-progress"
                role="progressbar"
                aria-label={`${mission.title} progress`}
                aria-valuemin={0}
                aria-valuemax={mission.target}
                aria-valuenow={Math.min(mission.current, mission.target)}
              >
                <span style={{ width: `${mission.percent}%` }} />
              </div>
              <footer>
                <strong>
                  {Math.min(mission.current, mission.target)} / {mission.target}
                </strong>
                <span>{complete ? "Recovered" : `${mission.percent}%`}</span>
              </footer>
            </article>
          );
        })}
      </div>
      <div className="mission-next-action">
        <Sparkles aria-hidden="true" />
        <div>
          <small>Recommended coordinate</small>
          <strong>{next?.lesson.title ?? "Explore the complete atlas"}</strong>
          <span>
            {next
              ? `${next.track.language} / ${next.lesson.durationMinutes} min`
              : "Every available route is restored"}
          </span>
        </div>
        <Link to={route}>
          Open next action <ArrowRight aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
