import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import Home from "./pages/Home";
import EKSMigration from "./pages/EKSMigration";
import ECSMigration from "./pages/ECSMigration";
import MonitorBoot from "./pages/MonitorBoot";
import MigrationWorkflow from "./pages/MigrationWorkflow";
import MainLayout from "./components/MainLayout";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout><Home /></MainLayout>} />
        <Route path="/eks-migration" element={<MainLayout><EKSMigration /></MainLayout>} />
        <Route path="/ecs-migration" element={<MainLayout><ECSMigration /></MainLayout>} />
        <Route path="/monitor-boot" element={<MainLayout><MonitorBoot /></MainLayout>} />
        <Route path="/migration-workflow" element={<MigrationWorkflow />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

// fallback 404 not found page
function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md mx-4">
        <CardContent className="pt-6">
          <div className="flex mb-4 gap-2">
            <AlertCircle className="h-8 w-8 text-red-500" />
            <h1 className="text-2xl font-bold text-gray-900">404 Page Not Found</h1>
          </div>
          <p className="mt-4 text-sm text-gray-600">
            The requested page could not be found.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

export default App;