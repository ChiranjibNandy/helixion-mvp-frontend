import { RegistrationsTable } from "@/components/admin/RegistrationsTable";

export default function PendingRegistrationsPage() {
  return (
    <div className="p-8 max-w-[1600px] mx-auto w-full">
      <RegistrationsTable initialStatus="pending" />
    </div>
  );
}
