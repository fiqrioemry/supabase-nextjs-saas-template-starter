"use client";

import React from "react";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { User } from "@supabase/supabase-js";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Construction, LogOut, User2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function UserDropdown({ user }: { user: User }) {
  const pathname = usePathname();

  const data = user.user_metadata;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 focus:outline-none">
          <Avatar className="h-8 w-8 rounded-lg">
            <AvatarImage src={data.avatar_url} alt={data.display_name} />
            <AvatarFallback className="rounded-lg">
              {data.display_name?.charAt(0)}
            </AvatarFallback>
          </Avatar>
          {pathname.startsWith("/dashboard") && (
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">{data.display_name}</span>
              <span className="truncate text-xs">{data.email}</span>
            </div>
          )}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
        align="end"
        sideOffset={4}
      >
        <DropdownMenuLabel className="p-0 font-normal">
          <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
            <Avatar className="h-8 w-8 rounded-lg">
              <AvatarImage
                src={data.avatar_url || undefined}
                alt={data.display_name}
              />
              <AvatarFallback className="rounded-lg">
                {data.display_name?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">{data.display_name}</span>
              <span className="truncate text-xs">{data.email}</span>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/dashboard">
            <User2 />
            <span>Dashboard</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <Button variant="ghost" className="w-full justify-start rounded-none">
          <LogOut />
          <span>Sign out</span>
        </Button>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
