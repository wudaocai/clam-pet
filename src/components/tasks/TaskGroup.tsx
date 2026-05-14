import type { Task } from "../../task-types";

type TaskGroupProps = {
  title: string;
  emptyText: string;
  tasks: Task[];
  activeTaskId: number;
  open: boolean;
  onToggleOpen: () => void;
  onSelectTask: (taskId: number) => void;
  onCompleteTask: (taskId: number, sourceRect?: DOMRect) => void;
};

export function TaskGroup({
  title,
  emptyText,
  tasks,
  activeTaskId,
  open,
  onToggleOpen,
  onSelectTask,
  onCompleteTask,
}: TaskGroupProps) {
  return (
    <section className="task-section">
      <button className="task-section-toggle" type="button" onClick={onToggleOpen}>
        <span>{title}</span>
        <span className="task-section-meta">
          <strong>{tasks.length}</strong>
          <span className={open ? "task-chevron open" : "task-chevron"} aria-hidden="true">
            ⌃
          </span>
        </span>
      </button>

      {open && (
        <div className="task-section-body">
          {tasks.length ? (
            <div className="task-list">
              {tasks.map((task) => (
                <article
                  className={activeTaskId === task.id ? "task-row large active" : "task-row large"}
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
                    <span>{task.type}</span>
                    <strong>{task.title}</strong>
                  </div>
                  <em>+{task.energy}</em>
                </article>
              ))}
            </div>
          ) : (
            <div className="task-empty">{emptyText}</div>
          )}
        </div>
      )}
    </section>
  );
}
