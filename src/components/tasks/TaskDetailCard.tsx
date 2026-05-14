import type { Task } from "../../task-types";

type TaskDetailCardProps = {
  task: Task;
  onToggleStep: (taskId: number, stepId: number, sourceRect?: DOMRect) => void;
  onCompleteTask: (taskId: number, sourceRect?: DOMRect) => void;
};

export function TaskDetailCard({ task, onToggleStep, onCompleteTask }: TaskDetailCardProps) {
  return (
    <section className="task-detail">
      <div className="task-detail-head">
        <div>
          <p>任务指导</p>
          <h2>{task.title}</h2>
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
