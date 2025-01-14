import { SiAwselasticcontainerservice, SiAmazoneks } from "react-icons/si";
import { MonitorIcon } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
} from "@/components/ui/sidebar";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const location = useLocation();

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen">
        <Sidebar>
          <SidebarHeader className="border-b border-border">
            <h2 className="px-2 text-lg font-semibold">Migration Tool</h2>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={location.pathname === "/eks-migration"}
                >
                  <Link to="/eks-migration">
                    <SiAmazoneks className="shrink-0" />
                    <span>EKS Migration</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={location.pathname === "/ecs-migration"}
                >
                  <Link to="/ecs-migration">
                    <SiAwselasticcontainerservice className="shrink-0" />
                    <span>ECS Migration</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={location.pathname === "/monito-boot"}
                >
                  <Link to="/monito-boot">
                    <MonitorIcon className="shrink-0" />
                    <span>Monito Boot</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>
        <main className="flex-1 overflow-auto">
          <div className="container mx-auto p-6">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}