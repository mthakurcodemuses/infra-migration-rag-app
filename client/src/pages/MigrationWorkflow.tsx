import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MIGRATION_STEPS } from "@/lib/api-types";
import { Button } from "@/components/ui/button";
import { Check, ArrowLeft, ArrowRight } from "lucide-react";
import { useState } from "react";

interface ModuleCardProps {
  title: string;
  description: string;
  steps: { name: string; completed: boolean }[];
}

function ModuleCard({ title, description, steps }: ModuleCardProps) {
  return (
    <Card className="border shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
        <p className="text-sm text-gray-500">{description}</p>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4">
          {steps.map((step, index) => (
            <div key={index} className="flex items-center">
              <div
                className={`w-6 h-6 flex items-center justify-center rounded-full border 
                  ${step.completed ? 'bg-green-500 border-green-500' : 'border-gray-300'}`}
              >
                {step.completed ? (
                  <Check className="h-4 w-4 text-white" />
                ) : (
                  <span className="text-xs text-gray-500">{index + 1}</span>
                )}
              </div>
              {index < steps.length - 1 && (
                <div className="h-px w-8 bg-gray-200 mx-2" />
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default function MigrationWorkflow() {
  const [currentStep, setCurrentStep] = useState(0);
  const [location] = useLocation();

  // Mock module data for demonstration
  const modules = [
    {
      title: "Core Infrastructure",
      description: "Setup and configure core infrastructure components",
      steps: [
        { name: "VPC Setup", completed: true },
        { name: "Network Config", completed: false },
        { name: "Security Groups", completed: false },
      ],
    },
    {
      title: "Cluster Configuration",
      description: "Configure EKS cluster settings and components",
      steps: [
        { name: "Node Groups", completed: false },
        { name: "Add-ons", completed: false },
        { name: "Monitoring", completed: false },
      ],
    },
    {
      title: "Blueprint Integration",
      description: "Integrate with existing blueprint components",
      steps: [
        { name: "Dependencies", completed: false },
        { name: "Configuration", completed: false },
        { name: "Validation", completed: false },
      ],
    },
  ];

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
                    {modules.map((module, index) => (
                      <ModuleCard key={index} {...module} />
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