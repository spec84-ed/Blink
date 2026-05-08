export function ProgressRing({
  value,
  size = "h-48 w-48",
  color = "#5c7d5a",
  children
}: {
  value: number;
  size?: string;
  color?: string;
  children: React.ReactNode;
}) {
  const bounded = Math.max(0, Math.min(100, value));

  return (
    <div
      className={`progress-ring grid place-items-center rounded-full ${size}`}
      style={{ "--value": bounded, "--ring-color": color } as React.CSSProperties}
    >
      <div className="grid h-[74%] w-[74%] place-items-center rounded-full bg-white text-center shadow-card">{children}</div>
    </div>
  );
}
