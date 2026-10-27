export interface TerminalInitialState {
  visibleLines: number;
  playing: boolean;
  complete: boolean;
}

/** Static transcript by default; typing animation only when autoPlay is requested (or on Replay). */
export function initialTerminalState(autoPlay: boolean, lineCount: number): TerminalInitialState {
  if (lineCount === 0) return { visibleLines: 0, playing: false, complete: true };
  if (autoPlay) return { visibleLines: 0, playing: true, complete: false };
  return { visibleLines: lineCount, playing: false, complete: true };
}
