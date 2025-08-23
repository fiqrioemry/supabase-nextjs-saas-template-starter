"use client";

import {
  Sidebar,
  SidebarRail,
  SidebarFooter,
  SidebarHeader,
  SidebarContent,
} from "@/components/ui/sidebar";
import * as React from "react";
import { AppLogo } from "@/components/home/app-logo";
import { NavMain } from "@/components/dashboard/nav-main";
import { NavUser } from "@/components/dashboard/nav-user";
import { Settings, SquareTerminal } from "lucide-react";
import { usePathname } from "next/navigation";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();

  const navMain = [
    {
      title: "Forms",
      url: "/dashboard/forms",
      icon: SquareTerminal,
      isActive: pathname === "/dashboard/forms",
    },

    {
      title: "Settings",
      url: "/dashboard/settings",
      icon: Settings,
      isActive: pathname.startsWith("settings"),
    },
  ];

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <AppLogo />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
