import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center p-8">
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold text-amber-900">
          Welcome to Migration Tool
        </h1>
        <p className="text-gray-600 max-w-md mx-auto">
          Select a migration option from the sidebar to get started with your infrastructure migration journey.
        </p>
        <Button 
          onClick={() => navigate('/eks-migration')}
          className="bg-amber-600 hover:bg-amber-700"
        >
          Start Migration
        </Button>
      </div>
    </div>
  );
}