import { MigrationPlanData } from "@/lib/api-types";
import { AlertTriangle, CheckCircle, Clock } from "lucide-react";

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

      {plan.risks.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-medium text-gray-900">Potential Risks</h3>
          <div className="space-y-3">
            {plan.risks.map((risk, index) => (
              <div
                key={index}
                className="p-4 rounded-lg bg-white border border-amber-100"
              >
                <div className="flex items-start gap-3">
                  <AlertTriangle
                    className={`h-5 w-5 mt-1 ${
                      risk.severity === "high"
                        ? "text-red-500"
                        : risk.severity === "medium"
                        ? "text-amber-500"
                        : "text-yellow-500"
                    }`}
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-sm font-medium ${
                          risk.severity === "high"
                            ? "text-red-700"
                            : risk.severity === "medium"
                            ? "text-amber-700"
                            : "text-yellow-700"
                        }`}
                      >
                        {risk.severity.toUpperCase()} RISK
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-gray-600">
                      {risk.description}
                    </p>
                    <p className="mt-2 text-sm text-gray-800">
                      <span className="font-medium">Mitigation: </span>
                      {risk.mitigation}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
