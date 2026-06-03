import { Pet } from "../pet/Pet";
import type { PetAction, PetMood } from "../../app/types";
import type { Task } from "../../task-types";
import { getTaskPresentation } from "../../task-presentation";

type HomeScreenProps = {
  greeting: string;
  moodLabel: string;
  petMood: PetMood;
  petAction: PetAction;
  petActionTick: number;
  outfit: string;
  visibleTasks: Task[];
  activeSoundName: string | null;
  onPat: () => void;
  onNuzzle: () => void;
  onCuddle: () => void;
  onWave: () => void;
  onOpenSettings: () => void;
  onOpenTask: (taskId: number) => void;
  onCompleteTask: (taskId: number, sourceRect?: DOMRect) => void;
  onOpenTasks: () => void;
  onOpenBreathShortcut: () => void;
  onOpenSoundShortcut: () => void;
};

function formatGreeting(greeting: string) {
  return greeting.endsWith("。") ? greeting.slice(0, -1) : greeting;
}

export function HomeScreen({
  greeting,
  moodLabel,
  petMood,
  petAction,
  petActionTick,
  outfit,
  visibleTasks,
  activeSoundName,
  onPat,
  onNuzzle,
  onCuddle,
  onWave,
  onOpenSettings,
  onOpenTask,
  onCompleteTask,
  onOpenTasks,
  onOpenBreathShortcut,
  onOpenSoundShortcut,
}: HomeScreenProps) {
  const friendlyGreeting = formatGreeting(greeting);

  return (
    <section className="screen home-screen">
      <div className="home-hero-copy">
        <div>
          <p className="home-brand-mark">CalmPet</p>
          <h2>早上好呀，{friendlyGreeting} ✨</h2>
        </div>

        <button className="home-status-pill" type="button" onClick={onOpenSettings}>
          <span aria-hidden="true">☘</span>
          状态 · {moodLabel}
        </button>
      </div>

      <section className="home-pet-hero">
        <div className="home-pet-heading">
          <p>我的陪伴宠物</p>
          <div>
            <h3>Momo</h3>
            <span>摸摸它、贴贴它，或者和它一起安静待一会儿</span>
          </div>
        </div>

        <div className="home-pet-stage-wrap">
          <Pet
            mood={petMood}
            action={petAction}
            actionTick={petActionTick}
            outfit={outfit}
            onPat={onPat}
            onNuzzle={onNuzzle}
            onCuddle={onCuddle}
            onWave={onWave}
          />
        </div>
      </section>

      <div className="home-shortcuts">
        <button className="home-shortcut-card" type="button" onClick={onOpenBreathShortcut}>
          <span className="home-shortcut-icon" aria-hidden="true">
            ☘
          </span>
          <span className="home-shortcut-copy">
            <strong>陪我缓 30 秒</strong>
            <em>深呼吸，放松一下</em>
          </span>
          <span className="home-shortcut-arrow" aria-hidden="true">
            ›
          </span>
        </button>

        <button className="home-shortcut-card sound" type="button" onClick={onOpenSoundShortcut}>
          <span className="home-shortcut-icon" aria-hidden="true">
            ♪
          </span>
          <span className="home-shortcut-copy">
            <strong>继续上次声音</strong>
            <em>{activeSoundName ?? "挑一个喜欢的背景声"}</em>
          </span>
          <span className="home-shortcut-arrow" aria-hidden="true">
            ›
          </span>
        </button>
      </div>

      <section className="today-panel home-task-panel">
        <div className="section-title home-task-title">
          <div>
            <p>✨ 今日小任务</p>
            <h2>{visibleTasks.length ? "先做一件小小的也很好" : "今天已经照顾得很好了"}</h2>
          </div>

          <button type="button" onClick={onOpenTasks}>
            查看全部
          </button>
        </div>

        <div className="home-task-preview">
          {visibleTasks.length ? (
            visibleTasks.map((task) => {
              const presentation = getTaskPresentation(task);

              return (
                <article className="home-task-card" key={task.id} onClick={() => onOpenTask(task.id)}>
                  <div className="home-task-icon" style={presentation.style} aria-hidden="true">
                    {presentation.icon}
                  </div>

                  <div className="home-task-copy">
                    <strong>{task.title}</strong>
                    <span>{presentation.summary}</span>
                  </div>

                  <button
                    className={task.done ? "home-task-state done" : "home-task-state"}
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      onCompleteTask(task.id, event.currentTarget.getBoundingClientRect());
                    }}
                  >
                    {task.done ? "已完成" : `0/${task.steps.length}`}
                  </button>
                </article>
              );
            })
          ) : (
            <div className="empty-care">
              <p>今天的任务已经都被温柔收下了。</p>
              <span>你可以去呼吸一下、放点声音，或者只是和 Momo 待一会儿。</span>
            </div>
          )}
        </div>
      </section>
    </section>
  );
}
