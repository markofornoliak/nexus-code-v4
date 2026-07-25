interface StatusChipProps {
  children: React.ReactNode;
  tone?: "active" | "muted" | "warning" | "success" | "locked";
}

export function StatusChip({ children, tone = "muted" }: StatusChipProps) {
  return <span className={`status-chip status-${tone}`}>{children}</span>;
}
