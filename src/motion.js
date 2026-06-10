// Motion tokens. One easing family, three durations, one stagger.
// Every animated component imports from here so the site moves as one system.

export const EASE = [0.16, 1, 0.3, 1]; // expo-out

export const DUR = {
  micro: 0.12,
  base: 0.24,
  slow: 0.6,
};

export const STAGGER = 0.07;

export const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * STAGGER, duration: DUR.slow, ease: EASE },
  }),
};

export const viewportOnce = { once: true, margin: '-60px' };
