/** How far down the page, in px, a stored reading position must be to be worth offering, and how far a reader can scroll before the offer is dropped. */
export const RESUME_THRESHOLD = 200;

/**
 * Whether save() must leave the stored reading position alone.
 *
 * While a stored position is on offer and unanswered, a reader who is still near the top has not chosen yet, so what is stored is the more
 * useful position and a save from here would destroy it. Once they have scrolled past the threshold their current place is the better one to
 * keep (and the notice is dropped), and once they have answered the stored position is gone anyway, so neither case blocks.
 */
export function shouldBlockSave({ offered, answered, scrollY }: { offered: boolean; answered: boolean; scrollY: number }): boolean {
  return offered && !answered && scrollY <= RESUME_THRESHOLD;
}
