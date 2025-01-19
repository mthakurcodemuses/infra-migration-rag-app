import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertCircle, ArrowLeft, ArrowRight, Check, Loader2 } from "lucide-react";
import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import type { 
  MigrationStepResponse, 
  Module, 
  BlueprintLayerMigrationRequest,
  BlueprintLayerMigrationResponse 
} from "@/lib/api-types";
import ModuleCard from "@/components/ModuleCard";

const MIGRATION_PHASES = [
  { id: 1, name: 'Base Blueprint Layer Migration' },
  { id: 2, name: 'Data Blueprint Layer Migration' },
  { id: 3, name: 'Integration Blueprint Migration' },
];

export default function MigrationWorkflow() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [migrationResponse, setMigrationResponse] = useState<BlueprintLayerMigrationResponse | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const form = useForm<BlueprintLayerMigrationRequest>({
    defaultValues: {
      repoUrl: "",
    },
  });

  const migrationMutation = useMutation({
    mutationFn: async (data: BlueprintLayerMigrationRequest) => {
      const response = await fetch(`/api/migration/blueprint/${currentStep}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to start migration");
      }

      return response.json() as Promise<BlueprintLayerMigrationResponse>;
    },
    onSuccess: (data) => {
      setMigrationResponse(data);
      toast({
        title: "Success",
        description: "Migration process completed successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to start migration",
        variant: "destructive",
      });
    },
  });

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
      setMigrationResponse(null);
      form.reset();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setMigrationResponse(null);
      form.reset();
    }
  };

  const handleCancel = () => {
    navigate("/");
  };

  const onSubmit = (data: BlueprintLayerMigrationRequest) => {
    migrationMutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-cyan-50 to-white">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Top-level Stepper */}
          <div className="mb-8">
            <div className="flex justify-center items-center gap-4">
              {MIGRATION_PHASES.map((phase, index) => (
                <div key={phase.id} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-10 h-10 flex items-center justify-center rounded-full border-2 
                        ${currentStep > phase.id
                          ? "bg-green-500 border-green-500"
                          : currentStep === phase.id
                            ? "bg-cyan-500 border-cyan-500"
                            : "border-gray-300 bg-white"}`}
                    >
                      {currentStep > phase.id ? (
                        <Check className="h-6 w-6 text-white" />
                      ) : (
                        <span
                          className={`text-sm font-medium ${
                            currentStep === phase.id ? "text-white" : "text-gray-500"
                          }`}
                        >
                          {phase.id}
                        </span>
                      )}
                    </div>
                    <span
                      className={`mt-2 text-sm font-medium text-center ${
                        currentStep === phase.id
                          ? "text-cyan-900"
                          : "text-gray-500"
                      }`}
                    >
                      {phase.name}
                    </span>
                  </div>
                  {index < MIGRATION_PHASES.length - 1 && (
                    <div className="h-px w-20 bg-gray-300 mx-4 mt-5" />
                  )}
                </div>
              ))}
            </div>
          </div>

          <Card className="border-none shadow-lg mb-8">
            <CardHeader>
              <CardTitle className="text-2xl text-cyan-900">
                {MIGRATION_PHASES[currentStep - 1].name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="repoUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{`${MIGRATION_PHASES[currentStep - 1].name.split(' ')[0]} Blueprint Layer Repo URL`}</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter repository URL" />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <Button 
                    type="submit" 
                    disabled={migrationMutation.isPending}
                    className="w-full bg-cyan-600 hover:bg-cyan-700"
                  >
                    {migrationMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Migrating...
                      </>
                    ) : (
                      'Migrate'
                    )}
                  </Button>
                </form>
              </Form>

              {/* Migration Response Section */}
              {migrationResponse && (
                <div className="mt-8 space-y-6">
                  {/* Links Section */}
                  <div className="space-y-4">
                    <FormItem>
                      <FormLabel>Sourcegraph Batch Change Link</FormLabel>
                      <div className="p-2 bg-gray-50 rounded-md border">
                        {migrationResponse.sourcegraphLink || 'N/A'}
                      </div>
                    </FormItem>

                    <FormItem>
                      <FormLabel>Pull Request</FormLabel>
                      <div className="p-2 bg-gray-50 rounded-md border">
                        {migrationResponse.pullRequestLink || 'N/A'}
                      </div>
                    </FormItem>
                  </div>

                  {/* Migration Steps */}
                  <div className="space-y-4">
                    <h2 className="text-lg font-semibold text-gray-900">Migration Steps:</h2>
                    <div className="space-y-3">
                      {migrationResponse.steps.map((step) => (
                        <div 
                          key={step.id} 
                          className={`flex items-start gap-3 p-3 rounded-lg border ${
                            !step.completed && migrationResponse.overallStatus === 'error' 
                              ? 'bg-red-50 border-red-200' 
                              : 'bg-white'
                          }`}
                        >
                          <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${
                            step.completed 
                              ? 'bg-green-500' 
                              : migrationResponse.overallStatus === 'error'
                                ? 'bg-red-500'
                                : 'bg-gray-200'
                          }`}>
                            <span className="text-white text-sm">{step.id}</span>
                          </div>
                          <p className={`text-gray-700 ${
                            !step.completed && migrationResponse.overallStatus === 'error' 
                              ? 'text-red-700' 
                              : ''
                          }`}>
                            {step.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Status Message */}
                  <Card className="bg-gray-50 border-none">
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-3">
                        {migrationResponse.overallStatus === 'completed' ? (
                          <CheckCircle2 className="h-6 w-6 text-green-500 flex-shrink-0" />
                        ) : migrationResponse.overallStatus === 'error' ? (
                          <AlertCircle className="h-6 w-6 text-red-500 flex-shrink-0" />
                        ) : null}
                        <p className={`${
                          migrationResponse.overallStatus === 'error' 
                            ? 'text-red-700' 
                            : 'text-gray-700'
                        }`}>
                          {migrationResponse.statusMessage}
                        </p>
                      </div>
                      <div className="mt-4">
                        <Button
                          variant="outline"
                          onClick={() => setIsDialogOpen(true)}
                        >
                          View Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
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
                disabled={currentStep === 3}
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
            {migrationResponse?.modules?.map((module: Module) => (
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