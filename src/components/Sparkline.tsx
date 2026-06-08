export default function Sparkline({
  data = [40, 42, 38, 45, 50, 48, 55],
  width = 160,
  height = 48,
}: {
  data?: number[];
  width?: number;
  height?: number;
}) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const points = data
    .map((d, i) => {
      const x = (i / (data.length - 1)) * width;
      const y = height - ((d - min) / (max - min || 1)) * height;
      return `${x},${y}`;
    })
    .join(' ');
  return (
    <svg width={width} height={height} className="overflow-visible text-brand">
      <polyline fill="none" stroke="currentColor" strokeWidth="2" points={points} />
      {data.map((_, i) => {
        const x = (i / (data.length - 1)) * width;
        const y = height - ((data[i] - min) / (max - min || 1)) * height;
        return <circle key={i} cx={x} cy={y} r={2} className="fill-current" />;
      })}
    </svg>
  );
}
