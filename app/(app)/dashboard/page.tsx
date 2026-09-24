import { EmptyState } from "@/components/ui/empty-state";
import { PageTitle } from "@/components/ui/page-title";

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <PageTitle description="Your recent activity and workout consistency will appear here.">
        Dashboard
      </PageTitle>
      <EmptyState
        description="Workout routines and completed sessions will show here as you build them."
        title="Your training space is ready"
      />
    </div>
  );
}
