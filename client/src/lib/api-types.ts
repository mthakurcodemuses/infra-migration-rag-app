export interface MigrationPlanData {
  sourceVersion: string;
  targetVersion: string;
  summary: string;
}

export interface MigrationFormData {
  sourceVersion: string;
  targetVersion: string;
  baseLayerRepoUrl?: string;
  dataLayerRepoUrl?: string;
  integrationLayerRepoUrl?: string;
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

export interface StepperData {
  currentStep: number;
  steps: {
    id: number;
    name: string;
    completed: boolean;
  }[];
}

export const MIGRATION_STEPS = [
  { id: 1, name: 'Base Blueprint Layer Migration', completed: false },
  { id: 2, name: 'Data Blueprint Layer Migration', completed: false },
  { id: 3, name: 'Integration Blueprint Layer Migration', completed: false },
];