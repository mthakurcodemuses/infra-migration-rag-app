import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ECSMigration() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-8">
      <div className="max-w-4xl mx-auto">
        <Card className="border-none shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl text-amber-900">
              ECS Migration Planner
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">ECS Migration functionality coming soon...</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
