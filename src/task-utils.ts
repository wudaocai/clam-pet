import type { Task } from "./task-types";

type TaskBuckets = {
  pendingTasks: Task[];
  completedTasks: Task[];
  customTasks: Task[];
};

export function splitTasks(tasks: Task[]): TaskBuckets {
  const regularTasks = tasks.filter((task) => !task.custom);
  const customTasks = tasks
    .filter((task) => task.custom)
    .sort((a, b) => Number(a.done) - Number(b.done) || b.id - a.id);

  // Keep unfinished work easy to reach and completed items out of the way.
  return {
    pendingTasks: regularTasks.filter((task) => !task.done),
    completedTasks: regularTasks.filter((task) => task.done),
    customTasks,
  };
}

export function pickActiveTask(tasks: Task[], activeTaskId: number): Task {
  return (
    tasks.find((task) => task.id === activeTaskId) ??
    tasks.find((task) => !task.done && !task.custom) ??
    tasks.find((task) => !task.done) ??
    tasks[0]
  );
}
