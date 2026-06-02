import type { SoundMode } from "./types";
import { soundModes } from "./constants";

// Generate a lightweight filtered noise track for the ambient fallback player.
export function createNoiseTrack(
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
