import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MIGRATION_STEPS, type Module } from "@/lib/api-types";
import { Button } from "@/components/ui/button";
import { Check, ArrowLeft, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import ModuleCard from "@/components/ModuleCard";

export default function MigrationWorkflow() {
  const [currentStep, setCurrentStep] = useState(0);
  const [modules, setModules] = useState<Module[]>([]);
  const [, setLocation] = useLocation();

  // Fetch initial modules
  const { data: initialModules } = useQuery({
    queryKey: ["/api/migration/proceed"],
    enabled: currentStep === 0,
  });

  // Fetch modules for other steps
  const { data: stepModules } = useQuery({
    queryKey: [`/api/migration/step/${currentStep + 1}/modules`],
    enabled: currentStep > 0,
  });

  useEffect(() => {
    if (currentStep === 0 && initialModules?.modules) {
      setModules(initialModules.modules);
    } else if (currentStep > 0 && stepModules?.modules) {
      setModules(stepModules.modules);
    }
  }, [currentStep, initialModules, stepModules]);

  const handleNext = () => {
    if (currentStep < MIGRATION_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleModuleStepChange = (moduleId: string, step: number) => {
    setModules((prevModules) =>
      prevModules.map((mod) =>
        mod.id === moduleId
          ? {
              ...mod,
              currentStep: step,
              steps: mod.steps.map((s, i) => ({ ...s, completed: i < step })),
              isCompleted: step === mod.steps.length - 1,
            }
          : mod,
      ),
    );
  };

  const handleCancel = () => {
    setLocation("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-cyan-50 to-white">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <Card className="border-none shadow-lg mb-8">
            <CardHeader>
              <CardTitle className="text-2xl text-cyan-900">
                EKS Blueprint Migration Workflow
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Migration Summary Card */}
              {(initialModules?.migrationSummary ||
                stepModules?.migrationSummary) && (
                <Card className="mb-8 bg-gray-50 border-none">
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Source Version
                        </p>
                        <p className="mt-1 text-lg text-gray-900">
                          {initialModules?.migrationSummary?.sourceVersion ||
                            stepModules?.migrationSummary?.sourceVersion}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Target Version
                        </p>
                        <p className="mt-1 text-lg text-gray-900">
                          {initialModules?.migrationSummary?.targetVersion ||
                            stepModules?.migrationSummary?.targetVersion}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Ticket Number
                        </p>
                        <p className="mt-1 text-lg text-gray-900">
                          {initialModules?.migrationSummary?.ticketNumber ||
                            stepModules?.migrationSummary?.ticketNumber}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="flex justify-center items-center gap-4 mb-8">
                {MIGRATION_STEPS.map((step, index) => (
                  <div key={step.id} className="flex items-center">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-10 h-10 flex items-center justify-center rounded-full border-2 
                          ${currentStep > index
                            ? "bg-green-500 border-green-500"
                            : currentStep === index
                              ? "bg-cyan-500 border-cyan-500"
                              : "border-gray-300 bg-white"}`}
                      >
                        {currentStep > index ? (
                          <Check className="h-6 w-6 text-white" />
                        ) : (
                          <span
                            className={`text-sm font-medium ${currentStep === index ? "text-white" : "text-gray-500"}`}
                          >
                            {step.id}
                          </span>
                        )}
                      </div>
                      <span
                        className={`mt-2 text-sm font-medium ${
                          currentStep === index
                            ? "text-cyan-900"
                            : "text-gray-500"
                        }`}
                      >
                        {step.name}
                      </span>
                    </div>
                    {index < MIGRATION_STEPS.length - 1 && (
                      <div className="h-px w-20 bg-gray-300 mx-4 mt-5" />
                    )}
                  </div>
                ))}
              </div>

              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  {MIGRATION_STEPS[currentStep].name}
                </h2>
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-700">Modules</h3>
                  <div className="grid gap-4">
                    {modules.map((module) => (
                      <ModuleCard
                        key={module.id}
                        module={module}
                        onStepChange={handleModuleStepChange}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-between mt-6">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Previous Step
            </Button>
            <div className="flex gap-4">
              <Button
                variant="outline"
                onClick={handleCancel}
                className="flex items-center gap-2"
              >
                Cancel Workflow
              </Button>
              <Button
                onClick={handleNext}
                disabled={currentStep === MIGRATION_STEPS.length - 1 && !modules.every(m => m.isCompleted)}
                className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-700"
              >
                {currentStep === MIGRATION_STEPS.length - 1 ? (
                  "Finish"
                ) : (
                  <>
                    Next Step
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}