import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { EKS_VERSIONS, MigrationFormData, MigrationPlanData } from "@/lib/api-types";
import { Loader2 } from "lucide-react";
import { useLocation } from "wouter";

interface MigrationFormProps {
  onPlanGenerated: (plan: MigrationPlanData) => void;
}

export default function MigrationForm({ onPlanGenerated }: MigrationFormProps) {
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

  const migrationMutation = useMutation({
    mutationFn: async (data: MigrationFormData) => {
      const response = await fetch("/api/migration/plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to generate migration plan");
      }

      return response.json();
    },
    onSuccess: (data) => {
      onPlanGenerated(data);
      toast({
        title: "Success",
        description: "Migration plan generated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to generate migration plan",
        variant: "destructive",
      });
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

  const onSubmit = (data: MigrationFormData) => {
    migrationMutation.mutate(data);
  };

  const handleReset = () => {
    form.reset();
    onPlanGenerated(null as any);
  };

  const handleProceed = () => {
    proceedMutation.mutate(form.getValues());
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="sourceVersion"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Source Version</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select source version" />
                    </SelectTrigger>
                    <SelectContent>
                      {EKS_VERSIONS.map((version) => (
                        <SelectItem key={version} value={version}>
                          {version}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="targetVersion"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Target Version</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select target version" />
                    </SelectTrigger>
                    <SelectContent>
                      {EKS_VERSIONS.map((version) => (
                        <SelectItem key={version} value={version}>
                          {version}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {migrationMutation.isSuccess && (
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
        )}

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleReset}
            disabled={migrationMutation.isPending || proceedMutation.isPending}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={migrationMutation.isPending || proceedMutation.isPending}
          >
            {migrationMutation.isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            View Migration Plan
          </Button>
          {migrationMutation.isSuccess && (
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
          )}
        </div>
      </form>
    </Form>
  );
}