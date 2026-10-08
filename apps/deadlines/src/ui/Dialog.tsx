import type { ComponentChildren } from "preact";
import { useEffect, useRef } from "preact/hooks";

interface Props {
  labelledBy: string;
  /** Element to focus on open. Defaults to the heading, so the iOS keyboard does not pop up uninvited. */
  initialFocus?: () => HTMLElement | null;
  /** Called for Escape, a backdrop tap or a close button. Return false to stay open. */
  onDismiss: () => boolean | void;
  /** Where focus goes after closing, when the opener is gone (a deleted row). */
  fallbackFocus?: () => HTMLElement | null;
  opener: HTMLElement | null;
  children: ComponentChildren;
}

/* A native modal dialog: the page behind is inert and Tab stays inside. Focus moves in on
   open and back to whatever opened it on close. */
export function Dialog({ labelledBy, initialFocus, onDismiss, fallbackFocus, opener, children }: Props) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const d = ref.current!;
    if (!d.open) d.showModal();
    const el = initialFocus?.() ?? (d.querySelector(`#${labelledBy}`) as HTMLElement | null);
    el?.focus();
    return () => {
      if (d.open) d.close();
      const back = opener && opener.isConnected ? opener : fallbackFocus?.();
      back?.focus();
    };
  }, []);
  return (
    <dialog
      ref={ref}
      aria-labelledby={labelledBy}
      onCancel={e => { e.preventDefault(); onDismiss(); }}
      onClick={e => { if (e.target === ref.current) onDismiss(); }}
    >
      {children}
    </dialog>
  );
}
