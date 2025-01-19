import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertCircle, ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import type { MigrationStepResponse, Module } from "@/lib/api-types";
import ModuleCard from "@/components/ModuleCard";

export default function MigrationWorkflow() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const navigate = useNavigate();

  const { data: stepData } = useQuery<MigrationStepResponse>({
    queryKey: [`/api/migration/step/${currentStep}`],
  });

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleCancel = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-cyan-50 to-white">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Card className="border-none shadow-lg mb-8">
            <CardHeader>
              <CardTitle className="text-2xl text-cyan-900">
                {currentStep === 1 && "Base Blueprint Layer Migration"}
                {currentStep === 2 && "Data Blueprint Layer Migration"}
                {currentStep === 3 && "Integration Blueprint Layer Migration"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Migration Steps */}
              <div className="space-y-4 mb-8">
                <h2 className="text-lg font-semibold text-gray-900">Migration Steps:</h2>
                <div className="space-y-3">
                  {stepData?.steps.map((step) => (
                    <div key={step.id} className="flex items-start gap-3 p-3 bg-white rounded-lg border">
                      <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${
                        step.completed ? 'bg-green-500' : 'bg-gray-200'
                      }`}>
                        <span className="text-white text-sm">{step.id}</span>
                      </div>
                      <p className="text-gray-700">{step.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Status Message */}
              {stepData && (
                <Card className="bg-gray-50 border-none mb-6">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-3">
                      {stepData.overallStatus === 'completed' ? (
                        <CheckCircle2 className="h-6 w-6 text-green-500 flex-shrink-0" />
                      ) : stepData.overallStatus === 'error' ? (
                        <AlertCircle className="h-6 w-6 text-red-500 flex-shrink-0" />
                      ) : null}
                      <p className="text-gray-700">{stepData.statusMessage}</p>
                    </div>
                    <div className="mt-4">
                      <Button
                        variant="outline"
                        onClick={() => setIsDialogOpen(true)}
                      >
                        {stepData.overallStatus === 'completed' ? 'View Details' : 'Review & Fix'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Modules Section (Preserved from original, but adapted) */}
              {stepData && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-700">Modules</h3>
                  <div className="grid gap-4">
                    {stepData.modules.map((module) => (
                      <ModuleCard
                        key={module.id}
                        module={module}
                        onStepChange={() => {}} // Placeholder, needs actual implementation
                      />
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex justify-between mt-6">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 1}
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
                disabled={stepData?.overallStatus === 'error' || currentStep === 3}
                className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-700"
              >
                {currentStep === 3 ? (
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

      {/* Modules Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Migration Details</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {stepData?.modules.map((module) => (
              <ModuleCard
                key={module.id}
                module={module}
                onStepChange={() => {}} // Placeholder, needs actual implementation
              />
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}