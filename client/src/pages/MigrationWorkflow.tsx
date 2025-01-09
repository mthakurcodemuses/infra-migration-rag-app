import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MIGRATION_STEPS, type Module } from "@/lib/api-types";
import { Button } from "@/components/ui/button";
import { Check, ArrowLeft, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Textarea } from "@/components/ui/textarea";

interface ModuleCardProps {
  module: Module;
  onStepChange: (moduleId: string, step: number) => void;
}

function ModuleCard({ module, onStepChange }: ModuleCardProps) {
  const handlePrevious = () => {
    if (module.currentStep > 0) {
      onStepChange(module.id, module.currentStep - 1);
    }
  };

  const handleNext = () => {
    if (module.currentStep < module.steps.length - 1) {
      onStepChange(module.id, module.currentStep + 1);
    }
  };

  return (
    <Card className="border shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold">{module.title}</CardTitle>
        <p className="text-sm text-gray-500">{module.description}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          {module.steps.map((step, index) => (
            <div key={index} className="flex items-center">
              <div
                className={`w-6 h-6 flex items-center justify-center rounded-full border 
                  ${step.completed ? 'bg-green-500 border-green-500' : 
                    index === module.currentStep ? 'bg-amber-500 border-amber-500' : 'border-gray-300'}`}
              >
                {step.completed ? (
                  <Check className="h-4 w-4 text-white" />
                ) : (
                  <span className={`text-xs ${index === module.currentStep ? 'text-white' : 'text-gray-500'}`}>
                    {index + 1}
                  </span>
                )}
              </div>
              {index < module.steps.length - 1 && (
                <div className="h-px w-8 bg-gray-200 mx-2" />
              )}
            </div>
          ))}
        </div>

        <Textarea
          value={module.instructions}
          readOnly
          className="min-h-[100px] bg-gray-50"
        />

        <div className="flex justify-end gap-4">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={module.currentStep === 0}
            size="sm"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>
          <Button
            onClick={handleNext}
            disabled={module.currentStep === module.steps.length - 1}
            size="sm"
            className="bg-amber-600 hover:bg-amber-700"
          >
            Next
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function MigrationWorkflow() {
  const [currentStep, setCurrentStep] = useState(0);
  const [modules, setModules] = useState<Module[]>([]);
  const [location] = useLocation();

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
    setModules(prevModules => 
      prevModules.map(mod => 
        mod.id === moduleId 
          ? { ...mod, currentStep: step, steps: mod.steps.map((s, i) => ({ ...s, completed: i < step })) }
          : mod
      )
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <Card className="border-none shadow-lg mb-8">
            <CardHeader>
              <CardTitle className="text-2xl text-amber-900">
                EKS Blueprint Migration Workflow
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center items-center gap-4 mb-8">
                {MIGRATION_STEPS.map((step, index) => (
                  <div key={step.id} className="flex items-center">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-10 h-10 flex items-center justify-center rounded-full border-2 
                          ${currentStep > index
                            ? 'bg-green-500 border-green-500'
                            : currentStep === index
                              ? 'bg-amber-500 border-amber-500'
                              : 'border-gray-300 bg-white'}`}
                      >
                        {currentStep > index ? (
                          <Check className="h-6 w-6 text-white" />
                        ) : (
                          <span className={`text-sm font-medium ${currentStep === index ? 'text-white' : 'text-gray-500'}`}>
                            {step.id}
                          </span>
                        )}
                      </div>
                      <span className={`mt-2 text-sm font-medium ${
                        currentStep === index ? 'text-amber-900' : 'text-gray-500'
                      }`}>
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
            <Button
              onClick={handleNext}
              disabled={currentStep === MIGRATION_STEPS.length - 1}
              className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700"
            >
              Next Step
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}