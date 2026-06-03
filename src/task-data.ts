import type { Task } from "./task-types";

export const initialTasks: Task[] = [
  {
    id: 1,
    title: "喝一杯温水",
    type: "生活改善",
    summary: "给身体一个温柔的开始",
    icon: "☕",
    energy: 2,
    done: false,
    steps: [
      { id: 1, text: "找一个顺手的杯子", done: false },
      { id: 2, text: "慢慢喝三口", done: false },
      { id: 3, text: "感觉喉咙和胃一起暖起来", done: false },
    ],
  },
  {
    id: 2,
    title: "记录此刻心情",
    type: "情绪记录",
    summary: "写下你的感受，释放情绪",
    icon: "❀",
    energy: 3,
    done: false,
    steps: [
      { id: 1, text: "先写下一个词，不用完整", done: false },
      { id: 2, text: "补一句身体里的感觉", done: false },
      { id: 3, text: "把这句话留在日记里", done: false },
    ],
  },
  {
    id: 3,
    title: "跟随呼吸 1 分钟",
    type: "正念练习",
    summary: "深呼吸，让肩膀慢慢放松",
    icon: "☁",
    energy: 2,
    done: false,
    steps: [
      { id: 1, text: "把肩膀放低一点", done: false },
      { id: 2, text: "吸气四拍，呼气六拍", done: false },
      { id: 3, text: "结束时轻轻眨一下眼", done: false },
    ],
  },
  {
    id: 4,
    title: "做一次五感落地",
    type: "正念练习",
    summary: "把注意力重新带回眼前",
    icon: "◌",
    energy: 3,
    done: false,
    steps: [
      { id: 1, text: "看见 5 样东西", done: false },
      { id: 2, text: "听见 4 种声音", done: false },
      { id: 3, text: "触摸 3 个真实物体", done: false },
    ],
  },
  {
    id: 5,
    title: "把一个想法写成事实和感受",
    type: "认知整理",
    summary: "分清发生了什么，和你感觉到了什么",
    icon: "✎",
    energy: 4,
    done: false,
    steps: [
      { id: 1, text: "写下脑中最响的一句话", done: false },
      { id: 2, text: "圈出其中能被验证的事实", done: false },
      { id: 3, text: "把剩下的部分标记为感受或猜测", done: false },
    ],
  },
  {
    id: 6,
    title: "给今天的自己一句宽容的话",
    type: "自我慈悲",
    summary: "像安慰朋友一样安慰自己",
    icon: "♡",
    energy: 3,
    done: false,
    steps: [
      { id: 1, text: "想象朋友也遇到了同样的事", done: false },
      { id: 2, text: "写一句你会对朋友说的话", done: false },
      { id: 3, text: "把称呼换成“我”再读一遍", done: false },
    ],
  },
  {
    id: 7,
    title: "找一件仍然重要的小事",
    type: "价值澄清",
    summary: "把今天还想靠近的一点点留住",
    icon: "✦",
    energy: 4,
    done: false,
    steps: [
      { id: 1, text: "写下今天还愿意靠近的一个方向", done: false },
      { id: 2, text: "把它缩小成 2 分钟能做的动作", done: false },
      { id: 3, text: "只做这个动作的一小部分", done: false },
    ],
  },
  {
    id: 8,
    title: "给身体做一次扫描",
    type: "身体觉察",
    summary: "留意身体最需要被照顾的地方",
    icon: "☼",
    energy: 3,
    done: false,
    steps: [
      { id: 1, text: "从额头慢慢注意到肩膀", done: false },
      { id: 2, text: "找到一个最紧的地方", done: false },
      { id: 3, text: "对那里呼一口长气", done: false },
    ],
  },
  {
    id: 9,
    title: "记录一件微小的感谢",
    type: "感恩练习",
    summary: "记住一个让今天轻一点的小瞬间",
    icon: "✿",
    energy: 2,
    done: false,
    steps: [
      { id: 1, text: "想起今天让你轻一点的瞬间", done: false },
      { id: 2, text: "写下它为什么有一点点珍贵", done: false },
      { id: 3, text: "不用总结，只停留几秒", done: false },
    ],
  },
  {
    id: 10,
    title: "把担心放进一个盒子",
    type: "情绪容纳",
    summary: "先把脑子里的重量暂时放一放",
    icon: "▣",
    energy: 3,
    done: false,
    steps: [
      { id: 1, text: "写下一个现在放不下的担心", done: false },
      { id: 2, text: "想象把它暂时放进盒子", done: false },
      { id: 3, text: "约定稍后再看，而不是现在解决", done: false },
    ],
  },
  {
    id: 11,
    title: "做一个很小的环境整理",
    type: "生活改善",
    summary: "把眼前的一小块地方整理舒服",
    icon: "☘",
    energy: 2,
    done: false,
    steps: [
      { id: 1, text: "只选桌面上的一个角落", done: false },
      { id: 2, text: "拿走一件不需要的东西", done: false },
      { id: 3, text: "留下一个让你舒服的小空间", done: false },
    ],
  },
  {
    id: 12,
    title: "写一张不用发送的信",
    type: "情绪表达",
    summary: "给心里的话一个出口",
    icon: "✉",
    energy: 4,
    done: false,
    steps: [
      { id: 1, text: "写给一个人、一件事，或过去的自己", done: false },
      { id: 2, text: "只写真感受，不整理措辞", done: false },
      { id: 3, text: "写完后决定保留、折起或删除", done: false },
    ],
  },
];

function withCustomTaskDefaults(task: Task): Task {
  if (!task.custom && task.id < 1000) return task;

  return {
    ...task,
    type: task.type || "我的每日任务",
    summary: task.summary || "给今天留下一件想温柔完成的小事",
    icon: task.icon || "☘",
  };
}

export function normalizeTasks(tasks: Task[]): Task[] {
  const builtinTasks = initialTasks.map((freshTask) => {
    const savedTask = tasks.find((task) => task.id === freshTask.id);
    if (!savedTask) return freshTask;

    return {
      ...freshTask,
      done: savedTask.done,
      steps: freshTask.steps.map((step) => {
        const savedStep = savedTask.steps?.find((item) => item.id === step.id);
        return { ...step, done: savedStep?.done ?? false };
      }),
    };
  });

  const customTasks = tasks
    .filter((task) => task.custom || task.id >= 1000)
    .map(withCustomTaskDefaults);

  return [...builtinTasks, ...customTasks];
}

function resetBuiltinTasks(tasks: Task[]): Task[] {
  const customTasks = tasks
    .filter((task) => task.custom || task.id >= 1000)
    .map(withCustomTaskDefaults);
  const refreshedBuiltinTasks = initialTasks.map((task) => ({
    ...task,
    done: false,
    steps: task.steps.map((step) => ({ ...step, done: false })),
  }));

  return [...refreshedBuiltinTasks, ...customTasks];
}

// Built-in daily tasks refresh once per calendar day, while custom tasks stay untouched.
export function hydrateTasksForDate(tasks: Task[], lastResetDate: string, todayKey: string): Task[] {
  const normalizedTasks = normalizeTasks(tasks);

  if (lastResetDate === todayKey) {
    return normalizedTasks;
  }

  return resetBuiltinTasks(normalizedTasks);
}
