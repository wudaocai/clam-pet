import type { BreathMode, MoodOption, SoundCategory, SoundMode, SoundTrack, ThemeId } from "./types";
import { hexToHsl } from "./utils";

// App-wide lookup tables and static content live here so App.tsx stays focused on state and orchestration.
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

// This file moved under src/app, so the sound asset glob must resolve one level up.
const soundFiles = import.meta.glob("../assets/sounds/*/*.{mp3,wav}", {
  eager: true,
  import: "default",
}) as Record<string, string>;

const allSoundTracks: SoundTrack[] = Object.entries(soundFiles)
  .map(([path, src]) => {
    const match = path.match(/\.\.\/assets\/sounds\/([^/]+)\/([^/]+)\.(mp3|wav)$/i);
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

export {
  defaultMoodOptions,
  moodColorPresets,
  defaultCustomMoodHsl,
  soundCategoryOrder,
  soundCategoryLabels,
  allSoundTracks,
  weekLabels,
  soundModes,
  breathModes,
  soothePrompts,
  gentleQuotes,
  headerEncouragements,
  themeOptions,
  emergencyHelpCards,
};
