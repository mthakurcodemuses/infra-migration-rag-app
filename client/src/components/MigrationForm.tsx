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
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { EKS_VERSIONS, MigrationFormData, MigrationPlanData } from "@/lib/api-types";
import { Loader2 } from "lucide-react";

interface MigrationFormProps {
  onPlanGenerated: (plan: MigrationPlanData) => void;
}

export default function MigrationForm({ onPlanGenerated }: MigrationFormProps) {
  const { toast } = useToast();
  const form = useForm<MigrationFormData>({
    defaultValues: {
      sourceVersion: "",
      targetVersion: "",
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

  const onSubmit = (data: MigrationFormData) => {
    migrationMutation.mutate(data);
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

        <div className="flex justify-end">
          <Button type="submit" disabled={migrationMutation.isPending}>
            {migrationMutation.isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            View Migration Plan
          </Button>
        </div>
      </form>
    </Form>
  );
}