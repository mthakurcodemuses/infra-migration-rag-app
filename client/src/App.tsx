import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { Layout } from "./components/Layout";
import MigrationWorkflow from "./pages/MigrationWorkflow";
import Home from "./pages/Home";

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/eks-migration" replace />} />
          <Route path="/eks-migration" element={<Home />} />
          <Route path="/migration-workflow" element={<MigrationWorkflow />} />
          <Route path="/ecs-migration" element={<ComingSoon />} />
          <Route path="/monito-boot" element={<ComingSoon />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

// ComingSoon component for routes that are not yet implemented
function ComingSoon() {
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardContent className="pt-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Coming Soon</h1>
        <p className="text-gray-600">
          This feature is currently under development and will be available
          soon.
        </p>
      </CardContent>
    </Card>
  );
}

// fallback 404 not found page
function NotFound() {
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="pt-6">
        <div className="flex mb-4 gap-2">
          <AlertCircle className="h-8 w-8 text-red-500" />
          <h1 className="text-2xl font-bold text-gray-900">
            404 Page Not Found
          </h1>
        </div>
        <p className="mt-4 text-sm text-gray-600">
          The requested page could not be found.
        </p>
      </CardContent>
    </Card>
  );
}

export default App;
