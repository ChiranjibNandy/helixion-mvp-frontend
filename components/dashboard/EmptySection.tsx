interface EmptySectionProps {
  title: string;
  subtitle: string;
}

export default function EmptySection({ title, subtitle }: EmptySectionProps) {
  return (
    <div className="bg-[#0f1629] rounded-lg border border-[#1a2235] p-6 flex flex-col items-center justify-center h-full min-h-[200px]">
      <h3 className="text-white text-base font-semibold mb-2">{title}</h3>
      <p className="text-[#6b7280] text-sm">{subtitle}</p>
    </div>
  );
}
