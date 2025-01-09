import { Switch, Route } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import Home from "./pages/Home";
import MigrationWorkflow from "./pages/MigrationWorkflow";

function App() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/migration-workflow" component={MigrationWorkflow} />
      <Route component={NotFound} />
    </Switch>
  );
}

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