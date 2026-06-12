"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  ReactNode,
} from "react";

interface WorldContextType {
  soundOn: boolean;
  toggleSound: () => void;
  boop: (freq?: number) => void;
  wheee: () => void;
}

const WorldContext = createContext<WorldContextType | null>(null);

export const useWorld = () => {
  const ctx = useContext(WorldContext);
  if (!ctx) throw new Error("useWorld must be used within WorldProvider");
  return ctx;
};

export const WorldProvider = ({ children }: { children: ReactNode }) => {
  const [soundOn, setSoundOn] = useState(false);
  const audioCtx = useRef<AudioContext | null>(null);

  useEffect(() => {
    setSoundOn(localStorage.getItem("world-sound") === "on");
  }, []);

  const getCtx = () => {
    if (!audioCtx.current) {
      audioCtx.current = new AudioContext();
    }
    return audioCtx.current;
  };

  const playTone = useCallback(
    (freq: number, duration: number, type: OscillatorType = "sine") => {
      if (!soundOn) return;
      try {
        const ctx = getCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = type;
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + duration);
      } catch {
        /* audio blocked; stay silent */
      }
    },
    [soundOn]
  );

  const boop = useCallback((freq = 520) => playTone(freq, 0.15), [playTone]);

  const wheee = useCallback(() => {
    if (!soundOn) return;
    try {
      const ctx = getCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(300, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(900, ctx.currentTime + 0.5);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.6);
    } catch {
      /* silent */
    }
  }, [soundOn]);

  const toggleSound = useCallback(() => {
    setSoundOn((prev) => {
      const next = !prev;
      localStorage.setItem("world-sound", next ? "on" : "off");
      return next;
    });
  }, []);

  return (
    <WorldContext.Provider value={{ soundOn, toggleSound, boop, wheee }}>
      {children}
    </WorldContext.Provider>
  );
};
