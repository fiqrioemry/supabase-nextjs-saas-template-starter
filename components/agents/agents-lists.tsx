"use client";

import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";

import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import {
  MoreVertical,
  Copy,
  Settings,
  Trash2,
  MessageSquare,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CreateNewAgent } from "./create-new-agents";
import { DeleteAgent } from "./delete-agent";

export function AgentsLists({ agents }: { agents: Array<any> }) {
  const handleDuplicateAgent = () => {
    console.log("agent duplicated");
  };

  const handleDeleteAgent = () => {
    console.log("agent deleted");
  };

  return (
    <>
      <div className="flex flex-col gap-6">
        {agents.map((bot) => (
          <Card
            key={bot.id}
            className="hover:shadow-md transition-all duration-200"
          >
            <CardHeader className="flex flex-row items-start justify-between space-y-0">
              <div className="flex flex-col gap-1">
                <CardTitle className="text-lg font-semibold line-clamp-1">
                  {bot.name}
                </CardTitle>
                <CardDescription className="text-sm text-muted-foreground line-clamp-2">
                  {bot.description || "No description provided."}
                </CardDescription>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleDuplicateAgent}>
                    <Copy className="h-4 w-4 mr-2" />
                    Duplicate
                  </DropdownMenuItem>
                  <DeleteAgent id={bot.id} />
                </DropdownMenuContent>
              </DropdownMenu>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Status + Model */}
              <div className="flex items-center justify-between">
                <Badge
                  variant={bot.status === "active" ? "default" : "secondary"}
                >
                  {bot.status}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {bot.model}
                </span>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Conversations</p>
                  <p className="font-medium">{bot.conversations_count ?? 0}</p>
                </div>
              </div>

              {/* Last updated */}
              <div className="text-xs text-muted-foreground">
                Updated {bot.updated_at || "just now"}
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Link href={`/dashboard/agents/${bot.id}`} className="flex-1">
                  <Button className="w-full">
                    <Settings className="h-4 w-4 mr-2" />
                    Configure
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {agents.length === 0 && (
        <div className="text-center py-16">
          <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No bots yet</h3>
          <p className="text-sm text-muted-foreground mb-6">
            Create your first AI chatbot to get started.
          </p>
          <CreateNewAgent />
        </div>
      )}
    </>
  );
}
