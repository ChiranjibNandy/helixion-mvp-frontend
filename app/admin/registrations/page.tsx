import { RegistrationsTable } from "@/components/admin/RegistrationsTable";

export default function RegistrationsPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <RegistrationsTable />
      </div>
    </div>
  );
}
