import { MigrationPlanData } from "@/lib/api-types";

interface MigrationPlanProps {
  plan: MigrationPlanData;
}

export default function MigrationPlan({ plan }: MigrationPlanProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-3">
          <div className="p-4 rounded-lg bg-white border border-gray-100">
            <p className="mt-1 text-sm text-gray-600">{plan.summary}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
