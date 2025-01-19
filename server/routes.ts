import type { Express } from "express";
import { createServer, type Server } from "http";
import type { MigrationPlanData, StepModulesResponse, MigrationStepResponse } from "../client/src/lib/api-types";

export function registerRoutes(app: Express): Server {
  app.post("/api/migration/plan", (req, res) => {
    const { sourceVersion, targetVersion } = req.body;

    const migrationPlan: MigrationPlanData = {
      sourceVersion,
      targetVersion,
      summary: "This is a mock migration plan summary.\n 1. Migrate from 4.1.1 to 4.2.x\n 2. Migrate from 4.2.x to 4.3.x\n 3. Migrate from 4.3.x to 6.0.5",
    };

    res.json(migrationPlan);
  });

  app.get("/api/migration/step/:stepId", (req, res) => {
    const stepId = parseInt(req.params.stepId);

    const response: MigrationStepResponse = {
      steps: [
        { 
          id: 1, 
          description: "Apply open rewrite recipe (eks-microservices) to migrate from 4.1.1 to 4.2.x",
          completed: true
        },
        { 
          id: 2, 
          description: "Apply open rewrite recipe (eks-microservices) to migrate from 4.2.x to 4.3.x",
          completed: true 
        },
        { 
          id: 3, 
          description: "Apply open rewrite recipe (eks-microservices) to migrate from 4.3.x to 6.0.x",
          completed: false 
        }
      ],
      statusMessage: "There was some errors while applying the open rewrite recipes.",
      overallStatus: "error",
      modules: [
        {
          id: "core-infra",
          title: "Core Infrastructure",
          description: "Setup and configure core infrastructure components",
          currentStep: 0,
          isCompleted: false,
          steps: [
            { 
              name: "VPC Setup", 
              completed: false,
              instructions: "Configure VPC settings:\n1. Update CIDR blocks\n2. Configure subnets\n3. Set up routing tables"
            },
            { 
              name: "Network Config", 
              completed: false,
              instructions: "Set up networking:\n1. Configure NAT gateways\n2. Set up internet gateways\n3. Configure route tables"
            },
            { 
              name: "Security Groups", 
              completed: false,
              instructions: "Configure security:\n1. Define security group rules\n2. Set up NACL policies\n3. Review network policies"
            },
          ],
        },
        {
          id: "cluster-config",
          title: "Cluster Configuration",
          description: "Configure EKS cluster settings and components",
          currentStep: 0,
          isCompleted: false,
          steps: [
            { 
              name: "Node Groups", 
              completed: false,
              instructions: "Set up node groups:\n1. Define instance types\n2. Configure auto-scaling\n3. Set up node labels"
            },
            { 
              name: "Add-ons", 
              completed: false,
              instructions: "Install add-ons:\n1. Configure CNI plugin\n2. Set up CoreDNS\n3. Install metrics server"
            },
            { 
              name: "Monitoring", 
              completed: false,
              instructions: "Configure monitoring:\n1. Set up Prometheus\n2. Configure Grafana\n3. Set up alerts"
            },
          ],
        },
      ],
    };

    res.json(response);
  });

  app.get("/api/migration/step/:stepId/modules", (req, res) => {
    const stepId = parseInt(req.params.stepId);

    const modulesByStep: Record<number, StepModulesResponse> = {
      2: {
        modules: [
          {
            id: "data-storage",
            title: "Data Storage",
            description: "Configure data persistence and storage solutions",
            currentStep: 0,
            isCompleted: false,
            steps: [
              { 
                name: "Volume Setup", 
                completed: false,
                instructions: "Set up volumes:\n1. Configure EBS settings\n2. Set up volume types\n3. Configure encryption"
              },
              { 
                name: "Storage Class", 
                completed: false,
                instructions: "Configure storage classes:\n1. Define storage classes\n2. Set up parameters\n3. Configure provisioners"
              },
              { 
                name: "Backup Config", 
                completed: false,
                instructions: "Set up backups:\n1. Configure backup policies\n2. Set up retention\n3. Test recovery"
              },
            ],
          },
          {
            id: "data-lifecycle",
            title: "Data Lifecycle Management",
            description: "Configure data retention and lifecycle policies",
            currentStep: 0,
            isCompleted: false,
            steps: [
              { 
                name: "Retention Policies", 
                completed: false,
                instructions: "Set up retention:\n1. Define retention periods\n2. Configure archival rules\n3. Set up cleanup jobs"
              },
              { 
                name: "Backup Schedules", 
                completed: false,
                instructions: "Configure backups:\n1. Set up backup schedule\n2. Configure retention periods\n3. Test restore procedures"
              },
              { 
                name: "Monitoring", 
                completed: false,
                instructions: "Configure monitoring:\n1. Configure alerts\n2. Set up dashboards\n3. Define SLAs"
              },
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
            isCompleted: false,
            steps: [
              { 
                name: "Service Mesh", 
                completed: false,
                instructions: "Set up service mesh:\n1. Install Istio\n2. Configure sidecars\n3. Set up routing"
              },
              { 
                name: "API Gateway", 
                completed: false,
                instructions: "Configure API gateway:\n1. Set up routes\n2. Configure SSL\n3. Set up rate limiting"
              },
              { 
                name: "External Services", 
                completed: false,
                instructions: "Configure external services:\n1. Set up endpoints\n2. Configure authentication\n3. Set up monitoring"
              },
            ],
          },
          {
            id: "security-integration",
            title: "Security Integration",
            description: "Configure security components and policies",
            currentStep: 0,
            isCompleted: false,
            steps: [
              { 
                name: "IAM Setup", 
                completed: false,
                instructions: "Configure IAM:\n1. Set up roles\n2. Configure policies\n3. Set up service accounts"
              },
              { 
                name: "Security Policies", 
                completed: false,
                instructions: "Set up policies:\n1. Configure network policies\n2. Set up RBAC\n3. Configure audit logging"
              },
              { 
                name: "Compliance", 
                completed: false,
                instructions: "Configure compliance:\n1. Set up compliance checks\n2. Configure reporting\n3. Set up alerts"
              },
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