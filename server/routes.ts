import type { Express } from "express";
import { createServer, type Server } from "http";
import type { MigrationPlanData, StepModulesResponse } from "../client/src/lib/api-types";

export function registerRoutes(app: Express): Server {
  app.post("/api/migration/plan", (req, res) => {
    const { sourceVersion, targetVersion } = req.body;

    // Mock response - in production this would call actual migration planning logic
    const migrationPlan: MigrationPlanData = {
      sourceVersion,
      targetVersion,
      summary: "This is a mock migration plan summary.\n 1. Migrate from 4.1.1 to 4.2.x\n 2. Migrate from 4.2.x to 4.3.x\n 3. Migrate from 4.3.x to 6.0.5",
    };

    res.json(migrationPlan);
  });

  app.post("/api/migration/proceed", (req, res) => {
    // Mock response with initial modules for the first step
    const response: StepModulesResponse = {
      modules: [
        {
          id: "core-infra",
          title: "Core Infrastructure",
          description: "Setup and configure core infrastructure components",
          currentStep: 0,
          instructions: "Follow these steps to set up the core infrastructure:\n1. Configure VPC settings\n2. Set up networking\n3. Configure security groups",
          steps: [
            { name: "VPC Setup", completed: false },
            { name: "Network Config", completed: false },
            { name: "Security Groups", completed: false },
          ],
        },
        {
          id: "cluster-config",
          title: "Cluster Configuration",
          description: "Configure EKS cluster settings and components",
          currentStep: 0,
          instructions: "Configure the EKS cluster with these steps:\n1. Set up node groups\n2. Install required add-ons\n3. Configure monitoring",
          steps: [
            { name: "Node Groups", completed: false },
            { name: "Add-ons", completed: false },
            { name: "Monitoring", completed: false },
          ],
        },
      ],
    };

    res.json(response);
  });

  app.get("/api/migration/step/:stepId/modules", (req, res) => {
    const stepId = parseInt(req.params.stepId);

    // Mock different modules for each step
    const modulesByStep: Record<number, StepModulesResponse> = {
      2: {
        modules: [
          {
            id: "data-storage",
            title: "Data Storage",
            description: "Configure data persistence and storage solutions",
            currentStep: 0,
            instructions: "Set up data storage components:\n1. Configure EBS volumes\n2. Set up EFS if needed\n3. Configure backup policies",
            steps: [
              { name: "Volume Setup", completed: false },
              { name: "Storage Class", completed: false },
              { name: "Backup Config", completed: false },
            ],
          },
        ],
      },
      3: {
        modules: [
          {
            id: "integration-setup",
            title: "Integration Setup",
            description: "Configure integration components and services",
            currentStep: 0,
            instructions: "Set up integration components:\n1. Configure service mesh\n2. Set up API gateway\n3. Configure external services",
            steps: [
              { name: "Service Mesh", completed: false },
              { name: "API Gateway", completed: false },
              { name: "External Services", completed: false },
            ],
          },
        ],
      },
    };

    res.json(modulesByStep[stepId] || { modules: [] });
  });

  const httpServer = createServer(app);
  return httpServer;
}