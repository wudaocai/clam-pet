import { type CSSProperties, useEffect, useMemo, useRef, useState } from "react";
import onboardingGuideImage from "./assets/onboarding-guide.png";
import momoCuddleImage from "./assets/momo/momo-cuddle.png";
import momoIdleBlinkImage from "./assets/momo/momo-idle-blink.png";
import momoIdleImage from "./assets/momo/momo-idle.png";
import momoNuzzleImage from "./assets/momo/momo-nuzzle.png";
import momoPatBlinkImage from "./assets/momo/momo-pat-blink.png";
import momoPatImage from "./assets/momo/momo-pat.png";
import momoWaveImage from "./assets/momo/momo-wave.png";
import {
  allSoundTracks,
  breathModes,
  defaultCustomMoodHsl,
  defaultMoodOptions,
  emergencyHelpCards,
  gentleQuotes,
  headerEncouragements,
  moodColorPresets,
  soundCategoryLabels,
  soundCategoryOrder,
  soundModes,
  soothePrompts,
  themeOptions,
  weekLabels,
} from "./app/constants";
import { createNoiseTrack } from "./app/audio";
import {
  buildCalendarDays,
  formatDateKey,
  formatDateLabel,
  formatMonthLabel,
  groupSoundTracks,
  hexToHsl,
  hslToCss,
  pickRandomHeaderMessage,
  readState,
  resolvePetMood,
} from "./app/utils";
import type {
  BreathModeId,
  EnergyParticle,
  MoodEntry,
  MoodId,
  MoodOption,
  SootheNote,
  SoundCategory,
  SoundMode,
  SoundTrack,
  ThemeId,
  ToolkitPanel,
  View,
  PetAction,
} from "./app/types";
import { HomeScreen } from "./components/home/HomeScreen";
import { Pet } from "./components/pet/Pet";
import { CustomTaskCard } from "./components/tasks/CustomTaskCard";
import { TaskDetailCard } from "./components/tasks/TaskDetailCard";
import { TaskGroup } from "./components/tasks/TaskGroup";
import { hydrateTasksForDate, initialTasks } from "./task-data";
import type { Task } from "./task-types";
import { pickActiveTask, splitTasks } from "./task-utils";

const bootImageSources = [
  onboardingGuideImage,
  momoIdleImage,
  momoIdleBlinkImage,
  momoPatBlinkImage,
  momoPatImage,
  momoNuzzleImage,
  momoCuddleImage,
  momoWaveImage,
];

function preloadImage(src: string) {
  return new Promise<void>((resolve) => {
    const image = new Image();
    const finish = () => resolve();

    image.onload = finish;
    image.onerror = finish;
    image.src = src;

    if (image.complete) {
      finish();
    }
  });
}

export default function App() {
  const todayTaskKey = formatDateKey(new Date());
  const [bootAssetsReady, setBootAssetsReady] = useState(false);
  const [view, setView] = useState<View>("home");
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [closingOnboarding, setClosingOnboarding] = useState(false);
  const [tasks, setTasks] = useState<Task[]>(() =>
    hydrateTasksForDate(
      readState("calmpet.tasks", initialTasks),
      readState("calmpet.tasksLastResetAt", ""),
      todayTaskKey,
    ),
  );
  const [taskResetDate, setTaskResetDate] = useState(() => todayTaskKey);
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
  const [petActionTick, setPetActionTick] = useState(0);
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
  const [headerMessage, setHeaderMessage] = useState(() => pickRandomHeaderMessage(headerEncouragements));
  const [showEmergencyHelp, setShowEmergencyHelp] = useState(false);
  const [customTaskTitle, setCustomTaskTitle] = useState("");
  const [customTaskSteps, setCustomTaskSteps] = useState(["", "", ""]);
  const [taskSectionsOpen, setTaskSectionsOpen] = useState({
    pending: true,
    completed: false,
    custom: true,
  });
  const [energyParticles, setEnergyParticles] = useState<EnergyParticle[]>([]);
  const [activePrompt, setActivePrompt] = useState(soothePrompts[0]);
  const [activeQuote, setActiveQuote] = useState(gentleQuotes[0]);
  const [promptSwapTick, setPromptSwapTick] = useState(0);
  const [quoteSwapTick, setQuoteSwapTick] = useState(0);
  const [toolkitPanel, setToolkitPanel] = useState<ToolkitPanel>(() =>
    readState("calmpet.toolkitPanel", "breath"),
  );
  const [savingNote, setSavingNote] = useState(false);
  const appRef = useRef<HTMLElement | null>(null);
  const phoneRef = useRef<HTMLElement | null>(null);
  const energyChipRef = useRef<HTMLDivElement | null>(null);
  const nextEnergyParticleIdRef = useRef(1);
  const soundElementsRef = useRef<Record<string, HTMLAudioElement>>({});
  const soundFadeFrameRef = useRef<Record<string, number>>({});
  const fadingSoundTrackIdsRef = useRef<Set<string>>(new Set());
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioTrackRef = useRef<{ source: AudioBufferSourceNode; gain: GainNode } | null>(null);
  const petActionTimerRef = useRef<number | null>(null);
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
  const { pendingTasks, completedTasks, customTasks } = useMemo(() => splitTasks(tasks), [tasks]);
  const orderedTasks = useMemo(
    () => [...pendingTasks, ...completedTasks, ...customTasks],
    [pendingTasks, completedTasks, customTasks],
  );
  const activeTask = pickActiveTask(orderedTasks, activeTaskId);
  const visibleHomeTasks = tasks.filter((task) => !task.done).slice(0, 2);
  const featuredSoundTrack = useMemo(
    () => allSoundTracks.find((track) => track.id === activeSoundTrackIds[0]) ?? null,
    [activeSoundTrackIds],
  );
  const homeGreeting = useMemo(() => {
    const hour = new Date().getHours();

    if (hour < 11) return "今天也要温柔地照顾自己哦";
    if (hour < 18) return "我们先从一件小事开始";
    return "辛苦了，先让自己缓一缓";
  }, []);
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
  const groupedSoundTracks = useMemo(() => {
    const activeOrder = new Map(activeSoundTrackIds.map((id, index) => [id, index]));

    return groupSoundTracks(allSoundTracks, soundCategoryOrder, soundCategoryLabels).map((group) => ({
      ...group,
      tracks: [...group.tracks].sort((left, right) => {
        const leftOrder = activeOrder.has(left.id) ? activeOrder.get(left.id)! : Number.POSITIVE_INFINITY;
        const rightOrder = activeOrder.has(right.id) ? activeOrder.get(right.id)! : Number.POSITIVE_INFINITY;

        if (leftOrder !== rightOrder) return leftOrder - rightOrder;
        return 0;
      }),
    }));
  }, [activeSoundTrackIds]);

  useEffect(() => localStorage.setItem("calmpet.tasks", JSON.stringify(tasks)), [tasks]);
  useEffect(() => localStorage.setItem("calmpet.tasksLastResetAt", JSON.stringify(taskResetDate)), [taskResetDate]);
  useEffect(() => localStorage.setItem("calmpet.mood", JSON.stringify(mood)), [mood]);
  useEffect(() => localStorage.setItem("calmpet.moodEntries", JSON.stringify(moodEntries)), [moodEntries]);
  useEffect(() => localStorage.setItem("calmpet.customMoods", JSON.stringify(customMoods)), [customMoods]);
  useEffect(() => localStorage.setItem("calmpet.soundMasterVolume", JSON.stringify(soundMasterVolume)), [soundMasterVolume]);
  useEffect(() => localStorage.setItem("calmpet.toolkitPanel", JSON.stringify(toolkitPanel)), [toolkitPanel]);
  useEffect(() => localStorage.setItem("calmpet.toolkitNote", JSON.stringify(toolkitNote)), [toolkitNote]);
  useEffect(() => localStorage.setItem("calmpet.sootheArchive", JSON.stringify(sootheArchive)), [sootheArchive]);
  useEffect(() => localStorage.setItem("calmpet.theme", JSON.stringify(theme)), [theme]);
  useEffect(() => {
    setHeaderMessage((current) => pickRandomHeaderMessage(headerEncouragements, current));
  }, [view]);

  useEffect(() => {
    let active = true;

    Promise.allSettled(bootImageSources.map((src) => preloadImage(src))).then(() => {
      if (!active) return;
      setBootAssetsReady(true);
    });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!orderedTasks.some((task) => task.id === activeTaskId)) {
      setActiveTaskId(orderedTasks[0]?.id ?? 1);
    }
  }, [activeTaskId, orderedTasks]);

  useEffect(() => {
    function refreshDailyTasksIfNeeded() {
      const nextDateKey = formatDateKey(new Date());
      if (nextDateKey === taskResetDate) return;

      setTasks((current) => hydrateTasksForDate(current, taskResetDate, nextDateKey));
      setTaskResetDate(nextDateKey);
      setFeedback("新的一天开始了，今日任务已经轻轻刷新");
    }

    refreshDailyTasksIfNeeded();
    const timer = window.setInterval(refreshDailyTasksIfNeeded, 60_000);
    document.addEventListener("visibilitychange", refreshDailyTasksIfNeeded);

    return () => {
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", refreshDailyTasksIfNeeded);
    };
  }, [taskResetDate]);

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
    Object.entries(soundElementsRef.current).forEach(([trackId, audio]) => {
      if (fadingSoundTrackIdsRef.current.has(trackId)) return;
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
      if (petActionTimerRef.current) {
        window.clearTimeout(petActionTimerRef.current);
      }
      Object.values(soundFadeFrameRef.current).forEach((frameId) => window.cancelAnimationFrame(frameId));
      Object.values(soundElementsRef.current).forEach((audio) => {
        audio.pause();
        audio.currentTime = 0;
      });
    };
  }, []);

  useEffect(() => {
    if (view !== "home" && view !== "wardrobe") return;

    const motions: Array<{ action: PetAction; duration: number }> = [
      { action: "wave", duration: 820 },
      { action: "nuzzle", duration: 980 },
      { action: "pat", duration: 860 },
    ];

    const timer = window.setInterval(() => {
      if (petAction !== "idle") return;
      const next = motions[Math.floor(Math.random() * motions.length)];
      animatePetAction(next.action, next.duration);
    }, 12000);

    return () => window.clearInterval(timer);
  }, [petAction, view]);

  function animatePetAction(action: PetAction, duration = 1000) {
    if (petActionTimerRef.current) {
      window.clearTimeout(petActionTimerRef.current);
    }

    setPetActionTick((current) => current + 1);
    setPetAction(action);
    petActionTimerRef.current = window.setTimeout(() => {
      setPetAction("idle");
      petActionTimerRef.current = null;
    }, duration);
  }

  function playPetAction(action: PetAction, message: string, duration = 1000) {
    setFeedback(message);
    animatePetAction(action, duration);
  }

  function openTask(id: number) {
    setActiveTaskId(id);
    setView("tasks");
  }

  function toggleTaskSection(section: "pending" | "completed" | "custom") {
    setTaskSectionsOpen((current) => ({
      ...current,
      [section]: !current[section],
    }));
  }

  function launchEnergyParticles(sourceRect?: DOMRect) {
    const phoneRect = phoneRef.current?.getBoundingClientRect();
    const chipRect = energyChipRef.current?.getBoundingClientRect();
    if (!phoneRect || !chipRect) return;

    const originX = sourceRect ? sourceRect.left + sourceRect.width / 2 - phoneRect.left : phoneRect.width * 0.5;
    const originY = sourceRect ? sourceRect.top + sourceRect.height / 2 - phoneRect.top : phoneRect.height * 0.58;
    const targetX = chipRect.left + chipRect.width / 2 - phoneRect.left;
    const targetY = chipRect.top + chipRect.height / 2 - phoneRect.top;
    const particleIds: number[] = [];

    const particles = Array.from({ length: 8 }, (_, index) => {
      const id = nextEnergyParticleIdRef.current++;
      particleIds.push(id);
      const angle = (-100 + index * 20) * (Math.PI / 180);
      const burstDistance = 28 + (index % 3) * 10;
      return {
        id,
        x: originX + (index % 2 === 0 ? -8 : 8),
        y: originY + (index - 3) * 3,
        ex: Math.cos(angle) * burstDistance,
        ey: Math.sin(angle) * burstDistance - 8,
        dx: targetX - originX + (index - 3.5) * 6,
        dy: targetY - originY - 16 - index * 4,
        delay: index * 24,
      };
    });

    setEnergyParticles((current) => [...current, ...particles]);
    window.setTimeout(() => {
      setEnergyParticles((current) => current.filter((item) => !particleIds.includes(item.id)));
    }, 980);
  }

  function completeTask(id: number, sourceRect?: DOMRect) {
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
    launchEnergyParticles(sourceRect);
    playPetAction("celebrate", `Momo 开心地蹦了一下，能量 +${task.energy}`, 1300);
  }

  function toggleStep(taskId: number, stepId: number, sourceRect?: DOMRect) {
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
    if (completedAll) {
      launchEnergyParticles(sourceRect);
    }
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

  function cuddlePet() {
    setMood("calm");
    playPetAction("cuddle", "Momo 被你揉得软乎乎的，安心地靠过来了", 1350);
  }

  function wavePet() {
    setMood("happy");
    playPetAction("wave", "Momo 抬起小爪，像是在和你打招呼", 900);
  }

  function openBreathShortcut() {
    setToolkitPanel("breath");
    setView("toolkit");
    setBreathing(true);
    setBreathPhase(0);
    setFeedback("先陪你缓 30 秒");
  }

  function openSoundShortcut() {
    setToolkitPanel("sound");
    setView("toolkit");
    setFeedback(featuredSoundTrack ? `继续播放 ${featuredSoundTrack.name}` : "去挑一个喜欢的背景声吧");
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
      summary: taskSteps[0]?.text ?? "给今天留下一件想温柔完成的小事",
      icon: "☘",
      energy: 3,
      done: false,
      custom: true,
      steps: taskSteps,
    };

    setTasks((current) => [...current, nextTask]);
    setActiveTaskId(nextTask.id);
    setCustomTaskTitle("");
    setCustomTaskSteps(["", "", ""]);
    setTaskSectionsOpen((current) => ({ ...current, custom: true }));
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

  function cancelSoundFade(trackId: string) {
    const frameId = soundFadeFrameRef.current[trackId];
    if (frameId) {
      window.cancelAnimationFrame(frameId);
      delete soundFadeFrameRef.current[trackId];
    }
    fadingSoundTrackIdsRef.current.delete(trackId);
  }

  function fadeOutSoundTrack(track: SoundTrack, audio: HTMLAudioElement) {
    cancelSoundFade(track.id);
    fadingSoundTrackIdsRef.current.add(track.id);

    const startVolume = audio.volume;
    const fadeDuration = 200;
    const fadeStart = performance.now();

    return new Promise<void>((resolve) => {
      const tick = (now: number) => {
        const progress = Math.min((now - fadeStart) / fadeDuration, 1);
        audio.volume = Math.max(0, startVolume * (1 - progress));

        if (progress < 1) {
          soundFadeFrameRef.current[track.id] = window.requestAnimationFrame(tick);
          return;
        }

        audio.pause();
        audio.currentTime = 0;
        audio.volume = soundMasterVolume / 100;
        cancelSoundFade(track.id);
        resolve();
      };

      soundFadeFrameRef.current[track.id] = window.requestAnimationFrame(tick);
    });
  }

  async function toggleSoundTrack(track: SoundTrack) {
    return handleSoundTrackToggle(track);
    const isActive = activeSoundTrackIds.includes(track.id);
    const audio = getSoundElement(track);

    if (isActive) {
      await fadeOutSoundTrack(track, audio);
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

  async function handleSoundTrackToggle(track: SoundTrack) {
    const isActive = activeSoundTrackIds.includes(track.id);
    const audio = getSoundElement(track);

    if (isActive) {
      await fadeOutSoundTrack(track, audio);
      setActiveSoundTrackIds((current) => current.filter((id) => id !== track.id));
      setFeedback(`${track.name} 已经轻轻淡出了`);
      return;
    }

    try {
      cancelSoundFade(track.id);
      audio.volume = soundMasterVolume / 100;
      await audio.play();
      setActiveSoundTrackIds((current) => [track.id, ...current.filter((id) => id !== track.id)]);
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
      <section className="phone" ref={phoneRef}>
        {!bootAssetsReady && (
          <div className="boot-overlay" role="status" aria-live="polite" aria-label="正在准备 CalmPet">
            <div className="boot-card">
              <p>CalmPet</p>
              <strong>正在准备 Momo 和首页素材…</strong>
              <span>等图片加载好后再进入，首屏会更完整一点。</span>
            </div>
          </div>
        )}

        {feedback && <div className="toast">{feedback}</div>}
        {!!energyParticles.length && (
          <div className="task-energy-layer" aria-hidden="true">
            {energyParticles.map((particle) => (
              <span
                className="task-energy-particle"
                key={particle.id}
                style={
                  {
                    "--particle-x": `${particle.x}px`,
                    "--particle-y": `${particle.y}px`,
                    "--particle-ex": `${particle.ex}px`,
                    "--particle-ey": `${particle.ey}px`,
                    "--particle-dx": `${particle.dx}px`,
                    "--particle-dy": `${particle.dy}px`,
                    "--particle-delay": `${particle.delay}ms`,
                  } as CSSProperties
                }
              />
            ))}
          </div>
        )}
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

        <header className={view === "home" ? "app-header home-shell-header" : "app-header"}>
          <div>
            <p>CalmPet</p>
            <h1 className={view === "home" ? "" : "app-header-title-subpage"}>
              {headerMessage}
            </h1>
          </div>
          <div className={feedback ? "energy-chip bump" : "energy-chip"} ref={energyChipRef}>
            {energy} 能量
          </div>
        </header>

        {false && view === "home" && (
          <section className="screen home-screen">
            <Pet
              mood={currentPetMood}
              action={petAction}
              actionTick={petActionTick}
              outfit={outfit}
              onPat={patPet}
              onNuzzle={nuzzlePet}
              onCuddle={cuddlePet}
              onWave={wavePet}
            />

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

        {view === "home" && (
          <HomeScreen
            greeting={homeGreeting}
            moodLabel={currentMoodLabel}
            petMood={currentPetMood}
            petAction={petAction}
            petActionTick={petActionTick}
            outfit={outfit}
            visibleTasks={visibleHomeTasks}
            activeSoundName={featuredSoundTrack?.name ?? null}
            onPat={patPet}
            onNuzzle={nuzzlePet}
            onCuddle={cuddlePet}
            onWave={wavePet}
            onOpenSettings={() => setView("wardrobe")}
            onOpenTask={openTask}
            onCompleteTask={completeTask}
            onOpenTasks={() => setView("tasks")}
            onOpenBreathShortcut={openBreathShortcut}
            onOpenSoundShortcut={openSoundShortcut}
          />
        )}

        {view === "wardrobe" && (
          <section className="screen">
            <Pet
              mood={currentPetMood}
              action={petAction}
              actionTick={petActionTick}
              outfit={outfit}
              onPat={patPet}
              onNuzzle={nuzzlePet}
              onCuddle={cuddlePet}
              onWave={wavePet}
            />
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

            <div className="task-stack">
              <TaskGroup
                title="未完成任务"
                emptyText="今天需要照顾的小事已经做完了。"
                tasks={pendingTasks}
                activeTaskId={activeTaskId}
                open={taskSectionsOpen.pending}
                onToggleOpen={() => toggleTaskSection("pending")}
                onSelectTask={setActiveTaskId}
                onCompleteTask={completeTask}
              />

              <TaskDetailCard task={activeTask} onToggleStep={toggleStep} onCompleteTask={completeTask} />

              <TaskGroup
                title="已完成任务"
                emptyText="完成后的任务会安静地留在这里。"
                tasks={completedTasks}
                activeTaskId={activeTaskId}
                open={taskSectionsOpen.completed}
                onToggleOpen={() => toggleTaskSection("completed")}
                onSelectTask={setActiveTaskId}
                onCompleteTask={completeTask}
              />

              <CustomTaskCard
                open={taskSectionsOpen.custom}
                tasks={customTasks}
                activeTaskId={activeTaskId}
                title={customTaskTitle}
                steps={customTaskSteps}
                onToggleOpen={() => toggleTaskSection("custom")}
                onSelectTask={setActiveTaskId}
                onCompleteTask={completeTask}
                onTitleChange={setCustomTaskTitle}
                onStepChange={updateCustomTaskStep}
                onAddTask={addCustomTask}
              />
            </div>

            {false && (
            <>
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
            </>
            )}
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
