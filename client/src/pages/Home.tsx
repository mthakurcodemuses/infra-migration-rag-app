import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import MigrationForm from "@/components/MigrationForm";
import { useState } from "react";
import MigrationPlan from "@/components/MigrationPlan";
import { MigrationFormData, MigrationPlanData } from "@/lib/api-types";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

export default function Home() {
  const [migrationPlan, setMigrationPlan] = useState<MigrationPlanData | null>(null);
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const form = useForm<MigrationFormData>({
    defaultValues: {
      sourceVersion: "",
      targetVersion: "",
      baseLayerRepoUrl: "",
      dataLayerRepoUrl: "",
      integrationLayerRepoUrl: "",
    },
  });

  const proceedMutation = useMutation({
    mutationFn: async (data: MigrationFormData) => {
      const response = await fetch("/api/migration/proceed", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to proceed with migration");
      }

      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Proceeding with migration workflow",
      });
      setLocation("/migration-workflow");
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to proceed with migration",
        variant: "destructive",
      });
    },
  });

  const handleProceed = () => {
    proceedMutation.mutate(form.getValues());
  };

  const handleCancel = () => {
    form.reset();
    setMigrationPlan(null);
  };

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
              <CardContent className="space-y-6">
                <MigrationPlan plan={migrationPlan} />

                <Form {...form}>
                  <form className="space-y-6">
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="baseLayerRepoUrl"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Base Layer Terraform Repo URL</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Enter repository URL" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="dataLayerRepoUrl"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Data Layer Terraform Repo URL</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Enter repository URL" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="integrationLayerRepoUrl"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Integration Layer Terraform Repo URL</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Enter repository URL" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="flex justify-end gap-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleCancel}
                        disabled={proceedMutation.isPending}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="button"
                        onClick={handleProceed}
                        disabled={proceedMutation.isPending}
                        className="bg-amber-600 hover:bg-amber-700"
                      >
                        {proceedMutation.isPending && (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        Proceed
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}