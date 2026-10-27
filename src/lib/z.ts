/** Z-index scale. Use the matching Tailwind class; never invent other values. */
export const Z = {
  raised: 10, // z-10: hover-lifted cards, inline popovers
  nav: 20, // z-20: sticky site and contextual nav
  rail: 30, // z-30: sticky reading rails
  sheet: 40, // z-40: dialogs, sheets and their backdrops
  toast: 50, // z-50: toasts, confetti overlay
  skip: 60, // z-[60]: skip link when focused
} as const;
