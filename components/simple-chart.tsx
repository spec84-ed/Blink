export function BarChart({
  data,
  valueKey,
  target
}: {
  data: Array<Record<string, string | number>>;
  valueKey: string;
  target: number;
}) {
  const max = Math.max(target, ...data.map((item) => Number(item[valueKey])));

  return (
    <div className="flex h-44 items-end gap-2">
      {data.map((item) => {
        const value = Number(item[valueKey]);
        const height = value > 0 ? Math.max(12, (value / max) * 100) : 4;
        return (
          <div key={String(item.day ?? item.label)} className="flex flex-1 flex-col items-center gap-2">
            <div className="flex h-36 w-full items-end rounded-full bg-ink/5 p-1">
              <div className="w-full rounded-full bg-moss" style={{ height: `${height}%` }} />
            </div>
            <span className="text-xs font-bold text-ink/45">{String(item.day ?? item.label)}</span>
          </div>
        );
      })}
    </div>
  );
}
