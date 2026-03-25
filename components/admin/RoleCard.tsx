import { Role } from "@/types/registration";

interface RoleCardProps {
  role: Role;
  title: string;
  description: string;
  selected: boolean;
  onSelect: () => void;
}

export function RoleCard({ role, title, description, selected, onSelect }: RoleCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`p-4 border-2 rounded-lg text-left transition-all hover:border-purple-300 ${
        selected ? "border-purple-600 bg-purple-50" : "border-gray-200 bg-white"
      }`}
    >
      <h4 className="font-semibold text-gray-900 mb-1">{title}</h4>
      <p className="text-sm text-gray-600">{description}</p>
    </button>
  );
}
