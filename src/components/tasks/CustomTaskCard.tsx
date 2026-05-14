import type { Task } from "../../task-types";

type CustomTaskCardProps = {
  open: boolean;
  tasks: Task[];
  activeTaskId: number;
  title: string;
  steps: string[];
  onToggleOpen: () => void;
  onSelectTask: (taskId: number) => void;
  onCompleteTask: (taskId: number, sourceRect?: DOMRect) => void;
  onTitleChange: (value: string) => void;
  onStepChange: (index: number, value: string) => void;
  onAddTask: () => void;
};

export function CustomTaskCard({
  open,
  tasks,
  activeTaskId,
  title,
  steps,
  onToggleOpen,
  onSelectTask,
  onCompleteTask,
  onTitleChange,
  onStepChange,
  onAddTask,
}: CustomTaskCardProps) {
  return (
    <section className="custom-task-card">
      <button className="task-section-toggle custom-task-toggle" type="button" onClick={onToggleOpen}>
        <span>我的每日任务</span>
        <span className="task-section-meta">
          <strong>{tasks.length}</strong>
          <span className={open ? "task-chevron open" : "task-chevron"} aria-hidden="true">
            ⌃
          </span>
        </span>
      </button>

      {open && (
        <div className="task-section-body">
          <div className="custom-task-intro">
            <p>给自己定一件很小的事</p>
            <h3>你可以写一个大任务，再顺手拆成 3 个小步骤</h3>
          </div>

          <div className="custom-task-form">
            <input
              placeholder="例如：晒 3 分钟太阳"
              type="text"
              value={title}
              onChange={(event) => onTitleChange(event.target.value)}
            />
            <div className="custom-step-grid">
              {steps.map((step, index) => (
                <input
                  key={index}
                  placeholder={`小步骤 ${index + 1}（可选）`}
                  type="text"
                  value={step}
                  onChange={(event) => onStepChange(index, event.target.value)}
                />
              ))}
            </div>
            <button type="button" onClick={onAddTask}>
              加入今日照顾
            </button>
          </div>

          {!!tasks.length && (
            <div className="custom-task-list">
              {tasks.map((task) => (
                <article
                  className={activeTaskId === task.id ? "task-row active" : "task-row"}
                  key={task.id}
                  onClick={() => onSelectTask(task.id)}
                >
                  <button
                    className={task.done ? "check done" : "check"}
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      onCompleteTask(task.id, event.currentTarget.getBoundingClientRect());
                    }}
                    aria-label={`完成 ${task.title}`}
                  />
                  <div>
                    <span>{task.done ? "已经收好" : "正在照顾"}</span>
                    <strong>{task.title}</strong>
                  </div>
                  <em>+{task.energy}</em>
                </article>
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
