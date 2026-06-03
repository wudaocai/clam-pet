import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { defaultMoodOptions } from "../../app/constants";
import type { PetAction, PetMood } from "../../app/types";
import momoCuddleImage from "../../assets/momo/momo-cuddle.png";
import momoIdleBlinkImage from "../../assets/momo/momo-idle-blink.png";
import momoIdleImage from "../../assets/momo/momo-idle.png";
import momoNuzzleImage from "../../assets/momo/momo-nuzzle.png";
import momoPatBlinkImage from "../../assets/momo/momo-pat-blink.png";
import momoPatImage from "../../assets/momo/momo-pat.png";
import momoWaveImage from "../../assets/momo/momo-wave.png";

gsap.registerPlugin(useGSAP);

type PetProps = {
  mood: PetMood;
  action: PetAction;
  actionTick?: number;
  outfit: string;
  onPat: () => void;
  onNuzzle: () => void;
  onCuddle: () => void;
  onWave: () => void;
};

type InteractionKind = "pat" | "nuzzle" | "cuddle" | "wave";

function getPetSprite(action: PetAction, isBlinking: boolean) {
  switch (action) {
    case "pat":
      return momoPatBlinkImage;
    case "celebrate":
      return momoPatImage;
    case "nuzzle":
      return momoNuzzleImage;
    case "cuddle":
      return momoCuddleImage;
    case "wave":
      return momoWaveImage;
    default:
      return isBlinking ? momoIdleBlinkImage : momoIdleImage;
  }
}

export function Pet({
  mood,
  action,
  actionTick = 0,
  outfit,
  onPat,
  onNuzzle,
  onCuddle,
  onWave,
}: PetProps) {
  const [isBlinking, setIsBlinking] = useState(false);
  const sprite = getPetSprite(action, isBlinking);
  const moodLabel = defaultMoodOptions.find((item) => item.id === mood)?.label ?? "平静";
  const stageRef = useRef<HTMLDivElement | null>(null);
  const spriteShellRef = useRef<HTMLDivElement | null>(null);
  const glowRef = useRef<HTMLSpanElement | null>(null);
  const chipRefs = useRef<Record<InteractionKind, HTMLSpanElement | null>>({
    pat: null,
    nuzzle: null,
    cuddle: null,
    wave: null,
  });

  useEffect(() => {
    if (action !== "idle") {
      setIsBlinking(false);
      return;
    }

    let active = true;
    let blinkTimer: ReturnType<typeof setTimeout> | null = null;
    let resetTimer: ReturnType<typeof setTimeout> | null = null;

    const scheduleBlink = () => {
      blinkTimer = setTimeout(() => {
        if (!active) return;
        setIsBlinking(true);

        resetTimer = setTimeout(() => {
          if (!active) return;
          setIsBlinking(false);
          scheduleBlink();
        }, 180);
      }, 2600 + Math.random() * 2200);
    };

    scheduleBlink();

    return () => {
      active = false;
      if (blinkTimer) clearTimeout(blinkTimer);
      if (resetTimer) clearTimeout(resetTimer);
      setIsBlinking(false);
    };
  }, [action]);

  useGSAP(
    () => {
      const spriteShell = spriteShellRef.current;
      const glow = glowRef.current;
      if (!spriteShell) return;

      gsap.killTweensOf([spriteShell, glow]);

      if (action === "idle") {
        gsap.set(spriteShell, { clearProps: "transform" });
        gsap.set(glow, { clearProps: "all" });
        return;
      }

      const timeline = gsap.timeline({ defaults: { ease: "power2.out" } });

      if (action === "pat" || action === "celebrate") {
        timeline.fromTo(
          spriteShell,
          { y: 0, scale: 1, rotate: 0 },
          {
            keyframes: [
              { y: -14, scale: 1.05, rotate: -2, duration: 0.2, ease: "power2.out" },
              { y: 4, scale: 0.98, rotate: 1.5, duration: 0.18, ease: "power1.inOut" },
              { y: 0, scale: 1, rotate: 0, duration: 0.28, ease: "back.out(1.8)" },
            ],
          },
        );
        if (glow) {
          timeline.fromTo(
            glow,
            { opacity: 0.16, scale: 0.92 },
            { opacity: 0.34, scale: 1.08, duration: 0.24, yoyo: true, repeat: 1, ease: "sine.inOut" },
            0,
          );
        }
      }

      if (action === "nuzzle") {
        timeline.fromTo(
          spriteShell,
          { x: 0, y: 0, rotate: 0, scale: 1 },
          {
            keyframes: [
              { x: -10, y: 2, rotate: -4, scale: 1.01, duration: 0.2 },
              { x: 7, y: 0, rotate: 2.5, scale: 0.995, duration: 0.2 },
              { x: -4, y: 1, rotate: -1.5, duration: 0.14 },
              { x: 0, y: 0, rotate: 0, scale: 1, duration: 0.24, ease: "power3.out" },
            ],
          },
        );
      }

      if (action === "cuddle") {
        timeline.fromTo(
          spriteShell,
          { y: 0, scaleX: 1, scaleY: 1, rotate: 0 },
          {
            keyframes: [
              { y: 8, scaleX: 1.08, scaleY: 0.95, rotate: -4, duration: 0.22, ease: "power2.out" },
              { y: -2, scaleX: 0.98, scaleY: 1.04, rotate: 3, duration: 0.18, ease: "power1.inOut" },
              { y: 5, scaleX: 1.04, scaleY: 0.98, rotate: -2, duration: 0.16 },
              { y: 0, scaleX: 1, scaleY: 1, rotate: 0, duration: 0.34, ease: "elastic.out(1, 0.5)" },
            ],
          },
        );
        if (glow) {
          timeline.fromTo(
            glow,
            { opacity: 0.12, scale: 0.88 },
            { opacity: 0.46, scale: 1.18, duration: 0.3, yoyo: true, repeat: 1, ease: "sine.inOut" },
            0,
          );
        }
      }

      if (action === "wave") {
        timeline.fromTo(
          spriteShell,
          { y: 0, rotate: 0, scale: 1 },
          {
            keyframes: [
              { y: -8, rotate: -4, scale: 1.02, duration: 0.18 },
              { y: -2, rotate: 3, scale: 1.015, duration: 0.16 },
              { y: -8, rotate: -3, scale: 1.02, duration: 0.16 },
              { y: 0, rotate: 0, scale: 1, duration: 0.24, ease: "back.out(1.7)" },
            ],
          },
        );
      }
    },
    { dependencies: [action, actionTick], scope: stageRef, revertOnUpdate: true },
  );

  function animateChip(kind: InteractionKind) {
    const chip = chipRefs.current[kind];
    if (!chip) return;

    gsap.killTweensOf(chip);
    gsap.fromTo(
      chip,
      { scale: 1, y: 0 },
      {
        keyframes: [
          { scale: 0.94, y: 1, duration: 0.08, ease: "power1.out" },
          { scale: 1.08, y: -4, duration: 0.16, ease: "back.out(2.4)" },
          { scale: 1, y: 0, duration: 0.18, ease: "power2.out" },
        ],
      },
    );
  }

  function handleInteraction(kind: InteractionKind, callback: () => void) {
    animateChip(kind);
    callback();
  }

  return (
    <div ref={stageRef} className={`pet-stage pet-${mood} outfit-${outfit} pet-action-${action}`} aria-label={`Momo 当前状态：${moodLabel}`}>
      <span className="cloud cloud-one" />
      <span className="cloud cloud-two" />
      <span className="spark spark-one" />
      <span className="spark spark-two" />
      <span className="spark spark-three" />
      <span className="pet-orbit orbit-one" />
      <span className="pet-orbit orbit-two" />
      <span className="heart-bubble heart-one" />
      <span className="heart-bubble heart-two" />
      <span ref={glowRef} className="comfort-glow" />
      <span className="sleepy-puff sleepy-puff-one" />
      <span className="sleepy-puff sleepy-puff-two" />
      <div className="pet-shadow" />

      <button className="pet-touch pet-touch-head" type="button" onClick={() => handleInteraction("pat", onPat)} aria-label="摸摸 Momo 的头">
        <span className="pet-touch-chip" ref={(node) => { chipRefs.current.pat = node; }}>
          摸摸头
        </span>
      </button>
      <button className="pet-touch pet-touch-side" type="button" onClick={() => handleInteraction("nuzzle", onNuzzle)} aria-label="贴贴 Momo 的脸">
        <span className="pet-touch-chip" ref={(node) => { chipRefs.current.nuzzle = node; }}>
          贴贴脸
        </span>
      </button>
      <button className="pet-touch pet-touch-belly" type="button" onClick={() => handleInteraction("cuddle", onCuddle)} aria-label="揉揉 Momo 的小肚子">
        <span className="pet-touch-chip" ref={(node) => { chipRefs.current.cuddle = node; }}>
          揉肚肚
        </span>
      </button>
      <button className="pet-touch pet-touch-paw" type="button" onClick={() => handleInteraction("wave", onWave)} aria-label="碰碰 Momo 的小爪子">
        <span className="pet-touch-chip" ref={(node) => { chipRefs.current.wave = node; }}>
          碰碰爪
        </span>
      </button>

      <div ref={spriteShellRef} className="pet-sprite-shell">
        <img className="pet-sprite" src={sprite} alt="" aria-hidden="true" />
      </div>
    </div>
  );
}
