import { defaultMoodOptions } from "../../app/constants";
import type { PetAction, PetMood } from "../../app/types";

// Pure visual component for the pet scene so App.tsx does not carry decorative markup.
export function Pet({
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
