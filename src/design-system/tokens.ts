export const designTokens = {
  color: {
    surfacePrimary: "var(--surface-primary)",
    surfaceElevated: "var(--surface-elevated)",
    surfaceInset: "var(--surface-inset)",
    textPrimary: "var(--text-primary)",
    textMuted: "var(--text-muted)",
    signalActive: "var(--signal-active)",
    signalWarning: "var(--signal-warning)",
    signalError: "var(--signal-error)",
    archiveBorder: "var(--archive-border)",
  },
  motion: {
    fast: "var(--motion-fast)",
    standard: "var(--motion-standard)",
    slow: "var(--motion-slow)",
  },
  radius: {
    small: "var(--radius-sm)",
    medium: "var(--radius-md)",
    large: "var(--radius-lg)",
  },
  zIndex: {
    base: 0,
    raised: 10,
    navigation: 50,
    modal: 100,
  },
} as const;

export const rarityLabels = {
  common: "Recovered",
  uncommon: "Resonant",
  rare: "Encrypted",
  mythic: "Primeval",
} as const;
