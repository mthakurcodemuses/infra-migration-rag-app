export interface MigrationPlanData {
  sourceVersion: string;
  targetVersion: string;
  steps: MigrationStep[];
  estimatedDuration: string;
  risks: Risk[];
}

export interface MigrationStep {
  id: string;
  title: string;
  description: string;
  status: "pending" | "in-progress" | "completed";
}

export interface Risk {
  severity: "low" | "medium" | "high";
  description: string;
  mitigation: string;
}

export interface MigrationFormData {
  sourceVersion: string;
  targetVersion: string;
}

export const EKS_VERSIONS = [
  "1.27",
  "1.26",
  "1.25",
  "1.24",
  "1.23",
  "1.22",
  "1.21",
] as const;
