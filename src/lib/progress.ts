/** Auto-completion rule carried over from the old ProgressSidebar: everything before the current phase is done; the last phase completes itself. */
export function completeThrough(prev: number[], current: number, total: number): number[] {
  const set = new Set(prev);
  for (let i = 0; i < current; i++) set.add(i);
  if (total > 0 && current === total - 1) set.add(current);
  return [...set].sort((a, b) => a - b);
}

export function toggleIndex(prev: number[], index: number): number[] {
  return prev.includes(index) ? prev.filter((x) => x !== index) : [...prev, index].sort((a, b) => a - b);
}

export function percentComplete(completed: number[], total: number): number {
  return total === 0 ? 0 : Math.round((completed.length / total) * 100);
}
