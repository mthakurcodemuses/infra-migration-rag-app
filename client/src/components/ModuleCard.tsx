import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Check, ArrowLeft, ArrowRight, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import type { Module } from "@/lib/api-types";

interface ModuleCardProps {
  module: Module;
  onStepChange: (moduleId: string, step: number) => void;
}

export default function ModuleCard({ module, onStepChange }: ModuleCardProps) {
  const [isExpanded, setIsExpanded] = useState(!module.isCompleted);
  
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

  const handleDone = () => {
    onStepChange(module.id, module.steps.length - 1);
    setIsExpanded(false);
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  if (!isExpanded) {
    return (
      <Card className="border shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CardTitle className="text-lg font-semibold">{module.title}</CardTitle>
              {module.isCompleted && <Check className="h-5 w-5 text-green-500" />}
            </div>
            <Button variant="ghost" size="sm" onClick={toggleExpand}>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="border shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold">{module.title}</CardTitle>
            <p className="text-sm text-gray-500">{module.description}</p>
          </div>
          <Button variant="ghost" size="sm" onClick={toggleExpand}>
            <ChevronUp className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          {module.steps.map((step, index) => (
            <div key={index} className="flex items-center">
              <div
                className={`w-6 h-6 flex items-center justify-center rounded-full border 
                  ${step.completed
                    ? "bg-green-500 border-green-500"
                    : index === module.currentStep
                      ? "bg-cyan-500 border-cyan-500"
                      : "border-gray-300"}`}
              >
                {step.completed ? (
                  <Check className="h-4 w-4 text-white" />
                ) : (
                  <span
                    className={`text-xs ${
                      index === module.currentStep ? "text-white" : "text-gray-500"
                    }`}
                  >
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
          value={module.steps[module.currentStep].instructions}
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
          {module.currentStep === module.steps.length - 1 ? (
            <Button
              onClick={handleDone}
              size="sm"
              className="bg-green-600 hover:bg-green-700"
            >
              Done
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              size="sm"
              className="bg-cyan-600 hover:bg-cyan-700"
            >
              Next
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
