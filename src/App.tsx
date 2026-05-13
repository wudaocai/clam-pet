import { type CSSProperties, useEffect, useMemo, useRef, useState } from "react";
import onboardingGuideImage from "./assets/onboarding-guide.png";

type View = "home" | "tasks" | "mood" | "toolkit" | "wardrobe";
type PetMood = "calm" | "lazy" | "happy";
type MoodId = string;
type PetAction = "idle" | "pat" | "nuzzle" | "celebrate";
type SoundMode = "rain" | "forest" | "night";
type BreathModeId = "soft" | "box" | "release" | "sleep";
type ToolkitPanel = "sound" | "breath" | "soothe";
type ThemeId = "mist" | "meadow" | "sunset";
type SoundCategory =
  | "animals"
  | "binaural"
  | "nature"
  | "noise"
  | "places"
  | "rain"
  | "things"
  | "transport"
  | "urban";

type MoodEntry = {
  mood: MoodId;
  diary: string;
  updatedAt: string;
};

type MoodOption = {
  id: MoodId;
  label: string;
  color: string;
  custom?: boolean;
};

type CalendarDay = {
  date: Date;
  key: string;
  day: number;
  inMonth: boolean;
  isToday: boolean;
};

type TaskStep = {
  id: number;
  text: string;
  done: boolean;
};

type Task = {
  id: number;
  title: string;
  type: string;
  energy: number;
  done: boolean;
  steps: TaskStep[];
  custom?: boolean;
};

type SootheNote = {
  id: string;
  note: string;
  prompt: string;
  quote: string;
  createdAt: string;
};

type BreathPhase = {
  label: string;
  seconds: number;
  instruction: string;
};

type BreathMode = {
  id: BreathModeId;
  name: string;
  detail: string;
  phases: BreathPhase[];
};

type SoundTrack = {
  id: string;
  category: SoundCategory;
  name: string;
  src: string;
  icon: string;
};

const initialTasks: Task[] = [
  {
    id: 1,
    title: "喝一杯温水",
    type: "生活改善",
    energy: 2,
    done: false,
    steps: [
      { id: 1, text: "找一个顺手的杯子", done: false },
      { id: 2, text: "慢慢喝三口", done: false },
      { id: 3, text: "感受喉咙和胃变暖", done: false },
    ],
  },
  {
    id: 2,
    title: "写下此刻的感受",
    type: "情绪记录",
    energy: 3,
    done: false,
    steps: [
      { id: 1, text: "先写一个词，不用完整", done: false },
      { id: 2, text: "补一句身体里的感觉", done: false },
      { id: 3, text: "把这句话留在日记里", done: false },
    ],
  },
  {
    id: 3,
    title: "跟随呼吸 1 分钟",
    type: "正念练习",
    energy: 2,
    done: false,
    steps: [
      { id: 1, text: "把肩膀放低一点", done: false },
      { id: 2, text: "吸气四拍，呼气六拍", done: false },
      { id: 3, text: "结束时轻轻眨眨眼", done: false },
    ],
  },
  {
    id: 4,
    title: "做一次五感落地",
    type: "正念练习",
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
    energy: 3,
    done: false,
    steps: [
      { id: 1, text: "想象朋友也遇到同样的事", done: false },
      { id: 2, text: "写一句你会对朋友说的话", done: false },
      { id: 3, text: "把称呼换成“我”再读一遍", done: false },
    ],
  },
  {
    id: 7,
    title: "找一件仍然重要的小事",
    type: "价值澄清",
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
    energy: 2,
    done: false,
    steps: [
      { id: 1, text: "想起今天让你轻一点的瞬间", done: false },
      { id: 2, text: "写下它为什么有一点点珍贵", done: false },
      { id: 3, text: "不需要总结，只停留几秒", done: false },
    ],
  },
  {
    id: 10,
    title: "把担心放进一个盒子",
    type: "情绪容纳",
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
    energy: 4,
    done: false,
    steps: [
      { id: 1, text: "写给一个人、一件事，或过去的自己", done: false },
      { id: 2, text: "只写真正感受，不整理措辞", done: false },
      { id: 3, text: "写完后决定保留、折起或删除", done: false },
    ],
  },
];

const defaultMoodOptions: MoodOption[] = [
  { id: "calm", label: "平静", color: "oklch(0.82 0.05 235)" },
  { id: "lazy", label: "慵懒", color: "oklch(0.88 0.034 78)" },
  { id: "happy", label: "开心", color: "oklch(0.9 0.082 68)" },
];

const moodColorPresets = [
  "#8FB7FF",
  "#A8D8C8",
  "#FFD58F",
  "#FFB8C7",
  "#B8C0FF",
  "#CDB7F6",
  "#FFCAA8",
  "#9ED4A8",
];

const defaultCustomMoodHsl = hexToHsl("#8FB7FF");

const soundCategoryOrder: SoundCategory[] = [
  "animals",
  "binaural",
  "nature",
  "noise",
  "places",
  "rain",
  "things",
  "transport",
  "urban",
];

const soundCategoryLabels: Record<SoundCategory, string> = {
  animals: "动物",
  binaural: "双耳节拍",
  nature: "自然",
  noise: "噪音",
  places: "场所",
  rain: "雨声",
  things: "物件",
  transport: "交通",
  urban: "城市",
};

const soundTrackMeta: Record<string, { label: string; icon: string }> = {
  "ambulance-siren": { label: "救护车警笛", icon: "🚑" },
  airport: { label: "机场", icon: "✈" },
  airplane: { label: "飞机", icon: "✈" },
  beehive: { label: "蜂巢", icon: "🐝" },
  "binaural-alpha": { label: "阿尔法双耳节拍", icon: "α" },
  "binaural-beta": { label: "贝塔双耳节拍", icon: "β" },
  "binaural-delta": { label: "德尔塔双耳节拍", icon: "δ" },
  "binaural-gamma": { label: "伽马双耳节拍", icon: "γ" },
  "binaural-theta": { label: "西塔双耳节拍", icon: "θ" },
  birds: { label: "鸟鸣", icon: "🐦" },
  "boiling-water": { label: "沸水", icon: "♨" },
  "brown-noise": { label: "棕噪音", icon: "◫" },
  bubbles: { label: "气泡", icon: "○" },
  "busy-street": { label: "繁忙街道", icon: "▥" },
  cafe: { label: "咖啡馆", icon: "☕" },
  campfire: { label: "篝火", icon: "🔥" },
  carousel: { label: "旋转木马", icon: "🎠" },
  "cat-purring": { label: "猫咪呼噜", icon: "🐱" },
  "ceiling-fan": { label: "吊扇", icon: "🌀" },
  chickens: { label: "鸡群", icon: "🐔" },
  church: { label: "教堂", icon: "⛪" },
  clock: { label: "钟表", icon: "🕘" },
  "construction-site": { label: "施工现场", icon: "🏗" },
  cows: { label: "奶牛", icon: "🐮" },
  crickets: { label: "蟋蟀", icon: "🦗" },
  crows: { label: "乌鸦", icon: "🪶" },
  crowd: { label: "人群", icon: "👥" },
  "crowded-bar": { label: "热闹酒吧", icon: "🍸" },
  "dog-barking": { label: "犬吠", icon: "🐶" },
  droplets: { label: "水滴", icon: "💧" },
  dryer: { label: "烘干机", icon: "◌" },
  fireworks: { label: "烟火", icon: "✦" },
  frog: { label: "青蛙", icon: "🐸" },
  "heavy-rain": { label: "大雨", icon: "🌧" },
  highway: { label: "高速公路", icon: "🛣" },
  "horse-gallop": { label: "马蹄", icon: "🐎" },
  "howling-wind": { label: "呼啸风声", icon: "༄" },
  "inside-a-train": { label: "车厢内部", icon: "🚆" },
  jungle: { label: "丛林", icon: "🌿" },
  keyboard: { label: "键盘", icon: "⌨" },
  laboratory: { label: "实验室", icon: "⚗" },
  "laundry-room": { label: "洗衣房", icon: "🧺" },
  library: { label: "图书馆", icon: "📚" },
  "light-rain": { label: "小雨", icon: "☔" },
  "morse-code": { label: "摩斯电码", icon: "⌁" },
  "night-village": { label: "夜晚村落", icon: "☾" },
  office: { label: "办公室", icon: "🗂" },
  owl: { label: "猫头鹰", icon: "🦉" },
  paper: { label: "翻纸声", icon: "📄" },
  "pink-noise": { label: "粉噪音", icon: "◨" },
  restaurant: { label: "餐厅", icon: "🍽" },
  river: { label: "河流", icon: "≈" },
  road: { label: "道路环境", icon: "🛣" },
  "rain-on-car-roof": { label: "车顶雨声", icon: "🚗" },
  "rain-on-leaves": { label: "叶上雨声", icon: "🍃" },
  "rain-on-tent": { label: "帐篷雨声", icon: "⛺" },
  "rain-on-umbrella": { label: "雨伞雨声", icon: "☂" },
  "rain-on-window": { label: "窗边雨声", icon: "🪟" },
  "rowing-boat": { label: "划船", icon: "🚣" },
  sailboat: { label: "帆船", icon: "⛵" },
  seagulls: { label: "海鸥", icon: "🕊" },
  sheep: { label: "绵羊", icon: "🐑" },
  "singing-bowl": { label: "颂钵", icon: "◍" },
  "slide-projector": { label: "幻灯机", icon: "📽" },
  submarine: { label: "潜水艇", icon: "⚓" },
  "subway-station": { label: "地铁站", icon: "🚇" },
  supermarket: { label: "超市", icon: "🛒" },
  temple: { label: "寺庙", icon: "🏯" },
  thunder: { label: "雷声", icon: "⚡" },
  traffic: { label: "车流", icon: "🚘" },
  train: { label: "火车", icon: "🚆" },
  "tuning-radio": { label: "调频收音机", icon: "📻" },
  typewriter: { label: "打字机", icon: "✎" },
  underwater: { label: "水下", icon: "🐠" },
  "vinyl-effect": { label: "黑胶底噪", icon: "◉" },
  "walk-in-snow": { label: "踏雪", icon: "❄" },
  "walk-on-gravel": { label: "碎石路", icon: "⋯" },
  "walk-on-leaves": { label: "落叶小径", icon: "🍂" },
  "washing-machine": { label: "洗衣机", icon: "🫧" },
  waterfall: { label: "瀑布", icon: "⟱" },
  waves: { label: "海浪", icon: "≋" },
  whale: { label: "鲸歌", icon: "🐋" },
  "white-noise": { label: "白噪音", icon: "▤" },
  wind: { label: "风声", icon: "〰" },
  "wind-chimes": { label: "风铃", icon: "🎐" },
  "wind-in-trees": { label: "林间风声", icon: "🌲" },
  "windshield-wipers": { label: "雨刷器", icon: "⟍" },
  wolf: { label: "狼嚎", icon: "🐺" },
  woodpecker: { label: "啄木鸟", icon: "🪵" },
};

const soundFiles = import.meta.glob("./assets/sounds/*/*.{mp3,wav}", {
  eager: true,
  import: "default",
}) as Record<string, string>;

const allSoundTracks: SoundTrack[] = Object.entries(soundFiles)
  .map(([path, src]) => {
    const match = path.match(/\.\/assets\/sounds\/([^/]+)\/([^/]+)\.(mp3|wav)$/i);
    if (!match) return null;
    const [, category, rawName] = match;
    if (!soundCategoryOrder.includes(category as SoundCategory)) return null;
    const meta = soundTrackMeta[rawName] ?? {
      label: rawName
        .split("-")
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(" "),
      icon: "♪",
    };

    return {
      id: `${category}/${rawName}`,
      category: category as SoundCategory,
      name: meta.label,
      src,
      icon: meta.icon,
    } satisfies SoundTrack;
  })
  .filter((track): track is SoundTrack => track !== null)
  .sort((a, b) => {
    const categoryDiff = soundCategoryOrder.indexOf(a.category) - soundCategoryOrder.indexOf(b.category);
    return categoryDiff !== 0 ? categoryDiff : a.name.localeCompare(b.name);
  });

const weekLabels = ["一", "二", "三", "四", "五", "六", "日"];

function formatDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatDateLabel(date: Date): string {
  return new Intl.DateTimeFormat("zh-CN", {
    month: "long",
    day: "numeric",
    weekday: "long",
  }).format(date);
}

function formatMonthLabel(date: Date): string {
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "long",
  }).format(date);
}

function buildCalendarDays(monthDate: Date): CalendarDay[] {
  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();
  const firstDate = new Date(year, month, 1);
  const firstWeekday = (firstDate.getDay() + 6) % 7;
  const startDate = new Date(year, month, 1 - firstWeekday);
  const todayKey = formatDateKey(new Date());

  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + index);
    const key = formatDateKey(date);

    return {
      date,
      key,
      day: date.getDate(),
      inMonth: date.getMonth() === month,
      isToday: key === todayKey,
    };
  });
}

const soundModes: Record<SoundMode, { name: string; hint: string; frequency: number; gain: number }> = {
  rain: { name: "细雨窗边", hint: "均匀、轻柔，适合焦躁时慢慢降速。", frequency: 900, gain: 0.04 },
  forest: { name: "林间风声", hint: "更明亮一点，像树叶在远处晃动。", frequency: 1400, gain: 0.032 },
  night: { name: "夜色低频", hint: "低一点、暗一点，适合睡前留白。", frequency: 420, gain: 0.035 },
};

const breathModes: BreathMode[] = [
  {
    id: "soft",
    name: "柔和呼吸",
    detail: "吸 4 秒，呼 6 秒",
    phases: [
      { label: "吸气", seconds: 4, instruction: "像闻到一杯温热的茶" },
      { label: "呼气", seconds: 6, instruction: "慢慢把肩膀交给椅背" },
    ],
  },
  {
    id: "box",
    name: "方块呼吸",
    detail: "4-4-4-4，适合需要稳定时",
    phases: [
      { label: "吸气", seconds: 4, instruction: "轻轻吸到胸口变宽" },
      { label: "停留", seconds: 4, instruction: "不憋紧，只是停一停" },
      { label: "呼气", seconds: 4, instruction: "让气息自己离开" },
      { label: "停留", seconds: 4, instruction: "在空白里休息一下" },
    ],
  },
  {
    id: "release",
    name: "释放呼吸",
    detail: "吸 3 秒，长呼 7 秒",
    phases: [
      { label: "吸气", seconds: 3, instruction: "只吸到舒服的位置" },
      { label: "长呼气", seconds: 7, instruction: "把紧绷慢慢放低一点" },
    ],
  },
  {
    id: "sleep",
    name: "睡前呼吸",
    detail: "吸 4 秒，停 2 秒，呼 8 秒",
    phases: [
      { label: "吸气", seconds: 4, instruction: "安静地吸进一点空气" },
      { label: "停留", seconds: 2, instruction: "像云停在窗边" },
      { label: "呼气", seconds: 8, instruction: "尽量慢，不追求完美" },
    ],
  },
];

const soothePrompts = [
  "现在最需要被允许存在的感受是什么？",
  "如果只把今天缩小成一个很小的动作，会是什么？",
  "这件事里，有哪一部分是事实，哪一部分是我的担心？",
  "我可以对自己说一句不责备的话吗？",
  "身体哪个地方最想被照顾一下？",
];

const gentleQuotes = [
  "你不需要把今天过得很漂亮，能停下来已经很好。",
  "情绪不是麻烦，它只是来提醒你：这里需要被看见。",
  "慢一点不是退步，是身体在帮你保留力气。",
  "先不用解决全部，先陪自己待一小会儿。",
  "你可以重新开始很多次，每一次都不算晚。",
];

const headerEncouragements = [
  "今天也可以慢一点",
  "先照顾自己，再想别的事",
  "你已经做得够多了",
  "现在这样，也已经很好",
  "累的时候，先歇一会儿",
  "不用赶路，也算在前进",
  "给自己一点温柔的时间",
  "慢慢来，我们不着急",
];

const themeOptions: Record<ThemeId, { name: string; hint: string }> = {
  mist: { name: "海盐雾", hint: "清冷雾蓝，像安静的清晨海风。" },
  meadow: { name: "森林茶", hint: "柔绿和茶褐，像能坐下来的草地。" },
  sunset: { name: "落日奶油", hint: "暖杏与焦糖，把页面晒得松一点。" },
};

const emergencyHelpCards = [
  {
    title: "全国统一心理援助热线",
    content: "12356",
    detail: "2025年5月1日起，全国31个省（自治区、直辖市）已统一开通。",
  },
  {
    title: "如果你现在很危险",
    content: "110 / 120",
    detail: "如果有自伤、伤人或生命危险，请立刻拨打报警或急救电话。",
  },
  {
    title: "也可以先做这一步",
    content: "联系身边可信任的人",
    detail: "让对方陪着你，或者帮你一起拨打热线，不必一个人扛着。",
  },
] as const;

function readState<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function normalizeTasks(tasks: Task[]): Task[] {
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

  const customTasks = tasks.filter((task) => task.custom || task.id >= 1000);
  return [...builtinTasks, ...customTasks];
}

function resolvePetMood(moodId: MoodId): PetMood {
  if (moodId === "happy" || moodId === "lazy") return moodId;
  return "calm";
}

function pickRandomHeaderMessage(previous?: string) {
  if (headerEncouragements.length <= 1) return headerEncouragements[0];
  let next = headerEncouragements[Math.floor(Math.random() * headerEncouragements.length)];
  while (next === previous) {
    next = headerEncouragements[Math.floor(Math.random() * headerEncouragements.length)];
  }
  return next;
}

function groupSoundTracks(tracks: SoundTrack[]) {
  return soundCategoryOrder.map((category) => ({
    category,
    label: soundCategoryLabels[category],
    tracks: tracks.filter((track) => track.category === category),
  }));
}

function hexToHsl(hex: string): { h: number; s: number; l: number } {
  const normalized = hex.replace("#", "");
  const safeHex = normalized.length === 3
    ? normalized.split("").map((char) => `${char}${char}`).join("")
    : normalized;
  const red = Number.parseInt(safeHex.slice(0, 2), 16) / 255;
  const green = Number.parseInt(safeHex.slice(2, 4), 16) / 255;
  const blue = Number.parseInt(safeHex.slice(4, 6), 16) / 255;
  const max = Math.max(red, green, blue);
  const min = Math.min(red, green, blue);
  const delta = max - min;
  const lightness = (max + min) / 2;
  let hue = 0;
  let saturation = 0;

  if (delta !== 0) {
    saturation = delta / (1 - Math.abs(2 * lightness - 1));
    switch (max) {
      case red:
        hue = 60 * (((green - blue) / delta) % 6);
        break;
      case green:
        hue = 60 * ((blue - red) / delta + 2);
        break;
      default:
        hue = 60 * ((red - green) / delta + 4);
        break;
    }
  }

  return {
    h: Math.round((hue + 360) % 360),
    s: Math.round(saturation * 100),
    l: Math.round(lightness * 100),
  };
}

function hslToCss(h: number, s: number, l: number): string {
  return `hsl(${h} ${s}% ${l}%)`;
}

function createNoiseTrack(
  context: AudioContext,
  mode: (typeof soundModes)[SoundMode],
): { source: AudioBufferSourceNode; gain: GainNode } {
  const buffer = context.createBuffer(1, context.sampleRate * 2, context.sampleRate);
  const data = buffer.getChannelData(0);

  for (let index = 0; index < data.length; index += 1) {
    data[index] = Math.random() * 2 - 1;
  }

  const source = context.createBufferSource();
  const filter = context.createBiquadFilter();
  const gain = context.createGain();

  source.buffer = buffer;
  source.loop = true;
  filter.type = "lowpass";
  filter.frequency.value = mode.frequency;
  gain.gain.value = mode.gain;

  source.connect(filter);
  filter.connect(gain);
  gain.connect(context.destination);

  return { source, gain };
}

function Pet({
  mood,
  action,
  outfit,
  onPat,
  onNuzzle,
}: {
  mood: PetMood;
  action: PetAction;
  outfit: string;
  onPat: () => void;
  onNuzzle: () => void;
}) {
  return (
    <div
      className={`pet-stage pet-${mood} outfit-${outfit} pet-action-${action}`}
      aria-label={`Momo 当前状态：${defaultMoodOptions.find((item) => item.id === mood)?.label ?? "平静"}`}
    >
      <span className="leaf leaf-one" />
      <span className="leaf leaf-two" />
      <span className="leaf leaf-three" />
      <span className="spark spark-one" />
      <span className="spark spark-two" />
      <span className="spark spark-three" />
      <span className="heart-bubble heart-one" />
      <span className="heart-bubble heart-two" />
      <span className="pet-paw paw-left" />
      <span className="pet-paw paw-right" />
      <div className="pet-shadow" />
      <button className="pet-touch pet-touch-head" type="button" onClick={onPat} aria-label="摸摸 Momo 的头" />
      <button className="pet-touch pet-touch-side" type="button" onClick={onNuzzle} aria-label="蹭蹭 Momo" />
      <div className="pet-body">
        <span className="pet-ear pet-ear-left" />
        <span className="pet-ear pet-ear-right" />
        <span className="clothing clothing-hat" />
        <span className="clothing clothing-scarf" />
        <span className="clothing clothing-vest" />
        <span className="clothing clothing-bag" />
        <span className="clothing clothing-charm" />
        <span className="pet-tail" />
        <span className="pet-eye eye-left" />
        <span className="pet-eye eye-right" />
        <span className="pet-mouth" />
        <span className="pet-blush blush-left" />
        <span className="pet-blush blush-right" />
        <span className="pet-leaf" />
      </div>
      <span className="pet-hint">摸摸头</span>
    </div>
  );
}

export default function App() {
  const [view, setView] = useState<View>("home");
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [closingOnboarding, setClosingOnboarding] = useState(false);
  const [tasks, setTasks] = useState<Task[]>(() =>
    normalizeTasks(readState("calmpet.tasks", initialTasks)),
  );
  const [mood, setMood] = useState<MoodId>(() => readState("calmpet.mood", "calm"));
  const [selectedDateKey, setSelectedDateKey] = useState(() => formatDateKey(new Date()));
  const [visibleMonth, setVisibleMonth] = useState(() => new Date(new Date().getFullYear(), new Date().getMonth(), 1));
  const [moodEntries, setMoodEntries] = useState<Record<string, MoodEntry>>(() =>
    readState("calmpet.moodEntries", {}),
  );
  const [customMoods, setCustomMoods] = useState<MoodOption[]>(() => readState("calmpet.customMoods", []));
  const [customMoodOpen, setCustomMoodOpen] = useState(false);
  const [customMoodLabel, setCustomMoodLabel] = useState("");
  const [customMoodHue, setCustomMoodHue] = useState(defaultCustomMoodHsl.h);
  const [customMoodSaturation, setCustomMoodSaturation] = useState(defaultCustomMoodHsl.s);
  const [customMoodLightness, setCustomMoodLightness] = useState(defaultCustomMoodHsl.l);
  const [outfit] = useState(() => readState("calmpet.outfit", "garden"));
  const [activeTaskId, setActiveTaskId] = useState(1);
  const [feedback, setFeedback] = useState("");
  const [petAction, setPetAction] = useState<PetAction>("idle");
  const [breathing, setBreathing] = useState(false);
  const [activeBreathMode, setActiveBreathMode] = useState<BreathModeId>("soft");
  const [breathPhase, setBreathPhase] = useState(0);
  const [activeSoundTrackIds, setActiveSoundTrackIds] = useState<string[]>([]);
  const [soundMasterVolume, setSoundMasterVolume] = useState(() => readState("calmpet.soundMasterVolume", 42));
  const [expandedSoundCategories, setExpandedSoundCategories] = useState<Record<SoundCategory, boolean>>({
    animals: false,
    binaural: false,
    nature: false,
    noise: false,
    places: false,
    rain: false,
    things: false,
    transport: false,
    urban: false,
  });
  const [toolkitNote, setToolkitNote] = useState(() =>
    readState("calmpet.toolkitNote", "我现在感觉……"),
  );
  const [sootheArchive, setSootheArchive] = useState<SootheNote[]>(() => readState("calmpet.sootheArchive", []));
  const [editingSootheId, setEditingSootheId] = useState<string | null>(null);
  const [theme, setTheme] = useState<ThemeId>(() => readState("calmpet.theme", "mist"));
  const [headerMessage, setHeaderMessage] = useState(() => pickRandomHeaderMessage());
  const [showEmergencyHelp, setShowEmergencyHelp] = useState(false);
  const [customTaskTitle, setCustomTaskTitle] = useState("");
  const [customTaskSteps, setCustomTaskSteps] = useState(["", "", ""]);
  const [activePrompt, setActivePrompt] = useState(soothePrompts[0]);
  const [activeQuote, setActiveQuote] = useState(gentleQuotes[0]);
  const [promptSwapTick, setPromptSwapTick] = useState(0);
  const [quoteSwapTick, setQuoteSwapTick] = useState(0);
  const [toolkitPanel, setToolkitPanel] = useState<ToolkitPanel>(() =>
    readState("calmpet.toolkitPanel", "breath"),
  );
  const [savingNote, setSavingNote] = useState(false);
  const appRef = useRef<HTMLElement | null>(null);
  const soundElementsRef = useRef<Record<string, HTMLAudioElement>>({});
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioTrackRef = useRef<{ source: AudioBufferSourceNode; gain: GainNode } | null>(null);
  const moodDragStartXRef = useRef(0);
  const moodDragStartYRef = useRef(0);
  const moodDragStartScrollRef = useRef(0);
  const moodDraggingRef = useRef(false);
  const moodDragEnabledRef = useRef(false);
  const moodDragPointerIdRef = useRef<number | null>(null);
  const moodDragPreventClickRef = useRef(false);
  const activeSound: SoundMode = "rain";
  const soundVolume = soundMasterVolume;
  const setSoundVolume = setSoundMasterVolume;
  const setActiveSound = (_sound: SoundMode | null) => {};
  const moodOptions = useMemo(() => [...defaultMoodOptions, ...customMoods], [customMoods]);
  const moodOptionMap = useMemo(
    () => Object.fromEntries(moodOptions.map((item) => [item.id, item])),
    [moodOptions],
  );
  const customMoodColor = useMemo(
    () => hslToCss(customMoodHue, customMoodSaturation, customMoodLightness),
    [customMoodHue, customMoodSaturation, customMoodLightness],
  );
  const currentMoodLabel = moodOptionMap[mood]?.label ?? "平静";
  const currentPetMood = resolvePetMood(mood);

  const energy = tasks.filter((task) => task.done).reduce((sum, task) => sum + task.energy, 36);
  const activeTask = tasks.find((task) => task.id === activeTaskId) ?? tasks[0];
  const visibleHomeTasks = tasks.filter((task) => !task.done).slice(0, 2);
  const selectedDate = useMemo(() => {
    const [year, month, day] = selectedDateKey.split("-").map(Number);
    return new Date(year, month - 1, day);
  }, [selectedDateKey]);
  const selectedEntry = moodEntries[selectedDateKey];
  const selectedDiary = selectedEntry?.diary ?? "";
  const calendarDays = useMemo(() => buildCalendarDays(visibleMonth), [visibleMonth]);
  const breathMode = breathModes.find((item) => item.id === activeBreathMode) ?? breathModes[0];
  const currentBreathPhase = breathMode.phases[breathPhase % breathMode.phases.length];
  const breathTotalSeconds = useMemo(
    () => breathMode.phases.reduce((sum, phase) => sum + phase.seconds, 0),
    [breathMode],
  );
  const groupedSoundTracks = useMemo(() => groupSoundTracks(allSoundTracks), []);

  useEffect(() => localStorage.setItem("calmpet.tasks", JSON.stringify(tasks)), [tasks]);
  useEffect(() => localStorage.setItem("calmpet.mood", JSON.stringify(mood)), [mood]);
  useEffect(() => localStorage.setItem("calmpet.moodEntries", JSON.stringify(moodEntries)), [moodEntries]);
  useEffect(() => localStorage.setItem("calmpet.customMoods", JSON.stringify(customMoods)), [customMoods]);
  useEffect(() => localStorage.setItem("calmpet.soundMasterVolume", JSON.stringify(soundMasterVolume)), [soundMasterVolume]);
  useEffect(() => localStorage.setItem("calmpet.toolkitPanel", JSON.stringify(toolkitPanel)), [toolkitPanel]);
  useEffect(() => localStorage.setItem("calmpet.toolkitNote", JSON.stringify(toolkitNote)), [toolkitNote]);
  useEffect(() => localStorage.setItem("calmpet.sootheArchive", JSON.stringify(sootheArchive)), [sootheArchive]);
  useEffect(() => localStorage.setItem("calmpet.theme", JSON.stringify(theme)), [theme]);
  useEffect(() => {
    setHeaderMessage((current) => pickRandomHeaderMessage(current));
  }, [view]);

  useEffect(() => {
    if (!feedback) return;
    const timer = window.setTimeout(() => setFeedback(""), 1800);
    return () => window.clearTimeout(timer);
  }, [feedback]);

  useEffect(() => {
    if (!breathing) return;
    const timer = window.setTimeout(() => {
      setBreathPhase((phase) => (phase + 1) % breathMode.phases.length);
    }, currentBreathPhase.seconds * 1000);
    return () => window.clearTimeout(timer);
  }, [breathing, breathMode.phases.length, currentBreathPhase.seconds]);

  useEffect(() => {
    const volume = soundMasterVolume / 100;
    Object.values(soundElementsRef.current).forEach((audio) => {
      audio.volume = volume;
    });
  }, [soundMasterVolume]);

  useEffect(() => {
    const app = appRef.current;
    if (app === null) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const appElement = app;

    function handlePointerMove(event: PointerEvent) {
      appElement.style.setProperty("--cursor-x", `${event.clientX}px`);
      appElement.style.setProperty("--cursor-y", `${event.clientY}px`);
      appElement.dataset.cursorVisible = "true";
      appElement.dataset.cursorPressed = event.buttons > 0 ? "true" : "false";
    }

    function handlePointerDown() {
      appElement.dataset.cursorPressed = "true";
    }

    function handlePointerUp() {
      appElement.dataset.cursorPressed = "false";
    }

    function handlePointerLeave() {
      appElement.dataset.cursorVisible = "false";
      appElement.dataset.cursorPressed = "false";
    }

    appElement.addEventListener("pointermove", handlePointerMove);
    appElement.addEventListener("pointerdown", handlePointerDown);
    appElement.addEventListener("pointerup", handlePointerUp);
    appElement.addEventListener("pointerleave", handlePointerLeave);

    return () => {
      appElement.removeEventListener("pointermove", handlePointerMove);
      appElement.removeEventListener("pointerdown", handlePointerDown);
      appElement.removeEventListener("pointerup", handlePointerUp);
      appElement.removeEventListener("pointerleave", handlePointerLeave);
    };
  }, []);

  useEffect(() => {
    return () => {
      Object.values(soundElementsRef.current).forEach((audio) => {
        audio.pause();
        audio.currentTime = 0;
      });
    };
  }, []);

  function playPetAction(action: PetAction, message: string, duration = 1000) {
    setFeedback(message);
    setPetAction(action);
    window.setTimeout(() => setPetAction("idle"), duration);
  }

  function openTask(id: number) {
    setActiveTaskId(id);
    setView("tasks");
  }

  function completeTask(id: number) {
    const task = tasks.find((item) => item.id === id);
    if (!task) return;

    if (task.done) {
      setActiveTaskId(id);
      playPetAction("nuzzle", "这个小任务已经被好好收下了");
      return;
    }

    setTasks((current) =>
      current.map((item) =>
        item.id === id
          ? {
              ...item,
              done: true,
              steps: item.steps.map((step) => ({ ...step, done: true })),
            }
          : item,
      ),
    );
    setMood("happy");
    setActiveTaskId(id);
    playPetAction("celebrate", `Momo 开心地蹦了一下，能量 +${task.energy}`, 1300);
  }

  function toggleStep(taskId: number, stepId: number) {
    let completedAll = false;

    setTasks((current) =>
      current.map((task) => {
        if (task.id !== taskId) return task;

        const steps = task.steps.map((step) =>
          step.id === stepId ? { ...step, done: !step.done } : step,
        );
        completedAll = steps.every((step) => step.done);

        return {
          ...task,
          steps,
          done: completedAll,
        };
      }),
    );

    setMood(completedAll ? "happy" : "calm");
    playPetAction(completedAll ? "celebrate" : "pat", completedAll ? "这件小事完整完成了" : "很好，完成了其中一小步");
  }

  function patPet() {
    setMood("happy");
    playPetAction("pat", "Momo 被摸摸头，眼睛眯起来了");
  }

  function nuzzlePet() {
    setMood("happy");
    playPetAction("nuzzle", "Momo 轻轻蹭了蹭你");
  }

  function selectMoodForDate(nextMood: MoodId) {
    setMood(nextMood);
    setMoodEntries((current) => ({
      ...current,
      [selectedDateKey]: {
        mood: nextMood,
        diary: current[selectedDateKey]?.diary ?? "",
        updatedAt: new Date().toISOString(),
      },
    }));
    playPetAction("pat", `${formatDateLabel(selectedDate)}：${moodOptionMap[nextMood]?.label ?? nextMood}`);
  }

  function updateDiaryForDate(value: string) {
    setMoodEntries((current) => ({
      ...current,
      [selectedDateKey]: {
        mood: current[selectedDateKey]?.mood ?? mood,
        diary: value,
        updatedAt: new Date().toISOString(),
      },
    }));
  }

  function moveMonth(offset: number) {
    setVisibleMonth((current) => new Date(current.getFullYear(), current.getMonth() + offset, 1));
  }

  function addCustomMood() {
    const label = customMoodLabel.trim();
    if (!label) {
      setFeedback("先写下这个情绪的名字吧");
      return;
    }

    const nextMood: MoodOption = {
      id: `custom-${Date.now()}`,
      label,
      color: customMoodColor,
      custom: true,
    };

    setCustomMoods((current) => [...current, nextMood].slice(-8));
    setCustomMoodLabel("");
    setCustomMoodHue(defaultCustomMoodHsl.h);
    setCustomMoodSaturation(defaultCustomMoodHsl.s);
    setCustomMoodLightness(defaultCustomMoodHsl.l);
    setFeedback(`已加入自定义情绪：${label}`);
  }

  function applyCustomMoodPreset(color: string) {
    const next = hexToHsl(color);
    setCustomMoodHue(next.h);
    setCustomMoodSaturation(next.s);
    setCustomMoodLightness(next.l);
  }

  function startMoodPickerDrag(event: React.PointerEvent<HTMLDivElement>) {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    const target = event.target as HTMLElement;
    const startedOnButton = Boolean(target.closest("button"));
    moodDragStartXRef.current = event.clientX;
    moodDragStartYRef.current = event.clientY;
    moodDragStartScrollRef.current = event.currentTarget.scrollLeft;
    moodDraggingRef.current = false;
    moodDragEnabledRef.current = event.pointerType !== "mouse" || !startedOnButton;
    moodDragPointerIdRef.current = event.pointerId;
    moodDragPreventClickRef.current = false;
  }

  function moveMoodPickerDrag(event: React.PointerEvent<HTMLDivElement>) {
    if (moodDragPointerIdRef.current !== event.pointerId) return;
    if (!moodDragEnabledRef.current) return;
    const deltaX = event.clientX - moodDragStartXRef.current;
    const deltaY = event.clientY - moodDragStartYRef.current;
    if (!moodDraggingRef.current && Math.abs(deltaX) > 12 && Math.abs(deltaX) > Math.abs(deltaY) + 2) {
      moodDraggingRef.current = true;
      moodDragPreventClickRef.current = true;
      event.currentTarget.classList.add("dragging");
    }
    if (!moodDraggingRef.current) return;
    event.currentTarget.scrollLeft = moodDragStartScrollRef.current - deltaX;
  }

  function endMoodPickerDrag(event: React.PointerEvent<HTMLDivElement>) {
    moodDraggingRef.current = false;
    moodDragEnabledRef.current = false;
    moodDragPointerIdRef.current = null;
    event.currentTarget.classList.remove("dragging");
  }

  function handleMoodButtonClick(event: React.MouseEvent<HTMLButtonElement>, moodId: MoodId) {
    if (moodDragPreventClickRef.current) {
      event.preventDefault();
      moodDragPreventClickRef.current = false;
      return;
    }
    selectMoodForDate(moodId);
  }

  function updateCustomTaskStep(index: number, value: string) {
    setCustomTaskSteps((current) =>
      current.map((step, stepIndex) => (stepIndex === index ? value : step)),
    );
  }

  function addCustomTask() {
    const title = customTaskTitle.trim();
    if (!title) {
      setFeedback("先写下你想照顾的一件小事");
      return;
    }

    const steps = customTaskSteps
      .map((step) => step.trim())
      .filter(Boolean)
      .slice(0, 3);
    const taskSteps = (steps.length ? steps : ["轻轻开始这件事"]).map((text, index) => ({
      id: index + 1,
      text,
      done: false,
    }));
    const nextTask: Task = {
      id: Date.now(),
      title,
      type: "我的每日任务",
      energy: 3,
      done: false,
      custom: true,
      steps: taskSteps,
    };

    setTasks((current) => [...current, nextTask]);
    setActiveTaskId(nextTask.id);
    setCustomTaskTitle("");
    setCustomTaskSteps(["", "", ""]);
    playPetAction("nuzzle", "Momo 帮你把这件小事放进今日照顾里");
  }

  function clearCustomTasks() {
    setTasks((current) => current.filter((task) => !task.custom && task.id < 1000));
    setActiveTaskId(1);
    setFeedback("自定义任务已经被轻轻收起来了");
  }

  function clearMoodJournal() {
    setMoodEntries({});
    setFeedback("情绪日记已经清空，只保留今天重新开始的空间");
  }

  function openHelpResources() {
    setShowEmergencyHelp(true);
  }

  function closeOnboarding() {
    setClosingOnboarding(true);
    window.setTimeout(() => {
      setShowOnboarding(false);
      setClosingOnboarding(false);
    }, 320);
  }

  function clearCustomMoods() {
    moodDraggingRef.current = false;
    moodDragEnabledRef.current = false;
    moodDragPointerIdRef.current = null;
    moodDragPreventClickRef.current = false;
    setCustomMoods([]);
    setCustomMoodOpen(false);
    setMood((current) => (defaultMoodOptions.some((item) => item.id === current) ? current : "calm"));
    setMoodEntries((current) =>
      Object.fromEntries(
        Object.entries(current).map(([key, entry]) => [
          key,
          {
            ...entry,
            mood: defaultMoodOptions.some((item) => item.id === entry.mood) ? entry.mood : "calm",
          },
        ]),
      ),
    );
    setCustomMoodLabel("");
    setCustomMoodHue(defaultCustomMoodHsl.h);
    setCustomMoodSaturation(defaultCustomMoodHsl.s);
    setCustomMoodLightness(defaultCustomMoodHsl.l);
    setFeedback("自定义情绪已经被轻轻收起来了");
  }

  function stopSound() {
    return;
  }

  async function toggleSound(mode: SoundMode) {
    if (activeSound === mode) {
      stopSound();
      setFeedback("声音已经慢慢停下");
      return;
    }

    audioTrackRef.current?.source.stop();
    const context = audioContextRef.current ?? new AudioContext();
    audioContextRef.current = context;
    await context.resume();

    const track = createNoiseTrack(context, soundModes[mode]);
    track.gain.gain.value = (soundVolume / 100) * 0.09;
    track.source.start();
    audioTrackRef.current = track;
    setActiveSound(mode);
    setFeedback(`${soundModes[mode].name} 已经打开`);
  }

  function getSoundElement(track: SoundTrack) {
    if (!soundElementsRef.current[track.id]) {
      const audio = new Audio(track.src);
      audio.loop = true;
      audio.preload = "auto";
      audio.volume = soundMasterVolume / 100;
      soundElementsRef.current[track.id] = audio;
    }

    return soundElementsRef.current[track.id];
  }

  async function toggleSoundTrack(track: SoundTrack) {
    const isActive = activeSoundTrackIds.includes(track.id);
    const audio = getSoundElement(track);

    if (isActive) {
      audio.pause();
      audio.currentTime = 0;
      setActiveSoundTrackIds((current) => current.filter((id) => id !== track.id));
      setFeedback(`${track.name} 已轻轻停下`);
      return;
    }

    try {
      audio.volume = soundMasterVolume / 100;
      await audio.play();
      setActiveSoundTrackIds((current) => [...current, track.id]);
      setFeedback(`${track.name} 已加入你的声音组合`);
    } catch {
      setFeedback("这个声音还没准备好播放，再点一次试试");
    }
  }

  function toggleSoundCategory(category: SoundCategory) {
    setExpandedSoundCategories((current) => ({
      ...current,
      [category]: !current[category],
    }));
  }

  function switchBreathMode(id: BreathModeId) {
    setActiveBreathMode(id);
    setBreathPhase(0);
    setFeedback("呼吸节奏已切换，你可以随时暂停");
  }

  function drawPrompt() {
    const nextIndex = Math.floor(Math.random() * soothePrompts.length);
    setActivePrompt(soothePrompts[nextIndex]);
    setPromptSwapTick((tick) => tick + 1);
    setFeedback("给你换了一张轻轻的问题卡");
  }

  function drawQuote() {
    const nextIndex = Math.floor(Math.random() * gentleQuotes.length);
    setActiveQuote(gentleQuotes[nextIndex]);
    setQuoteSwapTick((tick) => tick + 1);
    setFeedback("一张温柔小纸条落下来了");
  }

  function saveSootheNote() {
    const note = toolkitNote.trim();
    if (!note) {
      setFeedback("先给自己留下一小句话吧");
      return;
    }

    setSavingNote(true);

    const nextEntry: SootheNote = {
      id: editingSootheId ?? `${Date.now()}`,
      note,
      prompt: activePrompt,
      quote: activeQuote,
      createdAt: new Date().toISOString(),
    };

    setSootheArchive((current) => {
      if (editingSootheId) {
        return current.map((entry) => (entry.id === editingSootheId ? nextEntry : entry));
      }

      return [nextEntry, ...current].slice(0, 24);
    });
    setToolkitNote("");
    setEditingSootheId(null);
    setFeedback(editingSootheId ? "这张便签已经更新好了" : "这张便签已经收进便签箱了");
    window.setTimeout(() => setSavingNote(false), 360);
  }

  function reopenSootheNote(entry: SootheNote) {
    setEditingSootheId(entry.id);
    setToolkitNote(entry.note);
    setActivePrompt(entry.prompt);
    setActiveQuote(entry.quote);
    setFeedback("已经把这张便签放回桌面上");
  }

  function deleteSootheNote(id: string) {
    setSootheArchive((current) => current.filter((entry) => entry.id !== id));
    if (editingSootheId === id) {
      setEditingSootheId(null);
      setToolkitNote("");
    }
    setFeedback("这张便签已经轻轻放走了");
  }

  const breathStyle = { "--breath-duration": `${breathTotalSeconds}s` } as CSSProperties;

  return (
    <main className={`app theme-${theme}`} ref={appRef}>
      <div className="cursor-orb" aria-hidden="true" />
      <section className="phone">
        {feedback && <div className="toast">{feedback}</div>}
        {showEmergencyHelp && (
          <div
            className="emergency-overlay"
            role="dialog"
            aria-modal="true"
            aria-label="心理援助热线提示"
            onClick={() => setShowEmergencyHelp(false)}
          >
            <div className="emergency-sheet" onClick={(event) => event.stopPropagation()}>
              <div className="emergency-sheet-head">
                <div>
                  <p>先找人说说话</p>
                  <h3>你现在可以这样求助</h3>
                </div>
                <button type="button" onClick={() => setShowEmergencyHelp(false)}>
                  关闭
                </button>
              </div>
              <div className="emergency-sheet-list">
                {emergencyHelpCards.map((item) => (
                  <article className="emergency-sheet-card" key={item.title}>
                    <span>{item.title}</span>
                    <strong>{item.content}</strong>
                    <p>{item.detail}</p>
                  </article>
                ))}
              </div>
              <small className="emergency-sheet-footnote">
                如果 `12356` 一时未接通，可以稍后再试，或联系当地医院、心理门诊、学校/单位心理中心继续求助。
              </small>
            </div>
          </div>
        )}
        {showOnboarding && (
          <div
            className={closingOnboarding ? "onboarding-overlay closing" : "onboarding-overlay"}
            role="dialog"
            aria-modal="true"
            aria-label="欢迎来到 CalmPet"
          >
            <div className="onboarding-card">
              <img className="onboarding-image" src={onboardingGuideImage} alt="CalmPet 引导页" />
              <div className="onboarding-actions">
                <button type="button" onClick={closeOnboarding}>
                  开始看看
                </button>
              </div>
            </div>
          </div>
        )}

        <header className="app-header">
          <div>
            <p>CalmPet</p>
            <h1 className={view === "home" ? "" : "app-header-title-subpage"}>
              {headerMessage}
            </h1>
          </div>
          <div className={feedback ? "energy-chip bump" : "energy-chip"}>{energy} 能量</div>
        </header>

        {view === "home" && (
          <section className="screen home-screen">
            <Pet mood={currentPetMood} action={petAction} outfit={outfit} onPat={patPet} onNuzzle={nuzzlePet} />

            <div className="pet-card">
              <div>
                <p>Momo 正在陪你</p>
                <span>
                  {currentMoodLabel}，所有记录都只保存在这台设备里
                </span>
              </div>
              <button type="button" onClick={() => setView("wardrobe")}>
                设置
              </button>
            </div>

            <div className="today-panel">
              <div className="section-title">
                <div>
                  <p>今日照顾</p>
                  <h2>{visibleHomeTasks.length ? "下一件小事" : "今天已经很完整了"}</h2>
                </div>
                <button type="button" onClick={() => setView("tasks")}>
                  全部
                </button>
              </div>
              <div className="home-task-queue">
                {visibleHomeTasks.map((task, index) => (
                  <article
                    className={index === 0 ? "task-row active queue-enter" : "task-row queue-enter"}
                    key={task.id}
                    onClick={() => openTask(task.id)}
                  >
                    <button
                      className="check"
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        completeTask(task.id);
                      }}
                      aria-label={`完成 ${task.title}`}
                    />
                    <div>
                      <span>{index === 0 ? "现在可以做" : task.type}</span>
                      <strong>{task.title}</strong>
                    </div>
                    <em>+{task.energy}</em>
                  </article>
                ))}
                {!visibleHomeTasks.length && (
                  <div className="empty-care">
                    <p>今天的任务已经都被温柔收下了。</p>
                    <span>你可以去情绪玩具箱坐一会儿，或者只是和 Momo 待着。</span>
                  </div>
                )}
              </div>
            </div>

            <button className="wide-action" type="button" onClick={() => setView("toolkit")}>
              进入情绪玩具箱
            </button>
          </section>
        )}

        {view === "wardrobe" && (
          <section className="screen">
            <Pet mood={currentPetMood} action={petAction} outfit={outfit} onPat={patPet} onNuzzle={nuzzlePet} />
            <div className="section-title wardrobe-title">
              <div>
                <p>设置</p>
                <h2>把 CalmPet 调成更适合你的样子</h2>
              </div>
            </div>
            <section className="settings-card">
              <div className="settings-group">
                <p>主题颜色</p>
                <div className="theme-grid">
                  {(Object.keys(themeOptions) as ThemeId[]).map((item) => (
                    <button
                      className={theme === item ? "theme-option active" : "theme-option"}
                      key={item}
                      type="button"
                      onClick={() => setTheme(item)}
                    >
                      <span className={`theme-swatch theme-swatch-${item}`} />
                      <strong>{themeOptions[item].name}</strong>
                      <small>{themeOptions[item].hint}</small>
                    </button>
                  ))}
                </div>
              </div>

              <div className="settings-group">
                <p>玩具箱</p>
                <div className="settings-tabs">
                  <button
                    className={toolkitPanel === "sound" ? "active" : ""}
                    type="button"
                    onClick={() => setToolkitPanel("sound")}
                  >
                    白噪音
                  </button>
                  <button
                    className={toolkitPanel === "breath" ? "active" : ""}
                    type="button"
                    onClick={() => setToolkitPanel("breath")}
                  >
                    呼吸
                  </button>
                  <button
                    className={toolkitPanel === "soothe" ? "active" : ""}
                    type="button"
                    onClick={() => setToolkitPanel("soothe")}
                  >
                    便签
                  </button>
                </div>
                <label className="settings-slider">
                  <span>白噪音默认音量</span>
                  <input
                    max="100"
                    min="0"
                    type="range"
                    value={soundVolume}
                    onChange={(event) => setSoundVolume(Number(event.target.value))}
                  />
                  <strong>{soundVolume}%</strong>
                </label>
              </div>

              <div className="settings-group">
                <p>数据整理</p>
                <button type="button" onClick={clearCustomTasks}>
                  清空自定义任务
                </button>
                <button type="button" onClick={clearCustomMoods}>
                  清空自定义情绪
                </button>
                <button type="button" onClick={clearMoodJournal}>
                  清空情绪日记
                </button>
              </div>

              <div className="settings-group">
                <p>隐私说明</p>
                <div className="settings-note">
                  CalmPet 不需要登录注册。任务、情绪、玩具箱便签等内容都只保存在这台设备里。
                </div>
              </div>

              <div className="settings-group emergency-group">
                <p>紧急支持</p>
                <div className="settings-note">
                  如果你现在很难受，或需要立刻找人说说话，可以试试全国统一心理援助热线 `12356`。
                </div>
                <button className="emergency-button" type="button" onClick={openHelpResources}>
                  救救我
                </button>
              </div>
            </section>
          </section>
        )}

        {view === "tasks" && (
          <section className="screen">
            <div className="section-title">
              <div>
                <p>轻量任务</p>
                <h2>做一点也很好</h2>
              </div>
            </div>

            <div className="task-list">
              {tasks.map((task) => (
                <article
                  className={activeTaskId === task.id ? "task-row large active" : "task-row large"}
                  key={task.id}
                  onClick={() => setActiveTaskId(task.id)}
                >
                  <button
                    className={task.done ? "check done" : "check"}
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      completeTask(task.id);
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

            <section className="task-detail">
              <p>{activeTask.type}</p>
              <h2>{activeTask.title}</h2>
              <div className="step-list">
                {activeTask.steps.map((step) => (
                  <button
                    className={step.done ? "step done" : "step"}
                    key={step.id}
                    type="button"
                    onClick={() => toggleStep(activeTask.id, step.id)}
                  >
                    <span>{step.id}</span>
                    {step.text}
                  </button>
                ))}
              </div>
              <button className="wide-action" type="button" onClick={() => completeTask(activeTask.id)}>
                温柔完成这个任务
              </button>
            </section>

            <section className="custom-task-card">
              <div>
                <p>我的每日任务</p>
                <h3>给自己定一件很小的事</h3>
              </div>
              <input
                placeholder="例如：晒 3 分钟太阳"
                type="text"
                value={customTaskTitle}
                onChange={(event) => setCustomTaskTitle(event.target.value)}
              />
              <div className="custom-step-grid">
                {customTaskSteps.map((step, index) => (
                  <input
                    key={index}
                    placeholder={`小步骤 ${index + 1}（可选）`}
                    type="text"
                    value={step}
                    onChange={(event) => updateCustomTaskStep(index, event.target.value)}
                  />
                ))}
              </div>
              <button type="button" onClick={addCustomTask}>
                加入今日照顾
              </button>
            </section>
          </section>
        )}

        {view === "mood" && (
          <section className="screen">
            <div className="section-title">
              <div>
                <p>情绪日记</p>
                <h2>{formatMonthLabel(visibleMonth)}</h2>
              </div>
              <button type="button" onClick={() => {
                const now = new Date();
                setVisibleMonth(new Date(now.getFullYear(), now.getMonth(), 1));
                setSelectedDateKey(formatDateKey(now));
              }}>
                今天
              </button>
            </div>

            <div className="calendar-tools">
              <button type="button" onClick={() => moveMonth(-1)}>
                上月
              </button>
              <span>{formatDateLabel(selectedDate)}</span>
              <button type="button" onClick={() => moveMonth(1)}>
                下月
              </button>
            </div>

            <div
              className="mood-picker"
              onPointerDown={startMoodPickerDrag}
              onPointerMove={moveMoodPickerDrag}
              onPointerUp={endMoodPickerDrag}
              onPointerCancel={endMoodPickerDrag}
              onPointerLeave={endMoodPickerDrag}
            >
              {moodOptions.map((item) => (
                <button
                  className={(selectedEntry?.mood ?? mood) === item.id ? "mood-button active" : "mood-button"}
                  key={item.id}
                  type="button"
                  onClick={(event) => handleMoodButtonClick(event, item.id)}
                  style={{ "--mood-color": item.color } as CSSProperties}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <section className="custom-mood-card">
              <div className="custom-mood-head">
                <div>
                  <p>自定义情绪</p>
                  <h3>给你的日历增加新的情绪颜色</h3>
                </div>
                <button
                  className="custom-mood-toggle"
                  type="button"
                  onClick={() => setCustomMoodOpen((open) => !open)}
                >
                  {customMoodOpen ? "收起" : "展开"}
                </button>
              </div>
              <div className={customMoodOpen ? "custom-mood-body open" : "custom-mood-body"}>
                  <div className="custom-mood-preview">
                    <span style={{ "--mood-color": customMoodColor } as CSSProperties} />
                    <strong>{customMoodLabel.trim() || "新的情绪名字"}</strong>
                  </div>
                  <div className="custom-mood-form">
                    <input
                      placeholder="例如：松一口气"
                      type="text"
                      value={customMoodLabel}
                      onChange={(event) => setCustomMoodLabel(event.target.value)}
                    />
                    <div className="custom-mood-value" style={{ "--mood-color": customMoodColor } as CSSProperties}>
                      <span />
                      <strong>当前颜色</strong>
                    </div>
                  </div>
                  <div className="custom-mood-swatches" aria-label="情绪颜色预设">
                    {moodColorPresets.map((color) => (
                      <button
                        className={hexToHsl(color).h === customMoodHue && hexToHsl(color).s === customMoodSaturation && hexToHsl(color).l === customMoodLightness ? "active" : ""}
                        key={color}
                        type="button"
                        onClick={() => applyCustomMoodPreset(color)}
                        style={{ "--mood-color": color } as CSSProperties}
                        aria-label={`选择颜色 ${color}`}
                      />
                    ))}
                  </div>
                  <div className="custom-mood-sliders">
                    <label>
                      <span>色相</span>
                      <input
                        type="range"
                        min="0"
                        max="360"
                        value={customMoodHue}
                        onChange={(event) => setCustomMoodHue(Number(event.target.value))}
                      />
                    </label>
                    <label>
                      <span>饱和</span>
                      <input
                        type="range"
                        min="25"
                        max="95"
                        value={customMoodSaturation}
                        onChange={(event) => setCustomMoodSaturation(Number(event.target.value))}
                      />
                    </label>
                    <label>
                      <span>明度</span>
                      <input
                        type="range"
                        min="35"
                        max="85"
                        value={customMoodLightness}
                        onChange={(event) => setCustomMoodLightness(Number(event.target.value))}
                      />
                    </label>
                  </div>
                  <button type="button" onClick={addCustomMood}>
                    加入情绪日历
                  </button>
              </div>
            </section>

            <div className="calendar-week">
              {weekLabels.map((label) => (
                <span key={label}>{label}</span>
              ))}
            </div>
            <div className="calendar">
              {calendarDays.map((item) => {
                const entry = moodEntries[item.key];
                const dayMood = entry?.mood;
                return (
                <button
                  className={[
                    "day",
                    item.inMonth ? "" : "outside",
                    item.isToday ? "today" : "",
                    item.key === selectedDateKey ? "selected" : "",
                    dayMood ? "has-mood" : "",
                  ].filter(Boolean).join(" ")}
                  key={item.key}
                  type="button"
                  style={dayMood ? ({ "--mood-color": moodOptionMap[dayMood]?.color ?? "var(--blue)" } as CSSProperties) : undefined}
                  onClick={() => {
                    setSelectedDateKey(item.key);
                    if (!item.inMonth) {
                      setVisibleMonth(new Date(item.date.getFullYear(), item.date.getMonth(), 1));
                    }
                    if (dayMood) setMood(dayMood);
                    setFeedback(`${formatDateLabel(item.date)}${dayMood ? `：${moodOptionMap[dayMood]?.label ?? dayMood}` : ""}`);
                  }}
                >
                  <span>{item.day}</span>
                  {entry?.diary && <em />}
                </button>
                );
              })}
            </div>

            <label className="diary-box">
              <span>{formatDateLabel(selectedDate)} 的本地日记</span>
              <textarea
                placeholder="可以只写一个词，也可以什么都不写。"
                value={selectedDiary}
                onChange={(event) => updateDiaryForDate(event.target.value)}
              />
            </label>
          </section>
        )}

        {view === "toolkit" && (
          <section className="screen toolkit-screen">
            <div className="section-title">
              <div>
                <p>情绪玩具箱</p>
                <h2>需要时就来，不需要完成什么</h2>
              </div>
            </div>

            <div className="toolkit-tabs" role="tablist" aria-label="情绪玩具箱功能">
              <button
                className={toolkitPanel === "sound" ? "active" : ""}
                type="button"
                onClick={() => setToolkitPanel("sound")}
              >
                白噪音
              </button>
              <button
                className={toolkitPanel === "breath" ? "active" : ""}
                type="button"
                onClick={() => setToolkitPanel("breath")}
              >
                呼吸
              </button>
              <button
                className={toolkitPanel === "soothe" ? "active" : ""}
                type="button"
                onClick={() => setToolkitPanel("soothe")}
              >
                便签
              </button>
            </div>

            {toolkitPanel === "sound" && (
              <section className="toolkit-card sound-card">
                <div className="toolkit-card-head">
                  <div>
                    <p>白噪音</p>
                    <h3>{activeSoundTrackIds.length ? `正在混合 ${activeSoundTrackIds.length} 个声音` : "选一些轻轻的背景声"}</h3>
                  </div>
                  <span className={activeSoundTrackIds.length ? "tool-status active" : "tool-status"}>
                    {activeSoundTrackIds.length ? "播放中" : "安静"}
                  </span>
                </div>

                <label className="volume-row">
                  <span>总音量</span>
                  <input
                    max="100"
                    min="0"
                    type="range"
                    value={soundMasterVolume}
                    onChange={(event) => setSoundMasterVolume(Number(event.target.value))}
                  />
                  <strong>{soundMasterVolume}%</strong>
                </label>

                <div className="sound-library">
                  {groupedSoundTracks.map((group) => {
                    const expanded = expandedSoundCategories[group.category];
                    const visibleTracks = expanded ? group.tracks : group.tracks.slice(0, 4);

                    return (
                      <section className={expanded ? "sound-group expanded" : "sound-group"} key={group.category}>
                        <div className="sound-group-head">
                          <div>
                            <p>{group.label}</p>
                            <span>{group.tracks.length} 个素材</span>
                          </div>
                          {group.tracks.length > 4 && (
                            <button
                              className="sound-group-toggle"
                              type="button"
                              onClick={() => toggleSoundCategory(group.category)}
                            >
                              {expanded ? "收起" : "展示更多"}
                            </button>
                          )}
                        </div>

                        <div className="sound-grid">
                          {visibleTracks.map((track, index) => {
                            const isActive = activeSoundTrackIds.includes(track.id);
                            const isRevealed = expanded && index >= 4;

                            return (
                              <button
                                className={[
                                  "sound-option",
                                  isActive ? "active" : "",
                                  isRevealed ? "revealed" : "",
                                ].filter(Boolean).join(" ")}
                                key={track.id}
                                type="button"
                                onClick={() => void toggleSoundTrack(track)}
                              >
                                <span className="sound-icon" aria-hidden="true">
                                  {track.icon}
                                </span>
                                <strong>{track.name}</strong>
                                <em>{isActive ? "播放中" : "未播放"}</em>
                              </button>
                            );
                          })}
                        </div>
                      </section>
                    );
                  })}
                </div>
              </section>
            )}

            {false && toolkitPanel === "sound" && (
              <section className="toolkit-card sound-card">
                <div className="toolkit-card-head">
                  <div>
                    <p>白噪音</p>
                    <h3>{activeSound ? soundModes[activeSound].name : "选一个轻轻的背景"}</h3>
                  </div>
                  <span className={activeSound ? "tool-status active" : "tool-status"}>
                    {activeSound ? "播放中" : "安静"}
                  </span>
                </div>
                <div className="sound-grid">
                  {(Object.keys(soundModes) as SoundMode[]).map((mode) => (
                    <button
                      className={activeSound === mode ? "sound-option active" : "sound-option"}
                      key={mode}
                      type="button"
                      onClick={() => void toggleSound(mode)}
                    >
                      <strong>{soundModes[mode].name}</strong>
                      <span>{soundModes[mode].hint}</span>
                    </button>
                  ))}
                </div>
                <label className="volume-row">
                  <span>音量</span>
                  <input
                    max="100"
                    min="0"
                    type="range"
                    value={soundVolume}
                    onChange={(event) => setSoundVolume(Number(event.target.value))}
                  />
                </label>
              </section>
            )}

            {toolkitPanel === "breath" && (
              <section className={breathing ? "breath-card breathing" : "breath-card"} style={breathStyle}>
                <div className="toolkit-card-head">
                  <div>
                    <p>呼吸训练</p>
                    <h3>{breathMode.name}</h3>
                  </div>
                  <span className={breathing ? "tool-status active" : "tool-status"}>
                    {breathing ? currentBreathPhase.label : "可暂停"}
                  </span>
                </div>
                <div className="breath-circle">
                  <span />
                  <span />
                  <span />
                  <i className="breath-particle particle-1" />
                  <i className="breath-particle particle-2" />
                  <i className="breath-particle particle-3" />
                  <i className="breath-particle particle-4" />
                  <i className="breath-particle particle-5" />
                  <i className="breath-particle particle-6" />
                  <strong>{breathing ? currentBreathPhase.label : "准备"}</strong>
                  <small>{breathing ? `${currentBreathPhase.seconds} 秒` : "慢慢来"}</small>
                </div>
                <p>{breathing ? currentBreathPhase.instruction : breathMode.detail}</p>
                <button
                  className="breath-start"
                  type="button"
                  onClick={() => {
                    setBreathing((active) => !active);
                    setBreathPhase(0);
                    setFeedback(breathing ? "呼吸练习已暂停" : "开始一段慢呼吸");
                  }}
                >
                  {breathing ? "先停一停" : "开始呼吸"}
                </button>
                <div className="breath-modes">
                  {breathModes.map((item) => (
                    <button
                      className={item.id === activeBreathMode ? "active" : ""}
                      key={item.id}
                      type="button"
                      onClick={() => switchBreathMode(item.id)}
                    >
                      {item.name}
                    </button>
                  ))}
                </div>
              </section>
            )}

            {toolkitPanel === "soothe" && (
              <section className="toolkit-card soothe-card">
                <div className="toolkit-card-head">
                  <div>
                    <p>情绪便签</p>
                    <h3>把感受放在这里，不需要解释</h3>
                  </div>
                </div>
                <article className="prompt-card">
                  <div className="card-swap" key={promptSwapTick}>
                    <span>问题卡</span>
                    <strong>{activePrompt}</strong>
                  </div>
                  <button type="button" onClick={drawPrompt}>
                    换一张
                  </button>
                </article>
                <article className="quote-card">
                  <div className="card-swap" key={quoteSwapTick}>
                    <span>温柔纸条</span>
                    <strong>{activeQuote}</strong>
                  </div>
                  <button type="button" onClick={drawQuote}>
                    抽一张
                  </button>
                </article>
                <label className={savingNote ? "toolkit-note saving" : "toolkit-note"}>
                  <span>本地便签</span>
                  <textarea value={toolkitNote} onChange={(event) => setToolkitNote(event.target.value)} />
                  <div className="toolkit-note-actions">
                    <button type="button" onClick={saveSootheNote}>
                      {editingSootheId ? "更新这张便签" : "收进便签箱"}
                    </button>
                  </div>
                </label>
                <section className="note-vault soothe-vault">
                  <div className="note-vault-head">
                    <span>便签箱</span>
                    <strong>之前写过的便签和当时抽到的纸条，都会留在这里</strong>
                  </div>
                  {sootheArchive.length ? (
                    <div className="note-vault-list">
                      {sootheArchive.map((entry) => (
                        <article className="vault-card" key={entry.id}>
                          <div className="vault-meta">
                            <span>
                              {new Intl.DateTimeFormat("zh-CN", {
                                month: "numeric",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              }).format(new Date(entry.createdAt))}
                            </span>
                            <div className="vault-actions">
                              <button type="button" onClick={() => reopenSootheNote(entry)}>
                                继续写
                              </button>
                              <button
                                className="vault-delete"
                                type="button"
                                onClick={() => deleteSootheNote(entry.id)}
                              >
                                删除
                              </button>
                            </div>
                          </div>
                          <p>{entry.note}</p>
                          <div className="vault-tags">
                            <small>问题卡：{entry.prompt}</small>
                            <small>纸条：{entry.quote}</small>
                          </div>
                        </article>
                      ))}
                    </div>
                  ) : (
                    <div className="note-vault-empty">
                      第一张便签放进来后，你就可以在这里回看当时的心情、问题卡和纸条。
                    </div>
                  )}
                </section>
              </section>
            )}
          </section>
        )}

        <nav className="bottom-nav" aria-label="主导航">
          <button
            className={view === "home" ? "active" : ""}
            type="button"
            onClick={() => setView("home")}
          >
            首页
          </button>
          <button
            className={view === "tasks" ? "active" : ""}
            type="button"
            onClick={() => setView("tasks")}
          >
            任务
          </button>
          <button
            className={view === "mood" ? "active" : ""}
            type="button"
            onClick={() => setView("mood")}
          >
            情绪
          </button>
          <button
            className={view === "toolkit" ? "active" : ""}
            type="button"
            onClick={() => setView("toolkit")}
          >
            玩具箱
          </button>
          <button
            className={view === "wardrobe" ? "active" : ""}
            type="button"
            onClick={() => setView("wardrobe")}
          >
            设置
          </button>
        </nav>
      </section>
    </main>
  );
}
