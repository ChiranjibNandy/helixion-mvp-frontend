interface StatCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  subtitleColor?: string;
}

export default function StatCard({ title, value, subtitle, subtitleColor = 'text-blue-400' }: StatCardProps) {
  return (
    <div className="bg-[#0f1629] rounded-lg p-6 border border-[#1a2235]">
      <div className="text-[#6b7280] text-sm font-normal mb-2">{title}</div>
      <div className="text-white text-3xl font-semibold mb-1">{value}</div>
      <div className={`text-sm ${subtitleColor}`}>{subtitle}</div>
    </div>
  );
}
