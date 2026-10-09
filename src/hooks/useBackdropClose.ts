"use client";

import { useRef, type MouseEvent, type RefObject } from "react";

/**
 * Click-the-backdrop-to-close for a native <dialog>. The click must start and end on the backdrop, so a text selection
 * that begins inside the panel and drifts outside it does not dismiss the dialog.
 */
export function useBackdropClose(ref: RefObject<HTMLDialogElement | null>, close: () => void) {
  const startedOnBackdrop = useRef(false);
  return {
    onMouseDown: (e: MouseEvent<HTMLDialogElement>) => {
      startedOnBackdrop.current = e.target === ref.current;
    },
    onClick: (e: MouseEvent<HTMLDialogElement>) => {
      const closing = startedOnBackdrop.current && e.target === ref.current;
      startedOnBackdrop.current = false;
      if (closing) close();
    },
  };
}
