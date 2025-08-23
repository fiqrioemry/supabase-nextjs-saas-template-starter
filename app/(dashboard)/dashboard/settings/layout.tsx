"use client";

import Link from "next/link";
import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { User, Settings, Palette } from "lucide-react";

export default function SettingsLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  const navigationItems = [
    {
      label: "Profile",
      route: "/dashboard/settings/profile",
      icon: User,
    },
    {
      label: "Preferences",
      route: "/dashboard/settings/preference",
      icon: Palette,
    },
    {
      label: "Account",
      route: "/dashboard/settings/account",
      icon: Settings,
    },
  ];

  const isActive = (route: string): boolean => {
    if (route === "/dashboard/settings/profile") {
      return pathname === route;
    }
    return pathname.startsWith(route);
  };

  return (
    <section className="max-w-7xl w-full mx-auto py-8 px-4">
      {/* Navigation */}
      <nav className="flex gap-2 mb-6">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.route);

          return (
            <Button
              key={item.route}
              variant={active ? "default" : "ghost"}
              className="w-48"
              asChild
            >
              <Link href={item.route}>
                <Icon />
                {item.label}
              </Link>
            </Button>
          );
        })}
      </nav>

      {/* Content */}
      <div>{children}</div>
    </section>
  );
}
