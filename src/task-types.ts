export type TaskStep = {
  id: number;
  text: string;
  done: boolean;
};

export type Task = {
  id: number;
  title: string;
  type: string;
  summary?: string;
  icon?: string;
  energy: number;
  done: boolean;
  steps: TaskStep[];
  custom?: boolean;
};
