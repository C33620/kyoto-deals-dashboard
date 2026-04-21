import { KyotoMapWrapper } from "@/components/map/KyotoMapWrapper";
import { DashboardShell } from "@/components/ui/DashboardShell";

export default function HomePage() {
  return (
    <DashboardShell>
      <KyotoMapWrapper />
    </DashboardShell>
  );
}
