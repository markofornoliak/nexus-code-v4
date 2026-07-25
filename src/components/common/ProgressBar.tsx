interface ProgressBarProps {
  value: number;
  label: string;
  compact?: boolean;
}

export function ProgressBar({ value, label, compact = false }: ProgressBarProps) {
  const safeValue = Math.max(0, Math.min(100, Math.round(value)));
  return (
    <div className={`progress-bar-wrap${compact ? " is-compact" : ""}`}>
      <div
        className="progress-bar"
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={safeValue}
      >
        <span style={{ width: `${safeValue}%` }} />
      </div>
      {!compact && <span className="progress-value">{safeValue}%</span>}
    </div>
  );
}
