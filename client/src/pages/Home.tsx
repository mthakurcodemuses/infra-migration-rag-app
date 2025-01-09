import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import MigrationForm from "@/components/MigrationForm";
import { useState } from "react";
import MigrationPlan from "@/components/MigrationPlan";
import { MigrationPlanData } from "@/lib/api-types";

export default function Home() {
  const [migrationPlan, setMigrationPlan] = useState<MigrationPlanData | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <Card className="border-none shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl text-amber-900">
                EKS Blueprint Migration Planner
              </CardTitle>
            </CardHeader>
            <CardContent>
              <MigrationForm onPlanGenerated={setMigrationPlan} />
            </CardContent>
          </Card>

          {migrationPlan && (
            <Card className="border-none shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl text-amber-900">
                  Migration Plan Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <MigrationPlan plan={migrationPlan} />
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
