import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MIGRATION_STEPS } from "@/lib/api-types";
import { Check } from "lucide-react";

export default function MigrationWorkflow() {
  const [location] = useLocation();
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Card className="border-none shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl text-amber-900">
                EKS Blueprint Migration Workflow
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                {MIGRATION_STEPS.map((step, index) => (
                  <div key={step.id} className="flex items-start mb-8 relative">
                    <div className="flex items-center">
                      <div className={`w-8 h-8 flex items-center justify-center rounded-full border-2 
                        ${step.completed 
                          ? 'bg-green-500 border-green-500' 
                          : index === 0 
                            ? 'bg-amber-500 border-amber-500'
                            : 'border-gray-300 bg-white'}`}>
                        {step.completed ? (
                          <Check className="h-5 w-5 text-white" />
                        ) : (
                          <span className={`text-sm ${index === 0 ? 'text-white' : 'text-gray-500'}`}>
                            {step.id}
                          </span>
                        )}
                      </div>
                      {index < MIGRATION_STEPS.length - 1 && (
                        <div className="h-full w-px bg-gray-300 absolute top-8 left-4 -bottom-8" />
                      )}
                    </div>
                    <div className="ml-4">
                      <h3 className={`font-medium ${
                        index === 0 ? 'text-amber-900' : 'text-gray-500'
                      }`}>
                        {step.name}
                      </h3>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
