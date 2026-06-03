import { getTaskPresentation } from "../../task-presentation";
import type { Task } from "../../task-types";

type TaskDetailCardProps = {
  task: Task;
  onToggleStep: (taskId: number, stepId: number, sourceRect?: DOMRect) => void;
  onCompleteTask: (taskId: number, sourceRect?: DOMRect) => void;
};

export function TaskDetailCard({ task, onToggleStep, onCompleteTask }: TaskDetailCardProps) {
  const presentation = getTaskPresentation(task);

  return (
    <section className="task-detail">
      <div className="task-detail-head">
        <div className="task-detail-copy">
          <div className="task-detail-icon" style={presentation.style} aria-hidden="true">
            {presentation.icon}
          </div>
          <div>
            <p>任务指引</p>
            <h2>{task.title}</h2>
            <span className="task-detail-summary">{presentation.summary}</span>
          </div>
        </div>
        <span className="task-detail-tag">{task.type}</span>
      </div>

      <div className="step-list">
        {task.steps.map((step) => (
          <button
            className={step.done ? "step done" : "step"}
            key={step.id}
            type="button"
            onClick={(event) => onToggleStep(task.id, step.id, event.currentTarget.getBoundingClientRect())}
          >
            <span>{step.id}</span>
            {step.text}
          </button>
        ))}
      </div>

      <button
        className="wide-action"
        type="button"
        onClick={(event) => onCompleteTask(task.id, event.currentTarget.getBoundingClientRect())}
      >
        温柔完成这个任务
      </button>
    </section>
  );
}
