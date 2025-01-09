import { MigrationPlanData } from "@/lib/api-types";
import { Clock, CheckCircle } from "lucide-react";

interface MigrationPlanProps {
  plan: MigrationPlanData;
}

export default function MigrationPlan({ plan }: MigrationPlanProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-amber-600">
        <Clock className="h-5 w-5" />
        <span>Estimated Duration: {plan.estimatedDuration}</span>
      </div>

      <div className="space-y-4">
        <h3 className="font-medium text-gray-900">Migration Steps</h3>
        <div className="space-y-3">
          {plan.steps.map((step) => (
            <div
              key={step.id}
              className="p-4 rounded-lg bg-white border border-amber-100"
            >
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-1" />
                <div>
                  <h4 className="font-medium text-gray-900">{step.title}</h4>
                  <p className="mt-1 text-sm text-gray-600">{step.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}