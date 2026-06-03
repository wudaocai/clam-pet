import type { CSSProperties } from "react";
import type { Task } from "./task-types";

type TaskPresentation = {
  icon: string;
  summary: string;
  style: CSSProperties;
};

const taskPresentationByType: Record<
  string,
  { icon: string; accent: string; surface: string; defaultSummary: string }
> = {
  生活改善: {
    icon: "☕",
    accent: "oklch(0.66 0.085 82)",
    surface: "oklch(0.97 0.03 92)",
    defaultSummary: "给身体一个温柔的开始",
  },
  情绪记录: {
    icon: "❀",
    accent: "oklch(0.68 0.072 145)",
    surface: "oklch(0.97 0.028 145)",
    defaultSummary: "写下你的感受，释放情绪",
  },
  正念练习: {
    icon: "☁",
    accent: "oklch(0.66 0.045 225)",
    surface: "oklch(0.97 0.022 230)",
    defaultSummary: "把注意力轻轻带回此刻",
  },
  认知整理: {
    icon: "✎",
    accent: "oklch(0.62 0.06 32)",
    surface: "oklch(0.97 0.024 52)",
    defaultSummary: "把想法分清成事实和感受",
  },
  自我慈悲: {
    icon: "♡",
    accent: "oklch(0.7 0.06 10)",
    surface: "oklch(0.98 0.02 18)",
    defaultSummary: "像安慰朋友一样安慰自己",
  },
  价值澄清: {
    icon: "✦",
    accent: "oklch(0.69 0.08 92)",
    surface: "oklch(0.98 0.024 88)",
    defaultSummary: "找到今天仍然重要的一点点",
  },
  身体觉察: {
    icon: "◌",
    accent: "oklch(0.62 0.05 178)",
    surface: "oklch(0.97 0.026 178)",
    defaultSummary: "留意身体正在告诉你的事",
  },
  感恩练习: {
    icon: "✿",
    accent: "oklch(0.68 0.074 132)",
    surface: "oklch(0.98 0.03 126)",
    defaultSummary: "记住一个微小但真实的好瞬间",
  },
  情绪容纳: {
    icon: "▣",
    accent: "oklch(0.63 0.04 270)",
    surface: "oklch(0.97 0.024 274)",
    defaultSummary: "先把担心轻轻安放下来",
  },
  情绪表达: {
    icon: "✉",
    accent: "oklch(0.66 0.065 28)",
    surface: "oklch(0.98 0.028 34)",
    defaultSummary: "把心里的话写下来就很好",
  },
  我的每日任务: {
    icon: "☘",
    accent: "oklch(0.64 0.08 145)",
    surface: "oklch(0.97 0.028 142)",
    defaultSummary: "给今天留下一件想温柔完成的小事",
  },
};

function buildPresentation(
  icon: string,
  accent: string,
  surface: string,
  summary: string,
): TaskPresentation {
  return {
    icon,
    summary,
    style: {
      "--task-accent": accent,
      "--task-surface": surface,
    } as CSSProperties,
  };
}

export function getTaskPresentation(task: Task): TaskPresentation {
  const preset =
    taskPresentationByType[task.type] ??
    taskPresentationByType[task.custom ? "我的每日任务" : "情绪记录"];

  return buildPresentation(
    task.icon ?? preset.icon,
    preset.accent,
    preset.surface,
    task.summary ?? task.steps[0]?.text ?? preset.defaultSummary,
  );
}
